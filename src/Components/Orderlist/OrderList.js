import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OrderList.css'; // Ensure your CSS is imported


const URL =  process.env.REACT_APP_API_URL || 'http://localhost:8000'

const OrderListPage = () => {
  const [orders, setOrders] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null); // For displaying order details

  const user = JSON.parse(localStorage.getItem('user')); // Get user from localStorage
  const userId = user?.id; // Extract the user ID

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) {
        setError('User not logged in');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${URL}/orders/${userId}`);
        console.log("Fetched orders:", response.data); // Log the fetched data for debugging
        if (response.data && response.data.length > 0) {
          setOrders(response.data[0].orders); // Access orders array in the first object
        } else {
          setOrders([]); // If no data found, set empty array
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err); // Log the error for debugging
        setError('Error fetching orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const handleOrderClick = (order) => {
    setSelectedOrder(order); // Set the selected order to display details
  };

  const closeModal = () => {
    setSelectedOrder(null); // Close the modal by clearing selected order
  };

  return (
    <div className="order-list-container">
      <h2>Order List</h2>
      {loading ? (
        <p className="loading-message">Loading orders...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <ul className="order-list">
          {orders.map((order, index) => (
            <li key={order._id} className="order-item" onClick={() => handleOrderClick(order)}>
              <div className="order-info">
                <p className="order-index">{index + 1}.</p>
                <div className="order-details">
                  <p><strong>Name:</strong> {order.address.name}</p>
                  <p><strong>Total Price:</strong> ₹{order.totalPrice}</p>
                  <p><strong>Status:</strong> {order.status}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal for Order Details */}
      {selectedOrder && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>X</button> {/* Close button */}
            <h3>Order Details</h3>
            <p><strong>Total Price:</strong> ₹{selectedOrder.totalPrice}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <h4>Products:</h4>
            <div className="order-details">
              <ul>
                {selectedOrder.products.map((item, index) => (
                  <li key={index}>
                    <img className='orderlist-image' src={`${URL}${item.image}`} alt={item.product} />
                    <div>
                      <p><strong>Quantity:</strong> {item.quantity}</p>
                      <p><strong>Price:</strong> ₹{item.price}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <button className="close-button" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderListPage;
