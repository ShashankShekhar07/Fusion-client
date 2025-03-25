/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  Card,
  Box,
  Button,
  ActionIcon,
  Title,
  Table,
  Text,
} from "@mantine/core";
import { Trash, ArrowLeft } from "@phosphor-icons/react";
import { notifications } from "@mantine/notifications"; // Import for notifications
import PropTypes from "prop-types";
import axios from "axios";
import { historyRoute } from "../../../routes/filetrackingRoutes";

export default function FileStatusPage({ onBack, fileID, updateFiles }) {
  const [fileHistory, setFileHistory] = useState(null); // To store API response data

  useEffect(() => {
    const getHistory = async () => {
      try {
        const response = await axios.get(`${historyRoute}${fileID}`, {
          withCredentials: true,
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        });
        setFileHistory(response.data[0]); // Set the response data
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };

    getHistory(); // Ensure the function is invoked once
  }, [fileID]);

  const convertDate = (date) => {
    const d = new Date(date);
    return d.toLocaleString();
  };

  // Function to delete the file
  const handleDelete = () => {
    notifications.show({
      title: "File Deleted",
      message: "The file has been successfully deleted.",
      color: "red",
    });
    updateFiles();
    onBack();
  };

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
        overflowY: "auto",
      }}
    >
      {/* Header with Back and Delete buttons */}
      <Card.Section>
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
            padding: "1rem",
          }}
        >
          <Button
            variant="subtle"
            onClick={onBack}
            size="md"
            style={{ marginRight: "1rem" }}
          >
            <ArrowLeft size={24} />
          </Button>
          <Title order={2} style={{ flexGrow: 1, textAlign: "center" }}>
            File Loading Status
          </Title>
          <ActionIcon
            color="red"
            variant="light"
            size="lg"
            onClick={handleDelete} // Call handleDelete on click
            title="Delete File"
          >
            <Trash size={24} />
          </ActionIcon>
        </Box>
      </Card.Section>

      {/* Display File History */}
      <Card.Section>
        {fileHistory ? (
          <Box
            style={{
              padding: "1rem",
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              marginBottom: "1rem",
            }}
          >
            <Text size="md" weight={500} style={{ marginBottom: "1rem" }}>
              File Details
            </Text>
            <Table
              withBorder
              highlightOnHover
              style={{
                borderRadius: "8px",
              }}
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Receiver</th>
                  <th>Current Holder</th>
                  <th>Designation</th>
                  <th>Remarks</th>
                  <th>Received At</th>
                  <th>Forwarded At</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{fileHistory.id}</td>
                  <td>{fileHistory.receiver_id}</td>
                  <td>{fileHistory.current_id}</td>
                  <td>{fileHistory.receive_design}</td>
                  <td>{fileHistory.remarks}</td>
                  <td>{convertDate(fileHistory.receive_date)}</td>
                  <td>{convertDate(fileHistory.forward_date)}</td>
                  <td>{fileHistory.is_read ? "Processed" : "Not Processed"}</td>
                </tr>
              </tbody>
            </Table>
          </Box>
        ) : (
          <Text
            size="md"
            color="dimmed"
            align="center"
            style={{ padding: "1rem" }}
          >
            Loading file history...
          </Text>
        )}
      </Card.Section>
    </Card>
  );
}

PropTypes.FileStatusPage = {
  onBack: PropTypes.func.isRequired,
  fileID: PropTypes.string.isRequired,
  updateFiles: PropTypes.func.isRequired,
};
