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

// Protected Admin Route
// function ProtectedAdminRoute({ children }) {
//   const user = JSON.parse(localStorage.getItem("user"));
//   if (!user || user.role !== "admin") {
//     alert("Access Denied: Admins Only!");
//     return <Navigate to="/" />;
//   }
//   return children;
// }

function App() {
  const [cart, setCart] = useState({});
  const [selectedUnits, setSelectedUnits] = useState({});
  const [products, setProducts] = useState([]);

  // Fetch products
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
      <Navbar cartCount={Object.keys(cart).length} />

      <Routes>
        {/* User Home */}
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

        {/* Auth */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Cart */}
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />

        {/* Add Product */}
        <Route
          path="/addproduct"
          element={
              <AddProduct onProductAdded={fetchProducts} />
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
              <AdminDashboard
                products={products}
                fetchProducts={fetchProducts}
              />
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
