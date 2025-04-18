// src/pages/Flashcards.jsx - Mobile-optimized version
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

// Use viewport height to ensure the container fits on screen
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - 60px); /* Adjust based on header height */
  padding: ${(props) => props.theme.spacing?.sm || "0.5rem"};
  position: relative;
  overflow: hidden;
`;

// Compact version of progress bar
const ProgressBarWrapper = styled.div`
  height: 4px;
  width: 90%;
  max-width: 370px;
  margin-bottom: ${(props) => props.theme.spacing?.xs || "0.25rem"};
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

// Smaller font and margin
const QuestionCounter = styled.div`
  font-size: ${(props) => props.theme.fontSizes?.xs || "0.75rem"};
  margin-bottom: ${(props) => props.theme.spacing?.xs || "0.25rem"};
  color: ${(props) => props.theme.colors?.textSecondary || "inherit"};
`;

// More compact search bar
const InputGroup = styled.div`
  display: flex;
  max-width: 370px;
  width: 100%;
  margin-bottom: ${(props) => props.theme.spacing?.sm || "0.5rem"};

  input {
    flex: 1;
    padding: ${(props) => props.theme.spacing?.xs || "0.25rem"};
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
    height: 32px;
  }

  button {
    padding: 0 ${(props) => props.theme.spacing?.xs || "0.5rem"};
    background-color: ${(props) => props.theme.colors?.accent || "#007bff"};
    color: white;
    border: none;
    border-radius: ${(props) =>
      `0 ${props.theme.borderRadius?.sm || "4px"} ${
        props.theme.borderRadius?.sm || "4px"
      } 0`};
    transition: background-color
      ${(props) => props.theme.transitions?.fast || "0.2s ease"};
  }
`;

// Position the control panel at the bottom
const ControlPanel = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
`;

// Smaller shuffle button
const ShuffleButton = styled.button`
  background-color: ${(props) => props.theme.colors?.success || "#2ecc71"};
  color: white;
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  font-size: ${(props) => props.theme.fontSizes?.md || "1rem"};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions?.medium || "0.3s ease"};
  box-shadow: ${(props) =>
    props.theme.colors?.cardShadow || "0 2px 6px rgba(0, 0, 0, 0.2)"};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(-1px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  }
`;

// More compact swipe instructions
const SwipeInstructions = styled.div`
  font-size: ${(props) => props.theme.fontSizes?.xs || "0.7rem"};
  color: ${(props) => props.theme.colors?.textSecondary || "inherit"};
  text-align: center;
  margin-top: ${(props) => props.theme.spacing?.xs || "0.25rem"};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  background: rgba(0, 0, 0, 0.05);
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  animation: fadeIn 1s ease, pulse 2s infinite;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.03);
    }
  }

  i {
    font-size: 0.7rem;
    animation: arrowSwipe 2s infinite;
  }

  i.fa-arrow-left {
    animation: arrowSwipeLeft 2s infinite;
  }

  i.fa-arrow-right {
    animation: arrowSwipeRight 2s infinite;
  }

  @keyframes arrowSwipeLeft {
    0%,
    100% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(-3px);
    }
  }

  @keyframes arrowSwipeRight {
    0%,
    100% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(3px);
    }
  }
`;

// More compact alert boxes
const AlertBox = styled.div`
  padding: ${(props) => props.theme.spacing?.sm || "0.5rem"};
  border-radius: ${(props) => props.theme.borderRadius?.md || "8px"};
  margin-bottom: ${(props) => props.theme.spacing?.sm || "0.5rem"};
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
    props.theme.colors?.cardShadow || "0 1px 3px rgba(0, 0, 0, 0.1)"};
  font-size: ${(props) => props.theme.fontSizes?.sm || "0.85rem"};
`;

// Smaller loading spinner
const LoadingSpinner = styled.div`
  width: 2rem;
  height: 2rem;
  border: 3px solid
    ${(props) => props.theme.colors?.border || "rgba(0, 0, 0, 0.1)"};
  border-radius: 50%;
  border-top: 3px solid ${(props) => props.theme.colors?.primary || "#3498db"};
  animation: spin 1s linear infinite;
  margin: 1rem 0;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// Main component - mostly unchanged but ensure it uses all screen space efficiently
const Flashcards = () => {
  const [questions, setQuestions] = useState([]);
  const [fullQuestionSet, setFullQuestionSet] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSwipeGuide, setShowSwipeGuide] = useState(true);

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

  // Hide swipe guide after first card transition or after 4 seconds (reduced from 6)
  useEffect(() => {
    if (currentQuestionIndex > 0) {
      setShowSwipeGuide(false);
    } else {
      const timer = setTimeout(() => {
        setShowSwipeGuide(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [currentQuestionIndex]);

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
            placeholder="Search..."
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
          <>
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

            {showSwipeGuide && (
              <SwipeInstructions>
                <i className="fas fa-arrow-left"></i>
                Swipe to navigate
                <i className="fas fa-arrow-right"></i>
              </SwipeInstructions>
            )}
          </>
        )}

        <ControlPanel>
          <ShuffleButton onClick={handleShuffle}>
            <i className="fas fa-random"></i>
          </ShuffleButton>
        </ControlPanel>
      </Container>
    </>
  );
};

export default Flashcards;
