// src/components/Header.jsx
import React from "react";
import styled from "styled-components";
import { useTheme } from "../contexts/ThemeContext";
import { useTimer } from "../contexts/TimerContext";

const HeaderWrapper = styled.div`
  position: relative;
  z-index: 10;
  margin-bottom: ${(props) => props.theme.spacing?.md || "1rem"};
`;

const HeaderContainer = styled.header`
  background: ${(props) => props.theme.colors?.headerBackground || "#2c3e50"};
  color: ${(props) =>
    props.theme.colors?.text === "#333333"
      ? "white"
      : props.theme.colors?.text || "white"};
  padding: ${(props) => props.theme.spacing?.md || "1rem"}
    ${(props) => props.theme.spacing?.xl || "2rem"};
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${(props) =>
    props.theme.colors?.headerShadow || "0 4px 20px rgba(0, 0, 0, 0.15)"};
  position: relative;
  transition: background-color
    ${(props) => props.theme.transitions?.medium || "0.3s ease"};
`;

const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
`;

const Title = styled.h1`
  font-size: ${(props) => props.theme.fontSizes?.xxl || "2.2rem"};
  font-weight: 800;
  margin: 0;
  letter-spacing: 1px;
  color: ${(props) =>
    props.theme.colors?.text === "#333333"
      ? "white"
      : props.theme.colors?.text || "white"};
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Subtitle = styled.h2`
  font-size: ${(props) => props.theme.fontSizes?.md || "1rem"};
  font-weight: 400;
  margin: 0.15rem 0 0;
  color: ${(props) =>
    props.theme.colors?.textSecondary || "rgba(255, 255, 255, 0.9)"};
  letter-spacing: 0.8px;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing?.md || "1rem"};
  position: relative;
`;

const TimerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing?.sm || "0.75rem"};
`;

const TimerContainer = styled.div`
  background: ${(props) =>
    props.theme.colors?.text === "#333333"
      ? "rgba(0, 0, 0, 0.1)"
      : "rgba(255, 255, 255, 0.1)"};
  color: ${(props) =>
    props.theme.colors?.text === "#333333" ? props.theme.colors.text : "white"};
  padding: 0.5rem 0.8rem;
  border-radius: ${(props) => props.theme.borderRadius?.pill || "20px"};
  font-size: ${(props) => props.theme.fontSizes?.sm || "0.85rem"};
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color
    ${(props) => props.theme.transitions?.fast || "0.2s ease"};
`;

const TimerDisplay = styled.div`
  font-family: "Courier New", monospace;
  font-weight: 700;
  min-width: 52px;
  text-align: center;
`;

const TimerControls = styled.div`
  display: flex;
  gap: 6px;
`;

const TimerButton = styled.button`
  background: ${(props) =>
    props.theme.colors?.text === "#333333"
      ? "rgba(0, 0, 0, 0.15)"
      : "rgba(255, 255, 255, 0.15)"};
  border: none;
  color: ${(props) =>
    props.theme.colors?.text === "#333333" ? props.theme.colors.text : "white"};
  width: 24px;
  height: 24px;
  font-size: 0.75rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions?.fast || "0.2s ease"};
  padding: 0;

  &:hover {
    background: ${(props) =>
      props.theme.colors?.text === "#333333"
        ? "rgba(0, 0, 0, 0.25)"
        : "rgba(255, 255, 255, 0.25)"};
    transform: translateY(-1px);
  }

  &.active {
    background: ${(props) => props.theme.colors?.primary || "#3498db"};
  }
`;

const ThemeToggleButton = styled.button`
  background: ${(props) =>
    props.theme.colors?.text === "#333333"
      ? "rgba(0, 0, 0, 0.15)"
      : "rgba(255, 255, 255, 0.15)"};
  color: ${(props) =>
    props.theme.colors?.text === "#333333" ? props.theme.colors.text : "white"};
  border: none;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions?.medium || "0.3s ease"};

  &:hover {
    background: ${(props) =>
      props.theme.colors?.text === "#333333"
        ? "rgba(0, 0, 0, 0.25)"
        : "rgba(255, 255, 255, 0.25)"};
    transform: translateY(-2px);
  }

  i {
    font-size: ${(props) => props.theme.fontSizes?.md || "1rem"};
  }
`;

const Header = ({ title }) => {
  const { darkMode, toggleTheme, theme } = useTheme();
  const { formatTime, timerActive, toggleTimer, resetTimer } = useTimer();

  return (
    <HeaderWrapper>
      <HeaderContainer>
        <LogoSection>
          <Title>CQuizy</Title>
          <Subtitle>{title}</Subtitle>
        </LogoSection>

        <Controls>
          <TimerWrapper>
            <TimerContainer>
              <i className="fas fa-clock"></i>
              <TimerDisplay>{formatTime()}</TimerDisplay>
            </TimerContainer>

            <TimerControls>
              <TimerButton
                onClick={toggleTimer}
                className={timerActive ? "active" : ""}
                title={timerActive ? "Pause" : "Start"}
              >
                <i
                  className={`fas ${timerActive ? "fa-pause" : "fa-play"}`}
                ></i>
              </TimerButton>

              <TimerButton onClick={resetTimer} title="Reset">
                <i className="fas fa-redo-alt"></i>
              </TimerButton>
            </TimerControls>
          </TimerWrapper>

          <ThemeToggleButton onClick={toggleTheme}>
            <i className={`fas ${darkMode ? "fa-sun" : "fa-moon"}`} />
          </ThemeToggleButton>
        </Controls>
      </HeaderContainer>
    </HeaderWrapper>
  );
};

export default Header;
