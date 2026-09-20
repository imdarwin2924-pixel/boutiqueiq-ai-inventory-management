import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getStockTransactions,
} from "../services/stockTransactionService";

import type {
  StockTransaction,
  StockTransactionFilters,
} from "../services/stockTransactionService";

import {
  getProducts,
} from "../services/productService";

import type {
  Product,
} from "../services/productService";


function StockHistory() {
  const [transactions, setTransactions] =
    useState<StockTransaction[]>([]);

  const [products, setProducts] =
    useState<Product[]>([]);

  const [selectedProduct, setSelectedProduct] =
    useState<string>("");

  const [transactionType, setTransactionType] =
    useState<string>("");

  const [startDate, setStartDate] =
    useState<string>("");

  const [endDate, setEndDate] =
    useState<string>("");

  const [loading, setLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<string>("");

  const [hasLoaded, setHasLoaded] =
    useState<boolean>(false);


  // --------------------------------------------------
  // Product lookup map
  // --------------------------------------------------

  const productMap = useMemo(() => {
    const map = new Map<number, Product>();

    products.forEach((product) => {
      map.set(
        product.product_id,
        product
      );
    });

    return map;
  }, [products]);


  // --------------------------------------------------
  // Load products
  // --------------------------------------------------

  const loadProducts = useCallback(
    async () => {
      try {
        const data =
          await getProducts();

        setProducts(data);
      } catch (error: unknown) {
        console.error(
          "Failed to load products:",
          error
        );
      }
    },
    []
  );


  // --------------------------------------------------
  // Load stock transactions
  // --------------------------------------------------

  const loadTransactions = useCallback(
    async (
      filters: StockTransactionFilters = {}
    ) => {
      try {
        setError("");

        const data =
          await getStockTransactions(
            filters
          );

        setTransactions(data);
        setHasLoaded(true);
      } catch (error: unknown) {
        console.error(
          "Failed to load stock transactions:",
          error
        );

        let message =
          "Failed to load stock transaction history.";

        if (
          typeof error === "object" &&
          error !== null &&
          "response" in error
        ) {
          const response =
            (
              error as {
                response?: {
                  data?: {
                    detail?: string;
                  };
                };
              }
            ).response;

          const detail =
            response?.data?.detail;

          if (
            typeof detail === "string" &&
            detail.trim() !== ""
          ) {
            message = detail;
          }
        }

        setError(message);
        setTransactions([]);
        setHasLoaded(true);
      }
    },
    []
  );


  // --------------------------------------------------
  // Initial page load
  // --------------------------------------------------

  useEffect(() => {
    const loadInitialData =
      async () => {
        await Promise.all([
          loadProducts(),
          loadTransactions(),
        ]);

        setLoading(false);
      };

    loadInitialData();
  }, [
    loadProducts,
    loadTransactions,
  ]);


  // --------------------------------------------------
  // Build filters
  // --------------------------------------------------

  const buildFilters =
    (): StockTransactionFilters | null => {

      if (
        startDate &&
        endDate &&
        startDate > endDate
      ) {
        setError(
          "Start date cannot be later than end date."
        );

        setTransactions([]);

        return null;
      }

      const filters:
        StockTransactionFilters = {};


      // Product filter
      if (selectedProduct) {
        filters.product_id =
          Number(selectedProduct);
      }


      // Transaction type filter
      if (
        transactionType === "IN" ||
        transactionType === "OUT"
      ) {
        filters.transaction_type =
          transactionType;
      }


      // Start date
      if (startDate) {
        filters.start_date =
          `${startDate}T00:00:00`;
      }


      // End date
      if (endDate) {
        filters.end_date =
          `${endDate}T23:59:59`;
      }


      return filters;
    };


  // --------------------------------------------------
  // Apply filters
  // --------------------------------------------------

  const handleApplyFilters =
    async () => {

      const filters =
        buildFilters();

      if (!filters) {
        setLoading(false);
        return;
      }

      setLoading(true);

      await loadTransactions(
        filters
      );

      setLoading(false);
    };


  // --------------------------------------------------
  // Reset filters
  // --------------------------------------------------

  const handleResetFilters =
    async () => {

      setSelectedProduct("");
      setTransactionType("");
      setStartDate("");
      setEndDate("");

      setLoading(true);

      await loadTransactions();

      setLoading(false);
    };


  // --------------------------------------------------
  // Total Stock IN
  // --------------------------------------------------

  const totalStockIn = useMemo(() => {
    return transactions
      .filter(
        (transaction) =>
          transaction.transaction_type ===
          "IN"
      )
      .reduce(
        (total, transaction) =>
          total + transaction.quantity,
        0
      );
  }, [transactions]);


  // --------------------------------------------------
  // Total Stock OUT
  // --------------------------------------------------

  const totalStockOut = useMemo(() => {
    return transactions
      .filter(
        (transaction) =>
          transaction.transaction_type ===
          "OUT"
      )
      .reduce(
        (total, transaction) =>
          total + transaction.quantity,
        0
      );
  }, [transactions]);


  // --------------------------------------------------
  // Format date/time
  // --------------------------------------------------

  const formatDateTime = (
    dateString: string
  ) => {
    const date =
      new Date(dateString);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return dateString;
    }

    return date.toLocaleString();
  };


  // --------------------------------------------------
  // Product name
  // --------------------------------------------------

  const getProductName = (
    productId: number
  ) => {
    const product =
      productMap.get(productId);

    if (!product) {
      return `Product #${productId}`;
    }

    return product.product_name;
  };


  // --------------------------------------------------
  // Product SKU
  // --------------------------------------------------

  const getProductSku = (
    productId: number
  ) => {
    const product =
      productMap.get(productId);

    return product?.sku || "-";
  };


  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="page-container">

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>
            Stock History
          </h1>

          <p>
            View and filter all stock
            movements
          </p>
        </div>
      </div>


      {/* Filters */}
      <div className="card">

        <div className="card-header">
          <div>
            <h2>
              Filters
            </h2>

            <p>
              Filter stock transactions
              by product, type, or date
            </p>
          </div>
        </div>


        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
          }}
        >

          {/* Product */}
          <div className="form-group">

            <label>
              Product
            </label>

            <select
              value={selectedProduct}
              onChange={(event) =>
                setSelectedProduct(
                  event.target.value
                )
              }
            >
              <option value="">
                All Products
              </option>

              {products.map(
                (product) => (
                  <option
                    key={
                      product.product_id
                    }
                    value={
                      product.product_id
                    }
                  >
                    {product.product_name}
                    {" "}
                    ({product.sku})
                  </option>
                )
              )}
            </select>

          </div>


          {/* Transaction Type */}
          <div className="form-group">

            <label>
              Transaction Type
            </label>

            <select
              value={transactionType}
              onChange={(event) =>
                setTransactionType(
                  event.target.value
                )
              }
            >
              <option value="">
                All Types
              </option>

              <option value="IN">
                Stock IN
              </option>

              <option value="OUT">
                Stock OUT
              </option>
            </select>

          </div>


          {/* Start Date */}
          <div className="form-group">

            <label>
              Start Date
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(event) =>
                setStartDate(
                  event.target.value
                )
              }
            />

          </div>


          {/* End Date */}
          <div className="form-group">

            <label>
              End Date
            </label>

            <input
              type="date"
              value={endDate}
              onChange={(event) =>
                setEndDate(
                  event.target.value
                )
              }
            />

          </div>

        </div>


        {/* Filter Buttons */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "20px",
          }}
        >

          <button
            className="btn btn-primary"
            onClick={
              handleApplyFilters
            }
            disabled={loading}
          >
            Apply Filters
          </button>


          <button
            className="btn btn-secondary"
            onClick={
              handleResetFilters
            }
            disabled={loading}
          >
            Reset
          </button>

        </div>

      </div>


      {/* Error */}
      {error && (
        <div
          className="alert alert-error"
          style={{
            marginTop: "20px",
          }}
        >
          {error}
        </div>
      )}


      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginTop: "20px",
        }}
      >

        {/* Transactions */}
        <div className="card">

          <div className="stat-label">
            Transactions
          </div>

          <div className="stat-value">
            {transactions.length}
          </div>

        </div>


        {/* Stock IN */}
        <div className="card">

          <div className="stat-label">
            Stock IN
          </div>

          <div className="stat-value">
            {totalStockIn}
          </div>

        </div>


        {/* Stock OUT */}
        <div className="card">

          <div className="stat-label">
            Stock OUT
          </div>

          <div className="stat-value">
            {totalStockOut}
          </div>

        </div>

      </div>


      {/* Transaction Table */}
      <div
        className="card"
        style={{
          marginTop: "20px",
        }}
      >

        <div className="card-header">

          <div>

            <h2>
              Transaction History
            </h2>

            <p>
              Stock movements are
              displayed from newest
              to oldest.
            </p>

          </div>

        </div>


        {/* Loading */}
        {loading ? (

          <div
            style={{
              padding: "40px",
              textAlign: "center",
            }}
          >
            Loading stock history...
          </div>

        ) : transactions.length === 0 ? (

          /* Empty */
          <div
            style={{
              padding: "40px",
              textAlign: "center",
            }}
          >
            {hasLoaded
              ? "No stock transactions found for the selected filters."
              : "No stock transactions available."}
          </div>

        ) : (

          /* Table */
          <div
            style={{
              overflowX: "auto",
            }}
          >

            <table>

              <thead>

                <tr>

                  <th>
                    ID
                  </th>

                  <th>
                    Product
                  </th>

                  <th>
                    SKU
                  </th>

                  <th>
                    Type
                  </th>

                  <th>
                    Quantity
                  </th>

                  <th>
                    Date & Time
                  </th>

                  <th>
                    Reason
                  </th>

                </tr>

              </thead>


              <tbody>

                {transactions.map(
                  (transaction) => (

                    <tr
                      key={
                        transaction.transaction_id
                      }
                    >

                      <td>
                        #
                        {
                          transaction.transaction_id
                        }
                      </td>


                      <td>
                        {getProductName(
                          transaction.product_id
                        )}
                      </td>


                      <td>
                        {getProductSku(
                          transaction.product_id
                        )}
                      </td>


                      <td>

                        <span
                          style={{
                            fontWeight: 600,
                            padding:
                              "4px 10px",
                            borderRadius:
                              "6px",
                            display:
                              "inline-block",
                          }}
                        >
                          {
                            transaction.transaction_type
                          }
                        </span>

                      </td>


                      <td>
                        {
                          transaction.quantity
                        }
                      </td>


                      <td>
                        {formatDateTime(
                          transaction.transaction_date
                        )}
                      </td>


                      <td>
                        {
                          transaction.reason
                        }
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default StockHistory; 