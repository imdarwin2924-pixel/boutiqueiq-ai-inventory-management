import { useEffect, useState } from "react";
import axios from "axios";
import type { ChangeEvent, FormEvent } from "react";

import {
  createSupplier,
  deleteSupplier,
  getSuppliers,
  updateSupplier,
  type Supplier,
  type SupplierCreate,
} from "../services/supplierService";

function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingSupplierId, setEditingSupplierId] =
    useState<number | null>(null);

  const [formData, setFormData] =
    useState<SupplierCreate>({
      supplier_name: "",
      contact_person: "",
      phone: "",
      email: "",
      address: "",
    });

  /*
   * --------------------------------------------------
   * LOAD SUPPLIERS
   * --------------------------------------------------
   */

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      setError("");

      const suppliersData = await getSuppliers();

      setSuppliers(suppliersData);
    } catch (error) {
      console.error(
        "Failed to load suppliers:",
        error
      );

      if (axios.isAxiosError(error)) {
        const backendMessage =
          error.response?.data?.detail;

        if (typeof backendMessage === "string") {
          setError(backendMessage);
        } else {
          setError("Unable to load suppliers.");
        }
      } else {
        setError("Unable to load suppliers.");
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

        const suppliersData =
          await getSuppliers();

        setSuppliers(suppliersData);
      } catch (error) {
        console.error(
          "Failed to load suppliers:",
          error
        );

        if (axios.isAxiosError(error)) {
          const backendMessage =
            error.response?.data?.detail;

          if (
            typeof backendMessage === "string"
          ) {
            setError(
              backendMessage
            );
          } else {
            setError(
              "Unable to load suppliers."
            );
          }
        } else {
          setError(
            "Unable to load suppliers."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    void loadInitialData();
  }, []);

  /*
   * --------------------------------------------------
   * SEARCH
   * --------------------------------------------------
   */

  const filteredSuppliers =
    suppliers.filter((supplier) => {
      const searchValue =
        search
          .toLowerCase()
          .trim();

      return (
        supplier.supplier_name
          .toLowerCase()
          .includes(searchValue) ||
        supplier.contact_person
          .toLowerCase()
          .includes(searchValue) ||
        supplier.phone
          .toLowerCase()
          .includes(searchValue) ||
        supplier.email
          .toLowerCase()
          .includes(searchValue) ||
        supplier.address
          .toLowerCase()
          .includes(searchValue)
      );
    });

  /*
   * --------------------------------------------------
   * INPUT CHANGE
   * --------------------------------------------------
   */

  const handleInputChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } =
      event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  /*
   * --------------------------------------------------
   * RESET FORM
   * --------------------------------------------------
   */

  const resetForm = () => {
    setFormData({
      supplier_name: "",
      contact_person: "",
      phone: "",
      email: "",
      address: "",
    });

    setEditingSupplierId(null);
  };

  /*
   * --------------------------------------------------
   * ADD SUPPLIER
   * --------------------------------------------------
   */

  const handleAddSupplier = () => {
    resetForm();

    setShowForm(true);
    setError("");
    setSuccess("");
  };

  /*
   * --------------------------------------------------
   * EDIT SUPPLIER
   * --------------------------------------------------
   */

  const handleEditSupplier = (
    supplier: Supplier
  ) => {
    setEditingSupplierId(
      supplier.supplier_id
    );

    setFormData({
      supplier_name:
        supplier.supplier_name,

      contact_person:
        supplier.contact_person,

      phone:
        supplier.phone,

      email:
        supplier.email,

      address:
        supplier.address,
    });

    setShowForm(true);
    setError("");
    setSuccess("");
  };

  /*
   * --------------------------------------------------
   * DELETE SUPPLIER
   * --------------------------------------------------
   */

  const handleDeleteSupplier = async (
    supplier: Supplier
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${supplier.supplier_name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteSupplier(
        supplier.supplier_id
      );

      setSuccess(
        "Supplier deleted successfully."
      );

      await loadSuppliers();
    } catch (error) {
      console.error(
        "Failed to delete supplier:",
        error
      );

      if (axios.isAxiosError(error)) {
        const backendMessage =
          error.response?.data?.detail;

        if (
          typeof backendMessage === "string"
        ) {
          setError(
            backendMessage
          );
        } else if (
          error.response?.status === 409
        ) {
          setError(
            "Supplier cannot be deleted because it is being used by existing products."
          );
        } else {
          setError(
            "Unable to delete supplier."
          );
        }
      } else {
        setError(
          "Unable to delete supplier."
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
   * SAVE SUPPLIER
   * --------------------------------------------------
   */

  const handleSaveSupplier = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    /*
     * VALIDATION
     */

    if (
      !formData.supplier_name.trim()
    ) {
      setError(
        "Supplier name is required."
      );
      return;
    }

    if (
      formData.supplier_name.trim()
        .length < 2
    ) {
      setError(
        "Supplier name must contain at least 2 characters."
      );
      return;
    }

    if (
      !formData.contact_person.trim()
    ) {
      setError(
        "Contact person is required."
      );
      return;
    }

    if (!formData.phone.trim()) {
      setError(
        "Phone number is required."
      );
      return;
    }

    /*
     * Basic phone validation
     */
    const phoneValue =
      formData.phone.trim();

    if (
      !/^[0-9+\-\s()]{7,20}$/.test(
        phoneValue
      )
    ) {
      setError(
        "Please enter a valid phone number."
      );
      return;
    }

    if (!formData.email.trim()) {
      setError(
        "Email is required."
      );
      return;
    }

    /*
     * Email validation
     */
    const emailValue =
      formData.email
        .trim()
        .toLowerCase();

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        emailValue
      )
    ) {
      setError(
        "Please enter a valid email address."
      );
      return;
    }

    if (!formData.address.trim()) {
      setError(
        "Address is required."
      );
      return;
    }

    /*
     * Check duplicate email
     */

    const duplicateSupplier =
      suppliers.find(
        (supplier) =>
          supplier.email
            .trim()
            .toLowerCase() ===
            emailValue &&
          supplier.supplier_id !==
            editingSupplierId
      );

    if (duplicateSupplier) {
      setError(
        "Supplier with this email already exists."
      );
      return;
    }

    /*
     * SAVE
     */

    try {
      setSaving(true);

      const supplierData: SupplierCreate =
        {
          supplier_name:
            formData.supplier_name.trim(),

          contact_person:
            formData.contact_person.trim(),

          phone:
            formData.phone.trim(),

          email:
            emailValue,

          address:
            formData.address.trim(),
        };

      if (
        editingSupplierId !== null
      ) {
        await updateSupplier(
          editingSupplierId,
          supplierData
        );

        setSuccess(
          "Supplier updated successfully."
        );
      } else {
        await createSupplier(
          supplierData
        );

        setSuccess(
          "Supplier created successfully."
        );
      }

      resetForm();
      setShowForm(false);

      await loadSuppliers();
    } catch (error) {
      console.error(
        "Failed to save supplier:",
        error
      );

      if (axios.isAxiosError(error)) {
        const backendMessage =
          error.response?.data?.detail;

        if (
          typeof backendMessage === "string"
        ) {
          setError(
            backendMessage
          );
        } else {
          setError(
            "Unable to save supplier. Please check the entered data."
          );
        }
      } else {
        setError(
          "Unable to save supplier. Please check the entered data."
        );
      }
    } finally {
      setSaving(false);
    }
  };

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
          <h1>Suppliers</h1>

          <p>
            Manage your boutique
            suppliers and contact
            information.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={
            handleAddSupplier
          }
        >
          + Add Supplier
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

      {/* Summary */}
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <div className="dashboard-card-title">
            Total Suppliers
          </div>

          <div className="dashboard-card-value">
            {suppliers.length}
          </div>
        </div>
      </div>

      {/* Supplier Form */}
      {showForm && (
        <div className="product-form-container">
          <div className="product-form-header">
            <div>
              <h2>
                {editingSupplierId !==
                null
                  ? "Edit Supplier"
                  : "Add Supplier"}
              </h2>

              <p>
                {editingSupplierId !==
                null
                  ? "Update supplier information."
                  : "Add a new supplier to your boutique."}
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
              handleSaveSupplier
            }
          >
            <div className="form-grid">
              {/* Supplier Name */}
              <div className="form-group">
                <label>
                  Supplier Name
                </label>

                <input
                  name="supplier_name"
                  type="text"
                  value={
                    formData.supplier_name
                  }
                  onChange={
                    handleInputChange
                  }
                  placeholder="Enter supplier name"
                />
              </div>

              {/* Contact Person */}
              <div className="form-group">
                <label>
                  Contact Person
                </label>

                <input
                  name="contact_person"
                  type="text"
                  value={
                    formData.contact_person
                  }
                  onChange={
                    handleInputChange
                  }
                  placeholder="Enter contact person"
                />
              </div>

              {/* Phone */}
              <div className="form-group">
                <label>
                  Phone
                </label>

                <input
                  name="phone"
                  type="tel"
                  value={
                    formData.phone
                  }
                  onChange={
                    handleInputChange
                  }
                  placeholder="e.g. +91 9876543210"
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <label>
                  Email
                </label>

                <input
                  name="email"
                  type="email"
                  value={
                    formData.email
                  }
                  onChange={
                    handleInputChange
                  }
                  placeholder="supplier@example.com"
                />
              </div>

              {/* Address */}
              <div className="form-group form-group-full">
                <label>
                  Address
                </label>

                <textarea
                  name="address"
                  value={
                    formData.address
                  }
                  onChange={
                    handleInputChange
                  }
                  placeholder="Enter supplier address"
                  rows={4}
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
                  ? editingSupplierId !==
                    null
                    ? "Updating..."
                    : "Creating..."
                  : editingSupplierId !==
                    null
                    ? "Update Supplier"
                    : "Create Supplier"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="products-toolbar">
        <input
          type="text"
          placeholder="Search by supplier, contact, phone, email or address..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
        />
      </div>

      {/* Suppliers Table */}
      <div className="products-table-container">
        {loading ? (
          <div className="table-empty">
            Loading suppliers...
          </div>
        ) : filteredSuppliers.length ===
          0 ? (
          <div className="table-empty">
            No suppliers found.
          </div>
        ) : (
          <table className="products-table">
            <thead>
              <tr>
                <th>ID</th>

                <th>
                  Supplier
                </th>

                <th>
                  Contact Person
                </th>

                <th>
                  Phone
                </th>

                <th>
                  Email
                </th>

                <th>
                  Address
                </th>

                <th>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredSuppliers.map(
                (supplier) => (
                  <tr
                    key={
                      supplier.supplier_id
                    }
                  >
                    <td>
                      {
                        supplier.supplier_id
                      }
                    </td>

                    <td>
                      <strong>
                        {
                          supplier.supplier_name
                        }
                      </strong>
                    </td>

                    <td>
                      {
                        supplier.contact_person
                      }
                    </td>

                    <td>
                      {supplier.phone}
                    </td>

                    <td>
                      {supplier.email}
                    </td>

                    <td>
                      {supplier.address}
                    </td>

                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          onClick={() =>
                            handleEditSupplier(
                              supplier
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-button"
                          onClick={() =>
                            handleDeleteSupplier(
                              supplier
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
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

export default Suppliers;