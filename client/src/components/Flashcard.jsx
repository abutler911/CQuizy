// src/components/Flashcard.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";

// Modern card container with optimized dimensions
const CardContainer = styled.div`
  margin: 2rem auto;
  max-width: 480px;
  width: 94%;
  height: 360px;
  position: relative;
  perspective: 1500px;
`;

// Base card face with shared properties and improved 3D transitions
const CardFace = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  backface-visibility: hidden;
  box-shadow: ${(props) =>
    props.$isActive
      ? "0 20px 30px rgba(0, 0, 0, 0.2), 0 8px 16px rgba(0, 0, 0, 0.1)"
      : "0 10px 20px rgba(0, 0, 0, 0.1)"};
  transform: ${(props) => (props.$isActive ? "rotateY(0)" : "rotateY(180deg)")};
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.38, 0.02, 0.09, 1.66),
    box-shadow 0.3s ease;
  pointer-events: ${(props) => (props.$isActive ? "auto" : "none")};
`;

// Front card with gradient
const CardFront = styled(CardFace)`
  background: linear-gradient(135deg, #2c3e50, #1a2a38);
  color: white;
  justify-content: space-between;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 80px;
    background: linear-gradient(
      to bottom,
      rgba(52, 152, 219, 0.15),
      transparent
    );
    z-index: 0;
  }
`;

// Back card with contrast gradient
const CardBack = styled(CardFace)`
  background: linear-gradient(135deg, #263545, #34495e);
  color: white;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  &::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 80px;
    background: linear-gradient(to top, rgba(52, 152, 219, 0.15), transparent);
    z-index: 0;
  }
`;

// Optimized content area with compact padding
const CardContent = styled.div`
  padding: 1.5rem;
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

// Compact header with metadata combined
const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

// Streamlined metadata area
const CardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// Compact category pill
const CategoryTag = styled.div`
  background: rgba(52, 152, 219, 0.8);
  color: white;
  padding: 0.3rem 0.7rem;
  border-radius: 12px;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.6px;
`;

// Efficient bookmark button
const BookmarkButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => (props.$active ? "#ff6b6b" : "rgba(255, 255, 255, 0.6)")};
  font-size: 1.25rem;
  padding: 0.3rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &:hover {
    color: ${(props) =>
      props.$active ? "#ff8787" : "rgba(255, 255, 255, 0.9)"};
    transform: scale(1.15)
      rotate(${(props) => (props.$active ? "0deg" : "10deg")});
  }

  &:active {
    transform: scale(0.95);
  }
`;

// Combined context pill that appears in-line with category
const ContextPill = styled.div`
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.65rem;
  padding: 0.3rem 0.7rem;
  border-radius: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
  font-style: italic;
`;

// Minimal divider
const Divider = styled.hr`
  border: none;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0.7rem 0;
`;

// Streamlined question text with better sizing
const QuestionText = styled.div`
  font-size: 1.3rem;
  font-weight: 500;
  color: white;
  line-height: 1.5;
  margin: 0.75rem 0;
  flex-grow: 1;
  position: relative;
  z-index: 1;
  font-family: "Inter", "Segoe UI", system-ui, sans-serif;
  overflow-y: auto;
  padding-right: 0.5rem;

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }
`;

// Refined answer text
const AnswerText = styled.div`
  font-size: 1.3rem;
  color: white;
  font-weight: 500;
  text-align: center;
  line-height: 1.5;
  position: relative;
  z-index: 1;
  max-width: 94%;
  max-height: 80%;
  overflow-y: auto;
  font-family: "Inter", "Segoe UI", system-ui, sans-serif;

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }

  &::before,
  &::after {
    content: '"';
    display: inline;
    color: rgba(52, 152, 219, 0.4);
    font-size: 1.5em;
    line-height: 0;
    vertical-align: -0.3em;
    margin: 0 0.1em;
  }
`;

// Compact footer
const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 0.5rem;
`;

// Minimalist question counter
const QuestionCounter = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.7rem;
  font-weight: 500;
`;

// Compact navigation controls
const NavControls = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const NavButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.8rem;

  &:hover {
    background: rgba(52, 152, 219, 0.7);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(0);
    }
  }
`;

// Subtle flip hint
const FlipHint = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0.25rem 0.5rem;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.15);

  i {
    font-size: 0.7rem;
    animation: pulse 1.5s infinite ease-in-out;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.5;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.1);
    }
  }
`;

// Progress bar component
const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: rgba(52, 152, 219, 0.6);
  width: ${(props) => (props.$progress || 0) * 100}%;
  transition: width 0.4s ease;
`;

const Flashcard = ({
  question,
  onNext,
  onPrevious,
  onBookmark,
  isBookmarked,
  currentIndex,
  totalQuestions,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const progress = (currentIndex + 1) / totalQuestions;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalQuestions - 1;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Reset flip state when the question changes
  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName))
        return;

      switch (event.key) {
        case "ArrowLeft":
          if (!isFirst) onPrevious();
          break;
        case "ArrowRight":
          if (!isLast) onNext();
          break;
        case " ":
          event.preventDefault();
          handleFlip();
          break;
        case "b":
        case "B":
          onBookmark();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onNext, onPrevious, onBookmark, isFirst, isLast]);

  return (
    <CardContainer>
      <CardFront $isActive={!isFlipped} onClick={handleFlip}>
        <CardContent>
          <CardHeader>
            <CardMeta>
              <CategoryTag>{question.category}</CategoryTag>
              {question.context && (
                <ContextPill>{question.context}</ContextPill>
              )}
            </CardMeta>

            <BookmarkButton
              $active={isBookmarked}
              onClick={(e) => {
                e.stopPropagation();
                onBookmark();
              }}
            >
              <i className="fas fa-bookmark" />
            </BookmarkButton>
          </CardHeader>

          <Divider />

          <QuestionText>{question.question}</QuestionText>

          <CardFooter>
            <QuestionCounter>
              {currentIndex + 1} / {totalQuestions}
            </QuestionCounter>

            <NavControls>
              <NavButton
                onClick={(e) => {
                  e.stopPropagation();
                  onPrevious();
                }}
                disabled={isFirst}
              >
                <i className="fas fa-chevron-left" />
              </NavButton>

              <NavButton
                onClick={(e) => {
                  e.stopPropagation();
                  onNext();
                }}
                disabled={isLast}
              >
                <i className="fas fa-chevron-right" />
              </NavButton>
            </NavControls>
          </CardFooter>

          <FlipHint>
            <i className="fas fa-sync-alt"></i>
            Tap for answer
          </FlipHint>
        </CardContent>

        <ProgressBar $progress={progress} />
      </CardFront>

      <CardBack $isActive={isFlipped} onClick={handleFlip}>
        <AnswerText>{question.answer}</AnswerText>

        <FlipHint>
          <i className="fas fa-sync-alt"></i>
          Tap to return
        </FlipHint>

        <ProgressBar $progress={progress} />
      </CardBack>
    </CardContainer>
  );
};

export default Flashcard;
