import React, { useState } from "react";
import {
  Button,
  Flex,
  Grid,
  Text,
  Textarea,
  Select,
  Loader,
  CheckIcon,
} from "@mantine/core";
import PropTypes from "prop-types";
import { notifications } from "@mantine/notifications";
import { submitFeedback } from "../routes/api";

function formatDateTime(str) {
  const date = new Date(str);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}-${month}-${year}, ${hours}:${minutes}`;
}

function FeedbackForm({ complaint }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(null);
  const token = localStorage.getItem("authToken");

  const handleSubmit = async () => {
    if (!feedback || !rating) {
      notifications.show({
        title: "Incomplete Feedback",
        message: "Please provide feedback and a rating.",
        color: "red",
      });
      return;
    }
    setIsLoading(true);
    setIsSuccess(false);
    try {
      const response = await submitFeedback(
        complaint.id,
        { feedback, rating },
        token,
      );
      console.log("Feedback submitted:", response.data);
      setIsSuccess(true);
      notifications.show({
        title: "Feedback Submitted",
        message: "Your feedback has been submitted successfully.",
        color: "green",
      });
    } catch (err) {
      console.error("Error submitting feedback:", err);
      notifications.show({
        title: "Submission Failed",
        message: "Failed to submit feedback. Please try again.",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex
      direction="column"
      gap="lg"
      style={{ textAlign: "left", width: "100%" }}
    >
      <Flex direction="column" gap="xs">
        <Text size="24px" style={{ fontWeight: "bold" }}>
          Submit Feedback
        </Text>
        <Text size="14px" style={{ fontWeight: "bold" }}>
          Complaint ID: {complaint.id}
        </Text>
      </Flex>
      <Grid columns="2" style={{ width: "100%" }}>
        <Grid.Col span={1}>
          <Flex direction="column" gap="xs">
            <Text size="14px" style={{ fontWeight: "bold" }}>
              Register Date:
            </Text>
            <Text weight="300" size="14px">
              {formatDateTime(complaint.complaint_date)}
            </Text>
          </Flex>
        </Grid.Col>
        <Grid.Col span={1}>
          <Flex direction="column" gap="xs">
            <Text size="14px" style={{ fontWeight: "bold" }}>
              Finished Date:
            </Text>
            <Text weight="300" size="14px">
              {formatDateTime(complaint.complaint_finish)}
            </Text>
          </Flex>
        </Grid.Col>
      </Grid>
      <Flex direction="column" gap="xs">
        <Text size="14px" style={{ fontWeight: "bold" }}>
          Feedback*
        </Text>
        <Textarea
          placeholder="Write your feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={3}
          required
        />
      </Flex>
      <Flex direction="row" gap="xs" align="center">
        <Text size="14px" style={{ fontWeight: "bold" }}>
          Rating:
        </Text>
        <Select
          placeholder="Select a rating"
          value={rating}
          onChange={setRating}
          data={[
            { value: "1", label: "1" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4" },
            { value: "5", label: "5" },
          ]}
        />
      </Flex>
      <Flex direction="row-reverse" gap="xs">
        <Button
          onClick={handleSubmit}
          disabled={isLoading || isSuccess}
          style={{
            backgroundColor: isSuccess ? "#2BB673" : undefined,
            color: isSuccess ? "white" : undefined,
          }}
        >
          {isLoading ? (
            <Loader size="xs" />
          ) : isSuccess ? (
            <CheckIcon size="16px" />
          ) : (
            "Submit"
          )}
        </Button>
      </Flex>
    </Flex>
  );
}

FeedbackForm.propTypes = {
  complaint: PropTypes.shape({
    id: PropTypes.number.isRequired,
    complaint_date: PropTypes.string.isRequired,
    complaint_finish: PropTypes.string.isRequired,
  }).isRequired,
};

export default FeedbackForm;
