import React, { useState, useEffect } from "react";
import {
  MantineProvider,
  Grid,
  Button,
  Box,
  Text,
  Card,
  Group,
  Badge,
} from "@mantine/core";
import axios from "axios";
import PropTypes from "prop-types";
import { fetchPartialBookingdataRoute } from "../../routes/visitorsHostelRoutes";
import { host } from "../../routes/globalRoutes";

function RoomsDetails({ bookingFrom, bookingTo }) {
  const [availableRooms, setAvailableRooms] = useState([]);
  const [partialBookingData, setPartialBookingData] = useState([]);

  const roomData = {
    G: ["G01", "G02", "G03", "G04", "G05", "G06", "G07", "G08", "G09", "G10"],
    F: [
      "F01",
      "F02",
      "F03",
      "F04",
      "F05",
      "F06",
      "F07",
      "F08",
      "F09",
      "F10",
      "F11",
      "F12",
    ],
    S: ["S01", "S02", "S03", "S04", "S05", "S06"],
    T: ["T01", "T02", "T03", "T04", "T05", "T06", "T07", "T08"],
  };

  useEffect(() => {
    const fetchAvailableRooms = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return console.error("No authentication token found!");
      }

      try {
        const response = await axios.post(
          `${host}/visitorhostel/room_availabity_new/`,
          { start_date: bookingFrom, end_date: bookingTo },
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        setAvailableRooms(response.data.available_rooms);
      } catch (error) {
        console.error("Error fetching available rooms:", error);
      }
    };

    const fetchPartialBookingData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return console.error("No authentication token found!");
      }

      try {
        const response = await axios.post(
          fetchPartialBookingdataRoute,
          { start_date: bookingFrom, end_date: bookingTo },
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        setPartialBookingData(response.data);
      } catch (error) {
        console.error("Error fetching partial booking data:", error);
      }
    };

    if (bookingFrom && bookingTo) {
      fetchAvailableRooms();
      fetchPartialBookingData();
    }
  }, [bookingFrom, bookingTo]);

  const filteredPartialBookingData = partialBookingData.filter(
    (data) => data.available_ranges && data.available_ranges.length > 0,
  );

  const getButtonColor = (room) => {
    if (availableRooms.includes(room)) {
      return "green";
    }
    const partialRoom = filteredPartialBookingData.find(
      (data) => data.room_number === room,
    );
    if (partialRoom) {
      return "yellow";
    }
    return "red";
  };

  return (
    <MantineProvider theme={{ fontFamily: "Arial, sans-serif" }}>
      <Box>
        {Object.keys(roomData).map((section) => (
          <Grid
            key={section}
            justify="center"
            gutter="xs"
            style={{ marginBottom: "10px", marginTop: "10px" }}
          >
            {roomData[section].map((room) => (
              <Grid.Col
                span={1}
                key={room}
                style={{ textAlign: "center", padding: "5px" }}
              >
                <Button
                  variant="filled"
                  color={getButtonColor(room)}
                  style={{ width: "64px", height: "40px" }}
                >
                  {room}
                </Button>
              </Grid.Col>
            ))}
          </Grid>
        ))}
      </Box>

      <Box mt="xl">
        <Text size="xl" weight={700} mb="md" style={{ fontWeight: "bold" }}>
          Partial Booking Availability
        </Text>
        {filteredPartialBookingData.length > 0 ? (
          <Grid>
            {filteredPartialBookingData.map((data) => (
              <Grid.Col key={data.room_id} span={6}>
                <Card
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                  style={{ backgroundColor: "#f8f9fa" }}
                >
                  <Group position="apart" mb="xs">
                    <Text weight={600} style={{ fontWeight: "bold" }}>
                      Room {data.room_number}
                    </Text>
                    <Badge color="yellow" variant="light">
                      Partial
                    </Badge>
                  </Group>
                  <Text size="sm" color="dimmed" mb="xs">
                    Partial availability:
                  </Text>
                  <Box
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                    }}
                  >
                    {data.available_ranges.map((range, index) => (
                      <Button
                        key={index}
                        variant="light"
                        color="blue"
                        style={{
                          backgroundColor: "#E6F3FF",
                          fontSize: "12px",
                          flex: "1 1 45%",
                          marginTop: "5px",
                        }}
                      >
                        From {new Date(range.from).toLocaleDateString()} to{" "}
                        {new Date(range.to).toLocaleDateString()}
                      </Button>
                    ))}
                  </Box>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        ) : (
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            style={{ backgroundColor: "#f8f9fa" }}
          >
            <Text align="center" color="dimmed">
              No partial bookings available.
            </Text>
          </Card>
        )}
      </Box>
    </MantineProvider>
  );
}

RoomsDetails.propTypes = {
  bookingFrom: PropTypes.string.isRequired,
  bookingTo: PropTypes.string.isRequired,
};

export default RoomsDetails;
