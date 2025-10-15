import "../css/Products.css";

export default function Products({ products }) {
  return (
    <div className="products-container">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <img src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p>₹{product.price}</p>
          <button className="btn-add">Add to Cart</button>
        </div>
      ))}
    </div>
  );
}
