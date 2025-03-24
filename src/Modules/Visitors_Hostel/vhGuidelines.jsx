import React from "react";
import { Box, Text, List, ThemeIcon, Divider } from "@mantine/core";
import { IconCircleDot } from "@tabler/icons-react";

function VHGuidelinesPage() {
  return (
    <Box
      style={{
        maxWidth: "1200px",
        margin: "20px auto",
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "20px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Main Heading */}
      <Text
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          textAlign: "center",
          color: "#228be6",
          paddingBottom: "10px",
        }}
      >
        Visitors' Hostel Users Norms and Guidelines
      </Text>

      {/* Section 1: Booking Procedure */}
      <Box
        style={{
          backgroundColor: "#F5F5F5",
          padding: "15px",
          borderRadius: "5px",
          marginBottom: "20px",
        }}
      >
        <Text
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: "#FF6347", // Tomato color for section heading
            marginBottom: "10px",
          }}
        >
          (I) Booking Procedure and Confirmations:
        </Text>

        <List
          spacing="md"
          icon={
            <ThemeIcon color="gray" size={16} radius="xl">
              <IconCircleDot size={10} />
            </ThemeIcon>
          }
        >
          <List.Item>
            For booking of normal facilities, duly filled in forms/e-forms, may
            directly be submitted to Incharge VH through email/in hard copy.
          </List.Item>
          <List.Item>
            The bookings are purely provisional and subject to availability.
          </List.Item>
          <List.Item>
            Priority will be given to Institute guests, visitors coming for
            academic activities.
          </List.Item>
          <List.Item>
            Personal bookings (10% of total rooms) will be made on the basis of
            availability. Such bookings will be provisional and will be
            confirmed only 3 days before the actual arrival of the guest.
          </List.Item>
          <List.Item>
            Students may be allotted accommodation in VH for their PARENTS/
            SPOUSE, if the same is not available in Hostel guestrooms. Students
            should get their requisition forms forwarded by respective warden.
          </List.Item>
          <List.Item>
            Telephonic bookings/ cancellations of any of the VH facilities will
            not be entertained, unless there is some emergency.
          </List.Item>
          <List.Item>
            Confirmation / non-Acceptance of bookings will be informed through
            e-mail or can be checked with VH office within 24 hours of
            submission of the requisition form.
          </List.Item>
          <List.Item>
            The room will be allotted on the condition that, if necessary, the
            allottee would not have any objection in sharing accommodation with
            other guests.
          </List.Item>
          <List.Item>
            Guests of category C will be allowed to stay up to 5 (Five) days
            only.
          </List.Item>
        </List>
      </Box>

      {/* Divider between sections */}
      <Divider
        style={{
          marginBottom: "20px",
          marginTop: "20px",
          borderColor: "#FF6347",
          borderWidth: "2px",
        }}
      />

      {/* Section 2: Guest Specific Information */}
      <Box
        style={{
          backgroundColor: "#F5F5F5",
          padding: "15px",
          borderRadius: "5px",
        }}
      >
        <Text
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: "#FF6347", // Tomato color for section heading
            marginBottom: "10px",
          }}
        >
          (II) Guest Specific Information:
        </Text>

        <List
          spacing="md"
          icon={
            <ThemeIcon color="gray" size={16} radius="xl">
              <IconCircleDot size={10} />
            </ThemeIcon>
          }
        >
          <List.Item>Check-in Check-out facility: 24 Hours.</List.Item>
          <List.Item>
            Approval for the extended stay has to be obtained beforehand.
          </List.Item>
          <List.Item>
            Meals can be booked at the VH Dining Hall: (Lunch by 09:00 Hrs and
            Dinner by 14:00 Hrs)
          </List.Item>
        </List>
      </Box>
    </Box>
  );
}

export default VHGuidelinesPage;
