// src/pages/MemoryItems.jsx
import React, { useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Navigation from "../components/Navigation";

// Styled components
const Container = styled.div`
  max-width: 800px;
  width: 90%;
  margin: 0 auto;
  padding: 0 1rem;
`;

const PageTitle = styled.h3`
  color: white;
  text-align: center;
  margin: 1.5rem 0;
  font-weight: 600;
  font-size: 1.5rem;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -0.5rem;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: ${(props) => props.theme.colors.primary || "#3498db"};
    border-radius: 2px;
  }
`;

const AccordionContainer = styled.div`
  margin-bottom: 2rem;
`;

const AccordionItem = styled.div`
  margin-bottom: 0.75rem;
  border-radius: 10px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  transition: box-shadow 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  &:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  }
`;

const AccordionHeader = styled.div`
  cursor: pointer;
  user-select: none;
`;

const AccordionButton = styled.button`
  width: 100%;
  padding: 1rem 1.5rem;
  text-align: left;
  background: ${(props) =>
    props.$active ? props.theme.colors.primary || "#3498db" : "#2c3e50"};
  color: white;
  border: none;
  font-weight: 600;
  letter-spacing: 0.5px;
  font-size: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  transition: background 0.3s ease;

  &::after {
    content: "";
    width: 10px;
    height: 10px;
    border-right: 2px solid white;
    border-bottom: 2px solid white;
    transform: ${(props) =>
      props.$active ? "rotate(-135deg)" : "rotate(45deg)"};
    transition: transform 0.3s ease;
    margin-left: 1rem;
  }

  &:hover {
    background: ${(props) =>
      props.$active
        ? props.theme.colors.primaryDark || "#2980b9"
        : "rgba(52, 152, 219, 0.3)"};
  }
`;

const AccordionContent = styled.div`
  max-height: ${(props) => (props.$active ? "500px" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease;
  background: #34495e;
`;

const AccordionBody = styled.div`
  padding: ${(props) => (props.$active ? "1.25rem" : "0 1.25rem")};
  transition: padding 0.3s ease;
`;

const StepsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const Step = styled.li`
  padding: 0.4rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;

  &:last-child {
    border-bottom: none;
  }
`;

const SmallStep = styled(Step)`
  font-size: 0.8rem;
  font-style: italic;
  color: rgba(255, 255, 255, 0.7);
`;

const StepHeader = styled.h6`
  color: ${(props) => props.theme.colors.primary || "#3498db"};
  margin-bottom: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  font-size: 0.9rem;
`;

const MemoryItems = () => {
  // State to track active accordion panel
  const [activePanel, setActivePanel] = useState("collapseOne");

  const togglePanel = (panelId) => {
    setActivePanel(activePanel === panelId ? null : panelId);
  };

  // Memory items data
  const memoryItems = [
    {
      id: "collapseOne",
      title: "SMOKE EVACUATION",
      steps: [
        "OXYGEN MASKS - Don, Emer",
        "CREW COMMUNICATION - Establish",
        "PRESSURIZATION DUMP - Push In",
      ],
    },
    {
      id: "collapseTwo",
      title: "SMOKE / FIRE / FUMES",
      steps: ["OXYGEN MASKS - Don, 100%", "CREW COMMUNICATION - Establish"],
    },
    {
      id: "collapseThree",
      title: "CABIN ALTITUDE HI",
      steps: ["OXYGEN MASKS - Don, 100%", "CREW COMMUNICATION - Establish"],
    },
    {
      id: "collapseFour",
      title: "JAMMED CONTROL COLUMN - PITCH",
      steps: ["ELEVATOR DISCONNECT HANDLE - Pull"],
    },
    {
      id: "collapseFive",
      title: "JAMMED CONTROL WHEEL - ROLL",
      steps: ["AILERON DISCONNECT HANDLE - Pull"],
    },
    {
      id: "collapseSix",
      title: "PITCH TRIM RUNAWAY",
      steps: [
        "AP/TRIM DISC BUTTON - Press and Hold",
        "PITCH TRIM SYS 1 & 2 CUTOUT BUTTONS - Push In",
      ],
    },
    {
      id: "collapseSeven",
      title: "ROLL OR YAW TRIM RUNAWAY",
      steps: ["AP/TRIM DISC BUTTON - Press and Hold"],
    },
    {
      id: "collapseEight",
      title: "STEERING RUNAWAY",
      steps: [
        "STEER DISC SWITCH - Press",
        "Steer airplane using differential braking and rudder.",
      ],
    },
    {
      id: "collapseNine",
      title: "BATT 1 (2) OVERTEMP",
      steps: ["ASSOCIATED BATTERY - Off"],
    },
    {
      id: "collapseTen",
      title: "ENGINE ABNORMAL START",
      steps: ["START/STOP SELECTOR - Stop"],
      header: "AFFECTED ENGINE:",
    },
  ];

  return (
    <>
      <Header title="Memory Items" />
      <Container>
        <Navigation />

        <PageTitle>Aircraft Memory Items</PageTitle>

        <AccordionContainer>
          {memoryItems.map((item) => (
            <AccordionItem key={item.id}>
              <AccordionHeader>
                <AccordionButton
                  $active={activePanel === item.id}
                  onClick={() => togglePanel(item.id)}
                >
                  {item.title}
                </AccordionButton>
              </AccordionHeader>

              <AccordionContent $active={activePanel === item.id}>
                <AccordionBody $active={activePanel === item.id}>
                  {item.header && <StepHeader>{item.header}</StepHeader>}

                  <StepsList>
                    {item.steps.map((step, index) =>
                      index === item.steps.length - 1 &&
                      step.includes("using") ? (
                        <SmallStep key={index}>{step}</SmallStep>
                      ) : (
                        <Step key={index}>{step}</Step>
                      )
                    )}
                  </StepsList>
                </AccordionBody>
              </AccordionContent>
            </AccordionItem>
          ))}
        </AccordionContainer>
      </Container>
    </>
  );
};

export default MemoryItems;
