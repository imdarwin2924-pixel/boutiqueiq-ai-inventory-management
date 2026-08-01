# Database Design

## Project

BoutiqueIQ – AI-Powered Clothing Inventory & Catalog Management Platform for Boutiques

---

# Overview

The BoutiqueIQ database is designed using a relational database model. PostgreSQL is used as the primary database management system. The database stores boutique information, products, inventory, suppliers, purchase orders, sales transactions, customers, and AI demand forecasting results.

---

# Database Tables

## 1. Users

Stores system users.

Fields

- id (PK)
- full_name
- email
- password
- role
- created_at

---

## 2. Categories

Stores clothing categories.

Fields

- id (PK)
- category_name
- description

---

## 3. Products

Stores clothing products.

Fields

- id (PK)
- category_id (FK)
- supplier_id (FK)
- product_name
- sku
- brand
- color
- size
- fabric
- cost_price
- selling_price
- image_url
- description

---

## 4. Inventory

Stores inventory information.

Fields

- id (PK)
- product_id (FK)
- quantity
- minimum_stock
- updated_at

---

## 5. Suppliers

Stores supplier details.

Fields

- id (PK)
- supplier_name
- phone
- email
- address

---

## 6. Customers

Stores customer information.

Fields

- id (PK)
- customer_name
- phone
- email

---

## 7. Sales

Stores sales invoices.

Fields

- id (PK)
- customer_id (FK)
- user_id (FK)
- total_amount
- sale_date

---

## 8. Sale_Items

Stores sold products.

Fields

- id (PK)
- sale_id (FK)
- product_id (FK)
- quantity
- unit_price

---

## 9. Purchase_Orders

Stores purchase orders.

Fields

- id (PK)
- supplier_id (FK)
- user_id (FK)
- purchase_date
- total_amount
- status

---

## 10. Purchase_Items

Stores purchased products.

Fields

- id (PK)
- purchase_id (FK)
- product_id (FK)
- quantity
- unit_cost

---

## 11. AI_Forecasts

Stores AI prediction results.

Fields

- id (PK)
- product_id (FK)
- predicted_demand
- confidence_score
- prediction_date

---

# Relationships

- One Category → Many Products
- One Supplier → Many Products
- One Product → One Inventory
- One Customer → Many Sales
- One Sale → Many Sale Items
- One Product → Many Sale Items
- One Supplier → Many Purchase Orders
- One Purchase Order → Many Purchase Items
- One Product → Many Purchase Items
- One Product → Many AI Forecasts