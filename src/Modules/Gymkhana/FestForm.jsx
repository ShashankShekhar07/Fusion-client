import React, { useState } from "react";
import { useForm } from "@mantine/form";
import {
  TextInput,
  Textarea,
  Button,
  Group,
  Container,
  Alert,
  Modal,
  Select,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import PropTypes from "prop-types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import "./GymkhanaForms.css";
import { host } from "../../routes/globalRoutes";

function FestForm({
  initialValues,
  onSubmit,
  editMode = false,
  disabledFields = [],
}) {
  const token = localStorage.getItem("authToken");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Set up the form with initial values and validation
  const form = useForm({
    initialValues: initialValues || {
      name: "",
      category: "",
      description: "",
      date: null,
      link: "",
    },
    validate: {
      name: (value) => (value.length === 0 ? "Name cannot be empty" : null),
      category: (value) =>
        value.length === 0 ? "Category cannot be empty" : null,
      description: (value) =>
        value.length === 0 ? "Description cannot be empty" : null,
      date: (value) => (value === null ? "Date cannot be empty" : null),
      link: (value) => (value.length === 0 ? "Link cannot be empty" : null),
    },
  });

  // Mutation setup for submitting the form data via API
  const mutation = useMutation({
    mutationFn: (newFestData) => {
      const formData = new FormData();
      formData.append("name", newFestData.name);
      formData.append("category", newFestData.category);
      formData.append("description", newFestData.description);
      formData.append("date", newFestData.date.toISOString().split("T")[0]); // Ensure date is in YYYY-MM-DD format
      formData.append("link", newFestData.link);

      return axios.post(
        `${host}/gymkhana/api/new_fest/`, // API URL for the fest submission
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${token}`, // Auth token
          },
        },
      );
    },
    onSuccess: (response) => {
      console.log("Successfully submitted fest:", response.data);
      setSuccessMessage("Fest submission successful!");
      form.reset({
        name: "",
        category: "",
        description: "",
        date: null,
        link: "",
      });
      form.setFieldValue("category", ""); // Optionally reset the form after successful submission
      setIsModalOpen(true);
    },
    onError: (error) => {
      console.error("Error during fest submission:", error);
      setErrorMessage("Fest submission failed. Please try again.");
    },
  });

  const handleSubmit = (values) => {
    if (editMode && onSubmit) {
      onSubmit(values);
      return;
    }
    mutation.mutate(values);
  };

  return (
    <Container>
      <form onSubmit={form.onSubmit(handleSubmit)} className="club-form">
        <h2 className="club-header">Fest Form</h2>
        {/* Success Message */}
        {successMessage && (
          <Alert title="Success" color="green" mt="md" className="club-message">
            {successMessage}
          </Alert>
        )}

        {/* Error Message */}
        {errorMessage && (
          <Alert title="Error" color="red" mt="md" className="club-message">
            {errorMessage}
          </Alert>
        )}

        {/* Name */}
        <TextInput
          label="Name"
          placeholder="Enter fest name"
          value={form.values.name}
          onChange={(event) =>
            form.setFieldValue("name", event.currentTarget.value)
          }
          error={form.errors.name}
          disabled={editMode && disabledFields.includes("name")}
          withAsterisk
        />

        {/* Category */}
        <Select
          label="Category"
          placeholder="Select fest category"
          data={[
            { value: "Technical", label: "Technical" },
            { value: "Cultural", label: "Cultural" },
            { value: "Sports", label: "Sports" },
          ]}
          value={form.values.category}
          onChange={(value) => form.setFieldValue("category", value)}
          error={form.errors.category}
          disabled={editMode && disabledFields.includes("category")}
          withAsterisk
        />

        {/* Description */}
        <Textarea
          label="Description"
          placeholder="Enter fest description"
          value={form.values.description}
          onChange={(event) =>
            form.setFieldValue("description", event.currentTarget.value)
          }
          error={form.errors.description}
          disabled={editMode && disabledFields.includes("description")}
          withAsterisk
        />

        {/* Date */}
        <DateInput
          label="Date"
          placeholder="Select fest date"
          value={form.values.date}
          onChange={(date) => form.setFieldValue("date", date)}
          error={form.errors.date}
          disabled={editMode && disabledFields.includes("date")}
          withAsterisk
        />

        {/* Link */}
        <TextInput
          label="Link"
          placeholder="Enter fest link"
          value={form.values.link}
          onChange={(event) =>
            form.setFieldValue("link", event.currentTarget.value)
          }
          error={form.errors.link}
          disabled={editMode && disabledFields.includes("link")}
          withAsterisk
        />

        {/* Submit Button */}
        <Group position="center" mt="md" className="submit-container">
          <Button type="submit" className="submit-btn">
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
          Your fest has been successfully {editMode ? "updated" : "submitted"}!
        </p>
        <Button onClick={() => setIsModalOpen(false)}>Close</Button>
      </Modal>
    </Container>
  );
}

FestForm.propTypes = {
  initialValues: PropTypes.shape({
    name: PropTypes.string,
    category: PropTypes.string,
    description: PropTypes.string,
    date: PropTypes.instanceOf(Date),
    link: PropTypes.string,
  }),
  onSubmit: PropTypes.func,
  editMode: PropTypes.bool,
  disabledFields: PropTypes.arrayOf(PropTypes.string),
};

export default FestForm;
