import React, { useState, useEffect } from "react";
import { Loader, Center, Paper, Grid, Text } from "@mantine/core";
import { getUserComplaints } from "../routes/api";
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
        setComplaints(response.data);
        setIsError(false);
      } else {
        setIsError(true);
      }
      setIsLoading(false);
    };

    fetchComplaints();
  }, [selectedComplaint]);

  const renderContent = () => {
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
          <Text color="red" fz="md">
            {isError
              ? "Failed to fetch complaints. Please try again."
              : "No resolved complaints available"}
          </Text>
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
    <Grid
      mt="xl"
      style={{ paddingInline: "49px", width: "100%" }}
      sx={(theme) => ({
        [theme.fn.smallerThan("sm")]: {
          paddingInline: theme.spacing.md,
        },
      })}
    >
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
        sx={(theme) => ({
          [theme.fn.smallerThan("sm")]: {
            width: selectedComplaint ? "90vw" : "100%",
            maxHeight: "auto",
            minHeight: "auto",
          },
        })}
      >
        {renderContent()}
      </Paper>
    </Grid>
  );
}

export default Feedback;
