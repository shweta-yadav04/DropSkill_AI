# DropSkill AI - Smart Ecommerce Platform

AI-powered ecommerce platform enabling sellers to instantly launch online stores with built-in supplier network and intelligent recommendations.

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- pip and npm

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python main.py
```
Backend runs on http://localhost:8000

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on http://localhost:5173

## 📁 Project Structure

```
DropShip/
├── backend/
│   ├── main.py           # FastAPI entry point
│   ├── config.py         # App configuration
│   ├── database.py       # SQLite/PostgreSQL setup
│   ├── auth.py           # JWT authentication
│   ├── schemas.py        # Pydantic models
│   ├── models/           # SQLAlchemy models
│   ├── routers/          # API endpoints
│   ├── ai/               # RAG engine & recommender
│   └── data/             # Sample product data
├── frontend/
│   ├── src/
│   │   ├── App.jsx       # Main app with routing
│   │   ├── pages/        # Page components
│   │   └── index.css     # Global styles
│   └── package.json
└── README.md
```

## 🔑 Features

### For Sellers
- **Instant Store Creation** - Launch a store in minutes
- **Product Catalog** - Browse and import from central inventory
- **Store Templates** - Choose from Modern, Minimal, or Bold themes
- **Shareable Storefront** - Unique URL for each store
- **AI Assistant** - Get product recommendations and business advice

### For Admins
- **Inventory Management** - Add/edit products
- **Platform Analytics** - Track users, stores, orders
- **Low Stock Alerts** - Automatic notifications

## 🛠 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Create seller account |
| POST | /api/auth/login | Get access token |
| GET | /api/stores/my | List seller's stores |
| POST | /api/stores | Create new store |
| GET | /api/products | Browse catalog |
| POST | /api/stores/{id}/products | Import product |
| GET | /api/stores/public/{slug} | Public storefront |
| POST | /api/ai/chat | AI assistant |
| POST | /api/ai/recommend | Product recommendations |

## 🎨 Store Templates

1. **Modern** - Clean gradient header, rounded cards, professional look
2. **Minimal** - Dark header, simple borders, elegant feel
3. **Bold** - Vibrant colors, large rounded corners, eye-catching

## 🤖 AI Features

- **Product Recommendations** - Suggests trending items based on demand scores
- **Pricing Advice** - Margin optimization tips
- **Marketing Tips** - Social media and promotional strategies
- **Store Insights** - Gap analysis and improvement suggestions

## 👤 Demo Credentials

```
Admin: admin@dropskill.ai / admin123
```

## 📊 Tech Stack

- **Backend**: FastAPI, SQLAlchemy, SQLite
- **Frontend**: React, Vite, Tailwind CSS
- **AI**: RAG with ChromaDB (vector store ready)
- **Auth**: JWT tokens




