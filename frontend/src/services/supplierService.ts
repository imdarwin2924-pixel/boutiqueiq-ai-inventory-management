import api from "./api";

export interface Supplier {
  supplier_id: number;
  supplier_name: string;
  contact_person?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}

export interface SupplierCreate {
  supplier_name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export const getSuppliers = async (): Promise<Supplier[]> => {
  const response = await api.get<Supplier[]>("/suppliers/");
  return response.data;
};

export const getSupplierById = async (
  supplierId: number
): Promise<Supplier> => {
  const response = await api.get<Supplier>(
    `/suppliers/${supplierId}`
  );

  return response.data;
};

export const createSupplier = async (
  supplier: SupplierCreate
): Promise<Supplier> => {
  const response = await api.post<Supplier>(
    "/suppliers/",
    supplier
  );

  return response.data;
};

export const updateSupplier = async (
  supplierId: number,
  supplier: SupplierCreate
): Promise<Supplier> => {
  const response = await api.put<Supplier>(
    `/suppliers/${supplierId}`,
    supplier
  );

  return response.data;
};

export const deleteSupplier = async (
  supplierId: number
): Promise<void> => {
  await api.delete(`/suppliers/${supplierId}`);
};