import React, { useState } from "react";
import {
  MantineProvider,
  Table,
  Button,
  Box,
  Text,
  TextInput,
  Grid,
} from "@mantine/core";
import RoomsDetails from "./roomsAvailibilityDetails.jsx";

function BookingsRequestTable() {
  const [showForm, setShowForm] = useState(false); // Manage form visibility
  const [bookingFrom, setBookingFrom] = useState(""); // State for booking from date
  const [bookingTo, setBookingTo] = useState(""); // State for booking to date

  const handleButtonClick = () => {
    setShowForm(true); // Show the BookingForm when button is clicked
  };

  return (
    <Box p="md" style={{ margin: 10 }}>
      <Box
        mb="md"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          style={{ display: "flex", justifyContent: "center", width: "90%" }}
        >
          <Text
            style={{
              paddingBottom: 10,
              fontWeight: "bold",
              fontSize: "24px",
              color: "#228be6",
            }}
          >
            Rooms Availability
          </Text>
        </Box>

        <Button
          variant="outline"
          color="green"
          onClick={handleButtonClick}
          sx={{ paddingLeft: "10px" }} // Fixed padding syntax
        >
          Submit
        </Button>
      </Box>

      <Table
        style={{
          marginTop: "20px",
          borderRadius: "8px", // Border radius for table
          overflow: "hidden", // Overflow hidden to round table corners
          border: "1px solid #E0E0E0", // Optional border for visibility
        }}
      >
        <thead>
          <tr>
            <th style={{ backgroundColor: "#E6F3FF", padding: "12px" }}>
              Booking From
            </th>
            <th style={{ backgroundColor: "#E6F3FF", padding: "12px" }}>
              Booking To
            </th>
          </tr>
          <tr>
            <td style={{ padding: "12px" }}>
              <Grid>
                <Grid.Col span={12}>
                  <TextInput
                    placeholder="From"
                    type="date"
                    required
                    value={bookingFrom}
                    onChange={(event) =>
                      setBookingFrom(event.currentTarget.value)
                    }
                  />
                </Grid.Col>
              </Grid>
            </td>
            <td style={{ padding: "12px" }}>
              <Grid>
                <Grid.Col span={12}>
                  <TextInput
                    placeholder="To"
                    type="date"
                    required
                    value={bookingTo}
                    onChange={(event) =>
                      setBookingTo(event.currentTarget.value)
                    }
                  />
                </Grid.Col>
              </Grid>
            </td>
          </tr>
        </thead>
      </Table>
      {showForm && (
        <RoomsDetails
          bookingFrom={bookingFrom}
          bookingTo={bookingTo}
          onClose={() => setShowForm(false)}
        />
      )}
    </Box>
  );
}

function RoomsAvailability() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Box
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "12px", // Add border radius to outer Box
          padding: "16px", // Optional padding
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Optional shadow
        }}
      >
        <BookingsRequestTable />
      </Box>
    </MantineProvider>
  );
}

export default RoomsAvailability;
