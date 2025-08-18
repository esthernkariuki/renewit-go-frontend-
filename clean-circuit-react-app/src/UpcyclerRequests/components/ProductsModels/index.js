import React, { useState, useEffect } from "react";

export default function ProductModal({ open, onClose, initialData, onSave }) {
  const [form, setForm] = useState({
    type: "",
    quantity: "",
    image: null,
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        type: initialData.type || "",
        quantity: initialData.quantity || "",
        image: null,
      });
    } else {
      setForm({
        type: "",
        quantity: "",
        image: null,
      });
    }
  }, [initialData]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("type", form.type);
    data.append("quantity", form.quantity);
    if (form.image) data.append("image", form.image);

    const userId = localStorage.getItem("userId") || "123";
    data.append("upcycler", userId);

    setSubmitting(true);
    try {
      await onSave(data);
      alert(initialData ? "Product updated successfully!" : "Product added successfully!");
      onClose();
    } catch (error) {
      alert("Error saving product: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>{initialData ? "Edit Product" : "Add Product"}</h2>
        <form onSubmit={handleSubmit} className="product-form" data-testid="product-form">
          <label>
            Type:
            <input
              name="type"
              type="text"
              value={form.type}
              onChange={handleChange}
              required
              placeholder="Enter product type"
              disabled={submitting}
            />
          </label>
          <label>
            Quantity:
            <input
              name="quantity"
              type="number"
              min="1"
              value={form.quantity}
              onChange={handleChange}
              required
              placeholder="Enter quantity"
              disabled={submitting}
            />
          </label>
          <label>
            Image:
            <input
              name="image"
              type="file"
              accept="image/*"
              onChange={handleChange}
              disabled={submitting}
            />
          </label>
          <div className="form-buttons">
            <button type="submit" className="save-btn" disabled={submitting}>
              {submitting ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={onClose} className="cancel-btn" disabled={submitting}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
