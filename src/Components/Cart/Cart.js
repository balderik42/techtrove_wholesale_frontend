import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Cart.css';


const URL =  process.env.REACT_APP_API_URL || 'http://localhost:8000'

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [userName, setUserName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [address, setAddress] = useState({
    name: '',
    address: '',
    district: '',
    state: '',
    pin: '',
    phone: '',
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setUserName(user?.username || 'Guest');

    const fetchCart = async () => {
      try {
        const response = await axios.get(`${URL}/cart/${user.id}`);
        setCart(response.data.cart);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    if (user?.id) {
      fetchCart();
    }
  }, []);

  const handleInputChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (newQuantity < 1) return;

    try {
      await axios.put(`${URL}/cart/${user.id}/product/${productId}`, { quantity: newQuantity });
      setCart((prevCart) => ({
        ...prevCart,
        products: prevCart.products.map((product) =>
          product._id === productId ? { ...product, quantity: newQuantity } : product
        ),
      }));
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveProduct = async (productId) => {
    const user = JSON.parse(localStorage.getItem('user'));

    try {
      await axios.delete(`${URL}/cart/${user.id}/product/${productId}`);
      setCart((prevCart) => ({
        ...prevCart,
        products: prevCart.products.filter((product) => product._id !== productId),
      }));
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  const handleDecreaseQuantity = (productId, currentQuantity) => {
    if (currentQuantity === 1) {
      handleRemoveProduct(productId);
    } else {
      handleQuantityChange(productId, currentQuantity - 1);
    }
  };

  const handlePlaceOrderClick = () => {
    setShowForm(true);
  };

  const clearCart = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('User ID:', user.id); // Log the user ID
  
    try {
      const response = await axios.delete(`${URL}/cart/${user.id}`); // Endpoint to clear the cart
      if (response.status === 200) {
        setCart({ products: [] }); // Clear cart in the frontend
        alert('Cart cleared successfully');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user);
    
  
    try {
      const orderData = {
        userId: user.id,
        userName:user.username,  // Include the username here
        address: {
          name: address.name,
          address: address.address,
          district: address.district,
          state: address.state,
          pinNumber: address.pin,
          phoneNumber: address.phone,
        },
        cartProducts: cart.products.map((product) => ({
          product: product._id,
          quantity: product.quantity,
          price: product.price,
          image: product.image,
        })),
      };
  
      await axios.post(`${URL}/orders`, orderData);
      alert('Order placed successfully!');
      await clearCart();
      setShowForm(false);
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };
  
  

  const calculateTotal = () => {
    const totalQuantity = cart.products.reduce((acc, product) => acc + product.quantity, 0);
    const totalPrice = cart.products.reduce((acc, product) => acc + product.quantity * product.price, 0);
    return { totalQuantity, totalPrice };
  };

  if (!cart) {
    return <p>Loading cart...</p>;
  }

  const { totalQuantity, totalPrice } = calculateTotal();

  return (
    <div className="cart-page">
      <h1 className="cart-title">{userName}'s Cart</h1>
      <div className="cart-container">
        {cart.products.map((product) => (
          <div key={product._id} className="cart-product-card">
            <img src={`${URL}${product.image}`} alt={product.shortName} className="cart-product-image" />
            <div className="cart-product-info">
              <h3 className="cart-product-name">{product.shortName}</h3>
              <p className="cart-product-price">Price: ₹{product.price}</p>
              <div className="quantity-control">
                <button className="quantity-button" onClick={() => handleDecreaseQuantity(product._id, product.quantity)}>
                  -
                </button>
                <input type="number" value={product.quantity} readOnly className="quantity-input" />
                <button className="quantity-button" onClick={() => handleQuantityChange(product._id, product.quantity + 1)}>
                  +
                </button>
              </div>
              <button className="delete-button" onClick={() => handleRemoveProduct(product._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-bottom">
        <div className="cart-summary">
          <h2>Cart Summary</h2>
          <p>Total Quantity: {totalQuantity}</p>
          <p>Total Value: ₹{totalPrice.toFixed(2)}</p>
          <button className="place-order-button" onClick={handlePlaceOrderClick}>Place Order</button>
          
        </div>
      </div>

      {showForm && (
        <div className="address-form-container">
          <form onSubmit={handleFormSubmit} className="address-form">
            <h2>Enter Address Details</h2>
            <input type="text" name="name" placeholder="Name" value={address.name} onChange={handleInputChange} required />
            <input type="text" name="address" placeholder="Address" value={address.address} onChange={handleInputChange} required />
            <input type="text" name="district" placeholder="District" value={address.district} onChange={handleInputChange} required />
            <input type="text" name="state" placeholder="State" value={address.state} onChange={handleInputChange} required />
            <input type="text" name="pin" placeholder="Pin Code" value={address.pin} onChange={handleInputChange} required />
            <input type="text" name="phone" placeholder="Phone Number" value={address.phone} onChange={handleInputChange} required />
            <button type="submit" className="submit-address-button">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CartPage;
