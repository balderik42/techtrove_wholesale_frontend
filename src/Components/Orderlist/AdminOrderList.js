import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminOrderList.css';

const URL =  process.env.REACT_APP_API_URL || 'http://localhost:8000'


const AdminOrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${URL}/adminorders`);
        console.log('Fetched orders:', response.data);

        const combinedOrders = response.data.flatMap(userOrder =>
          userOrder.orders.map(order => ({
            ...order,
            userName: userOrder.userName,
          }))
        );

        setOrders(combinedOrders);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Error fetching orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
  };

  const handleStatusChange = (e) => {
    setNewStatus(e.target.value);
  };

  const updateOrderStatus = async () => {
    if (!selectedOrder) return;

    try {
      const response = await axios.put(
        `${URL}/orders/${selectedOrder._id}`,
        { status: newStatus }
      );
      console.log('Order updated successfully:', response.data);

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === selectedOrder._id ? { ...order, status: newStatus } : order
        )
      );

      setSelectedOrder(null); // Close modal after update
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update status');
    }
  };

  const closeModal = () => setSelectedOrder(null);

  return (
    <div className="order-list-container">
      <h2>Admin Order List</h2>
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
                  <p><strong>User Name:</strong> {order.userName || 'N/A'}</p>
                  <p><strong>Customer Name:</strong> {order.address?.name || 'N/A'}</p>
                  <p><strong>Total Price:</strong> ${order.totalPrice}</p>
                  <p><strong>Status:</strong> {order.status}</p>
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
            <p><strong>User Name:</strong> {selectedOrder.userName}</p>
            <p><strong>Total Price:</strong> ${selectedOrder.totalPrice}</p>
            <h4>Address:</h4>
            <p>{selectedOrder.address.name}</p>
            <p>{selectedOrder.address.address}, {selectedOrder.address.district}</p>
            <p>{selectedOrder.address.state}, {selectedOrder.address.pinNumber}</p>
            <p>{selectedOrder.address.phoneNumber}</p>
            <h4>Products:</h4>
            <ul>
              {selectedOrder.products.map((item) => (
                <li key={item._id}>
                  <img
                    className="orderlist-image"
                    src={`${URL}${item.image}`}
                    alt={item.product}
                  />
                  <div>
                    <p><strong>Quantity:</strong> {item.quantity}</p>
                    <p><strong>Price:</strong> ${item.price}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="status-update">
              <label htmlFor="status">Update Status:</label>
              <select
                id="status"
                value={newStatus}
                onChange={handleStatusChange}
              >
                <option value="pending">Pending</option>
                <option value="dispatched">Dispatched</option>
                <option value="delivered">Delivered</option>
              </select>
              <button onClick={updateOrderStatus}>Update Status</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderListPage;
