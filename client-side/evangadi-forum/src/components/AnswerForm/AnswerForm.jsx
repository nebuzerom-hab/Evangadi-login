import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import classes from "./AnswerForm.module.css";

const AnswerForm = ({
  onAnswerSubmitted,
  answers,
  onAnswerDeleted,
  onAnswerUpdated,
}) => {
  const [answer, setAnswer] = useState("");
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editAnswerText, setEditAnswerText] = useState("");
  const { questionId } = useParams();
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!answer.trim()) {
      return alert("Please provide a valid answer.");
    }

    try {
      const response = await fetch(
        `http://localhost:7700/api/questions/${questionId}/answers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ answer }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        onAnswerSubmitted();
        setAnswer("");
      } else {
        alert(data.message || "Error submitting answer");
      }
    } catch (err) {
      console.error("Error submitting answer:", err);
      alert("Something went wrong while submitting your answer.");
    }
  };

  const handleEditAnswer = (answer) => {
    setEditingAnswerId(answer.answer_id);
    setEditAnswerText(answer.answer);
  };

  const handleUpdateAnswer = async () => {
    if (!editAnswerText.trim()) {
      return alert("Answer cannot be empty");
    }

    try {
      const response = await fetch(
        `http://localhost:7700/api/answers/${editingAnswerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ updatedAnswer: editAnswerText }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        onAnswerUpdated();
        setEditingAnswerId(null);
        setEditAnswerText("");
      } else {
        alert(data.message || "Error updating answer");
      }
    } catch (err) {
      console.error("Error updating answer:", err);
      alert("Something went wrong while updating your answer.");
    }
  };

  const cancelEdit = () => {
    setEditingAnswerId(null);
    setEditAnswerText("");
  };

  const handleDeleteAnswer = async (answerId) => {
    if (!window.confirm("Are you sure you want to delete this answer?")) {
      return;
    }

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

      const data = await response.json();

      if (response.ok) {
        onAnswerDeleted();
      } else {
        alert(data.message || "Error deleting answer");
      }
    } catch (err) {
      console.error("Error deleting answer:", err);
      alert("Something went wrong while deleting your answer.");
    }
  };

  return (
    <section className={classes.answerFormWrapper}>
      <h1>Answer The Top Question</h1>
      <Link rel="stylesheet" href=" ">
        <p className={classes.page}>Go to Question page</p>
      </Link>
      <form className={classes.form} onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="your answer ..."
          required
        />
        <button className={classes.btn} type="submit">
          Submit Answer
        </button>
      </form>

      {/* Combined answers display section */}
      {answers && answers.length > 0 && (
        <div className={classes.answersList}>
          <h2>Existing Answers</h2>
          {answers.map((ans) => (
            <div key={ans.answer_id} className={classes.answerItem}>
              {editingAnswerId === ans.answer_id ? (
                <div className={classes.editForm}>
                  <textarea
                    value={editAnswerText}
                    onChange={(e) => setEditAnswerText(e.target.value)}
                    className={classes.editTextarea}
                  />
                  <div className={classes.editButtons}>
                    <button
                      onClick={handleUpdateAnswer}
                      className={classes.saveBtn}
                    >
                      Save
                    </button>
                    <button onClick={cancelEdit} className={classes.cancelBtn}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p>{ans.answer}</p>
                  <div className={classes.answerActions}>
                    <button
                      onClick={() => handleEditAnswer(ans)}
                      className={classes.editBtn}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteAnswer(ans.answer_id)}
                      className={classes.deleteBtn}
                    >
                      <MdDelete />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default AnswerForm;
