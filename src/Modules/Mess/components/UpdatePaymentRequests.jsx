import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Container,
  Paper,
  Title,
  Button,
  Flex,
  Loader,
  Alert,
  TextInput,
} from "@mantine/core";
import { updateBalanceRequestRoute } from "../routes";

const tableHeaders = [
  "Student ID",
  "Transaction No",
  "Image",
  "Amount",
  "Payment Date",
  "Remark",
  "Accept/Reject",
];

function ViewUpdatePaymentRequests() {
  const [updatePaymentData, setUpdatePaymentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Authentication token not found.");
          return;
        }

        const response = await axios.get(updateBalanceRequestRoute, {
          headers: { Authorization: `Token ${token}` },
        });

        if (response.data && response.data.payload) {
          const filteredData = response.data.payload.filter(
            (item) => item.status !== "accept",
          );
          setUpdatePaymentData(filteredData);
        } else {
          setError("No payment request data found.");
        }
      } catch (errors) {
        setError("Error fetching payment request data.");
        console.error(errors);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      const token = localStorage.getItem("authToken");
      const item = updatePaymentData.find((items) => items.id === id);
      const payload = {
        student_id: item.student_id,
        payment_date: item.payment_date,
        amount: item.amount,
        Txn_no: item.Txn_no,
        img: item.img,
        status,
        update_payment_remark: item.remark || "",
      };
      await axios.put(updateBalanceRequestRoute, payload, {
        headers: { Authorization: `Token ${token}` },
      });
      setUpdatePaymentData((prevData) =>
        prevData.filter((items) => items.id !== id),
      );
    } catch (errors) {
      console.error(`Error updating payment request ${status}:`, errors);
      setError(`Error updating payment request: ${error.message}`);
    }
  };

  const handleRemarkChange = (id, value) => {
    setUpdatePaymentData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, remark: value } : item,
      ),
    );
  };

  return (
    <Container size="lg" mt={30} miw="75rem">
      <Paper shadow="lg" radius="lg" p="xl" withBorder>
        <Title order={2} align="center" mb="lg" style={{ color: "#1c7ed6" }}>
          Update Payment Requests
        </Title>
        {loading ? (
          <Flex justify="center" align="center" style={{ minHeight: "200px" }}>
            <Loader size="xl" />
          </Flex>
        ) : error ? (
          <Alert color="red" title="Error" mb="lg">
            {error}
          </Alert>
        ) : (
          <Table striped highlightOnHover withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                {tableHeaders.map((header, index) => (
                  <Table.Th key={index}>{header}</Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {updatePaymentData.length > 0 ? (
                updatePaymentData.map((item) => (
                  <Table.Tr key={item.id}>
                    <Table.Td>{item.student_id}</Table.Td>
                    <Table.Td>{item.Txn_no}</Table.Td>
                    <Table.Td>
                      <a
                        href={item.img}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={item.img}
                          alt="Payment"
                          style={{ width: "50px", cursor: "pointer" }}
                        />
                      </a>
                    </Table.Td>
                    <Table.Td>{item.amount}</Table.Td>
                    <Table.Td>{item.payment_date}</Table.Td>
                    <Table.Td>
                      <TextInput
                        value={item.remark || ""}
                        onChange={(e) =>
                          handleRemarkChange(item.id, e.target.value)
                        }
                        placeholder="Enter remark"
                        size="xs"
                      />
                    </Table.Td>
                    <Table.Td>
                      <Button
                        color="green"
                        size="xs"
                        onClick={() => handleStatusUpdate(item.id, "accept")}
                        style={{ marginRight: "8px" }}
                      >
                        Accept
                      </Button>
                      <Button
                        color="red"
                        size="xs"
                        onClick={() => handleStatusUpdate(item.id, "reject")}
                      >
                        Reject
                      </Button>
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={7} style={{ textAlign: "center" }}>
                    No payment requests available.
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        )}
      </Paper>
    </Container>
  );
}

export default ViewUpdatePaymentRequests;
