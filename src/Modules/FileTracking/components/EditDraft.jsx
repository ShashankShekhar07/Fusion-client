/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import {
  Card,
  Title,
  TextInput,
  FileInput,
  Button,
  Textarea,
  Box,
  Select,
} from "@mantine/core";
import { ArrowLeft, Upload } from "@phosphor-icons/react";
import { notifications } from "@mantine/notifications";

// eslint-disable-next-line react/prop-types
function ViewDraft({ file, onBack }) {
  // Initialize state with data from the draft (file prop)
  const [title, setTitle] = useState(file.subject || "");
  const [description, setDescription] = useState(file.description || "");
  const [attachedFile, setAttachedFile] = useState(file.attachedFile || null);
  const [receiver, setReceiver] = useState(file.receiver || "");
  const [designation, setDesignation] = useState(file.designation || "");
  const [create, setCreateas] = useState(file.create || "");

  const handleSaveChanges = () => {
    notifications.show({
      title: "File Saved",
      message: "Changes have been saved.",
      color: "blue",
    });
    const updatedDraft = {
      title,
      description,
      attachedFile,
      receiver,
      designation,
      create,
    };

    // Implement the save functionality here (e.g., saving to local storage, API, etc.)
    console.log("Changes saved:", updatedDraft);
    onBack();
  };

  const handleSend = () => {
    const draftToSend = {
      title,
      description,
      attachedFile,
      receiver,
      designation,
      create,
    };

    // Implement the send functionality here (e.g., API call to send the draft)
    console.log("Draft sent:", draftToSend);
    onBack(); // Navigate back after sending
  };

  return (
    <Card
      // shadow="sm" padding="lg" radius="md" withBorder
      shadow="sm"
      padding="lg"
      radius="m"
      withBorder
      style={{
        backgroundColor: "#F5F7F8",
        // position: "absolute",
        height: "70vh",
        width: "90vw",
        overflowY: "auto",
      }}
    >
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <Button
          variant="subtle"
          onClick={onBack}
          style={{ marginRight: "1rem" }}
        >
          <ArrowLeft size={24} />
        </Button>
        <Title order={3} style={{ flexGrow: 1, textAlign: "center" }}>
          Edit Draft: {title}
        </Title>
      </Box>

      <TextInput
        label="Title"
        placeholder="Enter Title"
        onChange={(e) => setTitle(e.currentTarget.value)}
        mb="sm"
      />
      <Textarea
        label="Description"
        placeholder="Enter your description here"
        value={description}
        onChange={(e) => setDescription(e.currentTarget.value)}
        mb="sm"
      />
      <TextInput
        label="Create as"
        placeholder="Enter creation type"
        onChange={(e) => setCreateas(e.currentTarget.value)}
        mb="sm"
      />

      <FileInput
        label="Attach file (PDF, JPG, PNG) (MAX: 10MB)"
        placeholder={attachedFile ? attachedFile.name : "Upload file"}
        accept="application/pdf,image/jpeg,image/png"
        icon={<Upload size={16} />}
        value={attachedFile}
        onChange={setAttachedFile}
        mb="sm"
        withAsterisk
      />

      <Textarea label="Remark" placeholder="Enter remark" mb="sm" />

      <TextInput
        label="Forward To"
        placeholder="Enter forward recipient"
        value={receiver}
        onChange={(e) => setReceiver(e.currentTarget.value)}
        mb="sm"
      />

      <Select
        label="Receiver Designation"
        placeholder="Select designation"
        data={[
          { value: "Professor", label: "Professor" },
          { value: "Student", label: "Student" },
          { value: "Employee", label: "Employee" },
        ]}
        value={designation}
        onChange={setDesignation}
        mb="sm"
      />

      <Box
        style={{
          display: "flex",
          justifyContent: "flex-start",
          gap: "10px",
        }}
      >
        <Button
          onClick={handleSaveChanges}
          style={{
            width: "12%",
            marginRight: "10px",
            marginLeft: "25px",
          }}
        >
          Save Changes
        </Button>

        <Button
          onClick={handleSend}
          style={{
            width: "10%",
            marginRight: "10px",
            marginLeft: "70%",
          }}
        >
          Send
        </Button>
      </Box>
    </Card>
  );
}

export default ViewDraft;
