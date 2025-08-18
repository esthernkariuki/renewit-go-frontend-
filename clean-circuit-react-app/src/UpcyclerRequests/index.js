import ProductModal from "./components/ProductsModels";
import { useUpcyclerRequests } from "../hooks/useFetchUpcyclerRequest";
import React, { useState } from "react";
import "./style.css";

export default function UpcyclerRequests() {
  const {
    requests,
    loading,
    error,
    add,
    update,
    remove,
    page,
    setPage,
  } = useUpcyclerRequests();

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const PRODUCTS_PER_PAGE = 5;

  const sortedRequests = [...requests].sort(
    (a, b) => new Date(b.requested_at) - new Date(a.requested_at)
  );
  const totalPages = Math.ceil(sortedRequests.length / PRODUCTS_PER_PAGE);

  const paginated = sortedRequests.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE
  );

  const handleAddClick = () => {
    setEditItem(null);
    setModalOpen(true);
  };

  const handleEditClick = (item) => {
    setEditItem(item);
    setModalOpen(true);
  };

  const handleDeleteClick = (item) => {
    if (!item || !item.request) return;
    setDeleteTarget(item);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await remove(deleteTarget.request);
    } catch (err) {
      alert("Failed to delete the product. Please try again.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  const handleSave = async (formData) => {
    try {
      if (editItem) {
        await update(editItem.request, formData);
      } else {
        await add(formData);
      }
      setModalOpen(false);
    } catch (err) {
      alert("Failed to save. Please try again.");
    }
  };

  if (loading) return <p style={{ marginTop: "-5px" }}>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="product-page-container">
      <div className="products-card">
        <div className="products-header">PRODUCTS</div>
        <button className="add-product-button" onClick={handleAddClick}>Add Product</button>
        <table className="product-table">
          <thead>
            <tr>
              <th>IMAGE</th>
              <th>TYPE</th>
              <th>QUANTITY</th>
              <th>REQUESTED AT</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((item) => (
              <tr key={item.request}>
                <td>
                  <img
                    src="/images/placeholder.jpg"
                    alt={item.type || "Product"}
                    className="product-image"
                    loading="lazy"
                  />
                </td>
                <td>{item.type}</td>
                <td>{item.quantity}</td>
                <td>{new Date(item.requested_at).toLocaleString()}</td>
                <td>
                  <button className="action-btn edit" onClick={() => handleEditClick(item)}>Edit</button>
                  <button className="action-btn delete" onClick={() => handleDeleteClick(item)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
          <span> Page {page} of {totalPages} </span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      </div>
      <ProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editItem}
      />
      {deleteTarget && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Are you sure you want to delete this product?</h3>
            <div className="modal-actions">
              <button className="action-btn delete" onClick={confirmDelete}>Delete</button>
              <button className="action-btn cancel" onClick={cancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


