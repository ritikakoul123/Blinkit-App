import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import "../../../Frontend/public/css/Home.css";
import Navbar from "./Navbar";
import axios from "axios";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [selectedUnits, setSelectedUnits] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showProducts, setShowProducts] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.token : null;

  const API_BASE = "http://localhost:8000";

  const categories = [
    "All",
    "Fruits",
    "Dairy",
    "Grocery",
    "Snacks",
    "Home Care",
  ];

  //Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/products`);
      const formatted = res.data.map((p) => ({
        ...p,
        units: Array.isArray(p.units)
          ? p.units
          : typeof p.units === "string"
          ? p.units.split(",").map((u) => u.trim())
          : [],
      }));
      setProducts(formatted);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  //Save cart in localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("units", JSON.stringify(selectedUnits));
  }, [cart, selectedUnits]);

  //POST: Add to Cart API
  const addToCart = async (productId) => {
    if (!token) {
      alert("Please login to add items to cart");
      return;
    }
    const product = products.find((p) => p.id === productId);
    if (!product || product.quantity <= 0) {
      alert("Out of stock!");
      return;
    }
    console.log(token)
    try {
      const body = {
        // user_id: userId,
        product_id: productId,
        quantity: 1,
      };

      const res = await axios.post(`${API_BASE}/cart/`, body, {
        headers: {Authorization: `Bearer ${token}`},
      });
      console.log("Added to cart:", res.data);

      // Update local cart and stock visually
      setCart((prev) => ({ ...prev, [productId]: 1 }));
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, quantity: p.quantity - 1 } : p
        )
      );
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert(err.response?.data?.detail || "Failed to add to cart");
    }
  };

  //Increase quantity in cart
  const increaseQty = async (productId) => {
    if (!token) {
      alert("Please login to add items to cart");
      return;
    }
    const product = products.find((p) => p.id === productId);
    if (!product || product.quantity <= 0) {
      alert("Out of stock!");
      return;
    }

    try {
      const body = {
        product_id: productId,
        quantity: 1, // Add 1 more
      };
      await axios.post(`${API_BASE}/cart/`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCart((prev) => ({ ...prev, [productId]: prev[productId] + 1 }));
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, quantity: p.quantity - 1 } : p
        )
      );
    } catch (err) {
      console.error("Error increasing quantity:", err);
      alert(err.response?.data?.detail || "Failed to increase quantity");
    }
  };

  // Decrease quantity (remove from backend if zero)
  const decreaseQty = async (productId) => {
    if (!token) {
      alert("Please login to modify cart");
      return;
    }
    const currentQty = cart[productId];
    if (!currentQty) return;

    try {
      if (currentQty === 1) {
        // DELETE item from cart
        const userCart = await axios.get(`${API_BASE}/cart/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const item = userCart.data.items.find(
          (it) => it.product.id === productId
        );
        if (item) {
          await axios.delete(`${API_BASE}/cart/remove/${item.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }

        setCart((prev) => {
          const updated = { ...prev };
          delete updated[productId];
          return updated;
        });
      } else {
        // Update quantity via PUT
        const userCart = await axios.get(`${API_BASE}/cart/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const item = userCart.data.items.find(
          (it) => it.product.id === productId
        );
        if (item) {
          await axios.put(`${API_BASE}/cart/update_quantity`, null, {
            headers: { Authorization: `Bearer ${token}` },
            params: { cart_id: item.id, quantity: currentQty - 1 },
          });
        }

        setCart((prev) => ({
          ...prev,
          [productId]: prev[productId] - 1,
        }));
      }

      // Increase local stock visually
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } catch (err) {
      console.error("Error decreasing quantity:", err);
      alert(err.response?.data?.detail || "Failed to decrease quantity");
    }
  };

  //Filtered products (category + search)
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const catName =
        p.category?.name || (typeof p.category === "string" ? p.category : "");
      const matchesCategory =
        selectedCategory === "All" ||
        catName.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = p.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm, products]);

  //Show products on "Shop Now"
  const handleShopNow = () => {
    setShowProducts(true);
    setTimeout(() => {
      const element = document.getElementById("products");
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <>
      <Navbar />
      <div className="home-container">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1>
              Fresh <span>Groceries</span> at Your Doorstep 🛒
            </h1>
            <p>Order daily essentials instantly!</p>
            <button onClick={handleShopNow} className="shop-now-btn">
              Shop Now
            </button>
          </div>
        </section>

        {/* Products Section */}
        {showProducts && (
          <section className="products-section" id="products">
            <h2 className="section-title">Popular Products</h2>

            {/* Filters */}
            <div className="filters">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />

              <div className="categories-filter">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`category-btn ${
                      selectedCategory === cat ? "active" : ""
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Grid */}
            <div className="products-grid">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((prod) => {
                  const qty = cart[prod.id] || 0;
                  const isSoldOut = prod.quantity <= 0;
                  const unit =
                    selectedUnits[prod.id] ||
                    (Array.isArray(prod.units) ? prod.units[0] : "");

                  return (
                    <div key={prod.id} className="product-card">
                      <Link to={`/product/${prod.id}`}>
                        <img
                          src={prod.image_url || prod.image}
                          alt={prod.name}
                          className="clickable-img"
                          onError={(e) =>
                            (e.target.src =
                              "https://via.placeholder.com/150?text=No+Image")
                          }
                        />
                      </Link>

                      <div className="product-info">
                        <h3>{prod.name}</h3>
                        <p className="product-category">
                          {prod.category?.name || prod.category}
                        </p>
                        <p className="product-price">₹{prod.price}</p>
                        <p className={`stock ${isSoldOut ? "sold-out" : ""}`}>
                          {isSoldOut
                            ? "Out of Stock"
                            : `In Stock: ${prod.quantity}`}
                        </p>

                        {/* Unit Selector */}
                        {prod.units?.length > 0 && (
                          <select
                            value={unit}
                            onChange={(e) =>
                              setSelectedUnits((prev) => ({
                                ...prev,
                                [prod.id]: e.target.value,
                              }))
                            }
                            className="unit-select"
                          >
                            {prod.units.map((u) => (
                              <option key={u} value={u}>
                                {u}
                              </option>
                            ))}
                          </select>
                        )}

                        {/* Cart Controls */}
                        {isSoldOut ? (
                          <button className="add-btn sold-out" disabled>
                            Out of Stock
                          </button>
                        ) : qty === 0 ? (
                          <button
                            className="add-btn"
                            onClick={() => addToCart(prod.id)}
                          >
                            Add to Cart
                          </button>
                        ) : (
                          <div className="qty-controls">
                            <button
                              onClick={() => decreaseQty(prod.id)}
                              className="qty-btn"
                            >
                              −
                            </button>
                            <span className="qty-value">{qty}</span>
                            <button
                              onClick={() => increaseQty(prod.id)}
                              className="qty-btn"
                              disabled={prod.quantity <= 0}
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="no-products">No products found</p>
              )}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
