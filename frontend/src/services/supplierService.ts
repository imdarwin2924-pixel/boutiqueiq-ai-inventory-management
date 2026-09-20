import api from "./api";

/**
 * --------------------------------------------------
 * Supplier Types
 * --------------------------------------------------
 */

export interface Supplier {
  supplier_id: number;
  supplier_name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
}

export interface SupplierCreate {
  supplier_name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
}

export interface SupplierUpdate {
  supplier_name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
}


/**
 * --------------------------------------------------
 * Get All Suppliers
 * --------------------------------------------------
 */
export const getSuppliers = async (): Promise<Supplier[]> => {
  const response = await api.get<Supplier[]>("/suppliers/");

  return response.data;
};


/**
 * --------------------------------------------------
 * Get Supplier By ID
 * --------------------------------------------------
 */
export const getSupplierById = async (
  supplierId: number
): Promise<Supplier> => {
  const response = await api.get<Supplier>(
    `/suppliers/${supplierId}`
  );

  return response.data;
};


/**
 * --------------------------------------------------
 * Create Supplier
 * --------------------------------------------------
 *
 * Admin and Manager only.
 */
export const createSupplier = async (
  supplier: SupplierCreate
): Promise<Supplier> => {
  const response = await api.post<Supplier>(
    "/suppliers/",
    supplier
  );

  return response.data;
};


/**
 * --------------------------------------------------
 * Update Supplier
 * --------------------------------------------------
 *
 * Admin and Manager only.
 */
export const updateSupplier = async (
  supplierId: number,
  supplier: SupplierUpdate
): Promise<Supplier> => {
  const response = await api.put<Supplier>(
    `/suppliers/${supplierId}`,
    supplier
  );

  return response.data;
};


/**
 * --------------------------------------------------
 * Delete Supplier
 * --------------------------------------------------
 *
 * Admin and Manager only.
 */
export const deleteSupplier = async (
  supplierId: number
): Promise<void> => {
  await api.delete(`/suppliers/${supplierId}`);
};