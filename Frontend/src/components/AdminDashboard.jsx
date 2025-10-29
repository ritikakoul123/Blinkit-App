import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "../../../Frontend/public/css/Home.css";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedUnits, setSelectedUnits] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [userRole, setUserRole] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  // Verify login & role (admin or user)
  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        alert("You must login first!");
        navigate("/login");
        return;
      }
      try {
        const res = await axios.get("http://localhost:8000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserRole(res.data.role_id); // 1 = Admin, else Normal user
        fetchProducts();
      } catch (err) {
        console.error(err);
        alert("Session expired! Please login again.");
        navigate("/login");
      }
    };
    verifyUser();
  }, [token, navigate]);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/products");
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

  const handleDelete = async (id) => {
    if (userRole !== 1) return alert("Only admin can delete products!");
    if (window.confirm("Delete this product?")) {
      try {
        await axios.delete(`http://localhost:8000/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Deleted successfully!");
        fetchProducts();
      } catch (err) {
        console.error("Failed to delete product:", err);
        alert("Failed to delete product!");
      }
    }
  };

  const handleEdit = (id) => {
    if (userRole !== 1) return alert("Only admin can edit products!");
    navigate(`/editproduct?id=${id}`);
  };

  const categories = ["All", "Fruits", "Dairy", "Grocery", "Snacks", "Home Care"];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const catName =
        p.category?.name || (typeof p.category === "string" ? p.category : "");
      const matchesCategory =
        selectedCategory === "All" || catName === selectedCategory;
      const matchesSearch = p.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm, products]);

  return (
    <div className="admin-layout">
      <Sidebar />

      <main className="main-content">
        <section className="hero">
          <div className="hero-content">
            <h1>
              {userRole === 1 ? "Admin" : "User"} <span>Dashboard</span>
            </h1>
            <p>
              {userRole === 1
                ? "Manage stock and products efficiently."
                : "Browse available products."}
            </p>
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
                className={`category-btn ${
                  selectedCategory === cat ? "active" : ""
                }`}
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
                <img
                  src={prod.image_url || prod.image}
                  alt={prod.name}
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/150?text=No+Image")
                  }
                />
                <div className="product-info">
                  <h3>{prod.name}</h3>
                  <p className="product-category">
                    {prod.category?.name || prod.category}
                  </p>
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

                  {userRole === 1 && (
                    <div className="admin-actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(prod.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(prod.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No products found</p>
          )}
        </div>
      </main>
    </div>
  );
}












// import { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import "../../../Frontend/public/css/Home.css";
// import Sidebar from "./Sidebar";
// import { useNavigate } from "react-router-dom";

// export default function AdminDashboard() {
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);
//   const [selectedUnits, setSelectedUnits] = useState({});
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [userRole, setUserRole] = useState(null);

//   // Pagination
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const user = JSON.parse(localStorage.getItem("user"));
//   const token = user?.token;

//   useEffect(() => {
//     const verifyUser = async () => {
//       if (!token) {
//         alert("You must login first!");
//         navigate("/login");
//         return;
//       }
//       try {
//         const res = await axios.get("http://localhost:8000/auth/me", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUserRole(res.data.role_id); // 1 = Admin
//         fetchProducts();
//       } catch (err) {
//         console.error(err);
//         alert("Session expired! Please login again.");
//         navigate("/login");
//       }
//     };
//     verifyUser();
//   }, [token, navigate]);

//   // Fetch products (with pagination + filters + search)
//   const fetchProducts = async () => {
//     try {
//       const params = { page, limit: 6 };

//       if (selectedCategory !== "All") params.category = selectedCategory;
//       if (searchTerm.trim()) params.search = searchTerm.trim();

//       const res = await axios.get("http://localhost:8000/products", { params });

//       const formatted = res.data.products.map((p) => ({
//         ...p,
//         units: Array.isArray(p.units)
//           ? p.units
//           : typeof p.units === "string"
//           ? p.units.split(",").map((u) => u.trim())
//           : [],
//       }));

//       setProducts(formatted);
//       setTotalPages(res.data.pages);
//     } catch (err) {
//       console.error("Error fetching products:", err);
//     }
//   };

//   // Refetch on change
//   useEffect(() => {
//     fetchProducts();
//   }, [page, selectedCategory, searchTerm]);

//   const handleDelete = async (id) => {
//     if (userRole !== 1) return alert("Only admin can delete products!");
//     if (window.confirm("Delete this product?")) {
//       try {
//         await axios.delete(`http://localhost:8000/products/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         alert("Deleted successfully!");
//         fetchProducts();
//       } catch (err) {
//         console.error("Failed to delete product:", err);
//         alert("Failed to delete product!");
//       }
//     }
//   };

//   const handleEdit = (id) => {
//     if (userRole !== 1) return alert("Only admin can edit products!");
//     navigate(`/editproduct?id=${id}`);
//   };

//   const categories = ["All", "Fruits", "Dairy", "Grocery", "Snacks", "Home Care"];

//   return (
//     <div className="admin-layout">
//       <Sidebar />

//       <main className="main-content">
//         <section className="hero">
//           <div className="hero-content">
//             <h1>
//               {userRole === 1 ? "Admin" : "User"} <span>Dashboard</span>
//             </h1>
//             <p>
//               {userRole === 1
//                 ? "Manage stock and products efficiently."
//                 : "Browse available products."}
//             </p>
//           </div>
//         </section>

//         <div className="filters">
//           <input
//             type="text"
//             placeholder="Search for products..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="search-input"
//           />
//           <div className="categories-filter">
//             {categories.map((cat) => (
//               <button
//                 key={cat}
//                 onClick={() => {
//                   setSelectedCategory(cat);
//                   setPage(1);
//                 }}
//                 className={`category-btn ${
//                   selectedCategory === cat ? "active" : ""
//                 }`}
//               >
//                 {cat}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="products-grid">
//           {products.length > 0 ? (
//             products.map((prod) => (
//               <div key={prod.id} className="product-card">
//                 <img
//                   src={prod.image_url || prod.image}
//                   alt={prod.name}
//                   onError={(e) =>
//                     (e.target.src =
//                       "https://via.placeholder.com/150?text=No+Image")
//                   }
//                 />
//                 <div className="product-info">
//                   <h3>{prod.name}</h3>
//                   <p className="product-category">
//                     {prod.category?.name || prod.category}
//                   </p>
//                   <p className="product-price">₹{prod.price}</p>
//                   <p
//                     className={`stock ${prod.quantity <= 0 ? "sold-out" : ""}`}
//                   >
//                     {prod.quantity > 0
//                       ? `In Stock: ${prod.quantity}`
//                       : "Sold Out"}
//                   </p>

//                   {prod.units?.length > 0 && (
//                     <select
//                       value={selectedUnits[prod.id] || prod.units[0]}
//                       onChange={(e) =>
//                         setSelectedUnits((prev) => ({
//                           ...prev,
//                           [prod.id]: e.target.value,
//                         }))
//                       }
//                       className="unit-select"
//                     >
//                       {prod.units.map((u) => (
//                         <option key={u} value={u}>
//                           {u}
//                         </option>
//                       ))}
//                     </select>
//                   )}

//                   {userRole === 1 && (
//                     <div className="admin-actions">
//                       <button
//                         className="edit-btn"
//                         onClick={() => handleEdit(prod.id)}
//                       >
//                         Edit
//                       </button>
//                       <button
//                         className="delete-btn"
//                         onClick={() => handleDelete(prod.id)}
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p>No products found</p>
//           )}
//         </div>

//         {/* Pagination Controls */}
//         {totalPages > 1 && (
//           <div className="pagination-controls">
//             <button
//               disabled={page === 1}
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//             >
//               Prev
//             </button>
//             <span>
//               Page {page} of {totalPages}
//             </span>
//             <button
//               disabled={page === totalPages}
//               onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }
