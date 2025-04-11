
import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import styles from "./style/QuestionAnswerList.module.css";
import { MdDelete } from "react-icons/md";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";

const QuestionAnswerList = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editedAnswer, setEditedAnswer] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchQuestionsWithAnswers = async () => {
      try {
        const [questionsRes, userRes] = await Promise.all([
          axiosInstance.get("/admin/question-full"),
          axiosInstance.get("/users/checkUser"),
        ]);

        setQuestions(questionsRes.data);

        if (userRes.data?.user) {
          // Check for user property
          setIsAdmin(userRes.data.user.is_admin === true);
          setCurrentUserId(userRes.data.user.user_id?.toString());

          // console.log("Current user:", {
          //   id: userRes.data.user.user_id,
          //   isAdmin: userRes.data.user.is_admin,
          // });
        }

        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchQuestionsWithAnswers();
  }, []);

  const handleEditClick = (answer) => {
    setEditingAnswerId(answer.answer_id);
    setEditedAnswer(answer.answer);
  };

  const handleCancelEdit = () => {
    setEditingAnswerId(null);
    setEditedAnswer("");
  };

  const handleSaveEdit = async (answerId) => {
    try {
      await axiosInstance.put(`/admin/answers/${answerId}`, {
        updatedAnswer: editedAnswer,
      });

      setQuestions(
        questions.map((question) => ({
          ...question,
          answers: question.answers.map((answer) =>
            answer.answer_id === answerId
              ? { ...answer, answer: editedAnswer }
              : answer
          ),
        }))
      );

      setEditingAnswerId(null);
      setEditedAnswer("");
    } catch (err) {
      console.error("Error updating answer:", err);
      alert("Failed to update answer: " + err.message);
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (!window.confirm("Are you sure you want to delete this answer?")) {
      return;
    }

    try {
      await axiosInstance.delete(`/admin/answers/${answerId}`);

      setQuestions(
        questions.map((question) => ({
          ...question,
          answers: question.answers.filter(
            (answer) => answer.answer_id !== answerId
          ),
        }))
      );

      alert("Answer deleted successfully!");
    } catch (err) {
      console.error("Error deleting answer:", err);
      alert("Failed to delete answer: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>Loading questions and answers...</div>
    );
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Questions and Answers</h1>

      {questions.length === 0 ? (
        <p className={styles.noQuestions}>No questions found.</p>
      ) : (
        <div>
          {questions.map((question) => (
            <div key={question.question_id} className={styles.questionCard}>
              <div>
                <div style={{ fontSize: "20px" }}>Questions</div>
                <h2 className={styles.questionTitle}>{question.title}</h2>
                <p className={styles.questionDescription}>
                  {question.description}
                </p>
                <div className={styles.metaInfo}>
                  <span>
                    Posted by: {question.posted_by.first_name}{" "}
                    {question.posted_by.last_name} (@
                    {question.posted_by.user_name})
                  </span>
                  <span className={styles.divider}>•</span>
                  <span>
                    {new Date(question.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className={styles.answersSection}>
                <h3 className={styles.answersHeader}>
                  {question.answers.length}{" "}
                  {question.answers.length === 1 ? "Answer" : "Answers"}
                </h3>

                {question.answers.length > 0 ? (
                  <div>
                    {question.answers.map((answer) => {
                      const answerOwnerId =
                        answer.posted_by?.user_id?.toString();
                      const isOwner =
                        currentUserId && answerOwnerId === currentUserId;
                      const showActions = isOwner || isAdmin;

                      return (
                        <div
                          key={answer.answer_id}
                          className={styles.answerCard}
                        >
                          <div className={styles.answerHeader}>
                            {editingAnswerId === answer.answer_id ? (
                              <>
                                <textarea
                                  className={styles.editTextarea}
                                  value={editedAnswer}
                                  onChange={(e) =>
                                    setEditedAnswer(e.target.value)
                                  }
                                />
                                <div className={styles.editButtons}>
                                  <button
                                    className={styles.SaveButton}
                                    onClick={() =>
                                      handleSaveEdit(answer.answer_id)
                                    }
                                  >
                                    Save
                                  </button>
                                  <button
                                    className={styles.CancelButton}
                                    onClick={handleCancelEdit}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </>
                            ) : (
                              <>
                                <p className={styles.answerText}>
                                  {answer.answer}
                                </p>
                                {showActions && (
                                  <div className={styles.buttonGroup}>
                                    <button
                                      className={styles.EditButton}
                                      onClick={() => handleEditClick(answer)}
                                    >
                                      <FaEdit />
                                    </button>
                                    <button
                                      className={styles.DeleteButton}
                                      onClick={() =>
                                        handleDeleteAnswer(answer.answer_id)
                                      }
                                    >
                                      <MdDelete />
                                    </button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                          <div className={styles.metaInfo}>
                            <span>
                              Answered by: {answer.posted_by.first_name}{" "}
                              {answer.posted_by.last_name} (@
                              {answer.posted_by.user_name})
                            </span>
                            <span className={styles.divider}>•</span>
                            <span>
                              {new Date(answer.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className={styles.noAnswers}>No answers yet.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionAnswerList;
