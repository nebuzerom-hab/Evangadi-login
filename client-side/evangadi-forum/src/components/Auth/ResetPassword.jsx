import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./ResetPassword.module.css";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValidToken, setIsValidToken] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7700/api/users/verify-reset-token/${token}`
        );

        if (response.data.success) {
          setIsValidToken(true);
          setResetToken(response.data.resetToken);
        } else {
          toast.error(response.data.message);
          navigate("/forgot-password");
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Invalid or expired reset link"
        );
        navigate("/forgot-password");
      }
    };

    verifyToken();
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length <= 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:7700/api/users/reset-password",
        {
          resetToken,
          newPassword,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => navigate("/"), 2000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error resetting password");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidToken) {
    return <div className={styles.container}>Verifying reset link...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.authForm}>
        <h2>Reset Your Password</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength="6"
              placeholder="Enter new password"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm new password"
            />
          </div>
          <button
            type="submit"
            className={styles.btnPrimary}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
