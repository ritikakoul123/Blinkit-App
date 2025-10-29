// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "/public/css/Cart.css";
// import axios from "axios";


// const API_BASE = "http://localhost:8000";

// export default function Cart() {
//   const navigate = useNavigate();
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const user = JSON.parse(localStorage.getItem("user"));
//   const userToken = user?.token;
//   const userId = user?.id;

//   // Fetch user's cart from backend
//   const fetchCart = async () => {
//     if (!userToken) {
//       alert("Please login first");
//       navigate("/login");
//       return;
//     }

//     try {
//       const res = await axios.get(`${API_BASE}/cart/`, {
//         withCredentials: true, // 👈 sends cookies along with the request
//         headers: {
//           Authorization: `Bearer ${userToken}`, // optional if your backend uses token-based auth
//         },
//       });

//       // Axios automatically parses JSON
//       setCartItems(res.data.items || []);
//     } catch (err) {
//       console.error("Error fetching cart:", err);
//     } finally {
//       setLoading(false);
//     }
//   };


//   useEffect(() => {
//     fetchCart();
//   }, []);

//   // Add or increase quantity
//   const increaseQty = async (productId) => {
//     try {
//       const res = await fetch(`${API_BASE}/cart/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ user_id: userId, product_id: productId, quantity: 1 }),
//         credentials: "include",
//       });
//       if (res.ok) fetchCart();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Decrease quantity
//   const decreaseQty = async (productId) => {
//     try {
//       const item = cartItems.find((i) => i.product.id === productId);
//       if (item.quantity <= 1) {
//         await removeItem(item.id);
//         return;
//       }
//       const res = await fetch(`${API_BASE}/cart/update_quantity`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ cart_id: item.id, quantity: item.quantity - 1 }),
//       });
//       if (res.ok) fetchCart();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   //  Remove item from cart
//   const removeItem = async (cartId) => {
//     try {
//       const res = await fetch(`${API_BASE}/cart/remove/${cartId}`, { method: "DELETE" });
//       if (res.ok) fetchCart();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Place order and clear cart
//   const handlePlaceOrder = async () => {
//     if (!userToken) {
//       alert("Please login to place order");
//       navigate("/login");
//       return;
//     }

//     try {
//       const res = await fetch(`${API_BASE}/cart/clear/${userToken}`, { method: "DELETE" });
//       if (res.ok) {
//         alert("Order placed successfully! Your items will be delivered soon.");
//         setCartItems([]);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const totalPrice = cartItems.reduce(
//     (sum, item) => sum + item.product.price * item.quantity,
//     0
//   );

//   if (loading) return <p>Loading cart...</p>;

//   return (
//     <div className="cart-page">
//       <h2 className="cart-title">My Cart 🛒</h2>

//       {cartItems.length === 0 ? (
//         <p className="empty-cart">Your cart is currently empty.</p>
//       ) : (
//         <>
//           <div className="cart-list">
//             {cartItems.map((item) => (
//               <div key={item.id} className="cart-item">
//                 <img
//                   src={item.product.image}
//                   alt={item.product.name}
//                   className="cart-item-img"
//                 />
//                 <div className="cart-item-info">
//                   <h4>{item.product.name}</h4>
//                   <p>₹{item.product.price}</p>
//                 </div>

//                 <div className="cart-actions">
//                   <button className="qty-btn" onClick={() => decreaseQty(item.product.id)}>
//                     −
//                   </button>
//                   <span className="qty-value">{item.quantity}</span>
//                   <button className="qty-btn" onClick={() => increaseQty(item.product.id)}>
//                     +
//                   </button>
//                   <button className="remove-btn" onClick={() => removeItem(item.id)}>
//                     Remove
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="cart-summary">
//             <h3>Total: ₹{totalPrice.toFixed(2)}</h3>
//             <button className="checkout-btn" onClick={handlePlaceOrder}>
//               Place Order
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }








import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "/public/css/Cart.css";
import axios from "axios";

const API_BASE = "http://localhost:8000";

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const userToken = user?.token;

  // ✅ Fetch user's cart
  const fetchCart = async () => {
    if (!userToken) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get(`${API_BASE}/cart/`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ✅ Increase quantity
  const increaseQty = async (productId) => {
    try {
      await axios.post(
        `${API_BASE}/cart/`,
        { product_id: productId, quantity: 1 },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      fetchCart();
    } catch (err) {
      console.error("Error increasing quantity:", err);
    }
  };

  // ✅ Decrease quantity (query params instead of JSON)
  const decreaseQty = async (productId) => {
    try {
      const item = cartItems.find((i) => i.product.id === productId);
      if (!item) return;

      if (item.quantity <= 1) {
        await removeItem(item.id);
        return;
      }

      const newQuantity = item.quantity - 1;

      await axios.put(
        `${API_BASE}/cart/update_quantity?cart_id=${item.id}&quantity=${newQuantity}`,
        {},
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      fetchCart();
    } catch (err) {
      console.error("Error decreasing quantity:", err);
    }
  };

  // ✅ Remove item
  const removeItem = async (cartId) => {
    try {
      await axios.delete(`${API_BASE}/cart/remove/${cartId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      fetchCart();
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  // ✅ Place order (clear cart)
  const handlePlaceOrder = async () => {
    if (!userToken) {
      alert("Please login to place order");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.delete(`${API_BASE}/cart/clear`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      if (res.status === 200) {
        alert("✅ Order placed successfully! Your items will be delivered soon.");
        setCartItems([]);
      } else {
        alert("⚠️ Something went wrong while placing your order.");
      }
    } catch (err) {
      console.error("Error placing order:", err);
      alert("❌ Failed to place order. Please try again.");
    }
  };

  // ✅ Calculate total price
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (loading) return <p>Loading cart...</p>;

  return (
    <div className="cart-page">
      <h2 className="cart-title">My Cart 🛒</h2>

      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is currently empty.</p>
      ) : (
        <>
          <div className="cart-list">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="cart-item-img"
                />
                <div className="cart-item-info">
                  <h4>{item.product.name}</h4>
                  <p>₹{item.product.price}</p>
                </div>

                <div className="cart-actions">
                  <button
                    className="qty-btn"
                    onClick={() => decreaseQty(item.product.id)}
                  >
                    −
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => increaseQty(item.product.id)}
                  >
                    +
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Total: ₹{totalPrice.toFixed(2)}</h3>
            <button className="checkout-btn" onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}
