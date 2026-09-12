import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getProducts,
  type Product,
} from "../services/productService";

import {
  getInventory,
  type Inventory,
} from "../services/inventoryService";

import {
  getCustomers,
} from "../services/customerService";

import {
  getSales,
  type Sale,
} from "../services/salesService";

function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [customersCount, setCustomersCount] = useState(0);
  const [sales, setSales] = useState<Sale[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          productsData,
          inventoryData,
          customersData,
          salesData,
        ] = await Promise.all([
          getProducts(),
          getInventory(),
          getCustomers(),
          getSales(),
        ]);

        setProducts(productsData);
        setInventory(inventoryData);
        setCustomersCount(customersData.length);
        setSales(salesData);
      } catch (error) {
        console.error(
          "Failed to load dashboard data:",
          error
        );

        setError(
          "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const totalSales = sales.reduce(
    (total, sale) =>
      total + Number(sale.total_amount),
    0
  );

  const lowStockItems = inventory.filter(
    (item) =>
      item.quantity <= item.minimum_stock
  );

  const getProductName = (productId: number) => {
    const product = products.find(
      (item) =>
        item.product_id === productId
    );

    return (
      product?.product_name ??
      `Product #${productId}`
    );
  };

  const recentSales = [...sales]
    .sort(
      (a, b) =>
        new Date(b.sale_date).getTime() -
        new Date(a.sale_date).getTime()
    )
    .slice(0, 5);

  return (
    <div className="dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>

          <p>
            Overview of your boutique business.
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <section className="summary-grid">
        <div className="summary-card">
          <span className="summary-label">
            Total Products
          </span>

          <strong className="summary-value">
            {loading ? "..." : products.length}
          </strong>

          <span className="summary-description">
            Products in catalog
          </span>
        </div>

        <div className="summary-card">
          <span className="summary-label">
            Inventory Items
          </span>

          <strong className="summary-value">
            {loading ? "..." : inventory.length}
          </strong>

          <span className="summary-description">
            Inventory records
          </span>
        </div>

        <div className="summary-card">
          <span className="summary-label">
            Customers
          </span>

          <strong className="summary-value">
            {loading
              ? "..."
              : customersCount}
          </strong>

          <span className="summary-description">
            Registered customers
          </span>
        </div>

        <div className="summary-card">
          <span className="summary-label">
            Total Sales
          </span>

          <strong className="summary-value">
            {loading
              ? "..."
              : `₹${totalSales.toLocaleString(
                  "en-IN"
                )}`}
          </strong>

          <span className="summary-description">
            Total recorded sales
          </span>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <div className="quick-actions-header">
          <div>
            <h2>Quick Actions</h2>

            <p>
              Common boutique operations
            </p>
          </div>
        </div>

        <div className="quick-actions-grid">
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
        </div>
      </section>

      {/* Recent Sales + Low Stock */}
      <section className="dashboard-grid">
        {/* Recent Sales */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h2>Recent Sales</h2>

            <span>
              Latest transactions
            </span>
          </div>

          {recentSales.length === 0 ? (
            <div className="empty-state">
              <p>
                No sales recorded yet.
              </p>
            </div>
          ) : (
            <div className="sales-list">
              {recentSales.map((sale) => (
                <div
                  className="sale-row"
                  key={sale.sale_id}
                >
                  <div>
                    <strong>
                      {sale.invoice_number}
                    </strong>

                    <span>
                      {new Date(
                        sale.sale_date
                      ).toLocaleDateString(
                        "en-IN"
                      )}
                    </span>
                  </div>

                  <strong>
                    ₹
                    {Number(
                      sale.total_amount
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h2>Low Stock</h2>

            <span>
              Inventory alerts
            </span>
          </div>

          {lowStockItems.length === 0 ? (
            <div className="empty-state">
              <p>
                No low-stock products.
              </p>
            </div>
          ) : (
            <div className="stock-list">
              {lowStockItems
                .slice(0, 5)
                .map((item) => (
                  <div
                    className="stock-row"
                    key={item.inventory_id}
                  >
                    <div>
                      <strong>
                        {getProductName(
                          item.product_id
                        )}
                      </strong>

                      <span>
                        Minimum:{" "}
                        {item.minimum_stock}
                      </span>
                    </div>

                    <strong className="stock-warning">
                      {item.quantity}
                    </strong>
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;