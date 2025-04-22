import React, { useState, useEffect } from "react";
import {
  Text,
  Divider,
  Group,
  Paper,
  Button,
  Center,
  Loader,
  Grid,
  Flex,
} from "@mantine/core";
import PropTypes from "prop-types";
import ComplaintDetails from "./ComplaintDetails";
import { getComplaintsByRole } from "../routes/api"; // Import the API function

function ResolvedComplaints() {
  const token = localStorage.getItem("authToken");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [viewFeedback, setViewFeedback] = useState(false);
  const [resolvedComplaints, setResolvedComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchResolvedComplaints = async () => {
      setIsLoading(true);
      try {
        const response = await getComplaintsByRole("caretaker", token);
        if (response.success) {
          const filteredComplaints = response.data.filter(
            (complaint) => complaint.status === 2,
          );
          setResolvedComplaints(filteredComplaints);
          setIsError(false);
        } else {
          throw new Error(response.error);
        }
      } catch (error) {
        console.error("Error fetching complaints:", error);
        setIsError(true);
      }
      setIsLoading(false);
    };

    fetchResolvedComplaints();
  }, []);

  const handleDetailsClick = (complaint) => {
    setSelectedComplaint(complaint);
    setViewFeedback(false);
  };

  const handleFeedbackClick = (complaint) => {
    setSelectedComplaint(complaint);
    setViewFeedback(true);
  };

  const handleBackClick = () => {
    setSelectedComplaint(null);
    setViewFeedback(false);
  };

  const formatDateTime = (datetimeStr) => {
    const date = new Date(datetimeStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}-${month}-${year}, ${hours}:${minutes}`; // Format: DD-MM-YYYY HH:MM
  };

  return (
    <Grid mt="xl" style={{ paddingInline: "49px", width: "100%" }}>
      <Paper
        radius="md"
        px="lg"
        pt="sm"
        pb="xl"
        style={{
          borderLeft: "0.6rem solid #15ABFF",
          backgroundColor: "white", // Ensure backgroundColor is set here
          minHeight: "45vh",
          maxHeight: "70vh",
          width: selectedComplaint || viewFeedback ? "70vw" : "100%",
          overflow: "auto",
        }}
        withBorder
      >
        {!selectedComplaint ? (
          <div>
            {isLoading ? (
              <Center>
                <Loader size="xl" variant="bars" />
              </Center>
            ) : isError ? (
              <Center>
                <Text color="Red">
                  Failed to fetch complaints. Please try again.
                </Text>
              </Center>
            ) : (
              <div style={{ overflowY: "auto" }}>
                {resolvedComplaints.map((complaint) => (
                  <Paper
                    key={complaint.id}
                    radius="md"
                    px="lg"
                    pt="sm"
                    pb="xl"
                    style={{
                      border: "1px solid #e8e8e8",
                      margin: "10px 0",
                    }}
                    withBorder
                  >
                    <Group position="apart">
                      <Text size="14px" style={{ fontWeight: "bold" }}>
                        Complaint Id: {complaint.id}
                      </Text>
                      <Text
                        size="14px"
                        style={{
                          borderRadius: "50px",
                          padding: "10px 20px",
                          backgroundColor: "#14ABFF",
                          color: "white",
                        }}
                      >
                        {complaint.complaint_type.toUpperCase()}
                      </Text>
                    </Group>
                    <Flex direction="column" gap="xs" mt="md">
                      <Text size="14px">
                        <strong>Date:</strong>{" "}
                        {formatDateTime(complaint.complaint_date)}
                      </Text>
                      <Text size="14px">
                        <strong>Location:</strong> {complaint.specific_location}
                        , {complaint.location}
                      </Text>
                    </Flex>
                    <Divider my="sm" />
                    <Flex direction="row" justify="space-between">
                      <Text size="14px">
                        <strong>Description:</strong> {complaint.details}
                      </Text>
                      <Flex direction="row" gap="xs" ml="auto">
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => handleDetailsClick(complaint)}
                        >
                          Details
                        </Button>
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => handleFeedbackClick(complaint)}
                        >
                          Feedback
                        </Button>
                      </Flex>
                    </Flex>
                  </Paper>
                ))}
              </div>
            )}
          </div>
        ) : viewFeedback ? (
          <FeedbackDetails
            complaint={selectedComplaint}
            onBack={handleBackClick}
          />
        ) : (
          <ComplaintDetails
            complaintId={selectedComplaint.id}
            onBack={handleBackClick}
          />
        )}
      </Paper>
    </Grid>
  );
}

function FeedbackDetails({ complaint, onBack }) {
  const formatDateTime = (datetimeStr) => {
    const date = new Date(datetimeStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}-${month}-${year}, ${hours}:${minutes}`;
  };

  return (
    <Flex
      direction="column"
      gap="md"
      style={{ padding: "1rem", height: "100%" }}
    >
      <Text size="24px" style={{ fontWeight: "bold" }}>
        Feedback Details
      </Text>
      <Grid
        columns={2}
        style={{
          width: "100%",
          gap: "1rem",
        }}
        sx={(theme) => ({
          [theme.fn.smallerThan("sm")]: {
            gridTemplateColumns: "1fr",
          },
        })}
      >
        <Grid.Col span={1}>
          <Flex direction="column" gap="xs">
            <Text size="14px">
              <b>Complainer ID:</b>
            </Text>
            <Text size="14px">{complaint.complainer_id}</Text>
          </Flex>
        </Grid.Col>
        <Grid.Col span={1}>
          <Flex direction="column" gap="xs">
            <Text size="14px">
              <b>Complaint ID:</b>
            </Text>
            <Text size="14px">{complaint.complaint_id}</Text>
          </Flex>
        </Grid.Col>
        <Grid.Col span={1}>
          <Flex direction="column" gap="xs">
            <Text size="14px">
              <b>Complaint Date:</b>
            </Text>
            <Text size="14px">{formatDateTime(complaint.complaint_date)}</Text>
          </Flex>
        </Grid.Col>
        <Grid.Col span={1}>
          <Flex direction="column" gap="xs">
            <Text size="14px">
              <b>Finished Date:</b>
            </Text>
            <Text size="14px">
              {formatDateTime(complaint.complaint_finish)}
            </Text>
          </Flex>
        </Grid.Col>
      </Grid>
      <Flex direction="column" gap="xs">
        <Text size="14px">
          <b>Complaint Type:</b>
        </Text>
        <Text size="14px">{complaint.complaint_type.toUpperCase()}</Text>
      </Flex>
      <Flex direction="column" gap="xs">
        <Text size="14px">
          <b>Location:</b>
        </Text>
        <Text size="14px">
          {complaint.specific_location}, {complaint.location}
        </Text>
      </Flex>
      <Flex direction="column" gap="xs">
        <Text size="14px">
          <b>Feedback:</b>
        </Text>
        <Text color="red" size="14px">
          {complaint.feedback || "No feedback provided"}
        </Text>
      </Flex>
      <Flex justify="flex-end" style={{ marginTop: "auto" }}>
        <Button onClick={onBack} radius="md" size="md">
          Back
        </Button>
      </Flex>
    </Flex>
  );
}

FeedbackDetails.propTypes = {
  complaint: PropTypes.shape({
    id: PropTypes.number.isRequired,
    complaint_id: PropTypes.string.isRequired, // Added missing prop validation
    complaint_type: PropTypes.string.isRequired,
    complaint_date: PropTypes.string.isRequired,
    complaint_finish: PropTypes.string,
    location: PropTypes.string.isRequired,
    specific_location: PropTypes.string.isRequired,
    details: PropTypes.string.isRequired,
    status: PropTypes.number.isRequired,
    feedback: PropTypes.string,
    comment: PropTypes.string,
    complainer: PropTypes.string,
    complainer_id: PropTypes.string.isRequired,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
};

export default ResolvedComplaints;
