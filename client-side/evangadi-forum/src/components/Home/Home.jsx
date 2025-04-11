import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import { appState } from "../../App";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import profile from "../../assets/image/account.png";

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const { user } = useContext(appState);

  // console.log(user);
  const token = localStorage.getItem("token");
  console.log(token);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          "http://localhost:7700/api/questions/all-questions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        setQuestions(data.questions || []);
      } catch (err) {
        console.error("Error fetching questions", err);
        setError("Something went wrong while loading questions.");
      }
    };

    if (token) {
      fetchQuestions();
    }
  }, [token]);

  const questionsPerPage = 4;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const startIndex = currentPage * questionsPerPage;
  const paginatedQuestions = questions.slice(
    startIndex,
    startIndex + questionsPerPage
  );
  const hasNextPage = currentPage + 1 < totalPages;
  const hasPreviousPage = currentPage > 0;

  const nextPage = () => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const previousPage = () => {
    if (hasPreviousPage) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className={styles.homeWrapper}>
      <div className={styles.topRow}>
        <Link to="/ask-question">
          <button className={styles.askButton}>Ask Question</button>
        </Link>
        <span className={styles.welcome}>
          Welcome:{" "}
          <span className={styles.userName}>
            {user?.user?.username || "Loading..."}
          </span>
        </span>
      </div>

      <input
        type="text"
        placeholder="Search question"
        className={styles.searchBar}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.questionList}>
        {paginatedQuestions.length === 0 && !error && (
          <p className={styles.noQuestions}>No questions available yet.</p>
        )}

        {paginatedQuestions
          .filter((q) =>
            q.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((q) => (
            <Link to={`/questions/${q.question_id}`} key={q.question_id}>
              <div className={styles.questionItem}>
                <div>
                  <div className={styles.userIcon}>
                    <img src={profile} alt="User" />
                  </div>
                  <p className={styles.username}>{q.user_name}</p>
                </div>
                <div className={styles.questionDetails}>
                  <p className={styles.questionTitle}>{q.title}</p>
                  <p className={styles.questionDescription}>{q.description}</p>
                </div>
                <div className={styles.arrow}>
                  <FaAngleRight />
                </div>
              </div>
            </Link>
          ))}
      </div>

      {/* Pagination Buttons with Current Page and Total Pages Indicator */}
      <div className={styles.pagination}>
        <button
          onClick={previousPage}
          className={styles.arrowButton}
          disabled={!hasPreviousPage}
        >
          Previous
        </button>
        <span className={styles.pageIndicator}>
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={nextPage}
          className={styles.arrowButton}
          disabled={!hasNextPage}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
