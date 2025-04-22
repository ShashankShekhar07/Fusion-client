import {
  Textarea,
  Text,
  Button,
  Flex,
  Grid,
  Select,
  FileInput,
} from "@mantine/core";
import { useState } from "react";
import PropTypes from "prop-types";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { updateComplaintStatus } from "../routes/api";

function UnresComp_ChangeStatus({ complaint, onBack }) {
  const [status, setStatus] = useState("");
  const [comments, setComments] = useState("");
  const [image, setImage] = useState(null);
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  if (!complaint) return null;

  const token = localStorage.getItem("authToken");

  const handleStatusChange = (value) => {
    setStatus(value);
  };

  const handleCommentsChange = (event) => {
    setComments(event.currentTarget.value);
  };

  const handleImageChange = (file) => {
    console.log("Selected Image:", file);
    setImage(file);
  };

  const handleSubmit = async () => {
    if (!status) {
      notifications.show({
        title: "Incomplete Action",
        message: "Please select an option before submitting.",
        color: "red",
      });
      return;
    }

    const formData = new FormData();
    formData.append("yesorno", status);
    formData.append("comment", comments);

    if (image) {
      formData.append("image", image);
      console.log("Image before sending:", image);
      formData.append("upload_resolved", image);
    } else {
      console.log("No image selected before sending.");
    }

    try {
      const response = await updateComplaintStatus(
        complaint.id,
        formData,
        token,
      );
      if (response.success) {
        notifications.show({
          title: "Success",
          message: "Thank you for resolving the complaint.",
          color: "green",
        });
        onBack();
      } else {
        notifications.show({
          title: "Error",
          message:
            "There was an issue submitting your response. Please try again.",
          color: "red",
        });
      }
      console.log("Response from API:", response);
    } catch (error) {
      notifications.show({
        title: "Unexpected Error",
        message: "An unexpected error occurred. Please try again.",
        color: "red",
      });
    }
  };

  return (
    <Grid.Col
      style={{
        padding: isSmallScreen ? "1rem" : "2rem",
        fontSize: isSmallScreen ? "14px" : "16px",
      }}
    >
      <Text size={isSmallScreen ? "md" : "lg"} weight="bold">
        Change Status
      </Text>
      <Text size={isSmallScreen ? "xs" : "sm"} mt="1rem">
        <strong>Complainer ID:</strong> {complaint.complainer}
      </Text>
      <Text size={isSmallScreen ? "xs" : "sm"}>
        <strong>Location:</strong> {complaint.specific_location},{" "}
        {complaint.location}
      </Text>
      <Text size={isSmallScreen ? "xs" : "sm"}>
        <strong>Issue:</strong> {complaint.details}
      </Text>

      <Text mt="1rem">Has the issue been resolved?</Text>
      <Select
        placeholder="Choose an option"
        data={[
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ]}
        value={status}
        onChange={handleStatusChange}
        mt="1rem"
      />

      <Text mt="1rem">Any Comments</Text>
      <Textarea
        placeholder="Write your comments here"
        autosize
        minRows={2}
        maxRows={4}
        value={comments}
        onChange={handleCommentsChange}
        mt="1rem"
      />

      <Text mt="1rem">Attach an Image (optional)</Text>
      <FileInput
        placeholder="Upload an image"
        onChange={handleImageChange}
        mt="1rem"
        accept="image/*"
      />

      <Flex
        justify={isSmallScreen ? "center" : "flex-end"}
        direction={isSmallScreen ? "column" : "row"}
        mt="md"
        gap="xs"
      >
        <Button
          variant="outline"
          onClick={onBack}
          style={{ width: isSmallScreen ? "100%" : "auto" }}
        >
          BACK
        </Button>
        <Button
          variant="outline"
          onClick={handleSubmit}
          style={{ width: isSmallScreen ? "100%" : "auto" }}
        >
          Submit
        </Button>
      </Flex>
    </Grid.Col>
  );
}

UnresComp_ChangeStatus.propTypes = {
  complaint: PropTypes.shape({
    id: PropTypes.number.isRequired,
    complainer: PropTypes.string,
    location: PropTypes.string.isRequired,
    specific_location: PropTypes.string.isRequired,
    details: PropTypes.string.isRequired,
  }),
  onBack: PropTypes.func.isRequired,
};

export default UnresComp_ChangeStatus;
