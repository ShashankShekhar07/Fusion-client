import React, { useState, useEffect } from "react";
import { Loader, Center, Paper, Grid, Text } from "@mantine/core";
import { getUserComplaints } from "../routes/api"; // Import the utility function
import FeedbackForm from "./FeedbackForm";
import FeedbackList from "./FeedbackList";

function Feedback() {
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchComplaints = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");

      const response = await getUserComplaints(token);

      if (response.success) {
        console.log("Complaints fetched:", response.data);
        setComplaints(response.data);
        setIsError(false);
      } else {
        console.error("Error fetching complaints:", response.error);
        setIsError(true);
      }
      setIsLoading(false);
    };

    fetchComplaints();
  }, [selectedComplaint]);

  const renderFormTabContent = () => {
    if (isLoading) {
      return (
        <Center>
          <Loader size="xl" variant="bars" />
        </Center>
      );
    }

    if (isError || complaints.length === 0) {
      return (
        <Center>
          {isError ? (
            <Text color="Red" style={{ fontSize: "14px" }}>
              Failed to fetch complaints. Please try again.
            </Text>
          ) : (
            <Text style={{ fontSize: "14px" }}>
              No resolved complaints available
            </Text>
          )}
        </Center>
      );
    }

    if (selectedComplaint == null) {
      return (
        <FeedbackList
          complaints={complaints}
          setSelectedComplaint={setSelectedComplaint}
        />
      );
    }

    return (
      <FeedbackForm
        complaint={selectedComplaint}
        setSelectedComplaint={setSelectedComplaint}
      />
    );
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
          width: selectedComplaint ? "70vw" : "100%",
          maxHeight: "65vh",
          minHeight: "45vh",
        }}
        withBorder
      >
        {renderFormTabContent()}
      </Paper>
    </Grid>
  );
}

export default Feedback;
