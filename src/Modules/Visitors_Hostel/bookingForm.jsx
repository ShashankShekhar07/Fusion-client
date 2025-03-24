import React, { useEffect, useState } from "react";
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
  Text,
  Box,
} from "@mantine/core";
import axios from "axios";
import { useSelector } from "react-redux";
import { useForm } from "@mantine/form";
import { requestBookingRoute } from "../../routes/visitorsHostelRoutes";
import { countries } from "./data/countries";

function CombinedBookingForm({ modalOpened, onClose }) {
  const form = useForm({
    initialValues: {
      intender: "",
      arrivalDate: "",
      arrivalHour: "",
      arrivalMinutes: "",
      arrivalAMPM: "",
      departureDate: "",
      departureHour: "",
      departureMinutes: "",
      departureAMPM: "",
      numberOfPeople: 1,
      numberOfRooms: 1,
      category: "",
      purpose: "",
      remarks: "",
      billsBy: "",
      visitor_name: "",
      visitor_email: "",
      visitor_phone: "",
      visitor_organization: "",
      visitor_address: "",
      nationality: "",
    },
  });

  // Function to get today's date in yyyy-mm-dd format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i += 1) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === `${name}=`) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  const csrfToken = getCookie("csrftoken");
  console.log("CSRF TOKEN:  ", csrfToken);

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("authToken");
    console.log(" Token : ", token);

    const requestData = {
      intender: values.intender,
      category: values.category,
      booking_from: values.arrivalDate,
      booking_to: values.departureDate,
      "number-of-people": values.numberOfPeople.toString(),
      "purpose-of-visit": values.purpose,
      "number-of-rooms": values.numberOfRooms.toString(),
      booking_from_time: `${values.arrivalHour}:${values.arrivalMinutes} ${values.arrivalAMPM}`,
      booking_to_time: `${values.departureHour}:${values.departureMinutes} ${values.departureAMPM}`,
      remarks_during_booking_request: values.remarks,
      bill_settlement: values.billsBy,
      visitor_name: values.visitor_name,
      visitor_phone: values.visitor_phone,
      visitor_email: values.visitor_email,
      visitor_address: values.visitor_address,
      nationality: values.nationality,
      visitor_organization: values.visitor_organization,
      csrfmiddlewaretoken: csrfToken,
    };

    try {
      const response = await axios.post(requestBookingRoute, requestData, {
        headers: {
          Authorization: `Token ${token}`,
          "X-CSRFToken": csrfToken,
          "Content-Type": "application/json",
        },
      });
      console.log("Form submitted", response.data);
      onClose(); // Close the modal on successful submission
      window.location.reload(); // Reload the page
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  const username = useSelector((state) => state);
  console.log("IntenderID: ", username);
  const role = useSelector((state) => state.user.role);

  const [todayDate, setTodayDate] = useState(getTodayDate());

  useEffect(() => {
    setTodayDate(getTodayDate());
  }, []);

  return (
    <MantineProvider theme={{ fontFamily: "Arial, sans-serif" }}>
      <Modal
        opened={modalOpened}
        onClose={onClose}
        size="xl"
        styles={{
          content: {
            paddingLeft: "32px",
            paddingRight: "32px",
          },
        }}
        title={
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%", // Ensure it spans the full width of the modal
            }}
          >
            <Text
              style={{
                textAlign: "center", // Center-align the text
                fontWeight: "bold", // Make the text bold
                color: "#228be6", // Blue color
                fontSize: "20px", // Adjust size as needed
                width: "100%", //
              }}
            >
              Place a Booking Request
            </Text>
          </Box>
        }
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid>
            {/* {username} */}
            {/* Conditionally render Intender ID field */}
            {role !== "student" && role !== "Professor" && (
              <Grid.Col span={12}>
                <TextInput
                  label="Intender"
                  placeholder="Intender ID"
                  value={form.values.intender}
                  onChange={(event) =>
                    form.setFieldValue("intender", event.currentTarget.value)
                  }
                  required
                />
              </Grid.Col>
            )}
            <Grid.Col span={12}>
              <TextInput
                label="Name"
                placeholder="Visitor's Name"
                value={form.values.visitor_name}
                onChange={(event) =>
                  form.setFieldValue("visitor_name", event.currentTarget.value)
                }
                required
              />
            </Grid.Col>

            {/* Arrival Details */}
            <Grid.Col span={12}>
              <TextInput
                label="Arrival Date"
                placeholder="From"
                type="date"
                value={form.values.arrivalDate || ""}
                onChange={(event) => {
                  form.setFieldValue("arrivalDate", event.currentTarget.value);
                }}
                required
                min={todayDate} // Ensures that the arrival date can't be in the past (yyyy-mm-dd format)
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <NumberInput
                label="Arrival Hour"
                placeholder="12"
                value={form.values.arrivalHour}
                onChange={(value) => form.setFieldValue("arrivalHour", value)}
                min={1}
                max={12}
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="Arrival Minutes"
                placeholder="59"
                value={form.values.arrivalMinutes}
                onChange={(value) =>
                  form.setFieldValue("arrivalMinutes", value)
                }
                min={0}
                max={59}
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="AM/PM"
                placeholder="AM"
                value={form.values.arrivalAMPM}
                onChange={(value) => form.setFieldValue("arrivalAMPM", value)}
                data={["AM", "PM"]}
                required
              />
            </Grid.Col>

            {/* Departure Details */}
            <Grid.Col span={12}>
              <TextInput
                label="Departure Date"
                placeholder="To"
                type="date"
                value={form.values.departureDate || ""}
                onChange={(event) => {
                  form.setFieldValue(
                    "departureDate",
                    event.currentTarget.value,
                  );
                }}
                required
                min={form.values.arrivalDate || todayDate} // Ensures departure date is after arrival date
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <NumberInput
                label="Departure Hour"
                placeholder="12"
                value={form.values.departureHour}
                onChange={(value) => form.setFieldValue("departureHour", value)}
                min={1}
                max={12}
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="Departure Minutes"
                placeholder="59"
                value={form.values.departureMinutes}
                onChange={(value) =>
                  form.setFieldValue("departureMinutes", value)
                }
                min={0}
                max={59}
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="AM/PM"
                placeholder="AM"
                value={form.values.departureAMPM}
                onChange={(value) => form.setFieldValue("departureAMPM", value)}
                data={["AM", "PM"]}
                required
              />
            </Grid.Col>

            {/* Number of People and Rooms */}
            <Grid.Col span={6}>
              <NumberInput
                label="Number of People"
                value={form.values.numberOfPeople}
                onChange={(value) =>
                  form.setFieldValue("numberOfPeople", value)
                }
                min={1}
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="Number of Rooms"
                value={form.values.numberOfRooms}
                onChange={(value) => form.setFieldValue("numberOfRooms", value)}
                min={1}
                required
              />
            </Grid.Col>

            {/* Category, Purpose, Remarks, Bills By */}
            <Grid.Col span={6}>
              <Select
                label="Category"
                placeholder="A"
                value={form.values.category}
                onChange={(value) => form.setFieldValue("category", value)}
                data={["A", "B", "C", "D"]}
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Purpose"
                placeholder="Purpose"
                value={form.values.purpose}
                onChange={(event) =>
                  form.setFieldValue("purpose", event.currentTarget.value)
                }
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Textarea
                label="Remarks"
                placeholder="Remarks"
                value={form.values.remarks}
                onChange={(event) =>
                  form.setFieldValue("remarks", event.currentTarget.value)
                }
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Bills To Be Paid By"
                placeholder="Visitor"
                value={form.values.billsBy}
                onChange={(value) => form.setFieldValue("billsBy", value)}
                data={[
                  "Visitor",
                  "Intender",
                  "Institute / No Charges",
                  "Project No.",
                ]}
                required
              />
            </Grid.Col>

            {/* Visitor Details Form */}
            <Grid.Col span={6}>
              <TextInput
                label="Email"
                placeholder="Visitor's Email: abc@domain.com"
                value={form.values.visitor_email}
                onChange={(event) =>
                  form.setFieldValue("visitor_email", event.currentTarget.value)
                }
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Phone No."
                placeholder="0987654321"
                value={form.values.visitor_phone}
                onChange={(event) =>
                  form.setFieldValue("visitor_phone", event.currentTarget.value)
                }
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Organisation"
                placeholder="IIITDMJ"
                value={form.values.visitor_organization}
                onChange={(event) =>
                  form.setFieldValue(
                    "visitor_organization",
                    event.currentTarget.value,
                  )
                }
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Address"
                placeholder="Visitor's Address"
                value={form.values.visitor_address}
                onChange={(event) =>
                  form.setFieldValue(
                    "visitor_address",
                    event.currentTarget.value,
                  )
                }
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Nationality"
                placeholder="Select your nationality"
                value={form.values.nationality}
                onChange={(value) => form.setFieldValue("nationality", value)}
                data={countries}
                required
                searchable
                nothingFound="No countries found"
              />
            </Grid.Col>
          </Grid>
          <Group position="right" mt="md">
            <Button type="submit">Submit Booking Request</Button>
          </Group>
        </form>
      </Modal>
    </MantineProvider>
  );
}

CombinedBookingForm.propTypes = {
  modalOpened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CombinedBookingForm;
