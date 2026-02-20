<div align="center">

# 🍽️ CanteenRush
</div>

## 📌 Problem Statement

University canteen breaks are **45 minutes long**. Students spend **15–25 minutes** standing in physical queues, leaving barely enough time to eat. Vendors are overwhelmed during rush hours with no way to prepare orders proactively.

**CanteenRush** transforms this by enabling students to place orders during class hours, using AI to predict exact pickup times, and synchronizing vendor preparation — **eliminating physical queues entirely**.

---

## 🚀 Features

### For Students 🎓

| Feature | Description |
|---------|-------------|
| **Pre-emptive Ordering** | Place orders during class, before your break starts |
| **AI Pickup Time** | Get exact ready time predicted by Gemini AI (±3 min accuracy) |
| **Multi-Vendor Browse** | Browse 5+ campus vendors, see live queue depth & avg prep time |
| **Real-Time Tracking** | Watch your order go from placed → confirmed → preparing → ready |
| **Token-Based Pickup** | Unique 8-char token — show at counter, grab food, zero waiting |
| **Order History** | View all past and active orders |
| **Push Notifications** | Browser notification when your order is ready |

### For Vendors 👨‍🍳

| Feature | Description |
|---------|-------------|
| **Live Queue Dashboard** | Real-time ordered queue with priority indicators |
| **Proactive Preparation** | Start cooking before students arrive |
| **One-Tap Status Updates** | Confirm → Prepare → Ready → Collected workflow |
| **Token Verification** | Scan/enter token to verify and collect orders |
| **Menu Manager** | Add/edit/toggle menu items with complexity & prep times |
| **AI Analytics** | Demand pattern analysis, prediction accuracy tracking |
| **Shop Toggle** | Open/close your shop with one tap |

### AI & Intelligence 🤖

| Feature | Description |
|---------|-------------|
| **Hybrid Prediction** | Combines deterministic rules + Gemini AI for accuracy |
| **Context-Aware** | Considers queue depth, vendor load, item complexity, rush hours |
| **Self-Improving** | Logs predicted vs actual times, feeds accuracy data back into prompts |
| **Demand Analysis** | AI identifies peak hours, recommends prep-ahead items |
| **Queue Optimization** | AI suggests optimal preparation sequence |
| **Graceful Fallback** | Works without AI — deterministic engine takes over if Gemini is unavailable |

---

#
---

## 🧰 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + TailwindCSS | UI with dark theme, responsive design |
| **Backend** | Node.js + Express.js | REST API + WebSocket server |
| **Database** | MongoDB + Mongoose | Data persistence with schemas |
| **AI** | Google Gemini API | Time prediction, demand analysis |
| **Real-Time** | Socket.io | Live order status updates |
| **Auth** | JWT + bcryptjs | Secure authentication |

---


---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** (local or [MongoDB Atlas](https://mongodb.com/atlas) free tier)
- **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/apikey) (free)

### 1. Clone the Repository

```bash
git clone https://github.com/ahanyamariam/CANTEEN-RUSH-AI.git
cd CANTEEN-RUSH-AI

npm install

cd backend
npm install

create backend/.env file and add the following:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/campusqueue
JWT_SECRET=your-secret-key-change-this-to-something-random
GEMINI_API_KEY=your-gemini-api-key-from-google-ai-studio
GEMINI_MODEL=gemini-2.0-flash-lite
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# macOS with Homebrew
brew services start mongodb-community

# Or use MongoDB Atlas (update MONGODB_URI in .env)


cd backend
npm run seed

This creates 5 vendors and 3 student test accounts.

# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend (from project root)
npm start


cd backend

# Test Gemini API connection
npm run test:gemini

# Simulate a full order with AI prediction
npm run simulate

# Load test with 5 concurrent orders
npm run loadtest


CanteenRush — Because your break time is too short to waste in a queue.

</div> ```