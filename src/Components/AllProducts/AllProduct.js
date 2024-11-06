import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AllProduct.css';

const URL =  process.env.REACT_APP_API_URL || 'http://localhost:8000'

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [addedProductId, setAddedProductId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${URL}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
    if (product.stock === 'Out of Stock') {
      console.log(`${product.shortName} is out of stock!`);
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      console.log('User not logged in');
      return;
    }

    try {
      const response = await axios.post(`${URL}/wholesaleaddtocart`, {
        userId,
        productId: product._id,
        name: product.name,
        shortName: product.shortName,
        quantity: 1,
        image: product.image,
      });

      if (response.status === 200) {
        setAddedProductId(product._id);
        setTimeout(() => setAddedProductId(null), 1000);
        console.log(`Added ${product.shortName} to cart successfully`, response.data);
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="all-products-container">
      <h1>All Products</h1>
      <div className="product-list">
        {products.map((product) => (
          <div
            className="product-card"
            key={product._id}
            onClick={() => handleProductClick(product._id)}
          >
            <img
              src={`${URL}${product.image}`}
              alt={product.shortName}
              className="product-image"
            />
            <div className="product-info">
              <h2>{product.shortName}</h2>
              <p className='product-mrp'>MRP: ₹{product.MRP}</p>
              <p className='product-selling-price'>Selling Price: ₹{product.WSP}</p>
              <p className="product-stock">
                {product.stock === 'Out of Stock' ? 'Out of Stock' : '\u00A0'}
              </p>
              {addedProductId === product._id && (
                <div className="success-message">
                  {`${product.shortName} has been added to your cart!`}
                </div>
              )}
              <button
                className="add-to-cart-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProducts;
