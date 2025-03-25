import React, { useState } from "react";
import { DateInput } from "@mantine/dates";
import {
  Button,
  Container,
  Paper,
  Title,
  Space,
  Notification,
  Group,
} from "@mantine/core";
import "@mantine/dates/styles.css"; // Import Mantine DateInput styles
import dayjs from "dayjs"; // Day.js for locale support
import axios from "axios";
import { notifications } from "@mantine/notifications";
import { updateSemDatesRoute } from "../routes";

function DateSelectionForm() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (endDate <= startDate) {
      notifications.show({
        title: "Failed",
        message: "End date must be greater than start date",
        color: "red",
        position: "top-center",
      });
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("authToken");

      const response = await axios.post(
        updateSemDatesRoute,
        {
          sem: "2024",
          start_reg: dayjs(startDate).format("YYYY-MM-DD"),
          end_reg: dayjs(endDate).format("YYYY-MM-DD"),
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );

      if (response.status === 200) {
        notifications.show({
          title: "Success",
          message: "Semester dates updated successfully",
          color: "green",
          position: "top-center",
        });
        setStartDate(null);
        setEndDate(null);
      }
    } catch (err) {
      console.error("Server response:", error.response.data);

      notifications.show({
        title: "Error",
        message: "Something went wrong. Please try again later.",
        color: "red",
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      size="lg"
      style={{
        width: "max",
        marginTop: "100px",
      }}
    >
      <Paper
        shadow="md"
        radius="md"
        p="xl"
        withBorder
        style={{ width: "100%", padding: "30px" }}
      >
        <Title order={2} align="center" mb="lg" style={{ color: "#1c7ed6" }}>
          Update Semester Dates
        </Title>

        {error && (
          <Notification color="red" onClose={() => setError(null)}>
            {error}
          </Notification>
        )}

        <form onSubmit={handleSubmit}>
          {/* Start Date input */}
          <Group grow>
            <DateInput
              label="Start Date"
              placeholder="MM/DD/YYYY"
              fullWidth
              value={startDate}
              minDate={new Date()}
              onChange={setStartDate}
              required
              radius="md"
              size="md"
              mb="lg"
              styles={(theme) => ({
                input: {
                  backgroundColor: "#f0f3f7",
                  border: `1px solid ${theme.colors.blue[6]}`,
                },
                dropdown: {
                  backgroundColor: theme.colors.gray[0],
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                },
                day: {
                  "&[dataSelected]": {
                    backgroundColor: theme.colors.blue[6],
                  },
                  "&[dataToday]": {
                    backgroundColor: theme.colors.gray[2],
                    fontWeight: "bold",
                  },
                },
              })}
            />

            {/* End Date input */}
            <DateInput
              label="End Date"
              placeholder="MM/DD/YYYY"
              value={endDate}
              onChange={setEndDate}
              fullWidth
              minDate={startDate || new Date()}
              required
              radius="md"
              size="md"
              mb="lg"
              styles={(theme) => ({
                input: {
                  backgroundColor: "#f0f3f7",
                  border: `1px solid ${theme.colors.blue[6]}`,
                },
                dropdown: {
                  backgroundColor: theme.colors.gray[0],
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                },
                day: {
                  "&[dataSelected]": {
                    backgroundColor: theme.colors.blue[6],
                  },
                  "&[dataToday]": {
                    backgroundColor: theme.colors.gray[2],
                    fontWeight: "bold",
                  },
                },
              })}
            />
          </Group>
          <Space h="xl" />

          {/* Submit button */}
          <Button
            type="submit"
            fullWidth
            size="md"
            radius="md"
            color="blue"
            loading={loading}
          >
            Update
          </Button>
        </form>
      </Paper>
      <Space h="xl" />
    </Container>
  );
}

export default DateSelectionForm;
