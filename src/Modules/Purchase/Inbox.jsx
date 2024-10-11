import React from "react";
import { MantineProvider, Table, Button, Text, Box } from "@mantine/core";
import { useNavigate } from "react-router-dom";

const bookings = [
  {
    id: 1,
    intender: "Atul-professor",
    email: "atul@iiitdmj.ac.in",
    fileId: "CSE-2024-9-#616",
    subject: "Furniture requirements",
    date: "Sept 3, 2024",
  },
  {
    id: 2,
    intender: "Atul-professor",
    email: "atul@iiitdmj.ac.in",
    fileId: "CSE-2024-9-#616",
    subject: "Furniture Requirements",
    date: "Sept 3, 2024",
  },
  {
    id: 3,
    intender: "Atul-professor",
    email: "atul@iiitdmj.ac.in",
    fileId: "CSE-2024-9-#616",
    subject: "Furniture requirements",
    date: "Sept 3, 2024",
  },
  {
    id: 4,
    intender: "Atul-professor",
    email: "atul@iiitdmj.ac.in",
    fileId: "CSE-2024-9-#616",
    subject: "Furniture requirements",
    date: "Sept 3, 2024",
  },
];

function InboxTable() {
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
          Inbox
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
              Received as
            </th>
            <th style={{ backgroundColor: "#D9EAF7", padding: "12px" }}>
              File Id
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
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #E0E0E0",
                  textAlign: "center",
                }}
              >
                <Text weight={500}>{booking.intender}</Text>
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
                {booking.fileId}
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
                {booking.date}
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
                  onClick={() => navigate("/purchase/viewindent")}
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

function Inbox() {
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
          <InboxTable />
        </Box>
      </Box>
    </MantineProvider>
  );
}

export default Inbox;
