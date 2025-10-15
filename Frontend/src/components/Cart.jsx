import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "/public/css/Cart.css";

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  // Full product list
  const allProducts = [
// Fruits
    { id: 1, name: "Fresh Apples", category: "Fruits", price: 120, image: "https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg" },
    { id: 2, name: "Bananas", category: "Fruits", price: 60, image: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg" },
    { id: 3, name: "Mangoes", category: "Fruits", price: 150, image: "https://upload.wikimedia.org/wikipedia/commons/9/90/Hapus_Mango.jpg" },
    { id: 4, name: "Oranges", category: "Fruits", price: 80, image: "https://upload.wikimedia.org/wikipedia/commons/c/c4/Orange-Fruit-Pieces.jpg" },
    { id: 5, name: "Grapes", category: "Fruits", price: 100, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Grapes%2C_Dry_Creek_Valley-7705.jpg/640px-Grapes%2C_Dry_Creek_Valley-7705.jpg" },
    { id: 6, name: "Pineapple", category: "Fruits", price: 90, image: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Pineapple_and_cross_section.jpg" },
    { id: 7, name: "Watermelon", category: "Fruits", price: 70, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Owoce_Arbuz.jpg/640px-Owoce_Arbuz.jpg" },

    // Dairy
    { id: 8, name: "Amul Milk", category: "Dairy", price: 65, image: "https://fetchnbuy.in/cdn/shop/files/FullSizeRender_grande.jpg?v=1724562386" },
    { id: 9, name: "Amul Butter", category: "Dairy", price: 55, image: "https://m.media-amazon.com/images/I/41jaRSA4DdL._AC_SY350_QL15_.jpg" },
    { id: 10, name: "Paneer", category: "Dairy", price: 120, image: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcT2Z3upxLbV0jFNuHtSrpqEP66EsgOOEAd8YeiRAokB9rKg-WS0Wvk6EIJIyPYbtIZEzPg6-2sibi-tC-J3QZYnBDOQwEqI4uKt0JF0XMPM6LUnqfSXuy8PT9lH_UxOwq3mNZZphFQ&usqp=CAc" },
    { id: 11, name: "Curd (Dahi)", category: "Dairy", price: 40, image: "https://www.jiomart.com/images/product/original/494502732/amul-dahi-creamy-tasty-fresh-curd-800-g-product-images-o494502732-p610662657-0-202505192009.jpg?im=Resize=(420,420)" },
    { id: 12, name: "Cheese Slices", category: "Dairy", price: 150, image: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcR7L8ZUGojjcoo3OSZRRx3bG8Q9EwUVrOFJQYAT6SoCZaNJVSIhm18dk-bajU_34fQQZlJ2TdmJpckCbynBa1qMrr0sRir_GeTPPFOv4PbIucEArs_7ScfmgQ" },
    { id: 13, name: "Amul Fresh Cream", category: "Dairy", price: 70, image: "https://www.bbassets.com/media/uploads/p/l/40102603_3-amul-fresh-cream-25-milk-fat-low-fat.jpg" },

    // Grocery
    { id: 14, name: "Aashirvaad Atta", category: "Grocery", price: 480, image: "https://m.media-amazon.com/images/I/51+ke2DncqL.jpg" },
    { id: 15, name: "Tata Salt", category: "Grocery", price: 25, image: "https://m.media-amazon.com/images/I/614mm2hYHyL._UF894,1000_QL80_.jpg" },
    { id: 16, name: "Fortune Sunflower Oil", category: "Grocery", price: 180, image: "https://rukminim2.flixcart.com/image/480/640/kuh9yfk0/edible-oil/i/l/d/1-sunflower-oil-1ltr-1-pouch-sunflower-oil-fortune-original-imag7hbgfwfpmdpy.jpeg?q=90" },
    { id: 17, name: "Basmati Rice", category: "Grocery", price: 250, image: "https://m.media-amazon.com/images/I/61qxiKxm8zL._SL1100_.jpg" },
    { id: 18, name: "Sugar", category: "Grocery", price: 40, image: "https://images.jdmagicbox.com/quickquotes/images_main/-01g7eh76.jpg" },
    { id: 19, name: "Toor Dal", category: "Grocery", price: 130, image: "https://m.media-amazon.com/images/I/513swGXtD9L._SY300_SX300_QL70_FMwebp_.jpg" },
    { id: 20, name: "Tata Tea Gold", category: "Grocery", price: 260, image: "https://m.media-amazon.com/images/I/5109sLDpkvL._SX679_.jpg" },
    { id: 21, name: "Tata Sampann Masoor Dal", category: "Grocery", price: 150, image: "https://m.media-amazon.com/images/I/71u90sMQgoL._SX679_.jpg" },

    // Snacks
    { id: 22, name: "Maggi Noodles", category: "Snacks", price: 55, image: "https://www.mystore.in/s/62ea2c599d1398fa16dbae0a/6585dcd850b90bfd59650cd3/10-800x800.JPG" },
    { id: 23, name: "Kurkure Masala Munch", category: "Snacks", price: 25, image: "https://www.mystore.in/s/62ea2c599d1398fa16dbae0a/67b34ba775b9614219fe7dd4/8901491100519_1-800x800.png" },
    { id: 24, name: "Lays Chips", category: "Snacks", price: 30, image: "https://www.bbassets.com/media/uploads/p/l/102750_17-lays-potato-chips-indias-magic-masala.jpg" },
    { id: 25, name: "Parle-G Biscuits", category: "Snacks", price: 10, image: "https://m.media-amazon.com/images/I/51IB4EqOUxL._SY300_SX300_QL70_FMwebp_.jpg" },
    { id: 26, name: "Bingo Tedhe Medhe", category: "Snacks", price: 20, image: "https://m.media-amazon.com/images/I/71e9pUGU4tL.jpg" },
    { id: 27, name: "Britannia Cake", category: "Snacks", price: 35, image: "https://fetchnbuy.in/cdn/shop/products/61jgaxBM6CL._SL1500_grande.jpg?v=1641198537" },

    // Home Care
    { id: 28, name: "Surf Excel Matic", category: "Home Care", price: 210, image: "https://m.media-amazon.com/images/I/41rHT9Hy1gL._SY300_SX300_QL70_FMwebp_.jpg" },
    { id: 29, name: "Lizol Floor Cleaner", category: "Home Care", price: 180, image: "https://m.media-amazon.com/images/I/31NFdb1W02L._SY300_SX300_QL70_FMwebp_.jpg" },
    { id: 30, name: "Harpic Toilet Cleaner", category: "Home Care", price: 95, image: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQyjv30Xn-ROieFzlUMGsSIxglKEzu_GZmwnigdpV4_SGO2xFhevcTd0mUiBmFV3pyRR8_mG4WDHMCM4lYFaR9cNuV5bEx2RlEDyCy3xr2fEMid6sa8pqUNXYv_-HU9xOymI7IrdEc&usqp=CAc" },
    { id: 31, name: "Colin Glass Cleaner", category: "Home Care", price: 120, image: "https://m.media-amazon.com/images/I/41wmkNNTAqL._SY300_SX300_QL70_FMwebp_.jpg" },
    { id: 32, name: "Vim Dishwash Liquid", category: "Home Care", price: 110, image: "https://m.media-amazon.com/images/I/510lHmxXNFL._SY300_SX300_QL70_FMwebp_.jpg" },
    { id: 33, name: "Dettol Hand Wash", category: "Home Care", price: 95, image: "https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_600/NI_CATALOG/IMAGES/CIW/2024/11/7/d753d6db-60c9-44ac-9ac6-286177050b17_83533_1.png" },
    { id: 34, name: "Comfort Fabric Conditioner", category: "Home Care", price: 190, image: "https://www.quickpantry.in/cdn/shop/products/comfort-after-wash-lily-fresh-fabric-conditioner-quick-pantry.jpg?v=1710538265" },
  ];

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || {};
    updateCartUI(savedCart);
  }, []);

  // Helper: sync state with cart
  const updateCartUI = (cartObj) => {
    const items = Object.entries(cartObj)
      .map(([id, qty]) => {
        const product = allProducts.find((p) => p.id === parseInt(id));
        return product ? { ...product, quantity: qty } : null;
      })
      .filter(Boolean);
    setCartItems(items);
  };

  // Helper: update both localStorage + UI
  const saveCart = (newCart) => {
    localStorage.setItem("cart", JSON.stringify(newCart));
    updateCartUI(newCart);
  };

  // Cart operations
  const increaseQty = (id) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || {};
    cart[id] = (cart[id] || 0) + 1;
    saveCart(cart);
  };

  const decreaseQty = (id) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || {};
    if (cart[id] > 1) cart[id] -= 1;
    else delete cart[id];
    saveCart(cart);
  };

  const removeItem = (id) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || {};
    delete cart[id];
    saveCart(cart);
  };

  // Calculate total price
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Handle order
  const handlePlaceOrder = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert(" Please login to place your order.");
      navigate("/login");
      return;
    }

    alert(" Order placed successfully! Your items will be delivered soon.");
    localStorage.removeItem("cart");
    setCartItems([]);
  };

  return (
    <div className="cart-page">
      <h2 className="cart-title">My Cart🛒</h2>

      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is currently empty.</p>
      ) : (
        <>
          <div className="cart-list">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <p>₹{item.price}</p>
                </div>

                <div className="cart-actions">
                  <button className="qty-btn" onClick={() => decreaseQty(item.id)}>−</button>
                  <span className="qty-value">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => increaseQty(item.id)}>+</button>
                  <button className="remove-btn" onClick={() => removeItem(item.id)}>Remove</button>
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
