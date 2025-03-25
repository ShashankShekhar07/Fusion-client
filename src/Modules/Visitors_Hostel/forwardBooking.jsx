import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  MantineProvider,
  TextInput,
  Select,
  NumberInput,
  Button,
  Textarea,
  Group,
  Grid,
  Modal,
  LoadingOverlay,
  MultiSelect,
} from "@mantine/core";
import axios from "axios";
import { host } from "../../routes/globalRoutes";
import { fetchAvailableRoomsRoute } from "../../routes/visitorsHostelRoutes";

function ForwardBookingForm({
  forwardmodalOpened,
  onClose,
  onBookingForward,
  bookingId,
}) {
  console.log("BOOKING ID: ", bookingId); // Log booking ID for debugging
  const [formData, setFormData] = useState({
    intenderUsername: "",
    intenderEmail: "",
    bookingFrom: "",
    bookingTo: "",
    visitorCategory: "",
    modifiedCategory: "",
    personCount: 1,
    numberOfRooms: 1,
    rooms: [],
    purpose: "",
    billToBeSettledBy: "",
    remarks: "",
    visitorName: "",
    visitorEmail: "",
    visitorPhone: "",
    visitorOrganization: "",
    visitorAddress: "",
  });

  const [loading, setLoading] = useState(false);
  const [availableRooms, setAvailableRooms] = useState([]);

  useEffect(() => {
    const fetchAvailableRooms = async (startDate, endDate) => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return console.error("No authentication token found!");
      }

      try {
        const response = await axios.post(
          fetchAvailableRoomsRoute,
          {
            start_date: startDate,
            end_date: endDate,
          },
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
    const fetchBookingData = async () => {
      try {
        const response = await axios.get(
          `${host}/visitorhostel/get-booking-details/${bookingId}/`,
        );
        const booking = response.data;
        setFormData({
          intenderUsername: booking.intenderUsername,
          intenderEmail: booking.intenderEmail,
          bookingFrom: booking.bookingFrom,
          bookingTo: booking.bookingTo,
          visitorCategory: booking.visitorCategory,
          modifiedCategory: booking.visitorCategory, // Keep this field empty for editing
          personCount: booking.personCount,
          numberOfRooms: booking.numberOfRooms,
          rooms: [], // Keep this field empty for editing
          purpose: booking.purpose,
          billToBeSettledBy: booking.billToBeSettledBy,
          remarks: booking.remarks,
          visitorName: booking.visitorName,
          visitorEmail: booking.visitorEmail,
          visitorPhone: booking.visitorPhone,
          visitorOrganization: booking.visitorOrganization,
          visitorAddress: booking.visitorAddress,
        });
        fetchAvailableRooms(booking.bookingFrom, booking.bookingTo);
      } catch (error) {
        console.error("Error fetching booking data", error);
      }
    };

    if (bookingId) {
      fetchBookingData();
    }
  }, [bookingId]);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i += 1) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === `${name}=`) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("authToken");
    const csrfToken = getCookie("csrftoken");

    const requestData = {
      booking_id: bookingId,
      modified_category: formData.modifiedCategory,
      rooms: formData.rooms,
      remarks: formData.remarks,
    };

    try {
      const response = await axios.post(
        `${host}/visitorhostel/forward-booking-new/`,
        requestData,
        {
          headers: {
            Authorization: `Token ${token}`,
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
        },
      );
      console.log("Form submitted", response.data);
      onBookingForward(); // Call the fetch function to refresh bookings
      onClose(); // Close the modal after the operation
    } catch (error) {
      console.error("Error submitting form", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MantineProvider theme={{ fontFamily: "Arial, sans-serif" }}>
      <Modal
        opened={forwardmodalOpened}
        onClose={onClose}
        title="Forward Booking Request"
        size="xl"
        overlayOpacity={0.55}
        overlayBlur={3}
        transition="fade"
        transitionDuration={500}
      >
        <LoadingOverlay visible={loading} overlayBlur={2} />
        <form onSubmit={handleSubmit}>
          <Grid>
            <Grid.Col span={12}>
              <TextInput
                label="Username"
                value={formData.intenderUsername}
                readOnly
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <TextInput
                label="Email"
                value={formData.intenderEmail}
                readOnly
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <TextInput
                label="From"
                type="date"
                value={formData.bookingFrom}
                readOnly
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <TextInput
                label="To"
                type="date"
                value={formData.bookingTo}
                readOnly
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <TextInput
                label="Category"
                value={formData.visitorCategory}
                readOnly
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <Select
                label="Modified Category"
                value={formData.modifiedCategory}
                onChange={(value) =>
                  handleInputChange("modifiedCategory", value)
                }
                data={["A", "B", "C", "D"]}
                required
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <NumberInput
                label="Number Of People"
                value={formData.personCount}
                readOnly
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <NumberInput
                label="Rooms Required"
                value={formData.numberOfRooms}
                readOnly
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <MultiSelect
                label="Rooms (required*)"
                value={formData.rooms}
                onChange={(value) => handleInputChange("rooms", value)}
                data={availableRooms.map((room) => ({
                  value: room,
                  label: room,
                }))}
                required
                multiple
                searchable
                clearable
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <TextInput
                label="Purpose Of Visit"
                value={formData.purpose}
                readOnly
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <TextInput
                label="Bill to be settled by"
                value={formData.billToBeSettledBy}
                readOnly
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <Textarea
                label="Remarks"
                value={formData.remarks}
                onChange={(event) =>
                  handleInputChange("remarks", event.currentTarget.value)
                }
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <TextInput
                label="Visitor Name"
                value={formData.visitorName}
                readOnly
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <TextInput
                label="Visitor Email"
                value={formData.visitorEmail}
                readOnly
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <TextInput
                label="Visitor Phone"
                value={formData.visitorPhone}
                readOnly
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <TextInput
                label="Visitor Organization"
                value={formData.visitorOrganization}
                readOnly
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <TextInput
                label="Visitor Address"
                value={formData.visitorAddress}
                readOnly
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <Group position="right" mt="md">
                <Button type="submit">Forward</Button>
              </Group>
            </Grid.Col>
          </Grid>
        </form>
      </Modal>
    </MantineProvider>
  );
}

ForwardBookingForm.propTypes = {
  forwardmodalOpened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  bookingId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  onBookingForward: PropTypes.func.isRequired, // Add this prop type
};

export default ForwardBookingForm;
