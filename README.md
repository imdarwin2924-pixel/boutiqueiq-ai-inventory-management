# BoutiqueIQ

> **AI-Powered Clothing Inventory & Catalog Management Platform for Boutiques**

BoutiqueIQ is a full-stack inventory and catalog management platform designed for boutique owners to efficiently manage products, inventory, suppliers, customers, sales, and purchase operations while providing a foundation for AI-powered demand forecasting and inventory optimization.

---

# 📖 Overview

BoutiqueIQ is developed as a **Semester 5 Capstone Project**.

The platform helps boutique owners digitize their business operations through a centralized system for:

- Product management
- Category management
- Inventory management
- Supplier management
- Customer management
- Sales management
- Purchase management
- Stock transaction management
- Billing
- Reporting
- AI-powered business insights

The project follows a **Three-Tier Architecture** using:

- **Frontend:** React + TypeScript + Vite
- **Backend:** FastAPI
- **Database:** PostgreSQL
- **ORM:** SQLAlchemy
- **Authentication:** JWT + OAuth2
- **AI/ML:** Scikit-learn

---

# 🚀 Project Status

## Current Phase

🟢 **Phase 1 – Backend & Frontend Integration Hardening — Completed**

## Current Status

The core backend management modules have been implemented, integrated, authenticated, validated, and regression tested.

The React frontend foundation and API integration are also implemented and connected to the backend.

The project is now ready to proceed to **Phase 2 – Advanced Inventory & Stock Management**.

---

# ✅ Completed

## 📌 Planning & Design

- ✅ Problem Statement Finalized
- ✅ GitHub Repository Created
- ✅ Backend Project Initialized
- ✅ Frontend Project Initialized
- ✅ Project Folder Structure
- ✅ Functional Requirements
- ✅ Non-Functional Requirements
- ✅ Feature List
- ✅ User Flow
- ✅ Three-Tier System Architecture
- ✅ Database Design
- ✅ Entity Relationship (ER) Diagram
- ✅ Database Relationships
- ✅ Module Design
- ✅ Module Diagram

---

# ⚙️ Backend Foundation

- ✅ PostgreSQL Installation & Configuration
- ✅ pgAdmin Configuration
- ✅ SQLAlchemy ORM Integration
- ✅ Environment Configuration (`.env`)
- ✅ Database Connection
- ✅ Database Initialization
- ✅ Role Model
- ✅ User Model
- ✅ Roles Table
- ✅ Users Table

---

# 🔐 Authentication Module

- ✅ User Registration API
- ✅ User Login API
- ✅ JWT Token Generation
- ✅ JWT Authentication
- ✅ OAuth2 Password Flow
- ✅ Password Hashing (bcrypt)
- ✅ Protected Routes
- ✅ Current User API (`/auth/me`)
- ✅ Swagger Authorization
- ✅ Authentication Testing
- ✅ JWT-protected CRUD endpoints
- ✅ Frontend JWT token management
- ✅ Frontend protected routes

---

# 📂 Category Management Module

- ✅ Category Model
- ✅ Category Schema
- ✅ Category Service Layer
- ✅ Category CRUD APIs
- ✅ JWT Protected Endpoints
- ✅ PostgreSQL Categories Table
- ✅ Swagger CRUD Testing
- ✅ Duplicate category validation
- ✅ Safe deletion handling
- ✅ 404 resource validation
- ✅ 409 conflict handling

### Category APIs

- `POST /categories/`
- `GET /categories/`
- `GET /categories/{category_id}`
- `PUT /categories/{category_id}`
- `DELETE /categories/{category_id}`

---

# 👕 Product Management Module

- ✅ Product Model
- ✅ Product Schema
- ✅ Product Service Layer
- ✅ Product CRUD APIs
- ✅ Product–Category Relationship
- ✅ JWT Protected Endpoints
- ✅ PostgreSQL Products Table
- ✅ Swagger CRUD Testing
- ✅ SKU uniqueness validation
- ✅ Category foreign-key validation
- ✅ Safe deletion handling
- ✅ 404 resource validation
- ✅ 409 conflict handling

### Product APIs

- `POST /products/`
- `GET /products/`
- `GET /products/{product_id}`
- `PUT /products/{product_id}`
- `DELETE /products/{product_id}`

---

# 📦 Inventory Management Module

- ✅ Inventory Model
- ✅ Inventory Schema
- ✅ Inventory Service Layer
- ✅ Inventory CRUD APIs
- ✅ Product–Inventory Relationship
- ✅ JWT Protected Endpoints
- ✅ PostgreSQL Inventory Table
- ✅ Swagger CRUD Testing
- ✅ Product foreign-key validation
- ✅ Duplicate inventory validation
- ✅ Quantity validation
- ✅ Minimum stock validation
- ✅ Safe deletion handling
- ✅ 404 resource validation
- ✅ 409 conflict handling

### Inventory APIs

- `POST /inventory/`
- `GET /inventory/`
- `GET /inventory/{inventory_id}`
- `PUT /inventory/{inventory_id}`
- `DELETE /inventory/{inventory_id}`

---

# 🚚 Supplier Management Module

- ✅ Supplier Model
- ✅ Supplier Schema
- ✅ Supplier Service Layer
- ✅ Supplier CRUD APIs
- ✅ Supplier–Product Relationship
- ✅ Supplier–Purchase Order Relationship
- ✅ JWT Protected Endpoints
- ✅ PostgreSQL Suppliers Table
- ✅ Swagger CRUD Testing
- ✅ Supplier email uniqueness validation
- ✅ Foreign-key validation
- ✅ Safe deletion handling
- ✅ 404 resource validation
- ✅ 409 conflict handling

### Supplier APIs

- `POST /suppliers/`
- `GET /suppliers/`
- `GET /suppliers/{supplier_id}`
- `PUT /suppliers/{supplier_id}`
- `DELETE /suppliers/{supplier_id}`

---

# 👥 Customer Management Module

- ✅ Customer Model
- ✅ Customer Schema
- ✅ Customer Service Layer
- ✅ Customer CRUD APIs
- ✅ Customer Primary Key (`customer_id`)
- ✅ Customer–Sales Relationship
- ✅ JWT Protected Endpoints
- ✅ PostgreSQL Customers Table
- ✅ Swagger CRUD Testing
- ✅ Customer email validation
- ✅ Foreign-key validation
- ✅ Safe deletion handling
- ✅ 404 resource validation
- ✅ 409 conflict handling

### Customer APIs

- `POST /customers/`
- `GET /customers/`
- `GET /customers/{customer_id}`
- `PUT /customers/{customer_id}`
- `DELETE /customers/{customer_id}`

---

# 💰 Sales Management Module

- ✅ Sales Model
- ✅ Sales Schema
- ✅ Sales Service Layer
- ✅ Sales CRUD APIs
- ✅ Customer–Sales Relationship
- ✅ User–Sales Relationship
- ✅ JWT Protected Endpoints
- ✅ PostgreSQL Sales Table
- ✅ Invoice Number Uniqueness Validation
- ✅ Customer Foreign Key Validation
- ✅ Safe deletion handling
- ✅ Swagger CRUD Testing
- ✅ 400 Business Validation
- ✅ 404 Resource Validation
- ✅ 409 Conflict Handling

### Sales APIs

- `POST /sales/`
- `GET /sales/`
- `GET /sales/{sale_id}`
- `PUT /sales/{sale_id}`
- `DELETE /sales/{sale_id}`

---

# 🛒 Purchase Management Module

## Purchase Order Management

- ✅ Purchase Order Model
- ✅ Purchase Order Schema
- ✅ Purchase Order Service Layer
- ✅ Purchase Order CRUD APIs
- ✅ Supplier–Purchase Order Relationship
- ✅ User–Purchase Order Relationship
- ✅ Purchase Order Number Uniqueness Validation
- ✅ Supplier Foreign Key Validation
- ✅ JWT Protected Endpoints
- ✅ PostgreSQL Purchase Orders Table
- ✅ Swagger CRUD Testing
- ✅ Safe deletion handling
- ✅ 404 Resource Validation
- ✅ 409 Conflict Handling

### Purchase Order APIs

- `POST /purchase-orders/`
- `GET /purchase-orders/`
- `GET /purchase-orders/{purchase_order_id}`
- `PUT /purchase-orders/{purchase_order_id}`
- `DELETE /purchase-orders/{purchase_order_id}`

---

## Purchase Item Management

- ✅ Purchase Item Model
- ✅ Purchase Item Schema
- ✅ Purchase Item Service Layer
- ✅ Purchase Item CRUD APIs
- ✅ Purchase Order–Purchase Item Relationship
- ✅ Product–Purchase Item Relationship
- ✅ Foreign Key Validation
- ✅ Quantity Validation
- ✅ Unit Price Validation
- ✅ JWT Protected Endpoints
- ✅ PostgreSQL Purchase Items Table
- ✅ Swagger CRUD Testing
- ✅ Safe deletion handling

### Purchase Item APIs

- `POST /purchase-items/`
- `GET /purchase-items/`
- `GET /purchase-items/{purchase_item_id}`
- `PUT /purchase-items/{purchase_item_id}`
- `DELETE /purchase-items/{purchase_item_id}`

---

# 📊 Stock Transaction Management Module

The Stock Transaction module provides the foundation for advanced inventory movement and stock management.

- ✅ Stock Transaction Model
- ✅ Stock Transaction Schema
- ✅ Stock Transaction Service Layer
- ✅ Stock Transaction CRUD APIs
- ✅ Product–Stock Transaction Relationship
- ✅ Stock IN Management
- ✅ Stock OUT Management
- ✅ Inventory Quantity Integration
- ✅ Automatic Inventory Increase for Stock IN
- ✅ Automatic Inventory Decrease for Stock OUT
- ✅ Insufficient Stock Validation
- ✅ Invalid Transaction Type Validation
- ✅ Foreign Key Validation
- ✅ JWT Protected Endpoints
- ✅ PostgreSQL Stock Transactions Table
- ✅ Swagger CRUD Testing
- ✅ Inventory Integration Testing

### Stock Transaction APIs

- `POST /stock-transactions/`
- `GET /stock-transactions/`
- `GET /stock-transactions/{transaction_id}`
- `PUT /stock-transactions/{transaction_id}`
- `DELETE /stock-transactions/{transaction_id}`

---

# 🔗 Backend Integration & Validation

The backend modules have been integrated and tested across their database relationships.

## Integration Testing

- ✅ Product → Inventory
- ✅ Supplier → Purchase Order
- ✅ Purchase Order → Purchase Item
- ✅ Purchase Item → Product
- ✅ Product → Stock Transaction
- ✅ Stock Transaction → Inventory
- ✅ Customer → Sales
- ✅ User → Sales
- ✅ User → Purchase Order

## Validation

- ✅ JWT Authentication Validation
- ✅ Foreign Key Validation
- ✅ 404 Resource Validation
- ✅ 400 Business Rule Validation
- ✅ 409 Conflict Validation
- ✅ 422 Request Validation
- ✅ Duplicate Resource Validation
- ✅ Insufficient Stock Validation
- ✅ Invalid Stock Transaction Validation
- ✅ Safe Delete Validation

---

# 🔌 Frontend Integration

The React frontend foundation has been implemented and integrated with the FastAPI backend.

## Frontend Foundation

- ✅ React
- ✅ TypeScript
- ✅ Vite
- ✅ Axios API Client
- ✅ React Router
- ✅ JWT Token Management
- ✅ Authentication Context
- ✅ Protected Routes
- ✅ Login Page
- ✅ Dashboard Foundation
- ✅ Backend API Integration

## Frontend API Services

- ✅ Authentication Service
- ✅ Category API Service
- ✅ Product API Service
- ✅ Inventory API Service
- ✅ Supplier API Service
- ✅ Customer API Service
- ✅ Sales API Service
- ✅ Purchase Order API Service
- ✅ Purchase Item API Service
- ✅ Stock Transaction API Service

## Frontend Pages

- ✅ Dashboard
- ✅ Products
- ✅ Inventory
- ✅ Categories
- ✅ Suppliers
- ✅ Customers
- ✅ Sales
- ✅ Purchases

## Frontend Integration Validation

- ✅ Backend configuration reviewed
- ✅ CORS configured
- ✅ Frontend API base URL verified
- ✅ JWT authentication flow verified
- ✅ Protected API access verified
- ✅ API response handling verified
- ✅ API error handling verified
- ✅ Frontend navigation verified
- ✅ Production build verified
- ✅ Frontend regression testing completed

---

# 🧪 Phase 1 Regression Testing

Phase 1 regression testing verified the major backend and frontend workflows.

## Authentication

- ✅ Login
- ✅ JWT token generation
- ✅ Protected API access
- ✅ Unauthorized request handling

## CRUD Modules

- ✅ Categories
- ✅ Suppliers
- ✅ Customers
- ✅ Products
- ✅ Inventory
- ✅ Sales
- ✅ Purchase Orders
- ✅ Purchase Items

## Error Handling

- ✅ Duplicate records
- ✅ Invalid foreign keys
- ✅ Missing resources
- ✅ Invalid business rules
- ✅ Foreign-key deletion conflicts
- ✅ Database constraint handling

## Build Validation

- ✅ Frontend TypeScript compilation
- ✅ Vite production build
- ✅ Frontend route validation
- ✅ Backend startup validation
- ✅ Swagger API validation

---

# 🗄 Database Design

BoutiqueIQ uses **PostgreSQL** as the primary relational database.

## Current Database Tables

1. `roles`
2. `users`
3. `categories`
4. `products`
5. `inventory`
6. `suppliers`
7. `customers`
8. `sales`
9. `purchase_orders`
10. `purchase_items`
11. `stock_transactions`

---

# 🔗 Database Relationships

```text
ROLES
   │
   │ 1:N
   ▼
USERS
   │
   ├──────────────────────┐
   │                      │
   │ 1:N                  │ 1:N
   ▼                      ▼
SALES              PURCHASE_ORDERS
   │                      │
   │                      │ 1:N
   │                      ▼
   │               PURCHASE_ITEMS
   │                      │
   │                      │ N:1
   │                      ▼
   │                   PRODUCTS
   │                      │
   │              ┌───────┴────────┐
   │              │                │
   │              │ 1:1            │ 1:N
   │              ▼                ▼
   │          INVENTORY     STOCK_TRANSACTIONS
   │
   │
CUSTOMERS
   │
   │ 1:N
   ▼
SALES


CATEGORIES
   │
   │ 1:N
   ▼
PRODUCTS


SUPPLIERS
   │
   ├───────────────────┐
   │                   │
   │ 1:N               │ 1:N
   ▼                   ▼
PRODUCTS        PURCHASE_ORDERS


┌──────────────────────────────────────────────┐
│                  FRONTEND                    │
│                                              │
│        React + TypeScript + Vite             │
│        React Router + Axios                  │
│        Authentication Context                │
└──────────────────────┬───────────────────────┘
                       │
                       │ HTTP / REST API
                       ▼
┌──────────────────────────────────────────────┐
│                  BACKEND                     │
│                                              │
│                 FastAPI                      │
│                                              │
│  API Layer → Service Layer → Repository/ORM  │
│                                              │
│              JWT + OAuth2                    │
└──────────────────────┬───────────────────────┘
                       │
                       │ SQLAlchemy
                       ▼
┌──────────────────────────────────────────────┐
│                 DATABASE                     │
│                                              │
│                PostgreSQL                    │
│                                              │
│ Roles • Users • Products • Inventory         │
│ Suppliers • Customers • Sales                │
│ Purchase Orders • Purchase Items             │
│ Stock Transactions                           │
└──────────────────────────────────────────────┘


🛠 Technology Stack
Layer	Technology
Frontend	React
Language	TypeScript
Build Tool	Vite
Routing	React Router
HTTP Client	Axios
Backend	FastAPI
Programming Language	Python
ORM	SQLAlchemy
Database	PostgreSQL
Authentication	JWT
Authentication Flow	OAuth2 Password Flow
Password Hashing	bcrypt
API Documentation	Swagger / OpenAPI
AI/ML	Scikit-learn
Version Control	Git
Repository	GitHub

🌐 Local Development URLs
Backend
http://127.0.0.1:8000
Swagger API Documentation
http://127.0.0.1:8000/docs
Health Check
http://127.0.0.1:8000/health
Frontend
http://localhost:5173


▶️ Running the Project
Backend
cd F:\BOUTIQUEIQ\backend
uvicorn app.main:app --reload
Frontend

Open another terminal:

cd F:\BOUTIQUEIQ\frontend
npm run dev
Frontend Production Build
cd F:\BOUTIQUEIQ\frontend
npm run build


BOUTIQUEIQ/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── database/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── schemas/
│   │   └── services/
│   │
│   ├── .env
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── package.json
│   └── vite.config.ts
│
├── docs/
│   └── api/
│       └── frontend_api.md
│
└── README.md



📅 Development Progress
Day	Status
Day 1	✅ Project Initialization
Day 2	✅ Project Setup
Day 3	✅ Planning Documents
Day 4	✅ System Architecture
Day 5	✅ Database Design
Day 6	✅ Module Design
Day 7	✅ Backend Foundation
Day 8	✅ Authentication
Day 9	✅ Category Management
Day 10	✅ Product Management
Day 11	✅ Inventory Management
Day 12	✅ Supplier Management
Day 13	✅ Customer Management
Day 14	✅ Sales Management
Day 15	✅ Purchase Management
Day 16	✅ Stock Transaction Management
Day 17	✅ Backend Integration & Validation
Day 18	✅ Frontend API Preparation
Day 19	✅ Frontend Integration
Day 20	✅ Phase 1 Hardening
Day 21	✅ Phase 1 Regression Testing

📊 Current Progress
Module	Status
Planning & Design	✅ Completed
Backend Foundation	✅ Completed
Authentication	✅ Completed
Category Management	✅ Completed
Product Management	✅ Completed
Inventory Management	✅ Completed
Supplier Management	✅ Completed
Customer Management	✅ Completed
Sales Management	✅ Completed
Purchase Order Management	✅ Completed
Purchase Item Management	✅ Completed
Stock Transaction Management	✅ Completed
Backend Integration	✅ Completed
Backend Validation	✅ Completed
Frontend API Integration	✅ Completed
Frontend Authentication	✅ Completed
Frontend CRUD Pages	✅ Completed
Phase 1 Hardening	✅ Completed
Phase 1 Regression Testing	✅ Completed
Dashboard Enhancements	⏳ Planned
Advanced Stock Management	⏳ Phase 2
Reports & Analytics	⏳ Planned
AI Demand Forecasting	⏳ Planned
Inventory Optimization	⏳ Planned
Cloud Deployment	⏳ Planned