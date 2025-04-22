import React, { useState } from "react";
import PropTypes from "prop-types";
import { Card, Button, Text, Box, Grid } from "@mantine/core";
import notificationsData from "../../../data/director/notificationsData";

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
  notificationToken: {
    fontSize: "0.875rem",
    color: "#666",
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
  },
  pageTitle: {
    fontSize: "24px",
    fontWeight: 600,
    marginBottom: "0",
    color: "#1a1b1e",
  },
  container: {
    width: "100%",
    padding: "0 1rem",
    maxWidth: "1800px",
    margin: "0 50px",
  },
};

// Notification card component
function NotificationCard({
  id,
  token,
  title,
  status,
  description,
  date,
  time,
  color,
  onMarkAsRead,
  isRead,
}) {
  return (
    <Card style={styles.notificationCard}>
      <Text style={styles.notificationTitle}>{title}</Text>
      <Text style={{ ...styles.notificationStatus, color }}>{status}</Text>
      <Text style={styles.notificationToken}>{token}</Text>
      <Text style={styles.notificationDate}>{`${date} | ${time}`}</Text>
      <Text style={styles.notificationDescription}>{description}</Text>
      <Button
        variant={isRead ? "default" : "outline"}
        style={styles.markReadButton}
        onClick={() => onMarkAsRead(id)}
      >
        {isRead ? "Remove Notification" : "Mark as Read"}
      </Button>
    </Card>
  );
}

// PropTypes validation for NotificationCard
NotificationCard.propTypes = {
  id: PropTypes.number.isRequired,
  token: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  onMarkAsRead: PropTypes.func.isRequired,
  isRead: PropTypes.bool.isRequired,
};

// Main DirectorNotifications component
function DirectorNotifications() {
  const [notifications, setNotifications] = useState(notificationsData);
  const [readNotifications, setReadNotifications] = useState([]);

  const handleMarkAsRead = (id) => {
    if (readNotifications.includes(id)) {
      // Permanently remove the notification if already read
      setNotifications(
        notifications.filter((notification) => notification.id !== id),
      );
      setReadNotifications(readNotifications.filter((readId) => readId !== id));
    } else {
      // Mark as read but do not remove
      setReadNotifications([...readNotifications, id]);
    }
  };

  // // Add a new notification dynamically for demo purposes
  // const handleAddNotification = () => {
  //   const newNotification = {
  //     id: notifications.length + 1,
  //     title: "New Patent Application - Advanced Robotics",
  //     status: "Pending",
  //     description:
  //       "A new patent application has been submitted for review.",
  //     date: new Date().toISOString().split("T")[0],
  //     time: new Date().toLocaleTimeString(),
  //     color: "blue",
  //   };

  //   setNotifications([newNotification, ...notifications]);
  // };

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
                token={notification.token}
                id={notification.id}
                title={notification.title}
                status={notification.status}
                description={notification.description}
                date={notification.date}
                time={notification.time}
                color={notification.color}
                onMarkAsRead={handleMarkAsRead}
                isRead={readNotifications.includes(notification.id)}
              />
            </Grid.Col>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default DirectorNotifications;
