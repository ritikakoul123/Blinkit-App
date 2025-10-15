import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../../Frontend/public/css/ProductDetail.css"; // create a new CSS file

export default function ProductDetails({ products, cart, setCart, selectedUnits, setSelectedUnits }) {
  const { id } = useParams(); // get product ID from URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const prod = products.find((p) => p.id === parseInt(id));
    if (!prod) {
      navigate("/"); // redirect home if product not found
    } else {
      setProduct(prod);
    }
  }, [id, products, navigate]);

  if (!product) return null;

  const unit = selectedUnits[product.id] || product.units[0];
  const qty = cart[product.id] || 0;

  const handleUnitChange = (e) => {
    setSelectedUnits((prev) => ({ ...prev, [product.id]: e.target.value }));
  };

  const addToCart = () => {
    setCart((prev) => ({ ...prev, [product.id]: 1 }));
  };

  const increaseQty = () => {
    setCart((prev) => ({ ...prev, [product.id]: prev[product.id] + 1 }));
  };

  const decreaseQty = () => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[product.id] === 1) delete newCart[product.id];
      else newCart[product.id] -= 1;
      return newCart;
    });
  };

  return (
    <div className="product-details-container">
      <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
      <div className="product-details">
        <img src={product.image} alt={product.name} className="product-img" />
        <div className="details">
          <h2>{product.name}</h2>
          <p className="category">{product.category}</p>
          <p className="price">₹{product.price}</p>

          <select value={unit} onChange={handleUnitChange} className="unit-select">
            {product.units.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>

          {qty === 0 ? (
            <button onClick={addToCart} className="add-btn">Add to Cart</button>
          ) : (
            <div className="qty-controls">
              <button onClick={decreaseQty} className="qty-btn">−</button>
              <span className="qty-value">{qty}</span>
              <button onClick={increaseQty} className="qty-btn">+</button>
            </div>
          )}

          <p className="description">This is a fresh {product.name}. Perfect for daily use!</p>
        </div>
      </div>
    </div>
  );
}
