import { useEffect, useState } from "react";
import axios from "axios";
import type { ChangeEvent, FormEvent } from "react";

import {
  createSale,
  deleteSale,
  getSales,
  updateSale,
} from "../services/salesService";

import { getCustomers } from "../services/customerService";

import type { Customer } from "../services/customerService";

import type {
  Sale,
  SaleCreate,
} from "../services/salesService";

interface ApiErrorResponse {
  detail?: string;
}

interface SaleFormData {
  customer_id: string;
  invoice_number: string;
  sale_date: string;
  total_amount: string;
  payment_method: string;
}

const getCurrentDateTime = (): string => {
  const now = new Date();

  const offset = now.getTimezoneOffset();

  const localDate = new Date(
    now.getTime() - offset * 60 * 1000
  );

  return localDate.toISOString().slice(0, 16);
};

const getInitialFormData = (): SaleFormData => ({
  customer_id: "",
  invoice_number: "",
  sale_date: getCurrentDateTime(),
  total_amount: "",
  payment_method: "Cash",
});

function Sales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingSaleId, setEditingSaleId] =
    useState<number | null>(null);

  const [formData, setFormData] =
    useState<SaleFormData>(getInitialFormData);

  /*
   * Load sales.
   */
  const loadSales = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getSales();

      setSales(data);
    } catch (err) {
      console.error("Failed to load sales:", err);

      if (axios.isAxiosError<ApiErrorResponse>(err)) {
        setError(
          err.response?.data?.detail ||
            "Failed to load sales."
        );
      } else {
        setError("Failed to load sales.");
      }
    } finally {
      setLoading(false);
    }
  };

  /*
   * Initial page load.
   */
  useEffect(() => {
    let mounted = true;

    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError("");

        const [salesData, customersData] =
          await Promise.all([
            getSales(),
            getCustomers(),
          ]);

        if (!mounted) {
          return;
        }

        setSales(salesData);
        setCustomers(customersData);
      } catch (err) {
        console.error(
          "Failed to load sales data:",
          err
        );

        if (!mounted) {
          return;
        }

        if (axios.isAxiosError<ApiErrorResponse>(err)) {
          setError(
            err.response?.data?.detail ||
              "Failed to load sales data."
          );
        } else {
          setError("Failed to load sales data.");
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

  /*
   * Input change.
   */
  const handleInputChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /*
   * Reset form.
   */
  const resetForm = () => {
    setFormData(getInitialFormData());
    setEditingSaleId(null);
    setShowForm(false);
  };

  /*
   * Open create form.
   */
  const handleAddSale = () => {
    setError("");
    setSuccess("");

    setFormData(getInitialFormData());
    setEditingSaleId(null);
    setShowForm(true);
  };

  /*
   * Open edit form.
   */
  const handleEditSale = (sale: Sale) => {
    setError("");
    setSuccess("");

    const date = new Date(sale.sale_date);

    const localDate = new Date(
      date.getTime() -
        date.getTimezoneOffset() * 60 * 1000
    );

    setFormData({
      customer_id: String(sale.customer_id),
      invoice_number: sale.invoice_number,
      sale_date: localDate
        .toISOString()
        .slice(0, 16),
      total_amount: String(sale.total_amount),
      payment_method:
        sale.payment_method || "Cash",
    });

    setEditingSaleId(sale.sale_id);
    setShowForm(true);
  };

  /*
   * Validate form.
   */
  const validateForm = (): boolean => {
    if (!formData.customer_id) {
      setError("Please select a customer.");
      return false;
    }

    if (!formData.invoice_number.trim()) {
      setError("Invoice number is required.");
      return false;
    }

    if (!formData.sale_date) {
      setError("Sale date is required.");
      return false;
    }

    const saleDate = new Date(
      formData.sale_date
    );

    if (Number.isNaN(saleDate.getTime())) {
      setError("Please enter a valid sale date.");
      return false;
    }

    const totalAmount = Number(
      formData.total_amount
    );

    if (
      formData.total_amount.trim() === "" ||
      !Number.isFinite(totalAmount)
    ) {
      setError(
        "Please enter a valid total amount."
      );
      return false;
    }

    if (totalAmount < 0) {
      setError(
        "Total amount cannot be negative."
      );
      return false;
    }

    if (!formData.payment_method.trim()) {
      setError(
        "Payment method is required."
      );
      return false;
    }

    return true;
  };

  /*
   * Create / Update Sale.
   */
  const handleSaveSale = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    const invoiceNumber =
      formData.invoice_number.trim();

    /*
     * Frontend duplicate invoice protection.
     */
    const duplicateInvoice = sales.some(
      (sale) =>
        sale.invoice_number
          .trim()
          .toLowerCase() ===
          invoiceNumber.toLowerCase() &&
        sale.sale_id !== editingSaleId
    );

    if (duplicateInvoice) {
      setError(
        "A sale with this invoice number already exists."
      );
      return;
    }

    const payload: SaleCreate = {
      customer_id: Number(
        formData.customer_id
      ),
      invoice_number: invoiceNumber,
      sale_date: new Date(
        formData.sale_date
      ).toISOString(),
      total_amount: Number(
        formData.total_amount
      ),
      payment_method:
        formData.payment_method.trim(),
    };

    try {
      setSaving(true);

      if (editingSaleId !== null) {
        await updateSale(
          editingSaleId,
          payload
        );

        setSuccess(
          "Sale updated successfully."
        );
      } else {
        await createSale(payload);

        setSuccess(
          "Sale created successfully."
        );
      }

      resetForm();

      await loadSales();
    } catch (err) {
      console.error(
        "Failed to save sale:",
        err
      );

      if (axios.isAxiosError<ApiErrorResponse>(err)) {
        setError(
          err.response?.data?.detail ||
            "Failed to save sale."
        );
      } else {
        setError(
          "Failed to save sale."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  /*
   * Delete Sale.
   */
  const handleDeleteSale = async (
    saleId: number
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this sale?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await deleteSale(saleId);

      setSuccess(
        "Sale deleted successfully."
      );

      await loadSales();
    } catch (err) {
      console.error(
        "Failed to delete sale:",
        err
      );

      if (axios.isAxiosError<ApiErrorResponse>(err)) {
        setError(
          err.response?.data?.detail ||
            "Failed to delete sale."
        );
      } else {
        setError(
          "Failed to delete sale."
        );
      }
    }
  };

  /*
   * Get customer name.
   */
  const getCustomerName = (
    customerId: number
  ): string => {
    const customer = customers.find(
      (item) =>
        item.customer_id === customerId
    );

    return customer
      ? customer.customer_name
      : `Customer #${customerId}`;
  };

  /*
   * Search.
   */
  const searchValue = search
    .trim()
    .toLowerCase();

  const filteredSales = sales.filter(
    (sale) => {
      if (!searchValue) {
        return true;
      }

      return (
        sale.invoice_number
          .toLowerCase()
          .includes(searchValue) ||
        getCustomerName(
          sale.customer_id
        )
          .toLowerCase()
          .includes(searchValue) ||
        sale.payment_method
          .toLowerCase()
          .includes(searchValue)
      );
    }
  );

  /*
   * Summary.
   */
  const totalSalesAmount = sales.reduce(
    (total, sale) =>
      total + Number(sale.total_amount),
    0
  );

  return (
    <div className="products-page">
      {/* PAGE HEADER */}
      <div className="page-header">
        <div>
          <h1>Sales</h1>

          <p>
            Manage boutique sales and invoices
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={handleAddSale}
          disabled={saving}
        >
          + Record Sale
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      {/* SUCCESS */}
      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      {/* SUMMARY CARDS */}
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <span className="dashboard-card-label">
            Total Sales
          </span>

          <strong className="dashboard-card-value">
            {sales.length}
          </strong>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card-label">
            Total Revenue
          </span>

          <strong className="dashboard-card-value">
            ₹{totalSalesAmount.toFixed(2)}
          </strong>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card-label">
            Showing
          </span>

          <strong className="dashboard-card-value">
            {filteredSales.length}
          </strong>
        </div>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="product-form-container">
          <div className="product-form-header">
            <div>
              <h2>
                {editingSaleId !== null
                  ? "Edit Sale"
                  : "Record Sale"}
              </h2>

              <p>
                Enter the sale and invoice details
              </p>
            </div>
          </div>

          <form
            className="product-form"
            onSubmit={handleSaveSale}
          >
            <div className="form-grid">
              {/* CUSTOMER */}
              <div className="form-group">
                <label htmlFor="customer_id">
                  Customer
                </label>

                <select
                  id="customer_id"
                  name="customer_id"
                  value={formData.customer_id}
                  onChange={handleInputChange}
                  disabled={saving}
                >
                  <option value="">
                    Select customer
                  </option>

                  {customers.map((customer) => (
                    <option
                      key={customer.customer_id}
                      value={customer.customer_id}
                    >
                      {customer.customer_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* INVOICE */}
              <div className="form-group">
                <label htmlFor="invoice_number">
                  Invoice Number
                </label>

                <input
                  id="invoice_number"
                  name="invoice_number"
                  type="text"
                  value={formData.invoice_number}
                  onChange={handleInputChange}
                  placeholder="INV-001"
                  disabled={saving}
                />
              </div>

              {/* DATE */}
              <div className="form-group">
                <label htmlFor="sale_date">
                  Sale Date
                </label>

                <input
                  id="sale_date"
                  name="sale_date"
                  type="datetime-local"
                  value={formData.sale_date}
                  onChange={handleInputChange}
                  disabled={saving}
                />
              </div>

              {/* TOTAL */}
              <div className="form-group">
                <label htmlFor="total_amount">
                  Total Amount
                </label>

                <input
                  id="total_amount"
                  name="total_amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.total_amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  disabled={saving}
                />
              </div>

              {/* PAYMENT */}
              <div className="form-group">
                <label htmlFor="payment_method">
                  Payment Method
                </label>

                <select
                  id="payment_method"
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleInputChange}
                  disabled={saving}
                >
                  <option value="Cash">
                    Cash
                  </option>

                  <option value="UPI">
                    UPI
                  </option>

                  <option value="Card">
                    Card
                  </option>

                  <option value="Bank Transfer">
                    Bank Transfer
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>
            </div>

            {/* FORM ACTIONS */}
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
                  : editingSaleId !== null
                    ? "Update Sale"
                    : "Record Sale"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SEARCH */}
      <div className="products-toolbar">
        <div className="search-box">
          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search invoices, customers, payment..."
          />
        </div>
      </div>

      {/* SALES TABLE */}
      <div className="products-table-container">
        {loading ? (
          <div className="table-empty">
            Loading sales...
          </div>
        ) : filteredSales.length === 0 ? (
          <div className="table-empty">
            {search
              ? "No sales match your search."
              : "No sales found."}
          </div>
        ) : (
          <table className="products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Invoice</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale.sale_id}>
                  <td>
                    #{sale.sale_id}
                  </td>

                  <td>
                    <strong>
                      {sale.invoice_number}
                    </strong>
                  </td>

                  <td>
                    {getCustomerName(
                      sale.customer_id
                    )}
                  </td>

                  <td>
                    {new Date(
                      sale.sale_date
                    ).toLocaleString()}
                  </td>

                  <td>
                    ₹
                    {Number(
                      sale.total_amount
                    ).toFixed(2)}
                  </td>

                  <td>
                    {sale.payment_method}
                  </td>

                  <td>
                    <div className="table-actions">
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() =>
                          handleEditSale(sale)
                        }
                        disabled={saving}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-button"
                        onClick={() =>
                          void handleDeleteSale(
                            sale.sale_id
                          )
                        }
                        disabled={saving}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Sales;