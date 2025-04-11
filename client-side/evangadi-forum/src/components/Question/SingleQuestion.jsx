import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { FaStar, FaRegStar } from "react-icons/fa";
import AnswerForm from "../AnswerForm/AnswerForm";
import classes from "./singleQuestion.module.css";
import person from "../../assets/image/account.png";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

const SingleQuestion = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const answersPerPage = 3;
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // Helper functions for local storage ratings
  const getRatingsFromStorage = () => {
    const ratings = localStorage.getItem("answerRatings");
    return ratings ? JSON.parse(ratings) : {};
  };

  const saveRatingToStorage = (answerId, rating) => {
    const ratings = getRatingsFromStorage();
    ratings[answerId] = rating;
    localStorage.setItem("answerRatings", JSON.stringify(ratings));
  };

  const fetchQuestion = async () => {
    try {
      const response = await fetch(
        `http://localhost:7700/api/questions/${questionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setQuestion(data.question);
        setAnswers(data.answers);

        // Get ratings from both API and local storage
        const apiRatings = {};
        const storageRatings = getRatingsFromStorage();

        data.answers.forEach((answer) => {
          // Prefer API rating if exists, otherwise check local storage
          if (answer.user_rating) {
            apiRatings[answer.answer_id] = answer.user_rating;
          } else if (storageRatings[answer.answer_id]) {
            apiRatings[answer.answer_id] = storageRatings[answer.answer_id];
          }
        });

        setUserRatings(apiRatings);
      } else {
        setError(data.message || "Failed to load question.");
      }
    } catch (err) {
      setError("Something went wrong while loading the question.");
    }
  };

  const [userRatings, setUserRatings] = useState({});

  useEffect(() => {
    fetchQuestion();
  }, [questionId]);

  const handleRateAnswer = async (answerId, rating) => {
    if (!token) {
      showMessage("Please login to rate answers", "error");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:7700/api/answers/${answerId}/rate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rating }),
        }
      );

      if (response.ok) {
        // Save to local storage
        saveRatingToStorage(answerId, rating);

        // Update the local state to reflect the new rating
        setUserRatings((prev) => ({
          ...prev,
          [answerId]: rating,
        }));

        // Update the answers to show the new average rating
        const data = await response.json();
        setAnswers((prevAnswers) =>
          prevAnswers.map((answer) =>
            answer.answer_id === answerId
              ? {
                  ...answer,
                  average_rating: data.average_rating || answer.average_rating,
                  rating_count: data.rating_count || answer.rating_count,
                }
              : answer
          )
        );

        showMessage("Rating submitted successfully!", "success");
      } else {
        const data = await response.json();
        showMessage(data.message || "Error submitting rating", "error");
      }
    } catch (err) {
      showMessage("Error submitting rating", "error");
    }
  };

  const handleAnswerSubmitted = () => {
    fetchQuestion();
    showMessage("Answer submitted successfully!", "success");
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDeleteAnswer = async (answerId) => {
    if (!window.confirm("Are you sure you want to delete this answer?")) return;

    try {
      const response = await fetch(
        `http://localhost:7700/api/answers/${answerId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        fetchQuestion();
        showMessage("Answer deleted successfully!", "success");
      } else {
        const data = await response.json();
        showMessage(data.message || "Error deleting answer", "error");
      }
    } catch (err) {
      showMessage("Error deleting answer", "error");
    }
  };

  const handleDeleteQuestion = async () => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;

    try {
      const response = await fetch(
        `http://localhost:7700/api/questions/${questionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        showMessage("Question deleted successfully!", "success");
        setTimeout(() => navigate(`/questions`), 2000);
      } else {
        showMessage("You are not authorized to delete this question.", "error");
      }
    } catch (err) {
      showMessage("Error deleting question", "error");
    }
  };

  const handleEditQuestion = () => {
    navigate(`/edit-question/${questionId}`);
  };

  const handleEditAnswer = (answerId) => {
    navigate(`/edit-answer/${answerId}`);
  };

  // Render star rating component
  // Render star rating component
  const StarRating = ({ answerId, averageRating, ratingCount }) => {
    const [hoverRating, setHoverRating] = useState(0);
    const userRating = userRatings[answerId] || 0; // Fixed typo: was userRating[answerId]

    // Convert to numbers safely
    const numericAverage =
      typeof averageRating === "number" ? averageRating : 0;
    const numericCount = typeof ratingCount === "number" ? ratingCount : 0;

    return (
      <div className={classes.ratingContainer}>
        <div className={classes.starRating}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => handleRateAnswer(answerId, star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className={classes.star}
            >
              {star <= (hoverRating || userRating) ? (
                <FaStar className={classes.filledStar} />
              ) : (
                <FaRegStar className={classes.emptyStar} />
              )}
            </span>
          ))}
        </div>
        {numericAverage > 0 && (
          <div className={classes.ratingInfo}>
            <span className={classes.averageRating}>
              {numericAverage.toFixed(1)}/5
            </span>
            <span className={classes.ratingCount}>({numericCount})</span>
          </div>
        )}
      </div>
    );
  };

  // Pagination Logic
  const totalPages = Math.ceil(answers.length / answersPerPage);
  const indexOfLastAnswer = currentPage * answersPerPage;
  const indexOfFirstAnswer = indexOfLastAnswer - answersPerPage;
  const currentAnswers = answers.slice(indexOfFirstAnswer, indexOfLastAnswer);

  if (error) return <p className={classes.error}>{error}</p>;
  if (!question) return <p>Loading...</p>;

  return (
    <div className={classes.singleQuestionWrapper}>
      <hr />
      <div className={classes.questionDetails}>
        <div className={classes.questionContainer}>
          <h1>Question</h1>
          <h4 className={classes.answers}>{question.title}</h4>
          <div className={classes.answers}>{question.description}</div>
          <div>
            <strong>Asked by:</strong> {question.user_name}
          </div>
        </div>

        {userId == question.user_id && (
          <div className={classes.actions}>
            <button onClick={handleEditQuestion} className={classes.editBt}>
              <FaEdit />
            </button>
            <button onClick={handleDeleteQuestion} className={classes.deleteBt}>
              <MdDelete />
            </button>
          </div>
        )}
      </div>

      {message && (
        <p
          className={`${classes.message} ${
            messageType === "success" ? classes.success : classes.error
          }`}
        >
          {message}
        </p>
      )}

      <hr />
      <h1>Answer From Community</h1>
      <hr />

      <div className={classes.answer}>
        {currentAnswers.length === 0 ? (
          <p>No answers yet. Be the first to answer!</p>
        ) : (
          currentAnswers.map((answer) => (
            <div key={answer.answer_id} className={classes.answerItems}>
              <div className={classes.profileContainer}>
                <img
                  src={person}
                  alt="profile"
                  className={classes.profileImage}
                />
                <p className={classes.userName}>{answer.user_name}</p>
              </div>
              <div className={classes.answerText}>
                <p>{answer.answer}</p>
                <StarRating
                  answerId={answer.answer_id}
                  averageRating={answer.average_rating || 0}
                  ratingCount={answer.rating_count || 0}
                />
              </div>

              {userId == answer.user_id && (
                <div className={classes.answerActions}>
                  <button
                    onClick={() => handleEditAnswer(answer.answer_id)}
                    className={classes.editBt}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteAnswer(answer.answer_id)}
                    className={classes.deleteBt}
                  >
                    <MdDelete />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className={classes.pagination}>
        {answers.length > answersPerPage && (
          <>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={classes.arrowButton}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className={classes.arrowButton}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </>
        )}
      </div>

      <AnswerForm onAnswerSubmitted={handleAnswerSubmitted} />
    </div>
  );
};

export default SingleQuestion;
