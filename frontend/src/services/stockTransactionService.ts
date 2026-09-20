import api from "./api";

export interface StockTransaction {
  transaction_id: number;
  product_id: number;
  transaction_type: "IN" | "OUT";
  quantity: number;
  transaction_date: string;
  reason: string;
}

export interface StockTransactionCreate {
  product_id: number;
  transaction_type: "IN" | "OUT";
  quantity: number;
  transaction_date: string;
  reason: string;
}

export interface StockTransactionFilters {
  product_id?: number;
  transaction_type?: "IN" | "OUT";
  start_date?: string;
  end_date?: string;
}

export const getStockTransactions = async (
  filters?: StockTransactionFilters
): Promise<StockTransaction[]> => {
  const response = await api.get<StockTransaction[]>(
    "/stock-transactions/",
    {
      params: filters,
    }
  );

  return response.data;
};

export const getStockTransactionById = async (
  transactionId: number
): Promise<StockTransaction> => {
  const response = await api.get<StockTransaction>(
    `/stock-transactions/${transactionId}`
  );

  return response.data;
};

export const createStockTransaction = async (
  transaction: StockTransactionCreate
): Promise<StockTransaction> => {
  const response = await api.post<StockTransaction>(
    "/stock-transactions/",
    transaction
  );

  return response.data;
};

export const updateStockTransaction = async (
  transactionId: number,
  transaction: StockTransactionCreate
): Promise<StockTransaction> => {
  const response = await api.put<StockTransaction>(
    `/stock-transactions/${transactionId}`,
    transaction
  );

  return response.data;
};

export const deleteStockTransaction = async (
  transactionId: number
): Promise<void> => {
  await api.delete(
    `/stock-transactions/${transactionId}`
  );
};