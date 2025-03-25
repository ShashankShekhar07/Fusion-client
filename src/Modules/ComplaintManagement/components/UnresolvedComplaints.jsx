import React, { useState, useEffect } from "react";
import {
  Text, // For displaying text
  Button, // For interactive buttons
  Flex, // For flexible layout
  Grid, // For grid-based layout
  Divider, // For visual separation of content
  Badge, // For status or metadata tags
  Paper, // For card-like components
  Loader, // For showing loading state
  Center, // For centering content
} from "@mantine/core";

// Import useSelector to access the Redux store and retrieve the role of the user
import { useSelector } from "react-redux"; // Import useSelector to get role from Redux

// Import custom components for the application
import ComplaintDetails from "./ComplaintDetails.jsx";
import UnresCompChangeStatus from "./UnresComp_ChangeStatus.jsx";
import UnresCompRedirect from "./UnresComp_Redirect.jsx";

// API utility for fetching complaints
import { getComplaintsByRole } from "../routes/api"; // Import axios function

function UnresolvedComplaints() {
  const [activeComponent, setActiveComponent] = useState("list");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [redirectedComplaints, setRedirectedComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const role = useSelector((state) => state.user.role); // Get user role from Redux store

  const token = localStorage.getItem("authToken"); // Get token from localStorage

  // Fetch unresolved complaints from the API based on role
  useEffect(() => {
    const fetchComplaints = async () => {
      setIsLoading(true);
      setIsError(false);
      const { success, data, error } = await getComplaintsByRole(role, token);

      if (success) {
        // Filter unresolved complaints (status 0 or 1)
        const unresolvedComplaints = data.filter(
          (complaint) => complaint.status === 1 || complaint.status === 0,
        );
        setComplaints(unresolvedComplaints);
      } else {
        setIsError(true);
        console.error("Error fetching complaints:", error);
      }
      setIsLoading(false);
    };

    fetchComplaints();
  }, [role, token]);

  const handleButtonClick = (component, complaint) => {
    setSelectedComplaint(complaint);
    setActiveComponent(component);
  };

  const handleBack = () => {
    setSelectedComplaint(null);
    setActiveComponent("list");
  };

  const markComplaintAsRedirected = (complaintId) => {
    setRedirectedComplaints((prev) => [...prev, complaintId]);
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
          backgroundColor: "white",
          minHeight: "45vh",
          maxHeight: "70vh",
          width:
            activeComponent === "details" ||
            activeComponent === "changeStatus" ||
            activeComponent === "redirect"
              ? "70vw"
              : "100%",
          overflow: "auto",
        }}
        withBorder
      >
        <Flex direction="column">
          {isLoading ? (
            <Center style={{ flexGrow: 1 }}>
              <Loader size="xl" variant="bars" />
            </Center>
          ) : isError ? (
            <Center style={{ flexGrow: 1 }}>
              <Text color="red">
                Failed to fetch complaints. Please try again.
              </Text>
            </Center>
          ) : complaints.length === 0 ? (
            <Center style={{ flexGrow: 1 }}>
              <Text>No unresolved complaints available.</Text>
            </Center>
          ) : activeComponent === "details" ? (
            <ComplaintDetails
              complaintId={selectedComplaint.id}
              onBack={handleBack}
            />
          ) : activeComponent === "changeStatus" ? (
            <UnresCompChangeStatus
              complaint={selectedComplaint}
              onBack={handleBack}
            />
          ) : activeComponent === "redirect" ? (
            <UnresCompRedirect
              complaint={selectedComplaint}
              onBack={handleBack}
              onForward={() => markComplaintAsRedirected(selectedComplaint.id)}
            />
          ) : (
            complaints.map((complaint) => (
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
                <Flex direction="column" style={{ width: "100%" }}>
                  <Flex direction="row" justify="space-between" align="center">
                    <Flex direction="row" gap="xs" align="center">
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
                    </Flex>
                    <Badge
                      color={complaint.status === 1 ? "green" : "red"}
                      variant="filled"
                      size="lg"
                    >
                      {complaint.status === 1 ? "Redirected" : "Unresolved"}
                    </Badge>
                  </Flex>

                  <Flex direction="column" gap="xs" mt="md">
                    <Text size="14px">
                      <strong>Date:</strong>{" "}
                      {formatDateTime(complaint.complaint_date)}
                    </Text>
                    <Text size="14px">
                      <strong>Location:</strong> {complaint.specific_location},{" "}
                      {complaint.location}
                    </Text>
                  </Flex>
                  <Divider my="sm" />

                  <Flex direction="row" justify="space-between">
                    <Text size="14px">
                      <strong>Description:</strong> {complaint.details}
                    </Text>
                    <Flex gap="sm" ml="auto">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => handleButtonClick("details", complaint)}
                      >
                        Details
                      </Button>
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() =>
                          handleButtonClick("changeStatus", complaint)
                        }
                      >
                        Change Status
                      </Button>

                      {redirectedComplaints.includes(complaint.id) ||
                      complaint.status === 1 ? (
                        <Button variant="outline" size="xs" disabled>
                          Redirected
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() =>
                            handleButtonClick("redirect", complaint)
                          }
                        >
                          Redirect
                        </Button>
                      )}
                    </Flex>
                  </Flex>
                </Flex>
              </Paper>
            ))
          )}
        </Flex>
      </Paper>
    </Grid>
  );
}

export default UnresolvedComplaints;
