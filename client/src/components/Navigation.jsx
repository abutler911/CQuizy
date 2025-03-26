// src/components/Navigation.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

const NavContainer = styled.div`
  margin: ${(props) =>
    `${props.theme.spacing?.md || "1rem"} auto ${
      props.theme.spacing?.xl || "2rem"
    }`};
  width: 90%;
  max-width: 600px;
`;

const NavWrapper = styled.nav`
  background: ${(props) =>
    props.theme.colors?.headerBackground
      ? `${props.theme.colors.headerBackground}4D` // 30% opacity
      : "rgba(44, 62, 80, 0.3)"};
  backdrop-filter: blur(10px);
  border-radius: ${(props) => props.theme.borderRadius?.md || "12px"};
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  box-shadow: ${(props) =>
    props.theme.colors?.cardShadow || "0 4px 20px rgba(0, 0, 0, 0.1)"};
  border: 1px solid
    ${(props) =>
      props.theme.colors?.text === "#333333"
        ? "rgba(0, 0, 0, 0.1)"
        : "rgba(255, 255, 255, 0.1)"};
  transition: background-color
      ${(props) => props.theme.transitions?.medium || "0.3s ease"},
    border-color ${(props) => props.theme.transitions?.medium || "0.3s ease"};

  @media (max-width: 480px) {
    padding: 0.4rem;
  }
`;

const NavButton = styled(Link)`
  flex: 1;
  padding: 0.9rem 1.5rem;
  text-align: center;
  color: ${(props) =>
    props.theme.colors?.text === "#333333" ? "#333333" : "white"};
  background: ${(props) =>
    props.$active ? props.theme.colors?.primary || "#3498db" : "transparent"};
  border-radius: ${(props) => props.theme.borderRadius?.sm || "8px"};
  text-decoration: none;
  font-weight: ${(props) => (props.$active ? "600" : "500")};
  letter-spacing: 0.5px;
  transition: all ${(props) => props.theme.transitions?.medium || "0.3s ease"};

  &:hover {
    transform: translateY(-2px);
    background: ${(props) =>
      props.$active
        ? props.theme.colors?.primary || "#3498db"
        : props.theme.colors?.text === "#333333"
        ? "rgba(0, 0, 0, 0.1)"
        : "rgba(52, 152, 219, 0.3)"};
  }

  @media (max-width: 480px) {
    padding: 0.7rem 0.5rem;
    font-size: 0.9rem;
  }
`;

const Navigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const routes = [
    { path: "/", label: "Flashcards" },
    { path: "/limitations", label: "Limitations" },
    { path: "/memory", label: "Memory Items" },
  ];

  return (
    <NavContainer>
      <NavWrapper>
        {routes.map((route) => (
          <NavButton
            key={route.path}
            to={route.path}
            $active={currentPath === route.path}
          >
            {route.label}
          </NavButton>
        ))}
      </NavWrapper>
    </NavContainer>
  );
};

export default Navigation;
