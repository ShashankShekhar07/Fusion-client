import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import {
  MantineProvider,
  TextInput,
  NumberInput,
  Textarea,
  Group,
  Grid,
  Modal,
  LoadingOverlay,
  MultiSelect,
  Button,
  Text,
} from "@mantine/core";
import axios from "axios";
// eslint-disable-next-line import/no-unresolved
import html2canvas from "html2canvas";
// eslint-disable-next-line import/no-unresolved
import JsPDF from "jspdf";
import { host } from "../../routes/globalRoutes";

function ViewBooking({ modalOpened, onClose, bookingId, bookingf }) {
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

  const [availableRooms, setAvailableRooms] = useState([]);
  const printRef = useRef();

  useEffect(() => {
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
          modifiedCategory: bookingf.modifiedCategory,
          personCount: booking.personCount,
          numberOfRooms: booking.numberOfRooms,
          rooms: bookingf.rooms,
          purpose: booking.purpose,
          billToBeSettledBy: booking.billToBeSettledBy,
          remarks: booking.remarks,
          visitorName: booking.visitorName,
          visitorEmail: booking.visitorEmail,
          visitorPhone: booking.visitorPhone,
          visitorOrganization: booking.visitorOrganization,
          visitorAddress: booking.visitorAddress,
        });
        setAvailableRooms(
          booking.availableRooms.map((room) => room.room_number),
        );
      } catch (error) {
        console.error("Error fetching booking data", error);
      }
    };

    if (bookingId) {
      fetchBookingData();
    }
  }, [bookingId, bookingf]);

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const handleSaveToPDF = async () => {
    const input = printRef.current;
    const canvas = await html2canvas(input, { scale: 3 }); // Increased scaling
    const imgData = canvas.toDataURL("image/png");
    const pdf = new JsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 10, 10, pdfWidth - 20, pdfHeight - 95);
    pdf.save("booking_details.pdf");
  };

  return (
    <MantineProvider theme={{ fontFamily: "Arial, sans-serif" }}>
      <Modal
        opened={modalOpened}
        onClose={onClose}
        title="IIITDMJ Visitors Hostel"
        size="xl"
        overlayOpacity={0.55}
        overlayBlur={3}
        transition="fade"
        transitionDuration={500}
      >
        <LoadingOverlay overlayBlur={2} />
        <div
          ref={printRef}
          className="print-content"
          style={{ border: "2px solid #000", padding: "20px", margin: "20px" }}
        >
          <div>
            <Text align="center" weight={900} size="xl" mb="xs">
              <b>Visitors Hostel</b>
            </Text>
            <Text align="center" weight={700} size="md" mb="md">
              <b>PDPM IIITDM Jabalpur</b>
            </Text>
            <Text align="center" weight={800} size="lg" mb="md">
              <b>Booking for {formData.visitorName}</b>
            </Text>
          </div>
          <form>
            <Grid>
              <Grid.Col span={12}>
                <div
                  style={{
                    backgroundColor:
                      bookingf.status === "Pending"
                        ? "#E0E0E0"
                        : bookingf.status === "Confirmed"
                          ? "#dffbe0"
                          : "#f8d7da",
                    color:
                      bookingf.status === "Pending"
                        ? "#757575"
                        : bookingf.status === "Confirmed"
                          ? "#84b28c"
                          : "#721c24",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    display: "inline-block",
                  }}
                >
                  {bookingf.status}
                </div>
              </Grid.Col>
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
                <TextInput
                  label="Modified Category"
                  value={formData.modifiedCategory}
                  readOnly
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
                  label="Rooms"
                  value={formData.rooms}
                  data={availableRooms.map((room) => ({
                    value: room,
                    label: room,
                  }))}
                  readOnly
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
                <Textarea label="Remarks" value={formData.remarks} readOnly />
              </Grid.Col>

              {/* <Grid.Col span={12}>
                <TextInput
                  label="Visitor Name"
                  value={formData.visitorName}
                  readOnly
                />
              </Grid.Col> */}

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
            </Grid>
          </form>
        </div>
        <Group position="apart" mt="md">
          <Button onClick={handlePrint} variant="outline" color="blue">
            Print
          </Button>
          <Button onClick={handleSaveToPDF} variant="outline" color="green">
            Save to PDF
          </Button>
        </Group>
      </Modal>
      <style>{`
        @media print {
          .print-only {
            display: block;
          }
          .no-print {
            display: none;
          }
          .print-content {
            border: 2px solid #000;
            padding: 20px;
            margin: 20px;
            page-break-inside: avoid;
          }
        }
        .print-only {
          display: none;
        }
      `}</style>
    </MantineProvider>
  );
}

ViewBooking.propTypes = {
  modalOpened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  bookingId: PropTypes.string.isRequired,
  bookingf: PropTypes.shape({
    intender: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    bookingFrom: PropTypes.string.isRequired,
    bookingTo: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    modifiedCategory: PropTypes.string,
    rooms: PropTypes.arrayOf(PropTypes.string),
    status: PropTypes.string.isRequired,
  }).isRequired,
};

export default ViewBooking;
