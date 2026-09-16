import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import type { ChangeEvent, FormEvent } from "react";

import {
  createPurchaseOrder,
  deletePurchaseOrder,
  getPurchaseOrders,
  updatePurchaseOrder,
} from "../services/purchaseOrderService";

import {
  createPurchaseItem,
  deletePurchaseItem,
  getPurchaseItems,
  updatePurchaseItem,
} from "../services/purchaseItemService";

import { getSuppliers } from "../services/supplierService";
import { getProducts } from "../services/productService";

import type { Supplier } from "../services/supplierService";
import type { Product } from "../services/productService";

import type {
  PurchaseOrder,
  PurchaseOrderCreate,
} from "../services/purchaseOrderService";

import type {
  PurchaseItem,
  PurchaseItemCreate,
} from "../services/purchaseItemService";

interface ApiErrorResponse {
  detail?: string;
}

interface PurchaseItemForm {
  product_id: string;
  quantity: string;
  unit_price: string;
  purchase_item_id?: number;
}

interface PurchaseFormData {
  supplier_id: string;
  order_number: string;
  order_date: string;
  status: string;
}

const getCurrentDateTime = (): string => {
  const now = new Date();

  const offset = now.getTimezoneOffset();

  const localDate = new Date(
    now.getTime() - offset * 60 * 1000
  );

  return localDate.toISOString().slice(0, 16);
};

const createEmptyItem = (): PurchaseItemForm => ({
  product_id: "",
  quantity: "",
  unit_price: "",
});

const createInitialOrderForm = (): PurchaseFormData => ({
  supplier_id: "",
  order_number: "",
  order_date: getCurrentDateTime(),
  status: "Pending",
});

function Purchases() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);

  const [items, setItems] = useState<PurchaseItem[]>([]);

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingOrderId, setEditingOrderId] =
    useState<number | null>(null);

  const [orderForm, setOrderForm] =
    useState<PurchaseFormData>(
      createInitialOrderForm()
    );

  const [itemForms, setItemForms] = useState<
    PurchaseItemForm[]
  >([createEmptyItem()]);

  useEffect(() => {
    let mounted = true;

    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          ordersData,
          itemsData,
          suppliersData,
          productsData,
        ] = await Promise.all([
          getPurchaseOrders(),
          getPurchaseItems(),
          getSuppliers(),
          getProducts(),
        ]);

        if (!mounted) {
          return;
        }

        setOrders(ordersData);
        setItems(itemsData);
        setSuppliers(suppliersData);
        setProducts(productsData);
      } catch (err) {
        console.error(
          "Failed to load purchase data:",
          err
        );

        if (!mounted) {
          return;
        }

        if (axios.isAxiosError<ApiErrorResponse>(err)) {
          setError(
            err.response?.data?.detail ||
              "Failed to load purchase data."
          );
        } else {
          setError(
            "Failed to load purchase data."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadInitialData();

    return () => {
      mounted = false;
    };
  }, []);

  const refreshPurchaseData = async () => {
    const [
      ordersData,
      itemsData,
    ] = await Promise.all([
      getPurchaseOrders(),
      getPurchaseItems(),
    ]);

    setOrders(ordersData);
    setItems(itemsData);
  };

  const getSupplierName = (
    supplierId: number
  ): string => {
    const supplier = suppliers.find(
      (item) =>
        item.supplier_id === supplierId
    );

    return supplier
      ? supplier.supplier_name
      : `Supplier #${supplierId}`;
  };

  const getOrderItems = (
    orderId: number
  ): PurchaseItem[] => {
    return items.filter(
      (item) =>
        item.purchase_order_id === orderId
    );
  };

  const handleOrderInputChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setOrderForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleItemChange = (
    index: number,
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setItemForms((previous) =>
      previous.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [name]: value,
            }
          : item
      )
    );
  };

  const addItemRow = () => {
    setItemForms((previous) => [
      ...previous,
      createEmptyItem(),
    ]);
  };

  const removeItemRow = (index: number) => {
    setItemForms((previous) => {
      if (previous.length === 1) {
        return previous;
      }

      return previous.filter(
        (_, itemIndex) =>
          itemIndex !== index
      );
    });
  };

  const resetForm = () => {
    setOrderForm(
      createInitialOrderForm()
    );

    setItemForms([createEmptyItem()]);
    setEditingOrderId(null);
    setShowForm(false);
  };

  const handleAddPurchase = () => {
    setError("");
    setSuccess("");

    setOrderForm(
      createInitialOrderForm()
    );

    setItemForms([createEmptyItem()]);
    setEditingOrderId(null);
    setShowForm(true);
  };

  const handleEditPurchase = (
    order: PurchaseOrder
  ) => {
    setError("");
    setSuccess("");

    const orderDate = new Date(
      order.order_date
    );

    const localDate = new Date(
      orderDate.getTime() -
        orderDate.getTimezoneOffset() * 60 * 1000
    );

    setOrderForm({
      supplier_id: String(
        order.supplier_id
      ),
      order_number: order.order_number,
      order_date: localDate
        .toISOString()
        .slice(0, 16),
      status: order.status,
    });

    const existingItems =
      getOrderItems(
        order.purchase_order_id
      );

    if (existingItems.length > 0) {
      setItemForms(
        existingItems.map((item) => ({
          purchase_item_id:
            item.purchase_item_id,
          product_id: String(
            item.product_id
          ),
          quantity: String(
            item.quantity
          ),
          unit_price: String(
            item.unit_price
          ),
        }))
      );
    } else {
      setItemForms([createEmptyItem()]);
    }

    setEditingOrderId(
      order.purchase_order_id
    );

    setShowForm(true);
  };

  const calculateItemSubtotal = (
    item: PurchaseItemForm
  ): number => {
    const quantity = Number(
      item.quantity
    );

    const unitPrice = Number(
      item.unit_price
    );

    if (
      Number.isNaN(quantity) ||
      Number.isNaN(unitPrice)
    ) {
      return 0;
    }

    return quantity * unitPrice;
  };

  const formTotal = useMemo(() => {
    return itemForms.reduce(
      (total, item) =>
        total +
        calculateItemSubtotal(item),
      0
    );
  }, [itemForms]);

  const validateForm = (): boolean => {
    if (!orderForm.supplier_id) {
      setError(
        "Please select a supplier."
      );
      return false;
    }

    if (!orderForm.order_number.trim()) {
      setError(
        "Order number is required."
      );
      return false;
    }

    if (!orderForm.order_date) {
      setError(
        "Order date is required."
      );
      return false;
    }

    if (!orderForm.status.trim()) {
      setError(
        "Status is required."
      );
      return false;
    }

    if (itemForms.length === 0) {
      setError(
        "At least one purchase item is required."
      );
      return false;
    }

    for (
      let index = 0;
      index < itemForms.length;
      index += 1
    ) {
      const item = itemForms[index];

      if (!item.product_id) {
        setError(
          `Please select a product for item ${
            index + 1
          }.`
        );
        return false;
      }

      const quantity = Number(
        item.quantity
      );

      const unitPrice = Number(
        item.unit_price
      );

      if (
        !item.quantity ||
        Number.isNaN(quantity) ||
        quantity <= 0
      ) {
        setError(
          `Quantity must be greater than zero for item ${
            index + 1
          }.`
        );
        return false;
      }

      if (
        item.unit_price === "" ||
        Number.isNaN(unitPrice) ||
        unitPrice < 0
      ) {
        setError(
          `Please enter a valid unit price for item ${
            index + 1
          }.`
        );
        return false;
      }
    }

    return true;
  };

  const handleSavePurchase = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    const orderNumber =
      orderForm.order_number.trim();

    const duplicateOrder =
      orders.some(
        (order) =>
          order.order_number
            .trim()
            .toLowerCase() ===
            orderNumber.toLowerCase() &&
          order.purchase_order_id !==
            editingOrderId
      );

    if (duplicateOrder) {
      setError(
        "A purchase order with this order number already exists."
      );
      return;
    }

    try {
      setSaving(true);

      const orderPayload: PurchaseOrderCreate = {
        supplier_id: Number(
          orderForm.supplier_id
        ),
        order_number: orderNumber,
        order_date: new Date(
          orderForm.order_date
        ).toISOString(),
        total_amount: formTotal,
        status:
          orderForm.status.trim(),
      };

      let purchaseOrderId: number;

      if (editingOrderId !== null) {
        const updatedOrder =
          await updatePurchaseOrder(
            editingOrderId,
            orderPayload
          );

        purchaseOrderId =
          updatedOrder.purchase_order_id;

        const existingItems =
          getOrderItems(
            editingOrderId
          );

        const existingItemIds =
          new Set(
            itemForms
              .filter(
                (item) =>
                  item.purchase_item_id !==
                  undefined
              )
              .map(
                (item) =>
                  item.purchase_item_id
              )
          );

        /*
         * Delete old items that were removed
         * from the edit form.
         */
        for (
          const existingItem of existingItems
        ) {
          if (
            !existingItemIds.has(
              existingItem.purchase_item_id
            )
          ) {
            await deletePurchaseItem(
              existingItem.purchase_item_id
            );
          }
        }

        /*
         * Update existing items and create
         * newly added items.
         */
        for (
          const item of itemForms
        ) {
          const quantity = Number(
            item.quantity
          );

          const unitPrice = Number(
            item.unit_price
          );

          const itemPayload: PurchaseItemCreate =
            {
              purchase_order_id:
                purchaseOrderId,
              product_id: Number(
                item.product_id
              ),
              quantity,
              unit_price: unitPrice,
              subtotal:
                quantity * unitPrice,
            };

          if (
            item.purchase_item_id !==
            undefined
          ) {
            await updatePurchaseItem(
              item.purchase_item_id,
              itemPayload
            );
          } else {
            await createPurchaseItem(
              itemPayload
            );
          }
        }

        setSuccess(
          "Purchase order updated successfully."
        );
      } else {
        const createdOrder =
          await createPurchaseOrder(
            orderPayload
          );

        purchaseOrderId =
          createdOrder.purchase_order_id;

        /*
         * Create all purchase items after
         * the purchase order exists.
         */
        for (
          const item of itemForms
        ) {
          const quantity = Number(
            item.quantity
          );

          const unitPrice = Number(
            item.unit_price
          );

          const itemPayload: PurchaseItemCreate =
            {
              purchase_order_id:
                purchaseOrderId,
              product_id: Number(
                item.product_id
              ),
              quantity,
              unit_price: unitPrice,
              subtotal:
                quantity * unitPrice,
            };

          await createPurchaseItem(
            itemPayload
          );
        }

        setSuccess(
          "Purchase order created successfully."
        );
      }

      resetForm();

      await refreshPurchaseData();
    } catch (err) {
      console.error(
        "Failed to save purchase:",
        err
      );

      if (axios.isAxiosError<ApiErrorResponse>(err)) {
        setError(
          err.response?.data?.detail ||
            "Failed to save purchase."
        );
      } else {
        setError(
          "Failed to save purchase."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePurchase = async (
    orderId: number
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this purchase order?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const orderItems =
        getOrderItems(orderId);

      /*
       * Purchase items reference the purchase
       * order, so delete the child records first.
       */
      for (
        const item of orderItems
      ) {
        await deletePurchaseItem(
          item.purchase_item_id
        );
      }

      await deletePurchaseOrder(
        orderId
      );

      setSuccess(
        "Purchase order deleted successfully."
      );

      await refreshPurchaseData();
    } catch (err) {
      console.error(
        "Failed to delete purchase order:",
        err
      );

      if (axios.isAxiosError<ApiErrorResponse>(err)) {
        setError(
          err.response?.data?.detail ||
            "Failed to delete purchase order."
        );
      } else {
        setError(
          "Failed to delete purchase order."
        );
      }
    }
  };

  const filteredOrders =
    orders.filter((order) => {
      const searchValue =
        search.trim().toLowerCase();

      if (!searchValue) {
        return true;
      }

      return (
        order.order_number
          .toLowerCase()
          .includes(searchValue) ||
        getSupplierName(
          order.supplier_id
        )
          .toLowerCase()
          .includes(searchValue) ||
        order.status
          .toLowerCase()
          .includes(searchValue)
      );
    });

  const totalPurchaseAmount =
    orders.reduce(
      (total, order) =>
        total +
        Number(order.total_amount),
      0
    );

  return (
    <div className="products-page">
      <div className="page-header">
        <div>
          <h1>Purchases</h1>

          <p>
            Manage purchase orders and
            purchase items
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={handleAddPurchase}
        >
          + Create Purchase
        </button>
      </div>

      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <span className="dashboard-card-label">
            Purchase Orders
          </span>

          <strong className="dashboard-card-value">
            {orders.length}
          </strong>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card-label">
            Total Purchases
          </span>

          <strong className="dashboard-card-value">
            ₹
            {totalPurchaseAmount.toFixed(
              2
            )}
          </strong>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card-label">
            Purchase Items
          </span>

          <strong className="dashboard-card-value">
            {items.length}
          </strong>
        </div>
      </div>

      {showForm && (
        <div className="product-form-container">
          <div className="product-form-header">
            <div>
              <h2>
                {editingOrderId !==
                null
                  ? "Edit Purchase Order"
                  : "Create Purchase Order"}
              </h2>

              <p>
                Enter supplier and
                purchase details
              </p>
            </div>
          </div>

          <form
            className="product-form"
            onSubmit={
              handleSavePurchase
            }
          >
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="supplier_id">
                  Supplier
                </label>

                <select
                  id="supplier_id"
                  name="supplier_id"
                  value={
                    orderForm.supplier_id
                  }
                  onChange={
                    handleOrderInputChange
                  }
                  disabled={saving}
                >
                  <option value="">
                    Select supplier
                  </option>

                  {suppliers.map(
                    (supplier) => (
                      <option
                        key={
                          supplier.supplier_id
                        }
                        value={
                          supplier.supplier_id
                        }
                      >
                        {
                          supplier.supplier_name
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="order_number">
                  Order Number
                </label>

                <input
                  id="order_number"
                  name="order_number"
                  type="text"
                  value={
                    orderForm.order_number
                  }
                  onChange={
                    handleOrderInputChange
                  }
                  placeholder="PO-001"
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label htmlFor="order_date">
                  Order Date
                </label>

                <input
                  id="order_date"
                  name="order_date"
                  type="datetime-local"
                  value={
                    orderForm.order_date
                  }
                  onChange={
                    handleOrderInputChange
                  }
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">
                  Status
                </label>

                <select
                  id="status"
                  name="status"
                  value={
                    orderForm.status
                  }
                  onChange={
                    handleOrderInputChange
                  }
                  disabled={saving}
                >
                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Ordered">
                    Ordered
                  </option>

                  <option value="Received">
                    Received
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>
                </select>
              </div>
            </div>

            <div className="product-form-header">
              <div>
                <h2>
                  Purchase Items
                </h2>

                <p>
                  Add products to this
                  purchase order
                </p>
              </div>
            </div>

            {itemForms.map(
              (item, index) => (
                <div
                  className="form-grid"
                  key={
                    item.purchase_item_id ??
                    `new-item-${index}`
                  }
                >
                  <div className="form-group">
                    <label
                      htmlFor={`product-${index}`}
                    >
                      Product
                    </label>

                    <select
                      id={`product-${index}`}
                      name="product_id"
                      value={
                        item.product_id
                      }
                      onChange={(event) =>
                        handleItemChange(
                          index,
                          event
                        )
                      }
                      disabled={saving}
                    >
                      <option value="">
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
                            —{" "}
                            {product.sku}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="form-group">
                    <label
                      htmlFor={`quantity-${index}`}
                    >
                      Quantity
                    </label>

                    <input
                      id={`quantity-${index}`}
                      name="quantity"
                      type="number"
                      min="1"
                      value={
                        item.quantity
                      }
                      onChange={(event) =>
                        handleItemChange(
                          index,
                          event
                        )
                      }
                      placeholder="Quantity"
                      disabled={saving}
                    />
                  </div>

                  <div className="form-group">
                    <label
                      htmlFor={`unit-price-${index}`}
                    >
                      Unit Price
                    </label>

                    <input
                      id={`unit-price-${index}`}
                      name="unit_price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={
                        item.unit_price
                      }
                      onChange={(event) =>
                        handleItemChange(
                          index,
                          event
                        )
                      }
                      placeholder="0.00"
                      disabled={saving}
                    />
                  </div>

                  <div className="form-group">
                    <label
                      htmlFor={`subtotal-${index}`}
                    >
                      Subtotal
                    </label>

                    <input
                      id={`subtotal-${index}`}
                      type="text"
                      value={`₹${calculateItemSubtotal(
                        item
                      ).toFixed(2)}`}
                      readOnly
                    />
                  </div>

                  <div className="form-actions">
                    {itemForms.length >
                      1 && (
                      <button
                        type="button"
                        className="delete-button"
                        onClick={() =>
                          removeItemRow(
                            index
                          )
                        }
                        disabled={saving}
                      >
                        Remove Item
                      </button>
                    )}
                  </div>
                </div>
              )
            )}

            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={addItemRow}
                disabled={saving}
              >
                + Add Item
              </button>
            </div>

            <div className="product-form-header">
              <div>
                <h2>
                  Total: ₹
                  {formTotal.toFixed(
                    2
                  )}
                </h2>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingOrderId !==
                      null
                    ? "Update Purchase"
                    : "Create Purchase"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="products-toolbar">
        <div className="search-box">
          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search purchase orders..."
          />
        </div>
      </div>

      <div className="products-table-container">
        {loading ? (
          <div className="table-empty">
            Loading purchases...
          </div>
        ) : filteredOrders.length ===
          0 ? (
          <div className="table-empty">
            {search
              ? "No purchase orders match your search."
              : "No purchase orders found."}
          </div>
        ) : (
          <table className="products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Order</th>
                <th>Supplier</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Items</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map(
                (order) => {
                  const orderItems =
                    getOrderItems(
                      order.purchase_order_id
                    );

                  return (
                    <tr
                      key={
                        order.purchase_order_id
                      }
                    >
                      <td>
                        #
                        {
                          order.purchase_order_id
                        }
                      </td>

                      <td>
                        <strong>
                          {
                            order.order_number
                          }
                        </strong>
                      </td>

                      <td>
                        {getSupplierName(
                          order.supplier_id
                        )}
                      </td>

                      <td>
                        {new Date(
                          order.order_date
                        ).toLocaleString()}
                      </td>

                      <td>
                        ₹
                        {Number(
                          order.total_amount
                        ).toFixed(2)}
                      </td>

                      <td>
                        {
                          order.status
                        }
                      </td>

                      <td>
                        {
                          orderItems.length
                        }
                      </td>

                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="secondary-button"
                            onClick={() =>
                              handleEditPurchase(
                                order
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="delete-button"
                            onClick={() =>
                              void handleDeletePurchase(
                                order.purchase_order_id
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

export default Purchases;