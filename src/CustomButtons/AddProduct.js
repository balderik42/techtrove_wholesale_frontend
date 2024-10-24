import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CustomButtons/addProduct.css'; // Import your CSS for modal styling
import { authenticateAddProduct } from '../services/api';

const URL =  process.env.REACT_APP_API_URL || 'http://localhost:8000'

const AddProduct = ({ open, setOpen }) => {
  const [formData, setFormData] = useState({
    shortName: '',
    longName: '',
    category: '',
    price: '',
    sellingPrice: '',
    description: '',
    image: null,
    stock: '', // Add stock status field
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${URL}/categories`); // Adjust the URL if necessary
        setCategories(response.data); // Set the categories into state
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleStockChange = (e) => {
    setFormData({
      ...formData,
      stock: e.target.value, // Update stock status based on selection
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
  
    const formDataObj = new FormData();
    formDataObj.append('shortName', formData.shortName);
    formDataObj.append('longName', formData.longName);
    formDataObj.append('category', formData.category);
    formDataObj.append('price', formData.price);
    formDataObj.append('sellingPrice', formData.sellingPrice);
    formDataObj.append('description', formData.description);
    formDataObj.append('image', formData.image);
    formDataObj.append('stock', formData.stock); // Include stock status in the form submission
  
    try {
      const response = await authenticateAddProduct(formDataObj);
      if (response.status === 201) { // Adjust status code as needed
        alert('Product added successfully');
        setFormData({
          shortName: '',
          longName: '',
          category: '',
          price: '',
          sellingPrice: '',
          description: '',
          image: null,
          stock: '', // Reset stock status
        });
        handleClose();
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add Product</h2>
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
            <button type="submit">Add Product</button>
            <button type="button" onClick={handleClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
