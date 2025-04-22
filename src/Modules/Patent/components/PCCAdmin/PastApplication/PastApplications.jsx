import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  ScrollArea,
  Table,
  Text,
  Loader,
  Group,
  Divider,
  Select,
} from "@mantine/core";
import { Eye, ArrowsClockwise, Warning, Calendar } from "@phosphor-icons/react";
import axios from "axios";
import ViewPastApplication from "./ViewPastApplication";
import "../../../style/Pcc_Admin/PastApplications.css";
import { host } from "../../../../../routes/globalRoutes/index.jsx";

function PastApplications() {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedYears, setSelectedYears] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);

  const columnNames = [
    "S.No",
    "Application Number",
    "Token Number",
    "Patent Title",
    "Inventor 1",
    "Designation",
    "Department",
    "Date",
    "Status",
    "View",
  ];

  const formatDate = (dateString) => {
    if (!dateString || dateString === "Not Provided") return "Not Provided";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    if (!status) return "gray";
    const formatted = status.trim().toLowerCase();
    switch (formatted) {
      case "rejected":
        return "red";
      case "approved":
        return "green";
      default:
        return "gray";
    }
  };

  const fetchApplications = async (refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }

      const { data } = await axios.get(
        `${host}/patentsystem/pccAdmin/applications/past/`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        },
      );

      const formatted = Object.entries(data.applications || {})
        .map(([id, details]) => ({
          id,
          token_no: details.token_no || "Not Assigned",
          title: details.title || "Not Provided",
          submitted_by: details.submitted_by || "Not Provided",
          designation: details.designation || "Not Provided",
          department: details.department || "Not Provided",
          submitted_on: details.submitted_on || "Not Provided",
          status: details.decision_status || "Not Provided",
          year: details.submitted_on
            ? new Date(details.submitted_on).getFullYear().toString()
            : "Unknown",
        }))
        .sort((a, b) => {
          if (a.submitted_on === "Not Provided") return 1;
          if (b.submitted_on === "Not Provided") return -1;
          return new Date(b.submitted_on) - new Date(a.submitted_on);
        });

      const years = [
        ...new Set(
          formatted.filter((f) => f.year !== "Unknown").map((f) => f.year),
        ),
      ]
        .sort((a, b) => b - a)
        .map((year) => ({ value: year, label: year }));

      setAvailableYears(years);
      setApplications(formatted);
      setFilteredApplications(formatted);
      setError(null);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Failed to load applications. Please try again later.");
    } finally {
      setLoading(false);
      if (refresh) {
        setIsRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    if (!applications) return;
    if (selectedYears.length === 0) {
      setFilteredApplications(applications);
    } else {
      setFilteredApplications(
        applications.filter((app) => selectedYears.includes(app.year)),
      );
    }
  }, [selectedYears, applications]);

  const handleViewClick = (id) => setSelectedApplication(id);
  const handleRefresh = () => fetchApplications(true);
  const handleYearChange = (years) => setSelectedYears(years);

  if (loading) {
    return (
      <Box className="loading-container">
        <Loader size="lg" color="#4a90e2" />
        <Text mt="md" align="center" size="md" color="#555">
          Loading applications...
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="error-container">
        <Group mb="lg" align="center">
          <Warning size={32} color="#ff4d4f" weight="fill" />
          <Text color="#ff4d4f" size="lg" weight={500}>
            Error Loading Applications
          </Text>
        </Group>
        <Text mb="lg" color="#666">
          {error}
        </Text>
        <Button
          onClick={fetchApplications}
          color="blue"
          variant="filled"
          leftIcon={<ArrowsClockwise size={16} />}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <Box className="empty-container">
        <Text size="lg" align="center" mb="md" weight={500} color="#faad14">
          No applications found
        </Text>
        <Text size="md" align="center" color="#666" mb="lg">
          There are currently no patent applications in the system.
        </Text>
        <Button
          onClick={handleRefresh}
          color="blue"
          variant="filled"
          leftIcon={<ArrowsClockwise size={16} />}
        >
          Refresh
        </Button>
      </Box>
    );
  }

  return (
    <Box className="past-app-status-applications-container">
      {!selectedApplication ? (
        <>
          <Text className="past-app-status-title">Past Applications</Text>

          <Group position="apart" mb="md">
            <Button
              variant="subtle"
              color="blue"
              size="sm"
              onClick={handleRefresh}
              loading={isRefreshing}
              leftIcon={<ArrowsClockwise size={16} />}
            >
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>

            <Select
              data={availableYears}
              placeholder="Filter by year"
              multiple
              value={selectedYears}
              onChange={handleYearChange}
              icon={<Calendar size={16} />}
              className="year-filter"
            />
          </Group>

          <Box
            className="past-app-outerContainer"
            style={{ marginRight: "50px" }}
          >
            <ScrollArea style={{ height: "calc(100vh - 250px)" }}>
              <Table highlightOnHover striped withBorder>
                <thead className="fusionTableHeader">
                  <tr>
                    {columnNames.map((columnName, index) => (
                      <th
                        key={index}
                        style={{
                          padding: "12px 16px",
                          fontWeight: 600,
                          color: "#333",
                          textAlign: "left",
                          borderBottom: "2px solid #dee2e6",
                          backgroundColor: "#f8f9fa",
                        }}
                      >
                        {columnName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((application, index) => (
                    <tr
                      key={application.id}
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "#ffffff" : "#f8f9fa",
                      }}
                    >
                      <td
                        style={{
                          padding: "12px 16px",
                          color: "#333",
                          borderBottom: "1px solid #dee2e6",
                        }}
                      >
                        {index + 1}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          color: "#333",
                          borderBottom: "1px solid #dee2e6",
                        }}
                      >
                        {application.id}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          color: "#333",
                          borderBottom: "1px solid #dee2e6",
                        }}
                      >
                        {application.token_no}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          color: "#333",
                          borderBottom: "1px solid #dee2e6",
                        }}
                        title={application.title}
                      >
                        {application.title}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          color: "#333",
                          borderBottom: "1px solid #dee2e6",
                        }}
                      >
                        {application.submitted_by}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          color: "#333",
                          borderBottom: "1px solid #dee2e6",
                        }}
                      >
                        {application.designation}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          color: "#333",
                          borderBottom: "1px solid #dee2e6",
                        }}
                      >
                        {application.department}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          color: "#333",
                          borderBottom: "1px solid #dee2e6",
                        }}
                      >
                        {formatDate(application.submitted_on)}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          color: "#333",
                          borderBottom: "1px solid #dee2e6",
                        }}
                      >
                        <div
                          style={{
                            display: "inline-block",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            backgroundColor: getStatusColor(application.status),
                            color: "#fff",
                            fontSize: "12px",
                            fontWeight: 500,
                          }}
                        >
                          {application.status}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          color: "#333",
                          borderBottom: "1px solid #dee2e6",
                        }}
                      >
                        <Button
                          variant="outline"
                          color="blue"
                          size="sm"
                          onClick={() => handleViewClick(application.id)}
                          style={{
                            backgroundColor: "#fff",
                            color: "#0073e6",
                            border: "1px solid #0073e6",
                            fontWeight: 500,
                            transition: "all 0.2s ease",
                            ":hover": {
                              backgroundColor: "#0073e6",
                              color: "#fff",
                            },
                          }}
                        >
                          <Eye size={16} /> <span>View</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </ScrollArea>
          </Box>
        </>
      ) : (
        <Box className="detail-view-container">
          <Divider my="lg" />
          <ViewPastApplication
            applicationId={selectedApplication}
            handleBackToList={() => setSelectedApplication(null)}
          />
        </Box>
      )}
    </Box>
  );
}

export default PastApplications;
