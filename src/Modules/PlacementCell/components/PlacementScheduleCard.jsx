import React, { useState } from "react";
import {
  Card,
  Text,
  Badge,
  Group,
  Button,
  // Image,
  ActionIcon,
  Modal,
  Container,
  Title,
} from "@mantine/core";
import { Clock, MapPin, Trash, Pencil, Eye } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { notifications } from "@mantine/notifications";
import EditPlacementForm from "./EditPlacementForm";
import ApplyForPlacementForm from "./ApplyForPlacementForm";
import {
  ApplyForPlacementRoute,
  addPlacementEventForm,
} from "../../../routes/placementCellRoutes";

function PlacementScheduleCard({
  jobId,
  jobId2,
  // companyLogo,
  companyName,
  location,
  position,
  jobType,
  postedTime,
  deadline,
  endDateTime,
  description,
  salary,
  eligibilityCriteria,
  check,
}) {
  const role = useSelector((state) => state.user.role);
  const [visible, setVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modalOpened, setModalOpened] = useState(false);

  const navigate = useNavigate();

  const prefilledFields = {
    name: "John Doe",
    email: "john.doe@example.com",
    roll_no: "123456",
  };

  const additionalFields = [
    {
      name: "resume",
      label: "Upload Resume",
      type: "file",
      required: true,
    },
    {
      name: "preferred_location",
      label: "Preferred Location",
      type: "select",
      options: ["Bangalore", "Mumbai", "Delhi"],
      placeholder: "Select your preferred location",
      required: true,
    },
    {
      name: "additional_info",
      label: "Additional Information",
      type: "textarea",
      placeholder: "Enter any additional information",
      required: false,
    },
  ];

  const handleApplyClick = async () => {
    setModalOpened(true);
  };

  const handelApplySubmit = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(ApplyForPlacementRoute, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobId }),
      });
      if (response.ok) {
        console.log("Application successful");
      } else {
        console.error("Failed to apply", response);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handelViewClick = () => {
    navigate(`/placement-cell/view?jobId=${encodeURIComponent(jobId)}`);
  };

  const handleDeleteClick = async () => {
    setVisible(false);
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(`${addPlacementEventForm}${jobId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        notifications.show({
          title: "Success",
          message: "Placement schedule deleted successfully!",
          color: "green",
          position: "top-center",
          autoClose: 3000,
        });
        setIsModalOpen(false);
      } else {
        const errorData = await response.json();
        console.error("Delete failed:", errorData);
        notifications.show({
          title: "Error",
          message: "Failed to delete placement schedule.",
          color: "red",
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      notifications.show({
        title: "Error",
        message: "An error occurred while deleting the placement schedule.",
        color: "red",
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (newData) => {
    const token = localStorage.getItem("authToken");

    // const formattedDate = newData.date && format(newData.date, "yyyy-MM-dd");

    // const formattedTime = newData.time && format(newData.time, "HH:mm:ss");

    const updatedData = {
      placement_type: newData.placementType,
      company_name: newData.company || companyName,
      ctc: newData.ctc || salary,
      description: newData.descriptionInput || description,
      schedule_at: format(newData.time, "HH:mm:ss"),
      placement_date: format(newData.date, "yyyy-MM-dd"),
      end_date_time: format(newData.endDateTime, "yyyy-MM-dd HH:mm:ss"),
      eligibility_criteria: newData.eligibilityCriteria || eligibilityCriteria,
      location: newData.locationInput || location,
      role: newData.role || position,
    };

    try {
      const response = await fetch(`${addPlacementEventForm}${jobId}/`, {
        method: "PUT",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        notifications.show({
          title: "Success",
          message: "Placement schedule updated successfully!",
          color: "green",
          position: "top-center",
          autoClose: 3000,
        });

        setIsModalOpen(false);
      } else {
        const errorData = await response.json();
        console.error("Update failed:", errorData);

        notifications.show({
          title: "Error Updating Schedule",
          message: "Failed to update placement schedule.",
          color: "red",
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error:", error);

      notifications.show({
        title: "Error",
        message: "An error occurred while updating the placement schedule.",
        color: "red",
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const handleTimeline = async () => {
    navigate(`/placement-cell/timeline?jobId=${encodeURIComponent(jobId)}`);
  };

  if (!visible) return null;

  return (
    <>
      <Card
        shadow="sm"
        padding="lg"
        radius="lg"
        mx={8}
        withBorder
        style={{ width: 320, position: "relative" }}
      >
        {/* <Group align="flex-start">
          <Image
            src={companyLogo}
            alt={`${companyName} logo`}
            width={40}
            height={40}
            fit="contain"
            withPlaceholder
          />
        </Group> */}
        <Title order={3} align="left" style={{ marginBottom: "20px" }}>
          {companyName}
        </Title>

        <Text
          size="sm"
          color="dimmed"
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {description}
        </Text>
        <Group spacing={5} mt={5}>
          <MapPin size={16} />
          <Text size="sm" color="dimmed">
            {location}
          </Text>
        </Group>

        <Text size="sm" color="dimmed" mt={5}>
          <strong>Position:</strong> {position}
        </Text>

        <Group mt="xs" spacing={5}>
          <Clock size={16} />
          <Text size="sm" color="dimmed">
            <strong>Start:</strong>{" "}
            {format(new Date(deadline), "dd MMM yyyy, hh:mm a")}
          </Text>
        </Group>

        <Group
          position="apart"
          mt="md"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Text size="xl" weight={700} color="blue">
            {salary}
          </Text>

          {role === "student" &&
            (check ? (
              <Button
                variant="light"
                color="green"
                size="xs"
                onClick={handleTimeline}
              >
                View
              </Button>
            ) : (
              <Button
                variant="light"
                color="blue"
                size="xs"
                onClick={handleApplyClick}
              >
                Apply Now
              </Button>
            ))}

          {role === "placement officer" && (
            <Group position="right" spacing="xs">
              <ActionIcon
                onClick={handleEditClick}
                color="blue"
                size="md"
                variant="light"
              >
                <Pencil size={22} />
              </ActionIcon>

              <ActionIcon
                onClick={handelViewClick}
                color="blue"
                size="md"
                variant="light"
              >
                <Eye size={22} />
              </ActionIcon>

              <ActionIcon
                onClick={handleDeleteClick}
                color="red"
                size="md"
                variant="light"
              >
                <Trash size={22} />
              </ActionIcon>
            </Group>
          )}
        </Group>
      </Card>

      {/* Modal for editing placement */}
      <EditPlacementForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        placementData={{
          companyName,
          location,
          position,
          jobType,
          postedTime,
          deadline,
          endDateTime,
          description,
          salary,
          eligibilityCriteria,
        }}
        onSubmit={(newData) => handleSubmit(newData)}
      />

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        centered
        size="lg"
      >
        <Container d>
          <ApplyForPlacementForm
            jobID={jobId2}
            prefilledFields={prefilledFields}
            additionalFields={additionalFields}
            onSubmit={handelApplySubmit}
          />
        </Container>
      </Modal>
    </>
  );
}

PlacementScheduleCard.propTypes = {
  jobId: PropTypes.string.isRequired,
  jobId2: PropTypes.string.isRequired,
  companyName: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
  jobType: PropTypes.string.isRequired,
  postedTime: PropTypes.string.isRequired,
  deadline: PropTypes.string,
  endDateTime: PropTypes.string,
  description: PropTypes.string,
  salary: PropTypes.string,
  eligibilityCriteria: PropTypes.arrayOf(PropTypes.string),
  check: PropTypes.bool,
};

export default PlacementScheduleCard;
