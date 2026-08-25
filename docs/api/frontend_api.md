# BoutiqueIQ Frontend API Guide

## 1. Backend Server

Local development server:

http://127.0.0.1:8000

Swagger documentation:

http://127.0.0.1:8000/docs

Health check:

GET /health

---

## 2. Frontend Development Server

The React + Vite frontend will run locally at:

http://localhost:5173

The FastAPI backend allows requests from this frontend through CORS.

---

## 3. API Base URL

The frontend should use:

http://127.0.0.1:8000

as the backend API base URL during local development.

Example:

GET /products/

Full URL:

http://127.0.0.1:8000/products/

---

## 4. Authentication

BoutiqueIQ uses JWT authentication.

### Login

POST /auth/login

The frontend sends the user's login credentials.

Successful authentication returns:

- access_token
- token_type

Example:

{
    "access_token": "<JWT_TOKEN>",
    "token_type": "bearer"
}

---

## 5. Protected API Requests

Protected requests must include:

Authorization: Bearer <JWT_TOKEN>

Example:

GET /products/

Authorization:

Bearer <JWT_TOKEN>

---

## 6. Authentication Flow

React Login Page
        ↓
POST /auth/login
        ↓
FastAPI validates credentials
        ↓
JWT access token returned
        ↓
Frontend stores access token
        ↓
Frontend sends JWT with protected requests
        ↓
FastAPI validates JWT
        ↓
Protected API response

---

## 7. Main API Modules

### Authentication

/auth

### Categories

/categories

### Products

/products

### Inventory

/inventory

### Suppliers

/suppliers

### Customers

/customers

### Sales

/sales

### Purchase Orders

/purchase-orders

### Purchase Items

/purchase-items

### Stock Transactions

/stock-transactions

---

## 8. HTTP Status Codes

### 200 OK

Request completed successfully.

### 400 Bad Request

Business rule or request error.

Examples:

- Insufficient stock
- Invalid stock transaction type

### 401 Unauthorized

Authentication is required or the JWT is invalid.

### 404 Not Found

Requested resource does not exist.

### 422 Unprocessable Entity

Request validation failed.

---

## 9. Inventory Flow

Stock IN:

Stock Transaction
        ↓
Inventory quantity increases

Stock OUT:

Stock Transaction
        ↓
Available stock checked
        ↓
Inventory quantity decreases

If requested OUT quantity is greater than available stock:

400 Bad Request

---

## 10. Important Database Relationships

Products → Categories

Products → Inventory

Products → Stock Transactions

Suppliers → Purchase Orders

Users → Purchase Orders

Purchase Orders → Purchase Items

Products → Purchase Items

Customers → Sales

Users → Sales

Users → Roles

---

## 11. Frontend Integration

The React frontend will communicate with FastAPI using HTTP requests.

The frontend will eventually contain API service functions such as:

- Authentication service
- Category service
- Product service
- Inventory service
- Supplier service
- Customer service
- Sales service
- Purchase order service
- Purchase item service
- Stock transaction service

---

## 12. Development Architecture

React + TypeScript + Vite
            ↓
       HTTP / JSON
            ↓
FastAPI Backend
            ↓
       SQLAlchemy
            ↓
       PostgreSQL