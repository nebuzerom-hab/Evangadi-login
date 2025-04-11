import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style/AdminQuestionManagement.css"; // Import the CSS file
import { MdDelete, MdRefresh } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

const AdminQuestionManagement = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
  });
  const navigate = useNavigate();

  // Fetch all questions
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:7700/api/admin/questions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setQuestions(response.data);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Handle question deletion
  const handleDelete = async (questionId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this question and all its answers?"
      )
    ) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `http://localhost:7700/api/admin/questions/${questionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Question deleted successfully");
        fetchQuestions(); // Refresh the list
      } catch (error) {
        toast.error(error.response?.data?.error || "Failed to delete question");
      }
    }
  };

  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Start editing a question
  const startEditing = (question) => {
    setEditingQuestion(question);
    setEditForm({
      title: question.title,
      description: question.description,
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingQuestion(null);
    setEditForm({
      title: "",
      description: "",
    });
  };

  // Submit edited question
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:7700/api/admin/questions/${editingQuestion.question_id}`,
        editForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Question updated successfully");
      fetchQuestions(); // Refresh the list
      cancelEditing(); // Close the edit form
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update question");
    }
  };

  if (loading) {
    return <div className="loading-message">Loading questions...</div>;
  }

  return (
    <div className="admin-container">
      <h1 className="admin-header">Admin Question Management</h1>

      {/* Edit Question Modal */}
      {editingQuestion && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Edit Question</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  className="form-textarea"
                  required
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button type="submit" className="save-button">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="questions-table-container">
        <table className="questions-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Date</th>
              <th>Actions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question) => (
              <tr key={question.question_id}>
                <td>{question.question_id}</td>
                <td>
                  <div className="question-title">{question.title}</div>
                  <div className="question-description">
                    {question.description}
                  </div>
                </td>
                <td>
                  <div className="author-name">{question.user_name}</div>
                  <div className="author-email">{question.email}</div>
                </td>
                <td>{new Date(question.created_at).toLocaleDateString()}</td>
                <td className="action-buttons">
                  <button
                    onClick={() => startEditing(question)}
                    className="edit-button"
                  >
                    <FaEdit />
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(question.question_id)}
                    className="delete-button"
                  >
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminQuestionManagement;
