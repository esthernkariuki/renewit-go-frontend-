import React, { useState, useCallback } from 'react';
import './style.css'
import { useProducts } from '../hooks/useFetchProducts';
import ProductForm from './components/AddUpcyclerProducts';


function ProductList() {
  const {
    products,
    loading,
    error,
    page,
    setPage,
    add,
    update,
    remove,
  } = useProducts();



  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    upcycled_clothes: '',
    type: '',
    quantity: '',
    price: '',
    image: null,
  });
  const [editingId, setEditingId] = useState(null);
  const PRODUCTS_PER_PAGE = 5;

  const handleChange = useCallback((e) => {
    if (e.target.name === 'image') {
      setForm(prev => ({ ...prev, image: e.target.files[0] }));
    } else {
      setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('upcycled_clothes', form.upcycled_clothes);
    formData.append('type', form.type);
    formData.append('quantity', form.quantity);
    formData.append('price', form.price);
    if (form.image) formData.append('image', form.image);

    try {
      if (editingId) {
        await update(editingId, formData);
      } else {
        await add(formData);
      }
      setShowForm(false);
      setEditingId(null);
      setForm({ upcycled_clothes: '', type: '', quantity: '', price: '', image: null });
    } catch (err) {
      alert(err.message);
    }
  }, [form, editingId, add, update]);

  const handleEdit = useCallback((product) => {
    setForm({
      upcycled_clothes: product.upcycled_clothes || '',
      type: product.type || '',
      quantity: product.quantity != null ? product.quantity : '',
      price: product.price != null ? product.price : '',
      image: null,
    });
    setEditingId(product.id);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(async (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      try {
        await remove(id);
      } catch (err) {
        alert(err.message);
      }
    }
  }, [remove]);


  const sortedProducts = [...products].sort((a, b) => {
    const dateA = new Date(a.updated_at || a.created_at || 0);
    const dateB = new Date(b.updated_at || b.created_at || 0);
    return dateB - dateA;
  });

  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = sortedProducts.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE
  );

  return (
    
    <div className="product-container">
      <h2>UPCYCLED PRODUCTS</h2>
      <button
        className="btn btn-add"
        onClick={() => {
          setShowForm(true);
          setEditingId(null);
          setForm({ upcycled_clothes: '', type: '', quantity: '', price: '', image: null });
        }}
      >
        Add Product
      </button>

      {loading && <div style={{ margin: '10px 0', color: 'blue' }}>Loading...</div>}
      {error && <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <ProductForm
              form={form}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
              editing={!!editingId}
            />
          </div>
        </div>
      )}

      <table className="product-table" cellPadding="5">
        <thead>
          <tr>
            <th>Image</th>
            <th>Upcycled Clothes</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Updated At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProducts.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>
                No products available
              </td>
            </tr>
          ) : (
            paginatedProducts.map((prod) => (
              <tr key={prod.id}>
                <td>
                  <img
                    src={prod.image || '/images/placeholder.jpg'}
                    alt={prod.upcycled_clothes || 'Placeholder'}
                    className="product-img"
                    onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                  />
                </td>
                <td>{prod.upcycled_clothes}</td>
                <td>{prod.type}</td>
                <td>{prod.quantity}</td>
                <td>{prod.price}</td>
                <td>{prod.updated_at ? prod.updated_at.split('T')[0] : ''}</td>
                <td>
                  <button className="btn btn-edit" onClick={() => handleEdit(prod)}>
                    Edit
                  </button>
                  <button className="btn btn-delete" onClick={() => handleDelete(prod.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="pagination" style={{ marginTop: 15, display: 'flex', justifyContent: 'center' }}>
        <button className="btn" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
        <span style={{ margin: '0 10px' }}>Page {page} of {totalPages}</span>
        <button className="btn" disabled={page === totalPages || totalPages === 0} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}

export default ProductList;