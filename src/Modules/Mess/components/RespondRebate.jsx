import React, { useState, useEffect } from "react";
import {
  Table,
  Container,
  Paper,
  Title,
  Button,
  TextInput,
  Flex,
  Text,
} from "@mantine/core";
import * as PhosphorIcons from "@phosphor-icons/react";
import { rebateRoute } from "../routes";

function RespondToRebateRequest() {
  const [rebateData, setRebateData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authToken = localStorage.getItem("authToken");
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    const fetchRebateRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(rebateRoute, {
          method: "GET",
          headers: {
            Authorization: `Token ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        setRebateData(
          data.payload.map((item) => ({
            ...item,
            statusText:
              item.status === "2"
                ? "Approved"
                : item.status === "0"
                  ? "Declined"
                  : "Pending",
            status: item.status || "1",
            remark: item.rebate_remark || "",
          })),
        );
      } catch (err) {
        setError(err.message || "Failed to fetch rebate requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRebateRequests();
  }, [authToken]);

  // Update remark using a unique identifier (assumed item.id exists)
  const handleRemarkChange = (id, value) => {
    setRebateData((prev) =>
      prev.map((r) => (r.id === id ? { ...r, remark: value } : r)),
    );
  };

  // Update toggleApproval to use a unique identifier (id)
  const toggleApproval = async (id, newStatus) => {
    const item = rebateData.find((r) => r.id === id);
    if (!item) return;
    const updatedRequest = {
      ...item,
      rebate_remark: item.remark,
      status: newStatus,
    };

    try {
      const response = await fetch(rebateRoute, {
        method: "PUT",
        headers: {
          Authorization: `Token ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedRequest),
      });
      if (response.ok) {
        setRebateData((prev) =>
          prev.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: newStatus,
                  statusText: newStatus === "2" ? "Approved" : "Declined",
                }
              : r,
          ),
        );
      } else {
        setError(`Failed to update approval: ${response.statusText}`);
      }
    } catch (errors) {
      setError(`Error updating approval: ${errors.message}`);
    }
  };

  const getFilteredRebateData = () => {
    switch (activeTab) {
      case "approved":
        return rebateData.filter((item) => item.status === "2");
      case "declined":
        return rebateData.filter((item) => item.status === "0");
      default:
        return rebateData.filter((item) => item.status === "1");
    }
  };

  const renderRows = () =>
    getFilteredRebateData().map((item) => (
      <Table.Tr key={item.id}>
        <Table.Td>{item.app_date}</Table.Td>
        <Table.Td>{item.student_id}</Table.Td>
        <Table.Td>{item.purpose || "No Purpose Provided"}</Table.Td>
        <Table.Td>{item.start_date}</Table.Td>
        <Table.Td>{item.end_date}</Table.Td>
        <Table.Td>
          {item.status === "1" ? (
            <TextInput
              placeholder="Enter remark"
              value={item.remark}
              onChange={(e) => handleRemarkChange(item.id, e.target.value)}
            />
          ) : (
            <Text>{item.remark || "No Remark Provided"}</Text>
          )}
        </Table.Td>
        <Table.Td>{item.statusText}</Table.Td>
        <Table.Td>
          {item.status === "1" ? (
            <>
              <Button
                onClick={() => toggleApproval(item.id, "2")}
                color="green"
              >
                Approve
              </Button>
              <Button onClick={() => toggleApproval(item.id, "0")} color="red">
                Decline
              </Button>
            </>
          ) : (
            <Text>No Actions Available</Text>
          )}
        </Table.Td>
      </Table.Tr>
    ));

  return loading ? (
    <Text align="center">Loading data...</Text>
  ) : error ? (
    <Text color="red" align="center">
      {error}
    </Text>
  ) : (
    <Container size="lg" mt={30} miw="75rem">
      <Paper shadow="md" radius="md" p="lg" withBorder>
        <Title order={2} align="center" mb="lg">
          Respond to Rebate Request
        </Title>
        <Flex justify="center" gap={20} mb={30}>
          {["pending", "approved", "declined"].map((tab) => (
            <Button
              key={tab}
              leftSection={<PhosphorIcons.Clock size={20} />}
              variant={activeTab === tab ? "filled" : "outline"}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </Flex>
        {getFilteredRebateData().length === 0 ? (
          <Text align="center">No {activeTab} requests.</Text>
        ) : (
          <Table striped highlightOnHover withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Date</Table.Th>
                <Table.Th>Student ID</Table.Th>
                <Table.Th>Purpose</Table.Th>
                <Table.Th>From</Table.Th>
                <Table.Th>To</Table.Th>
                <Table.Th>Remark</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{renderRows()}</Table.Tbody>
          </Table>
        )}
      </Paper>
    </Container>
  );
}

export default RespondToRebateRequest;
