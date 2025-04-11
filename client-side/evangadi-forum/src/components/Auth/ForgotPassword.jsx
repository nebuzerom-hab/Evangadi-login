import React, { useState } from "react";
import axios from "axios";
import axiosInstance from "../../api/axios"; // Adjust the import path as necessary
import styles from "./ForgotPassword.module.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        "/users/forgot-password",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setMessage(response.data.msg);
    } catch (error) {
      console.error("Error:", error.response?.data);
      setMessage(
        error.response?.data?.error ||
          "An error occurred. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
      {message && (
        <p
          className={`${styles.message} ${
            message.includes("error") ? styles.error : styles.success
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default ForgotPassword;
