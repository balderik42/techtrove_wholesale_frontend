import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../NewArrivals/NewArrivals.css';
import { useNavigate } from 'react-router-dom';

const URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const NewArrivals = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(`${URL}/products`);
        
        // Reverse to get the latest products, then slice the first 10
        const latestProducts = response.data.slice().reverse().slice(0, 10);

        setNewArrivals(latestProducts);
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
      }
    };

    fetchNewArrivals();
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="new-arrivals">
      <h2>New Arrivals</h2>
      <div className="new-arrivals-list">
        {newArrivals.map((product) => (
          <div key={product._id} className="new-arrival-item" onClick={() => handleProductClick(product._id)}>
            <img src={`${URL}${product.image}`} alt={product.shortName} />
            <h3>{product.shortName}</h3>
            <p className="price">₹{product.WSP}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewArrivals;
