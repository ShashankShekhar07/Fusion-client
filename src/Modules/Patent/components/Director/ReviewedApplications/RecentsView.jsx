import React, { useEffect, useState } from "react";
import {
  Box,
  ScrollArea,
  Table,
  Title,
  Text,
  Loader,
  Alert,
  Button,
} from "@mantine/core";
import { ArrowsClockwise } from "@phosphor-icons/react";
import axios from "axios";
import "../../../style/Director/RecentsView.css";
import { host } from "../../../../../routes/globalRoutes/index.jsx";

const API_BASE_URL = `${host}/patentsystem`;

function ReviewedApplications() {
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
    "Arrival Date",
    "Reviewed Date",
    "Assigned Attorney",
    "Current Status",
  ];

  const fetchReviewedApplications = async (showRefresh = false) => {
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
        `${API_BASE_URL}/director/reviewedapplications`,
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
          department: app.department,
          arrivalDate: new Date(app.arrival_date).toLocaleDateString(),
          reviewedDate: app.reviewed_date
            ? new Date(app.reviewed_date).toLocaleDateString()
            : "N/A",
          assignedAttorney: app.assigned_attorney,
          currentStatus: app.current_status,
        }),
      );

      setApplicationsData(formattedData);
      setError(null);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch reviewed applications",
      );
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
      if (showRefresh) {
        setIsRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchReviewedApplications();
  }, [authToken]);

  const handleRefresh = () => {
    fetchReviewedApplications(true);
  };

  const renderApplicationsTable = () => {
    if (loading) {
      return (
        <Box className="loader-container">
          <Loader size="lg" color="blue" />
          <Text mt={10}>Loading reviewed applications...</Text>
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
        <Alert color="blue" title="No reviewed applications">
          There are no reviewed applications at this time.
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
            {applicationsData.map((item) => (
              <tr key={item.applicationId} className="tableRow">
                <td>{item.id}</td>
                <td>{item.applicationId}</td>
                <td>{item.tokenNumber}</td>
                <td title={item.title}>{item.title}</td>
                <td>{item.submitter}</td>
                <td>{item.department}</td>
                <td>{item.arrivalDate}</td>
                <td>{item.reviewedDate}</td>
                <td>{item.assignedAttorney}</td>
                <td
                  style={{
                    border: "none",
                    borderTop: "1px solid #ddd",
                    borderRight: "1px solid #ddd",
                  }}
                >
                  <Text
                    color={
                      item.currentStatus === "Patent Granted"
                        ? "green"
                        : item.currentStatus === "Patent Refused"
                          ? "red"
                          : "blue"
                    }
                    weight={500}
                    style={{ fontSize: "14px" }}
                    mt={10}
                  >
                    {item.currentStatus}
                  </Text>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ScrollArea>
    );
  };

  return (
    <Box className="director-reviewed-apps-container">
      {/* Header with title */}
      <Box className="director-reviewed-apps-header">
        <Title order={2} className="director-reviewed-apps-title">
          Reviewed Patent Applications
        </Title>
      </Box>

      {/* Description text */}
      <Box className="director-reviewed-apps-description">
        {/* Refresh button */}
        <Button
          className="director-reviewed-apps-refresh"
          onClick={handleRefresh}
          loading={isRefreshing}
          leftIcon={<ArrowsClockwise size={16} />}
        >
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </Box>

      <Box className="director-reviewed-apps-outer">
        {renderApplicationsTable()}
      </Box>
    </Box>
  );
}

export default ReviewedApplications;
