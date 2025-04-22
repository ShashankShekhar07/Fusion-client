import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Grid, Box, Text, Divider, Button, Paper } from "@mantine/core";
import {
  ClipboardText,
  CheckCircle,
  Eye,
  Clock,
  ChartBar,
  Buildings,
  Bell,
} from "@phosphor-icons/react";
import DownloadsSection from "./DirectorDownloads";
import InsightsPage from "./DirectorInsights";
import "../../../style/Director/DirectorDashboard.css";

const TabKeys = {
  NEW_APPLICATIONS: "1",
  REVIEWED_APPLICATIONS: "2",
  NOTIFICATIONS: "3",
};

function DirectorDashboard({ setActiveTab }) {
  useEffect(() => {
    const handleResize = () => {
      // Window resize listener for future responsive features
    };

    handleResize(); // Check on initial render
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const featuresData = [
    {
      icon: <Eye size={28} className="feature-icon" />,
      title: "Application Management and Review",
      description:
        "Track and review patent applications, view submission details, and monitor status updates.",
    },
    // {
    //   icon: <Briefcase size={28} className="feature-icon" />,
    //   title: "Attorney Feedback and Communication",
    //   description:
    //     "Integrate feedback from attorneys, facilitate communication, and track application history.",
    // },
    {
      icon: <Clock size={28} className="feature-icon" />,
      title: "Transparent Record-Keeping and Status Visibility",
      description:
        "Real-time status updates, detailed history tracking, and archive functionality.",
    },
    {
      icon: <ChartBar size={28} className="feature-icon" />,
      title: "Dashboard Analytics and Insights",
      description:
        "Analyze application volume, performance metrics, and trends to support data-driven decisions.",
    },
  ];

  return (
    <div className="director-dashboard">
      <Text className="director-title-dashboard">
        Patent & Copyright Management Dashboard
      </Text>
      <Box>
        <Paper
          shadow="md"
          radius="lg"
          className="combined-section"
          style={{ marginLeft: "50px" }}
        >
          <Text className="director-overview-title">
            Patent Management System (PMS)
            <Buildings size={24} className="director-overview-icon" />
          </Text>
          <Text className="director-overview-text">
            The Patent Management System at IIITDM Jabalpur focuses on fostering
            research and development activities, particularly in IT-enabled
            design and manufacturing, as well as the design of IT systems.
          </Text>

          <Divider my="xl" />

          <Box className="feature-box-container">
            <Grid>
              {featuresData.map((feature, index) => (
                <Grid.Col span={12} key={index}>
                  <Box className="feature-box-with-hover">
                    {feature.icon}
                    <Text>
                      <span className="feature-box-title">
                        {feature.title}:{" "}
                      </span>
                      {feature.description}
                    </Text>
                  </Box>
                </Grid.Col>
              ))}
            </Grid>
          </Box>

          <Divider my="xl" />
          <DownloadsSection />

          <Divider my="xl" />
          <div style={{ marginLeft: "12px", marginRight: "12px" }}>
            <InsightsPage />
          </div>
        </Paper>
        <Grid mt="xl" className="dashboard-grid">
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Box className="dashboard-cards">
              <Text className="dashboard-card-title">
                <ClipboardText size={20} className="icon" /> New Applications
              </Text>
              <Divider className="card-divider" />
              <Text size="sm" mt="sm">
                View all applications forwarded by PCC Admin for your review.
                okay
              </Text>
              <Button
                variant="outline"
                fullWidth
                mt="md"
                size="sm"
                onClick={() => setActiveTab(TabKeys.NEW_APPLICATIONS)}
                className="markReadButton"
              >
                View Submitted Applications
              </Button>
            </Box>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Box className="dashboard-cards">
              <Text className="dashboard-card-title">
                <CheckCircle size={20} className="icon" /> Reviewed Applications
              </Text>
              <Divider className="card-divider" />
              <Text size="sm" mt="sm">
                Access applications that have been reviewed.
              </Text>
              <Button
                variant="outline"
                fullWidth
                mt="md"
                size="sm"
                onClick={() => setActiveTab(TabKeys.REVIEWED_APPLICATIONS)}
                className="markReadButton"
              >
                View Reviewed Applications
              </Button>
            </Box>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Box className="dashboard-cards">
              <Text className="dashboard-card-title">
                <Bell size={20} className="icon" /> Notifications
              </Text>
              <Divider className="card-divider" />
              <Text size="sm" mt="sm">
                Stay updated with the latest notifications regarding your patent
                applications.
              </Text>
              <Button
                variant="outline"
                fullWidth
                mt="md"
                size="sm"
                onClick={() => setActiveTab(TabKeys.NOTIFICATIONS)}
                className="markReadButton"
              >
                View Notifications
              </Button>
            </Box>
          </Grid.Col>
        </Grid>
      </Box>
    </div>
  );
}

DirectorDashboard.propTypes = {
  setActiveTab: PropTypes.func.isRequired,
};

export default DirectorDashboard;
