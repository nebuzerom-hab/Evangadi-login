import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import clas from "./editQuestion.module.css";

const EditQuestion = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState(""); // Success/Error message
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const token = localStorage.getItem("token");

  // Fetch question details to pre-fill the form
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch(
          `http://localhost:7700/api/questions/${questionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch question details.");
        }

        const data = await response.json();
        setTitle(data.question.title);
        setDescription(data.question.description);
      } catch (err) {
        setMessage(err.message || "Error fetching question.");
        setMessageType("error"); // Red for error
        console.error("Error fetching question:", err);
      }
    };

    fetchQuestion();
  }, [questionId, token]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:7700/api/questions/${questionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, description }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update question.");
      }

      setMessage("Question updated successfully!");
      setMessageType("success"); // Blue for success

      setTimeout(() => {
        navigate(`/questions`);
      }, 2000); // Redirect after 2 seconds
    } catch (err) {
      setMessage(err.message || "Error updating question.");
      setMessageType("error"); // Red for error
      console.error("Failed to update question:", err);
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    navigate(`/questions/${questionId}`); // Redirect back to questions page
  };

  return (
    <div className={clas.question}>
      <h2>Update Question</h2>

      {/* Display message with dynamic styling */}
      {message && (
        <p
          className={`${clas.message} ${
            messageType === "success" ? clas.success : clas.error
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label>
          <br />
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <div className={clas.buttonGroup}>
          <button type="submit" className={clas.saveButton}>
            Save Changes
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className={clas.cancelButton}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditQuestion;
