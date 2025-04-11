
import React, { useEffect, useState, createContext } from "react";
import Routing from "./Routing";
export const appState = createContext();
import axiosInstance from "./api/axios";
import { useNavigate, useLocation } from "react-router";

function App() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const location = useLocation(); // Add this
  const token = localStorage.getItem("token");

  async function checkUser() {
    // Skip user check for password reset routes
    if (location.pathname.includes("/reset-password")) {
      return;
    }

    try {
      if (token) {
        const { data } = await axiosInstance.get("/users/checkUser", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data);
      }
    } catch (error) {
      console.error("Error checking user:", error);
      // setUser(null);
      navigate("/"); // Redirect to login on error
    }
  }

  useEffect(() => {
    checkUser();
  }, [token, location.pathname]); // Add location.pathname as dependency

  return (
    <appState.Provider value={{ user, setUser, token }}>
      <Routing />
    </appState.Provider>
  );
}

export default App;
