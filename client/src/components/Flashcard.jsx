// src/components/Flashcard.jsx - Mobile-optimized version
import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useSwipeable } from "react-swipeable"; // Assuming this library is used

const CardContainer = styled.div`
  width: 90%;
  max-width: 370px;
  height: 50vh; /* Use percentage of viewport height instead of fixed px */
  perspective: 1000px;
  margin: 0 auto;
  position: relative;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Card = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.5s;
  transform: ${(props) => (props.$flipped ? "rotateY(180deg)" : "rotateY(0)")};
  cursor: pointer;
`;

const CardSide = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: ${(props) => props.theme.borderRadius?.lg || "12px"};
  box-shadow: ${(props) =>
    props.theme.colors?.cardShadow || "0 4px 20px rgba(0, 0, 0, 0.15)"};
  padding: ${(props) => props.theme.spacing?.md || "1rem"};
  display: flex;
  flex-direction: column;
  transition: box-shadow
      ${(props) => props.theme.transitions?.fast || "0.2s ease"},
    background-color
      ${(props) => props.theme.transitions?.medium || "0.3s ease"};
  background-color: ${(props) => props.theme.colors?.cardBackground || "white"};
  color: ${(props) => props.theme.colors?.text || "inherit"};
  overflow: auto;
`;

const CardFront = styled(CardSide)`
  transform: rotateY(0);
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CardBack = styled(CardSide)`
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
`;

const QuestionText = styled.div`
  font-size: ${(props) => props.theme.fontSizes?.md || "1rem"};
  font-weight: 500;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow-y: auto;
  padding: ${(props) => props.theme.spacing?.xs || "0.25rem"};

  /* Add scrollbar styling for overflow content */
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
`;

const AnswerText = styled.div`
  font-size: ${(props) => props.theme.fontSizes?.md || "1rem"};
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow-y: auto;
  padding: ${(props) => props.theme.spacing?.xs || "0.25rem"};

  /* Add scrollbar styling for overflow content */
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: ${(props) => props.theme.spacing?.xs || "0.25rem"};
  font-size: ${(props) => props.theme.fontSizes?.xs || "0.7rem"};
  color: ${(props) => props.theme.colors?.textSecondary || "inherit"};
  opacity: 0.7;
`;

const CategoryBadge = styled.div`
  background-color: ${(props) =>
    props.theme.colors?.badgeBackground || "#f8f9fa"};
  color: ${(props) => props.theme.colors?.textSecondary || "inherit"};
  border-radius: ${(props) => props.theme.borderRadius?.pill || "20px"};
  padding: 0.15rem 0.5rem;
  font-size: ${(props) => props.theme.fontSizes?.xs || "0.7rem"};
  display: inline-block;
  margin-top: ${(props) => props.theme.spacing?.xs || "0.25rem"};
`;

const BookmarkButton = styled.button`
  background: none;
  border: none;
  color: ${(props) =>
    props.$isBookmarked
      ? props.theme.colors?.warning || "#f39c12"
      : props.theme.colors?.textSecondary || "inherit"};
  font-size: ${(props) => props.theme.fontSizes?.md || "1rem"};
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions?.fast || "0.2s ease"};
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  position: absolute;
  right: ${(props) => props.theme.spacing?.sm || "0.5rem"};
  top: ${(props) => props.theme.spacing?.sm || "0.5rem"};
  z-index: 3;
  border-radius: 50%;
  opacity: 0.8;

  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
`;

const FlipHint = styled.div`
  text-align: center;
  font-size: ${(props) => props.theme.fontSizes?.xs || "0.7rem"};
  opacity: 0.5;
  margin-top: ${(props) => props.theme.spacing?.sm || "0.5rem"};
  font-style: italic;
`;

// Simple react component for a flashcard with front and back
const Flashcard = ({
  question,
  onNext,
  onPrevious,
  onBookmark,
  isBookmarked,
  currentIndex,
  totalQuestions,
}) => {
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef(null);

  // Reset flipped state when question changes
  useEffect(() => {
    setFlipped(false);
  }, [question]);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  // Configure swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (!flipped) onNext();
    },
    onSwipedRight: () => {
      if (!flipped) onPrevious();
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: false,
  });

  if (!question) return null;

  return (
    <CardContainer {...swipeHandlers}>
      <Card $flipped={flipped} onClick={handleFlip} ref={cardRef}>
        <CardFront>
          <QuestionText>{question.question}</QuestionText>
          <FlipHint>Tap to flip</FlipHint>
          <CardFooter>
            <CategoryBadge>{question.category}</CategoryBadge>
          </CardFooter>
        </CardFront>
        <CardBack>
          <AnswerText>{question.answer}</AnswerText>
          <FlipHint>Tap to flip back</FlipHint>
        </CardBack>
      </Card>
      <BookmarkButton
        $isBookmarked={isBookmarked}
        onClick={(e) => {
          e.stopPropagation();
          onBookmark();
        }}
      >
        <i className={`fas ${isBookmarked ? "fa-star" : "fa-star"}`} />
      </BookmarkButton>
    </CardContainer>
  );
};

export default Flashcard;
