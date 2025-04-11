// src/components/admin/UsersManagement.jsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import styles from "./style/adminDashboard.module.css";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/admin/users");
        setUsers(response.data.users);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredUsers = users.filter(
    (user) =>
      user.user_name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm)
  );

  const toggleAdminStatus = async (userId, currentStatus) => {
    try {
      await axiosInstance.put(`/admin/users/${userId}`, {
        is_admin: !currentStatus,
      });
      setUsers(
        users.map((user) =>
          user.user_id === userId ? { ...user, is_admin: !currentStatus } : user
        )
      );
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to update user");
    }
  };

  if (loading) return <div className={styles.loading}>Loading users...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    // <div className={styles.usersContainer}>
    //   <h2>User Management</h2>

    //   <div className={styles.searchBar}>
    //     <input
    //       type="text"
    //       placeholder="Search users..."
    //       onChange={handleSearch}
    //       value={searchTerm}
    //     />
    //   </div>
    // </div>
    <></>
  );
};

export default UsersManagement;
