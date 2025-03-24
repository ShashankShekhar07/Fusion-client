import React, { useState } from "react";
import { Group, Text, Box, Container } from "@mantine/core";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
// eslint-disable-next-line import/no-unresolved
import { useDispatch } from "react-redux";
import Compose from "./ComposeFile";
import Outboxfunc from "./Outbox";
import Inboxfunc from "./Inbox";
import Track from "./Track";
import Draft from "./Drafts";
import ArchiveFiles from "./Archive";
import { setActiveTab_ } from "../../../redux/moduleslice";
import classes from "../../Dashboard/Dashboard.module.css";

const sections = [
  "Compose File",
  "Drafts",
  "Inbox",
  "Outbox",
  "Track",
  "Archive",
];

const sectionComponents = {
  "Compose File": Compose,
  Outbox: Outboxfunc,
  Inbox: Inboxfunc,
  Track,
  Drafts: Draft,
  Archive: ArchiveFiles,
};

export default function SectionNavigation() {
  const dispatch = useDispatch();
  const [activeSection, setActiveSection] = useState("Compose File");

  const handleSelection = (section) => {
    setActiveSection(section);
    dispatch(setActiveTab_(section));
  };

  const navigateLeft = () => {
    const currentIndex = sections.indexOf(activeSection);
    const previousIndex =
      (currentIndex - 1 + sections.length) % sections.length; // Wrap around to the last tab
    handleSelection(sections[previousIndex]);
  };

  const navigateRight = () => {
    const currentIndex = sections.indexOf(activeSection);
    const nextIndex = (currentIndex + 1) % sections.length; // Wrap around to the first tab
    handleSelection(sections[nextIndex]);
  };

  // Get the component for the active section
  const ActiveComponent = sectionComponents[activeSection];

  return (
    <Container size="xl" ml="-4" mt="1rem">
      {/* Section navigation */}
      <Group
        spacing={0}
        style={{
          display: "flex",
          overflowY: "auto",
          overflowX: "auto",
          padding: "8px",
          borderBottom: "2px solid #E2E8F0",
        }}
      >
        {/* Left arrow button */}
        <button
          onClick={navigateLeft}
          style={{
            background: "#E2E8F0",
            border: "1.5px solid black",
            cursor: "pointer",
            padding: "2.5px",
            borderRadius: "50%",
            outline: "none",
            margin: "0 8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CaretLeft size={20} background="#FFFFFF" />
        </button>
        {sections.map((section) => (
          <Text
            key={section}
            size="sm"
            className={classes.fusionText}
            style={{
              cursor: "pointer",
              padding: "8px 16px",
              whiteSpace: "nowrap",
              margin: "0",
              background:
                activeSection === section
                  ? "rgba(150, 200, 255, 0.3)"
                  : "transparent",
              color: activeSection === section ? "#15ABFF" : "#000000",
              // fontWeight: activeSection === section ? "600" : "normal",
              borderBottom:
                activeSection === section
                  ? "2.5px solid #007ACC"
                  : "2px solid transparent",
              transition: "border-bottom 0.3s, color 0.3s",
            }}
            onClick={() => handleSelection(section)}
          >
            {section}
          </Text>
        ))}
        {/* Right arrow button */}
        <button
          onClick={navigateRight}
          style={{
            background: "#E2E8F0",
            border: "1.5px solid black", // Black border added
            cursor: "pointer",
            padding: "2.5px",
            borderRadius: "50%",
            outline: "none",
            margin: "0 8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CaretRight size={20} background="#FFFFFF" />
        </button>
      </Group>

      {/* Render the active section component */}
      <Box
        mt="md"
        style={{
          color: "#F5F7F8",
          // border: "2px solid rgba(0, 0, 0, 0.3)",
          width: "100%",
          overflow: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "8px 0",
          boxSizing: "border-box",
        }}
      >
        {ActiveComponent ? (
          <Box style={{ width: "100%", height: "100%", overflow: "auto" }}>
            <ActiveComponent />
          </Box>
        ) : (
          <Text>Content for {activeSection}</Text>
        )}
      </Box>
    </Container>
  );
}
