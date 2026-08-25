import api from "./api";

export interface Customer {
  customer_id: number;
  customer_name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}

export interface CustomerCreate {
  customer_name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export const getCustomers = async (): Promise<Customer[]> => {
  const response = await api.get<Customer[]>("/customers/");
  return response.data;
};

export const getCustomerById = async (
  customerId: number
): Promise<Customer> => {
  const response = await api.get<Customer>(
    `/customers/${customerId}`
  );

  return response.data;
};

export const createCustomer = async (
  customer: CustomerCreate
): Promise<Customer> => {
  const response = await api.post<Customer>(
    "/customers/",
    customer
  );

  return response.data;
};

export const updateCustomer = async (
  customerId: number,
  customer: CustomerCreate
): Promise<Customer> => {
  const response = await api.put<Customer>(
    `/customers/${customerId}`,
    customer
  );

  return response.data;
};

export const deleteCustomer = async (
  customerId: number
): Promise<void> => {
  await api.delete(`/customers/${customerId}`);
};