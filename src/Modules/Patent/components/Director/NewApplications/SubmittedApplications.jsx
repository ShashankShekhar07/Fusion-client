import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  ScrollArea,
  Table,
  Title,
  Text,
  Loader,
  Alert,
} from "@mantine/core";
import { Eye, ArrowsClockwise } from "@phosphor-icons/react";
import axios from "axios";
import PropTypes from "prop-types";
import "../../../style/Director/SubmittedApplications.css";
import { host } from "../../../../../routes/globalRoutes/index.jsx";

const API_BASE_URL = `${host}/patentsystem`;

function SubmittedApplications({ setActiveTab }) {
  const [applicationsData, setApplicationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const authToken = localStorage.getItem("authToken");

  const columnNames = [
    "S.No.",
    "Application ID",
    "Token Number",
    "Patent Title",
    "Submitted By",
    "Department",
    "Date-Time",
    "Assigned Attorney",
    "Actions",
  ];

  const fetchApplicationData = async (showRefresh = false) => {
    if (!authToken) {
      setError("Authorization token is missing. Please login again.");
      setLoading(false);
      return;
    }

    try {
      if (showRefresh) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await axios.get(
        `${API_BASE_URL}/director/applications/new/`,
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        },
      );

      const formattedData = Object.entries(response.data.applications).map(
        ([key, app], index) => ({
          id: index + 1,
          applicationId: key,
          tokenNumber: app.token_no,
          title: app.title,
          submitter: app.submitted_by,
          Department: app.department,
          date: new Date(app.forwarded_on).toLocaleString(),
          attorney: app.assigned_attorney,
        }),
      );

      setApplicationsData(formattedData);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch applications");
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
      if (showRefresh) {
        setIsRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchApplicationData();
  }, [authToken]);

  const handleViewDetails = (application) => {
    localStorage.setItem("selectedApplicationId", application.applicationId);
    localStorage.setItem("selectedApplicationToken", application.tokenNumber);
    setActiveTab("1.1");
  };

  const handleRefresh = () => {
    fetchApplicationData(true);
  };

  const renderApplicationsTable = () => {
    if (loading) {
      return (
        <Box className="loader-container">
          <Loader size="lg" color="blue" />
          <Text mt={10}>Loading applications...</Text>
        </Box>
      );
    }

    if (error) {
      return (
        <Alert color="red" title="Error loading applications">
          {error}
        </Alert>
      );
    }

    if (applicationsData.length === 0) {
      return (
        <Alert color="blue" title="No applications">
          There are no applications forwarded for review at this time.
        </Alert>
      );
    }

    return (
      <ScrollArea className="tableWrapper">
        <Table highlightOnHover striped withBorder className="styledTable">
          <thead className="fusionTableHeader">
            <tr>
              {columnNames.map((columnName, index) => (
                <th key={index}>{columnName}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {applicationsData.map((application) => (
              <tr key={application.applicationId} className="tableRow">
                <td>{application.id}</td>
                <td>{application.applicationId}</td>
                <td>{application.tokenNumber}</td>
                <td title={application.title}>{application.title}</td>
                <td>{application.submitter}</td>
                <td>{application.Department}</td>
                <td>{application.date}</td>
                <td>{application.attorney}</td>
                <td>
                  <Button
                    variant="outline"
                    color="blue"
                    size="sm"
                    onClick={() => handleViewDetails(application)}
                    className="viewButton"
                  >
                    <Eye size={16} /> <span>View</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ScrollArea>
    );
  };

  return (
    <Box className="director-submitted-apps-container">
      {/* Header with title */}
      <Box className="director-submitted-apps-header">
        <Title order={2} className="director-submitted-apps-title">
          Applications Forwarded by PCC Admin
        </Title>
      </Box>

      {/* Description text */}
      <Box className="director-submitted-apps-description">
        {/* Refresh button */}
        <Button
          className="director-submitted-apps-refresh"
          onClick={handleRefresh}
          loading={isRefreshing}
          leftIcon={<ArrowsClockwise size={16} />}
        >
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </Box>

      <Box className="director-submitted-apps-outer">
        {renderApplicationsTable()}
      </Box>
    </Box>
  );
}

SubmittedApplications.propTypes = {
  setActiveTab: PropTypes.func.isRequired,
};

export default SubmittedApplications;
