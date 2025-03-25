import React, { useState } from "react";
import { Paper, Button, Textarea, Title, Group, Box } from "@mantine/core";
// import * as PhosphorIcons from "@phosphor-icons/react";
import axios from "axios"; // Assuming you are using axios for making HTTP requests
import { feedbackRoute } from "../routes";

// Styles
const feedbackContainerStyle = {
  padding: "60px",
  backgroundColor: "#e6f7ff",
  borderRadius: "10px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  width: "90%",
  marginTop: "55px",
};

const headingStyle = {
  fontSize: "32px",
  fontWeight: "bold",
  color: "#0056b3",
  marginBottom: "30px",
};

const subHeadingStyle = {
  fontSize: "24px",
  fontWeight: "500",
  color: "#333",
  marginBottom: "20px",
};

const categoryButtonContainer = {
  marginBottom: "30px",
};

const formContainerStyle = {
  width: "100%", // Adjusted to make the form stretch fully horizontally
  padding: "30px",
  backgroundColor: "#fff",
  boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.1)",
  borderRadius: "10px",
};

const textareaStyle = {
  padding: "30px",
  marginBottom: "20px",
};

const submitButtonStyle = {
  backgroundColor: "#28a745",
  fontWeight: "bold",
};

function FeedbackPage() {
  const [selectedCategory, setSelectedCategory] = useState("Food"); // Default category
  const [feedback, setFeedback] = useState(""); // State to store the feedback input
  const [isSubmitting, setIsSubmitting] = useState(false); // State to manage submission state

  const handleSubmit = async () => {
    if (feedback.trim() === "") {
      alert("Feedback cannot be empty!");
      return;
    }
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("authToken"); // Get the token from local storage
      const response = await axios.post(
        feedbackRoute,
        {
          mess: "mess1", // Need to change the mess option based on the registration
          feedback_type: selectedCategory,
          description: feedback,
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
        setFeedback(""); // Clear the textarea after submission
      } else {
        alert("Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false); // Reset submission state
    }
  };

  return (
    <Box style={feedbackContainerStyle}>
      <Paper shadow="md" radius="md" p="lg" withBorder>
        <Title order={2} align="center" mb="lg" style={headingStyle}>
          Mess Feedback
        </Title>

        {/* Feedback category buttons */}
        <Group position="center" style={categoryButtonContainer}>
          <Button
            // leftIcon={<PhosphorIcons.ForkKnife size={20} />}
            variant={selectedCategory === "Food" ? "filled" : "outline"}
            onClick={() => setSelectedCategory("Food")}
            size="md"
          >
            Food
          </Button>
          <Button
            // leftIcon={<PhosphorIcons.Broom size={20} />}
            variant={selectedCategory === "Cleanliness" ? "filled" : "outline"}
            onClick={() => setSelectedCategory("Cleanliness")}
            size="md"
          >
            Cleanliness
          </Button>
          <Button
            // leftIcon={<PhosphorIcons.Wrench size={20} />}
            variant={selectedCategory === "Maintenance" ? "filled" : "outline"}
            onClick={() => setSelectedCategory("Maintenance")}
            size="md"
          >
            Maintenance
          </Button>
          <Button
            // leftIcon={<PhosphorIcons.Note size={20} />}
            variant={selectedCategory === "Others" ? "filled" : "outline"}
            onClick={() => setSelectedCategory("Others")}
            size="md"
          >
            Others
          </Button>
        </Group>

        {/* Feedback form */}
        <Box style={formContainerStyle}>
          <Title order={3} style={subHeadingStyle}>
            {selectedCategory} Feedback
          </Title>
          <Textarea
            placeholder={`Enter your feedback about ${selectedCategory}`}
            style={textareaStyle}
            value={feedback} // Bind feedback state
            onChange={(event) => setFeedback(event.currentTarget.value)} // Update feedback state
            minRows={5}
          />
          <Button
            // leftIcon={<PhosphorIcons.PaperPlaneTilt size={20} />}
            fullWidth
            style={submitButtonStyle}
            onClick={handleSubmit}
            disabled={isSubmitting} // Disable button while submitting
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default FeedbackPage;
