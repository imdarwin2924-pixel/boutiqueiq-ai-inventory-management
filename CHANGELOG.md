# Changelog

All notable changes to the BoutiqueIQ project are documented in this file.

---

## Day 1 - Project Initialization

### Added

- Created GitHub repository
- Initialized BoutiqueIQ project
- Added Problem Statement
- Added initial project documentation

---

## Day 2 - Project Setup

### Added

- Initialized FastAPI backend
- Initialized React + Vite + TypeScript frontend
- Created project folder structure
- Added Git ignore configuration

---

## Day 3 - Planning Documents

### Added

- Functional Requirements
- Non-Functional Requirements
- Feature List
- User Flow Documentation

---

## Day 4 - System Design

### Added

- Three-Tier System Architecture
- System Architecture Diagram
- Architecture Documentation

---

## Day 5 - Database Design

### Added

- Database Design Document
- Entity Relationship (ER) Diagram
- Database Relationships
- PostgreSQL Database Planning

---

## Day 6 - Module Design

### Added

- Module Design Documentation
- Module Diagram
- Updated README
- Updated Project Documentation

---

## Day 7 - Backend Foundation

### Added

- PostgreSQL Installation & Configuration
- pgAdmin Configuration
- SQLAlchemy Integration
- Environment Configuration (.env)
- Database Connection
- Database Initialization
- Role Model
- User Model
- Roles Table
- Users Table

---

## Day 8 - Authentication Module

### Added

- JWT Authentication
- OAuth2 Integration
- Password Hashing (bcrypt)
- User Registration API
- User Login API
- Protected Route (`/auth/me`)
- Swagger Authorization
- Authentication Testing

---

## Day 9 - Category Management Module

### Added

- Category Model
- Category Schema
- Category Service Layer
- Category CRUD APIs
- JWT Protected Category Endpoints
- PostgreSQL Categories Table
- Swagger CRUD Testing

---

## Day 10 - Product Management Module

### Added

- Product Model
- Product Schema
- Product Service Layer
- Product CRUD APIs
- Product–Category Relationship
- Product–Supplier Relationship
- JWT Protected Product Endpoints
- PostgreSQL Products Table
- Swagger CRUD Testing

---

## Day 11 - Inventory Management Module

### Added

- Inventory Model
- Inventory Schema
- Inventory Service Layer
- Inventory CRUD APIs
- Product–Inventory Relationship
- JWT Protected Inventory Endpoints
- PostgreSQL Inventory Table
- Swagger CRUD Testing

---

## Day 12 - Supplier Management Module

### Added

- Supplier Model
- Supplier Schema
- Supplier Service Layer
- Supplier CRUD APIs
- Supplier–Product Relationship
- JWT Protected Supplier Endpoints
- PostgreSQL Suppliers Table
- Swagger CRUD Testing
- Supplier Data Validation

---

## Day 13 - Customer Management Module

### Added

- Customer Model
- Customer Schema
- Customer Service Layer
- Customer CRUD APIs
- Customer Primary Key Correction (`customer_id`)
- JWT Protected Customer Endpoints
- PostgreSQL Customers Table
- Swagger CRUD Testing
- Customer Data Validation

---

## Day 14 - Sales Management Module

### Added

- Corrected Customer Primary Key Design
- Created Sales Model
- Created Sales Schema
- Created Sales Service Layer
- Created Sales API
- Created PostgreSQL Sales Table
- Customer–Sales Relationship
- User–Sales Relationship
- JWT Protected Sales Endpoints
- Sales Create API
- Sales List API
- Sales Detail API
- Sales Update API
- Sales Delete API
- Invoice Number Uniqueness Validation
- Foreign Key Validation
- Swagger Sales API Testing
- Sales CRUD Testing

### Sales API Endpoints

- `POST /sales/`
- `GET /sales/`
- `GET /sales/{sale_id}`
- `PUT /sales/{sale_id}`
- `DELETE /sales/{sale_id}`

---

# Current Progress

## Completed Modules

- ✅ Authentication
- ✅ Category Management
- ✅ Product Management
- ✅ Inventory Management
- ✅ Supplier Management
- ✅ Customer Management
- ✅ Sales Management

## Backend Technologies

- FastAPI
- PostgreSQL
- SQLAlchemy
- JWT Authentication
- OAuth2
- bcrypt
- Swagger UI / OpenAPI

## Implemented Database Tables

- `roles`
- `users`
- `categories`
- `products`
- `inventory`
- `suppliers`
- `customers`
- `sales`

## Current Database Relationships

- `ROLES → USERS` (1:N)
- `CATEGORIES → PRODUCTS` (1:N)
- `SUPPLIERS → PRODUCTS` (1:N)
- `PRODUCTS → INVENTORY` (1:1)
- `CUSTOMERS → SALES` (1:N)
- `USERS → SALES` (1:N)

---

# Upcoming Modules

- ⏳ Sale Items Management
- ⏳ Stock Transaction Management
- ⏳ Purchase Order Management
- ⏳ Purchase Items Management
- ⏳ Dashboard
- ⏳ Reports
- ⏳ AI Demand Forecasting
- ⏳ Inventory Optimization
- ⏳ React Frontend Integration
- ⏳ Cloud Deployment
---

## Day 15 - Purchase Management Module

### Added

- Purchase Order Model
- Purchase Item Model
- Purchase Order Schema
- Purchase Item Schema
- Purchase Order Service Layer
- Purchase Item Service Layer
- Purchase Order CRUD APIs
- Purchase Item CRUD APIs
- Supplier–Purchase Order Relationship
- User–Purchase Order Relationship
- Purchase Order–Purchase Item Relationship
- Product–Purchase Item Relationship
- Purchase Order Number Uniqueness Validation
- Foreign Key Validation
- Swagger CRUD Testing
- Purchase Order Update and Delete Operations
- Purchase Item Update and Delete Operations
---

## Day 16 - Stock Transaction Management

### Added

- Stock Transaction Model
- Stock Transaction Schema
- Stock Transaction Service Layer
- Stock Transaction CRUD APIs
- Product–Stock Transaction Relationship
- Stock IN Management
- Stock OUT Management
- Inventory Quantity Integration
- Automatic Inventory Increase for Stock IN
- Automatic Inventory Decrease for Stock OUT
- Insufficient Stock Validation
- Invalid Transaction Type Validation
- Foreign Key Validation
- Stock Transaction API Testing
- Inventory Integration Testing
---

## Day 17 - Backend Integration & Validation

### Added

- Verified all FastAPI routers
- Verified API endpoint registration
- Verified PostgreSQL foreign-key relationships
- Verified Product–Inventory integration
- Verified Supplier–Purchase Order integration
- Verified Purchase Order–Purchase Item integration
- Verified Product–Stock Transaction integration
- Verified Customer–Sales integration
- Verified JWT authentication protection
- Verified foreign-key validation
- Verified 404 error handling
- Verified API validation handling
- Verified API response consistency
- Completed final Swagger API verification

### Integration Testing

- Product → Inventory
- Supplier → Purchase Order
- Purchase Order → Purchase Item
- Purchase Item → Product
- Product → Stock Transaction
- Stock Transaction → Inventory
- Customer → Sales
- User → Sales
- User → Purchase Order

### Security & Validation

- JWT protected endpoints tested
- Invalid foreign-key requests tested
- Missing resource handling tested
- Invalid stock transaction handling tested
- Insufficient stock protection tested
---

# Current Progress

## Completed Modules

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
- ✅ Backend Preparation for Frontend

## Backend Technologies

- FastAPI
- PostgreSQL
- SQLAlchemy
- JWT Authentication
- OAuth2
- bcrypt
- Swagger UI / OpenAPI

## Implemented Database Tables

- `roles`
- `users`
- `categories`
- `products`
- `inventory`
- `suppliers`
- `customers`
- `sales`
- `purchase_orders`
- `purchase_items`
- `stock_transactions`

## Current Database Relationships

- `ROLES → USERS` (1:N)
- `CATEGORIES → PRODUCTS` (1:N)
- `SUPPLIERS → PRODUCTS` (1:N)
- `PRODUCTS → INVENTORY` (1:1)
- `CUSTOMERS → SALES` (1:N)
- `USERS → SALES` (1:N)
- `SUPPLIERS → PURCHASE_ORDERS` (1:N)
- `USERS → PURCHASE_ORDERS` (1:N)
- `PURCHASE_ORDERS → PURCHASE_ITEMS` (1:N)
- `PRODUCTS → PURCHASE_ITEMS` (1:N)
- `PRODUCTS → STOCK_TRANSACTIONS` (1:N)
---

## Day 19 - Frontend Foundation & API Integration

### Added

- React frontend dependency setup
- Axios integration
- React Router integration
- Centralized Axios API client
- FastAPI backend API configuration
- JWT token storage utility
- Axios JWT authorization interceptor
- Authentication Context
- Global authentication state
- Login functionality
- Logout functionality
- Protected frontend routes
- React Router configuration
- Dashboard page foundation
- Login page foundation
- Category API service
- Product API service
- Inventory API service
- Supplier API service
- Customer API service
- Sales API service
- Purchase Order API service
- Purchase Item API service
- Stock Transaction API service
- React frontend to FastAPI communication testing
- JWT protected API request testing

### Frontend API Integration

- React → FastAPI `/health` communication verified
- React → FastAPI `/auth/login` communication verified
- JWT token generation verified
- JWT token storage verified
- JWT Authorization header verified
- Protected `/products/` API request verified
- Protected route redirection verified
- Login → Dashboard navigation verified
- Logout functionality verified

### Frontend Structure

- `src/contexts/AuthContext.tsx`
- `src/pages/Login.tsx`
- `src/pages/Dashboard.tsx`
- `src/routes/AppRouter.tsx`
- `src/routes/ProtectedRoute.tsx`
- `src/services/api.ts`
- `src/services/authService.ts`
- `src/services/categoryService.ts`
- `src/services/productService.ts`
- `src/services/inventoryService.ts`
- `src/services/supplierService.ts`
- `src/services/customerService.ts`
- `src/services/salesService.ts`
- `src/services/purchaseOrderService.ts`
- `src/services/purchaseItemService.ts`
- `src/services/stockTransactionService.ts`
- `src/utils/auth.ts`