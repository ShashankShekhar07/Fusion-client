import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  MantineProvider,
  TextInput,
  NumberInput,
  Button,
  Textarea,
  Group,
  Grid,
  Modal,
  LoadingOverlay,
  MultiSelect,
  Select,
} from "@mantine/core";
import axios from "axios";
import { host } from "../../routes/globalRoutes";
import { confirmBookingRoute } from "../../routes/visitorsHostelRoutes";

function ConfirmBookingIn({
  forwardmodalOpened,
  onClose,
  bookingId,
  bookingf,
}) {
  console.log("BOOKING ID: ", bookingId); // Log booking ID for debugging
  console.log("booking fetched as Props: ", bookingf);
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
    const fetchBookingData = async () => {
      try {
        const response = await axios.get(
          `${host}/visitorhostel/get-booking-details/${bookingId}/`,
        );
        const booking = response.data;
        console.log("BOOKING FOR FORM: ", booking);
        setFormData((prevFormData) => ({
          ...prevFormData,
          intenderUsername: booking.intenderUsername,
          intenderEmail: booking.intenderEmail,
          bookingFrom: booking.bookingFrom,
          bookingTo: booking.bookingTo,
          visitorCategory: booking.visitorCategory,
          modifiedCategory: bookingf.modifiedCategory, // Set from bookingf
          personCount: booking.personCount,
          numberOfRooms: booking.numberOfRooms,
          rooms: bookingf.rooms, // Keep this field empty for editing
          purpose: booking.purpose,
          billToBeSettledBy: booking.billToBeSettledBy,
          remarks: booking.remarks,
          visitorName: booking.visitorName,
          visitorEmail: booking.visitorEmail,
          visitorPhone: booking.visitorPhone,
          visitorOrganization: booking.visitorOrganization,
          visitorAddress: booking.visitorAddress,
        }));
        setAvailableRooms(
          booking.availableRooms.map((room) => room.room_number),
        );
        console.log("Rooms Available are: ", booking.availableRooms);
      } catch (error) {
        console.error("Error fetching booking data", error);
      }
    };

    if (bookingId) {
      fetchBookingData();
    }
  }, [bookingId, bookingf]);

  const handleInputChange = (name, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
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

  const handleSubmit = async (e, action) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("authToken");
    const csrfToken = getCookie("csrftoken");

    const requestData = {
      booking_id: bookingId,
      modified_category: formData.modifiedCategory,
      rooms: formData.rooms,
      remarks: formData.remarks,
      action, // "accept" or "reject" as action
    };

    try {
      // Send the POST request to the confirm_booking_new endpoint
      const response = await axios.post(confirmBookingRoute, requestData, {
        headers: {
          Authorization: `Token ${token}`,
          "X-CSRFToken": csrfToken,
          "Content-Type": "application/json",
        },
      });

      console.log(`Booking ${action}ed`, response.data);
      onClose(); // Close the modal after action
    } catch (error) {
      console.error(`Error ${action}ing booking:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MantineProvider theme={{ fontFamily: "Arial, sans-serif" }}>
      <Modal
        opened={forwardmodalOpened}
        onClose={onClose}
        title="Action Booking Request"
        size="xl"
        overlayOpacity={0.55}
        overlayBlur={3}
        transition="fade"
        transitionDuration={500}
      >
        <LoadingOverlay visible={loading} overlayBlur={2} />
        <form>
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
              {console.log("FORMDATA :", formData)}
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
                <Button
                  type="button"
                  color="red"
                  onClick={(e) => handleSubmit(e, "reject")}
                >
                  Reject
                </Button>
                <Button
                  type="button"
                  color="green"
                  onClick={(e) => handleSubmit(e, "accept")}
                >
                  Accept
                </Button>
              </Group>
            </Grid.Col>
          </Grid>
        </form>
      </Modal>
    </MantineProvider>
  );
}

ConfirmBookingIn.propTypes = {
  forwardmodalOpened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  bookingId: PropTypes.string.isRequired,
  bookingf: PropTypes.shape({
    modifiedCategory: PropTypes.string,
    rooms: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default ConfirmBookingIn;
