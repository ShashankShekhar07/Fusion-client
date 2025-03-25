import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { MantineProvider, Table, Badge, Text, Box } from "@mantine/core";
import axios from "axios";
import { fetchCancelledBookingsRoute } from "../../routes/visitorsHostelRoutes";

function CancellationRequestTable({ bookings }) {
  const sortedBookings = bookings.sort(
    (a, b) => new Date(a.bookingFrom) - new Date(b.bookingFrom),
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
            Cancelled Requests
          </Text>
        </Box>
      </Box>

      <Box style={{ overflowX: "auto", maxWidth: "100%" }}>
        <Table
          style={{
            borderRadius: "8px",
            border: "1px solid #E0E0E0",
            minWidth: "800px",
          }}
        >
          <thead>
            <tr>
              <th style={{ backgroundColor: "#E6F3FF", padding: "12px" }}>
                Intender
              </th>
              <th style={{ backgroundColor: "#E6F3FF", padding: "12px" }}>
                Booking From
              </th>
              <th style={{ backgroundColor: "#E6F3FF", padding: "12px" }}>
                Booking To
              </th>
              <th style={{ backgroundColor: "#E6F3FF", padding: "12px" }}>
                Category
              </th>
              <th style={{ backgroundColor: "#E6F3FF", padding: "12px" }}>
                Status
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
                    {booking.email}
                  </Text>
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  {booking.bookingFrom}
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  {booking.bookingTo}
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
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  <Badge
                    color={booking.status === "Pending" ? "gray" : "pink"}
                    variant="light"
                    style={{
                      backgroundColor:
                        booking.status === "Pending" ? "#E0E0E0" : "#FFE0E0",
                      color:
                        booking.status === "Pending" ? "#757575" : "#FF6B6B",
                      padding: "4px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    {booking.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Box>
    </Box>
  );
}

CancellationRequestTable.propTypes = {
  bookings: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      intender: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      bookingFrom: PropTypes.string.isRequired,
      bookingTo: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

function CancellationRequest() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchCancelledBookings = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return console.error("No authentication token found!");
      }

      try {
        const { data } = await axios.get(fetchCancelledBookingsRoute, {
          headers: { Authorization: `Token ${token}` },
        });
        setBookings(data.cancelled_bookings);
      } catch (error) {
        console.error("Error fetching cancelled bookings:", error);
      }
    };

    fetchCancelledBookings();
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
        <CancellationRequestTable bookings={bookings} />
      </Box>
    </MantineProvider>
  );
}

export default CancellationRequest;
