import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminHome.css';

const URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const AdminHome = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    shortName: '',
    longName: '',
    category: '',
    WSP: '',
    DSP: '',
    RSP: '',
    MRP: '',
    description: '',
    image: null,
    stock: '',
  });

  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${URL}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${URL}/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.id]: event.target.value });
  };

  const handleImageChange = (event) => {
    setFormData({ ...formData, image: event.target.files[0] });
  };

  const handleStockChange = (event) => {
    setFormData({ ...formData, stock: event.target.value });
  };

  const handleEditProduct = async (productId) => {
    try {
      const response = await axios.get(`${URL}/products/${productId}`);
      setFormData({
        shortName: response.data.shortName,
        longName: response.data.longName,
        category: response.data.category,
        WSP: response.data.WSP,
        DSP: response.data.DSP,
        RSP: response.data.RSP,
        MRP: response.data.MRP,
        description: response.data.description,
        image: null, // Handle image separately
        stock: response.data.stock,
      });
      setIsEditing(true);
      setEditingProductId(productId);
      setShowForm(true);
    } catch (error) {
      console.error('Error fetching product for edit:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const objFormData = new FormData();
    objFormData.append('shortName', formData.shortName);
    objFormData.append('longName', formData.longName);
    objFormData.append('category', formData.category);
    objFormData.append('WSP', formData.WSP);
    objFormData.append('DSP', formData.DSP);
    objFormData.append('RSP', formData.RSP);
    objFormData.append('MRP', formData.MRP);
    objFormData.append('description', formData.description);
    if (formData.image) {
      objFormData.append('image', formData.image);
    }
    objFormData.append('stock', formData.stock);

    try {
      if (isEditing) {
        await axios.put(`${URL}/products/${editingProductId}`, objFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Product updated successfully');
      } else {
        await axios.post(`${URL}/addproduct`, objFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Product added successfully');
      }

      // Reset form
      setFormData({
        shortName: '',
        longName: '',
        category: '',
        WSP: '',
        DSP: '',
        RSP: '',
        MRP: '',
        description: '',
        image: null,
        stock: '',
      });
      setIsEditing(false);
      setEditingProductId(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleClose = () => {
    setShowForm(false);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${URL}/products/${productId}`);
        setProducts(products.filter(product => product._id !== productId));
        alert('Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <div className="admin-home-container">
      <h1>Product List</h1>
      <button onClick={() => setShowForm(true)}>Add Product</button>
      <table className="product-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Short Name</th>
            <th>WSP</th>
            <th>DSP</th>
            <th>RSP</th>
            <th>MRP</th>
            <th>Stock Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id}>
              <td>
                <img src={`${URL}${product.image}`} alt={product.shortName} className="admin-product-image" />
              </td>
              <td>{product.shortName}</td>
              <td>{product.WSP}</td>
              <td>{product.DSP}</td>
              <td>{product.RSP}</td>
              <td>{product.MRP}</td>
              <td>{product.stock}</td>
              <td>
                <button className="btn edit-btn" onClick={() => handleEditProduct(product._id)}>Edit</button>
                <button className="btn delete-btn" onClick={() => handleDeleteProduct(product._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div className="modal-overlay">
          <div className="add-product-modal">
            <h2>{isEditing ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="shortName">Short Name:</label>
                <input type="text" id="shortName" value={formData.shortName} onChange={handleInputChange} placeholder="Enter short name" />
              </div>
              <div className="form-group">
                <label htmlFor="longName">Long Name:</label>
                <input type="text" id="longName" value={formData.longName} onChange={handleInputChange} placeholder="Enter long name" />
              </div>
              <div className="form-group">
                <label htmlFor="category">Category:</label>
                <select id="category" value={formData.category} onChange={handleInputChange}>
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="WSP">Wholesale Price (WSP):</label>
                <input type="number" id="WSP" value={formData.WSP} onChange={handleInputChange} placeholder="Enter WSP" />
              </div>
              <div className="form-group">
                <label htmlFor="DSP">Dropshipping Price (DSP):</label>
                <input type="number" id="DSP" value={formData.DSP} onChange={handleInputChange} placeholder="Enter DSP" />
              </div>
              <div className="form-group">
                <label htmlFor="RSP">Retail Price (RSP):</label>
                <input type="number" id="RSP" value={formData.RSP} onChange={handleInputChange} placeholder="Enter RSP" />
              </div>
              <div className="form-group">
                <label htmlFor="MRP">Maximum Retail Price (MRP):</label>
                <input type="number" id="MRP" value={formData.MRP} onChange={handleInputChange} placeholder="Enter MRP" />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea id="description" value={formData.description} onChange={handleInputChange} placeholder="Enter description"></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="image">Image:</label>
                <input type="file" id="image" accept="image/*" onChange={handleImageChange} />
              </div>
              <div className="form-group">
                <label htmlFor="stock">Stock Status:</label>
                <input type="text" id="stock" value={formData.stock} onChange={handleStockChange} placeholder="Enter stock status" />
              </div>
              <button type="submit" className="btn submit-btn">{isEditing ? 'Update Product' : 'Add Product'}</button>
              <button type="button" className="btn close-btn" onClick={handleClose}>Close</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHome;
