# Problem Statement

## 1. Title

BoutiqueIQ – AI-Powered Clothing Inventory & Catalog Management Platform for Boutiques

---

## 2. Domain

Retail Technology | Fashion Technology | Inventory Management | Artificial Intelligence | Cloud-Based SaaS

---

## 3. Who is the User?

### 1. Boutique Owner
- Manage clothing products and categories.
- Monitor inventory and stock levels.
- View sales reports and business analytics.
- Receive AI-based inventory recommendations.
- Manage employees and suppliers.

### 2. Boutique Employee
- Add and update product inventory.
- Process sales transactions.
- Manage purchase entries.
- View assigned inventory information.

### 3. System Administrator
- Manage boutique registrations.
- Monitor system usage.
- Manage platform configurations.
- Handle user account administration.

---

## 4. What Problem Are We Solving?

Many small and medium-sized boutiques still rely on manual record keeping, spreadsheets, or disconnected software to manage their clothing inventory and product catalog. This often results in inaccurate stock records, overstocking, stock shortages, duplicate product entries, and inefficient business operations.

Boutique owners also struggle to predict future customer demand, making it difficult to decide when to restock products or clear excess inventory. Poor inventory planning directly affects revenue and customer satisfaction.

This project aims to provide a centralized cloud-based platform where boutique owners can efficiently manage products, inventory, suppliers, and sales while leveraging Artificial Intelligence to forecast product demand and optimize inventory decisions.

---

## 5. Proposed Solution

BoutiqueIQ is a full-stack web application designed specifically for boutique businesses.

The system provides:

- Secure user authentication and role-based access.
- Product catalog management.
- Category management.
- Inventory tracking.
- Supplier management.
- Purchase management.
- Sales management.
- Business dashboard and analytics.
- Low-stock notifications.
- AI-based demand forecasting.
- AI-based inventory optimization.
- Cloud deployment with secure database storage.

The AI module analyzes historical sales data to predict future product demand and provides recommendations for inventory replenishment, helping boutique owners reduce stock shortages and excess inventory.

---

## 6. Core Entities / Database Tables

1. Users
2. Roles
3. Categories
4. Products
5. Inventory
6. Suppliers
7. Purchase Orders
8. Purchase Order Items
9. Customers
10. Sales
11. Sale Items
12. Notifications
13. Demand Forecasts

---

## 7. User Roles & Permissions

### System Administrator
- Manage boutiques.
- Manage user accounts.
- View overall platform statistics.
- Configure platform settings.

### Boutique Owner
- Full access to boutique operations.
- Manage inventory.
- Manage products.
- Manage suppliers.
- View reports.
- Access AI forecasting dashboard.

### Employee
- Manage stock entries.
- Update inventory.
- Record sales.
- View assigned operational data.

---

## 8. Success Criteria

The project will be considered successful if:

- Boutique owners can manage their product catalog efficiently.
- Inventory updates accurately after every purchase and sale.
- Users can securely log in with role-based permissions.
- AI predicts future demand for clothing products using historical sales data.
- The system recommends inventory replenishment based on forecast results.
- Reports are generated quickly and accurately.
- The application is deployed successfully on a cloud platform.

---

## 9. Out of Scope

The following features are not included in the current project scope:

- Mobile application.
- Customer online shopping portal.
- Payment gateway integration.
- Multi-language support.
- Virtual trial room.
- Social media integration.
- Barcode hardware integration.
- Multi-country tax calculation.

These features may be considered as future enhancements.

---

## 10. Chosen Track

### Backend
Python FastAPI

### Frontend
React.js

### Database
PostgreSQL

### Authentication
JWT Authentication

### ORM
SQLAlchemy

### AI Module
Scikit-learn (Demand Forecasting & Inventory Optimization)

### Deployment
Frontend: Vercel

Backend: Render

Database: Railway PostgreSQL