# BoutiqueIQ

> **AI-Powered Clothing Inventory & Catalog Management Platform for Boutiques**

BoutiqueIQ is a full-stack cloud-based inventory and catalog management platform designed for boutique owners to efficiently manage products, inventory, suppliers, customers, sales, and purchase orders while leveraging Artificial Intelligence (AI) for demand forecasting and inventory optimization.

---

# 📖 Overview

BoutiqueIQ is developed as a **Semester 5 Capstone Project**.

The platform helps boutique owners digitize their business operations by providing a centralized system for inventory tracking, product management, supplier management, customer management, billing, reporting, and AI-powered business insights.

The project follows a **Three-Tier Architecture** using:

- **Frontend:** React + TypeScript + Vite
- **Backend:** FastAPI
- **Database:** PostgreSQL
- **ORM:** SQLAlchemy
- **Authentication:** JWT + OAuth2
- **AI:** Scikit-learn

---

# 🚀 Project Status

### Current Phase

🟢 **Phase 2 – Backend Development**

---

# ✅ Completed

## 📌 Planning & Design

- ✅ Problem Statement Finalized
- ✅ GitHub Repository Created
- ✅ Backend Project Initialized (FastAPI)
- ✅ Frontend Project Initialized (React + Vite + TypeScript)
- ✅ Project Folder Structure
- ✅ Functional Requirements
- ✅ Non-Functional Requirements
- ✅ Feature List
- ✅ User Flow
- ✅ Three-Tier System Architecture
- ✅ Database Design
- ✅ Entity Relationship (ER) Diagram
- ✅ Module Design
- ✅ Module Diagram

---

## ⚙️ Backend Foundation

- ✅ PostgreSQL Installation & Configuration
- ✅ pgAdmin Configuration
- ✅ SQLAlchemy ORM Integration
- ✅ Environment Configuration (.env)
- ✅ Database Connection
- ✅ Database Initialization
- ✅ Role Model
- ✅ User Model
- ✅ Roles Table
- ✅ Users Table

---

## 🔐 Authentication Module

- ✅ User Registration API
- ✅ User Login API
- ✅ JWT Token Generation
- ✅ JWT Authentication
- ✅ OAuth2 Password Flow
- ✅ Password Hashing (bcrypt)
- ✅ Protected Routes
- ✅ Current User API (`/auth/me`)
- ✅ Swagger Authorization

---

## 📂 Category Management Module

- ✅ Category Model
- ✅ Category Schema
- ✅ Category Service Layer
- ✅ Category CRUD APIs
- ✅ JWT Protected Endpoints
- ✅ PostgreSQL Categories Table
- ✅ Swagger CRUD Testing

---

## 👕 Product Management Module

- ✅ Product Model
- ✅ Product Schema
- ✅ Product Service Layer
- ✅ Product CRUD APIs
- ✅ Product–Category Relationship
- ✅ JWT Protected Endpoints
- ✅ PostgreSQL Products Table
- ✅ Swagger CRUD Testing

---

# 🚧 Upcoming

- ⏳ Inventory Management
- ⏳ Supplier Management
- ⏳ Customer Management
- ⏳ Sales Management
- ⏳ Dashboard
- ⏳ Reports & Analytics
- ⏳ AI Demand Forecasting
- ⏳ React Frontend Development
- ⏳ Cloud Deployment

---

# 🛠 Tech Stack

| Layer | Technology |
|--------|------------|
| Frontend | React + TypeScript + Vite |
| Backend | FastAPI |
| ORM | SQLAlchemy |
| Database | PostgreSQL |
| Authentication | JWT + OAuth2 |
| API Documentation | Swagger UI (OpenAPI) |
| AI | Scikit-learn |
| Deployment | Vercel, Render, Railway PostgreSQL |

---

# ✨ Implemented Features

## 🔐 Authentication

- User Registration
- User Login
- JWT Authentication
- Protected API Endpoints
- Password Hashing
- OAuth2 Integration
- Swagger Authorization

---

## 📂 Category Management

- Create Category
- View Categories
- View Category by ID
- Update Category
- Delete Category

---

## 👕 Product Management

- Create Product
- View Products
- View Product by ID
- Update Product
- Delete Product
- Product–Category Relationship

---

# 🚧 Planned Features

## 📦 Inventory Management

- Stock In
- Stock Out
- Inventory Tracking
- Stock Transactions

---

## 🚚 Supplier Management

- Supplier Records
- Purchase Orders
- Supplier History

---

## 👥 Customer Management

- Customer Records
- Customer Purchase History

---

## 💰 Sales Management

- Sales Invoice
- Billing
- Returns
- Sales History

---

## 📊 Dashboard

- Revenue Summary
- Low Stock Alerts
- Business Overview
- AI Insights

---

## 📈 Reports

- Sales Reports
- Inventory Reports
- Purchase Reports
- Revenue Reports

---

## 🤖 Artificial Intelligence

- Demand Forecasting
- Inventory Optimization
- Sales Prediction
- Stock Recommendations

---

# 🏗 System Architecture

BoutiqueIQ follows a **Three-Tier Architecture**.

## Layers

- Presentation Layer (React + TypeScript)
- Application Layer (FastAPI)
- Data Layer (PostgreSQL)
- AI Layer (Scikit-learn)

Architecture Diagram

```text
docs/diagrams/system-architecture.png
```

---

# 🗄 Database Design

BoutiqueIQ uses **PostgreSQL** as the primary relational database.

### Current Database Tables

- Roles
- Users
- Categories
- Products

### Upcoming Tables

- Inventory
- Suppliers
- Customers
- Sales
- Purchase Orders

ER Diagram

```text
docs/diagrams/er-diagram.png
```

---

# 🧩 Module Design

## ✅ Implemented Modules

- Authentication
- Category Management
- Product Management

## 🚧 Upcoming Modules

- Inventory Management
- Supplier Management
- Customer Management
- Sales Management
- Dashboard
- Reports
- AI Prediction

Module Diagram

```text
docs/diagrams/module-diagram.png
```

---

# 📂 Project Structure

```text
BOUTIQUEIQ
│
├── backend
│   ├── app
│   │   ├── api
│   │   ├── core
│   │   ├── database
│   │   ├── middlewares
│   │   ├── models
│   │   ├── schemas
│   │   ├── services
│   │   ├── tests
│   │   └── utils
│   ├── .env
│   └── requirements.txt
│
├── frontend
│   ├── public
│   └── src
│       ├── assets
│       ├── components
│       ├── contexts
│       ├── hooks
│       ├── layouts
│       ├── pages
│       ├── routes
│       ├── services
│       ├── types
│       └── utils
│
├── docs
│   ├── api
│   ├── diagrams
│   ├── planning
│   └── reports
│
├── README.md
├── CHANGELOG.md
├── LICENSE
├── Problem_Statement.md
└── .gitignore
```

---

# 📅 Development Progress

| Day | Status |
|------|--------|
| Day 1 | ✅ Project Initialization |
| Day 2 | ✅ Project Setup |
| Day 3 | ✅ Planning Documents |
| Day 4 | ✅ System Architecture |
| Day 5 | ✅ Database Design |
| Day 6 | ✅ Documentation |
| Day 7 | ✅ Backend Foundation |
| Day 8 | ✅ Authentication Module |
| Day 9 | ✅ Category Management |
| Day 10 | ✅ Product Management |

---

# 📊 Current Progress

| Module | Status |
|---------|--------|
| Planning & Design | ✅ 100% |
| Backend Foundation | ✅ 100% |
| Authentication | ✅ 100% |
| Category Management | ✅ 100% |
| Product Management | ✅ 100% |
| Inventory Management | ⏳ Planned |
| Supplier Management | ⏳ Planned |
| Customer Management | ⏳ Planned |
| Sales Management | ⏳ Planned |
| Frontend Development | ⏳ Planned |
| AI Integration | ⏳ Planned |

---

# 🎯 Project Objectives

- Digitize boutique inventory management.
- Simplify product and supplier management.
- Improve inventory accuracy.
- Generate business reports.
- Predict future product demand using Artificial Intelligence.
- Optimize inventory levels using Machine Learning.

---

# 📌 Future Enhancements

- Barcode / QR Code Support
- Multi-Branch Boutique Management
- Mobile Application
- Cloud Storage Integration
- Email Notifications
- AI Sales Analytics
- Customer Loyalty Program

---

# 👨‍💻 Author

**DARWIN S**

**Semester 5 Capstone Project**

---

# 📄 License

This project is licensed under the **MIT License**.