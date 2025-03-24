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
  Textarea,
  Select,
  ScrollArea, // Import ScrollArea from Mantine
} from "@mantine/core";
import { registrationRequestRoute } from "../routes";

const tableHeaders = [
  "Student ID",
  "Txn No",
  "Image",
  "Amount",
  "Start Date",
  "Payment Date",
  "Mess Option",
  "Remark",
  "Status",
  "Action",
];

function ViewRegistration() {
  const [registrationData, setRegistrationData] = useState([]);
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

        const response = await axios.get(registrationRequestRoute, {
          headers: { Authorization: `Token ${token}` },
        });

        if (response.data && response.data.payload) {
          setRegistrationData(response.data.payload);
        } else {
          setError("No registration data found.");
        }
      } catch (errors) {
        setError("Error fetching registration data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (item, status) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authentication token not found.");
        return;
      }

      const updatedData = {
        student_id: item.student_id,
        start_date: item.start_date,
        payment_date: item.payment_date,
        amount: item.amount,
        Txn_no: item.Txn_no,
        img: item.img,
        status,
        registration_remark: item.registration_remark,
        mess_option: item.mess_option,
      };

      const response = await axios.put(registrationRequestRoute, updatedData, {
        headers: { Authorization: `Token ${token}` },
      });

      if (response.status === 200) {
        setRegistrationData((prevData) =>
          prevData.filter((entry) => entry.id !== item.id),
        );
      }
    } catch (errors) {
      setError("Failed to update registration status.");
    }
  };

  const handleRemarkChange = (id, remark) => {
    setRegistrationData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, registration_remark: remark } : item,
      ),
    );
  };

  const handleMessOptionChange = (id, messOption) => {
    setRegistrationData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, mess_option: messOption } : item,
      ),
    );
  };

  return (
    <Container size="lg" mt={30} style={{ width: "100%", padding: 0 }}>
      <Paper shadow="lg" radius="lg" p="md" withBorder>
        <Title order={2} align="center" mb="md" style={{ color: "#1c7ed6" }}>
          Registration Requests
        </Title>

        {loading ? (
          <Flex justify="center" align="center" style={{ minHeight: "200px" }}>
            <Loader size="xl" />
          </Flex>
        ) : error ? (
          <Alert color="red" title="Error" mb="md">
            {error}
          </Alert>
        ) : (
          <ScrollArea
            style={{ height: "60vh", overflowX: "auto", width: "100%" }}
          >
            <Table
              striped
              highlightOnHover
              withColumnBorders
              style={{ tableLayout: "fixed", width: "100%" }}
            >
              <Table.Thead>
                <Table.Tr>
                  {tableHeaders.map((header, index) => (
                    <Table.Th
                      key={index}
                      style={{
                        padding: "4px",
                        fontSize: "12px",
                        minWidth: "100px",
                      }}
                    >
                      {header}
                    </Table.Th>
                  ))}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {registrationData.length > 0 ? (
                  registrationData
                    .filter((item) => item.status !== "accept") // Filter out accepted rows
                    .map((item) => (
                      <Table.Tr key={item.id}>
                        <Table.Td style={{ padding: "4px", fontSize: "12px" }}>
                          {item.student_id}
                        </Table.Td>
                        <Table.Td style={{ padding: "4px", fontSize: "12px" }}>
                          {item.Txn_no}
                        </Table.Td>
                        <Table.Td style={{ padding: "4px" }}>
                          <a
                            href={item.img}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={item.img}
                              alt="Student"
                              style={{ width: "30px", height: "30px" }}
                            />
                          </a>
                        </Table.Td>
                        <Table.Td style={{ padding: "4px", fontSize: "12px" }}>
                          {item.amount}
                        </Table.Td>
                        <Table.Td style={{ padding: "4px", fontSize: "12px" }}>
                          {item.start_date}
                        </Table.Td>
                        <Table.Td style={{ padding: "4px", fontSize: "12px" }}>
                          {item.payment_date}
                        </Table.Td>
                        <Table.Td style={{ padding: "4px" }}>
                          <Select
                            data={[
                              { value: "mess1", label: "M1" },
                              { value: "mess2", label: "M2" },
                            ]}
                            value={item.mess_option || ""}
                            onChange={(value) =>
                              handleMessOptionChange(item.id, value)
                            }
                            placeholder="Mess"
                            size="xs"
                          />
                        </Table.Td>
                        <Table.Td style={{ padding: "4px" }}>
                          <Textarea
                            value={item.registration_remark || ""}
                            onChange={(e) =>
                              handleRemarkChange(item.id, e.target.value)
                            }
                            placeholder="Remark"
                            autosize
                            minRows={1}
                            maxRows={2}
                            size="xs"
                          />
                        </Table.Td>
                        <Table.Td style={{ padding: "4px", fontSize: "12px" }}>
                          {item.status || "N/A"}
                        </Table.Td>
                        <Table.Td style={{ padding: "4px" }}>
                          <Button
                            color="green"
                            size="xs"
                            onClick={() => handleStatusChange(item, "accept")}
                            style={{ marginRight: "4px" }}
                          >
                            ✓
                          </Button>
                          <Button
                            color="red"
                            size="xs"
                            onClick={() => handleStatusChange(item, "reject")}
                          >
                            ✗
                          </Button>
                        </Table.Td>
                      </Table.Tr>
                    ))
                ) : (
                  <Table.Tr>
                    <Table.Td colSpan={10} style={{ textAlign: "center" }}>
                      No registration data available.
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        )}
      </Paper>
    </Container>
  );
}

export default ViewRegistration;
