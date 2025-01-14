import React, { useState } from "react";
import "../style/RequestPasswordReset.css";
import toast from "react-hot-toast";
import { baseURL } from "../varibles";

const RequestPasswordReset = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const handleRequestReset = async () => {
    setLoading(true); // Show loading
    try {
      const response = await fetch(`${baseURL}/api/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false); // Hide loading
    }
  };

  return (
    <div className="request-password-reset-container">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
      <h2>Forgot Your Password?</h2>
      <p>Enter your email address to receive a password reset link.</p>
      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input-field"
        required
        disabled={loading} // Disable input when loading
      />
      <button
        className="request-reset-button"
        onClick={handleRequestReset}
        disabled={loading} // Disable button when loading
      >
        Send Reset Link
      </button>
    </div>
  );
};

export default RequestPasswordReset;
