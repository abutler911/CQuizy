// src/components/Flashcard.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";

const CardContainer = styled.div`
  margin: 2rem auto;
  max-width: 450px;
  width: 90%;
  height: 380px;
  position: relative;
`;

const CardFace = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: ${(props) => props.theme.borderRadius?.lg || "16px"};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: ${(props) =>
    props.theme.colors?.cardShadow || "0 15px 35px rgba(0, 0, 0, 0.2)"};
  transition: opacity
    ${(props) => props.theme.transitions?.medium || "0.3s ease"};
  opacity: ${(props) => (props.$isActive ? 1 : 0)};
  z-index: ${(props) => (props.$isActive ? 2 : 1)};
  pointer-events: ${(props) => (props.$isActive ? "auto" : "none")};
`;

const CardFront = styled(CardFace)`
  background: ${(props) => props.theme.colors?.cardBackground || "#2c3e50"};
  color: ${(props) =>
    props.theme.colors?.text === "#333333" ? "#333333" : "white"};
  justify-content: space-between;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(
      to bottom,
      ${(props) =>
        `${props.theme.colors?.primary || "rgba(52, 152, 219, 0.3)"}30`},
      transparent
    );
    z-index: 0;
  }
`;

const CardBack = styled(CardFace)`
  background: ${(props) => props.theme.colors?.inputBackground || "#34495e"};
  color: ${(props) =>
    props.theme.colors?.text === "#333333" ? "#333333" : "white"};
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
    background: linear-gradient(
      to top,
      ${(props) =>
        `${props.theme.colors?.primary || "rgba(52, 152, 219, 0.2)"}30`},
      transparent
    );
    z-index: 0;
  }
`;

const CardContent = styled.div`
  padding: ${(props) => props.theme.spacing?.lg || "1.75rem"};
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${(props) => props.theme.spacing?.sm || "0.5rem"};
`;

const CategoryTag = styled.div`
  background: ${(props) =>
    `${props.theme.colors?.primary || "rgba(52, 152, 219, 0.9)"}e6`};
  color: ${(props) =>
    props.theme.colors?.text === "#333333" ? "#333333" : "white"};
  padding: 0.4rem 0.8rem;
  border-radius: ${(props) => props.theme.borderRadius?.pill || "20px"};
  font-size: ${(props) => props.theme.fontSizes?.xs || "0.75rem"};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const BookmarkButton = styled.button`
  background: none;
  border: none;
  color: ${(props) =>
    props.$active
      ? "#e74c3c"
      : props.theme.colors?.text === "#333333"
      ? "rgba(0, 0, 0, 0.5)"
      : "rgba(255, 255, 255, 0.5)"};
  font-size: ${(props) => props.theme.fontSizes?.lg || "1.25rem"};
  padding: ${(props) => props.theme.spacing?.sm || "0.5rem"};
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions?.fast || "0.2s ease"};

  &:hover {
    color: ${(props) =>
      props.$active
        ? "#e74c3c"
        : props.theme.colors?.text === "#333333"
        ? "rgba(0, 0, 0, 0.8)"
        : "rgba(255, 255, 255, 0.8)"};
    transform: scale(1.1);
  }
`;

const ContextInfo = styled.div`
  font-size: ${(props) => props.theme.fontSizes?.xs || "0.7rem"};
  color: ${(props) =>
    props.theme.colors?.textMuted || "rgba(255, 255, 255, 0.6)"};
  margin: ${(props) => props.theme.spacing?.sm || "0.75rem"} 0;
  font-style: italic;
  background: ${(props) =>
    props.theme.colors?.text === "#333333"
      ? "rgba(0, 0, 0, 0.05)"
      : "rgba(255, 255, 255, 0.05)"};
  padding: 0.5rem 0.75rem;
  border-radius: ${(props) => props.theme.borderRadius?.sm || "6px"};

  strong {
    font-weight: 600;
    color: ${(props) =>
      props.theme.colors?.textSecondary || "rgba(255, 255, 255, 0.8)"};
    margin-right: 4px;
    font-style: normal;
  }
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background: ${(props) =>
    props.theme.colors?.border || "rgba(255, 255, 255, 0.1)"};
  margin: ${(props) => props.theme.spacing?.md || "1rem"} 0;
`;

const QuestionText = styled.div`
  font-size: ${(props) => props.theme.fontSizes?.lg || "1.3rem"};
  font-weight: 500;
  color: ${(props) =>
    props.theme.colors?.text === "#333333" ? "#333333" : "white"};
  line-height: 1.5;
  margin: ${(props) => props.theme.spacing?.md || "1rem"} 0;
  flex-grow: 1;
  position: relative;
  z-index: 1;
`;

const AnswerText = styled.div`
  font-size: ${(props) => props.theme.fontSizes?.lg || "1.3rem"};
  color: ${(props) =>
    props.theme.colors?.text === "#333333" ? "#333333" : "white"};
  font-weight: 500;
  text-align: center;
  line-height: 1.6;
  position: relative;
  z-index: 1;
  max-width: 90%;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: auto;
`;

const QuestionNumber = styled.div`
  background: ${(props) =>
    `${props.theme.colors?.primary || "rgba(52, 152, 219, 0.2)"}30`};
  color: ${(props) =>
    props.theme.colors?.textSecondary || "rgba(255, 255, 255, 0.9)"};
  padding: 0.25rem 0.6rem;
  border-radius: ${(props) => props.theme.borderRadius?.md || "12px"};
  font-size: ${(props) => props.theme.fontSizes?.xs || "0.75rem"};
  display: flex;
  align-items: center;
`;

const FlipHint = styled.div`
  position: absolute;
  bottom: ${(props) => props.theme.spacing?.md || "1rem"};
  left: 50%;
  transform: translateX(-50%);
  color: ${(props) =>
    props.theme.colors?.textMuted || "rgba(255, 255, 255, 0.5)"};
  font-size: ${(props) => props.theme.fontSizes?.xs || "0.75rem"};
  display: flex;
  align-items: center;

  i {
    margin-right: 5px;
    animation: pulse 1.5s infinite ease-in-out;
  }

  @keyframes pulse {
    0% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.5;
    }
  }
`;

const FlipButton = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  cursor: pointer;
  top: 0;
  left: 0;
  z-index: 10;
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

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName))
        return;

      switch (event.key) {
        case "ArrowLeft":
          onPrevious();
          break;
        case "ArrowRight":
          onNext();
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
  }, [onNext, onPrevious, onBookmark]);

  return (
    <CardContainer>
      <FlipButton onClick={handleFlip} />

      <CardFront $isActive={!isFlipped}>
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
          </CardFooter>

          <FlipHint>
            <i className="fas fa-sync-alt"></i>
            Tap to flip
          </FlipHint>
        </CardContent>
      </CardFront>

      <CardBack $isActive={isFlipped}>
        <AnswerText>{question.answer}</AnswerText>

        <FlipHint>
          <i className="fas fa-sync-alt"></i>
          Tap to return
        </FlipHint>
      </CardBack>
    </CardContainer>
  );
};

export default Flashcard;
