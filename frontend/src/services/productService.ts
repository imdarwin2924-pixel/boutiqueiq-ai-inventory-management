import api from "./api";

/**
 * Product returned by the backend.
 *
 * NOTE:
 * stock_quantity is kept for backward compatibility
 * with the existing products table.
 *
 * Operational inventory is managed through:
 * inventory.quantity
 */
export interface Product {
  product_id: number;

  category_id: number;

  product_name: string;
  sku: string;
  brand: string;
  size: string;
  color: string;

  purchase_price: number;
  selling_price: number;

  /*
   * Backward-compatible field.
   *
   * DO NOT use this as the operational
   * inventory source of truth.
   *
   * Inventory.quantity is the operational stock.
   */
  stock_quantity: number;
}

/**
 * Payload used when creating a product.
 *
 * This matches backend ProductCreate exactly.
 */
export interface ProductCreate {
  category_id: number;

  product_name: string;
  sku: string;
  brand: string;
  size: string;
  color: string;

  purchase_price: number;
  selling_price: number;
}

/**
 * Payload used when updating a product.
 *
 * This matches backend ProductUpdate exactly.
 */
export interface ProductUpdate {
  category_id: number;

  product_name: string;
  sku: string;
  brand: string;
  size: string;
  color: string;

  purchase_price: number;
  selling_price: number;
}

/**
 * Get all products.
 */
export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get<Product[]>(
    "/products/"
  );

  return response.data;
};

/**
 * Get a single product by ID.
 */
export const getProductById = async (
  productId: number
): Promise<Product> => {
  const response = await api.get<Product>(
    `/products/${productId}`
  );

  return response.data;
};

/**
 * Create a new product.
 *
 * Admin and Manager only.
 */
export const createProduct = async (
  product: ProductCreate
): Promise<Product> => {
  const response = await api.post<Product>(
    "/products/",
    product
  );

  return response.data;
};

/**
 * Update an existing product.
 *
 * Admin and Manager only.
 */
export const updateProduct = async (
  productId: number,
  product: ProductUpdate
): Promise<Product> => {
  const response = await api.put<Product>(
    `/products/${productId}`,
    product
  );

  return response.data;
};

/**
 * Delete a product.
 *
 * Admin and Manager only.
 */
export const deleteProduct = async (
  productId: number
): Promise<void> => {
  await api.delete(
    `/products/${productId}`
  );
};