<div align="center">

# 🍽️ CanteenRush

### AI-Powered Campus Canteen Pre-Ordering & Queue Elimination System

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Gemini AI](https://img.shields.io/badge/Google-Gemini_AI-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Real--Time-010101?logo=socket.io&logoColor=white)](https://socket.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

**Skip the queue. Order ahead. Pick up on time.**

[Features](#-features) · [Architecture](#-architecture) · [Setup](#-getting-started) · [API Reference](#-api-reference) · [AI Engine](#-ai-prediction-engine) · [Screenshots](#-screenshots)

---

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

## 🏗 Architecture
┌─────────────────────────────────────────────────────────────┐
│ REACT FRONTEND │
│ (Dark Theme · TailwindCSS · Socket.io Client) │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐ │
│ │ Student │ │ Vendor │ │ Auth │ │ Tracking │ │
│ │Dashboard │ │Dashboard │ │ Pages │ │ Pages │ │
│ └────┬─────┘ └────┬─────┘ └────┬─────┘ └─────┬─────┘ │
└────────┼──────────────┼──────────────┼──────────────┼────────┘
│ REST API │ WebSocket │ │
▼ ▼ ▼ ▼
┌─────────────────────────────────────────────────────────────┐
│ NODE.JS + EXPRESS BACKEND │
│ │
│ ┌──────────┐ ┌───────────────┐ ┌──────────────────────┐ │
│ │ Auth & │ │ Order Manager │ │ Queue Manager │ │
│ │ JWT │ │ (CRUD+State) │ │ (Priority+Sequence) │ │
│ └──────────┘ └───────┬───────┘ └──────────┬───────────┘ │
│ │ │ │
│ ┌────────▼─────────────────────▼─────────┐ │
│ │ PREDICTION ENGINE (Hybrid) │ │
│ │ ┌─────────────┐ ┌─────────────────┐ │ │
│ │ │Deterministic│ │ Gemini AI │ │ │
│ │ │ Fallback │ │ Enhancement │ │ │
│ │ │ (Always On) │ │ (When Available)│ │ │
│ │ └─────────────┘ └────────┬────────┘ │ │
│ └────────────────────────────┼───────────┘ │
│ │ │
│ ┌────────────────┐ ┌────────────────────▼───────────────┐ │
│ │ Socket.io │ │ Notification Service │ │
│ │ (Real-Time) │ │ (Order state → Student/Vendor) │ │
│ └────────────────┘ └────────────────────────────────────┘ │
│ │
└─────────┬──────────────────────────────┬─────────────────────┘
│ │
▼ ▼
┌──────────────┐ ┌──────────────────┐
│ MongoDB │ │ Google Gemini │
│ Database │ │ API (Free Tier) │
└──────────────┘ └──────────────────┘


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

🔑 Test Accounts
After running npm run seed:

Vendors
Email	Password	Shop
raj@vendor.com	password123	Raj's South Indian
vikram@vendor.com	password123	Sharma Ji's Chaat & Snacks
li@vendor.com	password123	Dragon Wok
priya@vendor.com	password123	Juice Junction
ahmed@vendor.com	password123	Biryani House (Closed)
Students
Email	Password
amit@student.com	password123
neha@student.com	password123
rohan@student.com	password123
Tip: Use two different browsers (or normal + incognito) to test student and vendor dashboards simultaneously.

🤖 AI Prediction Engine
How It Works
CanteenRush does not train a custom ML model. Instead, it uses Google Gemini API with rich contextual prompts that improve over time.

Student places order
        ↓
System gathers context:
  - Item complexity & base prep times
  - Current queue depth & vendor load
  - Time of day & rush hour status
  - Historical prediction accuracy (last 50 orders)
  - Recent completed order patterns
        ↓
┌─────────────────────────────┐
│   DETERMINISTIC ENGINE      │  ← Always runs (instant, free)
│   Rule-based calculation    │
│   Confidence: ~65%          │
└─────────────┬───────────────┘
              │
┌─────────────▼───────────────┐
│   GEMINI AI ENGINE          │  ← Runs when available
│   Context-aware prediction  │
│   Confidence: 70-90%        │
└─────────────┬───────────────┘
              │
┌─────────────▼───────────────┐
│   HYBRID BLEND              │
│   Weighted by confidence    │
│   & vendor accuracy score   │
│   Final estimate: ±3 min    │
└─────────────────────────────┘
        ↓
Student gets: "Ready at 12:47 PM"
        ↓
Order is completed → actual time logged
        ↓
PredictionLog stores: predicted vs actual
        ↓
NEXT prediction includes this history
(Gemini self-corrects over time)

cd backend

# Test Gemini API connection
npm run test:gemini

# Simulate a full order with AI prediction
npm run simulate

# Load test with 5 concurrent orders
npm run loadtest

📡 API Reference

Authentication
Method	Endpoint	Description	Auth
POST	/api/auth/register	Register student/vendor	No
POST	/api/auth/login	Login, get JWT token	No
GET	/api/auth/me	Get current user	Yes
Vendors
Method	Endpoint	Description	Auth
GET	/api/vendors	List open vendors	No
GET	/api/vendors/all	List all vendors	No
GET	/api/vendors/:id	Vendor details + live load	No
PATCH	/api/vendors/toggle-status	Toggle open/closed	Vendor
PATCH	/api/vendors/settings	Update vendor settings	Vendor

Menu
Method	Endpoint	Description	Auth
GET	/api/menu/vendor/:vendorId	Get vendor's menu	No
POST	/api/menu	Add menu item	Vendor
PATCH	/api/menu/:id	Update menu item	Vendor
PATCH	/api/menu/:id/toggle	Toggle availability	Vendor
Orders
Method	Endpoint	Description	Auth
POST	/api/orders	Place order (triggers AI)	Student
GET	/api/orders/active	Student's active orders	Student
GET	/api/orders/my	Student's order history	Student
GET	/api/orders/track/:token	Track by token	No
POST	/api/orders/:id/cancel	Cancel order	Student
GET	/api/orders/vendor/queue	Vendor's live queue	Vendor
PATCH	/api/orders/:id/status	Update order status	Vendor
POST	/api/orders/collect/:token	Collect by token	Vendor
GET	/api/orders/vendor/history	Order history + stats	Vendor

AI & Predictions
Method	Endpoint	Description	Auth
GET	/api/predictions/accuracy/:vendorId	Prediction accuracy stats	Yes
GET	/api/predictions/demand-analysis	AI demand pattern analysis	Vendor
GET	/api/predictions/ai-status	Gemini API status	Yes
GET	/api/predictions/logs/:vendorId	Raw prediction logs	Yes

WebSocket Events
Event	Direction	Description
order:new	Server → Vendor	New order placed
order:updated	Server → Student	Order status changed
order:ready	Server → Student	Order ready for pickup
order:preparing	Server → Student	Order being prepared
queue:updated	Server → Vendor	Queue state changed

🔄 Order State Machine
placed ──→ confirmed ──→ preparing ──→ ready ──→ collected
  │            │              │
  └──→ cancelled ←────────────┘
  <div align="center">
Built with ❤️ for campus life

CanteenRush — Because your break time is too short to waste in a queue.

</div> ```