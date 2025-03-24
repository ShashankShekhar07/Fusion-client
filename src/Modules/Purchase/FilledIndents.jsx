import React, { useState, useEffect } from "react";
import { MantineProvider, Table, Button, Text, Box } from "@mantine/core";
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

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

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
  }, [username, role]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text style={{ color: "red" }}>{error}</Text>;

  const getStatus = (row) => {
    if (row.head_approval && row.director_approval && !row.financial_approval)
      return "Approved";
    if (row.head_approval && row.director_approval && row.financial_approval)
      return "Completed";
    return "In-Progress";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "In-Progress":
        return "orange";
      case "Completed":
        return "green";
      case "Approved":
        return "blue";
      default:
        return "gray";
    }
  };

  return (
    <Box p="md">
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
          style={{ fontWeight: "bold", textAlign: "center", color: "#1881d9" }}
        >
          All Filed Indents
        </Text>
      </Box>
      <Table
        style={{
          backgroundColor: "#f3f9ff",
          borderRadius: "8px",
          overflow: "hidden",
          border: "1px solid #E0E0E0",
          width: "100%",
          tableLayout: "fixed",
        }}
      >
        <thead>
          <tr>
            <th
              style={{ padding: "12px", textAlign: "center", minWidth: "80px" }}
            >
              File Id
            </th>
            <th
              style={{
                padding: "12px",
                textAlign: "center",
                minWidth: "150px",
              }}
            >
              Indent Name
            </th>
            <th
              style={{
                padding: "12px",
                textAlign: "center",
                minWidth: "180px",
              }}
            >
              Date
            </th>
            <th
              style={{
                padding: "12px",
                textAlign: "center",
                minWidth: "120px",
              }}
            >
              Status
            </th>
            <th
              style={{
                padding: "12px",
                textAlign: "center",
                minWidth: "120px",
              }}
            >
              Features
            </th>
          </tr>
        </thead>
        <tbody>
          {outbox.map((row, index) => {
            const status = getStatus(row);
            return (
              <tr
                key={row.id}
                style={{
                  backgroundColor: index % 2 === 0 ? "#f8fafb" : "white",
                }}
              >
                <td style={{ padding: "12px", textAlign: "center" }}>
                  {row.id}
                </td>
                <td style={{ padding: "12px", textAlign: "center" }}>
                  {row.indent_name}
                </td>
                <td style={{ padding: "12px", textAlign: "center" }}>
                  {formatDate(row.upload_date)}
                </td>
                <td
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    color: getStatusColor(status),
                    fontWeight: 500,
                  }}
                >
                  {status}
                </td>
                <td style={{ padding: "12px", textAlign: "center" }}>
                  <Button
                    color="green"
                    onClick={() =>
                      navigate(`/purchase/Employeeviewfiledindent/${row.id}`)
                    }
                  >
                    View
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      ;
    </Box>
  );
}

function Outbox() {
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
            overflow: "auto",
            maxHeight: "80vh",
          }}
        >
          <OutboxTable />
        </Box>
      </Box>
    </MantineProvider>
  );
}

export default Outbox;
