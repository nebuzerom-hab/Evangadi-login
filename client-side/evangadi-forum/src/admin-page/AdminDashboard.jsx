import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import axiosInstance from "../api/axios";
import styles from "./style/adminDashboard.module.css";
import { appState } from "../App";
import { MdDelete, MdRefresh } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useContext(appState);
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  // State management
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuestions: 0,
    totalAnswers: 0,
    totalRatings: 0,
    activeReports: 0,
  });
  const [recentQuestions, setRecentQuestions] = useState([]);
  const [reportedContent, setReportedContent] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    navigate("/");
  };

  // Authentication check
  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem("token");
      const userDataString = localStorage.getItem("userData");

      if (!token || !userDataString) {
        navigate("/", { replace: true });
        return;
      }

      try {
        const userData = JSON.parse(userDataString);
        if (!userData?.isAdmin) {
          handleLogout();
          return;
        }
        setAuthChecked(true);
      } catch (error) {
        console.error("Authentication error:", error);
        handleLogout();
      }
    };

    verifyAuth();
  }, [navigate]);

  // Update active tab based on current route
  useEffect(() => {
    if (!authChecked) return;

    const path = location.pathname;
    if (path.includes("/dashboard")) setActiveTab("dashboard");
    else if (path.includes("/questions")) setActiveTab("questions");
    else if (path.includes("/users")) setActiveTab("users");
    else if (path.includes("/question-full")) setActiveTab("question-full");
    else if (path.includes("/register-user")) setActiveTab("register-user");
  }, [location, authChecked]);

  // Fetch dashboard data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, questionsRes] = await Promise.all([
        axiosInstance.get("/admin/stats"),
        axiosInstance.get("/admin/recent-questions"),
      ]);

      setStats(statsRes.data);
      setRecentQuestions(questionsRes.data);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      setStats({
        totalUsers: "N/A",
        totalQuestions: "N/A",
        totalAnswers: "N/A",
        totalRatings: "N/A",
        activeReports: "N/A",
      });
      setRecentQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authChecked || activeTab !== "dashboard") return;
    fetchData();
  }, [authChecked, activeTab, lastRefresh]);

  // Handle refresh
  const handleRefresh = () => {
    setLastRefresh(new Date());
  };

  // Handle user deletion
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await axiosInstance.delete(`/admin/users/${id}`);
      if (response.status === 200) {
        setUsers(users.filter((user) => user.user_id !== id));
        alert("User deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert(error.response?.data?.msg || "Failed to delete user");
    }
  };

  // Fetch users when the users tab is active
  useEffect(() => {
    if (!authChecked || activeTab !== "users") return;

    const fetchUsers = async () => {
      setUsersLoading(true);
      setUsersError(null);
      try {
        const response = await axiosInstance.get("/admin/users");
        setUsers(response.data.users || []);
      } catch (err) {
        setUsersError(err.response?.data?.msg || "Failed to fetch users");
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, [activeTab, authChecked]);

  // Search functionality
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredUsers = users.filter(
    (user) =>
      user.user_name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm)
  );

  if (!authChecked) {
    return <div className={styles.loading}>Verifying authentication...</div>;
  }

  return (
    <div className={styles.adminContainer}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.adminHeader}>
          <h2>Admin Dashboard</h2>
          <p>Welcome back, {user.user?.username}(Admin)</p>
        </div>

        <nav className={styles.navMenu}>
          <button
            className={`${styles.navItem} ${
              activeTab === "dashboard" ? styles.active : ""
            }`}
            onClick={() => navigate("/admin/dashboard")}
          >
            Dashboard Overview
          </button>

          <button
            className={`${styles.navItem} ${
              activeTab === "register-user" ? styles.active : ""
            }`}
            onClick={() => navigate("/admin/register-user")}
          >
            Create Account For User
          </button>
          <button
            className={`${styles.navItem} ${
              activeTab === "users" ? styles.active : ""
            }`}
            onClick={() => navigate("/admin/users")}
          >
            User Management
          </button>
          <button
            className={`${styles.navItem} ${
              activeTab === "questions" ? styles.active : ""
            }`}
            onClick={() => navigate("/admin/questions")}
          >
            Questions Management
          </button>
          <button
            className={`${styles.navItem} ${
              activeTab === "question-full" ? styles.active : ""
            }`}
            onClick={() => navigate("/admin/question-full")}
          >
            Answer Management
          </button>
        </nav>

        <button className={styles.logoutButton} onClick={handleLogout}>
          Log Out
        </button>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {isLoading && activeTab === "dashboard" ? (
          <div className={styles.loading}>Loading dashboard data...</div>
        ) : (
          <>
            {/* Dashboard Overview */}
            {activeTab === "dashboard" && (
              <div className={styles.dashboardOverview}>
                <div className={styles.dashboardHeader}>
                  <h2>System Overview</h2>
                  <button
                    onClick={handleRefresh}
                    className={styles.refreshButton}
                    disabled={isLoading}
                  >
                    <MdRefresh /> Refresh
                  </button>
                </div>

                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <h3>Total Users</h3>
                    <p>{stats.totalUsers}</p>
                  </div>
                  <div className={styles.statCard}>
                    <h3>Total Questions</h3>
                    <p>{stats.totalQuestions}</p>
                  </div>
                  <div className={styles.statCard}>
                    <h3>Total Answers</h3>
                    <p>{stats.totalAnswers}</p>
                  </div>
                  <div className={styles.statCard}>
                    <h3>Answer Ratings</h3>
                    <p>{stats.totalRatings}</p>
                  </div>
                  <div className={styles.statCard}>
                    <h3>Active Reports</h3>
                    <p>{stats.activeReports}</p>
                  </div>
                </div>

                <div className={styles.recentActivity}>
                  <h3>Recent Questions</h3>
                  {recentQuestions.length === 0 ? (
                    <p>No recent questions</p>
                  ) : (
                    <ul>
                      {recentQuestions.map((question) => (
                        <li key={question.id} className={styles.questionItem}>
                          <Link to={`/questions/${question.id}`}>
                            {question.title}
                          </Link>
                          <Link to={`/questions/${question.id}`}>
                            {question.description}
                          </Link>
                          <div className={styles.questionMeta}>
                            <span className={styles.user}>
                              Asked By: {question.user_name}
                            </span>
                            <span>
                              {new Date(question.created_at).toLocaleString()}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {/* User Management */}
            {activeTab === "users" && (
              <div className={styles.userManagement}>
                <h2>User Management ({filteredUsers.length})</h2>
                <div className={styles.usersContainer}>
                  <div className={styles.searchBar}>
                    <input
                      type="text"
                      placeholder="Search users..."
                      onChange={handleSearch}
                      value={searchTerm}
                    />
                  </div>
                </div>

                {usersLoading ? (
                  <div className={styles.loading}>Loading users...</div>
                ) : usersError ? (
                  <div className={styles.error}>Error: {usersError}</div>
                ) : (
                  <div className={styles.usersTableContainer}>
                    {filteredUsers.length === 0 && searchTerm ? (
                      <div className={styles.noResults}>
                        No users match your search
                      </div>
                    ) : (
                      <table className={styles.usersTable}>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Admin</th>
                            <th>Actions</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((user) => (
                            <tr key={user.user_id}>
                              <td>{user.user_id}</td>
                              <td>{user.user_name}</td>
                              <td>
                                {user.first_name} {user.last_name}
                              </td>
                              <td>{user.email}</td>
                              <td>{user.is_admin ? "Yes" : "No"}</td>
                              <td className={styles.actionCells}>
                                <div className={styles.actionButtons}>
                                  <button
                                    className={`${styles.actionButton} ${styles.editButton}`}
                                    onClick={() =>
                                      navigate(`/admin/users/${user.user_id}`)
                                    }
                                    title="Edit"
                                  >
                                    <FaEdit />
                                  </button>
                                </div>
                              </td>
                              <td>
                                <div className={styles.actionButtons}>
                                  <button
                                    className={`${styles.actionButton} ${styles.deleteButton}`}
                                    onClick={() =>
                                      handleDeleteUser(user.user_id)
                                    }
                                    title="Delete"
                                  >
                                    <MdDelete />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Outlet for nested routes */}
        <Outlet />
      </div>
    </div>
  );
}

export default AdminDashboard;
