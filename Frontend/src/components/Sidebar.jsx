import "../../../Frontend/public/css/Home.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // Navigation actions
  const goToDashboard = () => navigate("/admin/dashboard");
  const goToAddProduct = () => navigate("/addproduct");
  const goToOrders = () => navigate("/admin/orders");

  // Logout
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`} style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100vh'}}>
      
      {/* Top Section: Profile + Navigation */}
      <div>
        {/* Sidebar header with profile */}
        <div className="sidebar-header">
          {user && (
            <p className="admin-profile">
              Logged in as: <strong>{user.email}</strong>
            </p>
          )}
          <button
            className="toggle-btn"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </button>
        </div>

        {/* Navigation buttons */}
        <nav className="sidebar-nav">
          <button className="nav-link" onClick={goToDashboard}>
            🏠 Dashboard
          </button>
          <button className="nav-link" onClick={goToAddProduct}>
            ➕ Add Product
          </button>
          <button className="nav-link" onClick={goToOrders}>
            📦 Order Details
          </button>
        </nav>
      </div>

      {/* Bottom Section: Logout */}
      <div className="sidebar-footer">
        <button className="nav-link logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
