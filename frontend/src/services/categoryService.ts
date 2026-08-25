import api from "./api";

export interface Category {
  category_id: number;
  category_name: string;
  description?: string | null;
}

export interface CategoryCreate {
  category_name: string;
  description?: string;
}

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get<Category[]>("/categories/");
  return response.data;
};

export const getCategoryById = async (
  categoryId: number
): Promise<Category> => {
  const response = await api.get<Category>(
    `/categories/${categoryId}`
  );

  return response.data;
};

export const createCategory = async (
  category: CategoryCreate
): Promise<Category> => {
  const response = await api.post<Category>(
    "/categories/",
    category
  );

  return response.data;
};

export const updateCategory = async (
  categoryId: number,
  category: CategoryCreate
): Promise<Category> => {
  const response = await api.put<Category>(
    `/categories/${categoryId}`,
    category
  );

  return response.data;
};

export const deleteCategory = async (
  categoryId: number
): Promise<void> => {
  await api.delete(`/categories/${categoryId}`);
};