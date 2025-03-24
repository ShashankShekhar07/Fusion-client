import React, { useState } from "react";
// import { notifications } from "@mantine/notifications";
import { Button, Textarea, Title, Center, Box, Paper } from "@mantine/core";
import axios from "axios";
import Navigation from "../Navigation";
import CustomBreadcrumbs from "../../../../components/Breadcrumbs";
import { studentRoute } from "../../../../routes/health_center";

function Feedback() {
  const [feed, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!feed.trim()) {
      setError("Feedback cannot be empty");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        studentRoute,
        { feedback: feed, feed_submit: 1 },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      console.log(response.data);
      setIsSubmitting(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <CustomBreadcrumbs />
      <Navigation />
      <br />
      <Paper shadow="xl" p="xl" withBorder>
        <Center>
          <Box style={{ width: "75%", marginTop: "20px" }} alignItems="center">
            <Title
              order={3}
              style={{
                color: "#15abff",
                textAlign: "center",
              }}
            >
              The Feedback Form
            </Title>
            <br />
            <form onSubmit={handleSubmit}>
              <Textarea
                placeholder="Enter your feedback"
                autosize
                minRows={6}
                label="Feedback"
                style={{ width: "100%" }}
                value={feed}
                onChange={handleFeedbackChange}
                error={error}
              />

              <Button
                type="submit"
                color="#15abff"
                size="md"
                mt="xl"
                disabled={isSubmitting}
                style={{ display: "block", margin: "15px auto" }}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </Box>
        </Center>
      </Paper>
    </>
  );
}

export default Feedback;
