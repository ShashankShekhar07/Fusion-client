import React, { useState, useEffect } from "react";
import {
  Table,
  Container,
  Paper,
  Title,
  Button,
  Flex,
  Loader,
  Alert,
} from "@mantine/core";
import axios from "axios";
import * as PhosphorIcons from "@phosphor-icons/react"; // Icons for tabs
import { specialFoodRequestRoute } from "../routes";

const tableHeader = [
  "Date",
  "Student ID",
  "Food",
  "Reason",
  "From",
  "To",
  "Approval",
];

function ViewSpecialFoodRequest() {
  const [foodRequestData, setFoodRequestData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  // Fetch special food requests from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Authentication token not found.");
          return;
        }

        const response = await axios.get(specialFoodRequestRoute, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (response.data && response.data.payload) {
          setFoodRequestData(response.data.payload);
        } else {
          setError("No special food request data found.");
        }
      } catch (err) {
        setError("Error fetching special food requests.");
        console.error("Error fetching special food requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleApproval = (id, index) => {
    // Update state locally without backend interaction
    setFoodRequestData((prevData) =>
      prevData.map((request, i) =>
        i === index ? { ...request, approve: !request.approve } : request,
      ),
    );
  };

  // Filter requests based on active tab
  const filteredFoodRequestData = foodRequestData.filter((request) => {
    if (activeTab === "approved") return request.approve;
    if (activeTab === "unapproved") return !request.approve;
    return true;
  });

  // Render food request table rows
  const renderRows = () =>
    filteredFoodRequestData.map((item, index) => (
      <Table.Tr key={index} h={50}>
        <Table.Td align="center" p={12}>
          {item.app_date}
        </Table.Td>
        <Table.Td align="center" p={12}>
          {item.student_id}
        </Table.Td>
        <Table.Td align="center" p={12}>
          {item.item1}
        </Table.Td>
        <Table.Td align="center" p={12}>
          {item.request}
        </Table.Td>
        <Table.Td align="center" p={12}>
          {item.start_date}
        </Table.Td>
        <Table.Td align="center" p={12}>
          {item.end_date}
        </Table.Td>
        <Table.Td align="center" p={12}>
          <Button
            onClick={() => toggleApproval(item.id, index)}
            variant={item.approve ? "filled" : "outline"}
            color={item.approve ? "green" : "red"}
            size="xs"
          >
            {item.approve ? "Approved" : "Not Approved"}
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
          View Special Food Requests
        </Title>

        {/* Error and Loading State */}
        {loading ? (
          <Flex justify="center" align="center" style={{ minHeight: "200px" }}>
            <Loader size="xl" />
          </Flex>
        ) : error ? (
          <Alert color="red" title="Error" mb="lg">
            {error}
          </Alert>
        ) : (
          <>
            {/* Tabs for filtering food requests */}
            <Flex justify="center" align="center" mb={30} gap={20}>
              <Button
                onClick={() => setActiveTab("all")}
                leftSection={<PhosphorIcons.Eye size={20} />}
                variant={activeTab === "all" ? "filled" : "outline"}
                size="xs"
              >
                All Requests
              </Button>
              <Button
                onClick={() => setActiveTab("approved")}
                leftSection={<PhosphorIcons.Check size={20} />}
                variant={activeTab === "approved" ? "filled" : "outline"}
                size="xs"
              >
                Approved
              </Button>
              <Button
                onClick={() => setActiveTab("unapproved")}
                leftSection={<PhosphorIcons.XCircle size={20} />}
                variant={activeTab === "unapproved" ? "filled" : "outline"}
                size="xs"
              >
                Unapproved
              </Button>
            </Flex>

            {/* Table */}
            <Table striped highlightOnHover withBorder withColumnBorders>
              <Table.Thead>
                <Table.Tr>{renderHeader(tableHeader)}</Table.Tr>
              </Table.Thead>
              <Table.Tbody>{renderRows()}</Table.Tbody>
            </Table>
          </>
        )}
      </Paper>
    </Container>
  );
}

export default ViewSpecialFoodRequest;
