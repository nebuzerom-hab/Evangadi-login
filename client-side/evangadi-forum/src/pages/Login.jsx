

//last for user and admin
import React, { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../api/axios";
import styles from "./style/login.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();
  const emailDom = useRef();
  const passwordDom = useRef();

  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [inputErrors, setInputErrors] = useState({
    email: false,
    password: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiErrors, setApiErrors] = useState({
    email: false,
    password: false,
  });

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userDataString = localStorage.getItem("userData");

    try {
      const userData = userDataString ? JSON.parse(userDataString) : null;

      if (token) {
        if (userData?.isAdmin) {
          navigate("/admin/dashboard");
        } else {
          navigate("/questions");
        }
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("userData");
    }
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setApiErrors({ email: false, password: false });
    setMessage(null);

    const emailValue = emailDom.current.value.trim();
    const passValue = passwordDom.current.value.trim();

    // Client-side validation
    const errors = {
      email: !emailValue,
      password: !passValue,
    };
    setInputErrors(errors);

    if (errors.email || errors.password) {
      setMessage("Please provide all required information.");
      setMessageType("error");
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await axiosInstance.post("/users/login", {
        email: emailValue,
        password: passValue,
      });

      setMessage("Login Successful!");
      setMessageType("success");

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "userData",
        JSON.stringify({
          username: data.username,
          userId: data.user_id,
          isAdmin: data.is_admin,
        })
      );

      if (data.is_admin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/questions");
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.msg;

      if (errorMessage === "Invalid credentials") {
        try {
          const checkEmailResponse = await axiosInstance.post(
            "/users/check-email",
            { email: emailValue }
          );

          // Set errors based on response
          if (!checkEmailResponse.data.exists) {
            setApiErrors({ email: true, password: true }); // because password is also invalid
            setMessage("Please enter correct email and password");
          } else if (!checkEmailResponse.data.exists) {
            setApiErrors({ email: true, password: false });
            setMessage("Please enter correct email");
          } else {
            setApiErrors({ email: false, password: true });
            setMessage("Please enter correct password");
          }
        } catch (err) {
          // If we can't check the email, assume both might be wrong
          setApiErrors({ email: true, password: true });
          setMessage("Please enter correct email and password");
        }
      } else {
        setMessage(errorMessage || "An error occurred. Please try again.");
      }
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getErrorMessage = () => {
    if (apiErrors.email && apiErrors.password) {
      return "Please enter correct email and password";
    } else if (apiErrors.email) {
      return "Please enter correct email";
    } else if (apiErrors.password) {
      return "Please enter correct password";
    }
    return message;
  };

  return (
    <section className={styles["login-section"]}>
      <div className={styles["login-box"]}>
        {message && (
          <div className={`${styles["form-message"]} ${styles[messageType]}`}>
            {messageType === "error" ? getErrorMessage() : message}
          </div>
        )}

        <h1 className={styles["login-title"]}>Login to your account</h1>
        <p className={styles["login-subtitle"]}>
          Don't have an account?
          <Link to="/register" className={styles["login-signin"]}>
            {" "}
            Create a new account
          </Link>
        </p>
        <form className={styles["login-form"]} onSubmit={handleSubmit}>
          <div className={styles["form-group"]}>
            <input
              id="email"
              ref={emailDom}
              type="email"
              placeholder="Your Email"
              className={`${styles["form-input"]} ${
                inputErrors.email || apiErrors.email ? styles["error"] : ""
              }`}
              onChange={() => {
                if (apiErrors.email) {
                  setApiErrors((prev) => ({ ...prev, email: false }));
                  setMessage(null);
                }
              }}
            />
          </div>
          <div className={styles["form-group"]}>
            <div className={styles["password-input-container"]}>
              <input
                id="password"
                ref={passwordDom}
                type={showPassword ? "text" : "password"}
                placeholder="Your Password"
                className={`${styles["form-input"]} ${
                  inputErrors.password || apiErrors.password
                    ? styles["error"]
                    : ""
                }`}
                onChange={() => {
                  if (apiErrors.password) {
                    setApiErrors((prev) => ({ ...prev, password: false }));
                    setMessage(null);
                  }
                }}
              />
              <button
                type="button"
                className={styles["password-toggle"]}
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <FaEyeSlash className={styles["eye-icon"]} />
                ) : (
                  <FaEye className={styles["eye-icon"]} />
                )}
              </button>
            </div>
          </div>
          <div className={styles["forgot-password"]}>
            <Link to="/forgot-password" className={styles["password-text"]}>
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            className={styles["form-buttons"]}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <div className={styles["login-links"]}>
            <Link to="/register" className={styles["form-link"]}>
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Login;
