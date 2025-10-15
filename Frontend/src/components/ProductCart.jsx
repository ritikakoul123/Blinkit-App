import "../../../Frontend/public/css/ProductCart.css";

export default function ProductCart({ product }) {
  return (
    <div className="product-card">
      <img src={product.image || "https://via.placeholder.com/150"} alt={product.name} />
      <div className="product-info">
        <h3>{product.name}</h3>
        <p>₹{product.price}</p>
        <button className="add-btn">Add to Cart</button>
      </div>
    </div>
  );
}
