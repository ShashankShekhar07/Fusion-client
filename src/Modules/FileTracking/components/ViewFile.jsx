import { useState, useEffect } from "react";
import {
  Card,
  Box,
  Textarea,
  Button,
  TextInput,
  Title,
  ActionIcon,
  Divider,
  Group,
} from "@mantine/core";
import PropTypes from "prop-types";
import {
  ArrowLeft,
  PaperPlaneTilt,
  ChatCircleDots,
  Trash,
} from "@phosphor-icons/react";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { createFileRoute } from "../../../routes/filetrackingRoutes";
import { host } from "../../../routes/globalRoutes";

export default function View({ onBack, fileID, updateFiles }) {
  const [activeSection, setActiveSection] = useState(null);
  const [file, setFile] = useState({});
  const token = localStorage.getItem("authToken");

  const convertDate = (date) => {
    const d = new Date(date);
    return d.toLocaleString();
  };

  useEffect(() => {
    const getFile = async () => {
      try {
        const response = await axios.get(`${createFileRoute}${fileID}`, {
          withCredentials: true,
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setFile(response.data);
      } catch (err) {
        console.error("Error fetching files:", err);
      }
    };
    getFile();
  }, []);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handleDelete = async () => {
    const response = await axios.delete(`${createFileRoute}${fileID}`, {
      withCredentials: true,
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    if (response.status === 204) {
      updateFiles();
      onBack();
      notifications.show({
        title: "File deleted successfully",
        message: "The file has been deleted successfully.",
        color: "green",
        position: "top-center",
      });
    } else {
      notifications.show({
        title: "Failed to delete file",
        message: "Some error occured. Please try again later.",
        color: "red",
        position: "top-center",
      });
    }
  };

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{
        backgroundColor: "#FFFFFF",
        minHeight: "10vh",
        padding: "2rem",
      }}
    >
      <Group position="apart" mb="lg">
        <Button variant="subtle" onClick={onBack}>
          <ArrowLeft size={20} />
        </Button>
        <Title order={3} style={{ textAlign: "center", flex: 1 }}>
          {file?.subject || "File Details"}
        </Title>
        <ActionIcon
          color="red"
          variant="light"
          size="lg"
          onClick={() => handleDelete()}
        >
          <Trash size={24} />
        </ActionIcon>
      </Group>

      <Divider mb="lg" />

      <Box mb="md">
        <Textarea
          label="File Content"
          placeholder="No content available"
          value={file?.description || ""}
          readOnly
        />
      </Box>

      <Box mb="md">
        <TextInput
          label="File ID"
          value={file?.id || "Not available"}
          readOnly
        />
      </Box>

      <Box mb="md">
        <TextInput
          label="Upload Date"
          value={
            file?.upload_date ? convertDate(file.upload_date) : "Not available"
          }
          readOnly
        />
      </Box>

      <Box mb="md">
        <TextInput
          label="Department"
          value={file?.src_module || "Not available"}
          readOnly
        />
      </Box>

      <Box mb="md">
        <TextInput
          label="Sender"
          value={file?.uploader || "Not available"}
          readOnly
        />
      </Box>

      <Box mb="md">
        <TextInput
          label="Attachment"
          value={file?.upload_file || "No attachment"}
          readOnly
        />
      </Box>

      <Group position="center" mt="lg" spacing="xl">
        <Button
          leftIcon={<PaperPlaneTilt size={20} />}
          onClick={() => toggleSection("forward")}
        >
          Forward
        </Button>
        <Button
          leftIcon={<ChatCircleDots size={20} />}
          onClick={() => toggleSection("feedback")}
        >
          Feedback
        </Button>
        {file?.upload_file && (
          <Button
            onClick={() => {
              console.log(file);
              window.open(`${host}${file?.upload_file}`, "_blank");
            }}
          >
            Download Attachment
          </Button>
        )}
      </Group>

      {activeSection && (
        <Card
          shadow="xs"
          padding="md"
          mt="xl"
          style={{
            backgroundColor: "#F9FAFB",
            border: "1px solid #E0E6ED",
          }}
        >
          {activeSection === "forward" && (
            <>
              <TextInput
                label="Receiver's Email"
                placeholder="Enter email"
                mb="md"
              />
              <TextInput
                label="Receiver's Designation"
                placeholder="Enter designation"
                mb="md"
              />
              <Button fullWidth color="blue">
                Send
              </Button>
            </>
          )}

          {activeSection === "feedback" && (
            <>
              <Textarea label="Feedback" placeholder="Enter feedback" mb="md" />
              <TextInput
                label="Receiver's Email"
                placeholder="Enter email"
                mb="md"
              />
              <TextInput
                label="Receiver's Designation"
                placeholder="Enter designation"
                mb="md"
              />
              <Button fullWidth color="blue">
                Send
              </Button>
            </>
          )}
        </Card>
      )}
    </Card>
  );
}

View.propTypes = {
  onBack: PropTypes.func.isRequired,
  fileID: PropTypes.number.isRequired,
  updateFiles: PropTypes.func.isRequired,
};
