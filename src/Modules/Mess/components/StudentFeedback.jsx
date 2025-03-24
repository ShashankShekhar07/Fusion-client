import React, { useState } from "react";
import {
  Textarea,
  Button,
  Container,
  Title,
  Paper,
  Select,
  Group,
} from "@mantine/core"; // Mantine UI components
import { PencilSimple, FunnelSimple } from "@phosphor-icons/react"; // Phosphor Icons
import axios from "axios";
import { feedbackRoute } from "../routes";

function StudentFeedback() {
  const [messOption, setMessOption] = useState("Mess 1");
  const [feedbackType, setFeedbackType] = useState("Cleanliness");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (description.trim() === "") {
      alert("Feedback cannot be empty!");
      return;
    }
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("authToken"); // Get the token from local storage
      const response = await axios.post(
        feedbackRoute,
        {
          mess: messOption, // Need to change the mess option based on the registration
          feedback_type: feedbackType,
          description,
        },
        {
          headers: {
            authorization: `Token ${token}`, // Pass the token in the Authorization header
          },
        },
      );
      console.log(response);
      if (response.status === 200) {
        alert("Feedback submitted successfully!");
        setDescription(""); // Clear the textarea after submission
      } else {
        alert("Failed to submit description");
      }
    } catch (error) {
      console.error("Error submitting description:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false); // Reset submission state
    }
  };

  return (
    <Container
      size="lg"
      style={{
        miw: "1100px",
        width: "1100px",
        marginTop: "25px",
      }}
    >
      <Paper
        shadow="md"
        radius="md"
        p="xl"
        withBorder
        style={{ padding: "30px" }}
      >
        <Title order={2} align="center" mb="lg" style={{ color: "#1c7ed6" }}>
          Submit Feedback
        </Title>

        <form onSubmit={handleSubmit}>
          {/* Dropdown for mess option */}
          <Group grow mb="lg">
            <Select
              label="Select Mess"
              placeholder="Choose Mess"
              value={messOption}
              onChange={setMessOption}
              data={["Mess 1", "Mess 2"]}
              radius="md"
              size="md"
              icon={<FunnelSimple size={18} />} // Phosphor icon
            />
          </Group>

          {/* Dropdown for description type */}
          <Group grow mb="lg">
            <Select
              label="Feedback Type"
              placeholder="Select Feedback Type"
              value={feedbackType}
              onChange={setFeedbackType}
              data={["Cleanliness", "Food", "Maintenance", "Others"]}
              radius="md"
              size="md"
              icon={<FunnelSimple size={18} />} // Phosphor icon
            />
          </Group>

          {/* Textarea for description description */}
          <Textarea
            label="Description"
            placeholder="Enter your description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            radius="md"
            size="md"
            mb="lg"
            required
            minRows={4}
            icon={<PencilSimple size={18} />} // Phosphor icon
          />

          {/* Submit Button */}
          <Button
            fullWidth
            size="md"
            radius="md"
            color="blue"
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            leftIcon={<PencilSimple size={18} />} // Phosphor icon
          >
            Submit Feedback
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default StudentFeedback;
