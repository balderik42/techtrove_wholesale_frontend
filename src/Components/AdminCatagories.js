import React, { useState, useEffect } from 'react';
import './AdminCatagories.css';
import { authenticateAddCategory, fetchCategories } from '../services/api';


const URL =  process.env.REACT_APP_API_URL || 'http://localhost:8000'
const Admincatagories = () => {
  const [category, setCategory] = useState({
    categoryName: '',
    imageFile: null,
  });
  const [addCategory, setAddCategory] = useState(false);
  const [categories, setCategories] = useState([]);

  // Fetch all categories when the component loads
  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await fetchCategories(); // Fetches categories from API
        setCategories(response.data); // Sets the categories data
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    getCategories();
  }, []);

  const openAddCategory = () => {
    setAddCategory(true);
  };

  const handleCategoryChange = (event) => {
    setCategory({
      ...category,
      [event.target.id]: event.target.value,
    });
  };

  const handleFileChange = (event) => {
    setCategory({
      ...category,
      imageFile: event.target.files[0],
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const objFormData = new FormData();
    objFormData.append('name', category.categoryName); // Use 'name' instead of 'categoryName'
    objFormData.append('image', category.imageFile);

    try {
      const response = await authenticateAddCategory(objFormData);
      if (response.status === 201) {
        alert('Category added successfully');
        setCategory({ categoryName: '', imageFile: null });
        setCategories([...categories, response.data]); // Add the new category to the list
        handleClose(); // Reset form/modal
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category. Please try again.');
    }
  };

  const handleClose = () => {
    setAddCategory(false);
  };

  return (
    <div className="categories-page">
      <div className="header">
        <button onClick={openAddCategory} className="add-category-button">
          Add Category
        </button>
      </div>

      {addCategory && (
        <div className="add-category-form">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter new category"
              id="categoryName"
              value={category.categoryName}
              onChange={handleCategoryChange}
            />
            <input type="file" id="image" onChange={handleFileChange} />
            <button type="submit">Add</button>
            <button type="button" onClick={handleClose}>
              Cancel
            </button>
          </form>
        </div>
      )}

      <div className="category-list">
        <h2>Existing Categories</h2>
        <ul>
          {categories.map((cat) => (
            <li key={cat._id} className="category-item">
              <img src={`${URL}${cat.image}`} alt={cat.name} className="category-image" />
              <span>{cat.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Admincatagories;
