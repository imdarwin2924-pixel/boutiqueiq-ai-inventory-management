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

import { useAuth } from "../hooks/useAuth";

function Suppliers() {
  /*
   * --------------------------------------------------
   * AUTH / RBAC
   * --------------------------------------------------
   */

  const { isAdmin, isManager } = useAuth();

  const canManageSuppliers =
    isAdmin || isManager;

  /*
   * --------------------------------------------------
   * STATE
   * --------------------------------------------------
   */

  const [suppliers, setSuppliers] =
    useState<Supplier[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingSupplierId, setDeletingSupplierId] =
    useState<number | null>(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

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
   * ERROR HANDLER
   * --------------------------------------------------
   */

  const getErrorMessage = (
    error: unknown,
    fallback: string
  ): string => {
    if (axios.isAxiosError(error)) {
      const backendMessage =
        error.response?.data?.detail;

      if (
        typeof backendMessage === "string"
      ) {
        return backendMessage;
      }

      if (
        error.response?.status === 401
      ) {
        return "Your session has expired. Please log in again.";
      }

      if (
        error.response?.status === 403
      ) {
        return "You do not have permission to perform this action.";
      }

      if (
        error.response?.status === 404
      ) {
        return "Supplier was not found.";
      }

      if (
        error.response?.status === 409
      ) {
        return "This supplier already exists or is being used by another record.";
      }
    }

    return fallback;
  };

  /*
   * --------------------------------------------------
   * LOAD SUPPLIERS
   * --------------------------------------------------
   */

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      setError("");

      const suppliersData =
        await getSuppliers();

      setSuppliers(suppliersData);
    } catch (error) {
      console.error(
        "Failed to load suppliers:",
        error
      );

      setError(
        getErrorMessage(
          error,
          "Unable to load suppliers."
        )
      );
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
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError("");

        const suppliersData =
          await getSuppliers();

        if (isMounted) {
          setSuppliers(
            suppliersData
          );
        }
      } catch (error) {
        console.error(
          "Failed to load suppliers:",
          error
        );

        if (isMounted) {
          setError(
            getErrorMessage(
              error,
              "Unable to load suppliers."
            )
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  /*
   * --------------------------------------------------
   * SEARCH
   * --------------------------------------------------
   */

  const searchValue =
    search
      .toLowerCase()
      .trim();

  const filteredSuppliers =
    suppliers.filter(
      (supplier) =>
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
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (current) => ({
        ...current,
        [name]: value,
      })
    );

    if (error) {
      setError("");
    }
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

    setEditingSupplierId(
      null
    );
  };

  /*
   * --------------------------------------------------
   * ADD SUPPLIER
   * --------------------------------------------------
   */

  const handleAddSupplier = () => {
    if (!canManageSuppliers) {
      setError(
        "You do not have permission to add suppliers."
      );
      return;
    }

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
    if (!canManageSuppliers) {
      setError(
        "You do not have permission to edit suppliers."
      );
      return;
    }

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
    if (!canManageSuppliers) {
      setError(
        "You do not have permission to delete suppliers."
      );
      return;
    }

    if (
      deletingSupplierId !== null
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${supplier.supplier_name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingSupplierId(
        supplier.supplier_id
      );

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

      setError(
        getErrorMessage(
          error,
          "Unable to delete supplier."
        )
      );
    } finally {
      setDeletingSupplierId(
        null
      );
    }
  };

  /*
   * --------------------------------------------------
   * CLOSE FORM
   * --------------------------------------------------
   */

  const handleCloseForm = () => {
    if (saving) {
      return;
    }

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

    if (!canManageSuppliers) {
      setError(
        "You do not have permission to manage suppliers."
      );
      return;
    }

    if (saving) {
      return;
    }

    setError("");
    setSuccess("");

    /*
     * --------------------------------------------------
     * VALIDATION
     * --------------------------------------------------
     */

    const supplierName =
      formData.supplier_name.trim();

    const contactPerson =
      formData.contact_person.trim();

    const phone =
      formData.phone.trim();

    const email =
      formData.email
        .trim()
        .toLowerCase();

    const address =
      formData.address.trim();

    if (!supplierName) {
      setError(
        "Supplier name is required."
      );
      return;
    }

    if (
      supplierName.length < 2
    ) {
      setError(
        "Supplier name must contain at least 2 characters."
      );
      return;
    }

    if (!contactPerson) {
      setError(
        "Contact person is required."
      );
      return;
    }

    if (!phone) {
      setError(
        "Phone number is required."
      );
      return;
    }

    /*
     * Phone validation
     */

    if (
      !/^[0-9+\-\s()]{7,20}$/.test(
        phone
      )
    ) {
      setError(
        "Please enter a valid phone number."
      );
      return;
    }

    if (!email) {
      setError(
        "Email is required."
      );
      return;
    }

    /*
     * Email validation
     */

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {
      setError(
        "Please enter a valid email address."
      );
      return;
    }

    if (!address) {
      setError(
        "Address is required."
      );
      return;
    }

    /*
     * --------------------------------------------------
     * DUPLICATE EMAIL CHECK
     * --------------------------------------------------
     */

    const duplicateSupplier =
      suppliers.find(
        (supplier) =>
          supplier.email
            .trim()
            .toLowerCase() ===
            email &&
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
     * --------------------------------------------------
     * SAVE
     * --------------------------------------------------
     */

    try {
      setSaving(true);

      const supplierData: SupplierCreate =
        {
          supplier_name:
            supplierName,

          contact_person:
            contactPerson,

          phone,

          email,

          address,
        };

      if (
        editingSupplierId !==
        null
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

      setError(
        getErrorMessage(
          error,
          "Unable to save supplier. Please check the entered data."
        )
      );
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

      {/* --------------------------------------------------
          PAGE HEADER
      -------------------------------------------------- */}

      <div className="page-header">
        <div>
          <h1>Suppliers</h1>

          <p>
            Manage your boutique
            suppliers and contact
            information.
          </p>
        </div>

        {canManageSuppliers && (
          <button
            className="primary-button"
            onClick={
              handleAddSupplier
            }
          >
            + Add Supplier
          </button>
        )}
      </div>

      {/* --------------------------------------------------
          ERROR
      -------------------------------------------------- */}

      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      {/* --------------------------------------------------
          SUCCESS
      -------------------------------------------------- */}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      {/* --------------------------------------------------
          SUMMARY
      -------------------------------------------------- */}

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

      {/* --------------------------------------------------
          SUPPLIER FORM
      -------------------------------------------------- */}

      {showForm &&
        canManageSuppliers && (
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
                disabled={saving}
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
                    disabled={saving}
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
                    disabled={saving}
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
                    disabled={saving}
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
                    disabled={saving}
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
                    disabled={saving}
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

      {/* --------------------------------------------------
          SEARCH
      -------------------------------------------------- */}

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

      {/* --------------------------------------------------
          SUPPLIERS TABLE
      -------------------------------------------------- */}

      <div className="products-table-container">

        {loading ? (
          <div className="table-empty">
            Loading suppliers...
          </div>
        ) : filteredSuppliers.length ===
          0 ? (
          <div className="table-empty">
            {searchValue
              ? "No suppliers match your search."
              : "No suppliers found."}
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

                {canManageSuppliers && (
                  <th>
                    Actions
                  </th>
                )}
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

                    {canManageSuppliers && (
                      <td>
                        <div className="table-actions">

                          <button
                            type="button"
                            onClick={() =>
                              handleEditSupplier(
                                supplier
                              )
                            }
                            disabled={
                              saving ||
                              deletingSupplierId !==
                                null
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
                            disabled={
                              deletingSupplierId ===
                              supplier.supplier_id
                            }
                          >
                            {deletingSupplierId ===
                            supplier.supplier_id
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

export default Suppliers;