import api from "./api";

// ==========================================================
// DASHBOARD TYPES
// ==========================================================

export interface DashboardSummary {
  total_products: number;
  total_inventory_items: number;
  total_customers: number;
  total_sales: number;
}


export interface DashboardInventory {
  total_stock_units: number;
  inventory_value: number;
  total_inventory: number;
  in_stock: number;
  low_stock: number;
  out_of_stock: number;
}


export interface DashboardStockMovement {
  total_stock_in: number;
  total_stock_out: number;
  net_stock_movement: number;
}


// ==========================================================
// PURCHASE ANALYTICS
// ==========================================================

export interface DashboardPurchases {
  total_purchase_orders: number;
  total_purchase_value: number;
  pending_purchase_orders: number;
  completed_purchase_orders: number;
  cancelled_purchase_orders: number;
}


// ==========================================================
// INVENTORY ALERTS
// ==========================================================

export interface DashboardAlertItem {
  inventory_id: number;
  product_id: number;
  quantity: number;
  minimum_stock: number;
  location: string | null;
  status: string;
}


export interface DashboardAlerts {
  low_stock_count: number;
  out_of_stock_count: number;
  low_stock_items: DashboardAlertItem[];
  out_of_stock_items: DashboardAlertItem[];
}


// ==========================================================
// RECENT SALES
// ==========================================================

export interface DashboardRecentSale {
  invoice_number: string;
  sale_id: number;
  total_amount: number;
  sale_date: string;
  user_id: number;
  customer_id: number | null;
  payment_method: string;
}


// ==========================================================
// RECENT STOCK MOVEMENTS
// ==========================================================

export interface DashboardRecentStockMovement {
  transaction_type: string;
  transaction_date: string;
  product_id: number;
  transaction_id: number;
  quantity: number;
  reason: string | null;
}


// ==========================================================
// RECENT PURCHASE ORDERS
// ==========================================================

export interface DashboardRecentPurchaseOrder {
  supplier_id: number;
  user_id: number;
  order_date: string;
  status: string;
  order_number: string;
  purchase_order_id: number;
  total_amount: number;
}


// ==========================================================
// COMPLETE DASHBOARD RESPONSE
// ==========================================================

export interface DashboardResponse {
  summary: DashboardSummary;

  inventory: DashboardInventory;

  stock_movement: DashboardStockMovement;

  purchases: DashboardPurchases;

  alerts: DashboardAlerts;

  recent_sales: DashboardRecentSale[];

  recent_stock_movements:
    DashboardRecentStockMovement[];

  recent_purchase_orders:
    DashboardRecentPurchaseOrder[];
}


// ==========================================================
// GET DASHBOARD SUMMARY
// ==========================================================

export const getDashboardSummary =
  async (): Promise<DashboardResponse> => {

    const response =
      await api.get<DashboardResponse>(
        "/dashboard/summary"
      );

    return response.data;
  };