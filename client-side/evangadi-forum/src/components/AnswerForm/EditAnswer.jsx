import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import classes from "./EditAnswer.module.css";

const EditAnswer = () => {
  const { answerId } = useParams();
  const { questionId } = useParams();
  const navigate = useNavigate();
  const [answerText, setAnswerText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchAnswer = async () => {
      try {
        setIsLoading(true);
        setError("");
        setSuccessMessage("");

        const response = await fetch(
          `http://localhost:7700/api/answers/${answerId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch answer");
        }

        const data = await response.json();
        if (!data.answer) {
          throw new Error("Answer data is missing");
        }

        setAnswerText(data.answer);
      } catch (err) {
        setError(
          "You are not authorized to update it. Because you are not the owner of this answer"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnswer();
  }, [answerId, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!answerText.trim()) {
      setError("Answer cannot be empty");
      setSuccessMessage("");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const response = await fetch(
        `http://localhost:7700/api/answers/${answerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ updatedAnswer: answerText }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update answer");
      }

      setSuccessMessage("Successfully updated");
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      setError(err.message || "Failed to update answer");
      setSuccessMessage("");
      console.error("Failed to update answer:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className={classes.loading}>Loading answer...</div>;
  }

  return (
    <div className={classes.editAnswerWrapper}>
      <h1>Update Your Answer</h1>
      {error && <p className={classes.error}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          className={classes.answerTextarea}
          required
          disabled={isSubmitting}
        />
        {successMessage && <p className={classes.success}>{successMessage}</p>}
        <div className={classes.buttonGroup}>
          <button
            type="submit"
            className={classes.saveButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={classes.cancelButton}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAnswer;
