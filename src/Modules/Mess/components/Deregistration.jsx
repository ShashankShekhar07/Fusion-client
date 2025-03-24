import React, { useState } from "react";
import {
  Button,
  Container,
  Paper,
  Group,
  Title,
  Text,
  Stack,
} from "@mantine/core";
import { useSelector } from "react-redux";
import { DateInput, Calendar } from "@mantine/dates";
import axios from "axios";
import { deregistrationRequestRoute } from "../routes";

function Deregistration() {
  const roll_no = useSelector((state) => state.user.roll_no);
  const [endDate, setEndDate] = useState(null);
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!endDate) {
      alert("Please select an end date.");
      return;
    }

    const data = {
      student_id: roll_no,
      end_date: endDate.toISOString().split("T")[0],
    };

    try {
      const response = await axios.post(deregistrationRequestRoute, data, {
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.status === 200) {
        alert("Deregistration request submitted successfully!");
      }
    } catch (error) {
      alert("Error submitting deregistration request");
    }
  };

  return (
    <Container
      size="lg"
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        marginTop: "40px",
      }}
    >
      <Paper
        shadow="xl"
        radius="md"
        p="xl"
        withBorder
        style={{
          minWidth: "75rem",
          width: "100%",
          padding: "30px",
          margin: "auto",
        }}
      >
        <Stack>
          <Title order={2} align="left" color="#1c7ed6">
            Deregistration Request
          </Title>
          <Text size="sm">
            Click on the Deregister Button below to request deregistration. If
            your request is pending, view the status in the status bar. You will
            be deregistered from the mess on the date which you fill, and you
            can't eat on that day. Thus, advised to fill the next day instead of
            today.
          </Text>

          <form onSubmit={handleSubmit}>
            <Group position="apart" align="center">
              <DateInput
                label="End Date*"
                placeholder="dd-mm-yyyy"
                value={endDate}
                onChange={setEndDate}
                required
                radius="md"
                size="md"
                icon={<Calendar size={20} />}
                labelProps={{ style: { marginBottom: "10px" } }}
                styles={(theme) => ({
                  dropdown: {
                    backgroundColor: theme.colors.gray[0],
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                  },
                  day: {
                    "&[data-selected]": {
                      backgroundColor: theme.colors.blue[6],
                    },
                    "&[data-today]": {
                      backgroundColor: theme.colors.gray[2],
                      fontWeight: "bold",
                    },
                  },
                })}
                mb="lg"
              />
              {/* <DatePicker
                label="End Date*"
                placeholder="dd-mm-yyyy"
                value={endDate}
                onChange={setEndDate}
                required
                radius="md"
                size="sm"
                labelProps={{ style: { marginBottom: "10px" } }}
                inputFormat="DD-MM-YYYY"
                dateFormat="DD-MM-YYYY"
                style={{ width: "60%" }}
              /> */}
              <Button
                size="md"
                radius="md"
                color="blue"
                type="submit"
                style={{ width: "20%" }}
              >
                Deregister
              </Button>
            </Group>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
}

export default Deregistration;
