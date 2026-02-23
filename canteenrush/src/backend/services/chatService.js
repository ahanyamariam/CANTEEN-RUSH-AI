const { GoogleGenerativeAI } = require('@google/generative-ai');
const Vendor = require('../models/Vendor');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const predictionEngine = require('./predictionEngine');
const queueManager = require('./queueManager');

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

class ChatService {
  constructor() {
    this.model = genAI ? genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }) : null;
    this.sessions = new Map();
  }

  async handleMessage(userId, message) {
    let session = this.sessions.get(userId);
    if (!session) {
        session = { history: [], state: null, cart: [], vendorId: null };
    }

    let responseText = "I didn't understand that.";
    let options = [];
    const lowerMsg = message.toLowerCase();

    console.log(`\n💬 Chat: "${message}" | State: ${session.state}`);

    // ─── 1. HANDLE ID ACTIONS (Highest Priority) ─────────────
    
    // SELECTED A VENDOR -> SHOW MENU
    if (message.includes("VENDOR_ID:")) {
        const vendorId = message.split("VENDOR_ID:")[1].trim();
        
        let vendor;
        try { vendor = await Vendor.findById(vendorId); } catch(e){}

        if (vendor) {
            session.state = 'ORDERING';
            session.vendorId = vendor._id.toString();
            session.cart = [];
            responseText = `Ordering from ${vendor.shopName}. Add items:`;
            
            const menu = await MenuItem.find({ vendor: vendor._id, isAvailable: true });
            if (menu.length === 0) {
                responseText = "This vendor has no menu items.";
                session.state = null;
            } else {
                options = menu.map(m => ({ label: `+ ${m.name} (₹${m.price})`, action: `ADD_ITEM:${m._id}` }));
            }
        } else {
            responseText = "Vendor not found.";
            options = [{ label: 'List Vendors', action: 'list_vendors' }];
        }
    }

    // ADDED AN ITEM -> UPDATE CART
    else if (message.includes("ADD_ITEM:")) {
        const itemId = message.split('ADD_ITEM:')[1].trim();
        const item = await MenuItem.findById(itemId);

        if (item) {
            if (session.state !== 'ORDERING' || !session.vendorId) {
                session.state = 'ORDERING';
                session.vendorId = item.vendor.toString();
            }

            session.cart.push({ menuItem: item._id.toString(), quantity: 1 });
            responseText = `Added ${item.name}. Cart: ${session.cart.length} items.`;
            
            const menu = await MenuItem.find({ vendor: session.vendorId, isAvailable: true });
            options = menu.map(m => ({ label: `+ ${m.name} (₹${m.price})`, action: `ADD_ITEM:${m._id}` }));
            options.unshift({ label: '✅ Place Order', action: 'Place Order' });
        } else {
            responseText = "Item not found.";
        }
    }

    // ─── 2. HANDLE ORDERING STATE ────────────────────────────
    else if (session.state === 'ORDERING') {
        if (lowerMsg.includes('place order')) {
            if (session.cart.length === 0) {
                responseText = "Cart is empty.";
                session.state = null;
            } else {
                try {
                    const prediction = await predictionEngine.predictReadyTime({ items: session.cart }, session.vendorId);
                    
                    const menuItems = await MenuItem.find({ _id: { $in: session.cart.map(i => i.menuItem) } });
                    const total = session.cart.reduce((s, i) => {
                        const m = menuItems.find(x => x._id.toString() === i.menuItem);
                        return s + (m.price * i.quantity);
                    }, 0);

                    const order = await Order.create({
                        student: userId,
                        vendor: session.vendorId,
                        items: session.cart,
                        totalPrice: total,
                        predictedReadyTime: prediction.predictedReadyTime,
                        queuePosition: prediction.queuePosition,
                        prediction: { estimatedPrepMinutes: prediction.estimatedMinutes }
                    });

                    responseText = `✅ Order #${order.token} Placed! Ready at ${new Date(prediction.predictedReadyTime).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}`;
                    
                    session.state = null;
                    session.cart = [];
                    session.vendorId = null;
                    
                    // Send Navigation Action
                    options = [{ label: 'Track Order', action: 'navigate', url: '/student/orders' }];
                } catch (e) {
                    console.error(e);
                    responseText = "Error placing order.";
                }
            }
        } 
        else {
            session.state = null;
            responseText = "Cancelled ordering.";
            options = [{ label: 'List Vendors', action: 'list_vendors' }];
        }
    }

    // ─── 3. NATURAL LANGUAGE INTENTS ─────────────────────────
    
    // LIST VENDORS
    else if (lowerMsg.includes("list") || lowerMsg.includes("vendor")) {
        const vendors = await Vendor.find({ isOpen: true });
        responseText = "Select a vendor:";
        options = vendors.map(v => ({ 
            label: v.shopName, 
            action: `VENDOR_ID:${v._id}` 
        }));
    }

    // CANCEL ORDER
    else if (lowerMsg.includes("cancel")) {
        if (lowerMsg.includes("order id")) {
            const oid = message.split("ID")[1].trim();
            try {
                await queueManager.transitionOrder(oid, 'cancelled');
                responseText = "Order cancelled.";
            } catch(e) { responseText = "Failed to cancel."; }
        } else {
            const orders = await Order.find({ student: userId, status: { $in: ['placed','confirmed'] } })
                .populate('vendor');
            
            if (orders.length === 0) responseText = "No active orders.";
            else {
                responseText = "Tap to cancel:";
                options = orders.map(o => ({ 
                    label: `Cancel ${o.vendor.shopName}`, 
                    action: `Cancel order ID ${o._id}` 
                }));
            }
        }
    }

    // TRACK ORDER (NEW)
    else if (lowerMsg.includes("track")) {
        const activeOrders = await Order.find({ 
            student: userId, 
            status: { $in: ['placed', 'confirmed', 'preparing', 'ready'] } 
        }).populate('vendor');

        if (activeOrders.length === 0) {
            responseText = "You have no active orders.";
            options = [{ label: 'Browse Vendors', action: 'list_vendors' }];
        } else {
            responseText = "Your active orders:\n\n";
            activeOrders.forEach(o => {
                const statusEmoji = { placed: '⏳', confirmed: '👨‍🍳', preparing: '🍳', ready: '✅' };
                responseText += `${statusEmoji[o.status] || '📦'} ${o.vendor.shopName}: ${o.status.toUpperCase()} (Token: ${o.token})\n`;
            });
            options = [{ label: 'View Details', action: 'navigate', url: '/student/orders' }];
        }
    }

    // DEFAULT / GEMINI FALLBACK
    else {
        responseText = "I can help you order. Tap below:";
        options = [
            { label: 'List Vendors', action: 'list_vendors' },
            { label: 'Track Order', action: 'track_order' } // Maps to "track" intent
        ];
    }

    this.sessions.set(userId, session);
    return { text: responseText, options };
  }
}

module.exports = new ChatService();