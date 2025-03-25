import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { MantineProvider, Table, Text, Box } from "@mantine/core";
import axios from "axios";
import { fetchCompletedBookingsRoute } from "../../routes/visitorsHostelRoutes";

function BookingTable({ bookings }) {
  const sortedBookings = bookings.sort(
    (a, b) => new Date(a.checkIn) - new Date(b.checkIn),
  );

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
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <Text
            style={{
              paddingBottom: 15,
              fontWeight: "bold",
              fontSize: "24px",
              color: "#228be6",
            }}
          >
            Completed Bookings
          </Text>
        </Box>
      </Box>
      <Box style={{ overflowX: "auto", maxWidth: "100%" }}>
        <Table
          style={{
            borderRadius: "8px",
            border: "1px solid #E0E0E0",
            minWidth: "800px", // Adjust this value based on your table's minimum width
          }}
        >
          <thead>
            <tr>
              <th style={{ backgroundColor: "#E6F3FF", padding: "12px" }}>
                Intender
              </th>
              <th style={{ backgroundColor: "#E6F3FF", padding: "12px" }}>
                Booking Date
              </th>
              <th style={{ backgroundColor: "#E6F3FF", padding: "12px" }}>
                Check In
              </th>
              <th style={{ backgroundColor: "#E6F3FF", padding: "12px" }}>
                Check Out
              </th>
              <th style={{ backgroundColor: "#E6F3FF", padding: "12px" }}>
                Category
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedBookings.map((booking, index) => (
              <tr
                key={booking.id}
                style={{
                  backgroundColor: index % 2 === 0 ? "#ffffff" : "#F5F7F8",
                }}
              >
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  <Text weight={500}>{booking.intender}</Text>
                  <Text size="sm" color="dimmed">
                    {booking.intender}
                  </Text>
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  {booking.bookingDate}
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  {booking.checkIn}
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  {booking.checkOut}
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  {booking.category}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Box>
    </Box>
  );
}

BookingTable.propTypes = {
  bookings: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      intender: PropTypes.string.isRequired,
      bookingDate: PropTypes.string.isRequired,
      checkIn: PropTypes.string.isRequired,
      checkOut: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

function CompletedBookingsPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchCompletedBookings = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return console.error("No authentication token found!");
      }

      try {
        const { data } = await axios.get(fetchCompletedBookingsRoute, {
          headers: { Authorization: `Token ${token}` },
        });
        setBookings(data.completed_bookings);
      } catch (error) {
        console.error("Error fetching completed bookings:", error);
      }
    };

    fetchCompletedBookings();
  }, []);

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        globalStyles: () => ({
          ".mantine-Table-root": {
            overflowX: "auto",
          },
          "@media (max-width: 768px)": {
            ".mantine-Table-root": {
              fontSize: "14px",
            },
          },
        }),
      }}
    >
      <Box
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "16px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <BookingTable bookings={bookings} />
      </Box>
    </MantineProvider>
  );
}

export default CompletedBookingsPage;
