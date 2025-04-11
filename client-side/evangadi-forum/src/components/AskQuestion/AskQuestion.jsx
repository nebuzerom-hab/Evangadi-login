import React, { useState } from "react";
import styles from "./AskQuestion.module.css";
import { useNavigate } from "react-router";

const AskQuestion = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title || !formData.description) {
      setError("Both title and description are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:7700/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/questions");
      } else {
        setError(data.msg || "Something went wrong.");
      }
    } catch (err) {
      console.error("Error submitting question:", err);
      setError("Failed to submit question. Try again later.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.instructionBox}>
        <h2>
          Steps To Write <span className={styles.highlight}>A Good</span>{" "}
          Question.
        </h2>
        <ul className={styles.instructions}>
          <li>🔹 Summarize your problems in a one-line-title.</li>
          <li>🔹 Describe your problem in more detail.</li>
          <li>🔹 Describe what you tried and what you expected to happen.</li>
          <li>🔹 Review your question and post it here.</li>
        </ul>
      </div>

      <h3 className={styles.formTitle}>Post Your Question</h3>

      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Question title"
          value={formData.title}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Question detail ..."
          rows={6}
          value={formData.description}
          onChange={handleChange}
        ></textarea>

        <button className={styles.buttons} type="submit">
          Post Question
        </button>
      </form>
    </div>
  );
};

export default AskQuestion;
