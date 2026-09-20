import api from "./api";

/**
 * --------------------------------------------------
 * Purchase Order Types
 * --------------------------------------------------
 */

/**
 * Purchase order status values.
 */
export type PurchaseOrderStatus =
  | "Pending"
  | "Approved"
  | "Received"
  | "Cancelled";

/**
 * Purchase order returned by the backend.
 */
export interface PurchaseOrder {
  purchase_order_id: number;
  supplier_id: number;
  user_id: number;
  order_number: string;
  order_date: string;
  total_amount: number;
  status: string;
}

/**
 * Payload used to create a purchase order.
 */
export interface PurchaseOrderCreate {
  supplier_id: number;
  order_number: string;
  order_date: string;
  total_amount: number;
  status: string;
}

/**
 * Payload used to update a purchase order.
 */
export interface PurchaseOrderUpdate {
  supplier_id: number;
  order_number: string;
  order_date: string;
  total_amount: number;
  status: string;
}


/**
 * --------------------------------------------------
 * Get All Purchase Orders
 * --------------------------------------------------
 */
export const getPurchaseOrders = async (): Promise<
  PurchaseOrder[]
> => {
  const response =
    await api.get<PurchaseOrder[]>(
      "/purchase-orders/"
    );

  return response.data;
};


/**
 * --------------------------------------------------
 * Get Purchase Order By ID
 * --------------------------------------------------
 */
export const getPurchaseOrderById = async (
  purchaseOrderId: number
): Promise<PurchaseOrder> => {
  const response =
    await api.get<PurchaseOrder>(
      `/purchase-orders/${purchaseOrderId}`
    );

  return response.data;
};


/**
 * --------------------------------------------------
 * Create Purchase Order
 * --------------------------------------------------
 *
 * Admin and Manager only.
 */
export const createPurchaseOrder = async (
  purchaseOrder: PurchaseOrderCreate
): Promise<PurchaseOrder> => {
  const response =
    await api.post<PurchaseOrder>(
      "/purchase-orders/",
      purchaseOrder
    );

  return response.data;
};


/**
 * --------------------------------------------------
 * Update Purchase Order
 * --------------------------------------------------
 *
 * Admin and Manager only.
 */
export const updatePurchaseOrder = async (
  purchaseOrderId: number,
  purchaseOrder: PurchaseOrderUpdate
): Promise<PurchaseOrder> => {
  const response =
    await api.put<PurchaseOrder>(
      `/purchase-orders/${purchaseOrderId}`,
      purchaseOrder
    );

  return response.data;
};


/**
 * --------------------------------------------------
 * Delete Purchase Order
 * --------------------------------------------------
 *
 * Admin and Manager only.
 */
export const deletePurchaseOrder = async (
  purchaseOrderId: number
): Promise<void> => {
  await api.delete(
    `/purchase-orders/${purchaseOrderId}`
  );
};