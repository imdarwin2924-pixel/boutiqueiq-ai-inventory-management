import { useEffect, useState } from "react";
import axios from "axios";
import type { ChangeEvent, FormEvent } from "react";

import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  updateCustomer,
} from "../services/customerService";

import type {
  Customer,
  CustomerCreate,
} from "../services/customerService";

import { useAuth } from "../hooks/useAuth";

interface ApiErrorResponse {
  detail?: string;
}

const initialFormData: CustomerCreate = {
  customer_name: "",
  phone: "",
  email: "",
  address: "",
};

function Customers() {
  const { isAdmin, isManager } = useAuth();

  const canManageCustomers = isAdmin || isManager;

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingCustomerId, setDeletingCustomerId] =
    useState<number | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingCustomerId, setEditingCustomerId] =
    useState<number | null>(null);

  const [formData, setFormData] =
    useState<CustomerCreate>(initialFormData);

  const getErrorMessage = (
    err: unknown,
    fallback: string
  ): string => {
    if (axios.isAxiosError<ApiErrorResponse>(err)) {
      if (err.response?.status === 401) {
        return "Your session has expired. Please log in again.";
      }

      if (err.response?.status === 403) {
        return "You do not have permission to perform this action.";
      }

      if (err.response?.status === 404) {
        return "Customer not found.";
      }

      if (err.response?.status === 409) {
        return (
          err.response.data?.detail ||
          "This customer already exists or is linked to existing records."
        );
      }

      return (
        err.response?.data?.detail ||
        fallback
      );
    }

    return fallback;
  };

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      console.error(
        "Failed to load customers:",
        err
      );

      setError(
        getErrorMessage(
          err,
          "Failed to load customers."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getCustomers();

        if (mounted) {
          setCustomers(data);
        }
      } catch (err) {
        console.error(
          "Failed to load customers:",
          err
        );

        if (mounted) {
          setError(
            getErrorMessage(
              err,
              "Failed to load customers."
            )
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

  const handleInputChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingCustomerId(null);
    setShowForm(false);
  };

  const handleAddCustomer = () => {
    if (!canManageCustomers) {
      setError(
        "You do not have permission to add customers."
      );
      return;
    }

    setSuccess("");
    setError("");
    setFormData(initialFormData);
    setEditingCustomerId(null);
    setShowForm(true);
  };

  const handleEditCustomer = (
    customer: Customer
  ) => {
    if (!canManageCustomers) {
      setError(
        "You do not have permission to edit customers."
      );
      return;
    }

    setSuccess("");
    setError("");

    setFormData({
      customer_name: customer.customer_name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
    });

    setEditingCustomerId(customer.customer_id);
    setShowForm(true);
  };

  const validateForm = (): boolean => {
    const name = formData.customer_name.trim();
    const phone = formData.phone.trim();
    const email = formData.email.trim();
    const address = formData.address.trim();

    if (!name) {
      setError("Customer name is required.");
      return false;
    }

    if (name.length < 2) {
      setError(
        "Customer name must be at least 2 characters."
      );
      return false;
    }

    if (!phone) {
      setError("Phone number is required.");
      return false;
    }

    const phoneRegex = /^[0-9+\-\s()]{7,20}$/;

    if (!phoneRegex.test(phone)) {
      setError("Please enter a valid phone number.");
      return false;
    }

    if (!email) {
      setError("Email is required.");
      return false;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError(
        "Please enter a valid email address."
      );
      return false;
    }

    if (!address) {
      setError("Address is required.");
      return false;
    }

    return true;
  };

  const handleSaveCustomer = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!canManageCustomers) {
      setError(
        "You do not have permission to manage customers."
      );
      return;
    }

    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    const normalizedEmail =
      formData.email.trim().toLowerCase();

    const duplicateEmail = customers.some(
      (customer) =>
        customer.email.trim().toLowerCase() ===
          normalizedEmail &&
        customer.customer_id !==
          editingCustomerId
    );

    if (duplicateEmail) {
      setError(
        "A customer with this email already exists."
      );
      return;
    }

    const payload: CustomerCreate = {
      customer_name:
        formData.customer_name.trim(),
      phone: formData.phone.trim(),
      email: normalizedEmail,
      address: formData.address.trim(),
    };

    try {
      setSaving(true);

      if (editingCustomerId !== null) {
        await updateCustomer(
          editingCustomerId,
          payload
        );

        setSuccess(
          "Customer updated successfully."
        );
      } else {
        await createCustomer(payload);

        setSuccess(
          "Customer created successfully."
        );
      }

      resetForm();
      await loadCustomers();
    } catch (err) {
      console.error(
        "Failed to save customer:",
        err
      );

      setError(
        getErrorMessage(
          err,
          "Failed to save customer."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCustomer = async (
    customerId: number
  ) => {
    if (!canManageCustomers) {
      setError(
        "You do not have permission to delete customers."
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");
    setDeletingCustomerId(customerId);

    try {
      await deleteCustomer(customerId);

      setSuccess(
        "Customer deleted successfully."
      );

      await loadCustomers();
    } catch (err) {
      console.error(
        "Failed to delete customer:",
        err
      );

      setError(
        getErrorMessage(
          err,
          "Failed to delete customer."
        )
      );
    } finally {
      setDeletingCustomerId(null);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) => {
      const searchValue = search
        .trim()
        .toLowerCase();

      if (!searchValue) {
        return true;
      }

      return (
        customer.customer_name
          .toLowerCase()
          .includes(searchValue) ||
        customer.phone
          .toLowerCase()
          .includes(searchValue) ||
        customer.email
          .toLowerCase()
          .includes(searchValue) ||
        customer.address
          .toLowerCase()
          .includes(searchValue)
      );
    }
  );

  return (
    <div className="products-page">
      <div className="page-header">
        <div>
          <h1>Customers</h1>

          <p>
            Manage your boutique customers
          </p>
        </div>

        {canManageCustomers && (
          <button
            type="button"
            className="primary-button"
            onClick={handleAddCustomer}
          >
            + Add Customer
          </button>
        )}
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
            Total Customers
          </span>

          <strong className="dashboard-card-value">
            {customers.length}
          </strong>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card-label">
            Showing
          </span>

          <strong className="dashboard-card-value">
            {filteredCustomers.length}
          </strong>
        </div>
      </div>

      {showForm && canManageCustomers && (
        <div className="product-form-container">
          <div className="product-form-header">
            <div>
              <h2>
                {editingCustomerId !== null
                  ? "Edit Customer"
                  : "Add Customer"}
              </h2>

              <p>
                {editingCustomerId !== null
                  ? "Update customer information"
                  : "Enter customer information"}
              </p>
            </div>
          </div>

          <form
            className="product-form"
            onSubmit={handleSaveCustomer}
          >
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="customer_name">
                  Customer Name
                </label>

                <input
                  id="customer_name"
                  name="customer_name"
                  type="text"
                  value={
                    formData.customer_name
                  }
                  onChange={handleInputChange}
                  placeholder="Enter customer name"
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  Phone
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  disabled={saving}
                />
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="address">
                  Address
                </label>

                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter customer address"
                  rows={3}
                  disabled={saving}
                />
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
                  : editingCustomerId !==
                      null
                    ? "Update Customer"
                    : "Add Customer"}
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
              setSearch(event.target.value)
            }
            placeholder="Search customers..."
          />
        </div>
      </div>

      <div className="products-table-container">
        {loading ? (
          <div className="table-empty">
            Loading customers...
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="table-empty">
            {search
              ? "No customers match your search."
              : "No customers found."}
          </div>
        ) : (
          <table className="products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Address</th>

                {canManageCustomers && (
                  <th>Actions</th>
                )}
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map(
                (customer) => (
                  <tr
                    key={
                      customer.customer_id
                    }
                  >
                    <td>
                      #
                      {
                        customer.customer_id
                      }
                    </td>

                    <td>
                      <strong>
                        {
                          customer.customer_name
                        }
                      </strong>
                    </td>

                    <td>
                      {customer.phone}
                    </td>

                    <td>
                      {customer.email}
                    </td>

                    <td>
                      {customer.address}
                    </td>

                    {canManageCustomers && (
                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="secondary-button"
                            onClick={() =>
                              handleEditCustomer(
                                customer
                              )
                            }
                            disabled={
                              saving ||
                              deletingCustomerId !==
                                null
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="delete-button"
                            onClick={() =>
                              void handleDeleteCustomer(
                                customer.customer_id
                              )
                            }
                            disabled={
                              deletingCustomerId !==
                                null
                            }
                          >
                            {deletingCustomerId ===
                            customer.customer_id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Customers;