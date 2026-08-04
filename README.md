# BoutiqueIQ

> **AI-Powered Clothing Inventory & Catalog Management Platform for Boutiques**

A full-stack cloud-based inventory and catalog management platform that enables boutique owners to manage products, inventory, suppliers, customers, sales, and purchase orders while leveraging Artificial Intelligence (AI) for demand forecasting and inventory optimization.

---

# 📖 Overview

BoutiqueIQ is developed as a **Semester 5 Capstone Project**. The application helps boutique owners digitize their daily business operations by providing a centralized platform for inventory tracking, product management, supplier management, customer management, sales processing, reporting, and AI-powered business insights.

The project follows a **Three-Tier Architecture** using **React + TypeScript** for the frontend, **FastAPI** for the backend, **PostgreSQL** as the relational database, and **Scikit-learn** for AI-powered demand forecasting.

---

# 🚀 Project Status

### Current Phase

🟢 **Phase 2 – Backend Development**

### Completed

#### 📌 Planning & Design
- ✅ Problem Statement Finalized
- ✅ GitHub Repository Created
- ✅ Backend Project Initialized (FastAPI)
- ✅ Frontend Project Initialized (React + Vite + TypeScript)
- ✅ Project Folder Structure
- ✅ Functional Requirements
- ✅ Non-Functional Requirements
- ✅ Feature List
- ✅ User Flow
- ✅ System Architecture
- ✅ Database Design
- ✅ Entity Relationship (ER) Diagram
- ✅ Module Design
- ✅ Module Diagram

#### ⚙️ Backend Foundation
- ✅ PostgreSQL Installed & Configured
- ✅ pgAdmin Configured
- ✅ SQLAlchemy Integration
- ✅ Database Connection
- ✅ Database Initialization
- ✅ Role Model
- ✅ User Model
- ✅ Roles & Users Tables Created

#### 🔐 Authentication Module
- ✅ User Registration API
- ✅ User Login API
- ✅ Password Hashing (bcrypt)
- ✅ JWT Token Generation
- ✅ JWT Authentication
- ✅ Protected Routes
- ✅ Swagger Authorization
- ✅ User Profile Endpoint (`/auth/me`)

### Upcoming

- ⏳ Category Management
- ⏳ Product Management
- ⏳ Inventory Management
- ⏳ Supplier Management
- ⏳ Customer Management
- ⏳ Sales Management
- ⏳ AI Demand Forecasting
- ⏳ Reports & Dashboard
- ⏳ React Frontend Integration
- ⏳ Cloud Deployment

---

# 🛠 Tech Stack

| Layer | Technology |
|--------|------------|
| Frontend | React.js + TypeScript + Vite |
| Backend | FastAPI |
| ORM | SQLAlchemy |
| Database | PostgreSQL |
| Authentication | JWT + OAuth2 |
| API Documentation | Swagger UI (OpenAPI) |
| AI | Scikit-learn |
| Deployment | Vercel, Render, Railway PostgreSQL |

---

# ✨ Implemented Features

## Authentication ✅

- User Registration
- User Login
- JWT Authentication
- Protected API Endpoints
- Password Hashing (bcrypt)
- OAuth2 Integration
- Swagger Authorization

---

# 🚧 Upcoming Features

## Dashboard
- Business Overview
- Revenue Summary
- Low Stock Alerts
- AI Insights

## Category Management
- Create Category
- Update Category
- Delete Category
- View Categories

## Product Management
- Product Catalog
- Product Images
- SKU Management
- Category Assignment

## Inventory Management
- Stock In
- Stock Out
- Inventory Tracking
- Stock Transactions

## Supplier Management
- Supplier Records
- Purchase Orders

## Customer Management
- Customer Records
- Purchase History

## Sales Management
- Sales Invoice
- Billing
- Returns
- Sales History

## Reports
- Sales Report
- Inventory Report
- Purchase Report
- Revenue Report

## Artificial Intelligence
- Demand Forecasting
- Inventory Optimization
- Stock Recommendation

---

# 🏗 System Architecture

The BoutiqueIQ platform follows a **Three-Tier Architecture**.

### Layers

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

Current Database Modules

- Authentication
- Inventory
- Sales
- Purchasing
- AI Forecasting
- Notifications

ER Diagram

```text
docs/diagrams/er-diagram.png
```

---

# 🧩 Module Design

Current Modules

- Authentication ✅
- Dashboard
- Product Management
- Category Management
- Inventory Management
- Supplier Management
- Customer Management
- Sales Management
- AI Prediction
- Reports

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
|-----|--------|
| Day 1 | ✅ Project Initialization |
| Day 2 | ✅ Project Setup |
| Day 3 | ✅ Planning Documents |
| Day 4 | ✅ System Architecture |
| Day 5 | ✅ Database Design |
| Day 6 | ✅ Documentation |
| Day 7 | ✅ Backend Foundation |
| Day 8 | ✅ Authentication Module |

---

# 📊 Current Progress

| Module | Status |
|---------|--------|
| Planning & Design | ✅ 100% |
| Backend Foundation | ✅ 100% |
| Authentication | ✅ 100% |
| Category Module | ⏳ Planned |
| Product Module | ⏳ Planned |
| Inventory Module | ⏳ Planned |
| Frontend Integration | ⏳ Planned |
| AI Module | ⏳ Planned |

---

# 🎯 Project Objectives

- Digitize boutique inventory management.
- Simplify product and supplier management.
- Improve inventory accuracy.
- Generate business reports.
- Predict future product demand using AI.
- Optimize inventory levels using machine learning.

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

Semester 5 Capstone Project

---

# 📄 License

This project is licensed under the MIT License.