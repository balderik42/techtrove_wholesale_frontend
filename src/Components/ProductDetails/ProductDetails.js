import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { getProductDetails } from '../../Redux/Actions/ProductAction';
import '../ProductDetails/ProductDetails.css'; // Import CSS for styling

const URL =  process.env.REACT_APP_API_URL || 'http://localhost:8000'
const ProductDetailsPage = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading = true, error, product = {} } = productDetails || {};

  const [addedToCart, setAddedToCart] = useState(false); // Track cart addition status

  useEffect(() => {
    dispatch(getProductDetails(productId));
  }, [dispatch, productId]);

  const handleAddToCart = async () => {

    if (product.stock === 'Out of Stock') {
      console.log(`${product.shortName} is out of stock!`);
      return; // Prevent further execution
    }

    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      console.log('User not logged in');
      return;
    }

    if (!product || !product._id) {
      console.log('Product ID is missing');
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
        console.log(`Added ${product.shortName} to cart successfully`, response.data);
        setAddedToCart(true); // Show success feedback

        // Clear feedback after 1 second
        setTimeout(() => setAddedToCart(false), 1000);
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  

  return (
    <div className="product-details-container">
      {loading ? (
        <p className="loading-message">Loading product details...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        product && (
          <div className="product-details">
            <div className="detailed-product-image-container">
              <img
                src={`${URL}${product.image}`}
                alt={product.shortName}
                className="detailed-product-image"
              />
            </div>
            <div className="product-info-container">
              <h1 className="product-name">{product.shortName}</h1>
              <p className="product-longname"><strong>Long Name:</strong> {product.longName}</p>
              <p className="product-category"><strong>Category:</strong> {product.category}</p>
              <p className="product-description">{product.description}</p>
              <p className="product-mrp"><strong>MRP:</strong> ₹{product.MRP}</p>
              <p className="product-selling-price"><strong>Selling Price:</strong> ₹{product.RSP}</p>
              <p className="product-stock">
                {product.stock === 'Out of Stock' ? 'Out of Stock' : '\u00A0'}
              </p>

              {/* Show success message when the product is added to the cart */}
              {addedToCart && (
                <div className="success-message">
                  {`${product.shortName} has been added to your cart!`}
                </div>
              )}

              <div className="product-actions">
                <button
                  className="btn detailed-add-to-cart-btn"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default ProductDetailsPage;
