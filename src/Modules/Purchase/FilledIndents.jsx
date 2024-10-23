import { MantineProvider, Table, Button, Text, Box } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

function FiledIndentsTable() {
  const navigate = useNavigate();
  const [fileIndent, setFileIndent] = useState([]); // State for indents data
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling
  // const navigate = useNavigate();
  const role = useSelector((state) => state.user.role);
  const username = useSelector((state) => state.user.username);
  console.log(role);
  // const [department, setDepartment] = useState("");
  // console.log(useSelector((state) => state.user));
  // const fetchIndents
  // useEffect(() => {
  //   // Fetch indents from the server using HoldsDesignation ID from local storage

  //   fetchIndents(); // Call the function to fetch indents
  // }, []); // Empty dependency array to run effect on mount

  const fetchIndents = async () => {
    try {
      const token = localStorage.getItem("authToken"); // Assuming token is stored in localStorage after login
      // const holdsDesignationId = localStorage.getItem("holdsDesignationId"); // Get the HoldsDesignation ID

      const response = await axios.get(
        `http://127.0.0.1:8000/purchase-and-store/api/indentview/4322?role=${role}`, // Use dynamic HoldsDesignation ID
        {
          headers: {
            Authorization: `Token ${token}`, // Add the token in Authorization header
          },
        },
      );
      setFileIndent(response.data.Data); // Set the fetched data to indents state
      console.log(fileIndent);
      // setDepartment(response.data.department);
      setLoading(false); // Stop loading once data is fetched
    } catch (err) {
      setError("Failed to fetch indents."); // Handle errors
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndents();
  }, []);

  const remove_indent = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        "http://127.0.0.1:8000/purchase-and-store/api/delete_indent/",
        {
          file_id: id,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      fetchIndents();
    } catch (err) {
      console.error(
        "Error removing indent:",
        err.response?.data || err.message,
      );
    }
  };

  console.log(fileIndent);
  if (loading) {
    return <Text>Loading...</Text>; // Display loading state
  }

  if (error) {
    return <Text color="red">{error}</Text>; // Display error message
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
          All Filed Indents
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
              Created By
            </th>
            <th style={{ backgroundColor: "#D9EAF7", padding: "12px" }}>
              Fileid
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
          {fileIndent.map((booking) => (
            <tr key={booking.id}>
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #E0E0E0",
                  textAlign: "center",
                }}
              >
                <Text size="sm" color="dimmed">
                  {username}
                </Text>
              </td>
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #E0E0E0",
                  textAlign: "center",
                }}
              >
                {booking.draft_file.id}
              </td>
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #E0E0E0",
                  textAlign: "center",
                }}
              >
                {booking.indent.item_name ? booking.indent.item_name : "None"}
              </td>
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #E0E0E0",
                  textAlign: "center",
                }}
              >
                {booking.draft_file.upload_date}
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
                    navigate(
                      `/purchase/employeeviewfiledindent/${booking.indent.file_info}`,
                    )
                  }
                >
                  View
                </Button>
                <Button
                  variant="outline"
                  color="red"
                  onClick={() => {
                    remove_indent(booking.indent.file_info);
                  }}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Box>
  );
}

function FiledIndents() {
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
          <FiledIndentsTable />
        </Box>
      </Box>
    </MantineProvider>
  );
}

export default FiledIndents;
