import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../api";
import "/public/css/Login.css";

export default function Login({ setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        
        // Save JWT token and user info with role_id and role_name
        const userData = {
          email: data.email,
          id: data.id,
          name: data.name,
          token: data.access_token,
          role: data.role_name,   // "admin" or "user"
          role_id: data.role_id,  // 1 = admin, 2 = user
        };
        localStorage.setItem("user", JSON.stringify(userData));
        cookieStore.set("access_token", )

        if (setUser) setUser(userData);

        alert("Login successful!");

        // Redirect based on role
        if (data.role_id === 1) navigate("/admin/dashboard");
        else navigate("/");
      } else {
        alert(data.detail || "Invalid credentials. Please try again!");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Welcome Back 👋</h2>
        <p className="subtitle">Sign in to continue to your account</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="forgot-password">
            <span onClick={() => navigate("/forgetpassword")}>
              Forgot Password?
            </span>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="register-text">
          Don’t have an account?{" "}
          <span className="signup-link" onClick={() => navigate("/signup")}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
