import React, { useState, useEffect } from "react";
import { MantineProvider, Table, Button, Text, Box, Flex } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { outboxViewRoute2 } from "../../routes/purchaseRoutes";

function OutboxTable() {
  const [outbox, setOutbox] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const role = useSelector((state) => state.user.role);
  const username = useSelector((state) => state.user.roll_no);

  useEffect(() => {
    const fetchIndents = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(outboxViewRoute2(username, role), {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setOutbox(response.data.in_file);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch indents.");
        setLoading(false);
      }
    };

    fetchIndents();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text style={{ color: "red" }}>{error}</Text>;
  }

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // Optional: Change to 24-hour format if needed
    });
  };

  return (
    <Box p="md" style={{ margin: 0 }}>
      <Box
        mb="md"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          size="26px"
          style={{
            fontWeight: "bold",
            textAlign: "center",
            color: "#1881d9",
          }}
        >
          Outbox
        </Text>
      </Box>
      <Table
        style={{
          backgroundColor: "#f3f9ff",
          borderRadius: "8px",
          overflow: "hidden",
          border: "1px solid #E0E0E0",
        }}
      >
        <thead>
          <tr style={{ textAlign: "center" }}>
            <th
              style={{
                backgroundColor: "white",
                padding: "12px",
                textAlign: "center",
              }}
            >
              Send to
            </th>
            <th
              style={{
                backgroundColor: "white",
                padding: "12px",
                textAlign: "center",
              }}
            >
              File Id
            </th>
            <th
              style={{
                backgroundColor: "white",
                padding: "12px",
                textAlign: "center",
              }}
            >
              Date
            </th>
            <th
              style={{
                backgroundColor: "white",
                padding: "12px",
                textAlign: "center",
              }}
            >
              Features
            </th>
          </tr>
        </thead>
        <tbody>
          {outbox.map((row, index) => (
            <tr
              key={row.id}
              style={{ backgroundColor: index % 2 === 0 ? "#f8fafb" : "white" }}
            >
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #E0E0E0",
                  textAlign: "center",
                }}
              >
                <Text weight={500}>{row.receiver_username}</Text>
              </td>
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #E0E0E0",
                  textAlign: "center",
                }}
              >
                {row.id}
              </td>
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #E0E0E0",
                  textAlign: "center",
                }}
              >
                {formatDate(row.upload_date)}
              </td>
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #E0E0E0",
                  textAlign: "center",
                }}
              >
                <Flex
                  direction="row"
                  gap="md"
                  justify="center"
                  align="center"
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <Button
                    color="green"
                    style={{ marginRight: "8px" }}
                    onClick={() =>
                      navigate(`/purchase/Employeeviewfiledindent/${row.id}`)
                    }
                  >
                    View
                  </Button>
                  {/* <Button variant="outline" color="red">
                    Delete
                  </Button> */}
                </Flex>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Box>
  );
}

export default function Outbox() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          overflow: "auto",
        }}
      >
        <Box
          style={{
            maxWidth: "1440px",
            width: "100%",
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "16px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            overflowX: "auto",
            overflowY: "auto",
            maxHeight: "80vh",
          }}
        >
          <OutboxTable />
        </Box>
      </Box>
    </MantineProvider>
  );
}
