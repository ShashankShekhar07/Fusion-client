import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "@mantine/form";
import {
  TextInput,
  Button,
  Group,
  Container,
  Alert,
  Modal,
  FileInput,
  Select,
} from "@mantine/core";
import PropTypes from "prop-types";
import { useMutation } from "@tanstack/react-query";
import "./GymkhanaForms.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useGetNewsLetterEvent } from "./BackendLogic/ApiRoutes";
import { host, authRoute } from "../../routes/globalRoutes";

function NewsForm({
  initialValues,
  onSubmit,
  editMode = false,
  disabledFields = [],
  clubName,
}) {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem("authToken");
  const [fetchedEvents, setFetchedEvents] = useState(() => {
    const storedEvents = localStorage.getItem("fetchedEvents");
    return storedEvents ? JSON.parse(storedEvents) : null;
  });
  // const roll_no = "2017297";
  const [roll_no, setRollNo] = useState(() => localStorage.getItem("roll_no"));
  const navigate = useNavigate();
  const validateUser = useCallback(async () => {
    if (!token) {
      console.error("No authentication token found!");
      localStorage.removeItem("authToken");
      localStorage.removeItem("roll_no");
      notifications.show({
        title: "Authentication Error",
        message: "Token Invalid/Expired! Redirecting to login page.",
        color: "red",
      });
      return navigate("/accounts/login");
    }

    try {
      const { data } = await axios.get(authRoute, {
        headers: { Authorization: `Token ${token}` },
      });

      if (!roll_no) {
        setRollNo(data.roll_no);
        localStorage.setItem("roll_no", data.roll_no); // Store globally
      }
    } catch (error) {
      console.error("User validation failed:", error);
      notifications.show({
        title: "Session Expired",
        message: "Your session has expired. Please log in again.",
        color: "red",
      });
    }
  }, []);

  useEffect(() => {
    validateUser();
  }, [validateUser]);

  const { data, error } = useGetNewsLetterEvent(roll_no, token);

  useEffect(() => {
    if (data && !fetchedEvents) {
      setFetchedEvents(data);
      localStorage.setItem("fetchedEvents", JSON.stringify(data));
    }
    if (error) {
      setErrorMessage("Failed to fetch events. Please try again.");
    }
  }, [data, error, fetchedEvents]);

  const form = useForm({
    initialValues: initialValues || {
      event: "",
      description: "",
      images: null,
    },
    validate: {
      // event: (value) =>
      //   value.length < 2 ? "Title must have at least 2 letters" : null,
      description: (value) =>
        value.length === 0 ? "Details cannot be empty" : null,
      images: (value) => (!value ? "You must attach a file" : null),
    },
  });

  const mutation = useMutation({
    mutationFn: (newEventData) => {
      return axios.post(
        `${host}/gymkhana/api/coordinator_eventsinput/`, // Adjust API URL as needed
        newEventData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file uploads
            Authorization: `Token ${token}`, // Ensure token is present
          },
        },
      );
    },
    onSuccess: (response) => {
      console.log("Successfully submitted event:", response.data);
      setSuccessMessage("Event submitted successfully!");
      setIsModalOpen(true);
      form.reset();
    },
    onError: (submit_error) => {
      console.error("Error during event submission:", submit_error);
      setErrorMessage("Event submission failed. Please try again.");
    },
  });

  const handleSubmit = async (values) => {
    if (editMode && onSubmit) {
      onSubmit(values);
      return;
    }

    const formattedValues = {
      ...values,
    };
    mutation.mutate(formattedValues);
  };

  return (
    <Container>
      <form onSubmit={form.onSubmit(handleSubmit)} className="club-form">
        {successMessage && (
          <Alert title="Success" color="green" mt="md">
            {successMessage}
          </Alert>
        )}

        {errorMessage && (
          <Alert title="Error" color="red" mt="md">
            {errorMessage}
          </Alert>
        )}
        <h2 className="club-header">Newsletter for {clubName}'s Event!</h2>
        <Select
          label="Event Name"
          placeholder="Enter event name"
          value={form.values.event.id}
          data={
            fetchedEvents && Array.isArray(fetchedEvents)
              ? fetchedEvents.map((event) => ({
                  value: JSON.stringify(event.id),
                  label: event.event_name,
                }))
              : []
          } // Ensure default empty array
          onChange={(value) => form.setFieldValue("event", value)}
          disabled={editMode && disabledFields.includes("event")}
          withAsterisk
        />

        <TextInput
          label="Details"
          placeholder="Enter the event details"
          value={form.values.description}
          onChange={(event) =>
            form.setFieldValue("description", event.currentTarget.value)
          }
          error={form.errors.description}
          disabled={editMode && disabledFields.includes("description")}
          withAsterisk
        />

        <FileInput
          label="Event Poster"
          placeholder="Upload Event Poster"
          value={form.values.images}
          onChange={(file) => form.setFieldValue("images", file)}
          error={form.errors.images}
          disabled={editMode && disabledFields.includes("images")}
          withAsterisk
        />

        <Group position="center" mt="md">
          <Button type="submit" className="submit-btn" onSubmit={handleSubmit}>
            {editMode ? "Update" : "Submit"}
          </Button>
        </Group>
      </form>
      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Success!"
      >
        <p>
          Your event has been successfully {editMode ? "updated" : "submitted"}!
        </p>
        <Button onClick={() => setIsModalOpen(false)}>Close</Button>
      </Modal>
    </Container>
  );
}

NewsForm.propTypes = {
  initialValues: PropTypes,
  onSubmit: PropTypes.func,
  editMode: PropTypes.bool,
  disabledFields: PropTypes.arrayOf(PropTypes.string),
  clubName: PropTypes.string.isRequired,
};

function EventForm({ clubName }) {
  return (
    <Container>
      <NewsForm clubName={clubName} />
    </Container>
  );
}

EventForm.propTypes = {
  clubName: PropTypes.string.isRequired,
};

export { NewsForm };
export default EventForm;
