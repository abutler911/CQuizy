// src/pages/Flashcards.jsx
import { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import Flashcard from "../components/Flashcard";
import { questionService } from "../services/api";

const STORAGE_VERSION = "1.0";
const STORAGE_KEYS = {
  BOOKMARKS: "cquizy_bookmarks",
  LAST_POSITION: "cquizy_lastPosition",
  VERSION: "cquizy_version",
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${(props) => props.theme.spacing?.md || "1rem"};
`;

const ProgressBarWrapper = styled.div`
  height: 8px;
  width: 90%;
  max-width: 370px;
  margin-bottom: ${(props) => props.theme.spacing?.sm || "0.5rem"};
  background-color: ${(props) =>
    props.theme.colors?.text === "#333333" ? "#d0d0d0" : "#e0e0e0"};
  border-radius: ${(props) => props.theme.borderRadius?.sm || "4px"};
  overflow: hidden;
  transition: background-color
    ${(props) => props.theme.transitions?.medium || "0.3s ease"};
`;

const ProgressBar = styled.div`
  height: 100%;
  background-color: ${(props) => props.theme.colors?.success || "#28a745"};
  transition: width 0.3s ease,
    background-color
      ${(props) => props.theme.transitions?.medium || "0.3s ease"};
`;

const QuestionCounter = styled.div`
  font-size: ${(props) => props.theme.fontSizes?.sm || "0.9rem"};
  margin-bottom: ${(props) => props.theme.spacing?.md || "1rem"};
  color: ${(props) => props.theme.colors?.textSecondary || "inherit"};
`;

const InputGroup = styled.div`
  display: flex;
  max-width: 370px;
  width: 100%;
  margin-bottom: ${(props) => props.theme.spacing?.lg || "1.5rem"};

  input {
    flex: 1;
    padding: ${(props) => props.theme.spacing?.sm || "0.5rem"};
    border: 1px solid ${(props) => props.theme.colors?.border || "#ccc"};
    border-radius: ${(props) =>
      `${props.theme.borderRadius?.sm || "4px"} 0 0 ${
        props.theme.borderRadius?.sm || "4px"
      }`};
    background-color: ${(props) =>
      props.theme.colors?.inputBackground || "white"};
    color: ${(props) => props.theme.colors?.text || "inherit"};
    transition: background-color
        ${(props) => props.theme.transitions?.fast || "0.2s ease"},
      border-color ${(props) => props.theme.transitions?.fast || "0.2s ease"},
      color ${(props) => props.theme.transitions?.fast || "0.2s ease"};
  }

  button {
    padding: 0 ${(props) => props.theme.spacing?.sm || "0.75rem"};
    background-color: ${(props) => props.theme.colors?.accent || "#007bff"};
    color: ${(props) =>
      props.theme.colors?.text === "#333333" &&
      props.theme.colors?.accent === "#fff"
        ? "#333"
        : "#fff"};
    border: none;
    border-radius: ${(props) =>
      `0 ${props.theme.borderRadius?.sm || "4px"} ${
        props.theme.borderRadius?.sm || "4px"
      } 0`};
    transition: background-color
      ${(props) => props.theme.transitions?.fast || "0.2s ease"};
  }
`;

const ControlPanel = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: ${(props) => props.theme.spacing?.xl || "2rem"};
  gap: ${(props) => props.theme.spacing?.lg || "1.5rem"};
  flex-wrap: wrap;
`;

const ControlButton = styled.button`
  background-color: ${(props) => props.theme.colors?.primary || "#3498db"};
  color: ${(props) =>
    props.theme.colors?.text === "#333333" &&
    props.theme.colors?.primary === "#fff"
      ? "#333"
      : "white"};
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: ${(props) => props.theme.fontSizes?.md || "1.1rem"};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions?.medium || "0.3s ease"};
  box-shadow: ${(props) =>
    props.theme.colors?.cardShadow || "0 4px 10px rgba(0, 0, 0, 0.2)"};

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.25);
    background-color: ${(props) =>
      props.theme.colors?.primaryDark || "#2980b9"};
  }

  &:active {
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    background-color: ${(props) =>
      props.theme.colors?.text === "#333333" ? "#d0d0d0" : "#95a5a6"};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    opacity: 0.7;
  }
`;

const ShuffleButton = styled(ControlButton)`
  background-color: ${(props) => props.theme.colors?.success || "#2ecc71"};
  width: 60px;
  height: 60px;
  font-size: ${(props) => props.theme.fontSizes?.lg || "1.2rem"};

  &:hover {
    background-color: ${(props) =>
      props.theme.colors?.successDark || "#27ae60"};
  }
`;

const AlertBox = styled.div`
  padding: ${(props) => props.theme.spacing?.md || "1rem"};
  border-radius: ${(props) => props.theme.borderRadius?.md || "8px"};
  margin-bottom: ${(props) => props.theme.spacing?.lg || "1.5rem"};
  text-align: center;
  background-color: ${(props) =>
    props.$type === "danger"
      ? props.theme.colors?.text === "#333333"
        ? "#f8d7da"
        : "#dc3545"
      : props.theme.colors?.text === "#333333"
      ? "#d1ecf1"
      : "#17a2b8"};
  color: ${(props) =>
    props.$type === "danger"
      ? props.theme.colors?.text === "#333333"
        ? "#721c24"
        : "white"
      : props.theme.colors?.text === "#333333"
      ? "#0c5460"
      : "white"};
  box-shadow: ${(props) =>
    props.theme.colors?.cardShadow || "0 2px 5px rgba(0, 0, 0, 0.1)"};
`;

const LoadingSpinner = styled.div`
  width: 3rem;
  height: 3rem;
  border: 4px solid
    ${(props) => props.theme.colors?.border || "rgba(0, 0, 0, 0.1)"};
  border-radius: 50%;
  border-top: 4px solid ${(props) => props.theme.colors?.primary || "#3498db"};
  animation: spin 1s linear infinite;
  margin: 2rem 0;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Flashcards = () => {
  const [questions, setQuestions] = useState([]);
  const [fullQuestionSet, setFullQuestionSet] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true);
        const savedBookmarks = getFromStorage(STORAGE_KEYS.BOOKMARKS, []);
        setBookmarkedQuestions(savedBookmarks);
        const data = await questionService.getAllQuestions();
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("No questions available or incorrect format.");
        }
        setQuestions(data);
        setFullQuestionSet(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    initializeApp();
  }, []);

  const getFromStorage = (key, defaultValue = null) => {
    try {
      const version = localStorage.getItem(STORAGE_KEYS.VERSION);
      if (version !== STORAGE_VERSION) {
        localStorage.clear();
        localStorage.setItem(STORAGE_KEYS.VERSION, STORAGE_VERSION);
        return defaultValue;
      }
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1)
      setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handleShuffle = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentQuestionIndex(0);
  };

  const handleToggleBookmark = () => {
    const id = questions[currentQuestionIndex]._id;
    setBookmarkedQuestions((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((qid) => qid !== id)
        : [...prev, id];
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
      return updated;
    });
  };

  const progress =
    questions.length > 0
      ? ((currentQuestionIndex + 1) / questions.length) * 100
      : 0;

  const handleSearch = () => {
    if (!searchTerm) return setQuestions(fullQuestionSet);
    const term = searchTerm.toLowerCase();
    const filtered = fullQuestionSet.filter(
      (q) =>
        q.question.toLowerCase().includes(term) ||
        q.answer.toLowerCase().includes(term) ||
        q.category.toLowerCase().includes(term)
    );
    setQuestions(filtered);
    setCurrentQuestionIndex(0);
  };

  return (
    <>
      <Header title="Flashcards" />
      <Container>
        <Navigation />
        <ProgressBarWrapper>
          <ProgressBar style={{ width: `${progress}%` }} />
        </ProgressBarWrapper>
        <QuestionCounter>
          {questions.length
            ? `${currentQuestionIndex + 1} of ${questions.length}`
            : ""}
        </QuestionCounter>
        <InputGroup>
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button onClick={handleSearch}>
            <i className="fas fa-search"></i>
          </button>
        </InputGroup>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <AlertBox $type="danger">{error}</AlertBox>
        ) : questions.length === 0 ? (
          <AlertBox $type="info">No questions found</AlertBox>
        ) : (
          <Flashcard
            question={questions[currentQuestionIndex]}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onBookmark={handleToggleBookmark}
            isBookmarked={bookmarkedQuestions.includes(
              questions[currentQuestionIndex]._id
            )}
            currentIndex={currentQuestionIndex}
            totalQuestions={questions.length}
          />
        )}

        <ControlPanel>
          <ControlButton
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <i className="fas fa-chevron-left"></i>
          </ControlButton>
          <ShuffleButton onClick={handleShuffle}>
            <i className="fas fa-random"></i>
          </ShuffleButton>
          <ControlButton
            onClick={handleNext}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            <i className="fas fa-chevron-right"></i>
          </ControlButton>
        </ControlPanel>
      </Container>
    </>
  );
};

export default Flashcards;
