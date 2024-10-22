import React from "react";
import { MantineProvider, Table, Button, Text, Box, Flex } from "@mantine/core";
import { useNavigate } from "react-router-dom";

const indents = [
  {
    id: 1,
    name: "adesh-ps_admin",
    receiver: "atul-professor",
    receiver_email: "atul@iiitdmj.ac.in",
    email: "adesh@iiitdmj.ac.in",
    fileid: "CSE-2024-9-#616",
    subject: "Furniture requirements",
    Date: "Sept 3, 2024",
  },
  {
    id: 2,
    name: "adesh-ps_admin",
    receiver: "atul-professor",
    receiver_email: "atul@iiitdmj.ac.in",
    email: "adesh@iiitdmj.ac.in",
    fileid: "CSE-2024-9-#616",
    subject: "Furniture requirements",
    Date: "Sept 3, 2024",
  },
  {
    name: "adesh-ps_admin",
    receiver: "atul-professor",
    receiver_email: "atul@iiitdmj.ac.in",
    email: "adesh@iiitdmj.ac.in",
    fileid: "CSE-2024-9-#616",
    subject: "Furniture requirements",
    Date: "Sept 3, 2024",
  },
  {
    name: "adesh-ps_admin",
    receiver: "atul-professor",
    receiver_email: "atul@iiitdmj.ac.in",
    email: "adesh@iiitdmj.ac.in",
    fileid: "CSE-2024-9-#616",
    subject: "Furniture requirements",
    Date: "Sept 3, 2024",
  },
];

function PSAdminOutboxTable() {
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
          {indents.map((row) => (
            <tr key={row.id} style={{ backgroundColor: "#F3F9FF" }}>
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #E0E0E0",
                  textAlign: "center",
                }}
              >
                <Text weight={500}>{row.name}</Text>
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
                <Text weight={500}>{row.receiver}</Text>
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
                {row.fileid}
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
                {row.Date}
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

function PSAdminOutbox() {
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
          <PSAdminOutboxTable />
        </Box>
      </Box>
    </MantineProvider>
  );
}

export default PSAdminOutbox;
