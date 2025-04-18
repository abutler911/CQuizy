// src/components/Flashcard.jsx
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

// Card container with proper perspective and overflow control
const CardContainer = styled.div`
  margin: 2rem auto;
  max-width: 480px;
  width: 94%;
  height: 360px;
  position: relative;
  perspective: 1500px;
  overflow: hidden;
  touch-action: none;
`;

// Base card styles
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
  transform-style: preserve-3d;
  box-shadow: ${(props) =>
    props.$isActive
      ? "0 20px 30px rgba(0, 0, 0, 0.2), 0 8px 16px rgba(0, 0, 0, 0.1)"
      : "0 10px 20px rgba(0, 0, 0, 0.1)"};
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease,
    box-shadow 0.3s ease;
  pointer-events: ${(props) => (props.$isActive ? "auto" : "none")};

  // Handle different card states with transforms
  transform: ${(props) => {
    // Handle flip state first
    if (!props.$isActive) return "rotateY(180deg)";

    // Handle exit animation
    if (props.$direction === "left")
      return `translateX(${props.$swiping ? props.$swipeOffset : -150}%)`;
    if (props.$direction === "right")
      return `translateX(${props.$swiping ? props.$swipeOffset : 150}%)`;

    // Normal state with potential swipe offset during active swipe
    if (props.$swiping) return `translateX(${props.$swipeOffset}px)`;

    return "translateX(0)";
  }};

  // Adjust transition based on swipe state
  transition: ${(props) =>
    props.$swiping
      ? "transform 0.05s linear"
      : "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease, box-shadow 0.3s ease"};
`;

// Front card with refined gradient
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
    height: 70px;
    background: linear-gradient(
      to bottom,
      rgba(52, 152, 219, 0.12),
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

// Combined metadata block with category and context
const CardMeta = styled.div`
  max-width: 80%;
`;

// Minimal category block
const CategoryBlock = styled.div`
  background: rgba(52, 152, 219, 0.7);
  color: white;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  display: inline-flex;
  flex-direction: column;
  font-size: 0.65rem;
  max-width: 200px;
`;

// Category title - extremely compact
const CategoryTitle = styled.div`
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1.1;
`;

// Category context - wrap instead of truncate
const CategoryContext = styled.div`
  font-size: 0.6rem;
  font-style: italic;
  opacity: 0.85;
  line-height: 1.2;
  max-width: 200px;
  white-space: normal; /* Allow wrapping */
  overflow-wrap: break-word;
  word-wrap: break-word;
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

// Refined answer text without quotes
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
`;

// Compact footer - without question counter or navigation
const CardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: auto;
  padding-top: 0.5rem;
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

// Edge swipe indicators for visual feedback
const SwipeIndicator = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  width: 60px;
  z-index: 3;
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  background: ${(props) =>
    props.$direction === "left"
      ? "linear-gradient(to left, transparent, rgba(52, 152, 219, 0.3))"
      : "linear-gradient(to right, transparent, rgba(52, 152, 219, 0.3))"};
  ${(props) => (props.$direction === "left" ? "left: 0;" : "right: 0;")}
  transition: opacity 0.2s ease;
  pointer-events: none;

  /* Show based on swipe direction and strength */
  opacity: ${(props) =>
    props.$active ? Math.min(Math.abs(props.$strength) / 100, 0.8) : 0};
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
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const touchStartTimeRef = useRef(0);
  const cardRef = useRef(null);
  const transitionTimerRef = useRef(null);

  // Swipe sensitivity - adjust these values to make swiping easier or harder
  const SWIPE_THRESHOLD = 80; // Minimum distance to trigger a swipe (in pixels)
  const SWIPE_VELOCITY_THRESHOLD = 0.3; // Minimum velocity to trigger a swipe (pixels/ms)

  const handleFlip = () => {
    // Only flip if we're not in the middle of a swipe
    if (Math.abs(swipeOffset) < 20 && !swipeDirection) {
      setIsFlipped(!isFlipped);
    }
  };

  // Reset state when the question changes
  useEffect(() => {
    setIsFlipped(false);
    setSwipeDirection(null);
    setSwipeOffset(0);

    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
  }, [currentIndex]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName))
        return;

      switch (event.key) {
        case "ArrowLeft":
          if (currentIndex > 0) {
            setSwipeDirection("right");
            transitionTimerRef.current = setTimeout(() => {
              onPrevious();
            }, 400);
          }
          break;
        case "ArrowRight":
          if (currentIndex < totalQuestions - 1) {
            setSwipeDirection("left");
            transitionTimerRef.current = setTimeout(() => {
              onNext();
            }, 400);
          }
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
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    };
  }, [onNext, onPrevious, onBookmark, currentIndex, totalQuestions]);

  // Touch handlers for swipe gestures
  const handleTouchStart = (e) => {
    // Skip swipe on flipped card or during transition
    if (isFlipped || swipeDirection) return;

    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    touchStartTimeRef.current = Date.now();
    setIsSwiping(true);
  };

  const handleTouchMove = (e) => {
    if (!isSwiping || isFlipped || swipeDirection) return;

    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    const deltaX = touchX - touchStartXRef.current;
    const deltaY = touchY - touchStartYRef.current;

    // If the user is scrolling more vertically than horizontally, let the browser handle it
    if (Math.abs(deltaY) > Math.abs(deltaX) * 1.5) {
      setIsSwiping(false);
      return;
    }

    // Prevent default to stop page scrolling during horizontal swipe
    e.preventDefault();

    // Limit the maximum swipe offset and add resistance as the card moves farther
    const resistanceFactor = 0.7;
    const clampedDelta =
      Math.sign(deltaX) * Math.min(Math.abs(deltaX) * resistanceFactor, 150);

    // Disable the swipe in a direction if we can't navigate that way
    if (
      (currentIndex === 0 && deltaX > 0) ||
      (currentIndex === totalQuestions - 1 && deltaX < 0)
    ) {
      // Stronger resistance when at the edges
      setSwipeOffset(deltaX * 0.2);
    } else {
      setSwipeOffset(clampedDelta);
    }
  };

  const handleTouchEnd = () => {
    if (!isSwiping || isFlipped || swipeDirection) {
      setIsSwiping(false);
      return;
    }

    const touchEndTime = Date.now();
    const touchDuration = touchEndTime - touchStartTimeRef.current;
    const velocity = Math.abs(swipeOffset) / touchDuration; // pixels per ms

    // Check if the swipe was strong enough or moved far enough
    if (
      Math.abs(swipeOffset) > SWIPE_THRESHOLD ||
      velocity > SWIPE_VELOCITY_THRESHOLD
    ) {
      // Swipe right - go to previous card
      if (swipeOffset > 0 && currentIndex > 0) {
        setSwipeDirection("right");
        transitionTimerRef.current = setTimeout(() => {
          onPrevious();
        }, 400);
      }
      // Swipe left - go to next card
      else if (swipeOffset < 0 && currentIndex < totalQuestions - 1) {
        setSwipeDirection("left");
        transitionTimerRef.current = setTimeout(() => {
          onNext();
        }, 400);
      } else {
        // Reset if swiping is not allowed in this direction
        setSwipeOffset(0);
      }
    } else {
      // Not a strong enough swipe, reset position
      setSwipeOffset(0);
    }

    setIsSwiping(false);
  };

  return (
    <CardContainer
      ref={cardRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Left swipe indicator */}
      <SwipeIndicator
        $direction="left"
        $active={swipeOffset < -20}
        $strength={swipeOffset}
      >
        <i className="fas fa-chevron-right" />
      </SwipeIndicator>

      {/* Right swipe indicator */}
      <SwipeIndicator
        $direction="right"
        $active={swipeOffset > 20}
        $strength={swipeOffset}
      >
        <i className="fas fa-chevron-left" />
      </SwipeIndicator>

      {/* Front card */}
      <CardFront
        $isActive={!isFlipped}
        $swiping={isSwiping}
        $swipeOffset={swipeOffset}
        $direction={swipeDirection}
        onClick={handleFlip}
      >
        <CardContent>
          <CardHeader>
            <CardMeta>
              <CategoryBlock>
                <CategoryTitle>{question.category}</CategoryTitle>
                {question.context && (
                  <CategoryContext>{question.context}</CategoryContext>
                )}
              </CategoryBlock>
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
            {/* Navigation controls removed in favor of swipe */}
          </CardFooter>

          <FlipHint>
            <i className="fas fa-sync-alt"></i>
            Tap for answer
          </FlipHint>
        </CardContent>
      </CardFront>

      {/* Back card */}
      <CardBack
        $isActive={isFlipped}
        $direction={swipeDirection}
        onClick={handleFlip}
      >
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
