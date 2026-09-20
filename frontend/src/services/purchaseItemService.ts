import api from "./api";

/**
 * --------------------------------------------------
 * Purchase Item Types
 * --------------------------------------------------
 */

/**
 * Purchase item returned by the backend.
 */
export interface PurchaseItem {
  purchase_item_id: number;
  purchase_order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

/**
 * Payload used to create a purchase item.
 */
export interface PurchaseItemCreate {
  purchase_order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

/**
 * Payload used to update a purchase item.
 *
 * Kept separate from PurchaseItemCreate so the
 * service can evolve independently if the backend
 * later differentiates create/update validation.
 */
export interface PurchaseItemUpdate {
  purchase_order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
}


/**
 * --------------------------------------------------
 * Get All Purchase Items
 * --------------------------------------------------
 */
export const getPurchaseItems =
  async (): Promise<PurchaseItem[]> => {
    const response =
      await api.get<PurchaseItem[]>(
        "/purchase-items/"
      );

    return response.data;
  };


/**
 * --------------------------------------------------
 * Get Purchase Item By ID
 * --------------------------------------------------
 */
export const getPurchaseItemById =
  async (
    purchaseItemId: number
  ): Promise<PurchaseItem> => {
    const response =
      await api.get<PurchaseItem>(
        `/purchase-items/${purchaseItemId}`
      );

    return response.data;
  };


/**
 * --------------------------------------------------
 * Create Purchase Item
 * --------------------------------------------------
 *
 * Admin and Manager only.
 */
export const createPurchaseItem =
  async (
    purchaseItem: PurchaseItemCreate
  ): Promise<PurchaseItem> => {
    const response =
      await api.post<PurchaseItem>(
        "/purchase-items/",
        purchaseItem
      );

    return response.data;
  };


/**
 * --------------------------------------------------
 * Update Purchase Item
 * --------------------------------------------------
 *
 * Admin and Manager only.
 */
export const updatePurchaseItem =
  async (
    purchaseItemId: number,
    purchaseItem: PurchaseItemUpdate
  ): Promise<PurchaseItem> => {
    const response =
      await api.put<PurchaseItem>(
        `/purchase-items/${purchaseItemId}`,
        purchaseItem
      );

    return response.data;
  };


/**
 * --------------------------------------------------
 * Delete Purchase Item
 * --------------------------------------------------
 *
 * Admin and Manager only.
 */
export const deletePurchaseItem =
  async (
    purchaseItemId: number
  ): Promise<void> => {
    await api.delete(
      `/purchase-items/${purchaseItemId}`
    );
  };