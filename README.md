# 🌾 AgriReson — Farm Marketplace & Profit Tracker

A modern, production-ready full-stack agricultural e-commerce platform and financial management system connecting **Farmers**, **Buyers**, and **Admins**.

The platform allows cultivators to eliminate middlemen by selling produce directly to consumers, log all farm inputs (seeds, fertilizer, labour, irrigation), and track their **real-time net profit and loss margins**.

---

## 🏗️ System Architecture

```
                    ┌──────────────────────────┐
                    │        USERS             │
                    │                          │
                    │  👨🌾 Farmer  🛒 Buyer   │
                    │        👨💼 Admin          │
                    └────────────┬─────────────┘
                                 │
                                 ▼
              ┌─────────────────────────────────┐
              │      REACT.JS + VITE FRONTEND   │
              │                                 │
              │ • Login & Registration          │
              │ • Produce Catalog & Filter      │
              │ • Shopping Cart & Checkout      │
              │ • Buyer Order Tracking          │
              │ • Farmer Control Center         │
              │ • Produce Inventory CRUD        │
              │ • Farm Expense Management       │
              │ • Profit & Loss Dashboard       │
              │ • Admin Marketplace Oversight   │
              └───────────────┬─────────────────┘
                              │
                    REST API / JSON (JWT)
                              │
                              ▼
              ┌─────────────────────────────────┐
              │     SPRING BOOT 3.3.4 BACKEND   │
              │                                 │
              │ • Controller Layer              │
              │ • Service Layer                 │
              │ • Repository Layer (Spring Data)│
              │ • Spring Security 6 + JWT       │
              │ • Financial Calculation Engine  │
              └───────────────┬─────────────────┘
                              │
                              ▼
              ┌─────────────────────────────────┐
              │            DATABASE             │
              │                                 │
              │ • Default: H2 (MySQL Mode)      │
              │ • Production: MySQL 8.0 / 9.7   │
              │   (users, categories, crops,    │
              │    products, orders, expenses)  │
              └─────────────────────────────────┘
```

---

## 💰 Real-Time Profit Calculation Engine

The platform tracks agricultural financial performance with automated formula validation:

$$\text{Net Realized Profit} = \text{Total Sales Revenue} - \text{Total Input Expenses}$$

$$\text{Profit Margin \%} = \left(\frac{\text{Net Profit}}{\text{Total Revenue}}\right) \times 100$$

### Verified Example (From Prompt Specification):
- **Expenses**:
  - Seeds: ₹2,000
  - Fertilizer: ₹3,000
  - Pesticides: ₹1,500
  - Labour: ₹5,000
  - Irrigation: ₹1,000
  - **Total Expenses = ₹12,500**
- **Sales Revenue**:
  - Tomato Sales: ₹20,000 (500 kg @ ₹40/kg)
  - Onion Sales: ₹8,000 (250 kg @ ₹32/kg)
  - **Total Sales Revenue = ₹28,000**
- **Calculation**:
  $$\text{Profit} = ₹28,000 - ₹12,500 = ₹15,500 \quad (55.36\% \text{ Margin})$$

---

## 🔑 Demo Accounts (Pre-Seeded)

The database automatically seeds these accounts on first startup:

| Role | Email | Password | Features Accessible |
|---|---|---|---|
| **👨🌾 Farmer** | `farmer@farmmarket.com` | `farmer123` | Add/Edit Produce, Log Expenses, Profit & Loss Dashboard, Manage Orders |
| **🛒 Buyer** | `buyer@farmmarket.com` | `buyer123` | Browse Marketplace, Cart, Checkout, Order Tracking |
| **👨💼 Admin** | `admin@farmmarket.com` | `admin123` | Marketplace Analytics, User Management, Category Manager |

*(Quick one-click login buttons are also provided on the Login page).*

---

## 🚀 Getting Started

### Prerequisites
- **Java 21 or Java 25**
- **Maven 3.8+**
- **Node.js 18+ and npm**
- *(Optional)* MySQL Server 8.0 / 9.7

---

### Step 1: Start the Spring Boot Backend

```powershell
cd "E:\AgriReson Ai\backend"

# Option A: Run with default In-Memory H2 Database (Instant zero-friction run)
mvn spring-boot:run

# Option B: Run with local MySQL Server
# Ensure MySQL is running on port 3306, then run:
mvn spring-boot:run -Dspring-boot.run.profiles=mysql
```

- Backend API: `http://localhost:8080`
- H2 Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:farmmarketdb`, User: `sa`, Password: *(empty)*)

---

### Step 2: Start the React Frontend

Open a second terminal window:

```powershell
cd "E:\AgriReson Ai\frontend"
npm run dev
```

- Open your browser at: `http://localhost:5173`

---

## 📡 REST API Summary

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register new Farmer or Buyer
- `POST /api/auth/login` — Authenticate and receive JWT Bearer token
- `GET /api/auth/me` — Retrieve current authenticated user profile

### Produce Catalog (`/api/products`)
- `GET /api/products` — Filter by category, keyword, min/max price
- `GET /api/products/{id}` — Produce details
- `GET /api/products/farmer` — Cultivator's own products
- `POST /api/products` — Add new product listing *(Farmer/Admin)*
- `PUT /api/products/{id}` — Update listing *(Farmer/Admin)*
- `DELETE /api/products/{id}` — Delete listing *(Farmer/Admin)*
- `PATCH /api/products/{id}/stock` — Fast stock adjustment *(Farmer/Admin)*

### Orders (`/api/orders`)
- `POST /api/orders` — Place order with atomic stock deduction *(Buyer/Admin)*
- `GET /api/orders/my-orders` — Customer purchase history *(Buyer/Admin)*
- `GET /api/orders/farmer-orders` — Farmer view of sold items *(Farmer/Admin)*
- `PATCH /api/orders/{id}/status` — Status workflow (Pending → Confirmed → Shipped → Delivered)

### Expenses (`/api/expenses`)
- `GET /api/expenses` — Logged farm operational costs *(Farmer/Admin)*
- `POST /api/expenses` — Record input cost (Seeds, Fertilizer, Labour, Irrigation, etc.)
- `DELETE /api/expenses/{id}` — Remove expense record

### Profit Analytics (`/api/farmer/dashboard`)
- `GET /api/farmer/dashboard/profit` — Net Profit, revenue, expenses, margin, expense distribution & crop profits
- `GET /api/admin/dashboard/stats` — Platform GMV, user counts, order volumes

---

## 🧪 Running Automated Tests

```powershell
cd "E:\AgriReson Ai\backend"
mvn test
```

Verifies:
1. Spring ApplicationContext and database schema bootstrap.
2. Verified ₹15,500 profit equation test case matching Section 4.
3. User authentication & JWT issuance.
4. Product search & keyword filtering.
5. Order checkout with live stock deduction & profit recalculation.