import React, { useState } from "react";
import { useForm } from "@mantine/form";
import {
  TextInput,
  Button,
  Group,
  Container,
  Alert,
  Modal,
  FileInput,
} from "@mantine/core";
import PropTypes from "prop-types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import "./GymkhanaForms.css";
import { host } from "../../routes/globalRoutes/index.jsx";

function CounsellorReview({
  clubName,
  initialValues,
  onSubmit,
  editMode = false,
  disabledFields = [],
}) {
  const token = localStorage.getItem("authToken");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const form = useForm({
    initialValues: initialValues || {
      budget_for: "",
      description: "",
      budget_file: null, // For the file upload
      budget_requested: "",
      budget_allocated: "",
      budget_comment: "",
      status: "",
      remarks: "",
      club: clubName,
    },
    validate: {
      budget_for: (value) =>
        value.length === 0 ? "Budget for cannot be empty" : null,
      budget_allocated: (value) =>
        value.length === 0 ? "Budget Allocated cannot be empty" : null,
      description: (value) =>
        value.length === 0 ? "Description cannot be empty" : null,
      budget_requested: (value) =>
        typeof value !== "number" || Number.isNaN(value) || value <= 0
          ? "Budget amount must be a positive number"
          : null,
      status: (value) => (value.length === 0 ? "Status cannot be empty" : null),
      //   remarks: (value) =>
      //     value.length === 0 ? "Remarks cannot be empty" : null,
      //   budget_file: (value) => (!value ? "You must attach a PDF" : null), // File validation
    },
  });

  const mutation = useMutation({
    mutationFn: (newBudgetData) => {
      return axios.put(
        `${host}/gymkhana/api/counsellor_approve_budget/`, // API URL for the budget submission
        newBudgetData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // For file uploads
            Authorization: `Token ${token}`, // Auth token
          },
        },
      );
    },
    onSuccess: (response) => {
      console.log("Successfully submitted budget:", response.data);
      setSuccessMessage("Budget submission successful!");
      form.reset(); // Optionally reset the form after successful submission
    },
    onError: (error) => {
      console.error("Error during budget submission:", error);
      setErrorMessage("Budget submission failed. Please try again.");
    },
  });

  const handleSubmit = (values) => {
    if (editMode && onSubmit) {
      onSubmit(values);
      return;
    }
    const formData = new FormData();
    // Append all values to FormData
    Object.keys(values).forEach((key) => {
      if (values[key] !== undefined && values[key] !== null) {
        formData.append(key, values[key]);
      }
    });
    mutation.mutate(formData);
  };

  return (
    <Container>
      <form onSubmit={form.onSubmit(handleSubmit)} className="club-form">
        <h2 className="club-header"> {clubName}'s Budget Proposal</h2>
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
        {/* Budget For */}
        <TextInput
          label="Budget For"
          placeholder="What is this budget for?"
          value={form.values.budget_for}
          onChange={(event) =>
            form.setFieldValue("budget_for", event.currentTarget.value)
          }
          error={form.errors.budget_for}
          disabled={editMode && disabledFields.includes("budget_for")}
          withAsterisk
        />
        {/* Description */}
        <TextInput
          label="Description"
          placeholder="Enter the budget description"
          value={form.values.description}
          onChange={(event) =>
            form.setFieldValue("description", event.currentTarget.value)
          }
          error={form.errors.description}
          disabled={editMode && disabledFields.includes("description")}
          withAsterisk
        />
        {/* Budget Amount */}
        <TextInput
          label="Budget Amount"
          placeholder="Enter budget amount"
          type="number"
          value={form.values.budget_requested}
          onChange={(event) => {
            const value = parseFloat(event.currentTarget.value);
            form.setFieldValue(
              "budget_requested",
              Number.isNaN(value) ? 0 : value,
            );
          }}
          error={form.errors.budget_requested}
          disabled={editMode && disabledFields.includes("budget_requested")}
          withAsterisk
        />

        {/* Budget Allocated */}
        <TextInput
          label="Budget Allocated"
          placeholder="Enter allocated budget"
          type="number"
          value={form.values.budget_allocated}
          onChange={(event) => {
            const value = parseFloat(event.currentTarget.value);
            form.setFieldValue(
              "budget_allocated",
              Number.isNaN(value) ? 0 : value,
            );
          }}
          error={form.errors.budget_allocated}
          disabled={!editMode} // Only editable in editMode
          withAsterisk
        />
        {/* Budget Comment (Editable) */}
        <TextInput
          label="Budget Comment"
          placeholder="Enter a new comment"
          value={form.values.budget_comment ?? ""} // Ensure it's never null
          onChange={(event) =>
            form.setFieldValue("budget_comment", event.currentTarget.value)
          }
          error={form.errors.budget_comment}
          disabled={!editMode} // Make it editable only in editMode
          withAsterisk
        />
        {/* PDF Upload */}
        <FileInput
          label="Attach PDF"
          placeholder="Upload your budget PDF"
          onChange={(file) => form.setFieldValue("budget_file", file)}
          error={form.errors.budget_file}
          disabled={editMode && disabledFields.includes("budget_file")}
          accept=".pdf"
          withAsterisk
        />
        {/* Status */}
        <TextInput
          label="Status"
          placeholder="Enter the status"
          value={form.values.status}
          onChange={(event) =>
            form.setFieldValue("status", event.currentTarget.value)
          }
          error={form.errors.status}
          disabled={editMode && disabledFields.includes("status")}
          withAsterisk
        />
        {/* Remarks */}
        <TextInput
          label="Remarks"
          placeholder="Enter remarks"
          value={form.values.remarks}
          onChange={(event) =>
            form.setFieldValue("remarks", event.currentTarget.value)
          }
          error={form.errors.remarks}
          disabled={editMode && disabledFields.includes("remarks")}
          withAsterisk
        />
        {/* Submit Button */}
        <Group position="center" mt="md" className="submit-container">
          <Button type="submit" className="submit-btn">
            {editMode ? "Accept" : "Submit"}
          </Button>
        </Group>
      </form>
      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Success!"
      >
        <p>
          Your budget has been successfully {editMode ? "updated" : "submitted"}
          !
        </p>
        <Button onClick={() => setIsModalOpen(false)}>Close</Button>
      </Modal>
    </Container>
  );
}

CounsellorReview.propTypes = {
  clubName: PropTypes.string.isRequired,
  initialValues: PropTypes,
  onSubmit: PropTypes.func,
  editMode: PropTypes.bool,
  disabledFields: PropTypes.arrayOf(PropTypes.string),
};

export default CounsellorReview;
