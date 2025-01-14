import React, { useState } from "react";
import "../style/ResetPassword.css";
import { useNavigate, useParams } from "react-router-dom";
import { baseURL } from "../varibles";
import toast from "react-hot-toast";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const { token } = useParams();
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true); // Show loading spinner
    try {
      const response = await fetch(`${baseURL}/api/users/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }), // Send token and password
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Password reset successfully");
        navigate("/login"); // Redirect to login page
      } else {
        toast.error(data.message || "Error resetting password");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  return (
    <div className="reset-password-container">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
      <h2>Reset Your Password</h2>
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input-field"
        disabled={loading} // Disable input while loading
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="input-field"
        disabled={loading} // Disable input while loading
      />
      <button
        className="reset-button"
        onClick={handleResetPassword}
        disabled={loading} // Disable button while loading
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>
    </div>
  );
}

export default ResetPassword;
