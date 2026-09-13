import api from "./api";

export interface Inventory {
  inventory_id: number;
  product_id: number;
  quantity: number;
  minimum_stock: number;
  location: string;
  last_updated: string;
}

export interface InventoryCreate {
  product_id: number;
  quantity: number;
  minimum_stock: number;
  location: string;
}

export interface InventoryUpdate {
  product_id: number;
  quantity: number;
  minimum_stock: number;
  location: string;
}

/*
 * Get all inventory records
 */
export const getInventory = async (): Promise<Inventory[]> => {
  const response = await api.get<Inventory[]>("/inventory/");
  return response.data;
};

/*
 * Get inventory by ID
 */
export const getInventoryById = async (
  inventoryId: number
): Promise<Inventory> => {
  const response = await api.get<Inventory>(
    `/inventory/${inventoryId}`
  );

  return response.data;
};

/*
 * Create inventory
 */
export const createInventory = async (
  inventory: InventoryCreate
): Promise<Inventory> => {
  const response = await api.post<Inventory>(
    "/inventory/",
    inventory
  );

  return response.data;
};

/*
 * Update inventory
 */
export const updateInventory = async (
  inventoryId: number,
  inventory: InventoryUpdate
): Promise<Inventory> => {
  const response = await api.put<Inventory>(
    `/inventory/${inventoryId}`,
    inventory
  );

  return response.data;
};

/*
 * Delete inventory
 */
export const deleteInventory = async (
  inventoryId: number
): Promise<void> => {
  await api.delete(`/inventory/${inventoryId}`);
};  