import { React, useState, useEffect } from "react";
import { MantineProvider, Table, Button, Text, Box, Flex } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

function OutboxTable() {
  const [outbox, setOutbox] = useState([]); // State for indents data
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling
  // const navigate = useNavigate();
  const role = useSelector((state) => state.user.role);
  console.log(role);
  useEffect(() => {
    // Fetch indents from the server using HoldsDesignation ID from local storage
    const fetchIndents = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Assuming token is stored in localStorage after login
        // const holdsDesignationId = localStorage.getItem("holdsDesignationId"); // Get the HoldsDesignation ID

        const response = await axios.get(
          `http://127.0.0.1:8000/purchase-and-store/api/outboxview2/4322?role=${role}`, // Use dynamic HoldsDesignation ID
          {
            headers: {
              Authorization: `Token ${token}`, // Add the token in Authorization header
            },
          },
        );
        console.log(response.data.in_file);
        setOutbox(response.data.in_file); // Set the fetched data to indents state
        // setDepartment(response.data.department);
        setLoading(false); // Stop loading once data is fetched
      } catch (err) {
        setError("Failed to fetch indents."); // Handle errors
        setLoading(false);
      }
    };

    fetchIndents(); // Call the function to fetch indents
  }, []); // Empty dependency array to run effect on mount
  if (loading) {
    return <Text>Loading...</Text>; // Display loading state
  }

  if (error) {
    return <Text style={{ color: "red" }}>{error}</Text>; // Display error message
  }
  return (
    <Box p="md" style={{ margin: 0 }}>
      {" "}
      {/* Removed margin-top completely */}
      <Box
        mb="md"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          size="xl"
          style={{
            paddingBottom: 15,
            fontWeight: "bold",
            m: "auto",
          }}
        >
          Outbox
        </Text>
      </Box>
      <Table
        style={{
          backgroundColor: "#f3f9ff", // Changed background color
          borderRadius: "8px", // Border radius for table
          overflow: "hidden", // Overflow hidden to round table corners
          border: "1px solid #E0E0E0", // Optional border for visibility
        }}
      >
        <thead>
          <tr>
            <th style={{ backgroundColor: "#D9EAF7", padding: "12px" }}>
              Send By
            </th>
            <th style={{ backgroundColor: "#D9EAF7", padding: "12px" }}>
              Send to
            </th>
            <th style={{ backgroundColor: "#D9EAF7", padding: "12px" }}>
              file Id
            </th>
            <th style={{ backgroundColor: "#D9EAF7", padding: "12px" }}>
              Subject
            </th>
            <th style={{ backgroundColor: "#D9EAF7", padding: "12px" }}>
              Date
            </th>
            <th style={{ backgroundColor: "#D9EAF7", padding: "12px" }}>
              Features
            </th>
          </tr>
        </thead>
        <tbody>
          {outbox.map((row) => (
            <tr key={row.id} style={{ backgroundColor: "#F3F9FF" }}>
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #E0E0E0",
                  textAlign: "center",
                }}
              >
                <Text weight={500}>{row.uploader}</Text>
                <Text size="sm" color="dimmed">
                  {row.email}
                </Text>
              </td>
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #E0E0E0",
                  textAlign: "center",
                }}
              >
                <Text weight={500}>{row.designation}</Text>
                <Text size="sm" color="dimmed">
                  {row.receiver_email}
                </Text>
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
                {row.subject}
              </td>
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #E0E0E0",
                  textAlign: "center",
                }}
              >
                {row.upload_date}
              </td>
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #E0E0E0",
                  textAlign: "center",
                }}
              >
                <Flex
                  direction="column"
                  gap="md"
                  justify="center"
                  align="center"
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <Button
                    variant="outline"
                    color="blue"
                    style={{ marginRight: "8px" }}
                    onClick={() =>
                      navigate("/purchase/Employeeviewfiledindent")
                    }
                  >
                    View
                  </Button>
                  <Button variant="outline" color="red">
                    Delete
                  </Button>
                </Flex>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Box>
  );
}

function Outbox() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Box
        style={{
          display: "flex",
          justifyContent: "center", // Center horizontally
          alignItems: "center", // Center vertically
          height: "80vh", // Full viewport height
          overflow: "auto", // Ensure scroll if content exceeds viewport
        }}
      >
        <Box
          style={{
            maxWidth: "1440px", // Increased max width by 20%
            width: "100%", // Make it responsive
            backgroundColor: "white",
            borderRadius: "12px", // Add border radius to outer Box
            padding: "16px", // Optional padding
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Optional shadow
            overflowX: "auto", // Horizontal scroll bar
            overflowY: "auto", // Vertical scroll bar
            maxHeight: "80vh", // Limit height to 80% of the viewport
          }}
        >
          <OutboxTable />
        </Box>
      </Box>
    </MantineProvider>
  );
}

export default Outbox;
