import api from "./api";

export interface PurchaseItem {
  purchase_item_id: number;
  purchase_order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface PurchaseItemCreate {
  purchase_order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export const getPurchaseItems = async (): Promise<PurchaseItem[]> => {
  const response = await api.get<PurchaseItem[]>(
    "/purchase-items/"
  );

  return response.data;
};

export const getPurchaseItemById = async (
  purchaseItemId: number
): Promise<PurchaseItem> => {
  const response = await api.get<PurchaseItem>(
    `/purchase-items/${purchaseItemId}`
  );

  return response.data;
};

export const createPurchaseItem = async (
  purchaseItem: PurchaseItemCreate
): Promise<PurchaseItem> => {
  const response = await api.post<PurchaseItem>(
    "/purchase-items/",
    purchaseItem
  );

  return response.data;
};

export const updatePurchaseItem = async (
  purchaseItemId: number,
  purchaseItem: PurchaseItemCreate
): Promise<PurchaseItem> => {
  const response = await api.put<PurchaseItem>(
    `/purchase-items/${purchaseItemId}`,
    purchaseItem
  );

  return response.data;
};

export const deletePurchaseItem = async (
  purchaseItemId: number
): Promise<void> => {
  await api.delete(
    `/purchase-items/${purchaseItemId}`
  );
};