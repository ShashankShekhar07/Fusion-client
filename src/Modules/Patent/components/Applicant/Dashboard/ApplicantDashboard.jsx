import React from "react";
import PropTypes from "prop-types"; // Import PropTypes
import {
  Grid,
  Box,
  Text,
  Divider,
  Button,
  Container,
  Progress,
} from "@mantine/core";
import { ClipboardText, FilePlus, Archive, Bell } from "@phosphor-icons/react";
import "../../../style/Applicant/ApplicantDashboard.css";
import DownloadsSection from "./DownloadsSection";

function ApplicantDashboard({ setActiveTab }) {
  return (
    <Box
      style={{
        width: "100vw",
        maxWidth: "100%",
        overflowX: "hidden",
      }}
    >
      {" "}
      {/* Page Title */}
      <Text className="title-dashboard">Patent & Copyright Cell Dashboard</Text>
      {/* Content Below Title */}
      <Container className="content-container">
        {/* Feature Description */}
        <Text mt="sm" mb="lg" className="feature-text">
          Welcome to the Patent Application Management System. This platform
          enables you to efficiently manage your patent applications, monitor
          their progress, and access essential resources. Please follow the
          established workflow for a streamlined application process.
        </Text>

        {/* Feature Points */}
        <Box className="feature-box-container">
          <Grid>
            <Grid.Col span={12}>
              <Box className="feature-box-with-hover">
                <ClipboardText size={28} className="feature-icon" />
                <Text>
                  <span className="feature-box-title">
                    Application Tracking:{" "}
                  </span>
                  Monitor the status of your patent applications with real-time
                  updates and comprehensive progress tracking.
                </Text>
              </Box>
            </Grid.Col>
            <Grid.Col span={12}>
              <Box className="feature-box-with-hover">
                <FilePlus size={28} className="feature-icon" />
                <Text>
                  <span className="feature-box-title">
                    Structured Process:{" "}
                  </span>
                  Follow our systematic approach for completing patent
                  applications with clear guidance at each stage.
                </Text>
              </Box>
            </Grid.Col>
            <Grid.Col span={12}>
              <Box className="feature-box-with-hover">
                <Archive size={28} className="feature-icon" />
                <Text>
                  <span className="feature-box-title">
                    Resource Management:{" "}
                  </span>
                  Access comprehensive documentation, guidelines, and forms
                  essential for the patent application process.
                </Text>
              </Box>
            </Grid.Col>
          </Grid>
        </Box>

        <Divider className="dashboard-divider" />

        {/* Application Workflow */}
        <Container className="workflow-container">
          <Text className="dashboard-section-title" mb="lg">
            Application Workflow
          </Text>

          {/* Horizontal Progress Bar for Larger Screens */}
          <Box
            className="status-progress-container"
            display={{ base: "none", sm: "block" }}
            style={{ position: "relative" }}
          >
            <Progress
              size="xl"
              radius="lg"
              sections={[
                { value: 14.3, color: "blue" },
                { value: 14.3, color: "#b3cde0" },
                { value: 14.3, color: "#8cb3d9" },
                { value: 14.3, color: "#6699cc" },
                { value: 14.3, color: "#336699" },
                { value: 14.3, color: "#003366" },
                { value: 14.2, color: "black" },
              ]}
              mt="md"
            />
            {/* Dots */}
            <Box
              style={{
                position: "absolute",
                top: "40%",
                left: 0,
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                transform: "translateY(-50%)",
              }}
            >
              {[
                { label: "Submitted", color: "#b3cde0" },
                { label: "PCCAdmin", color: "#8cb3d9" },
                { label: "Attorney Assignment", color: "#6699cc" },
                { label: "Director's Approval", color: "#336699" },
                { label: "Patentability Check", color: "blue" },
                { label: "Search Report", color: "#003366" },
                { label: "Patent Filed", color: "black" },
              ].map((step, index) => (
                <Box key={index} style={{ flex: 1, textAlign: "center" }}>
                  <Box
                    style={{
                      height: "14px",
                      width: "14px",
                      backgroundColor: step.color,
                      borderRadius: "50%",
                      margin: "0 auto",
                      marginBottom: "8px",
                      border: "2px solid white",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                    }}
                  />
                </Box>
              ))}
            </Box>
            {/* Labels Below Bar */}
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "16px",
              }}
            >
              {[
                "Submitted",
                "PCCAdmin",
                "Attorney Assignment",
                "Director's Approval",
                "Patentability Check",
                "Search Report",
                "Patent Filed",
              ].map((label, index) => (
                <Text
                  key={index}
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#1a202c",
                    textAlign: "center",
                    flex: 1,
                  }}
                >
                  {label}
                </Text>
              ))}
            </Box>
          </Box>

          {/* Vertical Progress Bar for Mobile Screens */}
          <Box
            className="mobile-progress-container"
            display={{ base: "flex", sm: "none" }}
          >
            <Box className="mobile-progress-bar">
              <Progress
                size="xl"
                radius="lg"
                sections={[
                  { value: 14.3, color: "blue" },
                  { value: 14.3, color: "#b3cde0" },
                  { value: 14.3, color: "#8cb3d9" },
                  { value: 14.3, color: "#6699cc" },
                  { value: 14.3, color: "#336699" },
                  { value: 14.3, color: "#003366" },
                  { value: 14.2, color: "black" },
                ]}
                orientation="vertical"
                style={{ height: "300px" }}
              />
            </Box>
            <Box className="mobile-progress-labels">
              {[
                { label: "Submitted", color: "#b3cde0" },
                { label: "PCCAdmin", color: "#8cb3d9" },
                { label: "Attorney Assignment", color: "#6699cc" },
                { label: "Director's Approval", color: "#336699" },
                { label: "Patentability Check", color: "blue" },
                { label: "Search Report", color: "#003366" },
                { label: "Patent Filed", color: "black" },
              ].map((step, index) => (
                <Box key={index} className="mobile-progress-label">
                  <Box
                    className="mobile-progress-dot"
                    style={{ backgroundColor: step.color }}
                  />
                  <Text>{step.label}</Text>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
        <Divider className="dashboard-divider" />
        {/* Downloads Section */}
        <DownloadsSection />
      </Container>
      {/* Dashboard Sections */}
      <Grid mt="xl" className="dashboard-grid">
        {/* Submit New Application */}
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Box className="dashboard-cards">
            <Text className="dashboard-card-title">
              <FilePlus size={20} className="icon" /> Submit New Application
            </Text>
            <Divider className="card-divider" />
            <Text size="sm" mt="sm">
              Initiate the patent application process through our comprehensive
              submission system.
            </Text>
            <Button
              variant="outline"
              fullWidth
              mt="md"
              size="sm"
              onClick={() => setActiveTab("1")}
              className="markReadButton"
            >
              Begin Application
            </Button>
          </Box>
        </Grid.Col>

        {/* View Applications */}
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Box className="dashboard-cards">
            <Text className="dashboard-card-title">
              <ClipboardText size={20} className="icon" /> View Applications
            </Text>
            <Divider className="card-divider" />
            <Text size="sm" mt="sm">
              Access and monitor the status of all your submitted patent
              applications.
            </Text>
            <Button
              variant="outline"
              fullWidth
              mt="md"
              size="sm"
              onClick={() => setActiveTab("2")}
              className="markReadButton"
            >
              View Applications
            </Button>
          </Box>
        </Grid.Col>

        {/* Saved Drafts */}
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Box className="dashboard-cards">
            <Text className="dashboard-card-title">
              <Archive size={20} className="icon" /> Saved Drafts
            </Text>
            <Divider className="card-divider" />
            <Text size="sm" mt="sm">
              Continue working on applications that have been saved as drafts.
            </Text>
            <Button
              variant="outline"
              fullWidth
              mt="md"
              size="sm"
              onClick={() => setActiveTab("3")}
              className="markReadButton"
            >
              Access Drafts
            </Button>
          </Box>
        </Grid.Col>

        {/* Notifications */}
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Box className="dashboard-cards">
            <Text className="dashboard-card-title">
              <Bell size={20} className="icon" /> Notifications
            </Text>
            <Divider className="card-divider" />
            <Text size="sm" mt="sm">
              Receive and review important updates regarding your patent
              applications.
            </Text>
            <Button
              variant="outline"
              fullWidth
              mt="md"
              size="sm"
              onClick={() => setActiveTab("4")}
              className="markReadButton"
            >
              View Notifications
            </Button>
          </Box>
        </Grid.Col>
      </Grid>
    </Box>
  );
}

// Define prop types for ApplicantDashboard
ApplicantDashboard.propTypes = {
  setActiveTab: PropTypes.func.isRequired, // setActiveTab is a required function
};

export default ApplicantDashboard;
