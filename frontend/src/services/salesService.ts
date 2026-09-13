import api from "./api";

export interface Sale {
  sale_id: number;
  customer_id: number;
  user_id: number;
  invoice_number: string;
  sale_date: string;
  total_amount: number;
  payment_method: string;
}

export interface SaleCreate {
  customer_id: number;
  user_id: number;
  invoice_number: string;
  sale_date: string;
  total_amount: number;
  payment_method: string;
}

export const getSales = async (): Promise<Sale[]> => {
  const response = await api.get<Sale[]>("/sales/");
  return response.data;
};

export const getSaleById = async (
  saleId: number
): Promise<Sale> => {
  const response = await api.get<Sale>(
    `/sales/${saleId}`
  );

  return response.data;
};

export const createSale = async (
  sale: SaleCreate
): Promise<Sale> => {
  const response = await api.post<Sale>(
    "/sales/",
    sale
  );

  return response.data;
};

export const updateSale = async (
  saleId: number,
  sale: SaleCreate
): Promise<Sale> => {
  const response = await api.put<Sale>(
    `/sales/${saleId}`,
    sale
  );

  return response.data;
};

export const deleteSale = async (
  saleId: number
): Promise<void> => {
  await api.delete(`/sales/${saleId}`);
};