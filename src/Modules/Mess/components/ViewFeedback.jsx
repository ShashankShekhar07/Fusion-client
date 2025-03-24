import React, { useEffect, useState } from "react";
import { Table, Container, Paper, Title, Button, Flex } from "@mantine/core";
import * as PhosphorIcons from "@phosphor-icons/react";
import { feedbackRoute } from "../routes";

const tableHeader = [
  "Date",
  "Student ID",
  "Description",
  "Mess",
  "Status",
  "Actions",
];

function ViewFeedback() {
  const [activeTab, setActiveTab] = useState("Food");
  const [feedbackData, setFeedbackData] = useState([]);
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    fetch(feedbackRoute, {
      method: "GET",
      headers: {
        Authorization: `Token ${authToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setFeedbackData(
          data.payload.map((feedback) => ({
            ...feedback,
            status: "Unread", // Initialize status
          })),
        );
      })
      .catch((error) => {
        console.error("Error fetching feedback data:", error);
      });
  }, [authToken]);

  const markAsRead = (index, feedback) => {
    fetch(feedbackRoute, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        student_id: feedback.student_id,
        mess: feedback.mess,
        feedback_type: feedback.feedback_type,
        description: feedback.description,
        fdate: feedback.fdate,
      }),
    })
      .then((response) => {
        if (response.ok) {
          // Update the status in the state instead of removing the item
          setFeedbackData((prevData) =>
            prevData.map((item, i) =>
              i === index ? { ...item, status: "Read" } : item,
            ),
          );
        } else {
          console.error("Failed to delete feedback:", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Error deleting feedback:", error);
      });
  };

  const filteredFeedback = feedbackData.filter(
    (feedback) => feedback.feedback_type === activeTab,
  );

  const renderRows = () =>
    filteredFeedback.map((item, index) => (
      <Table.Tr key={index}>
        <Table.Td align="center">{item.fdate}</Table.Td>
        <Table.Td align="center">{item.student_id}</Table.Td>
        <Table.Td align="center">{item.description}</Table.Td>
        <Table.Td align="center">{item.mess}</Table.Td>
        <Table.Td align="center">{item.status}</Table.Td>
        <Table.Td align="center">
          <Button
            onClick={() => markAsRead(index, item)}
            variant="outline"
            color={item.status === "Unread" ? "red" : "gray"}
            size="xs"
            disabled={item.status === "Read"} // Disable button for "Read" feedback
          >
            {item.status === "Unread" ? "Mark as Read" : "Read"}
          </Button>
        </Table.Td>
      </Table.Tr>
    ));

  const renderHeader = (titles) => {
    return titles.map((title, index) => (
      <Table.Th key={index}>
        <Flex align="center" justify="center" h="100%">
          {title}
        </Flex>
      </Table.Th>
    ));
  };

  return (
    <Container size="lg" mt={30} miw="75rem">
      <Paper shadow="md" radius="md" p="lg" withBorder>
        <Title order={2} align="center" mb="lg" c="#1c7ed6">
          View Feedback
        </Title>

        {/* Tabs for filtering feedback */}
        <Flex justify="center" align="center" mb={30} gap={20}>
          <Button
            onClick={() => setActiveTab("Food")}
            leftSection={<PhosphorIcons.ForkKnife size={20} />}
            variant={activeTab === "Food" ? "filled" : "outline"}
            size="xs"
          >
            Food
          </Button>
          <Button
            onClick={() => setActiveTab("Cleanliness")}
            leftSection={<PhosphorIcons.Broom size={20} />}
            variant={activeTab === "Cleanliness" ? "filled" : "outline"}
            size="xs"
          >
            Cleanliness
          </Button>
          <Button
            onClick={() => setActiveTab("Maintenance")}
            leftSection={<PhosphorIcons.Wrench size={20} />}
            variant={activeTab === "Maintenance" ? "filled" : "outline"}
            size="xs"
          >
            Maintenance
          </Button>
          <Button
            onClick={() => setActiveTab("Others")}
            leftSection={<PhosphorIcons.ChatText size={20} />}
            variant={activeTab === "Others" ? "filled" : "outline"}
            size="xs"
          >
            Others
          </Button>
        </Flex>

        {/* Feedback Table */}
        <Table striped highlightOnHover withColumnBorders>
          <Table.Thead>
            <Table.Tr>{renderHeader(tableHeader)}</Table.Tr>
          </Table.Thead>
          <Table.Tbody>{renderRows()}</Table.Tbody>
        </Table>
      </Paper>
    </Container>
  );
}

export default ViewFeedback;
