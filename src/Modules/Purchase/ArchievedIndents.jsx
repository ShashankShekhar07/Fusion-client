import React, { useState, useEffect } from "react";
import { MantineProvider, Table, Button, Text, Box } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

function ArchievedTable() {
  const [indents, setIndents] = useState([]); // State for indents data
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling
  // const navigate = useNavigate();
  const role = useSelector((state) => state.user.role);
  // const username = useSelector((state) => state.user.username);
  console.log(role);
  useEffect(() => {
    // Fetch indents from the server using HoldsDesignation ID from local storage
    const fetchIndents = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Assuming token is stored in localStorage after login
        // const holdsDesignationId = localStorage.getItem("holdsDesignationId"); // Get the HoldsDesignation ID

        const response = await axios.get(
          `http://127.0.0.1:8000/purchase-and-store/api/archieveview/4322?role=${role}`, // Use dynamic HoldsDesignation ID
          {
            headers: {
              Authorization: `Token ${token}`, // Add the token in Authorization header
            },
          },
        );
        console.log(response.data.archieves);
        setIndents(response.data.archieves); // Set the fetched data to indents state
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
          Archieved Indents
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
          <tr>
            <th style={{ backgroundColor: "white", padding: "12px" }}>
              Received as
            </th>
            <th style={{ backgroundColor: "white", padding: "12px" }}>
              File Id
            </th>
            {/* <th style={{ backgroundColor: "#D9EAF7", padding: "12px" }}>
              Subject
            </th> */}
            <th style={{ backgroundColor: "white", padding: "12px" }}>Date</th>
            <th style={{ backgroundColor: "white", padding: "12px" }}>
              Features
            </th>
          </tr>
        </thead>
        <tbody>
          {indents.map((booking, index) =>
            index % 2 === 0 ? (
              <tr key={booking.id} style={{ backgroundColor: "#f8fafb" }}>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  <Text weight={500}>Atul</Text>
                  <Text size="sm" color="dimmed">
                    {booking.email}
                  </Text>
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  {booking.id}
                </td>
                {/* <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #E0E0E0",
                  textAlign: "center",
                }}
              >
                {booking.subject}
              </td> */}
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  {booking.upload_date}
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  <Button
                    variant="outline"
                    color="blue"
                    style={{ marginRight: "8px" }}
                    onClick={() =>
                      navigate("/purchase/employeeviewfiledindent")
                    }
                  >
                    View
                  </Button>
                  <Button variant="outline" color="red">
                    Delete
                  </Button>
                </td>
              </tr>
            ) : (
              <tr key={booking.id} style={{ backgroundColor: "white" }}>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  <Text weight={500}>Atul</Text>
                  <Text size="sm" color="dimmed">
                    {booking.email}
                  </Text>
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  {booking.id}
                </td>
                {/* <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #E0E0E0",
                  textAlign: "center",
                }}
              >
                {booking.subject}
              </td> */}
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  {booking.upload_date}
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  <Button
                    variant="outline"
                    color="blue"
                    style={{ marginRight: "8px" }}
                    onClick={() =>
                      navigate("/purchase/employeeviewfiledindent")
                    }
                  >
                    View
                  </Button>
                  <Button variant="outline" color="red">
                    Delete
                  </Button>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </Table>
    </Box>
  );
}

function Archieved() {
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
          <ArchievedTable />
        </Box>
      </Box>
    </MantineProvider>
  );
}

export default Archieved;
