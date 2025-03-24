import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, Container, Paper, Title, Box } from "@mantine/core";
import { specialFoodRequestRoute } from "../routes";

function SpecialFoodStatus() {
  const roleno = useSelector((state) => state.user.roll_no); // Use Redux state for roll number
  const [specialFoodData, setSpecialFoodData] = useState([]); // Store special food data
  const authToken = localStorage.getItem("authToken"); // Get auth token from localStorage

  // Fetch special food data
  useEffect(() => {
    fetch(specialFoodRequestRoute, {
      method: "GET",
      headers: {
        Authorization: `Token ${authToken}`, // Corrected syntax for the Authorization header
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.payload.filter(
          (request) => request.student_id === roleno,
        );

        // Sort the data by app_date in descending order
        const sortedData = filteredData.sort((a, b) => {
          const dateA = new Date(a.app_date);
          const dateB = new Date(b.app_date);
          return dateB - dateA; // Sort in descending order
        });

        setSpecialFoodData(sortedData);
      })
      .catch((error) => {
        console.error("Error fetching special food data:", error);
      });
  }, [authToken, roleno]);

  const renderHeader = () => (
    <Table.Tr>
      <Table.Th>Application Date</Table.Th>
      <Table.Th>Purpose</Table.Th>
      <Table.Th>From</Table.Th>
      <Table.Th>To</Table.Th>
      <Table.Th>Status</Table.Th>
    </Table.Tr>
  );

  const renderRows = () =>
    specialFoodData.map((item, index) => (
      <Table.Tr key={index}>
        <Table.Td>{item.app_date}</Table.Td>
        <Table.Td>{item.request}</Table.Td>
        <Table.Td>{item.start_date}</Table.Td>
        <Table.Td>{item.end_date}</Table.Td>
        <Table.Td>
          <Box
            style={{
              padding: "8px",
              fontWeight: "600",
              color:
                item.status === "2" // Approved
                  ? "white"
                  : item.status === "1" // Pending
                    ? "black"
                    : "white", // Declined (Red background, White text)
              backgroundColor:
                item.status === "2" // Approved
                  ? "#40C057"
                  : item.status === "1" // Pending
                    ? "#FFC107"
                    : "#DC3545", // Declined (Red)
              border: `1.5px solid ${
                item.status === "2"
                  ? "#40C057"
                  : item.status === "1"
                    ? "#FFC107"
                    : "#DC3545" // Declined (Red border)
              }`,
              borderRadius: "4px",
            }}
          >
            {
              item.status === "2" // Approved
                ? "Approved"
                : item.status === "1" // Pending
                  ? "Pending"
                  : "Declined" // Declined
            }
          </Box>
        </Table.Td>
      </Table.Tr>
    ));

  return (
    <Container
      size="lg"
      style={{
        display: "flex",
        justifyContent: "center", // Centers the form horizontally
        marginTop: "20px",
      }}
    >
      <Paper
        shadow="md"
        radius="md"
        p="xl"
        withBorder
        style={{
          width: "100%",
          minWidth: "70rem", // Set the min-width to 75rem
          padding: "2rem", // Add padding for better spacing
        }}
      >
        <Title order={2} align="center" mb="lg" style={{ color: "#1c7ed6" }}>
          Special Food Status
        </Title>
        <Table striped highlightOnHover withBorder withColumnBorders>
          <Table.Thead>{renderHeader()}</Table.Thead>
          <Table.Tbody>{renderRows()}</Table.Tbody>
        </Table>
      </Paper>
    </Container>
  );
}

export default SpecialFoodStatus;
