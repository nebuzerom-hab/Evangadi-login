import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import styles from "./header.module.css";

function Header() {
  const [user, setUser] = useState(null); // Now storing user data instead of just token
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("userData");

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error("Error parsing user data:", error);
          localStorage.removeItem("userData");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    checkUser();
  }, [location]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setUser(null);
    navigate("/");
  };

  const handleHomeClick = () => {
    if (user?.isAdmin) {
      navigate("/admin/dashboard");
    } else {
      navigate("/questions");
    }
  };

  return (
    <section className={styles.navbarwrapper}>
      <div className={styles.logo}>
        <Link to={user?.isAdmin ? "/admin/dashboard" : "/questions"}>
          <img
            src="https://legacy.evangadi.com/themes/humans/assets/hammerlook/img/misc/evangadi-logo-black.png"
            alt="Logo"
          />
        </Link>
      </div>

      {/* Hamburger Menu Icon */}
      <div className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      {/* Navbar Links */}
      <div className={`${styles.navbar} ${menuOpen ? styles.open : ""}`}>
        <div className={styles.home}>
          <button
            onClick={handleHomeClick}
            style={{
              background: "none",
              color: "black",
              border: "none",
              cursor: "pointer",
            }}
          >
            Home
          </button>
        </div>
        <div className={styles.works}>
          <Link to="#">How it works</Link>
        </div>

        {!user ? (
          <Link to="/">
            <button className={styles.signin}>SIGN IN</button>
          </Link>
        ) : (
          <>
            <button onClick={handleSignOut} className={styles.signout}>
              Log Out
            </button>
            <Link to="/profile">Profile</Link>
          </>
        )}
      </div>
    </section>
  );
}

export default Header;
