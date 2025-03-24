import React, { useState } from "react";
import {
  Button,
  Container,
  Title,
  Paper,
  Space,
  Textarea,
  Grid,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { Calendar } from "@phosphor-icons/react";
import "@mantine/dates/styles.css";
import "dayjs/locale/en";
import { rebateRoute } from "../routes";

function RebateApplication() {
  const [rebateFromDate, setRebateFromDate] = useState(null);
  const [rebateToDate, setRebateToDate] = useState(null);
  const [purpose, setPurpose] = useState("");

  const formatDate = (date) =>
    date ? new Date(date).toISOString().split("T")[0] : "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem("authToken");

    const formData = {
      start_date: formatDate(rebateFromDate),
      end_date: formatDate(rebateToDate),
      purpose,
      status: "1",
      app_date: formatDate(new Date()),
      leave_type: "rebate",
    };

    try {
      const response = await fetch(rebateRoute, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.status === 3) {
        alert(result.message);
      } else if (response.ok) {
        alert(result.message || "Rebate application submitted successfully!");
      } else {
        alert(result.message || "Failed to submit the rebate application.");
      }
    } catch (error) {
      console.error("Error submitting rebate application:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <Container
      size="lg"
      style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
    >
      <Paper
        shadow="md"
        radius="md"
        p="xl"
        withBorder
        style={{ width: "100%", minWidth: "70rem", padding: "2rem" }}
      >
        <Title order={2} align="center" mb="lg" style={{ color: "#1c7ed6" }}>
          Rebate Application Form
        </Title>
        <form onSubmit={handleSubmit}>
          <Grid grow>
            <Grid.Col span={6}>
              <DateInput
                label="Rebate From"
                placeholder="MM/DD/YYYY"
                value={rebateFromDate}
                onChange={setRebateFromDate}
                required
                radius="md"
                size="md"
                icon={<Calendar size={20} />}
                mb="lg"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <DateInput
                label="Rebate To"
                placeholder="MM/DD/YYYY"
                value={rebateToDate}
                onChange={setRebateToDate}
                required
                radius="md"
                size="md"
                icon={<Calendar size={20} />}
                mb="lg"
              />
            </Grid.Col>
          </Grid>
          <Textarea
            label="Purpose"
            placeholder="Enter the purpose of the rebate"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            required
            radius="md"
            size="md"
            mb="lg"
          />
          <Space h="xl" />
          <Button type="submit" fullWidth size="md" radius="md" color="blue">
            Submit
          </Button>
        </form>
      </Paper>
      <Space h="xl" />
    </Container>
  );
}
export default RebateApplication;
