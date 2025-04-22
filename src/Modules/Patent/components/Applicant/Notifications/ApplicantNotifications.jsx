import React, { useState } from "react";
import PropTypes from "prop-types";
import { Card, Button, Text, Box, Grid, Divider } from "@mantine/core";
import { Check } from "phosphor-react";

// Define styles at the top level like in DirectorNotifications
const styles = {
  notificationCard: {
    padding: "1.5rem",
    marginBottom: "1rem",
    boxShadow: "0 5px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    backgroundColor: "#f8f9fa",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    marginLeft: "-10px",
  },
  notificationTitle: {
    fontSize: "22px",
    fontWeight: 500,
    marginBottom: "0",
    color: "#1a1b1e",
  },
  notificationStatus: {
    fontSize: "1rem",
    fontWeight: 500,
    marginBottom: "0.5rem",
  },
  notificationDate: {
    fontSize: "0.875rem",
    color: "#666",
    marginBottom: "1rem",
  },
  notificationDescription: {
    fontSize: "0.875rem",
    color: "#444",
    marginBottom: "0",
    flex: 1,
  },
  markReadButton: {
    width: "100%",
    marginTop: "auto",
    backgroundColor: "#f8f9fa",
    color: "#4c6ef5",
    border: "1px solid #4c6ef5",
    fontWeight: 500,
  },
  pageTitle: {
    fontSize: "24px",
    fontWeight: 600,
    marginBottom: "10px",
    color: "#1a1b1e",
  },
  container: {
    width: "100%",
    padding: "0 1rem",
    maxWidth: "1800px",
    margin: "0 50px",
  },
};

// Dummy data for notifications
const notificationsData = [
  {
    id: 1,
    title: "AI-Based Disease Detection in Crops",
    status: "Approved by director",
    description:
      "Application approved by Director and sent to Attorney for Patentability check.",
    date: "2024-10-23",
    time: "14:30:00",
    color: "#4CAF50",
  },
  {
    id: 2,
    title: "AI-Based Disease Detection in Crops",
    status: "Sent to director by PCC_Admin",
    description:
      "Application accepted by PCC Admin and forwarded to Director for initial review.",
    date: "2024-10-22",
    time: "10:15:30",
    color: "#2196F3",
  },
  {
    id: 3,
    title: "AI-Based Disease Detection in Crops",
    status: "Submitted to PCC Admin",
    description:
      "Application forwarded to PCC Admin for approval by Director and sent to Attorney for Patentability check.",
    date: "2024-10-21",
    time: "09:45:00",
    color: "#FFC107",
  },
];

// Notification card component
function NotificationCard({
  id,
  title,
  status,
  description,
  date,
  time,
  color,
  onMarkAsRead,
}) {
  return (
    <Card style={styles.notificationCard}>
      <Text style={styles.notificationTitle}>{title}</Text>
      <Text style={{ ...styles.notificationStatus, color }}>{status}</Text>
      <Text style={styles.notificationDate}>{`${date} | ${time}`}</Text>
      <Divider my="sm" />
      <Text style={styles.notificationDescription}>{description}</Text>
      <Button
        variant="outline"
        leftIcon={<Check size={16} />}
        style={styles.markReadButton}
        onClick={() => onMarkAsRead(id)}
      >
        Mark as Read
      </Button>
    </Card>
  );
}

// PropTypes validation for NotificationCard
NotificationCard.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  onMarkAsRead: PropTypes.func.isRequired,
};

// Main NotificationsPage component
function NotificationsPage() {
  const [notifications, setNotifications] = useState(notificationsData);

  const handleMarkAsRead = (id) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id),
    );
  };

  return (
    <Box style={styles.container}>
      {/* Page Title */}
      <Text style={styles.pageTitle}>Notifications</Text>

      {/* Notifications container */}
      <Box style={{ width: "100%" }}>
        <Grid gutter="xl" align="stretch" style={{ margin: 0 }}>
          {notifications.map((notification) => (
            <Grid.Col
              span={6}
              p="md"
              key={notification.id}
              style={{ minHeight: "100%" }}
            >
              <NotificationCard
                id={notification.id}
                title={notification.title}
                status={notification.status}
                description={notification.description}
                date={notification.date}
                time={notification.time}
                color={notification.color}
                onMarkAsRead={handleMarkAsRead}
              />
            </Grid.Col>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default NotificationsPage;
