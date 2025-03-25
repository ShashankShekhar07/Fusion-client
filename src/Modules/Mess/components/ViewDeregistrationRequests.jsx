import React, { useState, useEffect } from "react";
import {
  Table,
  Container,
  Paper,
  Title,
  Button,
  Flex,
  TextInput,
} from "@mantine/core";
import axios from "axios";
import { deregistrationRequestRoute } from "../routes";

function ViewDeregistrationRequests() {
  const [deregistrationData, setDeregistrationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeregistrationRequests = async () => {
      try {
        const response = await axios.get(deregistrationRequestRoute, {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        });
        console.log(response.data.payload);
        setDeregistrationData(
          response.data.payload.map((item) => ({
            ...item,
            remark: item.deregistration_remark,
          })),
        );
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchDeregistrationRequests();
  }, []);

  const handleUpdate = async (index, newStatus) => {
    try {
      const item = deregistrationData[index];
      const data = {
        student_id: item.student_id,
        end_date: item.end_date,
        status: newStatus,
        deregistration_remark: item.remark,
      };

      const response = await axios.put(deregistrationRequestRoute, data, {
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.status === 200) {
        setDeregistrationData((prevData) =>
          prevData.map((request, i) =>
            i === index ? { ...request, status: newStatus } : request,
          ),
        );
        alert("Request updated successfully!");
      } else {
        alert("Failed to update request");
      }
    } catch (err) {
      setError(`Error updating request: ${err}`);
    }
  };

  const handleRemarkChange = (index, newRemark) => {
    setDeregistrationData((prevData) =>
      prevData.map((request, i) =>
        i === index ? { ...request, remark: newRemark } : request,
      ),
    );
  };

  const renderRows = () =>
    deregistrationData.map((item, index) => (
      <Table.Tr key={index}>
        <Table.Td align="center" p={12}>
          {item.student_id}
        </Table.Td>
        <Table.Td align="center" p={12}>
          {item.end_date}
        </Table.Td>
        <Table.Td align="center" p={12}>
          <TextInput
            value={item.remark}
            onChange={(e) => handleRemarkChange(index, e.target.value)}
            placeholder="Enter remark"
          />
        </Table.Td>
        <Table.Td align="center" p={12}>
          <Button
            onClick={() => handleUpdate(index, "accept")}
            variant="filled"
            color="green"
            size="xs"
            disabled={item.status === "accept" || item.status === "reject"}
            style={{ marginRight: "8px" }}
          >
            Accept
          </Button>
          <Button
            onClick={() => handleUpdate(index, "reject")}
            variant="filled"
            color="red"
            size="xs"
            disabled={item.status === "accept" || item.status === "reject"}
          >
            Reject
          </Button>
        </Table.Td>
      </Table.Tr>
    ));

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container size="lg" mt={30} miw="75rem">
      <Paper shadow="md" radius="md" p="lg" withBorder>
        <Title order={2} align="center" mb="lg" style={{ color: "#1c7ed6" }}>
          Deregistration Requests
        </Title>

        <Table striped highlightOnHover withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>
                <Flex align="center" justify="center" h="100%">
                  Student ID
                </Flex>
              </Table.Th>
              <Table.Th>
                <Flex align="center" justify="center" h="100%">
                  End Date
                </Flex>
              </Table.Th>
              <Table.Th>
                <Flex align="center" justify="center" h="100%">
                  Remark
                </Flex>
              </Table.Th>
              <Table.Th>
                <Flex align="center" justify="center" h="100%">
                  Action
                </Flex>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>{renderRows()}</Table.Tbody>
        </Table>
      </Paper>
    </Container>
  );
}

export default ViewDeregistrationRequests;
