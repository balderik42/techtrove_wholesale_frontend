import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminHome.css'; // Import your CSS for styling

const URL =  process.env.REACT_APP_API_URL || 'http://localhost:8000'

const AdminHome = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    shortName: '',
    longName: '',
    category: '',
    price: '',
    sellingPrice: '',
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
        price: response.data.price,
        sellingPrice: response.data.sellingPrice,
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
    objFormData.append('price', formData.price);
    objFormData.append('sellingPrice', formData.sellingPrice);
    objFormData.append('description', formData.description);
    if (formData.image) {
      objFormData.append('image', formData.image);
    }
    objFormData.append('stock', formData.stock);

    try {
      if (isEditing) {
        // PUT request for updating the product
        await axios.put(`${URL}/products/${editingProductId}`, objFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Product updated successfully');
      } else {
        // POST request for adding a new product
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
        price: '',
        sellingPrice: '',
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
            <th>MRP</th>
            <th>Selling Price</th>
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
              <td>{product.price}</td>
              <td>{product.sellingPrice}</td>
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
          <div className="modal">
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
                <label htmlFor="price">Price:</label>
                <input type="number" id="price" value={formData.price} onChange={handleInputChange} placeholder="Enter price" />
              </div>
              <div className="form-group">
                <label htmlFor="sellingPrice">Selling Price:</label>
                <input type="number" id="sellingPrice" value={formData.sellingPrice} onChange={handleInputChange} placeholder="Enter selling price" />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea id="description" value={formData.description} onChange={handleInputChange} placeholder="Enter product description"></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="image">Image:</label>
                <input type="file" id="image" onChange={handleImageChange} />
              </div>
              <div className="form-group">
                <label htmlFor="stock">Stock Status:</label>
                <select id="stock" value={formData.stock} onChange={handleStockChange}>
                  <option value="">Select Stock Status</option>
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit">{isEditing ? 'Update Product' : 'Add Product'}</button>
                <button type="button" onClick={handleClose}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHome;
