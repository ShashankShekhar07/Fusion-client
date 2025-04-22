import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  ScrollArea,
  Table,
  Text,
  Loader,
  Alert,
  Group,
} from "@mantine/core";
import { Eye, ArrowsClockwise } from "@phosphor-icons/react";
import axios from "axios";
import ViewNewApplication from "./ViewNewApplication";
import { host } from "../../../../../routes/globalRoutes/index.jsx";

function NewApplication() {
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const columnNames = [
    "S.No.",
    "Application Number",
    "Token Number",
    "Patent Title",
    "Inventor 1",
    "Designation",
    "Department",
    "Date",
    "Actions",
  ];

  // Styles
  const styles = {
    container: {
      position: "relative",
      width: "100%",
      maxWidth: "100%",
    },
    title: {
      fontSize: "24px",
      fontWeight: 600,
      textAlign: "left",
      margin: "0 auto",
      paddingLeft: "0",
      position: "relative",
    },
    outerContainer: {
      maxWidth: "100%",
      padding: "12px 50px",
      backgroundColor: "transparent",
      borderRadius: "12px",
      marginBottom: "20px",
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0)",
    },
    tableWrapper: {
      overflowX: "auto",
      width: "100%",
      backgroundColor: "inherit",
      paddingBottom: 0,
      marginBottom: 0,
    },
    table: {
      width: "100%",
      minWidth: "100%",
      fontSize: "14px",
      backgroundColor: "#ffffff",
      borderSpacing: 0,
      borderCollapse: "separate",
      borderRadius: "8px",
      overflow: "hidden",
      transition: "all 0.3s ease",
      boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.05)",
      marginRight: "50px",
    },
    tableHeader: {
      padding: "16px 20px",
      textAlign: "left",
      backgroundColor: "#f2f2f2",
      fontWeight: 600,
      color: "#444",
      position: "sticky",
      top: 0,
      zIndex: 10,
      transition: "background-color 0.2s ease",
      whiteSpace: "nowrap",
    },
    tableRow: {
      backgroundColor: "#ffffff",
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: "#f8fbff",
        transform: "translateY(-1px)",
        boxShadow: "0 3px 6px rgba(0, 0, 0, 0.05)",
      },
    },
    tableCell: {
      padding: "14px 20px",
      borderTop: "1px solid #f0f0f0",
      verticalAlign: "middle",
    },
    viewButton: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontWeight: 600,
      transition: "all 0.2s ease",
      borderRadius: "6px",
      padding: "8px 12px",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      },
    },
    loaderContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 0",
    },
  };

  const fetchApplications = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await axios.get(
        `${host}/patentsystem/pccAdmin/applications/new/`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        },
      );

      // Transform data into array format
      const applicationsArray = Object.entries(response.data.applications).map(
        ([appId, appData]) => ({
          id: appId,
          token_no: appData.token_no || "Not Assigned",
          ...appData,
        }),
      );

      setApplications(applicationsArray);
      setError(null);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError(
        err.response?.data?.message ||
          "Unable to fetch applications. Please try again later.",
      );
    } finally {
      setLoading(false);
      if (showRefresh) {
        setIsRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleViewClick = (applicationId) => {
    setSelectedApplicationId(applicationId);
  };

  const handleBackClick = () => {
    setSelectedApplicationId(null);
  };

  const handleRefresh = () => {
    fetchApplications(true);
  };

  const renderApplicationsTable = () => {
    if (loading) {
      return (
        <Box style={styles.loaderContainer}>
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

    if (applications.length === 0) {
      return (
        <Alert color="blue" title="No applications">
          There are no new applications to review at this time.
        </Alert>
      );
    }

    return (
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
            {applications.map((application, index) => (
              <tr
                key={application.id}
                style={{
                  backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8f9fa",
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
                  {application.token_no || "Not Assigned"}
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
                  {application.submitted_on}
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    color: "#333",
                    borderBottom: "1px solid #dee2e6",
                  }}
                >
                  <Group position="left" spacing="xs">
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
                      <Eye size={16} />
                      <span>View</span>
                    </Button>
                  </Group>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ScrollArea>
    );
  };

  return (
    <Box style={styles.container}>
      {!selectedApplicationId ? (
        <>
          <Text
            style={{
              textAlign: "left",
              fontSize: "24px",
              fontWeight: 600,
              marginLeft: "50px",
            }}
          >
            New Applications
          </Text>
          <Text size="md" color="dimmed" style={{ textAlign: "left" }} />

          <Group position="left" mb="sm">
            <Button
              variant="subtle"
              color="blue"
              size="sm"
              onClick={handleRefresh}
              loading={isRefreshing}
              style={{ marginLeft: "50px" }}
              leftIcon={<ArrowsClockwise size={16} />}
            >
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </Group>

          <Box style={styles.outerContainer}>{renderApplicationsTable()}</Box>
        </>
      ) : (
        <ViewNewApplication
          applicationId={selectedApplicationId}
          handleBackToList={handleBackClick}
        />
      )}
    </Box>
  );
}

export default NewApplication;
