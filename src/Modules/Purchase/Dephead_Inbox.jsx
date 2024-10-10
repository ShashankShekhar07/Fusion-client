import React from "react";
import { Table, Text, Box, Button, Flex, ScrollArea } from "@mantine/core";

const indents = [
  {
    id: 1,
    name: "Atul-professot",
    email: "atul@iiitdmj.ac.in",
    fileid: "CSE-2024-9-#616",
    subject: "Furniture requirements",
    Date: "Sept 3, 2024",
  },
  {
    id: 2,
    name: "Atul-professot",
    email: "atul@iiitdmj.ac.in",
    fileid: "CSE-2024-9-#616",
    subject: "Furniture requirements",
    Date: "Sept 3, 2024",
  },
  {
    id: 3,
    name: "Atul-professot",
    email: "atul@iiitdmj.ac.in",
    fileid: "CSE-2024-9-#616",
    subject: "Furniture requirements",
    Date: "Sept 3, 2024",
  },
  {
    id: 4,
    name: "Atul-professot",
    email: "atul@iiitdmj.ac.in",
    fileid: "CSE-2024-9-#616",
    subject: "Furniture requirements",
    Date: "Sept 3, 2024",
  },
];

function Dephead_Inbox() {
  return (
    <Box p="md" style={{ margin: 10 }}>
      <Box
        mb="md"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text size="xl" style={{ paddingBottom: 15, fontWeight: "bold" }}>
          Inbox
        </Text>
      </Box>
      <ScrollArea scrollbarSize={10} type="hover">
        <Table
          style={{
            borderRadius: "8px",
            overflow: "hidden",
            border: "1px solid #E0E0E0",
          }}
        >
          <thead>
            <tr>
              <th style={{ backgroundColor: "#CCE7FF", padding: "12px" }}>
                Received as
              </th>
              <th style={{ backgroundColor: "#CCE7FF", padding: "12px" }}>
                File id
              </th>
              <th style={{ backgroundColor: "#CCE7FF", padding: "12px" }}>
                Subject
              </th>
              <th style={{ backgroundColor: "#CCE7FF", padding: "12px" }}>
                Date
              </th>
              <th style={{ backgroundColor: "#CCE7FF", padding: "12px" }}>
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
                      variant="gradient"
                      gradient={{ from: "gray", to: "gray", deg: 90 }}
                    >
                      View
                    </Button>
                    <Button
                      variant="gradient"
                      gradient={{ from: "gray", to: "gray", deg: 90 }}
                    >
                      Delete
                    </Button>
                  </Flex>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ScrollArea>
    </Box>
  );
}

export default Dephead_Inbox;
