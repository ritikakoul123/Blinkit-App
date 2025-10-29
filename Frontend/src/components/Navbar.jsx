import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../../Frontend/public/css/Navbar.css";

export default function Navbar({ cartCount = 0 }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (e) {
      console.error("Error parsing user data:", e);
    }

    if (user) {
      setIsLoggedIn(true);
      setUserRole(user.role);
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserRole(null);
    navigate("/login");
  };

  const isOnAdminDashboard = location.pathname === "/admin/dashboard";

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/")}>
        QuickShop
      </div>

      <div className="location">Delivery in 10 mins</div>

      <div className="nav-links">
        {/*Not Logged In */}
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/signup" className="nav-link">
              Sign Up
            </Link>
          </>
        ) : (
          <>
            {/* Admin Controls */}
            {userRole?.toLowerCase() === "admin" && (
              <>
                {/*Show "Add Product" only when on Admin Dashboard */}
                {isOnAdminDashboard && (
                  <button
                    className="addproduct-btn"
                    onClick={() => navigate("/addproduct")}
                  >
                    Add Product
                  </button>
                )}

                {/*Show Dashboard button only for admin (not for normal users) */}
                {!isOnAdminDashboard && (
                  <button
                    className="dashboard-btn"
                    onClick={() => navigate("/admin/dashboard")}
                  >
                    Dashboard
                  </button>
                )}
              </>
            )}

            {/* Common Logout button for all logged-in users */}
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}

        {/* Cart Button (Visible for all users) */}
        <div className="cart-btn-wrapper" onClick={() => navigate("/cart")}>
          <button className="cart-btn">🛒 My Cart</button>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </div>
      </div>
    </nav>
  );
}
