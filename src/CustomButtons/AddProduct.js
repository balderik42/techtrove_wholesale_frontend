import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CustomButtons/addProduct.css'; // Import your CSS for modal styling
import { authenticateAddProduct } from '../services/api';

const URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const AddProduct = ({ open, setOpen }) => {
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

  // Fetch categories when the component loads
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${URL}/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleClose = () => setOpen(false);

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
    setFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataObj = new FormData();
    formDataObj.append('shortName', formData.shortName);
    formDataObj.append('longName', formData.longName);
    formDataObj.append('category', formData.category);
    formDataObj.append('WSP', formData.WSP);
    formDataObj.append('DSP', formData.DSP);
    formDataObj.append('RSP', formData.RSP);
    formDataObj.append('MRP', formData.MRP);
    formDataObj.append('description', formData.description);
    formDataObj.append('image', formData.image);
    formDataObj.append('stock', formData.stock); 
    

    

    try {
      const response = await authenticateAddProduct(formDataObj);
      if (response.status === 201) {
        alert('Product added successfully');
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
        handleClose();
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="add-product-modal">
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
            <label htmlFor="WSP">Wholesale Price (WSP):</label>
            <input
              type="number"
              id="WSP"
              value={formData.WSP}
              onChange={handleInputChange}
              placeholder="Enter wholesale price"
            />
          </div>
          <div className="form-group">
            <label htmlFor="DSP">Dropshipping Price (DSP):</label>
            <input
              type="number"
              id="DSP"
              value={formData.DSP}
              onChange={handleInputChange}
              placeholder="Enter dropshipping price"
            />
          </div>
          <div className="form-group">
            <label htmlFor="RSP">Retail Price (RSP):</label>
            <input
              type="number"
              id="RSP"
              value={formData.RSP}
              onChange={handleInputChange}
              placeholder="Enter retail price"
            />
          </div>
          <div className="form-group">
            <label htmlFor="MRP">MRP:</label>
            <input
              type="number"
              id="MRP"
              value={formData.MRP}
              onChange={handleInputChange}
              placeholder="Enter MRP"
            />
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
