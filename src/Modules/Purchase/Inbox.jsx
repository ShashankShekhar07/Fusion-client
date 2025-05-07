import React, { useState, useEffect } from "react";
import { Table, Button, Text, Box, TextInput, Card } from "@mantine/core";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CaretUp, CaretDown, ArrowsDownUp } from "@phosphor-icons/react";
import { viewIndentByUsernameAndRoleRoute2 } from "../../routes/purchaseRoutes";

export default function Outboxfunc() {
  const [inbox, setInbox] = useState([]); // State for indents data
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling
  const navigate = useNavigate();
  const role = useSelector((state) => state.user.role);
  const username = useSelector((state) => state.user.roll_no);
  console.log(useSelector((state) => state.user));
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchQuery, setSearchQuery] = useState("");
  // const [department, setDepartment] = useState("");
  // console.log(useSelector((state) => state.user));
  // const desigid = useSelector((state) => state.user.Holds_designation);
  const sortedFiles = [...inbox].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const direction = sortConfig.direction === "asc" ? 1 : -1;
    return a[sortConfig.key] > b[sortConfig.key] ? direction : -direction;
  });
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
  const filteredFiles = sortedFiles.filter((file) => {
    const idString = `${file.branch}-${new Date(file.upload_date).getFullYear()}-
                      ${(new Date(file.upload_date).getMonth() + 1)
                        .toString()
                        .padStart(2, "0")}
                      -#${file.id}`;
    return (
      file.uploader.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.sent_by_user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idString.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      formatDate(file.upload_date)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      file.sent_by_designation.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };
  useEffect(() => {
    // Fetch indents from the server using HoldsDesignation ID from local storage
    const fetchIndents = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Assuming token is stored in localStorage after login
        // const holdsDesignationId = localStorage.getItem("holdsDesignationId"); // Get the HoldsDesignation ID
        // console.log("me");
        console.log(username);
        console.log(role);
        const response = await axios.get(
          viewIndentByUsernameAndRoleRoute2(username, role),
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          },
        );
        // const filteredData = response.data.in_file.filter(
        //   (item) => item.receiver_designation_name === role,
        // );
        setInbox(response.data.in_file); // Set the fetched data to indents state
        // setDepartment(response.data.department);
        setLoading(false); // Stop loading once data is fetched
      } catch (err) {
        setError("Failed to fetch indents."); // Handle errors
        setLoading(false);
      }
    };

    fetchIndents(); // Call the function to fetch indents
  }, [role]); // Empty dependency array to run effect on mount
  if (loading) {
    return <Text>Loading...</Text>; // Display loading state
  }

  if (error) {
    return <Text color="red">{error}</Text>; // Display error message
  }
  // const navigate = useNavigate();
  console.log(inbox);

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{
        backgroundColor: "#F5F7F8",
        position: "absolute",
        height: "70vh",
        width: "90vw",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
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
          Inbox
        </Text>
        <TextInput
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: "10px", marginLeft: "auto" }}
        />
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
          <tr style={{ backgroundColor: "#D9EAF7" }}>
            {[
              { key: "uploader", label: "Uploader" },
              { key: "sent_by_user", label: "Sent By" },
              { key: "id", label: "File Id" },
              { key: "subject", label: "Subject" },
              { key: "upload_date", label: "Date" },
            ].map(({ key, label }) => (
              <th
                key={key}
                onClick={() => handleSort(key)}
                style={{
                  cursor: "pointer",
                  padding: "12px",
                  width: "15.5%",
                  border: "1px solid #D9EAF7",
                  alignItems: "center",
                  gap: "5px",
                  textAlign: "center",
                }}
              >
                {label}
                {sortConfig.key === key ? (
                  sortConfig.direction === "asc" ? (
                    <CaretUp size={16} />
                  ) : (
                    <CaretDown size={16} />
                  )
                ) : (
                  <ArrowsDownUp size={16} opacity={0.6} />
                )}
              </th>
            ))}
            <th
              style={{
                padding: "12px",
                width: "8.5%",
                border: "1px solid #ddd",
              }}
            >
              View File
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredFiles && filteredFiles.length > 0 ? (
            filteredFiles.map((booking, index) => (
              <tr
                key={booking.id}
                style={{
                  backgroundColor: index % 2 === 0 ? "#f8fafb" : "white",
                }}
              >
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  {booking.uploader}
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  {booking.sent_by_user}
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
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  {booking.subject ? booking.subject : "No Subject"}
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  {formatDate(booking.upload_date)}
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  <Button
                    color="green"
                    style={{ marginRight: "8px" }}
                    onClick={() =>
                      navigate(`/purchase/forward_indent/${booking.id}`)
                    }
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                style={{
                  textAlign: "center",
                  padding: "24px",
                  color: "black",
                  fontSize: "16px",
                  backgroundColor: "#e0e3e5",
                }}
              >
                <strong>No indent found</strong>
                <div
                  style={{ marginTop: "4px", fontSize: "14px", color: "black" }}
                >
                  Start by creating one to see it listed here.
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Card>
  );
}
