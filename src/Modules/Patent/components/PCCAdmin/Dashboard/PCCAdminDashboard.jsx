import React from "react";
import PropTypes from "prop-types";
import { Grid, Box, Text, Divider, Button, Paper } from "@mantine/core";
import {
  Eye,
  List,
  Briefcase,
  ArrowCircleDown,
  Buildings,
} from "@phosphor-icons/react";

import DownloadsPage from "./DownloadsPage";
import "../../../style/Pcc_Admin/PCCAdminDashboard.css";
import InsightsPage from "./InsightsPage";

function PCCAdminDashboard({ setActiveTab }) {
  const renderDashboardCard = (icon, title, description, tabId) => (
    <Box className="dashboard-card">
      <Text className="dashboard-card-title">
        {icon} {title}
      </Text>
      <Divider className="card-divider" />
      <Text size="sm" mt="sm">
        {description}
      </Text>
      <Button
        variant="outline"
        className="dashboard-button add"
        onClick={() => setActiveTab(tabId)}
      >
        {title}
      </Button>
    </Box>
  );

  return (
    <Box>
      {/* Page Title */}
      <Text className="dashboard-title">Patent & Copyright Cell Dashboard</Text>

      {/* Combined Overview and Insights Section */}
      <Paper
        className="combined-section"
        style={{ marginLeft: "50px", marginRight: "50px" }}
      >
        {/* Overview Section */}
        <Box className="overview-section">
          <Text className="overview-title">
            Patent Management System (PMS)
            <Buildings size={24} className="overview-icon" />
          </Text>
          <Text className="overview-text">
            The Patent Management System at IIITDM Jabalpur focuses on fostering
            research and development activities, particularly in IT-enabled
            design and manufacturing, as well as the design of IT systems. Here,
            you can manage applications, track their status, access important
            resources and view insights.
          </Text>
        </Box>

        <Divider my="xl" />

        {/* Insights Section */}
        <Box className="insights-section">
          <InsightsPage />
        </Box>

        <Divider my="xl" />

        {/* Downloads Section */}
        <DownloadsPage />
      </Paper>

      {/* Dashboard Cards Section */}
      <Grid mt="xl" className="dashboard-grid">
        {/* New Applications Card */}
        <Grid.Col span={{ base: 12, sm: 6 }}>
          {renderDashboardCard(
            <Eye size={20} className="icon" />,
            "New Applications",
            "Review and provide feedback on the latest applications.",
            "1",
          )}
        </Grid.Col>

        {/* Ongoing Applications Card */}
        <Grid.Col span={{ base: 12, sm: 6 }}>
          {renderDashboardCard(
            <List size={20} className="icon" />,
            "Ongoing Applications",
            "Track the current status of all the ongoing applications.",
            "2",
          )}
        </Grid.Col>

        {/* Past Applications Card */}
        <Grid.Col span={{ base: 12, sm: 6 }}>
          {renderDashboardCard(
            <Briefcase size={20} className="icon" />,
            "Past Applications",
            "Track record of all the filed and reeted applications.",
            "3",
          )}
        </Grid.Col>

        {/* Manage Attorney Details Card */}
        <Grid.Col span={{ base: 12, sm: 6 }}>
          {renderDashboardCard(
            <Briefcase size={20} className="icon" />,
            "Manage Attorney Details",
            "Manage and update attorney information.",
            "3",
          )}
        </Grid.Col>

        {/* Notifications Card */}
        <Grid.Col span={{ base: 12, sm: 6 }}>
          {renderDashboardCard(
            <ArrowCircleDown size={20} className="icon" />,
            "Notifications",
            "Get notifications regarding status updates and other important information.",
            "4",
          )}
        </Grid.Col>
      </Grid>
    </Box>
  );
}

PCCAdminDashboard.propTypes = {
  setActiveTab: PropTypes.func.isRequired,
};

export default PCCAdminDashboard;
