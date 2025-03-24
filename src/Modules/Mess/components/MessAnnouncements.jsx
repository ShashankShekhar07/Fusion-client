import React from "react";
import {
  Card,
  Input,
  Button,
  Group,
  Text,
  Title,
  Container,
} from "@mantine/core";

function MessAnnouncements() {
  const announcements = [
    {
      title: "Breakfast Updates",
      content:
        "Due to power cut issue in our college, updated breakfast timing is mentioned below: Breakfast will be served from 7:30 to 9:30. Special Announcement: “Today’s Special: Masala Dosa available until 9:00 AM”.",
      postedBy: "Mess Warden",
      date: "Sept 13, 2024",
      time: "10:30 AM",
      color: "#d0ebff",
    },
    {
      title: "Lunch Updates",
      content:
        "Special Announcements: “Today’s special: Jeera Rice available until 1:30 PM.” Note: “Mess will be closed for cleaning after 2:45 PM.”",
      postedBy: "Mess Warden",
      date: "Sept 13, 2024",
      time: "10:30 AM",
      color: "#c3fae8",
    },
    {
      title: "Dinner Updates",
      content:
        "Today’s Special Dinner on the occasion of Ram Navmi: Kheer, Puri, Pulao, Dal Makhani, Green Salad, Raita. Special Announcement: “Today’s Special: Veg Biryani available until 8:00 PM”.",
      postedBy: "Mess Warden",
      date: "Sept 13, 2024",
      time: "10:30 AM",
      color: "#ffe8cc",
    },
  ];

  return (
    <Container size="xl" my="lg">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group
          position="apart"
          mb="lg"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Title order={2}>Mess Announcements</Title>
          <Group>
            <Input placeholder="Search Announcements" />
            <Button>Search</Button>
          </Group>
        </Group>

        {announcements.map((announcement, index) => (
          <Card
            key={index}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            mb="md"
            style={{ backgroundColor: announcement.color }}
          >
            <Group
              position="apart"
              mb="xs"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <Text weight={500} size="lg">
                {announcement.title}
              </Text>
              <Text size="sm" color="dimmed" italic>
                {announcement.postedBy}
              </Text>
            </Group>
            <Text>{announcement.content}</Text>
            <Group
              position="apart"
              mt="md"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <Text size="xs" color="dimmed">
                {announcement.date}
              </Text>
              <Text size="xs" color="dimmed">
                {announcement.time}
              </Text>
            </Group>
          </Card>
        ))}
      </Card>
    </Container>
  );
}

export default MessAnnouncements;
