// import { useEffect, useState, useMemo } from "react";
// import { Link } from "react-router-dom";
// import "../../../Frontend/public/css/Home.css";

// export default function Home({ user }) {
//   const [showProducts, setShowProducts] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [cart, setCart] = useState({}); // { id: quantity }
//   const [selectedUnits, setSelectedUnits] = useState({}); // { id: unit }

//   // Load cart and units from localStorage
//   useEffect(() => {
//     const savedCart = localStorage.getItem("cart");
//     const savedUnits = localStorage.getItem("units");
//     if (savedCart) setCart(JSON.parse(savedCart));
//     if (savedUnits) setSelectedUnits(JSON.parse(savedUnits));
//   }, []);

//   // Save cart and units to localStorage whenever they change
//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cart));
//     localStorage.setItem("units", JSON.stringify(selectedUnits));
//   }, [cart, selectedUnits]);

//   const products = [
//     // Fruits
//     { id: 1, name: "Fresh Apples", category: "Fruits", price: 120, units: ["500 gm", "1 kg", "2 kg"], image: "https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg" },
//     { id: 2, name: "Bananas", category: "Fruits", price: 60, units: ["500 gm", "1 kg"], image: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg" },
//     { id: 3, name: "Mangoes", category: "Fruits", price: 150, units: ["250 gm", "500 gm", "1 kg"], image: "https://upload.wikimedia.org/wikipedia/commons/9/90/Hapus_Mango.jpg" },
//     { id: 4, name: "Oranges", category: "Fruits", price: 80, units: ["500 gm", "1 kg"], image: "https://upload.wikimedia.org/wikipedia/commons/c/c4/Orange-Fruit-Pieces.jpg" },
//     { id: 5, name: "Grapes", category: "Fruits", price: 100, units: ["250 gm", "500 gm", "1 kg"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Grapes%2C_Dry_Creek_Valley-7705.jpg/640px-Grapes%2C_Dry_Creek_Valley-7705.jpg" },
//     { id: 6, name: "Pineapple", category: "Fruits", price: 90, units: ["1 pc", "2 pcs"], image: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Pineapple_and_cross_section.jpg" },
//     { id: 7, name: "Watermelon", category: "Fruits", price: 70, units: ["1 kg", "2 kg"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Owoce_Arbuz.jpg/640px-Owoce_Arbuz.jpg" },

//     // Dairy
//     { id: 8, name: "Amul Milk", category: "Dairy", price: 65, units: ["500 ml", "1 L", "2 L"], image: "https://fetchnbuy.in/cdn/shop/files/FullSizeRender_grande.jpg?v=1724562386" },
//     { id: 9, name: "Amul Butter", category: "Dairy", price: 55, units: ["100 gm", "200 gm"], image: "https://m.media-amazon.com/images/I/41jaRSA4DdL._AC_SY350_QL15_.jpg" },
//     { id: 10, name: "Paneer", category: "Dairy", price: 120, units: ["200 gm", "500 gm"], image: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcT2Z3upxLbV0jFNuHtSrpqEP66EsgOOEAd8YeiRAokB9rKg-WS0Wvk6EIJIyPYbtIZEzPg6-2sibi-tC-J3QZYnBDOQwEqI4uKt0JF0XMPM6LUnqfSXuy8PT9lH_UxOwq3mNZZphFQ&usqp=CAc" },
//     { id: 11, name: "Curd (Dahi)", category: "Dairy", price: 40, units: ["200 gm", "500 gm"], image: "https://www.jiomart.com/images/product/original/494502732/amul-dahi-creamy-tasty-fresh-curd-800-g-product-images-o494502732-p610662657-0-202505192009.jpg?im=Resize=(420,420)" },
//     { id: 12, name: "Cheese Slices", category: "Dairy", price: 150, units: ["100 gm", "200 gm"], image: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcR7L8ZUGojjcoo3OSZRRx3bG8Q9EwUVrOFJQYAT6SoCZaNJVSIhm18dk-bajU_34fQQZlJ2TdmJpckCbynBa1qMrr0sRir_GeTPPFOv4PbIucEArs_7ScfmgQ" },
//     { id: 13, name: "Amul Fresh Cream", category: "Dairy", price: 70, units: ["100 gm", "200 gm"], image: "https://www.bbassets.com/media/uploads/p/l/40102603_3-amul-fresh-cream-25-milk-fat-low-fat.jpg" },

//     // Grocery
//     { id: 14, name: "Aashirvaad Atta", category: "Grocery", price: 480, units: ["1 kg", "5 kg"], image: "https://m.media-amazon.com/images/I/51+ke2DncqL.jpg" },
//     { id: 15, name: "Tata Salt", category: "Grocery", price: 25, units: ["500 gm", "1 kg"], image: "https://m.media-amazon.com/images/I/614mm2hYHyL._UF894,1000_QL80_.jpg" },
//     { id: 16, name: "Fortune Sunflower Oil", category: "Grocery", price: 180, units: ["500 ml", "1 L"], image: "https://rukminim2.flixcart.com/image/480/640/kuh9yfk0/edible-oil/i/l/d/1-sunflower-oil-1ltr-1-pouch-sunflower-oil-fortune-original-imag7hbgfwfpmdpy.jpeg?q=90" },
//     { id: 17, name: "Basmati Rice", category: "Grocery", price: 250, units: ["1 kg", "5 kg"], image: "https://m.media-amazon.com/images/I/61qxiKxm8zL._SL1100_.jpg" },
//     { id: 18, name: "Sugar", category: "Grocery", price: 40, units: ["500 gm", "1 kg"], image: "https://images.jdmagicbox.com/quickquotes/images_main/-01g7eh76.jpg" },
//     { id: 19, name: "Toor Dal", category: "Grocery", price: 130, units: ["500 gm", "1 kg"], image: "https://m.media-amazon.com/images/I/513swGXtD9L._SY300_SX300_QL70_FMwebp_.jpg" },
//     { id: 20, name: "Tata Tea Gold", category: "Grocery", price: 260, units: ["250 gm", "500 gm"], image: "https://m.media-amazon.com/images/I/5109sLDpkvL._SX679_.jpg" },
//     { id: 21, name: "Tata Sampann Masoor Dal", category: "Grocery", price: 150, units: ["500 gm", "1 kg"], image: "https://m.media-amazon.com/images/I/71u90sMQgoL._SX679_.jpg" },

//     // Snacks
//     { id: 22, name: "Maggi Noodles", category: "Snacks", price: 55, units: ["70 gm", "140 gm"], image: "https://www.mystore.in/s/62ea2c599d1398fa16dbae0a/6585dcd850b90bfd59650cd3/10-800x800.JPG" },
//     { id: 23, name: "Kurkure Masala Munch", category: "Snacks", price: 25, units: ["50 gm", "100 gm"], image: "https://www.mystore.in/s/62ea2c599d1398fa16dbae0a/67b34ba775b9614219fe7dd4/8901491100519_1-800x800.png" },
//     { id: 24, name: "Lays Chips", category: "Snacks", price: 30, units: ["50 gm", "100 gm"], image: "https://www.bbassets.com/media/uploads/p/l/102750_17-lays-potato-chips-indias-magic-masala.jpg" },
//     { id: 25, name: "Parle-G Biscuits", category: "Snacks", price: 10, units: ["50 gm", "100 gm"], image: "https://m.media-amazon.com/images/I/51IB4EqOUxL._SY300_SX300_QL70_FMwebp_.jpg" },
//     { id: 26, name: "Bingo Tedhe Medhe", category: "Snacks", price: 20, units: ["50 gm", "100 gm"], image: "https://m.media-amazon.com/images/I/71e9pUGU4tL.jpg" },
//     { id: 27, name: "Britannia Cake", category: "Snacks", price: 35, units: ["50 gm", "100 gm"], image: "https://fetchnbuy.in/cdn/shop/products/61jgaxBM6CL._SL1500_grande.jpg?v=1641198537" },

//     // Home Care2
//     { id: 28, name: "Surf Excel Matic", category: "Home Care", price: 210, units: ["1 kg", "2 kg"], image: "https://m.media-amazon.com/images/I/41rHT9Hy1gL._SY300_SX300_QL70_FMwebp_.jpg" },
//     { id: 29, name: "Lizol Floor Cleaner", category: "Home Care", price: 180, units: ["500 ml", "1 L"], image: "https://m.media-amazon.com/images/I/31NFdb1W02L._SY300_SX300_QL70_FMwebp_.jpg" },
//     { id: 30, name: "Harpic Toilet Cleaner", category: "Home Care", price: 95, units: ["500 ml", "1 L"], image: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQyjv30Xn-ROieFzlUMGsSIxglKEzu_GZmwnigdpV4_SGO2xFhevcTd0mUiBmFV3pyRR8_mG4WDHMCM4lYFaR9cNuV5bEx2RlEDyCy3xr2fEMid6sa8pqUNXYv_-HU9xOymI7IrdEc&usqp=CAc" },
//     { id: 31, name: "Colin Glass Cleaner", category: "Home Care", price: 120, units: ["500 ml", "1 L"], image: "https://m.media-amazon.com/images/I/41wmkNNTAqL._SY300_SX300_QL70_FMwebp_.jpg" },
//     { id: 32, name: "Vim Dishwash Liquid", category: "Home Care", price: 110, units: ["500 ml", "1 L"], image: "https://m.media-amazon.com/images/I/510lHmxXNFL._SY300_SX300_QL70_FMwebp_.jpg" },
//     { id: 33, name: "Dettol Hand Wash", category: "Home Care", price: 95, units: ["200 ml", "500 ml"], image: "https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_600/NI_CATALOG/IMAGES/CIW/2024/11/7/d753d6db-60c9-44ac-9ac6-286177050b17_83533_1.png" },
//     { id: 34, name: "Comfort Fabric Conditioner", category: "Home Care", price: 190, units: ["500 ml", "1 L"], image: "https://www.quickpantry.in/cdn/shop/products/comfort-after-wash-lily-fresh-fabric-conditioner-quick-pantry.jpg?v=1710538265" },
//   ];

//   const handleShopNow = () => {
//     setShowProducts(true);
//     setTimeout(() => {
//       const element = document.getElementById("products");
//       if (element) element.scrollIntoView({ behavior: "smooth" });
//     }, 100);
//   };

//   const addToCart = (id) => {
//     setCart((prev) => ({
//       ...prev,
//       [id]: prev[id] ? prev[id] + 1 : 1,
//     }));
//   };

//   const increaseQty = (id) => {
//     setCart((prev) => ({ ...prev, [id]: prev[id] + 1 }));
//   };

//   const decreaseQty = (id) => {
//     setCart((prev) => {
//       const newCart = { ...prev };
//       if (newCart[id] === 1) delete newCart[id];
//       else newCart[id] -= 1;
//       return newCart;
//     });
//   };

//   const handleUnitChange = (id, unit) => {
//     setSelectedUnits((prev) => ({ ...prev, [id]: unit }));
//   };

//   const categories = ["All", "Fruits", "Dairy", "Grocery", "Snacks", "Home Care"];

//   const filteredProducts = useMemo(() => {
//     return products.filter((p) => {
//       const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
//       const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
//       return matchesCategory && matchesSearch;
//     });
//   }, [selectedCategory, searchTerm]);

//   return (
//     <div className="home-container">
//       {/* Hero Section */}
//       <section className="hero">
//         <div className="hero-content">
//           <h1>
//             Fresh <span>Groceries</span> at Your Doorstep 🛒
//           </h1>
//           <p>Order daily essentials & get them delivered within minutes!</p>
//           <button onClick={handleShopNow} className="shop-now-btn">
//             Shop Now
//           </button>
//         </div>
//       </section>

//       {/* Product Section */}
//       {showProducts && (
//         <section className="products-section" id="products">
//           <h2 className="section-title">Popular Products</h2>

//           {/* Search + Filters */}
//           <div className="filters">
//             <input
//               type="text"
//               placeholder="Search for products..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="search-input"
//             />
//             <div className="categories-filter">
//               {categories.map((cat) => (
//                 <button
//                   key={cat}
//                   onClick={() => setSelectedCategory(cat)}
//                   className={`category-btn ${selectedCategory === cat ? "active" : ""}`}
//                 >
//                   {cat}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Product Grid */}
//           <div className="products-grid">
//             {filteredProducts.length > 0 ? (
//               filteredProducts.map((prod) => {
//                 const qty = cart[prod.id] || 0;
//                 const unit = selectedUnits[prod.id] || prod.units[0];

//                 return (
//                   <div key={prod.id} className="product-card">
//                     {/* Clickable Image */}
//                     <Link to={`/product/${prod.id}`}>
//                       <img src={prod.image} alt={prod.name} className="clickable-img" />
//                     </Link>

//                     <div className="product-info">
//                       <h3>{prod.name}</h3>
//                       <p>₹{prod.price}</p>

//                       {/* Unit Selector */}
//                       <select
//                         value={unit}
//                         onChange={(e) => handleUnitChange(prod.id, e.target.value)}
//                         className="unit-select"
//                       >
//                         {prod.units.map((u) => (
//                           <option key={u} value={u}>
//                             {u}
//                           </option>
//                         ))}
//                       </select>

//                       {qty === 0 ? (
//                         <button className="add-btn" onClick={() => addToCart(prod.id)}>
//                           Add to Cart
//                         </button>
//                       ) : (
//                         <div className="qty-controls">
//                           <button onClick={() => decreaseQty(prod.id)} className="qty-btn">
//                             −
//                           </button>
//                           <span className="qty-value">{qty}</span>
//                           <button onClick={() => increaseQty(prod.id)} className="qty-btn">
//                             +
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })
//             ) : (
//               <p className="no-products">No products found</p>
//             )}
//           </div>
//         </section>
//       )}
//     </div>
//   );
// }









// import { useEffect, useState, useMemo } from "react";
// import { Link } from "react-router-dom";
// import "../../../Frontend/public/css/Home.css"; // Adjust path as needed

// export default function Home({ products = [], cart, setCart, selectedUnits, setSelectedUnits }) {
//   const [showProducts, setShowProducts] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [searchTerm, setSearchTerm] = useState("");

//   const categories = ["All", "Fruits", "Dairy", "Grocery", "Snacks", "Home Care"];

//   // Save cart and units to localStorage whenever updated
//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cart));
//     localStorage.setItem("units", JSON.stringify(selectedUnits));
//   }, [cart, selectedUnits]);

//   // Scroll + show product section
//   const handleShopNow = () => {
//     setShowProducts(true);
//     setTimeout(() => {
//       const element = document.getElementById("products");
//       if (element) element.scrollIntoView({ behavior: "smooth" });
//     }, 100);
//   };

//   // Cart handlers
//   const addToCart = (id) =>
//     setCart((prev) => ({ ...prev, [id]: prev[id] ? prev[id] + 1 : 1 }));

//   const increaseQty = (id) =>
//     setCart((prev) => ({ ...prev, [id]: prev[id] + 1 }));

//   const decreaseQty = (id) => {
//     setCart((prev) => {
//       const newCart = { ...prev };
//       if (newCart[id] === 1) delete newCart[id];
//       else newCart[id] -= 1;
//       return newCart;
//     });
//   };

//   const handleUnitChange = (id, unit) =>
//     setSelectedUnits((prev) => ({ ...prev, [id]: unit }));

//   // Filter products based on category and search
//   const filteredProducts = useMemo(() => {
//     return products.filter((p) => {
//       const matchesCategory =
//         selectedCategory === "All" || p.category?.name === selectedCategory;
//       const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
//       return matchesCategory && matchesSearch;
//     });
//   }, [selectedCategory, searchTerm, products]);

//   return (
//     <div className="home-container">
//       {/* Hero Section */}
//       <section className="hero">
//         <div className="hero-content">
//           <h1>
//             Fresh <span>Groceries</span> at Your Doorstep 🛒
//           </h1>
//           <p>Order daily essentials & get them delivered within minutes!</p>
//           <button onClick={handleShopNow} className="shop-now-btn">
//             Shop Now
//           </button>
//         </div>
//       </section>

//       {/* Products Section */}
//       {showProducts && (
//         <section className="products-section" id="products">
//           <h2 className="section-title">Popular Products</h2>

//           {/* Filters */}
//           <div className="filters">
//             <input
//               type="text"
//               placeholder="Search for products..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="search-input"
//             />
//             <div className="categories-filter">
//               {categories.map((cat) => (
//                 <button
//                   key={cat}
//                   onClick={() => setSelectedCategory(cat)}
//                   className={`category-btn ${
//                     selectedCategory === cat ? "active" : ""
//                   }`}
//                 >
//                   {cat}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Products Grid */}
//           <div className="products-grid">
//             {filteredProducts.length > 0 ? (
//               filteredProducts.map((prod) => {
//                 const qty = cart[prod.id] || 0;

//                 // Safely handle both array or string units
//                 const safeUnits = Array.isArray(prod.units)
//                   ? prod.units
//                   : typeof prod.units === "string"
//                   ? prod.units.split(",").map((u) => u.trim())
//                   : [];

//                 const unit =
//                   selectedUnits[prod.id] ||
//                   (safeUnits.length > 0 ? safeUnits[0] : "");

//                 return (
//                   <div key={prod.id} className="product-card">
//                     <Link to={`/product/${prod.id}`}>
//                       <img
//                         src={prod.image_url || prod.image}
//                         alt={prod.name}
//                         className="clickable-img"
//                         onError={(e) =>
//                           (e.target.src =
//                             "https://via.placeholder.com/150?text=No+Image")
//                         }
//                       />
//                     </Link>

//                     <div className="product-info">
//                       <h3>{prod.name}</h3>
//                       <p className="product-category">
//                         {prod.category?.name || prod.category}
//                       </p>
//                       <p className="product-price">₹{prod.price}</p>

//                       {safeUnits.length > 0 && (
//                         <select
//                           value={unit}
//                           onChange={(e) =>
//                             handleUnitChange(prod.id, e.target.value)
//                           }
//                           className="unit-select"
//                         >
//                           {safeUnits.map((u) => (
//                             <option key={u} value={u}>
//                               {u}
//                             </option>
//                           ))}
//                         </select>
//                       )}

//                       {qty === 0 ? (
//                         <button
//                           className="add-btn"
//                           onClick={() => addToCart(prod.id)}
//                         >
//                           Add to Cart
//                         </button>
//                       ) : (
//                         <div className="qty-controls">
//                           <button
//                             onClick={() => decreaseQty(prod.id)}
//                             className="qty-btn"
//                           >
//                             −
//                           </button>
//                           <span className="qty-value">{qty}</span>
//                           <button
//                             onClick={() => increaseQty(prod.id)}
//                             className="qty-btn"
//                           >
//                             +
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })
//             ) : (
//               <p className="no-products">No products found</p>
//             )}
//           </div>
//         </section>
//       )}
//     </div>
//   );
// }










import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import "../../../Frontend/public/css/Home.css";

export default function Home({ products = [], cart, setCart, selectedUnits, setSelectedUnits }) {
  const [showProducts, setShowProducts] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = ["All", "Fruits", "Dairy", "Grocery", "Snacks", "Home Care"];

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("units", JSON.stringify(selectedUnits));
  }, [cart, selectedUnits]);

  const handleShopNow = () => {
    setShowProducts(true);
    setTimeout(() => {
      const element = document.getElementById("products");
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const addToCart = (id) => setCart((prev) => ({ ...prev, [id]: 1 }));
  const increaseQty = (id) => setCart((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  const decreaseQty = (id) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (updated[id] === 1) delete updated[id];
      else updated[id] -= 1;
      return updated;
    });
  };

  const handleUnitChange = (id, unit) => setSelectedUnits((prev) => ({ ...prev, [id]: unit }));

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = selectedCategory === "All" || p.category?.name === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm, products]);

  return (
    <div className="home-container">
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

      {showProducts && (
        <section className="products-section" id="products">
          <h2 className="section-title">Popular Products</h2>

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
              filteredProducts.map((prod) => {
                const qty = cart[prod.id] || 0;
                const safeUnits = Array.isArray(prod.units)
                  ? prod.units
                  : typeof prod.units === "string"
                  ? prod.units.split(",").map((u) => u.trim())
                  : [];
                const unit =
                  selectedUnits[prod.id] || (safeUnits.length > 0 ? safeUnits[0] : "");

                const isSoldOut = prod.quantity <= 0;

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
                      <p className="product-category">{prod.category?.name || prod.category}</p>
                      <p className="product-price">₹{prod.price}</p>
                      <p className={`stock ${isSoldOut ? "sold-out" : ""}`}>
                        {isSoldOut ? "Sold Out" : `In Stock: ${prod.quantity}`}
                      </p>

                      {safeUnits.length > 0 && (
                        <select
                          value={unit}
                          onChange={(e) => handleUnitChange(prod.id, e.target.value)}
                          className="unit-select"
                        >
                          {safeUnits.map((u) => (
                            <option key={u} value={u}>
                              {u}
                            </option>
                          ))}
                        </select>
                      )}

                      {isSoldOut ? (
                        <button className="add-btn sold-out" disabled>
                          Sold Out
                        </button>
                      ) : qty === 0 ? (
                        <button className="add-btn" onClick={() => addToCart(prod.id)}>
                          Add to Cart
                        </button>
                      ) : (
                        <div className="qty-controls">
                          <button onClick={() => decreaseQty(prod.id)} className="qty-btn">
                            −
                          </button>
                          <span className="qty-value">{qty}</span>
                          <button onClick={() => increaseQty(prod.id)} className="qty-btn">
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
  );
}
