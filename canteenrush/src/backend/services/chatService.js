const { GoogleGenerativeAI } = require('@google/generative-ai');
const Vendor = require('../models/Vendor');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const predictionEngine = require('./predictionEngine');
const queueManager = require('./queueManager');

// Fallback if no key (prevents crash)
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

class ChatService {
  constructor() {
    this.model = genAI ? genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }) : null;
    this.sessions = new Map();
  }

  async handleMessage(userId, message) {
    // Init session if needed
    let session = this.sessions.get(userId);
    if (!session) {
        session = { history: [], state: null, cart: [], vendorId: null };
    }

    let responseText = "I didn't understand that.";
    let options = [];
    const lowerMsg = message.toLowerCase();

    console.log(`\n💬 Chat: "${message}" | State: ${session.state}`);

    // ─── STATE: ORDERING ─────────────────────────────────────
    if (session.state === 'ORDERING') {
        if (lowerMsg.includes('place order')) {
            if (session.cart.length === 0) {
                responseText = "Cart is empty.";
                session.state = null;
            } else {
                try {
                    const prediction = await predictionEngine.predictReadyTime({ items: session.cart }, session.vendorId);
                    
                    // Calc total
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
                    
                    // Reset
                    session.state = null;
                    session.cart = [];
                    session.vendorId = null;
                } catch (e) {
                    console.error(e);
                    responseText = "Error placing order.";
                }
            }
        } 
        // Add Item Logic
        else if (lowerMsg.startsWith('add ')) {
            const itemName = message.substring(4).trim(); // Remove "Add "
            const menu = await MenuItem.find({ vendor: session.vendorId });
            
            // Loose match
            const item = menu.find(m => m.name.toLowerCase().includes(itemName.toLowerCase()));

            if (item) {
                session.cart.push({ menuItem: item._id.toString(), quantity: 1 });
                responseText = `Added ${item.name}. Cart: ${session.cart.length} items.`;
                
                // Show Menu Again
                options = menu.map(m => ({ label: `+ ${m.name} (₹${m.price})`, action: `Add ${m.name}` }));
                options.unshift({ label: '✅ Place Order', action: 'Place Order' });
            } else {
                responseText = "Item not found. Please click an option:";
                options = menu.map(m => ({ label: `+ ${m.name}`, action: `Add ${m.name}` }));
            }
        }
        else {
            // Cancel ordering flow
            session.state = null;
            session.cart = [];
            responseText = "Cancelled ordering. What else can I do?";
            options = [{ label: 'List Vendors', action: 'list_vendors' }];
        }
    }

    // ─── INTENT: LIST VENDORS ────────────────────────────────
    else if (lowerMsg.includes("list") || lowerMsg.includes("vendor")) {
        const vendors = await Vendor.find({ isOpen: true });
        responseText = "Select a vendor:";
        options = vendors.map(v => ({ 
            label: v.shopName, 
            action: `Menu for ${v.shopName}` // Match next intent
        }));
    }

    // ─── INTENT: SHOW MENU (Improved Matching) ──────────────
    else if (lowerMsg.includes("menu for")) {
        // Extract the name precisely: "Menu for Raj's South Indian" -> "Raj's South Indian"
        let targetName = message.substring(message.toLowerCase().indexOf("menu for") + 8).trim();
        
        console.log(`🔎 Searching vendor: "${targetName}"`);

        // 1. Try Exact Match (Case Insensitive)
        let vendor = await Vendor.findOne({ shopName: { $regex: `^${targetName}$`, $options: 'i' } });

        // 2. Try Fuzzy Match if Exact Fails
        if (!vendor) {
             // Replace ' with . to handle smart quotes or typos
             vendor = await Vendor.findOne({ shopName: { $regex: targetName.replace(/['’]/g, "."), $options: 'i' } });
        }

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
                options = menu.map(m => ({ label: `+ ${m.name} (₹${m.price})`, action: `Add ${m.name}` }));
            }
        } else {
            responseText = `Vendor "${targetName}" not found. Try these:`;
            const vendors = await Vendor.find({ isOpen: true });
            options = vendors.map(v => ({ label: v.shopName, action: `Menu for ${v.shopName}` }));
        }
    }

    // ─── INTENT: CANCEL ORDER ────────────────────────────────
    else if (lowerMsg.includes("cancel")) {
        if (lowerMsg.includes("order id")) {
            // Perform cancel
            const oid = message.split("ID")[1].trim();
            try {
                await queueManager.transitionOrder(oid, 'cancelled');
                responseText = "Order cancelled.";
            } catch(e) { responseText = "Failed to cancel."; }
        } else {
            // List orders to cancel
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

    // ─── DEFAULT ─────────────────────────────────────────────
    else {
        responseText = "I can help you order. Tap below:";
        options = [{ label: 'List Vendors', action: 'list_vendors' }];
    }

    this.sessions.set(userId, session);
    return { text: responseText, options };
  }
}

module.exports = new ChatService();