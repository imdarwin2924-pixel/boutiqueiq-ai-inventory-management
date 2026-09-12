import { useEffect, useState } from "react";
import axios from "axios";
import type { ChangeEvent, FormEvent } from "react";

import {
  createInventory,
  deleteInventory,
  getInventory,
  updateInventory,
  type Inventory as InventoryRecord,
  type InventoryCreate,
} from "../services/inventoryService";

import {
  getProducts,
  type Product,
} from "../services/productService";

function Inventory() {
  const [inventory, setInventory] = useState<InventoryRecord[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingInventoryId, setEditingInventoryId] =
    useState<number | null>(null);

  const [formData, setFormData] = useState<InventoryCreate>({
    product_id: 0,
    quantity: 0,
    minimum_stock: 0,
    location: "",
  });

  /*
   * --------------------------------------------------
   * LOAD INVENTORY
   * --------------------------------------------------
   */

  const loadInventory = async () => {
    try {
      setLoading(true);
      setError("");

      const [inventoryData, productsData] = await Promise.all([
        getInventory(),
        getProducts(),
      ]);

      setInventory(inventoryData);
      setProducts(productsData);
    } catch (error) {
      console.error("Failed to load inventory:", error);

      if (axios.isAxiosError(error)) {
        const backendMessage = error.response?.data?.detail;

        if (typeof backendMessage === "string") {
          setError(backendMessage);
        } else {
          setError("Unable to load inventory.");
        }
      } else {
        setError("Unable to load inventory.");
      }
    } finally {
      setLoading(false);
    }
  };

  /*
   * --------------------------------------------------
   * INITIAL LOAD
   * --------------------------------------------------
   */

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setError("");

        const [inventoryData, productsData] = await Promise.all([
          getInventory(),
          getProducts(),
        ]);

        setInventory(inventoryData);
        setProducts(productsData);
      } catch (error) {
        console.error("Failed to load inventory:", error);

        if (axios.isAxiosError(error)) {
          const backendMessage = error.response?.data?.detail;

          if (typeof backendMessage === "string") {
            setError(backendMessage);
          } else {
            setError("Unable to load inventory.");
          }
        } else {
          setError("Unable to load inventory.");
        }
      } finally {
        setLoading(false);
      }
    };

    void loadInitialData();
  }, []);

  /*
   * --------------------------------------------------
   * PRODUCT NAME
   * --------------------------------------------------
   */

  const getProductName = (productId: number) => {
    const product = products.find(
      (item) => item.product_id === productId
    );

    return product?.product_name ?? `Product #${productId}`;
  };

  /*
   * --------------------------------------------------
   * PRODUCT SKU
   * --------------------------------------------------
   */

  const getProductSku = (productId: number) => {
    const product = products.find(
      (item) => item.product_id === productId
    );

    return product?.sku ?? "-";
  };

  /*
   * --------------------------------------------------
   * STOCK STATUS
   * --------------------------------------------------
   */

  const getStockStatus = (
    quantity: number,
    minimumStock: number
  ) => {
    if (quantity === 0) {
      return "Out of Stock";
    }

    if (quantity <= minimumStock) {
      return "Low Stock";
    }

    return "In Stock";
  };

  /*
   * --------------------------------------------------
   * FILTER INVENTORY
   * --------------------------------------------------
   */

  const filteredInventory = inventory.filter((item) => {
    const productName = getProductName(
      item.product_id
    ).toLowerCase();

    const productSku = getProductSku(
      item.product_id
    ).toLowerCase();

    const searchValue = search
      .toLowerCase()
      .trim();

    const matchesSearch =
      productName.includes(searchValue) ||
      productSku.includes(searchValue) ||
      item.location
        .toLowerCase()
        .includes(searchValue);

    const status = getStockStatus(
      item.quantity,
      item.minimum_stock
    );

    const matchesStock =
      stockFilter === "" ||
      status === stockFilter;

    return matchesSearch && matchesStock;
  });

  /*
   * --------------------------------------------------
   * FORM INPUT
   * --------------------------------------------------
   */

  const handleInputChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((current) => {
      if (name === "product_id") {
        return {
          ...current,
          product_id:
            value === "" ? 0 : Number(value),
        };
      }

      if (name === "quantity") {
        return {
          ...current,
          quantity:
            value === "" ? 0 : Number(value),
        };
      }

      if (name === "minimum_stock") {
        return {
          ...current,
          minimum_stock:
            value === "" ? 0 : Number(value),
        };
      }

      return {
        ...current,
        [name]: value,
      };
    });
  };

  /*
   * --------------------------------------------------
   * RESET FORM
   * --------------------------------------------------
   */

  const resetForm = () => {
    setFormData({
      product_id: 0,
      quantity: 0,
      minimum_stock: 0,
      location: "",
    });

    setEditingInventoryId(null);
  };

  /*
   * --------------------------------------------------
   * ADD INVENTORY
   * --------------------------------------------------
   */

  const handleAddInventory = () => {
    resetForm();

    setShowForm(true);
    setError("");
    setSuccess("");
  };

  /*
   * --------------------------------------------------
   * EDIT INVENTORY
   * --------------------------------------------------
   */

  const handleEditInventory = (
    item: InventoryRecord
  ) => {
    setEditingInventoryId(
      item.inventory_id
    );

    setFormData({
      product_id: item.product_id,
      quantity: item.quantity,
      minimum_stock: item.minimum_stock,
      location: item.location,
    });

    setShowForm(true);
    setError("");
    setSuccess("");
  };

  /*
   * --------------------------------------------------
   * DELETE INVENTORY
   * --------------------------------------------------
   */

  const handleDeleteInventory = async (
    item: InventoryRecord
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete inventory for "${getProductName(
        item.product_id
      )}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteInventory(
        item.inventory_id
      );

      setSuccess(
        "Inventory record deleted successfully."
      );

      await loadInventory();
    } catch (error) {
      console.error(
        "Failed to delete inventory:",
        error
      );

      if (axios.isAxiosError(error)) {
        const backendMessage =
          error.response?.data?.detail;

        if (
          typeof backendMessage ===
          "string"
        ) {
          setError(
            backendMessage
          );
        } else {
          setError(
            "Unable to delete inventory record."
          );
        }
      } else {
        setError(
          "Unable to delete inventory record."
        );
      }
    }
  };

  /*
   * --------------------------------------------------
   * CLOSE FORM
   * --------------------------------------------------
   */

  const handleCloseForm = () => {
    setShowForm(false);
    resetForm();
    setError("");
  };

  /*
   * --------------------------------------------------
   * SAVE INVENTORY
   * --------------------------------------------------
   */

  const handleSaveInventory = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    /*
     * VALIDATION
     */

    if (!formData.product_id) {
      setError(
        "Please select a product."
      );
      return;
    }

    if (formData.quantity < 0) {
      setError(
        "Quantity cannot be negative."
      );
      return;
    }

    if (formData.minimum_stock < 0) {
      setError(
        "Minimum stock cannot be negative."
      );
      return;
    }

    if (!formData.location.trim()) {
      setError(
        "Inventory location is required."
      );
      return;
    }

    /*
     * PREVENT DUPLICATE PRODUCT
     *
     * The backend already checks this during
     * creation. This frontend check provides
     * an immediate user-friendly message.
     */

    if (editingInventoryId === null) {
      const existingInventory =
        inventory.find(
          (item) =>
            item.product_id ===
            formData.product_id
        );

      if (existingInventory) {
        setError(
          "Inventory already exists for this product."
        );
        return;
      }
    }

    /*
     * SAVE
     */

    try {
      setSaving(true);

      if (editingInventoryId !== null) {
        await updateInventory(
          editingInventoryId,
          formData
        );

        setSuccess(
          "Inventory updated successfully."
        );
      } else {
        await createInventory(
          formData
        );

        setSuccess(
          "Inventory created successfully."
        );
      }

      resetForm();
      setShowForm(false);

      await loadInventory();
    } catch (error) {
      console.error(
        "Failed to save inventory:",
        error
      );

      if (axios.isAxiosError(error)) {
        const backendMessage =
          error.response?.data?.detail;

        if (
          typeof backendMessage ===
          "string"
        ) {
          setError(
            backendMessage
          );
        } else {
          setError(
            "Unable to save inventory. Please check the entered data."
          );
        }
      } else {
        setError(
          "Unable to save inventory. Please check the entered data."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  /*
   * --------------------------------------------------
   * SUMMARY VALUES
   * --------------------------------------------------
   */

  const totalInventoryItems =
    inventory.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  const lowStockCount =
    inventory.filter(
      (item) =>
        item.quantity > 0 &&
        item.quantity <=
          item.minimum_stock
    ).length;

  const outOfStockCount =
    inventory.filter(
      (item) =>
        item.quantity === 0
    ).length;

  /*
   * --------------------------------------------------
   * UI
   * --------------------------------------------------
   */

  return (
    <div className="products-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Inventory</h1>

          <p>
            Monitor and manage your boutique
            stock levels.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={
            handleAddInventory
          }
        >
          + Add Inventory
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      {/* Summary Cards */}
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <div className="dashboard-card-title">
            Inventory Records
          </div>

          <div className="dashboard-card-value">
            {inventory.length}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-title">
            Total Stock
          </div>

          <div className="dashboard-card-value">
            {totalInventoryItems}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-title">
            Low Stock
          </div>

          <div className="dashboard-card-value">
            {lowStockCount}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-title">
            Out of Stock
          </div>

          <div className="dashboard-card-value">
            {outOfStockCount}
          </div>
        </div>
      </div>

      {/* Inventory Form */}
      {showForm && (
        <div className="product-form-container">
          <div className="product-form-header">
            <div>
              <h2>
                {editingInventoryId !==
                null
                  ? "Edit Inventory"
                  : "Add Inventory"}
              </h2>

              <p>
                {editingInventoryId !==
                null
                  ? "Update inventory information."
                  : "Create an inventory record for a product."}
              </p>
            </div>

            <button
              type="button"
              className="close-button"
              onClick={
                handleCloseForm
              }
            >
              ×
            </button>
          </div>

          <form
            className="product-form"
            onSubmit={
              handleSaveInventory
            }
          >
            <div className="form-grid">
              {/* Product */}
              <div className="form-group">
                <label>
                  Product
                </label>

                <select
                  name="product_id"
                  value={
                    formData.product_id
                  }
                  onChange={
                    handleInputChange
                  }
                  disabled={
                    editingInventoryId !==
                    null
                  }
                >
                  <option value={0}>
                    Select product
                  </option>

                  {products.map(
                    (product) => {
                      const alreadyUsed =
                        inventory.some(
                          (item) =>
                            item.product_id ===
                              product.product_id &&
                            item.inventory_id !==
                              editingInventoryId
                        );

                      return (
                        <option
                          key={
                            product.product_id
                          }
                          value={
                            product.product_id
                          }
                          disabled={
                            alreadyUsed
                          }
                        >
                          {product.product_name}{" "}
                          ({product.sku})
                          {alreadyUsed
                            ? " - Inventory exists"
                            : ""}
                        </option>
                      );
                    }
                  )}
                </select>
              </div>

              {/* Quantity */}
              <div className="form-group">
                <label>
                  Quantity
                </label>

                <input
                  name="quantity"
                  type="number"
                  min="0"
                  value={
                    formData.quantity
                  }
                  onChange={
                    handleInputChange
                  }
                />
              </div>

              {/* Minimum Stock */}
              <div className="form-group">
                <label>
                  Minimum Stock
                </label>

                <input
                  name="minimum_stock"
                  type="number"
                  min="0"
                  value={
                    formData.minimum_stock
                  }
                  onChange={
                    handleInputChange
                  }
                />
              </div>

              {/* Location */}
              <div className="form-group">
                <label>
                  Location
                </label>

                <input
                  name="location"
                  type="text"
                  value={
                    formData.location
                  }
                  onChange={
                    handleInputChange
                  }
                  placeholder="e.g. Main Store"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={
                  handleCloseForm
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={saving}
              >
                {saving
                  ? editingInventoryId !==
                    null
                    ? "Updating..."
                    : "Creating..."
                  : editingInventoryId !==
                    null
                    ? "Update Inventory"
                    : "Create Inventory"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filter */}
      <div className="products-toolbar">
        <input
          type="text"
          placeholder="Search by product, SKU or location..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
        />

        <select
          value={stockFilter}
          onChange={(event) =>
            setStockFilter(
              event.target.value
            )
          }
        >
          <option value="">
            All Stock
          </option>

          <option value="In Stock">
            In Stock
          </option>

          <option value="Low Stock">
            Low Stock
          </option>

          <option value="Out of Stock">
            Out of Stock
          </option>
        </select>
      </div>

      {/* Inventory Table */}
      <div className="products-table-container">
        {loading ? (
          <div className="table-empty">
            Loading inventory...
          </div>
        ) : filteredInventory.length ===
          0 ? (
          <div className="table-empty">
            No inventory records found.
          </div>
        ) : (
          <table className="products-table">
            <thead>
              <tr>
                <th>
                  Product
                </th>

                <th>
                  SKU
                </th>

                <th>
                  Quantity
                </th>

                <th>
                  Minimum Stock
                </th>

                <th>
                  Status
                </th>

                <th>
                  Location
                </th>

                <th>
                  Last Updated
                </th>

                <th>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredInventory.map(
                (item) => {
                  const status =
                    getStockStatus(
                      item.quantity,
                      item.minimum_stock
                    );

                  return (
                    <tr
                      key={
                        item.inventory_id
                      }
                    >
                      <td>
                        <strong>
                          {getProductName(
                            item.product_id
                          )}
                        </strong>
                      </td>

                      <td>
                        {getProductSku(
                          item.product_id
                        )}
                      </td>

                      <td>
                        {item.quantity}
                      </td>

                      <td>
                        {
                          item.minimum_stock
                        }
                      </td>

                      <td>
                        <span className="status-badge">
                          {status}
                        </span>
                      </td>

                      <td>
                        {item.location}
                      </td>

                      <td>
                        {new Date(
                          item.last_updated
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            onClick={() =>
                              handleEditInventory(
                                item
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="delete-button"
                            onClick={() =>
                              handleDeleteInventory(
                                item
                              )
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Inventory;