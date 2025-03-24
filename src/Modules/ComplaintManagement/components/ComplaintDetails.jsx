import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Text, Button, Flex, Grid, Loader, Alert } from "@mantine/core";
import { getComplaintDetails } from "../routes/api"; // Import the utility function
import { host } from "../../../routes/globalRoutes/index";

function ComplaintDetails({ complaintId, onBack }) {
  const formatDateTime = (datetimeStr) => {
    const date = new Date(datetimeStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}-${month}-${year}, ${hours}:${minutes}`;
  };

  const [complaintDetails, setComplaintDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaintDetails = async () => {
      const token = localStorage.getItem("authToken");
      const response = await getComplaintDetails(complaintId, token);

      if (response.success) {
        setComplaintDetails(response.data);
        setError(null); // Reset error on success
      } else {
        console.error("Error fetching complaint details:", response.error);
        setError("Failed to fetch complaint details");
      }
      setLoading(false);
    };

    fetchComplaintDetails();
  }, [complaintId]);

  const handleViewAttachment = () => {
    if (!complaintDetails.upload_complaint) {
      alert("No attachment found for this complaint.");
      return;
    }
    const attachmentUrl = `${host}${complaintDetails.upload_complaint}`;
    window.open(attachmentUrl, "_blank");
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" style={{ height: "100%" }}>
        <Loader size="lg" />
        <Text ml="md" size="14px">
          Loading complaint details...
        </Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Alert title="Error" color="red" withCloseButton>
        {error}
      </Alert>
    );
  }

  return (
    <Flex
      direction="column"
      gap="lg"
      style={{ textAlign: "left", width: "100%" }}
    >
      <Flex direction="column" gap="xs">
        <Text size="24px" style={{ fontWeight: "bold" }}>
          Complaint Details
        </Text>
        <Text size="14px" style={{ fontWeight: "bold" }}>
          Complaint ID: {complaintDetails.id}
        </Text>
      </Flex>

      <Grid columns="2" style={{ width: "100%" }}>
        <Grid.Col span={1}>
          <Flex direction="column" gap="xs">
            <Text size="14px" style={{ fontWeight: "bold" }}>
              Complainer ID:
            </Text>
            <Text weight="300" size="14px">
              {complaintDetails.complainer}
            </Text>
          </Flex>
        </Grid.Col>
        <Flex direction="column" gap="xs">
          <Text size="14px" style={{ fontWeight: "bold" }}>
            Register Date:
          </Text>
          <Text weight="300" size="14px">
            {formatDateTime(complaintDetails.complaint_date)}
          </Text>
        </Flex>
      </Grid>

      <Grid columns="2" style={{ width: "100%" }}>
        <Grid.Col span={1}>
          <Flex direction="column" gap="xs">
            <Text size="14px" style={{ fontWeight: "bold" }}>
              Location:
            </Text>
            <Text weight="300" size="14px">
              {complaintDetails.location}
            </Text>
          </Flex>
        </Grid.Col>
        <Flex direction="column" gap="xs">
          <Text size="14px" style={{ fontWeight: "bold" }}>
            Specific Location:
          </Text>
          <Text weight="300" size="14px">
            {complaintDetails.specific_location}
          </Text>
        </Flex>
      </Grid>

      <Grid columns="2" style={{ width: "100%" }}>
        <Grid.Col span={1}>
          <Flex direction="column" gap="xs">
            <Text size="14px" style={{ fontWeight: "bold" }}>
              Issue:
            </Text>
            <Text weight="300" size="14px">
              {complaintDetails.details}
            </Text>
          </Flex>
        </Grid.Col>
      </Grid>

      <Flex direction="row" gap="xs" align="center">
        <Text size="14px" style={{ fontWeight: "bold" }}>
          View attachment:
        </Text>
        <Button onClick={handleViewAttachment} px={10} py={0}>
          View
        </Button>
      </Flex>

      <Flex direction="row-reverse" gap="xs">
        <Button size="sm" variant="filled" color="black" onClick={onBack}>
          Back
        </Button>
      </Flex>
    </Flex>
  );
}

ComplaintDetails.propTypes = {
  complaintId: PropTypes.number.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default ComplaintDetails;
