# BoutiqueIQ - System Architecture

## Overview

BoutiqueIQ follows a modern three-tier architecture that separates the presentation layer, business logic layer, and data layer. The application allows boutique owners to manage inventory, products, suppliers, sales, and demand forecasting through a secure cloud-based platform.

The frontend communicates with the backend through REST APIs. The backend processes business logic, validates user requests, performs authentication, interacts with the PostgreSQL database, and communicates with the AI prediction module for demand forecasting.

---

## Architecture Layers

### 1. Presentation Layer

Technology:
- React.js
- TypeScript
- Vite
- Axios
- Tailwind CSS

Responsibilities:
- User Interface
- Dashboard
- Product Management
- Inventory Management
- Sales Management
- Reports

---

### 2. Application Layer

Technology:
- FastAPI
- SQLAlchemy
- JWT Authentication

Responsibilities:
- REST API
- Authentication
- Business Logic
- Inventory Processing
- Sales Processing
- AI Service Integration

---

### 3. Data Layer

Technology:
- PostgreSQL

Responsibilities:
- Store Users
- Products
- Categories
- Inventory
- Suppliers
- Purchase Orders
- Sales
- Forecast Data

---

### 4. AI Layer

Technology:
- Scikit-learn

Responsibilities:
- Demand Forecasting
- Inventory Optimization
- Sales Prediction

---

## Deployment

Frontend:
Vercel

Backend:
Render

Database:
Railway PostgreSQL