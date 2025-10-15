// import { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import "../../../Frontend/public/css/Home.css";
// import { useNavigate } from "react-router-dom";

// export default function AdminDashboard() {
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);
//   const [selectedUnits, setSelectedUnits] = useState({});
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [isAdmin, setIsAdmin] = useState(false);

//   const token = JSON.parse(localStorage.getItem("user"));

//   // Verify Admin using axios
//   useEffect(() => {
//     const verifyAdmin = async () => {
//       if (!token) {
//         alert("You must login!");
//         navigate("/login");
//         return;
//       }

//       try {
//         const res = await axios.get("http://localhost:8000/auth/me", {
//           headers: { Authorization: `Bearer ${token?.token}` },
//         });

//         if (res.data.email !== "admin@gmail.com") {
//           alert("You are not authorized to view this page!");
//           navigate("/"); // redirect non-admin users
//         } else {
//           setIsAdmin(true);
//         }
//       } catch (err) {
//         console.error("Error verifying admin:", err);
//         alert("Token expired or invalid. Please login again.");
//         navigate("/login");
//       }
//     };

//     verifyAdmin();
//   }, [token]);

//   // Fetch products (use axios)
//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get("http://localhost:8000/products");
//       console.log("Fetched products:", res.data);

//       const formatted = res.data.map((p) => ({
//         ...p,
//         units: typeof p.units === "string" ? p.units.split(",") : p.units,
//       }));
//       setProducts(formatted);
//     } catch (err) {
//       console.error("Error fetching products:", err);
//     }
//   };

//   // Fetch products only when admin is verified
//   useEffect(() => {
//     if (isAdmin) {
//       fetchProducts();
//     }
//   }, [isAdmin]);

//   // Delete product
//   const handleDelete = async (id) => {
//     if (!isAdmin) return;
//     if (window.confirm("Are you sure you want to delete this product?")) {
//       try {
//         await axios.delete(`http://localhost:8000/products/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         fetchProducts();
//       } catch (err) {
//         console.error("Error deleting product:", err);
//       }
//     }
//   };

//   //Edit product
//   const handleEdit = (id) => {
//     if (!isAdmin) return;
//     navigate(`/addproduct?id=${id}`);
//   };

//   const categories = ["All", "Fruits", "Dairy", "Grocery", "Snacks", "Home Care"];

//   const filteredProducts = useMemo(() => {
//     return products.filter((p) => {
//       const matchesCategory =
//         selectedCategory === "All" || p.category?.name === selectedCategory;
//       const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
//       return matchesCategory && matchesSearch;
//     });
//   }, [selectedCategory, searchTerm, products]);

//   return (
//     <div className="home-container">
//       <section className="hero">
//         <div className="hero-content">
//           <h1>
//             Admin <span>Dashboard</span>
//           </h1>
//           <p>Manage products, update details, or delete items.</p>
//         </div>
//       </section>

//       {/* Filters */}
//       <div className="filters">
//         <input
//           type="text"
//           placeholder="Search for products..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="search-input"
//         />
//         <div className="categories-filter">
//           {categories.map((cat) => (
//             <button
//               key={cat}
//               onClick={() => setSelectedCategory(cat)}
//               className={`category-btn ${selectedCategory === cat ? "active" : ""}`}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Product Grid */}
//       <div className="products-grid">
//         {filteredProducts.length > 0 ? (
//           filteredProducts.map((prod) => (
//             <div key={prod.id} className="product-card">
//               <img
//                 src={prod.image_url || prod.image}
//                 alt={prod.name}
//                 className="clickable-img"
//               />

//               <div className="product-info">
//                 <h3>{prod.name}</h3>
//                 <p className="product-category">{prod.category?.name}</p>
//                 <p className="product-price">₹{prod.price}</p>

//                 {prod.units?.length > 0 && (
//                   <select
//                     value={selectedUnits[prod.id] || prod.units[0]}
//                     onChange={(e) =>
//                       setSelectedUnits((prev) => ({
//                         ...prev,
//                         [prod.id]: e.target.value,
//                       }))
//                     }
//                     className="unit-select"
//                   >
//                     {prod.units.map((u) => (
//                       <option key={u} value={u}>
//                         {u}
//                       </option>
//                     ))}
//                   </select>
//                 )}

//                 {/* Admin actions */}
//                 <div className="admin-actions">
//                   <button
//                     className="edit-btn"
//                     onClick={() => handleEdit(prod.id)}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     className="delete-btn"
//                     onClick={() => handleDelete(prod.id)}
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="no-products">No products found</p>
//         )}
//       </div>
//     </div>
//   );
// }






// import { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import "../../../Frontend/public/css/Home.css";
// import { useNavigate } from "react-router-dom";

// export default function AdminDashboard() {
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);
//   const [selectedUnits, setSelectedUnits] = useState({});
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [isAdmin, setIsAdmin] = useState(false);

//   const user = JSON.parse(localStorage.getItem("user"));
//   const token = user?.token;

//   // Verify admin
//   useEffect(() => {
//     const verifyAdmin = async () => {
//       if (!token) {
//         alert("You must login first!");
//         navigate("/login");
//         return;
//       }
//       try {
//         const res = await axios.get("http://localhost:8000/auth/me", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (res.data.email !== "admin@gmail.com") {
//           alert("You are not authorized to view this page!");
//           navigate("/");
//         } else {
//           setIsAdmin(true);
//         }
//       } catch (err) {
//         console.error("Error verifying admin:", err);
//         alert("Session expired. Please login again.");
//         navigate("/login");
//       }
//     };
//     verifyAdmin();
//   }, [token, navigate]);

//   // Fetch all products
//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get("http://localhost:8000/products");
//       const formatted = res.data.map((p) => ({
//         ...p,
//         units: typeof p.units === "string" ? p.units.split(",") : p.units,
//       }));
//       setProducts(formatted);
//     } catch (err) {
//       console.error("Error fetching products:", err);
//     }
//   };

//   useEffect(() => {
//     if (isAdmin) fetchProducts();
//   }, [isAdmin]);

//   // Delete product
//   const handleDelete = async (id) => {
//     if (!isAdmin) return;
//     if (window.confirm("Are you sure you want to delete this product?")) {
//       try {
//         await axios.delete(`http://localhost:8000/products/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         alert("Product deleted successfully!");
//         fetchProducts();
//       } catch (err) {
//         console.error("Error deleting product:", err);
//         alert("Failed to delete product!");
//       }
//     }
//   };

//   // Edit product
//   const handleEdit = (id) => {
//     if (!isAdmin) return;
//     navigate(`/addproduct?id=${id}`);
//   };

//   const categories = ["All", "Fruits", "Dairy", "Grocery", "Snacks", "Home Care"];

//   const filteredProducts = useMemo(() => {
//     return products.filter((p) => {
//       const matchesCategory =
//         selectedCategory === "All" || p.category?.name === selectedCategory;
//       const matchesSearch = p.name
//         ?.toLowerCase()
//         .includes(searchTerm.toLowerCase());
//       return matchesCategory && matchesSearch;
//     });
//   }, [selectedCategory, searchTerm, products]);

//   return (
//     <div className="home-container">
//       <section className="hero">
//         <div className="hero-content">
//           <h1>
//             Admin <span>Dashboard</span>
//           </h1>
//           <p>Manage products, update details, or delete items.</p>
//         </div>
//       </section>

//       {/* Search and filters */}
//       <div className="filters">
//         <input
//           type="text"
//           placeholder="Search for products..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="search-input"
//         />
//         <div className="categories-filter">
//           {categories.map((cat) => (
//             <button
//               key={cat}
//               onClick={() => setSelectedCategory(cat)}
//               className={`category-btn ${
//                 selectedCategory === cat ? "active" : ""
//               }`}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Product list */}
//       <div className="products-grid">
//         {filteredProducts.length > 0 ? (
//           filteredProducts.map((prod) => (
//             <div key={prod.id} className="product-card">
//               <img
//                 src={prod.image_url || prod.image}
//                 alt={prod.name}
//                 className="clickable-img"
//               />
//               <div className="product-info">
//                 <h3>{prod.name}</h3>
//                 <p className="product-category">{prod.category?.name}</p>
//                 <p className="product-price">₹{prod.price}</p>

//                 {prod.units?.length > 0 && (
//                   <select
//                     value={selectedUnits[prod.id] || prod.units[0]}
//                     onChange={(e) =>
//                       setSelectedUnits((prev) => ({
//                         ...prev,
//                         [prod.id]: e.target.value,
//                       }))
//                     }
//                     className="unit-select"
//                   >
//                     {prod.units.map((u) => (
//                       <option key={u} value={u}>
//                         {u}
//                       </option>
//                     ))}
//                   </select>
//                 )}

//                 <div className="admin-actions">
//                   <button
//                     className="edit-btn"
//                     onClick={() => handleEdit(prod.id)}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     className="delete-btn"
//                     onClick={() => handleDelete(prod.id)}
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="no-products">No products found</p>
//         )}
//       </div>
//     </div>
//   );
// }










import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "../../../Frontend/public/css/Home.css";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedUnits, setSelectedUnits] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAdmin, setIsAdmin] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  useEffect(() => {
    const verifyAdmin = async () => {
      if (!token) {
        alert("You must login first!");
        navigate("/login");
        return;
      }
      try {
        const res = await axios.get("http://localhost:8000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.email !== "admin@gmail.com") {
          alert("You are not authorized!");
          navigate("/");
        } else {
          setIsAdmin(true);
        }
      } catch (err) {
        alert("Session expired!");
        navigate("/login");
      }
    };
    verifyAdmin();
  }, [token, navigate]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/products");
      const formatted = res.data.map((p) => ({
        ...p,
        units: typeof p.units === "string" ? p.units.split(",") : p.units,
      }));
      setProducts(formatted);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchProducts();
  }, [isAdmin]);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      try {
        await axios.delete(`http://localhost:8000/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Deleted!");
        fetchProducts();
      } catch (err) {
        alert("Failed to delete product!");
      }
    }
  };

  const handleEdit = (id) => navigate(`/addproduct?id=${id}`);

  const categories = ["All", "Fruits", "Dairy", "Grocery", "Snacks", "Home Care"];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === "All" || p.category?.name === selectedCategory;
      const matchesSearch = p.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm, products]);

  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-content">
          <h1>Admin <span>Dashboard</span></h1>
          <p>Manage stock and products efficiently.</p>
        </div>
      </section>

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
              className={`category-btn ${selectedCategory === cat ? "active" : ""}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((prod) => (
            <div key={prod.id} className="product-card">
              <img src={prod.image_url || prod.image} alt={prod.name} />
              <div className="product-info">
                <h3>{prod.name}</h3>
                <p className="product-category">{prod.category?.name}</p>
                <p className="product-price">₹{prod.price}</p>
                <p className={`stock ${prod.quantity <= 0 ? "sold-out" : ""}`}>
                  {prod.quantity > 0
                    ? `In Stock: ${prod.quantity}`
                    : "Sold Out"}
                </p>

                {prod.units?.length > 0 && (
                  <select
                    value={selectedUnits[prod.id] || prod.units[0]}
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

                <div className="admin-actions">
                  <button className="edit-btn" onClick={() => handleEdit(prod.id)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(prod.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
  );
}
