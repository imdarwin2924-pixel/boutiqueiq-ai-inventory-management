import { useEffect, useState } from "react";
import axios from "axios";
import type { ChangeEvent, FormEvent } from "react";

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
  type Category,
  type CategoryCreate,
} from "../services/categoryService";

function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingCategoryId, setEditingCategoryId] =
    useState<number | null>(null);

  const [formData, setFormData] =
    useState<CategoryCreate>({
      category_name: "",
      description: "",
    });

  /*
   * --------------------------------------------------
   * LOAD CATEGORIES
   * --------------------------------------------------
   */

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const categoriesData =
        await getCategories();

      setCategories(categoriesData);
    } catch (error) {
      console.error(
        "Failed to load categories:",
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
            "Unable to load categories."
          );
        }
      } else {
        setError(
          "Unable to load categories."
        );
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

        const categoriesData =
          await getCategories();

        setCategories(
          categoriesData
        );
      } catch (error) {
        console.error(
          "Failed to load categories:",
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
              "Unable to load categories."
            );
          }
        } else {
          setError(
            "Unable to load categories."
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

  const filteredCategories =
    categories.filter((category) => {
      const searchValue =
        search
          .toLowerCase()
          .trim();

      return (
        category.category_name
          .toLowerCase()
          .includes(searchValue) ||
        (
          category.description ??
          ""
        )
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
      HTMLInputElement |
      HTMLTextAreaElement
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
      category_name: "",
      description: "",
    });

    setEditingCategoryId(null);
  };

  /*
   * --------------------------------------------------
   * ADD CATEGORY
   * --------------------------------------------------
   */

  const handleAddCategory = () => {
    resetForm();

    setShowForm(true);
    setError("");
    setSuccess("");
  };

  /*
   * --------------------------------------------------
   * EDIT CATEGORY
   * --------------------------------------------------
   */

  const handleEditCategory = (
    category: Category
  ) => {
    setEditingCategoryId(
      category.category_id
    );

    setFormData({
      category_name:
        category.category_name,
      description:
        category.description ??
        "",
    });

    setShowForm(true);
    setError("");
    setSuccess("");
  };

  /*
   * --------------------------------------------------
   * DELETE CATEGORY
   * --------------------------------------------------
   */

  const handleDeleteCategory = async (
    category: Category
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${category.category_name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteCategory(
        category.category_id
      );

      setSuccess(
        "Category deleted successfully."
      );

      await loadCategories();
    } catch (error) {
      console.error(
        "Failed to delete category:",
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
        } else if (
          error.response?.status ===
          409
        ) {
          setError(
            "Category cannot be deleted because it is being used by existing products."
          );
        } else {
          setError(
            "Unable to delete category."
          );
        }
      } else {
        setError(
          "Unable to delete category."
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
   * SAVE CATEGORY
   * --------------------------------------------------
   */

  const handleSaveCategory = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    /*
     * VALIDATION
     */

    if (
      !formData.category_name.trim()
    ) {
      setError(
        "Category name is required."
      );
      return;
    }

    if (
      formData.category_name.trim()
        .length < 2
    ) {
      setError(
        "Category name must contain at least 2 characters."
      );
      return;
    }

    /*
     * CHECK DUPLICATE NAME
     *
     * This gives the user an immediate
     * frontend validation before the
     * backend check.
     */

    const duplicateCategory =
      categories.find(
        (category) =>
          category.category_name
            .trim()
            .toLowerCase() ===
            formData.category_name
              .trim()
              .toLowerCase() &&
          category.category_id !==
            editingCategoryId
      );

    if (duplicateCategory) {
      setError(
        "Category already exists."
      );
      return;
    }

    /*
     * SAVE
     */

    try {
      setSaving(true);

      const categoryData: CategoryCreate =
        {
          category_name:
            formData.category_name.trim(),
          description:
            formData.description?.trim() ||
            "",
        };

      if (
        editingCategoryId !==
        null
      ) {
        await updateCategory(
          editingCategoryId,
          categoryData
        );

        setSuccess(
          "Category updated successfully."
        );
      } else {
        await createCategory(
          categoryData
        );

        setSuccess(
          "Category created successfully."
        );
      }

      resetForm();
      setShowForm(false);

      await loadCategories();
    } catch (error) {
      console.error(
        "Failed to save category:",
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
            "Unable to save category. Please check the entered data."
          );
        }
      } else {
        setError(
          "Unable to save category. Please check the entered data."
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
          <h1>Categories</h1>

          <p>
            Organize your boutique
            products into categories.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={
            handleAddCategory
          }
        >
          + Add Category
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
            Total Categories
          </div>

          <div className="dashboard-card-value">
            {categories.length}
          </div>
        </div>
      </div>

      {/* Category Form */}
      {showForm && (
        <div className="product-form-container">
          <div className="product-form-header">
            <div>
              <h2>
                {editingCategoryId !==
                null
                  ? "Edit Category"
                  : "Add Category"}
              </h2>

              <p>
                {editingCategoryId !==
                null
                  ? "Update category information."
                  : "Create a new product category."}
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
              handleSaveCategory
            }
          >
            <div className="form-grid">
              {/* Category Name */}
              <div className="form-group">
                <label>
                  Category Name
                </label>

                <input
                  name="category_name"
                  type="text"
                  value={
                    formData.category_name
                  }
                  onChange={
                    handleInputChange
                  }
                  placeholder="e.g. Sarees"
                />
              </div>

              {/* Description */}
              <div className="form-group form-group-full">
                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    formData.description ??
                    ""
                  }
                  onChange={
                    handleInputChange
                  }
                  placeholder="Enter category description"
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
                  ? editingCategoryId !==
                    null
                    ? "Updating..."
                    : "Creating..."
                  : editingCategoryId !==
                    null
                    ? "Update Category"
                    : "Create Category"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="products-toolbar">
        <input
          type="text"
          placeholder="Search by category name or description..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
        />
      </div>

      {/* Categories Table */}
      <div className="products-table-container">
        {loading ? (
          <div className="table-empty">
            Loading categories...
          </div>
        ) : filteredCategories.length ===
          0 ? (
          <div className="table-empty">
            No categories found.
          </div>
        ) : (
          <table className="products-table">
            <thead>
              <tr>
                <th>
                  ID
                </th>

                <th>
                  Category Name
                </th>

                <th>
                  Description
                </th>

                <th>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredCategories.map(
                (category) => (
                  <tr
                    key={
                      category.category_id
                    }
                  >
                    <td>
                      {
                        category.category_id
                      }
                    </td>

                    <td>
                      <strong>
                        {
                          category.category_name
                        }
                      </strong>
                    </td>

                    <td>
                      {category.description ||
                        "-"}
                    </td>

                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          onClick={() =>
                            handleEditCategory(
                              category
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-button"
                          onClick={() =>
                            handleDeleteCategory(
                              category
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

export default Categories;