import React, { useState } from "react";
import PropTypes from "prop-types";
import { Card, Button, Text, Box, Grid } from "@mantine/core";

// Dummy data for notifications
const notificationsData = [
  {
    id: 1,
    title: "AI-Based Disease Detection in Crops",
    status: "Approved by director",
    type: "approval",
    description:
      "Application approved by Director and needs to be forwarded to Attorney.",
    date: "2024-10-25",
    time: "11:30:00",
  },
  {
    id: 2,
    title: "Smart Irrigation System",
    status: "Rejected by director",
    type: "rejection",
    description:
      "Application rejected by Director. Needs to be returned to applicant with comments.",
    date: "2024-10-24",
    time: "15:45:00",
  },
  {
    id: 3,
    title: "New Patent Application Received",
    status: "Pending review",
    type: "new",
    description:
      "New application received from applicant. Needs to be reviewed before forwarding to Director.",
    date: "2024-10-23",
    time: "09:15:00",
  },
];

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
    marginLeft: "-5px",
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
  notificationActions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "1rem",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
  actionButton: {
    flex: "1",
    minWidth: "120px",
  },
  pageTitle: {
    fontSize: "24px",
    fontWeight: 600,
    marginBottom: "5px",
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
  title,
  status,
  description,
  date,
  time,
  type,
  onMarkAsRead,
  onForwardToAttorney,
  onReturnToApplicant,
}) {
  const getStatusColor = () => {
    switch (type) {
      case "approval":
        return "#38a169"; // green
      case "rejection":
        return "#e53e3e"; // red
      case "new":
        return "#3182ce"; // blue
      default:
        return "#718096"; // gray
    }
  };

  return (
    <Card style={{ ...styles.notificationCard }}>
      <Text style={styles.notificationTitle}>{title}</Text>
      <Text style={{ ...styles.notificationStatus, color: getStatusColor() }}>
        {status}
      </Text>
      <Text style={styles.notificationDate}>{`${date} | ${time}`}</Text>
      <Text style={styles.notificationDescription}>{description}</Text>

      <div style={styles.notificationActions}>
        {type === "approval" && (
          <Button
            variant="outline"
            style={styles.actionButton}
            onClick={() => onForwardToAttorney(id)}
          >
            Forward to Attorney
          </Button>
        )}

        {type === "rejection" && (
          <Button
            variant="outline"
            style={styles.actionButton}
            onClick={() => onReturnToApplicant(id)}
          >
            Return to Applicant
          </Button>
        )}

        <Button
          variant="outline"
          style={styles.actionButton}
          onClick={() => onMarkAsRead(id)}
        >
          Mark as Read
        </Button>
      </div>
    </Card>
  );
}

NotificationCard.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onMarkAsRead: PropTypes.func.isRequired,
  onForwardToAttorney: PropTypes.func,
  onReturnToApplicant: PropTypes.func,
};

function PCCAdminNotifications() {
  const [notifications, setNotifications] = useState(notificationsData);

  const handleMarkAsRead = (id) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id),
    );
  };

  const handleForwardToAttorney = (id) => {
    // In a real app, this would trigger an API call
    alert(`Application ${id} forwarded to Attorney`);
    handleMarkAsRead(id);
  };

  const handleReturnToApplicant = (id) => {
    // In a real app, this would trigger an API call
    alert(`Application ${id} returned to Applicant`);
    handleMarkAsRead(id);
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
                type={notification.type}
                onMarkAsRead={handleMarkAsRead}
                onForwardToAttorney={handleForwardToAttorney}
                onReturnToApplicant={handleReturnToApplicant}
              />
            </Grid.Col>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default PCCAdminNotifications;
