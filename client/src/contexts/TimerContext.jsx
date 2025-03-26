// src/contexts/TimerContext.jsx
import { createContext, useState, useEffect, useContext } from "react";

const TimerContext = createContext();

export const useTimer = () => useContext(TimerContext);

export const TimerProvider = ({ children }) => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(false); // Default to inactive

  // Load saved timer value on mount
  useEffect(() => {
    const savedTime = parseInt(localStorage.getItem("studyTimer") || "0");
    const savedTimerState = localStorage.getItem("timerActive") === "true";
    setSecondsElapsed(savedTime);
    setTimerActive(savedTimerState);
  }, []);

  // Update timer every second when active
  useEffect(() => {
    let interval = null;

    if (timerActive) {
      interval = setInterval(() => {
        setSecondsElapsed((prevSeconds) => {
          const newSeconds = prevSeconds + 1;
          localStorage.setItem("studyTimer", newSeconds.toString());
          return newSeconds;
        });
      }, 1000);
    }

    // Save timer state
    localStorage.setItem("timerActive", timerActive.toString());

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive]);

  // Pause timer when page is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && timerActive) {
        setTimerActive(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [timerActive]);

  const formatTime = () => {
    const hours = Math.floor(secondsElapsed / 3600);
    const minutes = Math.floor((secondsElapsed % 3600) / 60);
    const seconds = secondsElapsed % 60;

    if (hours > 0) {
      return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
    } else {
      return `${padZero(minutes)}:${padZero(seconds)}`;
    }
  };

  const padZero = (num) => {
    return num.toString().padStart(2, "0");
  };

  const toggleTimer = () => {
    setTimerActive((prev) => !prev);
  };

  const resetTimer = () => {
    setSecondsElapsed(0);
    localStorage.setItem("studyTimer", "0");
    setTimerActive(false);
  };

  return (
    <TimerContext.Provider
      value={{
        secondsElapsed,
        formatTime,
        timerActive,
        toggleTimer,
        resetTimer,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};
