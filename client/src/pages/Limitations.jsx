// src/pages/Limitations.jsx
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
  max-height: ${(props) => (props.$active ? "2000px" : "0")};
  overflow: hidden;
  transition: max-height 0.5s ease;
  background: #34495e;
`;

const AccordionBody = styled.div`
  padding: ${(props) => (props.$active ? "1.25rem" : "0 1.25rem")};
  transition: padding 0.3s ease;
`;

const TableResponsive = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 0;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.9);
`;

const TableHead = styled.thead`
  background-color: rgba(52, 152, 219, 0.2);

  th {
    padding: 0.75rem;
    text-align: center;
    font-weight: 600;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const TableBody = styled.tbody`
  tr {
    &:nth-child(even) {
      background-color: rgba(255, 255, 255, 0.05);
    }

    &:hover {
      background-color: rgba(52, 152, 219, 0.1);
    }
  }

  td {
    padding: 0.6rem 0.75rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    text-align: center;
  }
`;

const VSpeed = styled.span`
  font-weight: 600;
  font-style: italic;
  color: ${(props) => props.theme.colors.primary || "#3498db"};
  margin-right: 1px;
`;

const Limitations = () => {
  // State to track active accordion panel
  const [activePanel, setActivePanel] = useState("collapseOne");

  const togglePanel = (panelId) => {
    setActivePanel(activePanel === panelId ? null : panelId);
  };

  // Data for the tables
  const structuralLimitations = {
    headers: ["Structure", "ERJ 175LL", "ERJ 175LR"],
    rows: [
      ["Maximum Ramp Weight", "85,450 lbs", "85,870 lbs"],
      ["Maximum Takeoff Weight", "85,098 lbs", "85,517 lbs"],
      ["Maximum Landing Weight", "74,957 lbs", "74,957 lbs"],
      ["Maximum Zero Fuel Weight", "69,467 lbs", "69,886 lbs"],
    ],
  };

  const externalDimensions = {
    headers: ["Structure", "Dimensions"],
    rows: [
      ["Wing Span", "93ft 11in"],
      ["Aircraft Length", "103ft 11in"],
      ["Tail Height", "32ft 4in"],
    ],
  };

  const altitudeTemperature = {
    headers: ["Condition", "Limitations"],
    rows: [
      ["Max. Ops. Alt", "41,000ft"],
      ["Max. T/O & Landing Alt", "10,000ft"],
      ["Max. Temp. T/O & Landing", "ISA +35C (52C)"],
      ["Min. Temp. T/O & Landing", "-40C"],
      ["Rwy Slope", "+/- 2%"],
      ["Max. Tailwind", "15kts"],
      ["Max. Single Pack Ops", "31,000ft"],
    ],
  };

  const speedLimits = {
    headers: ["Designator", "Speed"],
    rows: [
      [
        <>
          V<sub>mo</sub> SL-8000'
        </>,
        "300",
      ],
      [
        <>
          V<sub>mo</sub> 10,000 - Mach Trans
        </>,
        "320",
      ],
      [
        <>
          M<sub>mo</sub>
        </>,
        "0.82",
      ],
      [
        <>
          V<sub>a</sub>
        </>,
        "240",
      ],
      [
        <>
          V<sub>lo</sub> Ext
        </>,
        "250",
      ],
      [
        <>
          V<sub>le</sub> Ret
        </>,
        "250",
      ],
      [
        <>
          V<sub>le</sub>
        </>,
        "250",
      ],
      [
        <>
          V<sub>tire</sub>
        </>,
        "195",
      ],
      [
        <>
          V<sub>ratDeployMax</sub>
        </>,
        <>
          V<sub>mo</sub>/M<sub>mo</sub>
        </>,
      ],
      [
        <>
          V<sub>min</sub> (to provide elec power)
        </>,
        "130",
      ],
      [
        <>
          V<sub>b</sub> (below 10,000ft)
        </>,
        "250",
      ],
      [
        <>
          V<sub>b</sub> (10,000ft and above)
        </>,
        "270/0.76M (whichever is lower)",
      ],
      [
        <>
          V<sub>wiper ops max</sub>
        </>,
        "250 (SW)",
      ],
      [
        <>
          V<sub>window</sub>
        </>,
        "160",
      ],
    ],
  };

  return (
    <>
      <Header title="Limitations" />
      <Container>
        <Navigation />

        <PageTitle>Aircraft Limitations</PageTitle>

        <AccordionContainer>
          {/* Structural Limitations */}
          <AccordionItem>
            <AccordionHeader>
              <AccordionButton
                $active={activePanel === "collapseOne"}
                onClick={() => togglePanel("collapseOne")}
              >
                Aircraft Structural Limitations
              </AccordionButton>
            </AccordionHeader>

            <AccordionContent $active={activePanel === "collapseOne"}>
              <AccordionBody $active={activePanel === "collapseOne"}>
                <TableResponsive>
                  <Table>
                    <TableHead>
                      <tr>
                        {structuralLimitations.headers.map((header, index) => (
                          <th key={index}>{header}</th>
                        ))}
                      </tr>
                    </TableHead>
                    <TableBody>
                      {structuralLimitations.rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </TableBody>
                  </Table>
                </TableResponsive>
              </AccordionBody>
            </AccordionContent>
          </AccordionItem>

          {/* External Dimensions */}
          <AccordionItem>
            <AccordionHeader>
              <AccordionButton
                $active={activePanel === "collapseTwo"}
                onClick={() => togglePanel("collapseTwo")}
              >
                Structural External Dimensions
              </AccordionButton>
            </AccordionHeader>

            <AccordionContent $active={activePanel === "collapseTwo"}>
              <AccordionBody $active={activePanel === "collapseTwo"}>
                <TableResponsive>
                  <Table>
                    <TableHead>
                      <tr>
                        {externalDimensions.headers.map((header, index) => (
                          <th key={index}>{header}</th>
                        ))}
                      </tr>
                    </TableHead>
                    <TableBody>
                      {externalDimensions.rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </TableBody>
                  </Table>
                </TableResponsive>
              </AccordionBody>
            </AccordionContent>
          </AccordionItem>

          {/* Maximum Altitude and Temperature */}
          <AccordionItem>
            <AccordionHeader>
              <AccordionButton
                $active={activePanel === "collapseThree"}
                onClick={() => togglePanel("collapseThree")}
              >
                Maximum Altitude and Temperature Limits
              </AccordionButton>
            </AccordionHeader>

            <AccordionContent $active={activePanel === "collapseThree"}>
              <AccordionBody $active={activePanel === "collapseThree"}>
                <TableResponsive>
                  <Table>
                    <TableHead>
                      <tr>
                        {altitudeTemperature.headers.map((header, index) => (
                          <th key={index}>{header}</th>
                        ))}
                      </tr>
                    </TableHead>
                    <TableBody>
                      {altitudeTemperature.rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </TableBody>
                  </Table>
                </TableResponsive>
              </AccordionBody>
            </AccordionContent>
          </AccordionItem>

          {/* Speed Limits */}
          <AccordionItem>
            <AccordionHeader>
              <AccordionButton
                $active={activePanel === "collapseFour"}
                onClick={() => togglePanel("collapseFour")}
              >
                Speed Limits
              </AccordionButton>
            </AccordionHeader>

            <AccordionContent $active={activePanel === "collapseFour"}>
              <AccordionBody $active={activePanel === "collapseFour"}>
                <TableResponsive>
                  <Table>
                    <TableHead>
                      <tr>
                        {speedLimits.headers.map((header, index) => (
                          <th key={index}>{header}</th>
                        ))}
                      </tr>
                    </TableHead>
                    <TableBody>
                      {speedLimits.rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </TableBody>
                  </Table>
                </TableResponsive>
              </AccordionBody>
            </AccordionContent>
          </AccordionItem>
        </AccordionContainer>
      </Container>
    </>
  );
};

export default Limitations;
