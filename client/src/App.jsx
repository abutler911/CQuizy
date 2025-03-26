// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { createGlobalStyle } from "styled-components";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { TimerProvider } from "./contexts/TimerContext";
import Flashcards from "./pages/Flashcards";
import Limitations from "./pages/Limitations";
import MemoryItems from "./pages/MemoryItems";

// Create GlobalStyles component that uses the theme
const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    background-color: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.text};
    font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    margin: 0;
    min-width: 320px;
    transition: background-color ${(props) => props.theme.transitions.medium};
  }

  a {
    font-weight: 500;
    color: ${(props) => props.theme.colors.primary};
    text-decoration: inherit;
  }
 
  a:hover {
    color: ${(props) => props.theme.colors.primaryDark};
  }

  h1 {
    font-size: ${(props) => props.theme.fontSizes.xxl};
    line-height: 1.1;
  }

  button {
    border-radius: ${(props) => props.theme.borderRadius.md};
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    font-size: ${(props) => props.theme.fontSizes.md};
    font-weight: 500;
    font-family: inherit;
    background-color: ${(props) => props.theme.colors.inputBackground};
    cursor: pointer;
    transition: border-color ${(props) => props.theme.transitions.fast};
  }
 
  button:hover {
    border-color: ${(props) => props.theme.colors.primary};
  }
 
  button:focus,
  button:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }
`;

// ThemeWrapper component to access the theme context
const ThemeWrapper = ({ children }) => {
  const { theme } = useTheme();
  return <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>;
};

function App() {
  return (
    <ThemeProvider>
      <ThemeWrapper>
        <GlobalStyles />
        <TimerProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Flashcards />} />
              <Route path="/limitations" element={<Limitations />} />
              <Route path="/memory" element={<MemoryItems />} />
            </Routes>
          </Router>
        </TimerProvider>
      </ThemeWrapper>
    </ThemeProvider>
  );
}

export default App;
