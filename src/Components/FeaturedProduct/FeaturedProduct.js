import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../FeaturedProduct/FeaturedProduct.css';
import { useNavigate } from 'react-router-dom';

const URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const navigate = useNavigate();

  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${URL}/products`);
        const allProducts = response.data;

        // Shuffle the products array
        const shuffledProducts = allProducts.sort(() => 0.5 - Math.random());

        // Select the first 6 products as featured
        const selectedFeaturedProducts = shuffledProducts.slice(0, 6);
        
        setFeaturedProducts(selectedFeaturedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="featured-products">
      <h2>Featured Products</h2>
      <div className="featured-products-list">
        {featuredProducts.map((product) => (
          <div key={product._id} className="featured-product-item" onClick={() => handleProductClick(product._id)} >
            <img src={`${URL}${product.image}`} alt={product.shortName} />
            <h3>{product.shortName}</h3>
            <p className="price">₹{product.WSP}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
