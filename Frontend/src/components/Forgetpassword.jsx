import React, { useState } from "react";
import "../../../Frontend/public/css/ForgetPassword.css";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE || "http://localhost:8000"}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to request password reset.");
      }

      const data = await res.json().catch(() => ({}));
      setMessage(
        data.message ||
          "If that email exists, a password reset link has been sent."
      );
      setEmail("");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fp-wrapper">
      <div className="fp-card">
        <h2 className="fp-title">Forgot Password</h2>
        <p className="fp-sub">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        {message && <div className="fp-message success">{message}</div>}
        {error && <div className="fp-message error">{error}</div>}

        <form className="fp-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="email" className="fp-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="fp-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <button className="fp-button" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <div className="fp-footer">
          <a href="/login" className="fp-link">
            Back to login
          </a>
        </div>
      </div>
    </div>
  );
}
