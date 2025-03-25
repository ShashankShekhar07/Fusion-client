import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Select,
  Container,
  Paper,
  Title,
  Group,
  Flex,
  Textarea,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import "@mantine/dates/styles.css";
import "dayjs/locale/en";
import { Calendar } from "@phosphor-icons/react";
import { specialFoodRequestRoute } from "../routes";

function ApplyForSpecialFood() {
  const [food, setFood] = useState("");
  const [timing, setTiming] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [purpose, setPurpose] = useState("");
  const authToken = localStorage.getItem("authToken");
  console.log(authToken);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const requestData = {
      start_date: fromDate.toISOString().split("T")[0],
      end_date: toDate.toISOString().split("T")[0],
      status: "1", // Pending status
      app_date: new Date().toISOString().split("T")[0],
      request: purpose,
      item1: food,
      item2: timing,
    };
    console.log(requestData);

    try {
      const response = await axios.post(specialFoodRequestRoute, requestData, {
        headers: {
          Authorization: `Token ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        alert("Special food request submitted successfully!");
        setFood("");
        setTiming("");
        setFromDate(null);
        setToDate(null);
        setPurpose("");
      } else {
        console.error("Failed to submit request:", response.data);
        alert(`Error: ${response.data.message || "Submission failed."}`);
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
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
        <Title
          order={2}
          align="center"
          mb="lg"
          style={{ color: "#1c7ed6", fontWeight: 600 }}
        >
          Apply for Special Food
        </Title>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="md">
            <Select
              label="Select Food"
              placeholder="Choose food"
              data={["Dal Chawal", "Paneer Butter Masala", "Chicken Curry"]}
              value={food}
              onChange={setFood}
              required
            />

            <Select
              label="Select Food Timing"
              placeholder="Choose timing"
              data={["Breakfast", "Lunch", "Dinner"]}
              value={timing}
              onChange={setTiming}
              required
            />

            <DateInput
              label="From"
              placeholder="Select start date"
              value={fromDate}
              onChange={setFromDate}
              icon={<Calendar />}
              required
            />

            <DateInput
              label="To"
              placeholder="Select end date"
              value={toDate}
              onChange={setToDate}
              icon={<Calendar />}
              required
            />

            <Textarea
              label="Purpose"
              placeholder="Enter purpose"
              value={purpose}
              onChange={(event) => setPurpose(event.currentTarget.value)}
              required
            />
          </Flex>

          <Group position="right" mt="lg">
            <Button type="submit" color="blue" size="md">
              Submit
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}

export default ApplyForSpecialFood;
