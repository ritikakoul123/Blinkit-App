import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../Frontend/public/css/OrderDetails.css";

export default function OrderDetails() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all orders from backend
    axios
      .get("http://localhost:8000/orders") //Replace with your actual endpoint
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="order-details-container">
        <p className="loading-text">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="order-details-container">
      <h2 className="order-details-title">Order Details</h2>

      <table className="order-details-table">
        <thead>
          <tr>
            <th>SR No</th>
            <th>Order By</th>
            <th>Address</th>
            <th>Amount (₹)</th>
          </tr>
        </thead>

        <tbody>
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <tr key={order.id || index}>
                <td>{index + 1}</td>
                <td>{order.user_name || "N/A"}</td>
                <td>{order.address || "N/A"}</td>
                <td>{order.amount ? order.amount.toFixed(2) : "0.00"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="no-orders">
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
