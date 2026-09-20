import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import type {
  ChangeEvent,
  FormEvent,
} from "react";

import {
  createInventory,
  deleteInventory,
  getInventory,
  getInventoryStatusSummary,
  getLowStockInventory,
  getOutOfStockInventory,
  getInStockInventory,
  updateInventory,
} from "../services/inventoryService";

import type {
  Inventory as InventoryRecord,
  InventoryCreate,
  InventoryStatus,
  InventoryStatusSummary,
} from "../services/inventoryService";

import {
  getProducts,
} from "../services/productService";

import type {
  Product,
} from "../services/productService";

import {
  createStockTransaction,
} from "../services/stockTransactionService";

import type {
  StockTransactionCreate,
} from "../services/stockTransactionService";

import { useAuth } from "../hooks/useAuth";


function Inventory() {
  // ==================================================
  // DATA
  // ==================================================

  const [
    inventory,
    setInventory,
  ] = useState<InventoryRecord[]>([]);

  const [
    products,
    setProducts,
  ] = useState<Product[]>([]);


  // ==================================================
  // BACKEND STATUS DATA
  // ==================================================

  const [
    inventoryStatuses,
    setInventoryStatuses,
  ] = useState<
    Record<number, InventoryStatus>
  >({});

  const [
    statusSummary,
    setStatusSummary,
  ] = useState<InventoryStatusSummary>({
    total_inventory: 0,
    in_stock: 0,
    low_stock: 0,
    out_of_stock: 0,
  });


  // ==================================================
  // AUTH / RBAC
  // ==================================================

  const {
    isAdmin,
    isManager,
  } = useAuth();

  const canManageInventory =
    isAdmin || isManager;


  // ==================================================
  // UI STATE
  // ==================================================

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    stockSaving,
    setStockSaving,
  ] = useState(false);

  const [
    deletingInventoryId,
    setDeletingInventoryId,
  ] = useState<number | null>(null);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    stockFilter,
    setStockFilter,
  ] = useState("");


  // ==================================================
  // INVENTORY FORM STATE
  // ==================================================

  const [
    showForm,
    setShowForm,
  ] = useState(false);

  const [
    editingInventoryId,
    setEditingInventoryId,
  ] = useState<number | null>(null);

  const [
    formData,
    setFormData,
  ] = useState<InventoryCreate>({
    product_id: 0,
    quantity: 0,
    minimum_stock: 0,
    location: "",
  });


  // ==================================================
  // STOCK TRANSACTION FORM STATE
  // ==================================================

  const [
    showStockForm,
    setShowStockForm,
  ] = useState(false);

  const [
    stockTransactionType,
    setStockTransactionType,
  ] = useState<"IN" | "OUT">("IN");

  const [
    stockFormData,
    setStockFormData,
  ] = useState<{
    product_id: number;
    quantity: number;
    reason: string;
  }>({
    product_id: 0,
    quantity: 0,
    reason: "",
  });


  // ==================================================
  // LOAD INVENTORY + PRODUCTS + STATUS
  // ==================================================

  const loadInventory = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        inventoryData,
        productsData,
        summaryData,
        inStockData,
        lowStockData,
        outOfStockData,
      ] = await Promise.all([
        getInventory(),
        getProducts(),
        getInventoryStatusSummary(),
        getInStockInventory(),
        getLowStockInventory(),
        getOutOfStockInventory(),
      ]);

      // ------------------------------------------------
      // Inventory
      // ------------------------------------------------

      setInventory(
        inventoryData
      );

      // ------------------------------------------------
      // Products
      // ------------------------------------------------

      setProducts(
        productsData
      );

      // ------------------------------------------------
      // Backend summary
      // ------------------------------------------------

      setStatusSummary(
        summaryData
      );

      // ------------------------------------------------
      // Build backend status map
      // ------------------------------------------------

      const statusMap:
        Record<number, InventoryStatus> =
        {};

      inStockData.forEach(
        (item) => {
          statusMap[
            item.inventory_id
          ] = "IN_STOCK";
        }
      );

      lowStockData.forEach(
        (item) => {
          statusMap[
            item.inventory_id
          ] = "LOW_STOCK";
        }
      );

      outOfStockData.forEach(
        (item) => {
          statusMap[
            item.inventory_id
          ] = "OUT_OF_STOCK";
        }
      );

      setInventoryStatuses(
        statusMap
      );

    } catch (loadError) {
      console.error(
        "Failed to load inventory:",
        loadError
      );

      if (
        axios.isAxiosError(
          loadError
        )
      ) {
        const backendMessage =
          loadError.response?.data?.detail;

        if (
          typeof backendMessage ===
          "string"
        ) {
          setError(
            backendMessage
          );
        } else {
          setError(
            "Unable to load inventory."
          );
        }
      } else {
        setError(
          "Unable to load inventory."
        );
      }
    } finally {
      setLoading(false);
    }
  };


  // ==================================================
  // INITIAL LOAD
  // ==================================================

  useEffect(() => {
    let isMounted = true;

    const initializeInventory =
      async () => {
        try {
          setLoading(true);
          setError("");

          const [
            inventoryData,
            productsData,
            summaryData,
            inStockData,
            lowStockData,
            outOfStockData,
          ] = await Promise.all([
            getInventory(),
            getProducts(),
            getInventoryStatusSummary(),
            getInStockInventory(),
            getLowStockInventory(),
            getOutOfStockInventory(),
          ]);

          if (!isMounted) {
            return;
          }

          setInventory(
            inventoryData
          );

          setProducts(
            productsData
          );

          setStatusSummary(
            summaryData
          );

          const statusMap:
            Record<
              number,
              InventoryStatus
            > = {};

          inStockData.forEach(
            (item) => {
              statusMap[
                item.inventory_id
              ] = "IN_STOCK";
            }
          );

          lowStockData.forEach(
            (item) => {
              statusMap[
                item.inventory_id
              ] = "LOW_STOCK";
            }
          );

          outOfStockData.forEach(
            (item) => {
              statusMap[
                item.inventory_id
              ] = "OUT_OF_STOCK";
            }
          );

          setInventoryStatuses(
            statusMap
          );

        } catch (loadError) {
          if (!isMounted) {
            return;
          }

          console.error(
            "Failed to load inventory:",
            loadError
          );

          if (
            axios.isAxiosError(
              loadError
            )
          ) {
            const backendMessage =
              loadError.response?.data
                ?.detail;

            if (
              typeof backendMessage ===
              "string"
            ) {
              setError(
                backendMessage
              );
            } else {
              setError(
                "Unable to load inventory."
              );
            }
          } else {
            setError(
              "Unable to load inventory."
            );
          }

        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };

    void initializeInventory();

    return () => {
      isMounted = false;
    };
  }, []);


  // ==================================================
  // PRODUCT NAME
  // ==================================================

  const getProductName = (
    productId: number
  ) => {
    const product =
      products.find(
        (item) =>
          item.product_id ===
          productId
      );

    return (
      product?.product_name ??
      `Product #${productId}`
    );
  };


  // ==================================================
  // PRODUCT SKU
  // ==================================================

  const getProductSku = (
    productId: number
  ) => {
    const product =
      products.find(
        (item) =>
          item.product_id ===
          productId
      );

    return (
      product?.sku ??
      "-"
    );
  };


  // ==================================================
  // BACKEND STOCK STATUS
  // ==================================================

  const getStockStatus = (
    inventoryId: number
  ): InventoryStatus => {
    return (
      inventoryStatuses[
        inventoryId
      ] ?? "IN_STOCK"
    );
  };


  // ==================================================
  // DISPLAY STATUS
  // ==================================================

  const getDisplayStatus = (
    status: InventoryStatus
  ) => {
    if (
      status === "IN_STOCK"
    ) {
      return "In Stock";
    }

    if (
      status === "LOW_STOCK"
    ) {
      return "Low Stock";
    }

    return "Out of Stock";
  };


  // ==================================================
  // FILTER INVENTORY
  // ==================================================

  const filteredInventory =
    inventory.filter(
      (item) => {
        const productName =
          getProductName(
            item.product_id
          ).toLowerCase();

        const productSku =
          getProductSku(
            item.product_id
          ).toLowerCase();

        const searchValue =
          search
            .toLowerCase()
            .trim();

        const matchesSearch =
          productName.includes(
            searchValue
          ) ||
          productSku.includes(
            searchValue
          ) ||
          item.location
            .toLowerCase()
            .includes(
              searchValue
            );

        const status =
          getStockStatus(
            item.inventory_id
          );

        const displayStatus =
          getDisplayStatus(
            status
          );

        const matchesStock =
          stockFilter === "" ||
          displayStatus ===
            stockFilter;

        return (
          matchesSearch &&
          matchesStock
        );
      }
    );


  // ==================================================
  // INVENTORY FORM INPUT
  // ==================================================

  const handleInputChange = (
    event: ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement
    >
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (current) => {
        if (
          name ===
          "product_id"
        ) {
          return {
            ...current,
            product_id:
              value === ""
                ? 0
                : Number(value),
          };
        }

        if (
          name ===
          "quantity"
        ) {
          return {
            ...current,
            quantity:
              value === ""
                ? 0
                : Number(value),
          };
        }

        if (
          name ===
          "minimum_stock"
        ) {
          return {
            ...current,
            minimum_stock:
              value === ""
                ? 0
                : Number(value),
          };
        }

        return {
          ...current,
          [name]: value,
        };
      }
    );
  };


  // ==================================================
  // STOCK TRANSACTION INPUT
  // ==================================================

  const handleStockInputChange = (
    event: ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
    >
  ) => {
    const {
      name,
      value,
    } = event.target;

    setStockFormData(
      (current) => {
        if (
          name ===
          "product_id"
        ) {
          return {
            ...current,
            product_id:
              value === ""
                ? 0
                : Number(value),
          };
        }

        if (
          name ===
          "quantity"
        ) {
          return {
            ...current,
            quantity:
              value === ""
                ? 0
                : Number(value),
          };
        }

        return {
          ...current,
          [name]: value,
        };
      }
    );
  };


  // ==================================================
  // RESET INVENTORY FORM
  // ==================================================

  const resetForm = () => {
    setFormData({
      product_id: 0,
      quantity: 0,
      minimum_stock: 0,
      location: "",
    });

    setEditingInventoryId(
      null
    );
  };


  // ==================================================
  // RESET STOCK FORM
  // ==================================================

  const resetStockForm = () => {
    setStockFormData({
      product_id: 0,
      quantity: 0,
      reason: "",
    });

    setStockTransactionType(
      "IN"
    );
  };


  // ==================================================
  // OPEN STOCK IN
  // ==================================================

  const handleStockIn = (
    productId = 0
  ) => {
    if (!canManageInventory) {
      setError(
        "You do not have permission to manage stock."
      );
      return;
    }

    resetStockForm();

    setStockTransactionType(
      "IN"
    );

    setStockFormData(
      (current) => ({
        ...current,
        product_id:
          productId,
      })
    );

    setShowStockForm(true);
    setShowForm(false);
    setError("");
    setSuccess("");
  };


  // ==================================================
  // OPEN STOCK OUT
  // ==================================================

  const handleStockOut = (
    productId = 0
  ) => {
    if (!canManageInventory) {
      setError(
        "You do not have permission to manage stock."
      );
      return;
    }

    resetStockForm();

    setStockTransactionType(
      "OUT"
    );

    setStockFormData(
      (current) => ({
        ...current,
        product_id:
          productId,
      })
    );

    setShowStockForm(true);
    setShowForm(false);
    setError("");
    setSuccess("");
  };


  // ==================================================
  // CLOSE STOCK FORM
  // ==================================================

  const handleCloseStockForm = () => {
    setShowStockForm(false);
    resetStockForm();
    setError("");
  };


  // ==================================================
  // SUBMIT STOCK TRANSACTION
  // ==================================================

  const handleSaveStockTransaction =
    async (
      event: FormEvent
    ) => {
      event.preventDefault();

      setError("");
      setSuccess("");

      if (!canManageInventory) {
        setError(
          "You do not have permission to manage stock."
        );
        return;
      }

      // ------------------------------------------------
      // Validate product
      // ------------------------------------------------

      if (
        !stockFormData.product_id
      ) {
        setError(
          "Please select a product."
        );
        return;
      }

      // ------------------------------------------------
      // Validate quantity
      // ------------------------------------------------

      if (
        !Number.isInteger(
          stockFormData.quantity
        ) ||
        stockFormData.quantity <= 0
      ) {
        setError(
          "Quantity must be a whole number greater than 0."
        );
        return;
      }

      // ------------------------------------------------
      // Validate reason
      // ------------------------------------------------

      if (
        !stockFormData.reason.trim()
      ) {
        setError(
          "Please enter a reason for the stock movement."
        );
        return;
      }

      // ------------------------------------------------
      // Find current inventory
      // ------------------------------------------------

      const currentInventory =
        inventory.find(
          (item) =>
            item.product_id ===
            stockFormData.product_id
        );

      // ------------------------------------------------
      // Stock IN requires inventory
      // ------------------------------------------------

      if (
        stockTransactionType ===
        "IN" &&
        !currentInventory
      ) {
        setError(
          "No inventory record exists for this product. Create inventory first."
        );
        return;
      }

      // ------------------------------------------------
      // Stock OUT safety check
      // ------------------------------------------------

      if (
        stockTransactionType ===
        "OUT"
      ) {
        if (!currentInventory) {
          setError(
            "No inventory record exists for this product."
          );
          return;
        }

        if (
          stockFormData.quantity >
          currentInventory.quantity
        ) {
          setError(
            `Insufficient stock. Available quantity: ${currentInventory.quantity}.`
          );
          return;
        }
      }

      try {
        setStockSaving(true);

        const transaction:
          StockTransactionCreate = {
          product_id:
            stockFormData.product_id,

          transaction_type:
            stockTransactionType,

          quantity:
            stockFormData.quantity,

          transaction_date:
            new Date().toISOString(),

          reason:
            stockFormData.reason.trim(),
        };

        await createStockTransaction(
          transaction
        );

        setSuccess(
          stockTransactionType ===
            "IN"
            ? "Stock IN recorded successfully."
            : "Stock OUT recorded successfully."
        );

        setShowStockForm(
          false
        );

        resetStockForm();

        await loadInventory();

      } catch (stockError) {
        console.error(
          "Failed to create stock transaction:",
          stockError
        );

        if (
          axios.isAxiosError(
            stockError
          )
        ) {
          const backendMessage =
            stockError.response?.data
              ?.detail;

          if (
            typeof backendMessage ===
            "string"
          ) {
            setError(
              backendMessage
            );
          } else {
            setError(
              "Unable to record stock transaction."
            );
          }
        } else {
          setError(
            "Unable to record stock transaction."
          );
        }
      } finally {
        setStockSaving(false);
      }
    };


  // ==================================================
  // ADD INVENTORY
  // ==================================================

  const handleAddInventory = () => {
    if (!canManageInventory) {
      setError(
        "You do not have permission to manage inventory."
      );
      return;
    }

    resetForm();

    setShowForm(true);
    setShowStockForm(false);
    setError("");
    setSuccess("");
  };


  // ==================================================
  // EDIT INVENTORY
  // ==================================================

  const handleEditInventory = (
    item: InventoryRecord
  ) => {
    if (!canManageInventory) {
      setError(
        "You do not have permission to manage inventory."
      );
      return;
    }

    setEditingInventoryId(
      item.inventory_id
    );

    setFormData({
      product_id:
        item.product_id,

      quantity:
        item.quantity,

      minimum_stock:
        item.minimum_stock,

      location:
        item.location,
    });

    setShowForm(true);
    setShowStockForm(false);
    setError("");
    setSuccess("");
  };


  // ==================================================
  // DELETE INVENTORY
  // ==================================================

  const handleDeleteInventory =
    async (
      item: InventoryRecord
    ) => {
      if (!canManageInventory) {
        setError(
          "You do not have permission to delete inventory."
        );
        return;
      }

      const confirmed =
        window.confirm(
          `Are you sure you want to delete inventory for "${getProductName(
            item.product_id
          )}"?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setDeletingInventoryId(
          item.inventory_id
        );

        setError("");
        setSuccess("");

        await deleteInventory(
          item.inventory_id
        );

        setSuccess(
          "Inventory record deleted successfully."
        );

        await loadInventory();

      } catch (deleteError) {
        console.error(
          "Failed to delete inventory:",
          deleteError
        );

        if (
          axios.isAxiosError(
            deleteError
          )
        ) {
          const backendMessage =
            deleteError.response?.data
              ?.detail;

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
      } finally {
        setDeletingInventoryId(
          null
        );
      }
    };


  // ==================================================
  // CLOSE INVENTORY FORM
  // ==================================================

  const handleCloseForm = () => {
    if (saving) {
      return;
    }

    setShowForm(false);
    resetForm();
    setError("");
  };


  // ==================================================
  // SAVE INVENTORY
  // ==================================================

  const handleSaveInventory =
    async (
      event: FormEvent
    ) => {
      event.preventDefault();

      setError("");
      setSuccess("");

      if (!canManageInventory) {
        setError(
          "You do not have permission to manage inventory."
        );
        return;
      }

      // ------------------------------------------------
      // Validate product
      // ------------------------------------------------

      if (
        !formData.product_id
      ) {
        setError(
          "Please select a product."
        );
        return;
      }

      // ------------------------------------------------
      // Validate quantity
      // ------------------------------------------------

      if (
        formData.quantity < 0
      ) {
        setError(
          "Quantity cannot be negative."
        );
        return;
      }

      // ------------------------------------------------
      // Validate minimum stock
      // ------------------------------------------------

      if (
        formData.minimum_stock < 0
      ) {
        setError(
          "Minimum stock cannot be negative."
        );
        return;
      }

      // ------------------------------------------------
      // Validate location
      // ------------------------------------------------

      if (
        !formData.location.trim()
      ) {
        setError(
          "Inventory location is required."
        );
        return;
      }

      // ------------------------------------------------
      // Prevent duplicate product
      // ------------------------------------------------

      if (
        editingInventoryId ===
        null
      ) {
        const existingInventory =
          inventory.find(
            (item) =>
              item.product_id ===
              formData.product_id
          );

        if (
          existingInventory
        ) {
          setError(
            "Inventory already exists for this product."
          );
          return;
        }
      }

      try {
        setSaving(true);

        if (
          editingInventoryId !==
          null
        ) {
          await updateInventory(
            editingInventoryId,
            formData
          );

          setSuccess(
            "Inventory settings updated successfully."
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

      } catch (saveError) {
        console.error(
          "Failed to save inventory:",
          saveError
        );

        if (
          axios.isAxiosError(
            saveError
          )
        ) {
          const backendMessage =
            saveError.response?.data
              ?.detail;

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


  // ==================================================
  // SUMMARY
  // ==================================================

  const totalStockQuantity =
    inventory.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  const lowStockCount =
    statusSummary.low_stock;

  const outOfStockCount =
    statusSummary.out_of_stock;


  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="products-page">

      {/* ============================================ */}
      {/* PAGE HEADER */}
      {/* ============================================ */}

      <div className="page-header">

        <div>

          <h1>
            Inventory
          </h1>

          <p>
            Monitor and manage your
            boutique stock levels.
          </p>

        </div>

        {canManageInventory && (
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >

            <button
              className="secondary-button"
              type="button"
              onClick={() =>
                handleStockIn()
              }
            >
              + Stock IN
            </button>

            <button
              className="secondary-button"
              type="button"
              onClick={() =>
                handleStockOut()
              }
            >
              − Stock OUT
            </button>

            <button
              className="primary-button"
              type="button"
              onClick={
                handleAddInventory
              }
            >
              + Add Inventory
            </button>

          </div>
        )}

      </div>


      {/* ============================================ */}
      {/* ERROR */}
      {/* ============================================ */}

      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}


      {/* ============================================ */}
      {/* SUCCESS */}
      {/* ============================================ */}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}


      {/* ============================================ */}
      {/* SUMMARY CARDS */}
      {/* ============================================ */}

      <div className="dashboard-cards">

        <div className="dashboard-card">

          <div className="dashboard-card-title">
            Inventory Records
          </div>

          <div className="dashboard-card-value">
            {
              statusSummary.total_inventory
            }
          </div>

        </div>


        <div className="dashboard-card">

          <div className="dashboard-card-title">
            Total Stock
          </div>

          <div className="dashboard-card-value">
            {
              totalStockQuantity
            }
          </div>

        </div>


        <div className="dashboard-card">

          <div className="dashboard-card-title">
            Low Stock
          </div>

          <div className="dashboard-card-value">
            {
              lowStockCount
            }
          </div>

        </div>


        <div className="dashboard-card">

          <div className="dashboard-card-title">
            Out of Stock
          </div>

          <div className="dashboard-card-value">
            {
              outOfStockCount
            }
          </div>

        </div>

      </div>


      {/* ============================================ */}
      {/* STOCK TRANSACTION FORM */}
      {/* ============================================ */}

      {showStockForm &&
        canManageInventory && (

        <div className="product-form-container">

          <div className="product-form-header">

            <div>

              <h2>
                {
                  stockTransactionType ===
                  "IN"
                    ? "Stock IN"
                    : "Stock OUT"
                }
              </h2>

              <p>
                {
                  stockTransactionType ===
                  "IN"
                    ? "Add received stock to inventory."
                    : "Remove stock from inventory."
                }
              </p>

            </div>

            <button
              type="button"
              className="close-button"
              onClick={
                handleCloseStockForm
              }
              disabled={
                stockSaving
              }
            >
              ×
            </button>

          </div>


          <form
            className="product-form"
            onSubmit={
              handleSaveStockTransaction
            }
          >

            <div className="form-grid">

              {/* Transaction Type */}
              <div className="form-group">

                <label>
                  Transaction Type
                </label>

                <select
                  value={
                    stockTransactionType
                  }
                  onChange={
                    (event) =>
                      setStockTransactionType(
                        event.target
                          .value as
                          | "IN"
                          | "OUT"
                      )
                  }
                  disabled={
                    stockSaving
                  }
                >

                  <option value="IN">
                    Stock IN
                  </option>

                  <option value="OUT">
                    Stock OUT
                  </option>

                </select>

              </div>


              {/* Product */}
              <div className="form-group">

                <label>
                  Product
                </label>

                <select
                  name="product_id"
                  value={
                    stockFormData.product_id
                  }
                  onChange={
                    handleStockInputChange
                  }
                  disabled={
                    stockSaving
                  }
                >

                  <option value={0}>
                    Select product
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
                        {
                          product.product_name
                        }{" "}
                        (
                        {
                          product.sku
                        }
                        )
                      </option>
                    )
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
                  min="1"
                  step="1"
                  value={
                    stockFormData.quantity
                  }
                  onChange={
                    handleStockInputChange
                  }
                  placeholder="Enter quantity"
                  disabled={
                    stockSaving
                  }
                />

              </div>


              {/* Reason */}
              <div
                className="form-group"
                style={{
                  gridColumn:
                    "1 / -1",
                }}
              >

                <label>
                  Reason
                </label>

                <textarea
                  name="reason"
                  value={
                    stockFormData.reason
                  }
                  onChange={
                    handleStockInputChange
                  }
                  placeholder={
                    stockTransactionType ===
                    "IN"
                      ? "e.g. New supplier delivery"
                      : "e.g. Customer sale"
                  }
                  rows={3}
                  disabled={
                    stockSaving
                  }
                />

              </div>

            </div>


            {/* Current Stock Information */}
            {stockFormData.product_id >
              0 && (

              <div
                style={{
                  marginTop: "15px",
                  padding: "12px 14px",
                  borderRadius: "8px",
                  background:
                    "#f5f5f5",
                }}
              >

                <strong>
                  Current Stock:
                </strong>{" "}

                {
                  inventory.find(
                    (item) =>
                      item.product_id ===
                      stockFormData.product_id
                  )?.quantity ??
                  0
                }

                {stockTransactionType ===
                  "OUT" && (
                  <span>
                    {" "}
                    units available
                  </span>
                )}

              </div>

            )}


            {/* Form Actions */}
            <div className="form-actions">

              <button
                type="button"
                className="secondary-button"
                onClick={
                  handleCloseStockForm
                }
                disabled={
                  stockSaving
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={
                  stockSaving
                }
              >
                {
                  stockSaving
                    ? "Processing..."
                    : stockTransactionType ===
                      "IN"
                    ? "Record Stock IN"
                    : "Record Stock OUT"
                }
              </button>

            </div>

          </form>

        </div>

      )}


      {/* ============================================ */}
      {/* INVENTORY FORM */}
      {/* ============================================ */}

      {showForm &&
        canManageInventory && (

        <div className="product-form-container">

          <div className="product-form-header">

            <div>

              <h2>
                {
                  editingInventoryId !==
                  null
                    ? "Edit Inventory Settings"
                    : "Add Inventory"
                }
              </h2>

              <p>
                {
                  editingInventoryId !==
                  null
                    ? "Update inventory configuration. Use Stock IN or Stock OUT to change quantity."
                    : "Create an inventory record for a product."
                }
              </p>

            </div>

            <button
              type="button"
              className="close-button"
              onClick={
                handleCloseForm
              }
              disabled={
                saving
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
                      null ||
                    saving
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
                          {
                            product.product_name
                          }{" "}
                          (
                          {
                            product.sku
                          }
                          )
                          {
                            alreadyUsed
                              ? " - Inventory exists"
                              : ""
                          }
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
                  disabled={
                    editingInventoryId !==
                      null ||
                    saving
                  }
                />

                {editingInventoryId !==
                  null && (
                  <small>
                    Use Stock IN or Stock OUT to change current stock.
                  </small>
                )}

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
                  disabled={
                    saving
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
                  disabled={
                    saving
                  }
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
                disabled={
                  saving
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={
                  saving
                }
              >
                {
                  saving
                    ? editingInventoryId !==
                      null
                      ? "Updating..."
                      : "Creating..."
                    : editingInventoryId !==
                      null
                    ? "Update Inventory"
                    : "Create Inventory"
                }
              </button>

            </div>

          </form>

        </div>

      )}


      {/* ============================================ */}
      {/* SEARCH AND FILTER */}
      {/* ============================================ */}

      <div className="products-toolbar">

        <input
          type="text"
          placeholder="Search by product, SKU or location..."
          value={
            search
          }
          onChange={
            (event) =>
              setSearch(
                event.target.value
              )
          }
        />


        <select
          value={
            stockFilter
          }
          onChange={
            (event) =>
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


      {/* ============================================ */}
      {/* INVENTORY TABLE */}
      {/* ============================================ */}

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

                {canManageInventory && (
                  <th>
                    Actions
                  </th>
                )}

              </tr>

            </thead>


            <tbody>

              {filteredInventory.map(
                (item) => {

                  const status =
                    getStockStatus(
                      item.inventory_id
                    );

                  const displayStatus =
                    getDisplayStatus(
                      status
                    );

                  return (

                    <tr
                      key={
                        item.inventory_id
                      }
                    >

                      {/* Product */}
                      <td>

                        <strong>
                          {
                            getProductName(
                              item.product_id
                            )
                          }
                        </strong>

                      </td>


                      {/* SKU */}
                      <td>
                        {
                          getProductSku(
                            item.product_id
                          )
                        }
                      </td>


                      {/* Quantity */}
                      <td>
                        <strong>
                          {
                            item.quantity
                          }
                        </strong>
                      </td>


                      {/* Minimum */}
                      <td>
                        {
                          item.minimum_stock
                        }
                      </td>


                      {/* Status */}
                      <td>

                        <span className="status-badge">

                          {
                            displayStatus
                          }

                        </span>

                      </td>


                      {/* Location */}
                      <td>
                        {
                          item.location
                        }
                      </td>


                      {/* Last Updated */}
                      <td>

                        {
                          new Date(
                            item.last_updated
                          ).toLocaleString(
                            "en-IN"
                          )
                        }

                      </td>


                      {/* Actions */}
                      {canManageInventory && (
                        <td>

                          <div
                            className="table-actions"
                            style={{
                              display:
                                "flex",
                              gap:
                                "6px",
                              flexWrap:
                                "wrap",
                            }}
                          >

                            <button
                              type="button"
                              onClick={() =>
                                handleStockIn(
                                  item.product_id
                                )
                              }
                              disabled={
                                deletingInventoryId ===
                                item.inventory_id
                              }
                            >
                              + IN
                            </button>


                            <button
                              type="button"
                              onClick={() =>
                                handleStockOut(
                                  item.product_id
                                )
                              }
                              disabled={
                                deletingInventoryId ===
                                item.inventory_id
                              }
                            >
                              − OUT
                            </button>


                            <button
                              type="button"
                              onClick={() =>
                                handleEditInventory(
                                  item
                                )
                              }
                              disabled={
                                deletingInventoryId ===
                                item.inventory_id
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
                              disabled={
                                deletingInventoryId ===
                                item.inventory_id
                              }
                            >
                              {
                                deletingInventoryId ===
                                item.inventory_id
                                  ? "Deleting..."
                                  : "Delete"
                              }
                            </button>

                          </div>

                        </td>
                      )}

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