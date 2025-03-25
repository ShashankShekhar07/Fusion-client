import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Container,
  Grid,
  Title,
  Text,
  Paper,
  Select,
  Textarea,
  FileInput,
  Group,
  Box,
} from "@mantine/core";
import { host } from "../../../routes/globalRoutes";

function MakeAnnouncement() {
  const [programme, setProgramme] = useState("");
  const [batch, setBatch] = useState("");
  const [department, setDepartment] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [key, setKey] = useState(0); // State to force re-render

  const resetFormFields = () => {
    setProgramme("");
    setBatch("");
    setDepartment("");
    setAnnouncement("");
    setFile(null);
    setIsSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setIsSuccess(false);

    const token = localStorage.getItem("authToken");

    const url = `${host}/dep/api/announcements/`;

    const formData = new FormData();
    formData.append("programme", programme);
    formData.append("batch", batch);
    formData.append("department", department);
    formData.append("message", announcement);
    if (file) {
      formData.append("upload_announcement", file);
    }

    try {
      await axios.post(url, formData, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      setIsSuccess(true);

      setTimeout(() => {
        resetFormFields();
        setKey((prevKey) => prevKey + 1); // Change the key to force re-render
      }, 2000);
    } catch (error) {
      const errorResponse = error.response?.data || error.message;
      setErrorMessage(
        errorResponse.detail ||
          "Error creating Announcement. Please try again.",
      );
      console.error("Error creating Announcement:", errorResponse);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      size="xl"
      style={{
        height: "75vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 0,
      }}
    >
      <Box style={{ width: "60vw", maxWidth: "1240px" }}>
        <Title order={2} align="center" mb="xl">
          Create Announcement
        </Title>

        {errorMessage && (
          <Text color="red" mb="md" align="center">
            {errorMessage}
          </Text>
        )}

        <Paper
          key={key}
          radius="md"
          px="lg"
          pt="sm"
          pb="xl"
          style={{
            borderLeft: "0.6rem solid #15ABFF",
            backgroundColor: "white",
            minHeight: "45vh",
            maxHeight: "70vh",
          }}
          withBorder
        >
          <form onSubmit={handleSubmit}>
            <Grid>
              <Grid.Col span={6}>
                <Select
                  label="Programme"
                  placeholder="Select Programme Type"
                  value={programme}
                  onChange={setProgramme}
                  data={["M.tech", "B.Tech", "Phd", "other"]}
                  required
                  mb="md"
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select
                  label="Batch"
                  placeholder="Select Batch"
                  value={batch}
                  onChange={setBatch}
                  data={["All", "Year-1", "Year-2", "Year-3", "Year-4"]}
                  required
                  mb="md"
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <Select
                  label="Department"
                  placeholder="Select Department Type"
                  value={department}
                  onChange={setDepartment}
                  data={[
                    "ALL",
                    "CSE",
                    "ECE",
                    "ME",
                    "SM",
                    "Natural Science",
                    "Design",
                  ]}
                  required
                  mb="md"
                />
              </Grid.Col>
            </Grid>

            <Textarea
              label="Announcement Details"
              placeholder="What is the Announcement?"
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              required
              mb="md"
            />

            <FileInput
              label="Attach Files (PDF, JPEG, PNG, JPG)"
              placeholder="Choose File"
              accept=".pdf,.jpeg,.png,.jpg"
              onChange={setFile}
              mb="md"
            />

            <Group position="right" mt="xs">
              <Button
                type="submit"
                style={{
                  width: "150px",
                  backgroundColor: isSuccess ? "#2BB673" : undefined,
                  color: isSuccess ? "black" : "white",
                }}
                variant="filled"
                color="blue"
                loading={loading}
              >
                {loading ? "Loading..." : isSuccess ? "Submitted" : "Submit"}
              </Button>
            </Group>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default MakeAnnouncement;
