import api from "./api";

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

/*
 * Get all suppliers
 */
export const getSuppliers = async (): Promise<Supplier[]> => {
  const response = await api.get<Supplier[]>("/suppliers/");
  return response.data;
};

/*
 * Get supplier by ID
 */
export const getSupplierById = async (
  supplierId: number
): Promise<Supplier> => {
  const response = await api.get<Supplier>(
    `/suppliers/${supplierId}`
  );

  return response.data;
};

/*
 * Create supplier
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

/*
 * Update supplier
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

/*
 * Delete supplier
 */
export const deleteSupplier = async (
  supplierId: number
): Promise<void> => {
  await api.delete(`/suppliers/${supplierId}`);
};