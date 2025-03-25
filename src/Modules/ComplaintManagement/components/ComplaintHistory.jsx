import React, { useState, useEffect } from "react";
import {
  Paper,
  Group,
  Badge,
  Title,
  Text,
  Button,
  Grid,
  Center,
  Loader,
  Flex,
  Divider,
} from "@mantine/core";
import { useSelector } from "react-redux";
import ComplaintDetails from "./ComplaintDetails";
import { getComplaintsByRole } from "../routes/api"; // Import the utility function
import detailIcon from "../../../assets/detail.png";
import declinedIcon from "../../../assets/declined.png";
import resolvedIcon from "../../../assets/resolved.png";

function ComplaintHistory() {
  const [activeTab, setActiveTab] = useState("pending");
  const [complaints, setComplaints] = useState({
    pending: [],
    resolved: [],
    declined: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const role = useSelector((state) => state.user.role);

  useEffect(() => {
    const fetchComplaints = async () => {
      setIsLoading(true);
      setIsError(false);
      const token = localStorage.getItem("authToken");

      const response = await getComplaintsByRole(role, token);

      if (response.success) {
        const { data } = response;
        const pending = data.filter((c) => c.status === 0);
        const resolved = data.filter((c) => c.status === 2);
        const declined = data.filter((c) => c.status === 3);

        setComplaints({ pending, resolved, declined });
      } else {
        console.error("Error fetching complaints:", response.error);
        setIsError(true);
      }
      setIsLoading(false);
    };

    fetchComplaints();
  }, [role]);

  const getComplaints = () => complaints[activeTab];

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
    <Grid mt="xl" style={{ width: "100%", paddingInline: "49px" }}>
      <Paper
        radius="md"
        px="lg"
        pt="sm"
        pb="xl"
        style={{
          borderLeft: "0.6rem solid #15ABFF",
          width: showDetails ? "70vw" : "100%",
          backgroundColor: "white",
          overflow: "hidden",
          maxHeight: "65vh",
        }}
        withBorder
      >
        {showDetails ? (
          <ComplaintDetails
            complaintId={selectedComplaintId}
            onBack={() => setShowDetails(false)}
          />
        ) : (
          <>
            <Title order={3} mb="md" size="24px">
              Complaint History
            </Title>
            <Group spacing="sm" mb="md">
              {["pending", "resolved", "declined"].map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? "filled" : "outline"}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    backgroundColor: activeTab === tab ? "#15ABFF" : "white",
                    color: activeTab === tab ? "white" : "black",
                    padding: "8px 10px",
                    fontSize: "14px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {`${tab.charAt(0).toUpperCase() + tab.slice(1)} Complaints`}
                </Button>
              ))}
            </Group>

            <div
              className="inner-card-content"
              style={{
                maxHeight: "50vh",
                overflowY: "auto",
                width: "100%",
              }}
            >
              {isLoading ? (
                <Center style={{ minHeight: "45vh" }}>
                  <Loader size="xl" variant="bars" />
                </Center>
              ) : isError ? (
                <Center style={{ minHeight: "45vh" }}>
                  <Text color="red" size="14px">
                    Failed to fetch complaints. Please try again.
                  </Text>
                </Center>
              ) : getComplaints().length === 0 ? (
                <Center style={{ minHeight: "45vh" }}>
                  <Text size="14px">No {activeTab} complaints available.</Text>
                </Center>
              ) : (
                getComplaints().map((complaint, index) => (
                  <Paper
                    key={index}
                    radius="md"
                    px="lg"
                    pt="sm"
                    pb="xl"
                    style={{
                      width: "100%",
                      margin: "10px 0",
                    }}
                    withBorder
                  >
                    <Flex direction="column" style={{ width: "100%" }}>
                      <Flex direction="row" justify="space-between">
                        <Flex direction="row" gap="xs" align="center">
                          <Text size="14px" style={{ fontWeight: "Bold" }}>
                            Complaint Id: {complaint.id}
                          </Text>
                          <Badge
                            size="lg"
                            color={activeTab === "resolved" ? "green" : "blue"}
                          >
                            {complaint.complaint_type}
                          </Badge>
                        </Flex>
                        {activeTab === "resolved" ? (
                          <img
                            src={resolvedIcon}
                            alt="Resolved"
                            style={{
                              width: "35px",
                              borderRadius: "50%",
                              backgroundColor: "#2BB673",
                              padding: "10px",
                            }}
                          />
                        ) : activeTab === "declined" ? (
                          <img
                            src={declinedIcon}
                            alt="Declined"
                            style={{
                              width: "35px",
                              borderRadius: "50%",
                              backgroundColor: "#FF6B6B",
                              padding: "10px",
                            }}
                          />
                        ) : (
                          <img
                            src={detailIcon}
                            alt="Pending"
                            style={{
                              width: "35px",
                              borderRadius: "50%",
                              backgroundColor: "#FF6B6B",
                              padding: "10px",
                            }}
                          />
                        )}
                      </Flex>
                      <Flex
                        direction="row"
                        justify="space-between"
                        align="center"
                      >
                        <Flex direction="column" gap="xs">
                          <Text size="14px">
                            <b>Date:</b>{" "}
                            {formatDateTime(complaint.complaint_date)}
                          </Text>
                          <Text size="14px">
                            <b>Location:</b> {complaint.specific_location},{" "}
                            {complaint.location}
                          </Text>
                        </Flex>
                      </Flex>
                      <Divider my="md" size="sm" />
                      <Flex
                        direction="row"
                        justify="space-between"
                        align="center"
                      >
                        <Text size="14px">
                          <b>Description:</b> {complaint.details}
                        </Text>
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => {
                            setSelectedComplaintId(complaint.id);
                            setShowDetails(true);
                          }}
                        >
                          Details
                        </Button>
                      </Flex>
                    </Flex>
                  </Paper>
                ))
              )}
            </div>
          </>
        )}
      </Paper>
    </Grid>
  );
}

export default ComplaintHistory;
