# BoutiqueIQ

> **AI-Powered Clothing Inventory & Catalog Management Platform for Boutiques**

BoutiqueIQ is a full-stack inventory and catalog management platform designed for boutique owners to efficiently manage products, inventory, suppliers, customers, sales, and purchase operations while leveraging Artificial Intelligence (AI) for demand forecasting and inventory optimization.

---

# 📖 Overview

BoutiqueIQ is developed as a **Semester 5 Capstone Project**.

The platform helps boutique owners digitize their business operations by providing a centralized system for:

- Product management
- Category management
- Inventory management
- Supplier management
- Customer management
- Sales management
- Billing
- Reporting
- AI-powered business insights

The project follows a **Three-Tier Architecture** using:

- **Frontend:** React + TypeScript + Vite
- **Backend:** FastAPI
- **Database:** PostgreSQL
- **ORM:** SQLAlchemy
- **Authentication:** JWT + OAuth2
- **AI:** Scikit-learn

---

# 🚀 Project Status

## Current Phase

🟢 **Phase 2 – Backend Development & Frontend Preparation**

## Current Status

The core backend management modules have been implemented, integrated, and tested using Swagger UI and PostgreSQL.

The backend is now prepared for React frontend integration.

## Completed Backend Modules

- ✅ Authentication
- ✅ Category Management
- ✅ Product Management
- ✅ Inventory Management
- ✅ Supplier Management
- ✅ Customer Management
- ✅ Sales Management
- ✅ Purchase Order Management
- ✅ Purchase Item Management
- ✅ Stock Transaction Management
- ✅ Backend Integration & Validation
- ✅ Frontend API Preparation

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
- ✅ Database Relationships
- ✅ Module Design
- ✅ Module Diagram

---

# ⚙️ Backend Foundation

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

---

# 📂 Category Management Module

- ✅ Category Model
- ✅ Category Schema
- ✅ Category Service Layer
- ✅ Category CRUD APIs
- ✅ JWT Protected Endpoints
- ✅ PostgreSQL Categories Table
- ✅ Swagger CRUD Testing

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
- ✅ JWT Protected Endpoints
- ✅ PostgreSQL Suppliers Table
- ✅ Swagger CRUD Testing
- ✅ Supplier Data Validation

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
- ✅ JWT Protected Endpoints
- ✅ PostgreSQL Customers Table
- ✅ Swagger CRUD Testing
- ✅ Customer Data Validation

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
- ✅ Foreign Key Validation
- ✅ Swagger CRUD Testing

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
- ✅ Foreign Key Validation
- ✅ JWT Protected Endpoints
- ✅ PostgreSQL Purchase Orders Table
- ✅ Swagger CRUD Testing

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
- ✅ JWT Protected Endpoints
- ✅ PostgreSQL Purchase Items Table
- ✅ Swagger CRUD Testing

### Purchase Item APIs

- `POST /purchase-items/`
- `GET /purchase-items/`
- `GET /purchase-items/{purchase_item_id}`
- `PUT /purchase-items/{purchase_item_id}`
- `DELETE /purchase-items/{purchase_item_id}`
# ✨ Implemented Features

---
# 📊 Stock Transaction Management Module

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

## 📦 Inventory Management

- Create Inventory Record
- View Inventory
- View Inventory by ID
- Update Inventory
- Delete Inventory
- Product–Inventory Relationship

---

## 🚚 Supplier Management

- Create Supplier
- View Suppliers
- View Supplier by ID
- Update Supplier
- Delete Supplier
- Supplier Data Validation

---

## 👥 Customer Management

- Create Customer
- View Customers
- View Customer by ID
- Update Customer
- Delete Customer
- Customer Data Validation

---

## 💰 Sales Management

- Create Sale
- View Sales
- View Sale by ID
- Update Sale
- Delete Sale
- Invoice Number Validation
- Customer–Sales Relationship
- User–Sales Relationship

---

# 🗄 Database Design

BoutiqueIQ uses **PostgreSQL** as the primary relational database.

## Current Database Tables

The current backend database contains:

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

The current implemented database relationships are:

```text
ROLES
   │
   │ 1:N
   ▼
USERS
   │
   ├───────────────┐
   │               │
   │ 1:N           │ 1:N
   ▼               ▼
SALES        PURCHASE_ORDERS
                   │
                   │ 1:N
                   ▼
             PURCHASE_ITEMS
                   │
                   │ N:1
                   ▼
                PRODUCTS


CATEGORIES
   │
   │ 1:N
   ▼
PRODUCTS
   │
   ├───────────────┐
   │               │
   │ 1:1           │ 1:N
   ▼               ▼
INVENTORY   STOCK_TRANSACTIONS


SUPPLIERS
   │
   ├───────────────┐
   │               │
   │ 1:N           │ 1:N
   ▼               ▼
PRODUCTS     PURCHASE_ORDERS


CUSTOMERS
   │
   │ 1:N
   ▼
SALES


This matches the foreign-key relationships we verified in PostgreSQL.

---

# 7. Add Backend Integration

After the database relationships section, add:

```markdown
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

- ✅ JWT authentication validation
- ✅ Foreign key validation
- ✅ 404 resource validation
- ✅ 400 business-rule validation
- ✅ 422 request validation
- ✅ Insufficient stock validation
- ✅ Invalid stock transaction validation

# 🔌 Frontend Integration Preparation

The backend has been prepared for React frontend integration.
## Current Phase

🟢 **Phase 3 – Frontend Development & API Integration**
## 🌐 Frontend Foundation & API Integration

- ✅ React + TypeScript + Vite
- ✅ Axios API client
- ✅ React Router
- ✅ JWT token management
- ✅ Authentication Context
- ✅ Protected Routes
- ✅ Login Page Foundation
- ✅ Dashboard Page Foundation
- ✅ Backend API integration
- ✅ Category API service
- ✅ Product API service
- ✅ Inventory API service
- ✅ Supplier API service
- ✅ Customer API service
- ✅ Sales API service
- ✅ Purchase Order API service
- ✅ Purchase Item API service
- ✅ Stock Transaction API service

## Completed

- ✅ Backend configuration reviewed
- ✅ CORS configured
- ✅ Environment variables verified
- ✅ Frontend API base URL verified
- ✅ JWT authentication flow verified
- ✅ Protected API access verified
- ✅ API response and error handling verified
- ✅ Frontend-ready API testing completed
- ✅ Frontend API documentation created

## API Documentation

Frontend API integration documentation:

`docs/api/frontend_api.md`

## Local Development URLs

Backend:

`http://127.0.0.1:8000`

Swagger:

`http://127.0.0.1:8000/docs`

Health Check:

`http://127.0.0.1:8000/health`

Frontend development server:

`http://localhost:5173`

# 📅 Development Progress

| Day | Status |
|-----|--------|
| Day 1 | ✅ Project Initialization |
| Day 2 | ✅ Project Setup |
| Day 3 | ✅ Planning Documents |
| Day 4 | ✅ System Architecture |
| Day 5 | ✅ Database Design |
| Day 6 | ✅ Module Design |
| Day 7 | ✅ Backend Foundation |
| Day 8 | ✅ Authentication |
| Day 9 | ✅ Category Management |
| Day 10 | ✅ Product Management |
| Day 11 | ✅ Inventory Management |
| Day 12 | ✅ Supplier Management |
| Day 13 | ✅ Customer Management |
| Day 14 | ✅ Sales Management |
| Day 15 | ✅ Purchase Management |
| Day 16 | ✅ Stock Transaction Management |
| Day 17 | ✅ Backend Integration & Validation |
| Day 18 | ✅ Backend Preparation for Frontend |

# 📊 Current Progress

| Module | Status |
|--------|--------|
| Planning & Design | ✅ Completed |
| Backend Foundation | ✅ Completed |
| Authentication | ✅ Completed |
| Category Management | ✅ Completed |
| Product Management | ✅ Completed |
| Inventory Management | ✅ Completed |
| Supplier Management | ✅ Completed |
| Customer Management | ✅ Completed |
| Sales Management | ✅ Completed |
| Purchase Order Management | ✅ Completed |
| Purchase Item Management | ✅ Completed |
| Stock Transaction Management | ✅ Completed |
| Backend Integration | ✅ Completed |
| Frontend API Preparation | ✅ Completed |
| Dashboard | ⏳ Planned |
| Reports & Analytics | ⏳ Planned |
| AI Demand Forecasting | ⏳ Planned |
| Inventory Optimization | ⏳ Planned |
| React Frontend Development | ⏳ Planned |
| Cloud Deployment | ⏳ Planned |

