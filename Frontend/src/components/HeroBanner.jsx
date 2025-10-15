import React from "react";
import { useNavigate } from "react-router-dom";
import "./HeroBanner.css"; // CSS for banner styling

export default function HeroBanner() {
  const navigate = useNavigate();

  const categories = [
    {
      title: "Paan corner",
      subtitle: "Your favourite paan shop is now online",
      btnText: "Shop Now",
      imgUrl: "/images/paan.png", // add relevant image in public/images
      categoryPath: "/products/paan",
      bgColor: "linear-gradient(90deg, #4caf50, #81c784)"
    },
    {
      title: "Pharmacy at your doorstep!",
      subtitle: "Cough syrups, pain relief sprays & more",
      btnText: "Order Now",
      imgUrl: "/images/pharmacy.png",
      categoryPath: "/products/pharmacy",
      bgColor: "linear-gradient(90deg, #00bcd4, #4dd0e1)"
    },
    {
      title: "Pet Care supplies in minutes",
      subtitle: "Food, treats, toys & more",
      btnText: "Order Now",
      imgUrl: "/images/petcare.png",
      categoryPath: "/products/petcare",
      bgColor: "linear-gradient(90deg, #ffc107, #ffd54f)"
    },
    {
      title: "No time for a diaper run?",
      subtitle: "Get baby care essentials in minutes",
      btnText: "Order Now",
      imgUrl: "/images/baby.png",
      categoryPath: "/products/baby",
      bgColor: "linear-gradient(90deg, #90a4ae, #cfd8dc)"
    },
  ];

  return (
    <div className="hero-container">
      {categories.map((cat, index) => (
        <div
          key={index}
          className="hero-card"
          style={{ background: cat.bgColor }}
        >
          <div className="hero-text">
            <h2>{cat.title}</h2>
            <p>{cat.subtitle}</p>
            <button onClick={() => navigate(cat.categoryPath)}>
              {cat.btnText}
            </button>
          </div>
          <div className="hero-img">
            <img src={cat.imgUrl} alt={cat.title} />
          </div>
        </div>
      ))}
    </div>
  );
}
