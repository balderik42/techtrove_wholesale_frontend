import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listCategories } from '../../Redux/Actions/CatagoryActions';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import '../CatogeryList/CatageryList.css';

const URL =  process.env.REACT_APP_API_URL || 'http://localhost:8000'
const CatageryList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categoryList = useSelector(state => state.categoryList);
  const { loading, error, categories } = categoryList;

  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${categoryName}`); // Navigate to product page
  };

  return (
    <div className="category-container">
      <h2>All Categories</h2>
      {loading ? <p>Loading...</p> : error ? <p>{error}</p> : (
        <ul>
          {categories.map(category => (
            <li key={category._id} onClick={() => handleCategoryClick(category.name)}>
              <img src={`${URL}${category.image}`} alt={category.name} />
              <p>{category.name}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CatageryList;
