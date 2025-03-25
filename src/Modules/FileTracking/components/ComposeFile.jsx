import React, { useEffect } from "react";
import {
  Box,
  Button,
  Card,
  FileInput,
  TextInput,
  Textarea,
  Title,
  ActionIcon,
  Text,
  Select,
  Group,
  Autocomplete,
  Grid,
} from "@mantine/core";
import { Upload, FloppyDisk, Trash } from "@phosphor-icons/react";
import { notifications } from "@mantine/notifications";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  designationsRoute,
  createFileRoute,
  getUsernameRoute,
  createDraftRoute,
} from "../../../routes/filetrackingRoutes";

axios.defaults.withCredentials = true;
// eslint-disable-next-line no-unused-vars
export default function Compose() {
  const [files, setFiles] = React.useState(null);
  const [usernameSuggestions, setUsernameSuggestions] = React.useState([]);
  const [receiver_username, setReceiverUsername] = React.useState("");
  const [receiver_designation, setReceiverDesignation] = React.useState("");
  const [receiver_designations, setReceiverDesignations] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [description, setDescription] = React.useState("");
  const token = localStorage.getItem("authToken");

  const roles = useSelector((state) => state.user.roles);
  let module = useSelector((state) => state.module.current_module);
  module = module.split(" ").join("").toLowerCase();
  const uploaderRole = useSelector((state) => state.user.role);
  const [designation, setDesignation] = React.useState(uploaderRole);
  const options = roles.map((role) => ({ value: role, label: role }));
  const receiverRoles = Array.isArray(receiver_designations)
    ? receiver_designations.map((role) => ({
        value: role,
        label: role,
      }))
    : [];

  const handleFileChange = (uploadedFile) => {
    console.log(uploadedFile.size);
    setFiles(uploadedFile);
  };
  const removeFile = () => {
    setFiles(null);
  };
  const postSubmit = () => {
    removeFile();
    setDesignation("");
    setReceiverDesignation("");
    setReceiverDesignations("");
    setReceiverUsername("");
    setSubject("");
    setDescription("");
  };
  useEffect(() => {
    setDesignation(roles);
    console.log(receiverRoles);
  }, [roles, receiverRoles]);

  useEffect(() => {
    let isMounted = true;
    const getUsernameSuggestion = async () => {
      try {
        const response = await axios.post(
          `${getUsernameRoute}`,
          { value: receiver_username },
          {
            headers: { Authorization: `Token ${token}` },
          },
        );
        const users = JSON.parse(response.data.users);
        // Ensure response.data.users is an array before mapping
        if (response.data && Array.isArray(users)) {
          const suggestedUsernames = users.map((user) => user.fields.username);
          console.log(suggestedUsernames);
          if (isMounted) {
            setUsernameSuggestions(suggestedUsernames);
          }
        }
      } catch (error) {
        console.error("Error fetching username suggestion:", error);
      }
    };

    if (receiver_username) {
      getUsernameSuggestion();
    }

    return () => {
      isMounted = false; // Cleanup to prevent memory leaks
    };
  }, [receiver_username, token]);

  const fetchRoles = async () => {
    const response = await axios.get(
      `${designationsRoute}${receiver_username}`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      },
    );
    console.log(response);
    setReceiverDesignations(response.data.designations);
  };
  useEffect(() => {
    if (receiver_username) {
      fetchRoles();
    }
  }, [receiver_username]);
  const handleSaveDraft = async () => {
    try {
      console.log(uploaderRole);
      console.log(module);
      console.log(typeof files);
      const formData = new FormData();
      formData.append("designation", uploaderRole);
      formData.append("src_module", module);

      files.forEach((file) => {
        formData.append("files", file); // `files` should be an array of File objects
      });
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post(`${createDraftRoute}`, formData, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      notifications.show({
        title: "Draft saved successfully",
        message: "The draft has been saved successfully.",
        color: "green",
        position: "top-center",
      });
      postSubmit();
    } catch (err) {
      console.log(err);
    }
  };

  // postSubmit();
  const handleCreateFile = async () => {
    if (!files) {
      notifications.show({
        title: "Error",
        message: "Please upload a file",
        color: "red",
        position: "top-center",
      });
      // eslint-disable-next-line no-useless-return
      return;
    }

    try {
      const formData = new FormData();
      files.forEach((fileItem, index) => {
        const fileAttachment =
          fileItem instanceof File
            ? fileItem
            : new File([fileItem], `uploaded_file_${index}`, {
                type: "application/octet-stream",
              });
        formData.append("files", fileAttachment); // Append each file
      });
      formData.append("subject", subject);
      formData.append("description", description);
      formData.append("designation", designation);
      formData.append("receiver_username", receiver_username);
      formData.append("receiver_designation", receiver_designation);
      formData.append("src_module", module);
      const response = await axios.post(`${createFileRoute}`, formData, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (response.status === 201) {
        notifications.show({
          title: "File sent successfully",
          message: "The file has been sent successfully.",
          color: "green",
          position: "top-center",
        });
        postSubmit();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className="inbox-card"
      style={{
        backgroundColor: "#F5F7F8",
        position: "absolute",
        height: "70vh",
        width: "90vw",
        overflowY: "auto",
      }}
    >
      <Box
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <ActionIcon
          size="lg"
          variant="outline"
          color="blue"
          onClick={() => handleSaveDraft()}
          title="Save as Draft"
        >
          <FloppyDisk size={20} />
        </ActionIcon>
        <Text color="blue" size="xs" mt={4}>
          Save as Draft
        </Text>
      </Box>

      <Title
        order={2}
        mb="md"
        style={{
          fontSize: "24px",
        }}
      >
        Compose File
      </Title>
      <Box
        component="form"
        onSubmit={(e) => e.preventDefault()}
        style={{
          backgroundColor: "#F5F7F8",
          padding: "16px",
        }}
      >
        <TextInput
          label="Title of File"
          placeholder="Enter file title"
          mb="sm"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
        <Textarea
          label="Description"
          placeholder="Enter description"
          mb="sm"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <Select
          label="Designation"
          placeholder="Sender's Designation"
          value={designation}
          data={options}
          mb="sm"
          onChange={(value) => setDesignation(value)}
        />
        <FileInput
          label="Attach file (PDF, JPG, PNG) (MAX: 10MB)"
          placeholder="Upload file"
          accept="application/pdf,image/jpeg,image/png"
          icon={<Upload size={16} />}
          value={files} // Set the file state as the value
          onChange={handleFileChange} // Update file state on change
          mb="sm"
          withAsterisk
          multiple
        />
        {files && (
          <Group position="apart" mt="sm">
            <Button
              leftIcon={<Trash size={16} />}
              color="red"
              onClick={removeFile}
              compact
            >
              Remove File
            </Button>
          </Group>
        )}
        <Grid mb="sm" gutter="sm">
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Autocomplete
              label="Forward To"
              placeholder="Enter forward recipient"
              value={receiver_username}
              data={usernameSuggestions} // Pass the array of suggestions
              onChange={(value) => {
                setReceiverDesignation("");
                setReceiverUsername(value);
              }}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Select
              label="Receiver Designation"
              placeholder="Select designation"
              onClick={() => {
                if (receiverRoles.length === 0) {
                  fetchRoles();
                }
              }}
              value={receiver_designation} // Use receiver_designation (string)
              data={receiverRoles} // Ensure this is populated correctly
              onChange={(value) => setReceiverDesignation(value)}
              searchable // Allows searching for designations
              nothingFound="No designations found"
            />
          </Grid.Col>
        </Grid>
        <Button
          type="submit"
          color="blue"
          style={{
            display: "block",
            margin: "0 auto",
            width: "200px",
          }}
          onClick={handleCreateFile}
        >
          Submit
        </Button>
      </Box>
    </Card>
  );
}
