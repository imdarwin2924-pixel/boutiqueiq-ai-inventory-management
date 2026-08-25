import api from "./api";

export interface PurchaseOrder {
  purchase_order_id: number;
  supplier_id: number;
  user_id: number;
  order_number: string;
  order_date: string;
  total_amount: number;
  status: string;
}

export interface PurchaseOrderCreate {
  supplier_id: number;
  user_id: number;
  order_number: string;
  order_date: string;
  total_amount: number;
  status: string;
}

export const getPurchaseOrders = async (): Promise<PurchaseOrder[]> => {
  const response = await api.get<PurchaseOrder[]>(
    "/purchase-orders/"
  );

  return response.data;
};

export const getPurchaseOrderById = async (
  purchaseOrderId: number
): Promise<PurchaseOrder> => {
  const response = await api.get<PurchaseOrder>(
    `/purchase-orders/${purchaseOrderId}`
  );

  return response.data;
};

export const createPurchaseOrder = async (
  purchaseOrder: PurchaseOrderCreate
): Promise<PurchaseOrder> => {
  const response = await api.post<PurchaseOrder>(
    "/purchase-orders/",
    purchaseOrder
  );

  return response.data;
};

export const updatePurchaseOrder = async (
  purchaseOrderId: number,
  purchaseOrder: PurchaseOrderCreate
): Promise<PurchaseOrder> => {
  const response = await api.put<PurchaseOrder>(
    `/purchase-orders/${purchaseOrderId}`,
    purchaseOrder
  );

  return response.data;
};

export const deletePurchaseOrder = async (
  purchaseOrderId: number
): Promise<void> => {
  await api.delete(
    `/purchase-orders/${purchaseOrderId}`
  );
};