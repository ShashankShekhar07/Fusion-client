import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MantineProvider,
  Table,
  Button,
  Badge,
  Text,
  Box,
} from "@mantine/core";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
// eslint-disable-next-line import/no-unresolved
import { FaEye } from "react-icons/fa"; // Import the eye icon
import CombinedBookingForm from "./bookingForm";
import ForwardBookingForm from "./forwardBooking";
import ConfirmBookingIn from "./confirmBooking_Incharge";
import ViewBooking from "./viewBooking"; // Import the new ViewBooking component
import { fetchBookingsRoute } from "../../routes/visitorsHostelRoutes";

function BookingsRequestTable({ bookings, onBookingForward }) {
  const [modalOpened, setModalOpened] = useState(false); // State to control modal
  const [forwardModalOpened, setForwardModalOpened] = useState(null); // State to control forward modal for each booking
  const [viewModalOpened, setViewModalOpened] = useState(null); // State to control view modal for each booking

  const handleForwardButtonClick = (bookingId) => {
    setForwardModalOpened(bookingId); // Open modal for the specific booking
  };

  const handleForwardCloseModal = () => {
    setForwardModalOpened(null); // Close modal
    onBookingForward(); // Call the fetch function to refresh bookings when closing the modal
  };

  const handleButtonClick = () => {
    setModalOpened(true); // Open modal when "Place Request" is clicked
  };

  const handleCloseModal = () => {
    setModalOpened(false); // Close modal
  };

  const handleViewBooking = (bookingId) => {
    setViewModalOpened(bookingId); // Open modal for the specific booking
  };

  const handleViewCloseModal = () => {
    setViewModalOpened(null); // Close modal
  };

  const role = useSelector((state) => state.user.role);

  // Filter bookings based on role and status
  const filteredBookings = bookings.filter((booking) => {
    if (role === "VhIncharge") {
      return booking.status === "Forward";
    }
    if (role === "VhCaretaker") {
      return booking.status === "Pending";
    }
    return booking.status !== "Forward";
  });

  // Sort bookings by "booking from" date in ascending order
  const sortedBookings = filteredBookings.sort(
    (a, b) => new Date(a.bookingFrom) - new Date(b.bookingFrom),
  );

  return (
    <Box p="md" style={{ margin: 10 }}>
      {bookings.status}
      <Box
        mb="md"
        style={{
          display: "flex",
          justifyContent: "center", // Centers the content horizontally
          alignItems: "center", // Centers the content vertically
          width: "100%", // Ensures the Box takes full width
          gap: "1rem", // Adds space between the text and button
        }}
      >
        <Box
          style={{ display: "flex", justifyContent: "center", width: "80%" }}
        >
          <Text
            style={{
              paddingBottom: 15,
              fontWeight: "bold",
              fontSize: "24px",
              color: "#228be6",
            }}
          >
            Booking Requests
          </Text>
        </Box>

        <Button variant="outline" color="red" onClick={handleButtonClick}>
          Place Request
        </Button>
      </Box>

      {modalOpened && (
        <CombinedBookingForm
          modalOpened={modalOpened}
          onClose={handleCloseModal}
        />
      )}
      <Box style={{ overflowX: "auto", maxWidth: "100%" }}>
        <Table
          style={{
            borderRadius: "8px",
            border: "1px solid #E0E0E0",
            minWidth: "600px", // Adjust this value based on your table's minimum width
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
              {role === "VhIncharge" && (
                <th style={{ backgroundColor: "#E6F3FF", padding: "12px" }}>
                  Modified Category
                </th>
              )}
              <th style={{ backgroundColor: "#E6F3FF", padding: "12px" }}>
                Status
              </th>
              <th style={{ backgroundColor: "#E6F3FF", padding: "12px" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedBookings.map((booking, index) => (
              <tr
                key={booking.id}
                style={{
                  backgroundColor: index % 2 === 0 ? "#ffffff" : "#F5F7F8", // Alternating row colors
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
                  {console.log("BOOKING: ", booking)}
                </td>
                {role === "VhIncharge" ? (
                  <td
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #E0E0E0",
                      textAlign: "center",
                    }}
                  >
                    {booking.modifiedCategory}
                  </td>
                ) : null}
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  {role === "VhCaretaker" && booking.status === "Pending" ? (
                    <>
                      <Button
                        variant="outline"
                        color="green"
                        onClick={() => handleForwardButtonClick(booking.id)}
                      >
                        Forward
                      </Button>
                      {forwardModalOpened === booking.id && (
                        <ForwardBookingForm
                          forwardmodalOpened={forwardModalOpened === booking.id}
                          onClose={handleForwardCloseModal}
                          onBookingForward={onBookingForward} // Pass the function down
                          bookingId={booking.id}
                        />
                      )}
                    </>
                  ) : role === "VhIncharge" && booking.status === "Forward" ? (
                    <>
                      <Button
                        variant="outline"
                        color="green"
                        onClick={() => handleForwardButtonClick(booking.id)}
                      >
                        Confirm
                      </Button>
                      {forwardModalOpened === booking.id && (
                        <ConfirmBookingIn
                          forwardmodalOpened={forwardModalOpened === booking.id}
                          onClose={handleForwardCloseModal}
                          bookingId={booking.id}
                          bookingf={booking}
                        />
                      )}
                    </>
                  ) : (
                    <Badge
                      color={
                        booking.status === "Pending"
                          ? "gray"
                          : booking.status === "Confirmed"
                            ? "green"
                            : "red"
                      }
                      variant="light"
                      style={{
                        backgroundColor:
                          booking.status === "Pending"
                            ? "#E0E0E0"
                            : booking.status === "Confirmed"
                              ? "#dffbe0"
                              : "#f8d7da",
                        color:
                          booking.status === "Pending"
                            ? "#757575"
                            : booking.status === "Confirmed"
                              ? "#84b28c"
                              : "#721c24",
                        padding: "4px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      {booking.status}
                    </Badge>
                  )}
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  <Button
                    variant="outline"
                    color="blue"
                    onClick={() => handleViewBooking(booking.id)}
                  >
                    <FaEye />
                  </Button>
                  {viewModalOpened === booking.id && (
                    <ViewBooking
                      modalOpened={viewModalOpened === booking.id}
                      onClose={handleViewCloseModal}
                      bookingId={booking.id}
                      bookingf={booking}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Box>
    </Box>
  );
}

// Define prop types for BookingsRequestTable
BookingsRequestTable.propTypes = {
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
  onBookingForward: PropTypes.func.isRequired, // Add this line for validation
};

function Bookings() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return console.error("No authentication token found!");
    }

    try {
      const { data } = await axios.get(fetchBookingsRoute, {
        headers: { Authorization: `Token ${token}` },
      });
      setBookings(data.pending_bookings);
    } catch (error) {
      console.error("Error fetching booking requests:", error);
    }
  };

  // Use useEffect to fetch bookings on mount
  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        globalStyles: () => ({
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
        <BookingsRequestTable
          bookings={bookings}
          onBookingForward={fetchBookings} // Pass the fetch function as a prop
        />
      </Box>
    </MantineProvider>
  );
}

export default Bookings;
