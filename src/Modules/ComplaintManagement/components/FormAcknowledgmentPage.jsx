// AcknowledgmentPage.jsx
import React from "react";
import PropTypes from "prop-types";
import { Container, Paper, Button, Title, Text } from "@mantine/core";

function AcknowledgmentPage({ complaintDetails, onBackToForm }) {
  return (
    <Container
      size="md"
      mt="xl"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Paper
        radius="md"
        px="lg"
        pt="sm"
        pb="xl"
        style={{
          borderLeft: "0.6rem solid #15ABFF",
          width: "55%",
          backgroundColor: "white",
        }}
        withBorder
      >
        <Title order={3} mb="md">
          Complaint Submitted Successfully!
        </Title>
        <Text mb="md">
          Your complaint has been registered successfully. Here are the details:
        </Text>
        <Text>
          <strong>Complaint Type:</strong> {complaintDetails.complaintType}
        </Text>
        <Text>
          <strong>Location:</strong> {complaintDetails.location}
        </Text>
        <Text>
          <strong>Specific Location:</strong>{" "}
          {complaintDetails.specificLocation}
        </Text>
        <Text>
          <strong>Complaint Details:</strong>{" "}
          {complaintDetails.complaintDetails}
        </Text>
        <Button onClick={onBackToForm} fullWidth mt="lg">
          Back to Form
        </Button>
      </Paper>
    </Container>
  );
}

// Add PropTypes for validation
AcknowledgmentPage.propTypes = {
  complaintDetails: PropTypes.shape({
    complaintType: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    specificLocation: PropTypes.string.isRequired,
    complaintDetails: PropTypes.string.isRequired,
    file: PropTypes.instanceOf(File), // Use instanceOf(File) for the file prop
  }).isRequired,
  onBackToForm: PropTypes.func.isRequired,
};

export default AcknowledgmentPage;
