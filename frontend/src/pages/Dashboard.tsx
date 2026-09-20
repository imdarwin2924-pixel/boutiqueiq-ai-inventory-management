import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  getDashboardSummary,
} from "../services/dashboardService";

import type {
  DashboardResponse,
} from "../services/dashboardService";

import { useAuth } from "../hooks/useAuth";


function Dashboard() {
  // ==================================================
  // AUTH / ROLE
  // ==================================================

  const {
    isAdmin,
    isManager,
    isStaff,
  } = useAuth();


  // ==================================================
  // DASHBOARD DATA
  // ==================================================

  const [
    dashboard,
    setDashboard,
  ] = useState<DashboardResponse | null>(null);


  // ==================================================
  // UI STATE
  // ==================================================

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");


  // ==================================================
  // INITIAL DASHBOARD LOAD
  // ==================================================
  //
  // Important:
  // The initial loading state is already true.
  // We do not call setLoading(true) synchronously
  // inside useEffect.
  //

  useEffect(() => {
    const loadInitialDashboard =
      async () => {
        try {
          const data =
            await getDashboardSummary();

          setDashboard(data);
          setError("");

        } catch (error) {
          console.error(
            "Failed to load dashboard data:",
            error
          );

          setError(
            "Unable to load dashboard data. Please try again."
          );

        } finally {
          setLoading(false);
        }
      };

    void loadInitialDashboard();
  }, []);


  // ==================================================
  // RETRY DASHBOARD LOAD
  // ==================================================

  const handleRetry =
    async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getDashboardSummary();

        setDashboard(data);

      } catch (error) {
        console.error(
          "Failed to load dashboard data:",
          error
        );

        setError(
          "Unable to load dashboard data. Please try again."
        );

      } finally {
        setLoading(false);
      }
    };


  // ==================================================
  // INITIAL LOADING STATE
  // ==================================================

  if (
    loading &&
    !dashboard
  ) {
    return (
      <div className="dashboard">

        <div className="dashboard-header">

          <div>

            <h1>
              Dashboard
            </h1>

            <p>
              Overview of your boutique
              business.
            </p>

          </div>

        </div>


        <div
          className="empty-state"
          style={{
            marginTop: "20px",
            padding: "40px",
            textAlign: "center",
          }}
        >

          <p>
            Loading dashboard...
          </p>

        </div>

      </div>
    );
  }


  // ==================================================
  // INITIAL ERROR STATE
  // ==================================================

  if (
    error &&
    !dashboard
  ) {
    return (
      <div className="dashboard">

        <div className="dashboard-header">

          <div>

            <h1>
              Dashboard
            </h1>

            <p>
              Overview of your boutique
              business.
            </p>

          </div>

        </div>


        <div
          className="dashboard-error"
          style={{
            marginTop: "20px",
            padding: "20px",
            textAlign: "center",
          }}
        >

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={() => {
              void handleRetry();
            }}
            style={{
              marginTop: "12px",
              padding: "10px 18px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Retry
          </button>

        </div>

      </div>
    );
  }


  // ==================================================
  // DASHBOARD SECTIONS
  // ==================================================

  const summary =
    dashboard?.summary;

  const inventory =
    dashboard?.inventory;

  const stockMovement =
    dashboard?.stock_movement;

  const purchases =
    dashboard?.purchases;

  const alerts =
    dashboard?.alerts;

  const recentSales =
    dashboard?.recent_sales ?? [];

  const recentStockMovements =
    dashboard?.recent_stock_movements ?? [];

  const recentPurchaseOrders =
    dashboard?.recent_purchase_orders ?? [];


  // ==================================================
  // PRODUCT NAME
  // ==================================================

  const getProductName = (
    productId: number
  ) => {
    return `Product #${productId}`;
  };


  // ==================================================
  // COMBINED STOCK ALERTS
  // ==================================================

  const stockAlerts = [
    ...(alerts?.out_of_stock_items ?? []),
    ...(alerts?.low_stock_items ?? []),
  ].slice(0, 5);


  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="dashboard">

      {/* ============================================ */}
      {/* DASHBOARD HEADER */}
      {/* ============================================ */}

      <div className="dashboard-header">

        <div>

          <h1>
            Dashboard
          </h1>

          <p>
            Overview of your boutique
            business.
          </p>

        </div>

      </div>


      {/* ============================================ */}
      {/* BACKGROUND ERROR */}
      {/* ============================================ */}

      {error && dashboard && (
        <div
          className="dashboard-error"
          style={{
            marginTop: "20px",
          }}
        >

          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={() => {
              void handleRetry();
            }}
            style={{
              marginLeft: "12px",
              padding: "6px 12px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Retry
          </button>

        </div>
      )}


      {/* ============================================ */}
      {/* BUSINESS SUMMARY */}
      {/* ============================================ */}

      <section className="summary-grid">

        {/* Total Products */}
        <div className="summary-card">

          <span className="summary-label">
            Total Products
          </span>

          <strong className="summary-value">
            {
              loading
                ? "..."
                : (
                    summary?.total_products ?? 0
                  )
            }
          </strong>

          <span className="summary-description">
            Products in catalog
          </span>

        </div>


        {/* Inventory Items */}
        <div className="summary-card">

          <span className="summary-label">
            Inventory Items
          </span>

          <strong className="summary-value">
            {
              loading
                ? "..."
                : (
                    summary?.total_inventory_items ?? 0
                  )
            }
          </strong>

          <span className="summary-description">
            Inventory records
          </span>

        </div>


        {/* Customers */}
        <div className="summary-card">

          <span className="summary-label">
            Customers
          </span>

          <strong className="summary-value">
            {
              loading
                ? "..."
                : (
                    summary?.total_customers ?? 0
                  )
            }
          </strong>

          <span className="summary-description">
            Registered customers
          </span>

        </div>


        {/* Total Sales */}
        <div className="summary-card">

          <span className="summary-label">
            Total Sales
          </span>

          <strong className="summary-value">
            {
              loading
                ? "..."
                : `₹${(
                    summary?.total_sales ?? 0
                  ).toLocaleString(
                    "en-IN"
                  )}`
            }
          </strong>

          <span className="summary-description">
            Total recorded sales
          </span>

        </div>

      </section>


      {/* ============================================ */}
      {/* STOCK STATUS SUMMARY */}
      {/* ============================================ */}

      <section
        className="summary-grid"
        style={{
          marginTop: "20px",
        }}
      >

        {/* In Stock */}
        <div className="summary-card">

          <span className="summary-label">
            In Stock
          </span>

          <strong className="summary-value">
            {
              loading
                ? "..."
                : (
                    inventory?.in_stock ?? 0
                  )
            }
          </strong>

          <span className="summary-description">
            Healthy inventory
          </span>

        </div>


        {/* Low Stock */}
        <div className="summary-card">

          <span className="summary-label">
            Low Stock
          </span>

          <strong className="summary-value">
            {
              loading
                ? "..."
                : (
                    inventory?.low_stock ?? 0
                  )
            }
          </strong>

          <span className="summary-description">
            Need replenishment
          </span>

        </div>


        {/* Out of Stock */}
        <div className="summary-card">

          <span className="summary-label">
            Out of Stock
          </span>

          <strong className="summary-value">
            {
              loading
                ? "..."
                : (
                    inventory?.out_of_stock ?? 0
                  )
            }
          </strong>

          <span className="summary-description">
            Currently unavailable
          </span>

        </div>

      </section>


      {/* ============================================ */}
      {/* INVENTORY ANALYTICS */}
      {/* ============================================ */}

      <section
        className="summary-grid"
        style={{
          marginTop: "20px",
        }}
      >

        {/* Total Stock Units */}
        <div className="summary-card">

          <span className="summary-label">
            Total Stock Units
          </span>

          <strong className="summary-value">
            {
              loading
                ? "..."
                : (
                    inventory?.total_stock_units ?? 0
                  ).toLocaleString(
                    "en-IN"
                  )
            }
          </strong>

          <span className="summary-description">
            Current physical stock
          </span>

        </div>


        {/* Inventory Value */}
        <div className="summary-card">

          <span className="summary-label">
            Inventory Value
          </span>

          <strong className="summary-value">
            {
              loading
                ? "..."
                : `₹${(
                    inventory?.inventory_value ?? 0
                  ).toLocaleString(
                    "en-IN",
                    {
                      maximumFractionDigits: 2,
                    }
                  )}`
            }
          </strong>

          <span className="summary-description">
            Based on purchase price
          </span>

        </div>

      </section>


      {/* ============================================ */}
      {/* STOCK MOVEMENT SUMMARY */}
      {/* ============================================ */}

      <section
        className="summary-grid"
        style={{
          marginTop: "20px",
        }}
      >

        {/* Total Stock IN */}
        <div className="summary-card">

          <span className="summary-label">
            Total Stock IN
          </span>

          <strong className="summary-value">
            {
              loading
                ? "..."
                : `+${
                    (
                      stockMovement?.total_stock_in ?? 0
                    ).toLocaleString(
                      "en-IN"
                    )
                  }`
            }
          </strong>

          <span className="summary-description">
            Units received
          </span>

        </div>


        {/* Total Stock OUT */}
        <div className="summary-card">

          <span className="summary-label">
            Total Stock OUT
          </span>

          <strong className="summary-value">
            {
              loading
                ? "..."
                : `-${
                    (
                      stockMovement?.total_stock_out ?? 0
                    ).toLocaleString(
                      "en-IN"
                    )
                  }`
            }
          </strong>

          <span className="summary-description">
            Units issued
          </span>

        </div>


        {/* Net Stock Movement */}
        <div className="summary-card">

          <span className="summary-label">
            Net Stock Movement
          </span>

          <strong className="summary-value">
            {
              loading
                ? "..."
                : (
                    stockMovement?.net_stock_movement ?? 0
                  ).toLocaleString(
                    "en-IN"
                  )
            }
          </strong>

          <span className="summary-description">
            IN minus OUT
          </span>

        </div>

      </section>


      {/* ============================================ */}
      {/* PURCHASE ANALYTICS */}
      {/* ============================================ */}

      <section
        className="summary-grid"
        style={{
          marginTop: "20px",
        }}
      >

        {/* Purchase Orders */}
        <div className="summary-card">

          <span className="summary-label">
            Purchase Orders
          </span>

          <strong className="summary-value">
            {
              loading
                ? "..."
                : (
                    purchases?.total_purchase_orders ?? 0
                  )
            }
          </strong>

          <span className="summary-description">
            Total purchase orders
          </span>

        </div>


        {/* Purchase Value */}
        <div className="summary-card">

          <span className="summary-label">
            Purchase Value
          </span>

          <strong className="summary-value">
            {
              loading
                ? "..."
                : `₹${(
                    purchases?.total_purchase_value ?? 0
                  ).toLocaleString(
                    "en-IN",
                    {
                      maximumFractionDigits: 2,
                    }
                  )}`
            }
          </strong>

          <span className="summary-description">
            Total purchase value
          </span>

        </div>


        {/* Pending Purchases */}
        <div className="summary-card">

          <span className="summary-label">
            Pending Purchases
          </span>

          <strong className="summary-value">
            {
              loading
                ? "..."
                : (
                    purchases?.pending_purchase_orders ?? 0
                  )
            }
          </strong>

          <span className="summary-description">
            Orders awaiting completion
          </span>

        </div>


        {/* Completed Purchases */}
        <div className="summary-card">

          <span className="summary-label">
            Completed Purchases
          </span>

          <strong className="summary-value">
            {
              loading
                ? "..."
                : (
                    purchases?.completed_purchase_orders ?? 0
                  )
            }
          </strong>

          <span className="summary-description">
            Completed or received orders
          </span>

        </div>

      </section>


      {/* ============================================ */}
      {/* QUICK ACTIONS */}
      {/* ============================================ */}

      <section className="quick-actions">

        <div className="quick-actions-header">

          <div>

            <h2>
              Quick Actions
            </h2>

            <p>
              Common boutique operations
            </p>

          </div>

        </div>


        <div className="quick-actions-grid">

          {/* Admin / Manager */}
          {(isAdmin || isManager) && (
            <>

              {/* Add Product */}
              <Link
                to="/products"
                className="quick-action"
              >

                <span className="quick-action-icon">
                  +
                </span>

                <div>

                  <strong>
                    Add Product
                  </strong>

                  <span>
                    Create a new product
                  </span>

                </div>

              </Link>


              {/* Add Customer */}
              <Link
                to="/customers"
                className="quick-action"
              >

                <span className="quick-action-icon">
                  +
                </span>

                <div>

                  <strong>
                    Add Customer
                  </strong>

                  <span>
                    Register a customer
                  </span>

                </div>

              </Link>

            </>
          )}


          {/* Sale */}
          {(isAdmin ||
            isManager ||
            isStaff) && (

            <Link
              to="/sales"
              className="quick-action"
            >

              <span className="quick-action-icon">
                ₹
              </span>

              <div>

                <strong>
                  Record Sale
                </strong>

                <span>
                  Create a sales transaction
                </span>

              </div>

            </Link>

          )}


          {/* Purchase */}
          {(isAdmin || isManager) && (

            <Link
              to="/purchases"
              className="quick-action"
            >

              <span className="quick-action-icon">
                +
              </span>

              <div>

                <strong>
                  Create Purchase
                </strong>

                <span>
                  Create a purchase order
                </span>

              </div>

            </Link>

          )}

        </div>

      </section>


      {/* ============================================ */}
      {/* RECENT SALES + STOCK ALERTS */}
      {/* ============================================ */}

      <section className="dashboard-grid">

        {/* Recent Sales */}
        <div className="dashboard-panel">

          <div className="panel-header">

            <h2>
              Recent Sales
            </h2>

            <span>
              Latest transactions
            </span>

          </div>


          {recentSales.length === 0 ? (

            <div className="empty-state">

              <p>
                {
                  loading
                    ? "Loading sales..."
                    : "No sales recorded yet."
                }
              </p>

            </div>

          ) : (

            <div className="sales-list">

              {recentSales.map(
                (sale) => (

                  <div
                    className="sale-row"
                    key={sale.sale_id}
                  >

                    <div>

                      <strong>
                        {
                          sale.invoice_number
                        }
                      </strong>

                      <span>
                        {
                          new Date(
                            sale.sale_date
                          ).toLocaleDateString(
                            "en-IN"
                          )
                        }
                      </span>

                    </div>

                    <strong>
                      ₹
                      {
                        Number(
                          sale.total_amount
                        ).toLocaleString(
                          "en-IN"
                        )
                      }
                    </strong>

                  </div>

                )
              )}

            </div>

          )}

        </div>


        {/* Stock Alerts */}
        <div className="dashboard-panel">

          <div className="panel-header">

            <div>

              <h2>
                Stock Alerts
              </h2>

              <span>
                Inventory alerts
              </span>

            </div>

          </div>


          {stockAlerts.length === 0 ? (

            <div className="empty-state">

              <p>
                {
                  loading
                    ? "Loading alerts..."
                    : "No stock alerts."
                }
              </p>

            </div>

          ) : (

            <div className="stock-list">

              {stockAlerts.map(
                (item) => {

                  const isOutOfStock =
                    item.status ===
                    "OUT_OF_STOCK";

                  return (

                    <div
                      className="stock-row"
                      key={
                        item.inventory_id
                      }
                    >

                      <div>

                        <strong>
                          {
                            getProductName(
                              item.product_id
                            )
                          }
                        </strong>

                        <span>
                          {
                            isOutOfStock
                              ? "Out of stock"
                              : `Minimum: ${item.minimum_stock}`
                          }
                        </span>

                      </div>

                      <strong className="stock-warning">
                        {
                          item.quantity
                        }
                      </strong>

                    </div>

                  );
                }
              )}

            </div>

          )}

        </div>

      </section>


      {/* ============================================ */}
      {/* RECENT PURCHASES + INVENTORY HEALTH */}
      {/* ============================================ */}

      <section
        className="dashboard-grid"
        style={{
          marginTop: "20px",
        }}
      >

        {/* Recent Purchase Orders */}
        <div className="dashboard-panel">

          <div className="panel-header">

            <div>

              <h2>
                Recent Purchases
              </h2>

              <span>
                Latest purchase orders
              </span>

            </div>

            <Link
              to="/purchases"
              style={{
                textDecoration:
                  "none",
              }}
            >
              View Purchases
            </Link>

          </div>


          {recentPurchaseOrders.length === 0 ? (

            <div className="empty-state">

              <p>
                {
                  loading
                    ? "Loading purchases..."
                    : "No purchase orders recorded yet."
                }
              </p>

            </div>

          ) : (

            <div className="sales-list">

              {recentPurchaseOrders.map(
                (purchase) => (

                  <div
                    className="sale-row"
                    key={
                      purchase.purchase_order_id
                    }
                  >

                    <div>

                      <strong>
                        {
                          purchase.order_number
                        }
                      </strong>

                      <span>
                        {
                          purchase.status
                        }{" "}
                        •{" "}
                        {
                          new Date(
                            purchase.order_date
                          ).toLocaleDateString(
                            "en-IN"
                          )
                        }
                      </span>

                    </div>

                    <strong>
                      ₹
                      {
                        Number(
                          purchase.total_amount
                        ).toLocaleString(
                          "en-IN"
                        )
                      }
                    </strong>

                  </div>

                )
              )}

            </div>

          )}

        </div>


        {/* Inventory Health */}
        <div className="dashboard-panel">

          <div className="panel-header">

            <div>

              <h2>
                Inventory Health
              </h2>

              <span>
                Current stock condition
              </span>

            </div>

          </div>


          <div className="stock-list">

            <div className="stock-row">

              <div>

                <strong>
                  In Stock
                </strong>

                <span>
                  Healthy inventory
                </span>

              </div>

              <strong>
                {
                  inventory?.in_stock ?? 0
                }
              </strong>

            </div>


            <div className="stock-row">

              <div>

                <strong>
                  Low Stock
                </strong>

                <span>
                  Replenishment needed
                </span>

              </div>

              <strong className="stock-warning">
                {
                  inventory?.low_stock ?? 0
                }
              </strong>

            </div>


            <div className="stock-row">

              <div>

                <strong>
                  Out of Stock
                </strong>

                <span>
                  No units available
                </span>

              </div>

              <strong className="stock-warning">
                {
                  inventory?.out_of_stock ?? 0
                }
              </strong>

            </div>

          </div>

        </div>

      </section>


      {/* ============================================ */}
      {/* RECENT STOCK MOVEMENTS */}
      {/* ============================================ */}

      <section
        className="dashboard-grid"
        style={{
          marginTop: "20px",
        }}
      >

        {/* Recent Stock Movements */}
        <div className="dashboard-panel">

          <div className="panel-header">

            <div>

              <h2>
                Recent Stock Movements
              </h2>

              <span>
                Latest inventory activity
              </span>

            </div>

            <Link
              to="/stock-history"
              style={{
                textDecoration:
                  "none",
              }}
            >
              View History
            </Link>

          </div>


          {recentStockMovements.length === 0 ? (

            <div className="empty-state">

              <p>
                {
                  loading
                    ? "Loading stock movements..."
                    : "No stock movements recorded yet."
                }
              </p>

            </div>

          ) : (

            <div className="stock-list">

              {recentStockMovements.map(
                (transaction) => {

                  const isStockIn =
                    transaction.transaction_type ===
                    "IN";

                  return (

                    <div
                      className="stock-row"
                      key={
                        transaction.transaction_id
                      }
                    >

                      <div>

                        <strong>
                          {
                            getProductName(
                              transaction.product_id
                            )
                          }
                        </strong>

                        <span>
                          {
                            transaction.reason ??
                            "Stock movement"
                          }{" "}
                          •{" "}
                          {
                            new Date(
                              transaction.transaction_date
                            ).toLocaleDateString(
                              "en-IN"
                            )
                          }
                        </span>

                      </div>


                      <strong
                        className={
                          isStockIn
                            ? "stock-success"
                            : "stock-warning"
                        }
                      >
                        {
                          isStockIn
                            ? "+"
                            : "-"
                        }
                        {
                          transaction.quantity
                        }
                      </strong>

                    </div>

                  );
                }
              )}

            </div>

          )}

        </div>


        {/* Purchase Status */}
        <div className="dashboard-panel">

          <div className="panel-header">

            <div>

              <h2>
                Purchase Status
              </h2>

              <span>
                Current purchase order status
              </span>

            </div>

          </div>


          <div className="stock-list">

            <div className="stock-row">

              <div>

                <strong>
                  Pending
                </strong>

                <span>
                  Awaiting completion
                </span>

              </div>

              <strong>
                {
                  purchases?.pending_purchase_orders ?? 0
                }
              </strong>

            </div>


            <div className="stock-row">

              <div>

                <strong>
                  Completed
                </strong>

                <span>
                  Completed or received
                </span>

              </div>

              <strong>
                {
                  purchases?.completed_purchase_orders ?? 0
                }
              </strong>

            </div>


            <div className="stock-row">

              <div>

                <strong>
                  Cancelled
                </strong>

                <span>
                  Cancelled purchase orders
                </span>

              </div>

              <strong className="stock-warning">
                {
                  purchases?.cancelled_purchase_orders ?? 0
                }
              </strong>

            </div>

          </div>

        </div>

      </section>


      {/* ============================================ */}
      {/* STOCK ALERT LINK */}
      {/* ============================================ */}

      {(
        inventory?.low_stock ?? 0
      ) > 0 ||
      (
        inventory?.out_of_stock ?? 0
      ) > 0 ? (

        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
          }}
        >

          <Link
            to="/inventory"
            className="quick-action"
            style={{
              display:
                "inline-flex",
              width: "auto",
              padding:
                "12px 20px",
            }}
          >
            View Inventory Alerts
          </Link>

        </div>

      ) : null}

    </div>
  );
}


export default Dashboard;