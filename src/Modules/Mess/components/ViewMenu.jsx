import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Container,
  Paper,
  Title,
  Button,
  Flex,
  Divider,
  Loader,
  Alert,
} from "@mantine/core";
import { viewMenuRoute } from "../routes";

const tableHeaders = ["Day", "Breakfast", "Lunch", "Dinner"];

function ViewMenu() {
  const [currentMess, setCurrentMess] = useState("mess1");
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch menu data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Authentication token not found.");
          return;
        }

        const response = await axios.get(viewMenuRoute, {
          headers: {
            Authorization: `Token ${token}`, // Pass the token in the Authorization header
          },
        });

        console.log("API Response Data:", response.data); // Debugging log to check data
        setMenuData(response.data.payload); // Assuming your response data is wrapped in "payload"
      } catch (errors) {
        setError("Error fetching menu data.");
        console.error("Error fetching menu data:", errors);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); // Empty array to run once when component mounts

  const parseMealTime = (mealTime) => {
    const mealMapping = {
      B: "Breakfast",
      L: "Lunch",
      D: "Dinner",
    };

    const dayMapping = {
      M: "Monday",
      T: "Tuesday",
      W: "Wednesday",
      TH: "Thursday",
      F: "Friday",
      S: "Saturday",
      SU: "Sunday",
    };

    const dayCode = mealTime.slice(0, mealTime.length - 1);
    const mealCode = mealTime[mealTime.length - 1];
    const day = dayMapping[dayCode];
    const meal = mealMapping[mealCode];

    return { day, meal };
  };

  // Filter menu data by current mess option and group meals by day
  const filterMenuData = (messOption) => {
    const daysOfWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    const groupedMenuData = {};

    // Initialize the structure with all days and meals
    daysOfWeek.forEach((day) => {
      groupedMenuData[day] = {
        Breakfast: "N/A",
        Lunch: "N/A",
        Dinner: "N/A",
      };
    });

    // Populate the grouped data based on the API response
    menuData.forEach((item) => {
      if (item.mess_option === messOption) {
        const { day, meal } = parseMealTime(item.meal_time);
        if (day && meal && groupedMenuData[day]) {
          groupedMenuData[day][meal] = item.dish;
        }
      }
    });

    // Convert grouped data into an array for rendering
    return daysOfWeek.map((day) => ({
      day,
      breakfast: groupedMenuData[day].Breakfast,
      lunch: groupedMenuData[day].Lunch,
      dinner: groupedMenuData[day].Dinner,
    }));
  };

  const rows = filterMenuData(currentMess);

  // Render table headers
  const renderHeader = (titles) => {
    return titles.map((title, index) => (
      <Table.Th key={index}>
        <Flex align="center" justify="center" h="100%">
          {title}
        </Flex>
      </Table.Th>
    ));
  };

  // Render table rows
  const renderRows = () =>
    rows.map((item, index) => (
      <Table.Tr key={index} h={60}>
        <Table.Td align="center" p={12}>
          {item.day}
        </Table.Td>
        <Table.Td align="center" p={12}>
          {item.breakfast}
        </Table.Td>
        <Table.Td align="center" p={12}>
          {item.lunch}
        </Table.Td>
        <Table.Td align="center" p={12}>
          {item.dinner}
        </Table.Td>
      </Table.Tr>
    ));

  return (
    <Container
      size="lg"
      mt={30}
      miw="75rem"
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        marginTop: "50px",
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
        <Title order={2} align="center" mb="lg" c="#1c7ed6">
          Weekly Mess Menu
        </Title>
        <Divider my="lg" />

        {/* Error and Loading State */}
        {loading ? (
          <Flex justify="center" align="center" style={{ minHeight: "200px" }}>
            <Loader size="xl" />
          </Flex>
        ) : error ? (
          <Alert color="red" title="Error" mb="lg">
            {error}
          </Alert>
        ) : (
          <>
            <Flex justify="center" mb="lg" gap="md">
              <Button
                variant={currentMess === "mess1" ? "filled" : "outline"}
                size="md"
                radius="md"
                onClick={() => setCurrentMess("mess1")}
                color={currentMess === "mess1" ? "blue" : "gray"}
                fullWidth
              >
                Mess 1
              </Button>
              <Button
                variant={currentMess === "mess2" ? "filled" : "outline"}
                size="md"
                radius="md"
                onClick={() => setCurrentMess("mess2")}
                color={currentMess === "mess2" ? "blue" : "gray"}
                fullWidth
              >
                Mess 2
              </Button>
            </Flex>

            <Table
              striped
              highlightOnHover
              withColumnBorders
              horizontalSpacing="xl"
            >
              <Table.Thead>
                <Table.Tr>{renderHeader(tableHeaders)}</Table.Tr>
              </Table.Thead>
              <Table.Tbody>{renderRows()}</Table.Tbody>
            </Table>
          </>
        )}
      </Paper>
    </Container>
  );
}

export default ViewMenu;
