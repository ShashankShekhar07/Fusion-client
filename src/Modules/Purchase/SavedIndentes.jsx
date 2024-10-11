import React from "react";
import { MantineProvider, Table, Button, Text, Box } from "@mantine/core";
import { useNavigate } from "react-router-dom";

const indents = [
  {
    id: 1,
    name: "Atul-professor",
    email: "atul@iiitdmj.ac.in",
    Fileid: "CSE-2024-9-#616",
    subject: "Furniture requirements",
    Date: "Sept 3, 2024",
  },
  {
    id: 2,
    name: "Atul-professor",
    email: "atul@iiitdmj.ac.in",
    Fileid: "CSE-2024-9-#616",
    subject: "Furniture requirements",
    Date: "Sept 3, 2024",
  },
  {
    id: 3,
    name: "Atul-professor",
    email: "atul@iiitdmj.ac.in",
    Fileid: "CSE-2024-9-#616",
    subject: "Furniture requirements",
    Date: "Sept 3, 2024",
  },
  {
    id: 4,
    name: "Atul-professor",
    email: "atul@iiitdmj.ac.in",
    Fileid: "CSE-2024-9-#616",
    subject: "Furniture requirements",
    Date: "Sept 3, 2024",
  },
];

function SavedIndentsTable() {
  const navigate = useNavigate();
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
          All Saved Indents
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
          {indents.map((booking) => (
            <tr key={booking.id}>
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #E0E0E0",
                  textAlign: "center",
                }}
              >
                <Text weight={500}>{booking.name}</Text>
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
                {booking.Fileid}
              </td>
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #E0E0E0",
                  textAlign: "center",
                }}
              >
                {booking.subject}
              </td>
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #E0E0E0",
                  textAlign: "center",
                }}
              >
                {booking.Date}
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
                  onClick={() => navigate("/purchase/viewsavedindent")}
                >
                  View
                </Button>
                <Button variant="outline" color="red">
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

function SavedIndents() {
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
          <SavedIndentsTable />
        </Box>
      </Box>
    </MantineProvider>
  );
}

export default SavedIndents;
