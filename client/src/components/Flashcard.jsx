// src/components/Flashcard.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";

// Modern card container with improved dimensions and positioning
const CardContainer = styled.div`
  margin: 3rem auto;
  max-width: 500px;
  width: 92%;
  height: 420px;
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
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  backface-visibility: hidden;
  box-shadow: ${(props) =>
    props.$isActive
      ? "0 22px 40px rgba(0, 0, 0, 0.25), 0 8px 16px rgba(0, 0, 0, 0.15)"
      : "0 10px 30px rgba(0, 0, 0, 0.1)"};
  transform: ${(props) => (props.$isActive ? "rotateY(0)" : "rotateY(180deg)")};
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.38, 0.02, 0.09, 1.66),
    box-shadow 0.3s ease;
  pointer-events: ${(props) => (props.$isActive ? "auto" : "none")};
`;

// Front card with gradient and improved visual hierarchy
const CardFront = styled(CardFace)`
  background: linear-gradient(to bottom, #2c3e50, #1a2a38);
  color: white;
  justify-content: space-between;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 130px;
    background: linear-gradient(
      to bottom,
      rgba(52, 152, 219, 0.2),
      transparent
    );
    z-index: 0;
  }
`;

// Back card with improved gradient and focus on the answer
const CardBack = styled(CardFace)`
  background: linear-gradient(to bottom, #263545, #34495e);
  color: white;
  align-items: center;
  justify-content: center;
  padding: 2.5rem;

  &::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(to top, rgba(52, 152, 219, 0.15), transparent);
    z-index: 0;
  }
`;

// Improved content area with better padding and structural layout
const CardContent = styled.div`
  padding: 2rem;
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

// Enhanced header with improved spacing
const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`;

// More vibrant category tag with refined styling
const CategoryTag = styled.div`
  background: rgba(52, 152, 219, 0.9);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 24px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  box-shadow: 0 3px 12px rgba(52, 152, 219, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 14px rgba(52, 152, 219, 0.4);
  }
`;

// Improved bookmark button with better interaction
const BookmarkButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => (props.$active ? "#ff6b6b" : "rgba(255, 255, 255, 0.6)")};
  font-size: 1.4rem;
  padding: 0.5rem;
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

// Context info with improved readability and style
const ContextInfo = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0.75rem 0;
  font-style: italic;
  background: rgba(255, 255, 255, 0.07);
  padding: 0.7rem 1rem;
  border-radius: 8px;
  backdrop-filter: blur(2px);
  border-left: 3px solid rgba(52, 152, 219, 0.6);

  strong {
    font-weight: 700;
    color: rgba(255, 255, 255, 0.9);
    margin-right: 5px;
    font-style: normal;
  }
`;

// Subtle divider with animation
const Divider = styled.hr`
  border: none;
  height: 2px;
  background: linear-gradient(
    to right,
    transparent,
    rgba(255, 255, 255, 0.15),
    transparent
  );
  margin: 1.2rem 0;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 2px;
    background: rgba(52, 152, 219, 0.7);
  }
`;

// Enhanced question text with better typography
const QuestionText = styled.div`
  font-size: 1.5rem;
  font-weight: 500;
  color: white;
  line-height: 1.6;
  margin: 1.5rem 0;
  flex-grow: 1;
  position: relative;
  z-index: 1;
  font-family: "Inter", "Segoe UI", system-ui, sans-serif;
  letter-spacing: -0.01em;

  &::first-letter {
    font-size: 1.7rem;
    font-weight: 600;
  }
`;

// Answer text with improved typography and focus
const AnswerText = styled.div`
  font-size: 1.5rem;
  color: white;
  font-weight: 500;
  text-align: center;
  line-height: 1.7;
  position: relative;
  z-index: 1;
  max-width: 90%;
  font-family: "Inter", "Segoe UI", system-ui, sans-serif;
  letter-spacing: -0.01em;

  &::before {
    content: '"';
    display: block;
    font-size: 3rem;
    line-height: 0.5;
    color: rgba(52, 152, 219, 0.4);
    margin-bottom: 1rem;
  }

  &::after {
    content: '"';
    display: block;
    font-size: 3rem;
    line-height: 0.5;
    color: rgba(52, 152, 219, 0.4);
    margin-top: 1rem;
  }
`;

// Improved footer with better positioning
const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 1rem;
`;

// Enhanced question number indicator
const QuestionNumber = styled.div`
  background: rgba(52, 152, 219, 0.15);
  color: rgba(255, 255, 255, 0.9);
  padding: 0.35rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  font-weight: 600;
  letter-spacing: 0.5px;

  &::before {
    content: "#";
    margin-right: 4px;
    font-weight: 700;
    color: rgba(52, 152, 219, 0.8);
  }
`;

// Navigation controls
const NavControls = styled.div`
  display: flex;
  gap: 1rem;
`;

const NavButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;

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

// Improved flip hint with better animation
const FlipHint = styled.div`
  position: absolute;
  bottom: 1.2rem;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0, 0, 0, 0.15);
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  backdrop-filter: blur(2px);

  i {
    animation: flipPulse 2s infinite ease-in-out;
  }

  @keyframes flipPulse {
    0% {
      opacity: 0.5;
      transform: rotate(0deg);
    }
    50% {
      opacity: 1;
      transform: rotate(180deg);
    }
    100% {
      opacity: 0.5;
      transform: rotate(360deg);
    }
  }
`;

// Progress bar component
const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  background: rgba(52, 152, 219, 0.5);
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
            <CategoryTag>{question.category}</CategoryTag>

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

          {question.context && (
            <ContextInfo>
              <strong>Context:</strong> {question.context}
            </ContextInfo>
          )}

          <Divider />

          <QuestionText>{question.question}</QuestionText>

          <CardFooter>
            <QuestionNumber>
              {currentIndex + 1} of {totalQuestions}
            </QuestionNumber>

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
            Tap to reveal answer
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
