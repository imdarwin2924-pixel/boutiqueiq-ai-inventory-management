import api from "./api";

/**
 * --------------------------------------------------
 * Inventory Types
 * --------------------------------------------------
 */

/**
 * Inventory record returned by the backend.
 *
 * IMPORTANT:
 * inventory.quantity is the operational
 * source of truth for stock.
 */
export interface Inventory {
  inventory_id: number;
  product_id: number;
  quantity: number;
  minimum_stock: number;
  location: string;
  last_updated: string;
}

/**
 * Payload used to create inventory.
 *
 * Matches backend InventoryCreate.
 */
export interface InventoryCreate {
  product_id: number;
  quantity: number;
  minimum_stock: number;
  location: string;
}

/**
 * Payload used to update inventory.
 *
 * Matches backend InventoryUpdate.
 */
export interface InventoryUpdate {
  product_id: number;
  quantity: number;
  minimum_stock: number;
  location: string;
}

/**
 * Inventory status values.
 */
export type InventoryStatus =
  | "IN_STOCK"
  | "LOW_STOCK"
  | "OUT_OF_STOCK";

/**
 * Inventory record with calculated status.
 */
export interface InventoryStatusRecord
  extends Inventory {
  status: InventoryStatus;
}

/**
 * Inventory status summary.
 */
export interface InventoryStatusSummary {
  total_inventory: number;
  in_stock: number;
  low_stock: number;
  out_of_stock: number;
}


/**
 * --------------------------------------------------
 * Get All Inventory
 * --------------------------------------------------
 */
export const getInventory = async (): Promise<
  Inventory[]
> => {
  const response =
    await api.get<Inventory[]>(
      "/inventory/"
    );

  return response.data;
};


/**
 * --------------------------------------------------
 * Get Inventory By ID
 * --------------------------------------------------
 */
export const getInventoryById = async (
  inventoryId: number
): Promise<Inventory> => {
  const response =
    await api.get<Inventory>(
      `/inventory/${inventoryId}`
    );

  return response.data;
};


/**
 * --------------------------------------------------
 * Create Inventory
 * --------------------------------------------------
 *
 * Admin and Manager only.
 */
export const createInventory = async (
  inventory: InventoryCreate
): Promise<Inventory> => {
  const response =
    await api.post<Inventory>(
      "/inventory/",
      inventory
    );

  return response.data;
};


/**
 * --------------------------------------------------
 * Update Inventory
 * --------------------------------------------------
 *
 * Admin and Manager only.
 */
export const updateInventory = async (
  inventoryId: number,
  inventory: InventoryUpdate
): Promise<Inventory> => {
  const response =
    await api.put<Inventory>(
      `/inventory/${inventoryId}`,
      inventory
    );

  return response.data;
};


/**
 * --------------------------------------------------
 * Delete Inventory
 * --------------------------------------------------
 *
 * Admin and Manager only.
 */
export const deleteInventory = async (
  inventoryId: number
): Promise<void> => {
  await api.delete(
    `/inventory/${inventoryId}`
  );
};


/**
 * --------------------------------------------------
 * Get Inventory Status Summary
 * --------------------------------------------------
 */
export const getInventoryStatusSummary =
  async (): Promise<InventoryStatusSummary> => {
    const response =
      await api.get<InventoryStatusSummary>(
        "/inventory/status/summary"
      );

    return response.data;
  };


/**
 * --------------------------------------------------
 * Get IN_STOCK Inventory
 * --------------------------------------------------
 */
export const getInStockInventory =
  async (): Promise<
    InventoryStatusRecord[]
  > => {
    const response =
      await api.get<
        InventoryStatusRecord[]
      >(
        "/inventory/status/in-stock"
      );

    return response.data;
  };


/**
 * --------------------------------------------------
 * Get LOW_STOCK Inventory
 * --------------------------------------------------
 */
export const getLowStockInventory =
  async (): Promise<
    InventoryStatusRecord[]
  > => {
    const response =
      await api.get<
        InventoryStatusRecord[]
      >(
        "/inventory/status/low-stock"
      );

    return response.data;
  };


/**
 * --------------------------------------------------
 * Get OUT_OF_STOCK Inventory
 * --------------------------------------------------
 */
export const getOutOfStockInventory =
  async (): Promise<
    InventoryStatusRecord[]
  > => {
    const response =
      await api.get<
        InventoryStatusRecord[]
      >(
        "/inventory/status/out-of-stock"
      );

    return response.data;
  };