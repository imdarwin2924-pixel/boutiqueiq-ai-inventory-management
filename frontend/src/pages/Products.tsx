import { useEffect, useState } from "react";
import axios from "axios";
import type {
  ChangeEvent,
  FormEvent,
} from "react";

import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
  type Product,
  type ProductCreate,
  type ProductUpdate,
} from "../services/productService";

import {
  getCategories,
  type Category,
} from "../services/categoryService";

function Products() {
  const [products, setProducts] = useState<Product[]>(
    []
  );

  const [categories, setCategories] = useState<Category[]>(
    []
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingProductId, setEditingProductId] =
    useState<number | null>(null);

  /*
   * --------------------------------------------------
   * FORM DATA
   * --------------------------------------------------
   *
   * Matches backend ProductCreate / ProductUpdate.
   *
   * Operational stock is NOT included here.
   * Stock is managed by the Inventory module.
   */
  const [formData, setFormData] =
    useState<ProductCreate>({
      product_name: "",
      sku: "",
      brand: "",
      size: "",
      color: "",
      category_id: 0,
      purchase_price: 0,
      selling_price: 0,
    });

  /*
   * --------------------------------------------------
   * LOAD PRODUCTS + CATEGORIES
   * --------------------------------------------------
   */

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        productsData,
        categoriesData,
      ] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);

      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error(
        "Failed to load products:",
        error
      );

      if (axios.isAxiosError(error)) {
        const backendMessage =
          error.response?.data?.detail;

        if (
          typeof backendMessage === "string"
        ) {
          setError(backendMessage);
        } else {
          setError(
            "Unable to load products."
          );
        }
      } else {
        setError(
          "Unable to load products."
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
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        const [
          productsData,
          categoriesData,
        ] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);

        if (!isMounted) {
          return;
        }

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.error(
          "Failed to load products:",
          error
        );

        if (axios.isAxiosError(error)) {
          const backendMessage =
            error.response?.data?.detail;

          if (
            typeof backendMessage === "string"
          ) {
            setError(backendMessage);
          } else {
            setError(
              "Unable to load products."
            );
          }
        } else {
          setError(
            "Unable to load products."
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
   * CATEGORY NAME
   * --------------------------------------------------
   */

  const getCategoryName = (
    categoryId: number
  ) => {
    const category = categories.find(
      (item) =>
        item.category_id === categoryId
    );

    return (
      category?.category_name ??
      "Unknown"
    );
  };

  /*
   * --------------------------------------------------
   * SEARCH + FILTER
   * --------------------------------------------------
   */

  const filteredProducts =
    products.filter((product) => {
      const searchValue =
        search.toLowerCase().trim();

      const matchesSearch =
        product.product_name
          .toLowerCase()
          .includes(searchValue) ||
        product.sku
          .toLowerCase()
          .includes(searchValue) ||
        product.brand
          .toLowerCase()
          .includes(searchValue);

      const matchesCategory =
        categoryFilter === "" ||
        product.category_id.toString() ===
          categoryFilter;

      return (
        matchesSearch &&
        matchesCategory
      );
    });

  /*
   * --------------------------------------------------
   * FORM INPUT CHANGE
   * --------------------------------------------------
   */

  const handleInputChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((current) => {
      if (name === "category_id") {
        return {
          ...current,
          category_id:
            value === ""
              ? 0
              : Number(value),
        };
      }

      if (
        name === "purchase_price"
      ) {
        return {
          ...current,
          purchase_price:
            value === ""
              ? 0
              : Number(value),
        };
      }

      if (
        name === "selling_price"
      ) {
        return {
          ...current,
          selling_price:
            value === ""
              ? 0
              : Number(value),
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
      product_name: "",
      sku: "",
      brand: "",
      size: "",
      color: "",
      category_id: 0,
      purchase_price: 0,
      selling_price: 0,
    });

    setEditingProductId(null);
  };

  /*
   * --------------------------------------------------
   * ADD PRODUCT
   * --------------------------------------------------
   */

  const handleAddProduct = () => {
    resetForm();

    setShowForm(true);
    setError("");
    setSuccess("");
  };

  /*
   * --------------------------------------------------
   * EDIT PRODUCT
   * --------------------------------------------------
   */

  const handleEditProduct = (
    product: Product
  ) => {
    setEditingProductId(
      product.product_id
    );

    setFormData({
      product_name:
        product.product_name,
      sku: product.sku,
      brand: product.brand,
      size: product.size,
      color: product.color,
      category_id:
        product.category_id,
      purchase_price:
        Number(product.purchase_price),
      selling_price:
        Number(product.selling_price),
    });

    setShowForm(true);
    setError("");
    setSuccess("");
  };

  /*
   * --------------------------------------------------
   * DELETE PRODUCT
   * --------------------------------------------------
   */

  const handleDeleteProduct = async (
    product: Product
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${product.product_name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteProduct(
        product.product_id
      );

      setSuccess(
        "Product deleted successfully."
      );

      await loadProducts();
    } catch (error) {
      console.error(
        "Failed to delete product:",
        error
      );

      if (axios.isAxiosError(error)) {
        const backendMessage =
          error.response?.data?.detail;

        if (
          typeof backendMessage === "string"
        ) {
          setError(backendMessage);
        } else if (
          error.response?.status === 409
        ) {
          setError(
            "Product cannot be deleted because it is referenced by existing records."
          );
        } else {
          setError(
            "Unable to delete product."
          );
        }
      } else {
        setError(
          "Unable to delete product."
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
   * SAVE PRODUCT
   * --------------------------------------------------
   */

  const handleSaveProduct = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    /*
     * --------------------------------------------------
     * VALIDATION
     * --------------------------------------------------
     */

    if (
      !formData.product_name.trim()
    ) {
      setError(
        "Product name is required."
      );
      return;
    }

    if (!formData.sku.trim()) {
      setError("SKU is required.");
      return;
    }

    if (!formData.brand.trim()) {
      setError(
        "Brand is required."
      );
      return;
    }

    if (!formData.size.trim()) {
      setError("Size is required.");
      return;
    }

    if (!formData.color.trim()) {
      setError("Color is required.");
      return;
    }

    if (!formData.category_id) {
      setError(
        "Please select a category."
      );
      return;
    }

    if (
      formData.purchase_price <= 0
    ) {
      setError(
        "Purchase price must be greater than 0."
      );
      return;
    }

    if (
      formData.selling_price <= 0
    ) {
      setError(
        "Selling price must be greater than 0."
      );
      return;
    }

    /*
     * --------------------------------------------------
     * PREPARE UPDATE DATA
     * --------------------------------------------------
     */

    const productData: ProductUpdate = {
      category_id:
        formData.category_id,

      product_name:
        formData.product_name.trim(),

      sku: formData.sku.trim(),

      brand:
        formData.brand.trim(),

      size:
        formData.size.trim(),

      color:
        formData.color.trim(),

      purchase_price:
        formData.purchase_price,

      selling_price:
        formData.selling_price,
    };

    /*
     * --------------------------------------------------
     * SAVE
     * --------------------------------------------------
     */

    try {
      setSaving(true);

      if (
        editingProductId !== null
      ) {
        await updateProduct(
          editingProductId,
          productData
        );

        setSuccess(
          "Product updated successfully."
        );
      } else {
        await createProduct(
          formData
        );

        setSuccess(
          "Product created successfully."
        );
      }

      resetForm();
      setShowForm(false);

      await loadProducts();
    } catch (error) {
      console.error(
        "Failed to save product:",
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
            "SKU already exists or the product conflicts with an existing record."
          );
        } else if (
          error.response?.status ===
          400
        ) {
          setError(
            "Invalid product data. Please check the entered information."
          );
        } else {
          setError(
            "Unable to save product. Please check the entered data."
          );
        }
      } else {
        setError(
          "Unable to save product. Please check the entered data."
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
          <h1>Products</h1>

          <p>
            Manage your boutique product
            catalog.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={handleAddProduct}
        >
          + Add Product
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

      {/* Product Form */}
      {showForm && (
        <div className="product-form-container">

          <div className="product-form-header">
            <div>
              <h2>
                {editingProductId !== null
                  ? "Edit Product"
                  : "Add Product"}
              </h2>

              <p>
                {editingProductId !== null
                  ? "Update product information."
                  : "Create a new product in your catalog."}
              </p>
            </div>

            <button
              type="button"
              className="close-button"
              onClick={handleCloseForm}
            >
              ×
            </button>
          </div>

          <form
            className="product-form"
            onSubmit={
              handleSaveProduct
            }
          >
            <div className="form-grid">

              {/* Product Name */}
              <div className="form-group">
                <label>
                  Product Name
                </label>

                <input
                  name="product_name"
                  type="text"
                  value={
                    formData.product_name
                  }
                  onChange={
                    handleInputChange
                  }
                  placeholder="Enter product name"
                />
              </div>

              {/* SKU */}
              <div className="form-group">
                <label>SKU</label>

                <input
                  name="sku"
                  type="text"
                  value={formData.sku}
                  onChange={
                    handleInputChange
                  }
                  placeholder="e.g. TS-001"
                />
              </div>

              {/* Brand */}
              <div className="form-group">
                <label>Brand</label>

                <input
                  name="brand"
                  type="text"
                  value={
                    formData.brand
                  }
                  onChange={
                    handleInputChange
                  }
                  placeholder="Enter brand"
                />
              </div>

              {/* Size */}
              <div className="form-group">
                <label>Size</label>

                <input
                  name="size"
                  type="text"
                  value={
                    formData.size
                  }
                  onChange={
                    handleInputChange
                  }
                  placeholder="e.g. M, L, XL"
                />
              </div>

              {/* Color */}
              <div className="form-group">
                <label>Color</label>

                <input
                  name="color"
                  type="text"
                  value={
                    formData.color
                  }
                  onChange={
                    handleInputChange
                  }
                  placeholder="Enter color"
                />
              </div>

              {/* Category */}
              <div className="form-group">
                <label>
                  Category
                </label>

                <select
                  name="category_id"
                  value={
                    formData.category_id
                  }
                  onChange={
                    handleInputChange
                  }
                >
                  <option value={0}>
                    Select category
                  </option>

                  {categories.map(
                    (category) => (
                      <option
                        key={
                          category.category_id
                        }
                        value={
                          category.category_id
                        }
                      >
                        {
                          category.category_name
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Purchase Price */}
              <div className="form-group">
                <label>
                  Purchase Price
                </label>

                <input
                  name="purchase_price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    formData.purchase_price
                  }
                  onChange={
                    handleInputChange
                  }
                />
              </div>

              {/* Selling Price */}
              <div className="form-group">
                <label>
                  Selling Price
                </label>

                <input
                  name="selling_price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    formData.selling_price
                  }
                  onChange={
                    handleInputChange
                  }
                />
              </div>

            </div>

            {/* Inventory Notice */}
            <div
              className="inventory-info"
              style={{
                marginTop: "16px",
                padding: "12px 14px",
                borderRadius: "8px",
                background:
                  "#f5f7fa",
                fontSize: "14px",
              }}
            >
              Product quantity is managed
              separately through the
              Inventory module.
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
                  ? editingProductId !==
                    null
                    ? "Updating..."
                    : "Creating..."
                  : editingProductId !==
                    null
                  ? "Update Product"
                  : "Create Product"}
              </button>

            </div>
          </form>
        </div>
      )}

      {/* Search and Filter */}
      <div className="products-toolbar">

        <input
          type="text"
          placeholder="Search by product name, SKU or brand..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
        />

        <select
          value={categoryFilter}
          onChange={(event) =>
            setCategoryFilter(
              event.target.value
            )
          }
        >
          <option value="">
            All Categories
          </option>

          {categories.map(
            (category) => (
              <option
                key={
                  category.category_id
                }
                value={
                  category.category_id
                }
              >
                {
                  category.category_name
                }
              </option>
            )
          )}
        </select>

      </div>

      {/* Products Table */}
      <div className="products-table-container">

        {loading ? (
          <div className="table-empty">
            Loading products...
          </div>
        ) : filteredProducts.length ===
          0 ? (
          <div className="table-empty">
            No products found.
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
                  Category
                </th>

                <th>
                  Brand
                </th>

                <th>
                  Size
                </th>

                <th>
                  Color
                </th>

                <th>
                  Purchase Price
                </th>

                <th>
                  Selling Price
                </th>

                <th>
                  Stock
                </th>

                <th>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>

              {filteredProducts.map(
                (product) => (
                  <tr
                    key={
                      product.product_id
                    }
                  >

                    <td>
                      <strong>
                        {
                          product.product_name
                        }
                      </strong>
                    </td>

                    <td>
                      {product.sku}
                    </td>

                    <td>
                      {getCategoryName(
                        product.category_id
                      )}
                    </td>

                    <td>
                      {product.brand}
                    </td>

                    <td>
                      {product.size}
                    </td>

                    <td>
                      {product.color}
                    </td>

                    <td>
                      ₹
                      {Number(
                        product.purchase_price
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td>
                      ₹
                      {Number(
                        product.selling_price
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    {/* Backward-compatible stock display */}
                    <td>
                      {product.stock_quantity}
                    </td>

                    <td>
                      <div className="table-actions">

                        <button
                          type="button"
                          onClick={() =>
                            handleEditProduct(
                              product
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-button"
                          onClick={() =>
                            handleDeleteProduct(
                              product
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

export default Products;