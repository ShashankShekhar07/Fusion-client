import React, { useState } from "react";
import {
  Button,
  Select,
  TextInput,
  Textarea,
  Group,
  Title,
  Container,
} from "@mantine/core";
import axios from "axios";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { sendNotificationRoute } from "../../../routes/placementCellRoutes";

function SendNotificationForm() {
  const [formData, setFormData] = useState({
    sendTo: "Student",
    recipient: "",
    date: new Date(),
    time: "",
    type: "",
    description: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (formData.sendTo === "Student" && !formData.recipient) {
      notifications.show({
        title: "Error",
        message: "Please enter a valid Roll No for the student.",
        color: "red",
        position: "top-center",
      });
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      await axios.post(sendNotificationRoute, formData, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      notifications.show({
        title: "Success",
        message: "Notification sent successfully.",
        color: "green",
        position: "top-center",
      });

      setFormData({
        sendTo: "Student",
        recipient: "",
        date: new Date(),
        time: "",
        type: "",
        description: "",
      });
    } catch (error) {
      console.error("Error sending notification:", error);
      notifications.show({
        title: "Error",
        message: "Failed to send notification.",
        color: "red",
        position: "top-center",
      });
    }
  };

  return (
    <Container fluid py={16}>
      <Container
        fluid
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        my={16}
      >
        <Title order={2}>Send Notification</Title>
      </Container>

      <Group mt="md">
        <Select
          label="Send to"
          placeholder="Select recipient"
          value={formData.sendTo}
          onChange={(value) => handleChange("sendTo", value)}
          data={["Student", "All"]} 
        />
        {formData.sendTo === "Student" && ( 
          <TextInput
            label="Student Roll No"
            placeholder="Enter student Roll No"
            value={formData.recipient}
            onChange={(event) =>
              handleChange("recipient", event.currentTarget.value)
            }
            required
          />
        )}
      </Group>

      <Group mt="md">
        <DatePickerInput
          label="Date"
          placeholder="Select date"
          value={formData.date}
          onChange={(date) => handleChange("date", date)}
        />
        <TimeInput
          label="Time"
          value={formData.time}
          onChange={(time) => handleChange("time", time)}
        />
      </Group>

      <TextInput
        mt="md"
        label="Title"
        placeholder="Enter notification title"
        value={formData.type}
        onChange={(event) => handleChange("type", event.currentTarget.value)}
      />

      <Textarea
        mt="md"
        label="Description"
        placeholder="Enter notification description"
        value={formData.description}
        onChange={(event) =>
          handleChange("description", event.currentTarget.value)
        }
        minRows={4}
      />

      <Button mt="md" onClick={handleSubmit}>
        Send Notification
      </Button>
    </Container>
  );
}

export default SendNotificationForm;