import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  Button,
  Text,
  Box,
  Divider,
  Center,
  ThemeIcon,
} from "@mantine/core";
import { ArrowRight, FileText } from "phosphor-react";
import "../../../style/Applicant/ApplicationDraft.css";

// Empty state component
function EmptyDraftsState({ onStartNew }) {
  return (
    <Card className="saved-draft-card empty-state-card">
      <Center style={{ flexDirection: "column", padding: "16px 12px" }}>
        <ThemeIcon
          size="lg"
          radius="xl"
          variant="light"
          color="blue"
          style={{ marginBottom: 10 }}
        >
          <FileText size={20} />
        </ThemeIcon>
        <Text size="lg" weight={600} align="center" style={{ marginBottom: 6 }}>
          No Drafts Available
        </Text>
        <Text size="xs" align="center" style={{ marginBottom: 6 }}>
          You haven't saved any patent application drafts yet.
        </Text>
        <Divider style={{ width: "100%", margin: "10px 0" }} />
        <Button
          variant="outline"
          leftIcon={<ArrowRight size={14} />}
          onClick={onStartNew}
          size="xs"
        >
          Start New Application
        </Button>
      </Center>
    </Card>
  );
}

EmptyDraftsState.propTypes = {
  onStartNew: PropTypes.func.isRequired,
};

// Main component
function SavedDraftsPage({ setActiveTab }) {
  return (
    <Box style={{ padding: "16px" }}>
      <Text className="draft-header-text" size="xl" weight={700}>
        Saved Drafts
      </Text>

      <Box className="draft-app-container">
        <EmptyDraftsState onStartNew={() => setActiveTab("1.1")} />
      </Box>
    </Box>
  );
}

SavedDraftsPage.propTypes = {
  setActiveTab: PropTypes.func.isRequired,
};

export default SavedDraftsPage;
