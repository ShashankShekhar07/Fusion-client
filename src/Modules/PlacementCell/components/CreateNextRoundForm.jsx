import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {
  Modal,
  Button,
  TextInput,
  Select,
  Textarea,
  Container,
  Title,
  Flex,
  ActionIcon
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { submitNextRoundDetailsRoute } from "../../../routes/placementCellRoutes";
import { useNavigate } from "react-router-dom";
import { IconArrowLeft } from "@tabler/icons-react"; // Import the back arrow icon


function CreateNextRoundForm() {
  const navigate = useNavigate();
  const [modalOpened, setModalOpened] = useState(false);
  const [roundNumber, setRoundNumber] = useState();
  const [date, setDate] = useState("");
  // const [time, setTime] = useState(""); // Not used anywhere hence commented
  // const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [roundType, setRoundType] = useState("");

  const loc = useLocation();
  const searchParams = new URLSearchParams(loc.search);
  const jobId = searchParams.get("jobId");

  const handleSubmit = () => {
    const nextRoundDetails = {
      round_no: roundNumber,
      test_date: date,
      // time:time,
      // location:location,
      description,
      test_type: roundType,
    };

    setModalOpened(false);
    setRoundNumber();
    setDate("");
    // setTime("");
    // setLocation("");
    setDescription("");
    setRoundType("");

    const submitFunc = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await axios.post(
          `${submitNextRoundDetailsRoute}${jobId}/`,
          nextRoundDetails,
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        if (response.status === 201) {
          notifications.show({
            title: "Round Created",
            message: "Next round details have been successfully created.",
            color: "green",
            position: "top-center",
          });
        } else {
          notifications.show({
            title: "Failed",
            message: "Failed to create next round details.",
            color: "red",
            position: "top-center",
          });
          console.error("failed to post");
        }
      } catch (error) {
        notifications.show({
          title: "Error",
          message: "Failed to create next round details.",
          color: "red",
          position: "top-center",
        });

        console.error(error);
      }
    };
    submitFunc();
  };

  return (
    <>
      <Flex justify="space-between" mb="lg">
      <ActionIcon
          onClick={() => navigate(-1)}
          color="blue"
          size="lg"
          variant="light"
        >
          <IconArrowLeft size={20} />
        </ActionIcon>
        <Button onClick={() => setModalOpened(true)}>Create Next Round</Button>
      </Flex>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        centered
      >
        <Container d>
          <Title order={3} mb={32}>
            Add next round details
          </Title>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <TextInput
              label="Round Number"
              placeholder="Enter round number"
              type="number"
              value={roundNumber}
              onChange={(e) => setRoundNumber(e.target.value)}
              required
            />
            <TextInput
              label="Date"
              placeholder="YYYY-MM-DD"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <Textarea
              label="Description"
              placeholder="Enter a brief description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Select
              label="Round Type"
              placeholder="Select round type"
              data={[
                { value: "technical", label: "Technical" },
                { value: "hr", label: "HR" },
                { value: "group_discussion", label: "Group Discussion" },
                { value: "coding", label: "Coding" },
              ]}
              value={roundType}
              onChange={setRoundType}
              required
            />
            <Button type="submit" style={{ marginTop: "12px" }} fullWidth>
              Save Round Details
            </Button>
          </form>
        </Container>
      </Modal>
    </>
  );
}

export default CreateNextRoundForm;
