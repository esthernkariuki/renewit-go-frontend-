import React, { useEffect, useState } from "react";

import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../utils/api/fetchProductsApi";

import "./style.css";

const API_BASE =process.env.REACT_APP_BASE_URL;

const emptyForm = {
  upcycled_clothes: "",
  description: "",
  quantity: "",
  type: "",
  material: "",
  size: "",
  color: "",
  condition: "",
  location: "",
  price: "",
  status: "available",
  image: null,
};

export default function Products() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    ...emptyForm,
  });

  const [imagePreview, setImagePreview] = useState("");

  const token = localStorage.getItem("token");

  // =========================================================
  // LOAD PRODUCTS
  // =========================================================

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await fetchProducts(1);

      if (Array.isArray(result)) {
        setProducts(result);
      } else if (Array.isArray(result?.data)) {
        setProducts(result.data);
      } else if (Array.isArray(result?.products)) {
        setProducts(result.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      setError(err.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    loadProducts();
  }, [token]);

  // =========================================================
  // FORM INPUT
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // IMAGE
  // =========================================================

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setFormData((previous) => ({
        ...previous,
        image: null,
      }));

      setImagePreview("");
      return;
    }

    // Only allow images
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      event.target.value = "";
      return;
    }

    // Optional size limit: 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      event.target.value = "";
      return;
    }

    setError("");

    setFormData((previous) => ({
      ...previous,
      image: file,
    }));

    setImagePreview(URL.createObjectURL(file));
  };

  // =========================================================
  // ADD PRODUCT
  // =========================================================

  const handleAddProduct = () => {
    setEditingProduct(null);

    setFormData({
      ...emptyForm,
    });

    setImagePreview("");
    setError("");
    setSuccess("");

    setShowForm(true);
  };

  // =========================================================
  // EDIT PRODUCT
  // =========================================================

  const handleEdit = (product) => {
    setEditingProduct(product);

    setFormData({
      upcycled_clothes: product.upcycled_clothes || "",
      description: product.description || "",
      quantity: product.quantity || "",
      type: product.type || "",
      material: product.material || "",
      size: product.size || "",
      color: product.color || "",
      condition: product.condition || "",
      location: product.location || "",
      price: product.price || "",
      status: product.status || "available",
      image: null,
    });

    setImagePreview(
      product.image ? getImageUrl(product.image) : ""
    );

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  // =========================================================
  // IMAGE URL
  // =========================================================

  const getImageUrl = (image) => {
    if (!image) return "";

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    return `${API_BASE.replace(/\/$/, "")}/${image.replace(
      /^\//,
      ""
    )}`;
  };

  // =========================================================
  // CANCEL
  // =========================================================

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);

    setFormData({
      ...emptyForm,
    });

    setImagePreview("");
    setError("");
  };

  // =========================================================
  // SUBMIT PRODUCT
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const data = new FormData();

      data.append(
        "upcycled_clothes",
        formData.upcycled_clothes
      );

      data.append(
        "description",
        formData.description
      );

      data.append(
        "quantity",
        formData.quantity
      );

      data.append(
        "type",
        formData.type
      );

      data.append(
        "material",
        formData.material
      );

      data.append(
        "size",
        formData.size
      );

      data.append(
        "color",
        formData.color
      );

      data.append(
        "condition",
        formData.condition
      );

      data.append(
        "location",
        formData.location
      );

      data.append(
        "price",
        formData.price
      );

      data.append(
        "status",
        formData.status || "available"
      );

      // IMPORTANT:
      // Only append image when the user actually selected one.
      if (formData.image instanceof File) {
        data.append("image", formData.image);
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, data);

        setSuccess("Product updated successfully.");
      } else {
        await addProduct(data);

        setSuccess("Product added successfully.");
      }

      setShowForm(false);
      setEditingProduct(null);

      setFormData({
        ...emptyForm,
      });

      setImagePreview("");

      await loadProducts();
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong while saving the product."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await deleteProduct(id);

      setSuccess("Product deleted successfully.");

      await loadProducts();
    } catch (err) {
      setError(
        err.message || "Failed to delete product."
      );
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main className="products-page">
        <div className="products-loading">
          <div className="loading-spinner"></div>
          <p>Loading your products...</p>
        </div>
      </main>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <main className="products-page">

      {/* HEADER */}
      <header className="products-header">

        <div className="products-eyebrow">
          INVENTORY
        </div>

        <h1>My Products</h1>

        <p>
          Manage your upcycled products and keep your
          circular marketplace inventory up to date.
        </p>

        <div className="add-product-container">
          <button
            type="button"
            className="add-product-btn"
            onClick={handleAddProduct}
          >
            + Add Product
          </button>
        </div>

      </header>

      {/* MESSAGES */}

      {error && (
        <div className="product-error">
          <strong>Something went wrong</strong>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="product-success">
          {success}
        </div>
      )}

      {/* =====================================================
          ADD / EDIT FORM
      ===================================================== */}

      {showForm && (
        <section className="product-form-section">

          <div className="product-form-header">

            <div>
              <p className="form-label">
                {editingProduct
                  ? "EDIT PRODUCT"
                  : "NEW PRODUCT"}
              </p>

              <h2>
                {editingProduct
                  ? "Edit your product"
                  : "Add a new product"}
              </h2>

              <p>
                Add information about the upcycled item
                you want to list.
              </p>
            </div>

            <button
              type="button"
              className="close-form-button"
              onClick={handleCancel}
              disabled={saving}
            >
              ×
            </button>

          </div>

          <form
            className="product-form"
            onSubmit={handleSubmit}
          >

            {/* IMAGE */}

            <div className="form-group image-upload-group full-width">

              <label htmlFor="image">
                Product Image
              </label>

              <div className="image-upload-box">

                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="image-preview"
                  />
                ) : (
                  <div className="image-placeholder">
                    <span className="image-icon">
                      📷
                    </span>

                    <p>No image selected</p>

                    <small>
                      Upload a clear photo of your product
                    </small>
                  </div>
                )}

                <label
                  htmlFor="image"
                  className="choose-image-button"
                >
                  Choose Image
                </label>

                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                <small className="optional-text">
                  Image is optional.
                </small>

              </div>
            </div>

            {/* PRODUCT NAME */}

            <div className="form-group">
              <label htmlFor="upcycled_clothes">
                Product Name *
              </label>

              <input
                id="upcycled_clothes"
                name="upcycled_clothes"
                type="text"
                value={formData.upcycled_clothes}
                onChange={handleChange}
                placeholder="e.g. Upcycled denim jacket"
                required
              />
            </div>

            {/* TYPE */}

            <div className="form-group">
              <label htmlFor="type">
                Type *
              </label>

              <input
                id="type"
                name="type"
                type="text"
                value={formData.type}
                onChange={handleChange}
                placeholder="e.g. Jacket"
                required
              />
            </div>

            {/* DESCRIPTION */}

            <div className="form-group full-width">
              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your product..."
                rows="4"
              />
            </div>

            {/* QUANTITY */}

            <div className="form-group">
              <label htmlFor="quantity">
                Quantity *
              </label>

              <input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="10"
                required
              />
            </div>

            {/* MATERIAL */}

            <div className="form-group">
              <label htmlFor="material">
                Material
              </label>

              <input
                id="material"
                name="material"
                type="text"
                value={formData.material}
                onChange={handleChange}
                placeholder="e.g. Cotton"
              />
            </div>

            {/* SIZE */}

            <div className="form-group">
              <label htmlFor="size">
                Size
              </label>

              <input
                id="size"
                name="size"
                type="text"
                value={formData.size}
                onChange={handleChange}
                placeholder="e.g. M"
              />
            </div>

            {/* COLOR */}

            <div className="form-group">
              <label htmlFor="color">
                Color
              </label>

              <input
                id="color"
                name="color"
                type="text"
                value={formData.color}
                onChange={handleChange}
                placeholder="e.g. Blue"
              />
            </div>

            {/* CONDITION */}

            <div className="form-group">
              <label htmlFor="condition">
                Condition
              </label>

              <input
                id="condition"
                name="condition"
                type="text"
                value={formData.condition}
                onChange={handleChange}
                placeholder="e.g. Excellent"
              />
            </div>

            {/* LOCATION */}

            <div className="form-group">
              <label htmlFor="location">
                Location
              </label>

              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Nairobi"
              />
            </div>

            {/* PRICE */}

            <div className="form-group">
              <label htmlFor="price">
                Price (KES) *
              </label>

              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="1200"
                required
              />
            </div>

            {/* STATUS */}

            <div className="form-group">
              <label htmlFor="status">
                Status
              </label>

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="available">
                  Available
                </option>

                <option value="sold">
                  Sold
                </option>

                <option value="reserved">
                  Reserved
                </option>
              </select>
            </div>

            {/* FORM BUTTONS */}

            <div className="form-actions full-width">

              <button
                type="button"
                className="cancel-button"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-product-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingProduct
                  ? "Update Product"
                  : "Add Product"}
              </button>

            </div>

          </form>
        </section>
      )}

      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      {products.length === 0 ? (

        <section className="empty-products">

          <div className="empty-products-icon">
            ♻
          </div>

          <h2>
            No products yet
          </h2>

          <p>
            Start adding your upcycled products
            to your RenewIt inventory.
          </p>

          <button
            type="button"
            className="empty-add-button"
            onClick={handleAddProduct}
          >
            + Add Your First Product
          </button>

        </section>

      ) : (

        <section className="products-section">

          <div className="products-section-header">

            <div>
              <h2>Your Products</h2>

              <p>
                {products.length}{" "}
                {products.length === 1
                  ? "product"
                  : "products"}{" "}
                listed
              </p>
            </div>

            {/* ALWAYS AVAILABLE */}

          </div>

          <div className="products-grid">

            {products.map((product) => (

              <article
                className="product-card"
                key={product.id}
              >

                {/* IMAGE */}

                <div className="product-image-wrapper">

                  {product.image ? (
                    <img
                      src={getImageUrl(product.image)}
                      alt={
                        product.upcycled_clothes ||
                        "Upcycled product"
                      }
                      className="product-image"
                    />
                  ) : (
                    <div className="product-no-image">

                      <span>♻</span>

                      <p>
                        No image available
                      </p>

                    </div>
                  )}

                  <span
                    className={`status-badge ${
                      product.status || "available"
                    }`}
                  >
                    {product.status || "available"}
                  </span>

                </div>

                {/* DETAILS */}

                <div className="product-card-content">

                  <h3>
                    {product.upcycled_clothes ||
                      "Unnamed Product"}
                  </h3>

                  {product.description && (
                    <p className="product-description">
                      {product.description}
                    </p>
                  )}

                  <div className="product-details">

                    <div>
                      <span>QUANTITY</span>
                      <strong>
                        {product.quantity}
                      </strong>
                    </div>

                    <div>
                      <span>PRICE</span>
                      <strong>
                        KSh{" "}
                        {Number(
                          product.price || 0
                        ).toLocaleString()}
                      </strong>
                    </div>

                  </div>

                  <div className="product-meta">

                    {product.type && (
                      <span>
                        {product.type}
                      </span>
                    )}

                    {product.material && (
                      <span>
                        {product.material}
                      </span>
                    )}

                    {product.size && (
                      <span>
                        Size {product.size}
                      </span>
                    )}

                    {product.color && (
                      <span>
                        {product.color}
                      </span>
                    )}

                  </div>

                  <p className="product-date">
                    Updated{" "}
                    {product.updated_at
                      ? new Date(
                          product.updated_at
                        ).toLocaleDateString()
                      : "—"}
                  </p>

                  {/* ACTIONS */}

                  <div className="product-actions">

                    <button
                      type="button"
                      className="edit-button"
                      onClick={() =>
                        handleEdit(product)
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() =>
                        handleDelete(product.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </article>

            ))}

          </div>

        </section>
      )}

    </main>
  );
}