# User Flow

## Project Name

**BoutiqueIQ – AI-Powered Clothing Inventory & Catalog Management Platform for Boutiques**

---

# Introduction

This document describes how users interact with the BoutiqueIQ system. It outlines the sequence of actions performed by each user role from login to completing their daily tasks.

---

# User Roles

The system supports three user roles:

1. System Administrator
2. Boutique Owner
3. Employee

---

# Overall System Flow

```text
User
   │
   ▼
Login
   │
   ▼
Authentication (JWT)
   │
   ▼
Dashboard
   │
   ├──────────────┬───────────────┬───────────────┐
   ▼              ▼               ▼               ▼
Products      Inventory        Sales         Suppliers
   │              │               │               │
   └──────────────┴───────────────┴───────────────┘
                     │
                     ▼
              AI Prediction Module
                     │
                     ▼
                  Reports
                     │
                     ▼
                   Logout
```

---

# Boutique Owner Flow

```text
Owner Login
      │
      ▼
Dashboard
      │
      ├──────────────┬──────────────┬───────────────┐
      ▼              ▼              ▼               ▼
Manage Products  Inventory   Suppliers       Sales
      │              │              │               │
      └──────────────┴──────────────┴───────────────┘
                     │
                     ▼
           View AI Forecast & Reports
                     │
                     ▼
                  Logout
```

### Owner Capabilities

- Login securely
- Manage product catalog
- Manage categories
- Manage inventory
- Manage suppliers
- Create purchase orders
- View sales reports
- View AI demand forecasting
- View inventory optimization recommendations
- Logout

---

# Employee Flow

```text
Employee Login
        │
        ▼
Dashboard
        │
        ├──────────────┬───────────────┐
        ▼              ▼               ▼
Inventory Update   Sales Entry   Customer Records
        │
        ▼
     Logout
```

### Employee Capabilities

- Login
- Update inventory
- Record sales
- View product details
- View customer information
- Logout

---

# Administrator Flow

```text
Admin Login
      │
      ▼
Admin Dashboard
      │
      ├──────────────┬──────────────┬──────────────┐
      ▼              ▼              ▼
Manage Users   Manage Boutiques  View Analytics
      │
      ▼
    Logout
```

### Administrator Capabilities

- Manage user accounts
- Manage boutique registrations
- Monitor platform usage
- View system analytics
- Logout

---

# AI Workflow

```text
Sales History
       │
       ▼
Historical Data
       │
       ▼
AI Model
       │
       ▼
Demand Forecast
       │
       ▼
Inventory Recommendation
       │
       ▼
Dashboard Display
```

---

# User Flow Summary

| User Role | Main Activities |
|------------|-----------------|
| System Administrator | Manage users, boutiques, and platform settings |
| Boutique Owner | Manage products, inventory, suppliers, sales, reports, and AI insights |
| Employee | Update inventory, record sales, and manage daily operations |

---

# Conclusion

The BoutiqueIQ user flow ensures that each user role has clearly defined responsibilities and permissions. The workflow is designed to simplify boutique operations while integrating AI-based demand forecasting and inventory optimization into daily decision-making.