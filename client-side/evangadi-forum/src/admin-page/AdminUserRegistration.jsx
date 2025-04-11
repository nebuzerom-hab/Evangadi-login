import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import classes from "./style/adminUserRegister.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function AdminUserRegistration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    username: false,
    firstname: false,
    lastname: false,
    email: false,
    password: false,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (touched.username) validateUsername();
    if (touched.firstname) validateFirstname();
    if (touched.lastname) validateLastname();
    if (touched.email) validateEmail();
    if (touched.password) validatePassword();
  }, [formData, touched]);

  const validateUsername = () => {
    let error = "";
    if (!formData.username.trim()) {
      error = "Username is required";
    } else if (formData.username.length < 3 || formData.username.length > 20) {
      error = "Username must be between 3-20 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      error = "Only letters, numbers and underscores allowed";
    }
    setErrors((prev) => ({ ...prev, username: error }));
    return !error;
  };

  const validateFirstname = () => {
    let error = "";
    if (!formData.firstname.trim()) {
      error = "First name is required";
    } else if (
      formData.firstname.length < 2 ||
      formData.firstname.length > 50
    ) {
      error = "First name must be between 2-50 characters";
    } else if (!/^[a-zA-Z]+$/.test(formData.firstname)) {
      error = "First name can only contain letters";
    }
    setErrors((prev) => ({ ...prev, firstname: error }));
    return !error;
  };

  const validateLastname = () => {
    let error = "";
    if (!formData.lastname.trim()) {
      error = "Last name is required";
    } else if (formData.lastname.length < 2 || formData.lastname.length > 50) {
      error = "Last name must be between 2-50 characters";
    } else if (!/^[a-zA-Z]+$/.test(formData.lastname)) {
      error = "Last name can only contain letters";
    }
    setErrors((prev) => ({ ...prev, lastname: error }));
    return !error;
  };

  const validateEmail = () => {
    let error = "";
    if (!formData.email.trim()) {
      error = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      error = "Please provide a valid email";
    }
    setErrors((prev) => ({ ...prev, email: error }));
    return !error;
  };

  const validatePassword = () => {
    let error = "";
    if (!formData.password) {
      error = "Password is required";
    } else if (formData.password.length < 8) {
      error = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(formData.password)) {
      error = "At least one uppercase letter required";
    } else if (!/[a-z]/.test(formData.password)) {
      error = "At least one lowercase letter required";
    } else if (!/[0-9]/.test(formData.password)) {
      error = "At least one number required";
    } else if (!/[^a-zA-Z0-9]/.test(formData.password)) {
      error = "At least one special character required";
    }
    setErrors((prev) => ({ ...prev, password: error }));
    return !error;
  };

  const validateForm = () => {
    const validations = [
      validateUsername(),
      validateFirstname(),
      validateLastname(),
      validateEmail(),
      validatePassword(),
    ];

    return validations.every((v) => v);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched to show errors
    const allTouched = {
      username: true,
      firstname: true,
      lastname: true,
      email: true,
      password: true,
    };
    setTouched(allTouched);

    if (!validateForm()) return;

    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const response = await axiosInstance.post(
        "/admin/register-user",
        formData
      );
      setSuccess("User registered successfully!");

      // Reset form
      setFormData({
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        password: "",
      });

      // Reset touched state
      setTouched({
        username: false,
        firstname: false,
        lastname: false,
        email: false,
        password: false,
      });

      // Reset errors
      setErrors({
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        password: "",
      });

      // Navigate after 3 seconds
      setTimeout(() => {
        navigate("/admin/users");
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.msg || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={classes.formWrapper}>
      <div className={classes.signupContainer}>
        <h2 className={classes.title}>Register New User</h2>
        <p className={classes.subtitle}>Create a new regular user account</p>

        <form onSubmit={handleSubmit} className={classes.form}>
          <div className={classes.inputGroup}>
            <input
              type="text"
              name="username"
              placeholder="Username (3-20 chars, letters, numbers, _)"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${classes.input} ${
                errors.username ? classes.errorBorder : ""
              }`}
            />
            {touched.username && errors.username && (
              <span className={classes.errorText}>{errors.username}</span>
            )}
          </div>

          <div className={classes.nameFields}>
            <div className={classes.inputGroup}>
              <input
                type="text"
                name="firstname"
                placeholder="First name (letters only)"
                value={formData.firstname}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${classes.input}  ${classes.firstName} ${
                  errors.firstname ? classes.errorBorder : ""
                }`}
              />
              {touched.firstname && errors.firstname && (
                <span className={classes.errorText}>{errors.firstname}</span>
              )}
            </div>

            <div className={classes.inputGroup}>
              <input
                type="text"
                name="lastname"
                placeholder="Last name (letters only)"
                value={formData.lastname}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${classes.input} ${classes.lastName} ${
                  errors.lastname ? classes.errorBorder : ""
                }`}
              />
              {touched.lastname && errors.lastname && (
                <span className={classes.errorText}>{errors.lastname}</span>
              )}
            </div>
          </div>

          <div className={classes.inputGroup}>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${classes.input} ${
                errors.email ? classes.errorBorder : ""
              }`}
            />
            {touched.email && errors.email && (
              <span className={classes.errorText}>{errors.email}</span>
            )}
          </div>

          <div className={classes.inputGroup}>
            <div className={classes.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password (min 8 chars with uppercase, lowercase, number, special)"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${classes.input} ${classes.passwordInput} ${
                  errors.password ? classes.errorBorder : ""
                }`}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={classes.passwordToggle}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {touched.password && errors.password && (
              <span className={classes.errorText}>{errors.password}</span>
            )}
          </div>

          {error && <div className={classes.errorMessage}>{error}</div>}
          {success && <div className={classes.successMessage}>{success}</div>}

          <button
            type="submit"
            disabled={loading}
            className={`${classes.submitButton} ${
              loading ? classes.loading : ""
            }`}
          >
            {loading ? "Registering..." : "Register User"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminUserRegistration;
