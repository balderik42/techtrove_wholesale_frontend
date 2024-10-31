import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listProductsByCategory } from '../../Redux/Actions/ProductAction'; // Action to fetch products
import { useParams, useNavigate } from 'react-router-dom'; // For accessing the category name from the URL and navigation
import axios from 'axios'; // Import Axios for API requests
import '../ProductListPage/ProductListPage.css'; // Import the CSS for styling

const URL =  process.env.REACT_APP_API_URL || 'http://localhost:8000'

const ProductListPage = () => {
  const { categoryName } = useParams(); // Get category from the URL
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Use navigate to route to product details page
  const productList = useSelector(state => state.productList);
  const { loading, error, products } = productList;

  const [addedProductId, setAddedProductId] = useState(null); // State for tracking the last added product

  useEffect(() => {
    dispatch(listProductsByCategory(categoryName)); // Fetch products by category
  }, [dispatch, categoryName]);

  const handleAddToCart = async (product) => {
    if (product.stock === 'Out of Stock') {
      console.log(`${product.shortName} is out of stock!`);
      return; // Prevent further execution
    }
  
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;
  
    if (!userId) {
      console.log("User not logged in");
      return;
    }
  
    try {
      const response = await axios.post(`${URL}/retailaddtocart`, {
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
  

  const handleAddToWebsite = (product) => {
    console.log(`Added ${product.shortName} to website`);
    // Add logic to add product to website
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`); // Navigate to the product details page
  };

  return (
    <div className="product-list-container">
      <h2 className="product-list-title">Products in {categoryName}</h2>

      {loading ? (
        <p className="loading-message">Loading products...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <ul className="listproduct-grid">
          {products.map(product => (
            <li 
              key={product._id} 
              className="listproduct-card" 
              onClick={() => handleProductClick(product._id)} // Handle product click
            >
              <img
                src={`${URL}${product.image}`}
                alt={product.shortName}
                className="list-product-image"
              />
              <div className="listproduct-info">
                <h3 className="listproduct-name">{product.shortName}</h3>
                <p className="listproduct-price">Price: ₹{product.RSP}</p>
                <p className="listproduct-stock">
                  {product.stock === 'Out of Stock' ? 'Out of Stock' : '\u00A0'}
                </p>

                {/* Show success message if this product was added to the cart */}
                {addedProductId === product._id && (
                  <div className="success-message">
                    {`${product.shortName} has been added to your cart!`}
                  </div>
                )}

                <div className="listbutton-group">
                  <button
                    className="btn detailed-add-to-cart-btn"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event propagation to the <li> click
                      handleAddToCart(product);
                    }}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="btn add-to-website-btn"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event propagation to the <li> click
                      handleAddToWebsite(product);
                    }}
                  >
                    Add to Web
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductListPage;
