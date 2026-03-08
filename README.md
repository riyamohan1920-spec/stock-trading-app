# Kite — MERN Stock Trading Platform

A full-stack stock trading simulation app built with the MERN stack (MongoDB, Express, React, Node.js), styled with TailwindCSS. Users can register, browse live-simulated stocks, buy/sell shares, track their portfolio, manage a watchlist, and view transaction history.

---

## Table of Contents

1. [Project Setup & Configuration](#1-project-setup--configuration)
2. [Backend Development](#2-backend-development)
3. [Database Development](#3-database-development)
4. [Frontend Development](#4-frontend-development)
5. [Project Execution](#5-project-execution)

---

## 1. Project Setup & Configuration

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | v18+ | Runtime for backend and frontend tooling |
| npm | v9+ | Package manager |
| MongoDB | v6+ | Database (running locally on port 27017) |

### Project Structure

```
stocktradingapp/
├── backend/                  # Node.js + Express API
│   ├── controllers/          # Route handler logic
│   ├── middleware/           # JWT auth middleware
│   ├── models/               # Mongoose schemas
│   ├── routes/               # Express routers
│   ├── seedStocks.js         # Data seed script
│   ├── server.js             # App entry point
│   └── .env                  # Environment variables
└── frontend/                 # React + Vite app
    ├── src/
    │   ├── components/       # Shared UI components
    │   ├── context/          # React Context (Auth, Stocks)
    │   ├── pages/            # Page-level components
    │   └── services/         # Axios API layer
    ├── tailwind.config.js
    └── vite.config.js
```

### Backend Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/stocktradingapp
JWT_SECRET=super_secret_jwt_key
```

### Frontend Environment Variables (optional)

Create `frontend/.env` if using a non-default API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

### Installing Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

## 2. Backend Development

Built with **Node.js** and **Express v5**, providing a RESTful API with JWT authentication.

### Tech Stack

- **Express v5** — Web framework
- **Mongoose v9** — MongoDB ODM
- **bcryptjs** — Password hashing
- **jsonwebtoken** — JWT generation and verification
- **dotenv** — Environment variable management
- **nodemon** — Dev server with auto-restart
- **cors** — Cross-origin resource sharing

### API Endpoints

#### Auth — `/api/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Create account, returns JWT |
| POST | `/login` | Public | Sign in, returns JWT |
| GET | `/me` | Private | Get current user profile |

#### Stocks — `/api/stocks`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/all` | Public | All stocks with simulated price drift |
| GET | `/:symbol` | Public | Single stock with 30-day price history |

#### Trade — `/api/trade`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/buy` | Private | Buy shares (deducts balance) |
| POST | `/sell` | Private | Sell shares (adds balance) |
| GET | `/history` | Private | User's transaction history |

#### Portfolio — `/api/portfolio`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Private | Holdings with current price, P&L |

#### Watchlist — `/api/watchlist`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Private | User's watchlist with prices |
| POST | `/` | Private | Add stock to watchlist |
| DELETE | `/:symbol` | Private | Remove from watchlist |

### JWT Authentication Middleware

All private routes use the `protect` middleware (`middleware/auth.js`) which:
1. Reads the `Authorization: Bearer <token>` header
2. Verifies the JWT with `JWT_SECRET`
3. Attaches the decoded user to `req.user`

### Mock Real-Time Prices

The `stockController.js` applies a small random price drift (`±0.5%`) on every request to `/api/stocks/all`, simulating live market data.

---

## 3. Database Development

### Database: MongoDB

- **Connection**: Local MongoDB on `mongodb://localhost:27017/stocktradingapp`
- **ODM**: Mongoose v9

### Schemas

#### User

```
name        String (required)
email       String (required, unique, lowercase)
password    String (required, min 6 chars, bcrypt hashed)
balance     Number (default: 100,000)
portfolio   [{ symbol, companyName, quantity, avgBuyPrice }]
watchlist   [String]  — array of stock symbols
```

> **Note:** Password hashing uses an `async` pre-save hook. In Mongoose v9, async hooks must NOT call `next()` — they rely on Promise resolution.

#### Stock

```
symbol          String (required, unique, uppercase)
companyName     String (required)
price           Number (required)
open, high, low Number
change          Number
changePercent   Number
volume          Number
marketCap       String
sector          String
description     String
priceHistory    [{ price, time }]
```

#### Transaction

```
userId       ObjectId (ref: User)
symbol       String
companyName  String
type         String  — 'BUY' | 'SELL'
quantity     Number
price        Number
total        Number
createdAt    Date (auto)
```

### Seeding the Database

The seed script (`backend/seedStocks.js`) inserts **20 real Indian stocks** (RELIANCE, TCS, INFY, HDFCBANK, etc.) with realistic prices, market caps, sectors, and descriptions:

```bash
cd backend
node seedStocks.js
# ✅ Seeded 20 stocks successfully!
```

---

## 4. Frontend Development

Built with **React 19** and **Vite 7**, styled with **TailwindCSS v3** and a custom dark-mode design system.

### Tech Stack

- **React 19** + **Vite 7** — UI and build tooling
- **React Router v6** — Client-side routing
- **Axios** — HTTP client with JWT interceptor
- **Chart.js** + **react-chartjs-2** — Price history charts
- **react-hot-toast** — Toast notifications
- **TailwindCSS v3** — Utility-first CSS with custom theme

### Custom Design System (`tailwind.config.js`)

| Token | Value | Usage |
|-------|-------|-------|
| `primary-500` | `#00b386` | Buttons, active nav, accents |
| `dark-100` | `#1e2130` | Cards, navbar |
| `dark-200` | `#181c2a` | Page background |
| `profit` | `#00c278` | Green for gains |
| `loss` | `#eb5757` | Red for losses |

### Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/login` | `Login.jsx` | JWT login form |
| `/register` | `Register.jsx` | New user registration |
| `/dashboard` | `Dashboard.jsx` | Balance, P&L, holdings summary, top gainers |
| `/market` | `Market.jsx` | Searchable stock list with live prices |
| `/stock/:symbol` | `StockDetail.jsx` | Chart, buy/sell modal, market data, holdings |
| `/portfolio` | `Portfolio.jsx` | Full holdings table with P&L |
| `/watchlist` | `Watchlist.jsx` | Watched stocks with current prices |
| `/transactions` | `Transactions.jsx` | Full trade history table |

### Key Components

- **`Navbar.jsx`** — Responsive nav showing user balance, links, logout
- **`ProtectedRoute.jsx`** — Redirects unauthenticated users to `/login`
- **`PriceChart.jsx`** — 30-day line chart with gradient fill using Chart.js
- **`StockCard.jsx`** — Card showing symbol, price, % change with color coding
- **`LoadingSpinner.jsx`** — Animated loading indicator

### Context / State Management

| Context | File | Purpose |
|---------|------|---------|
| `AuthContext` | `context/AuthContext.jsx` | User state, JWT, login/logout/register functions |
| `StockContext` | `context/StockContext.jsx` | Stock list cached globally, polled every 5 seconds |

### API Service Layer (`services/api.js`)

Axios instance with automatic JWT injection:

```js
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

---

## 5. Project Execution

### Step 1: Ensure MongoDB is Running

```bash
mongod
# Or via Windows Service: net start MongoDB
```

### Step 2: Seed the Database (first time only)

```bash
cd d:\stocktradingapp\backend
node seedStocks.js
```

Expected output:
```
MongoDB connected for seeding...
Cleared existing stocks
✅ Seeded 20 stocks successfully!
```

### Step 3: Start the Backend Server

```bash
cd d:\stocktradingapp\backend
npm run dev
```

Expected output:
```
🚀 Server running on http://localhost:5000
MongoDB connected: localhost
```

Health check: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### Step 4: Start the Frontend Dev Server

Open a **new terminal**:

```bash
cd d:\stocktradingapp\frontend
npm run dev
```

Expected output:
```
VITE v7.x.x  ready in 8300 ms
➜  Local:   http://localhost:5173/
```

### Step 5: Open the App

Navigate to **[http://localhost:5173](http://localhost:5173)**

### Test the App

1. **Register** — Create an account (starts with ₹1,00,000 balance)
2. **Market** — Browse 20 stocks with live simulated prices
3. **Stock Detail** — Click any stock to see the 30-day chart
4. **Buy** — Purchase shares; balance is deducted instantly
5. **Portfolio** — Track holdings and P&L
6. **Watchlist** — Star stocks to track them
7. **Sell** — Sell shares to realize gains/losses
8. **History** — View full transaction log

---

## Team Members

| Name | Role |
|------|------|
| Nikhil Kr Jha | Team Leader |
| Nandani Arora | Member |

---

## License

MIT License
