import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import classes from "./style/register.module.css";
import axiosInstance from "../api/axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminSecret, setShowAdminSecret] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    agreeToTerms: false,
    adminSecret: "",
    isAdminRegistration: false,
  });

  const [errors, setErrors] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    agreeToTerms: "",
    adminSecret: "",
    general: "",
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

  const validateAdminSecret = () => {
    let error = "";
    if (formData.isAdminRegistration && !formData.adminSecret.trim()) {
      error = "Admin secret is required";
    }
    setErrors((prev) => ({ ...prev, adminSecret: error }));
    return !error;
  };

  const validateTerms = () => {
    let error = "";
    if (!formData.agreeToTerms) {
      error = "You must agree to the terms";
    }
    setErrors((prev) => ({ ...prev, agreeToTerms: error }));
    return !error;
  };

  const validateForm = () => {
    const validations = [
      validateUsername(),
      validateFirstname(),
      validateLastname(),
      validateEmail(),
      validatePassword(),
      validateTerms(),
    ];

    if (formData.isAdminRegistration) {
      validations.push(validateAdminSecret());
    }

    return validations.every((v) => v);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const toggleAdminRegistration = () => {
    setFormData({
      ...formData,
      isAdminRegistration: !formData.isAdminRegistration,
      adminSecret: "",
    });
    setErrors((prev) => ({ ...prev, adminSecret: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched to show errors
    setTouched({
      username: true,
      firstname: true,
      lastname: true,
      email: true,
      password: true,
    });

    if (!validateForm()) return;

    setLoading(true);
    setSuccess(null);
    setErrors((prev) => ({ ...prev, general: "" }));

    try {
      const payload = formData.isAdminRegistration
        ? formData
        : {
            username: formData.username,
            firstname: formData.firstname,
            lastname: formData.lastname,
            email: formData.email,
            password: formData.password,
            agreeToTerms: formData.agreeToTerms,
          };

      const response = await axiosInstance.post("/users/register", payload);

      setSuccess(
        formData.isAdminRegistration
          ? "Admin registration successful!"
          : "User registration successful!"
      );

      setFormData({
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        agreeToTerms: false,
        adminSecret: "",
        isAdminRegistration: false,
      });
      // Reset all errors and
      setErrors({
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        agreeToTerms: "",
        adminSecret: "",
        general: "",
      });
      //reset touched states
      setTouched({
        username: false,
        firstname: false,
        lastname: false,
        email: false,
        password: false,
      });

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general:
          error.response?.data?.msg || "Registration failed. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleAdminSecretVisibility = () => {
    setShowAdminSecret(!showAdminSecret);
  };

  return (
    <div className={classes.form__wrapper}>
      <div className={classes.signup__container}>
        <h2 className={classes.join}>
          {formData.isAdminRegistration
            ? "Admin Registration"
            : "Join the network"}
        </h2>
        <p className={classes.all}>
          {formData.isAdminRegistration ? (
            "Register as an administrator"
          ) : (
            <>
              Already have an account?{" "}
              <Link to="/" className={classes.Signin}>
                Sign in
              </Link>
            </>
          )}
        </p>

        <form onSubmit={handleSubmit} className={classes.form}>
          <div className={classes.adminToggle}>
            <label>
              <input
                type="checkbox"
                checked={formData.isAdminRegistration}
                onChange={toggleAdminRegistration}
              />
              Register as Admin
            </label>
          </div>

          <div className={classes.inputGroup}>
            <input
              type="text"
              name="username"
              placeholder="Username (3-20 chars, letters, numbers, _)"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.username ? classes.errorBorder : ""}
            />
            {touched.username && errors.username && (
              <span style={{ color: "red" }}>{errors.username}</span>
            )}
          </div>

          <div className={classes.name__fields}>
            <div className={classes.inputGroup}>
              <input
                type="text"
                name="firstname"
                placeholder="First name (letters only)"
                value={formData.firstname}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.firstname ? classes.errorBorder : ""}
              />
              {touched.firstname && errors.firstname && (
                <span style={{ color: "red" }}>{errors.firstname}</span>
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
                className={errors.lastname ? classes.errorBorder : ""}
              />
              {touched.lastname && errors.lastname && (
                <span style={{ color: "red" }}>{errors.lastname}</span>
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
              className={errors.email ? classes.errorBorder : ""}
            />
            {touched.email && errors.email && (
              <span style={{ color: "red" }}>{errors.email}</span>
            )}
          </div>

          <div className={classes.inputGroup}>
            <div className={classes.passwordInputContainer}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password (min 8 chars with uppercase, lowercase, number, special)"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.password ? classes.errorBorder : ""}
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
              <span style={{ color: "red" }}>{errors.password}</span>
            )}
          </div>

          {formData.isAdminRegistration && (
            <div className={classes.inputGroup}>
              <div className={classes.passwordInputContainer}>
                <input
                  type={showAdminSecret ? "text" : "password"}
                  name="adminSecret"
                  placeholder="Admin Secret Key"
                  value={formData.adminSecret}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.adminSecret ? classes.errorBorder : ""}
                />
                <button
                  type="button"
                  onClick={toggleAdminSecretVisibility}
                  className={classes.passwordToggle}
                >
                  {showAdminSecret ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.adminSecret && (
                <span style={{ color: "red" }}>{errors.adminSecret}</span>
              )}
            </div>
          )}

          <div className={classes.checkbox__group}>
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className={errors.agreeToTerms ? classes.errorBorder : ""}
            />
            <label className={classes.terms}>
              I agree to the{" "}
              <a href="/privacy-policy" className={classes.pp_terms}>
                privacy policy
              </a>{" "}
              and{" "}
              <a href="/terms" className={classes.pp_terms}>
                terms of service
              </a>
              .
            </label>
            {errors.agreeToTerms && (
              <span style={{ color: "red" }}>{errors.agreeToTerms}</span>
            )}
          </div>

          {!success && errors.general && (
            <span style={{ color: "red" }}>{errors.general}</span>
          )}
          {success && <span className={classes.success}>{success}</span>}

          <button type="submit" disabled={loading} className={classes.agree}>
            {loading
              ? "Signing up..."
              : formData.isAdminRegistration
              ? "Register as Admin"
              : "Agree and Join"}
          </button>

          {!formData.isAdminRegistration && (
            <h5 className={classes.account__user}>
              Already have an account?
              <Link to={"/"}> Login</Link>
            </h5>
          )}
        </form>
      </div>
    </div>
  );
}

export default Register;
