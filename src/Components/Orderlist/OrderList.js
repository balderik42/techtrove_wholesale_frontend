import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OrderList.css';

const URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) {
        setError('User not logged in');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${URL}/orders/${userId}`);
        console.log("Fetched orders:", response.data);

        if (response.data && response.data.length > 0) {
          const sortedOrders = response.data[0].orders.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setOrders(sortedOrders);
        } else {
          setOrders([]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Error fetching orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
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
                  <p><strong>Order Placed:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                  
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {selectedOrder && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>X</button>
            <h3>Order Details</h3>
            <p><strong>Total Price:</strong> ₹{selectedOrder.totalPrice}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <p><strong>Order Placed:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
            
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
