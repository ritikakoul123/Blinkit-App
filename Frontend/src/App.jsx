import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

// Components
import Home from "../../Frontend/src/components/Home";
import ProductDetails from "../../Frontend/src/components/ProductDetail";
import Signup from "../../Frontend/src/components/Signup";
import Login from "../../Frontend/src/components/Login";
import Cart from "../../Frontend/src/components/Cart";
import Navbar from "../../Frontend/src/components/Navbar";
import AddProduct from "../../Frontend/src/components/AddProduct";
import AdminDashboard from "../../Frontend/src/components/AdminDashboard";
import ForgetPassword from "../../Frontend/src/components/Forgetpassword";
import OrderDetails from "../../Frontend/src/components/OrderDetails";
import EditProduct from "../../Frontend/src/components/EditProduct";

// Protected Admin Route
function ProtectedAdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || user.role_id !== 1) {
    alert("Access Denied: Admins Only!");
    return <Navigate to="/" />;
  }
  return children;
}

function App() {
  const [cart, setCart] = useState({});
  const [selectedUnits, setSelectedUnits] = useState({});
  const [products, setProducts] = useState([]);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Router>
      {/* Navbar */}
      {/* <Navbar cartCount={Object.keys(cart).length} /> */}

      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={
            <Home
              products={products}
              cart={cart}
              setCart={setCart}
              selectedUnits={selectedUnits}
              setSelectedUnits={setSelectedUnits}
            />
          }
        />

        {/* Product Details */}
        <Route
          path="/product/:id"
          element={
            <ProductDetails
              products={products}
              cart={cart}
              setCart={setCart}
              selectedUnits={selectedUnits}
              setSelectedUnits={setSelectedUnits}
            />
          }
        />

        {/* Authentication */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />

        {/* Cart */}
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />

        {/* Add Product */}
        <Route
          path="/addproduct"
          element={<AddProduct onProductAdded={fetchProducts} />}
        />

        <Route
          path="/editproduct"
          element={<AddProduct onProductAdded={fetchProducts} />}
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard products={products} fetchProducts={fetchProducts} />
            </ProtectedAdminRoute>
          }
        />

        {/* Admin Order Details */}
        <Route
          path="/admin/orders"
          element={
            <ProtectedAdminRoute>
              <OrderDetails />
            </ProtectedAdminRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
