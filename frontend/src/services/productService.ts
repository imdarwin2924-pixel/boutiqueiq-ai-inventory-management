import api from "./api";

export interface Product {
  product_id: number;

  product_name: string;
  sku: string;
  brand: string;
  size: string;
  color: string;

  description?: string | null;

  category_id: number;
  supplier_id?: number | null;

  purchase_price: number;
  selling_price: number;

  stock_quantity: number;

  status?: string;
}

export interface ProductCreate {
  product_name: string;

  sku: string;
  brand: string;
  size: string;
  color: string;

  description?: string;

  category_id: number;
  supplier_id?: number;

  purchase_price: number;
  selling_price: number;

  stock_quantity: number;

  status?: string;
}

export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get<Product[]>(
    "/products/"
  );

  return response.data;
};

export const getProductById = async (
  productId: number
): Promise<Product> => {
  const response = await api.get<Product>(
    `/products/${productId}`
  );

  return response.data;
};

export const createProduct = async (
  product: ProductCreate
): Promise<Product> => {
  const response = await api.post<Product>(
    "/products/",
    product
  );

  return response.data;
};

export const updateProduct = async (
  productId: number,
  product: ProductCreate
): Promise<Product> => {
  const response = await api.put<Product>(
    `/products/${productId}`,
    product
  );

  return response.data;
};

export const deleteProduct = async (
  productId: number
): Promise<void> => {
  await api.delete(
    `/products/${productId}`
  );
};