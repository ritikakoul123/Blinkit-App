// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "../../../Frontend/public/css/AddProduct.css";
// import { useNavigate } from "react-router-dom";

// export default function AddProduct({ onProductAdded }) {
//   const [formData, setFormData] = useState({
//     name: "",
//     category: "",
//     price: "",
//     units: "",
//     image: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [isAdmin, setIsAdmin] = useState(false);

//   const token = localStorage.getItem("token"); // JWT token
//   const navigate = useNavigate();

//   // Check if user is admin
//   useEffect(() => {
//     const checkAdmin = async () => {
//       if (!token) {
//         // alert("You must be logged in!");
//         navigate("/Admin/dashboard");
//         return;
//       }
//       try {
//         const res = await axios.get("http://localhost:8000/auth/me", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (res.data.role_name !== "admin") {
//           alert("You are not authorized to access this page!");
//           navigate("/"); // redirect non-admin to home
//         } else {
//           setIsAdmin(true);
//         }
//       } catch (err) {
//         console.error("Error verifying user:", err);
//         alert("Token expired or invalid. Please login again.");
//         navigate("/login");
//       }
//     };

//     checkAdmin();
//   }, [token, navigate]);

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleAddProduct = async (e) => {
//     e.preventDefault();
//     if (!isAdmin) return;

//     setLoading(true);
//     try {
//       await axios.post(
//         "http://localhost:8000/products",
//         {
//           ...formData,
//           price: Number(formData.price),
//           units: formData.units.split(",").map((u) => u.trim()),
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       alert("Product added successfully!");
//       setFormData({ name: "", category: "", price: "", units: "", image: "" });
//       onProductAdded(); // refresh product list
//     } catch (err) {
//       console.error("Error adding product:", err);
//       alert("Failed to add product. Check console for details.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="admin-products">
//       <h2>🛒 Add New Product</h2>

//       <form className="add-product-form" onSubmit={handleAddProduct}>
//         <input
//           name="name"
//           placeholder="Product Name"
//           value={formData.name}
//           onChange={handleInputChange}
//           required
//         />

//         <input
//           name="category"
//           placeholder="Category"
//           value={formData.category}
//           onChange={handleInputChange}
//           required
//         />

//         <input
//           name="price"
//           type="number"
//           placeholder="Price"
//           value={formData.price}
//           onChange={handleInputChange}
//           required
//         />

//         <input
//           name="units"
//           placeholder="Units (comma separated)"
//           value={formData.units}
//           onChange={handleInputChange}
//           required
//         />

//         <input
//           name="image"
//           placeholder="Image URL"
//           value={formData.image}
//           onChange={handleInputChange}
//           required
//         />

//         <button type="submit" disabled={loading || !isAdmin}>
//           {loading ? "Adding..." : "Add Product"}
//         </button>
//       </form>
//     </div>
//   );
// }












// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "../../../Frontend/public/css/AddProduct.css";
// import { useNavigate, useSearchParams } from "react-router-dom";

// export default function AddProduct() {
//   const [formData, setFormData] = useState({
//     name: "",
//     category: "",
//     price: "",
//     units: "",
//     image: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [searchParams] = useSearchParams();
//   const editId = searchParams.get("id");

//   const user = JSON.parse(localStorage.getItem("user"));
//   const token = user?.token;
//   const navigate = useNavigate();

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
//           alert("You are not authorized!");
//           navigate("/");
//         } else {
//           setIsAdmin(true);
//         }
//       } catch (err) {
//         console.error("Error verifying admin:", err);
//         alert("Token invalid or expired!");
//         navigate("/login");
//       }
//     };
//     verifyAdmin();
//   }, [token, navigate]);

//   // If editing, fetch existing product
//   useEffect(() => {
//     if (editId) {
//       const fetchProduct = async () => {
//         try {
//           const res = await axios.get(`http://localhost:8000/products/${editId}`);
//           const product = res.data;
//           setFormData({
//             name: product.name,
//             category: product.category,
//             price: product.price,
//             units: Array.isArray(product.units)
//               ? product.units.join(", ")
//               : product.units,
//             image: product.image,
//           });
//         } catch (err) {
//           console.error("Error fetching product for edit:", err);
//         }
//       };
//       fetchProduct();
//     }
//   }, [editId]);

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!isAdmin) return;
//     setLoading(true);

//     try {
//       if (editId) {
//         await axios.put(
//           `http://localhost:8000/products/${editId}`,
//           {
//             ...formData,
//             price: Number(formData.price),
//             units: formData.units.split(",").map((u) => u.trim()),
//           },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         alert("Product updated successfully!");
//       } else {
//         await axios.post(
//           "http://localhost:8000/products",
//           {
//             ...formData,
//             price: Number(formData.price),
//             units: formData.units.split(",").map((u) => u.trim()),
//           },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         alert("Product added successfully!");
//       }
//       navigate("/admin/dashboard");
//     } catch (err) {
//       console.error("Error saving product:", err);
//       alert("Failed to save product!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="admin-products">
//       <h2>{editId ? "✏️ Edit Product" : "🛒 Add New Product"}</h2>

//       <form className="add-product-form" onSubmit={handleSubmit}>
//         <input
//           name="name"
//           placeholder="Product Name"
//           value={formData.name}
//           onChange={handleInputChange}
//           required
//         />

//         <input
//           name="category"
//           placeholder="Category"
//           value={formData.category}
//           onChange={handleInputChange}
//           required
//         />

//         <input
//           name="price"
//           type="number"
//           placeholder="Price"
//           value={formData.price}
//           onChange={handleInputChange}
//           required
//         />

//         <input
//           name="units"
//           placeholder="Units (comma separated)"
//           value={formData.units}
//           onChange={handleInputChange}
//           required
//         />

//         <input
//           name="image"
//           placeholder="Image URL"
//           value={formData.image}
//           onChange={handleInputChange}
//           required
//         />

//         <button type="submit" disabled={loading || !isAdmin}>
//           {loading ? "Saving..." : editId ? "Update Product" : "Add Product"}
//         </button>
//       </form>
//     </div>
//   );
// }












import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../Frontend/public/css/AddProduct.css";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    units: "",
    image: "",
    quantity: "", 
  });
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("id");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;
  const navigate = useNavigate();

  // Verify admin
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
        console.error("Error verifying admin:", err);
        alert("Token invalid or expired!");
        navigate("/login");
      }
    };
    verifyAdmin();
  }, [token, navigate]);

  // Fetch product if editing
  useEffect(() => {
    if (editId) {
      const fetchProduct = async () => {
        try {
          const res = await axios.get(`http://localhost:8000/products/${editId}`);
          const product = res.data;
          setFormData({
            name: product.name,
            category: product.category,
            price: product.price,
            units: Array.isArray(product.units)
              ? product.units.join(", ")
              : product.units,
            image: product.image,
            quantity: product.quantity || "",
          });
        } catch (err) {
          console.error("Error fetching product:", err);
        }
      };
      fetchProduct();
    }
  }, [editId]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    setLoading(true);

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        units: formData.units.split(",").map((u) => u.trim()),
      };

      if (editId) {
        await axios.put(`http://localhost:8000/products/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Product updated successfully!");
      } else {
        await axios.post("http://localhost:8000/products", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Product added successfully!");
      }
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Failed to save product!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-products">
      <h2>{editId ? "✏️ Edit Product" : "🛒 Add New Product"}</h2>
      <form className="add-product-form" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <input
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleInputChange}
          required
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={handleInputChange}
          required
        />
        <input
          name="units"
          placeholder="Units (comma separated)"
          value={formData.units}
          onChange={handleInputChange}
          required
        />
        <input
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleInputChange}
          required
        />
        <input
          name="quantity"
          type="number"
          placeholder="Stock Quantity"
          value={formData.quantity}
          onChange={handleInputChange}
          required
        />
        <button type="submit" disabled={loading || !isAdmin}>
          {loading ? "Saving..." : editId ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
}
