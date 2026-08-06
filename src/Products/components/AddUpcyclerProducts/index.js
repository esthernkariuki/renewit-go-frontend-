
import React, { useState, useEffect } from 'react';
import './style.css';

function ProductForm({ form = {}, onChange, onSubmit, onCancel, editing }) {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (editing && form.image && typeof form.image === 'string') {
      setPreview(form.image);
    } else if (!form.image) {
      setPreview(null);

    }
    
  }, [editing, form.image]);

  const handleImageChange = (e) => {

    const file = e.target.files[0];
    if (file) {
      onChange(e); 
      setPreview(URL.createObjectURL(file)); 
    }
  };

  return (
    <form className="product-form" onSubmit={onSubmit} data-testid="product-form">
      <div>
        <label htmlFor="upcycled_clothes">Upcycled Clothes</label><br />
        <input
          id="upcycled_clothes"
          type="text"
          name="upcycled_clothes"
          value={form.upcycled_clothes || ''}
          onChange={onChange}
          required
          placeholder="Enter product name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="type" className="form-label">Type</label>
        <select
          id="type"
          name="type"
          value={form.type || ''}
          onChange={onChange}
          required
          className="form-input"
        >
          <option value="">Select type</option>
          <option value="cotton">Cotton</option>
          <option value="denim">Denim</option>
          <option value="leather">Leather</option>
          <option value="silk">Silk</option>
          <option value="linen">Linen</option>
          <option value="wool">Wool</option>
        </select>
      </div>

      <div>
        <label htmlFor="quantity">Quantity</label><br />
        <input
          id="quantity"
          type="number"
          name="quantity"
          min="1"
          value={form.quantity || ''}
          onChange={onChange}
          required
          placeholder="Enter quantity"
        />
      </div>

      <div>
        <label htmlFor="price">Price</label><br />
        <input
          id="price"
          type="number"
          step="0.01"
          min="0"
          name="price"
          value={form.price || ''}
          onChange={onChange}
          required
          placeholder="Enter price"
        />
      </div>

    
      <div>
        <label htmlFor="image">Image</label><br />
        <input
          id="image"
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
        />

        <div style={{ marginTop: '10px' }}>
          <img
            src={preview || '/images/placeholder.jpg'}

            alt="Preview"

            onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}

            style={{
              width: '100px',
              height: '100px',
              objectFit: 'cover',
              borderRadius: '4px'
            }}
          />
        </div>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>

        <button type="submit" className="btn-submit">
          
          

          {editing ? 'Update' : 'Add'}
        </button>

        <button type="button" onClick={onCancel} className="btn-cancel">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default ProductForm;