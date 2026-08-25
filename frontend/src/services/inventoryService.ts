import api from "./api";

export interface Inventory {
  inventory_id: number;
  product_id: number;
  quantity: number;
  minimum_stock: number;
  location?: string | null;
  last_updated?: string | null;
}

export interface InventoryCreate {
  product_id: number;
  quantity: number;
  minimum_stock?: number;
  location?: string;
}

export const getInventory = async (): Promise<Inventory[]> => {
  const response = await api.get<Inventory[]>("/inventory/");
  return response.data;
};

export const getInventoryById = async (
  inventoryId: number
): Promise<Inventory> => {
  const response = await api.get<Inventory>(
    `/inventory/${inventoryId}`
  );

  return response.data;
};

export const createInventory = async (
  inventory: InventoryCreate
): Promise<Inventory> => {
  const response = await api.post<Inventory>(
    "/inventory/",
    inventory
  );

  return response.data;
};

export const updateInventory = async (
  inventoryId: number,
  inventory: InventoryCreate
): Promise<Inventory> => {
  const response = await api.put<Inventory>(
    `/inventory/${inventoryId}`,
    inventory
  );

  return response.data;
};

export const deleteInventory = async (
  inventoryId: number
): Promise<void> => {
  await api.delete(`/inventory/${inventoryId}`);
};