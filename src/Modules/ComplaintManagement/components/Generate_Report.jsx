import React, { useEffect, useState, useMemo } from "react";
import { Paper, Badge, Button, Flex, Divider, Text } from "@mantine/core";
import { useSelector } from "react-redux";
import { notifications } from "@mantine/notifications";
import { getComplaintReport } from "../routes/api"; // Ensure correct import path for getComplaintReport
import "../styles/GenerateReport.css";
import detailIcon from "../../../assets/detail.png";
import declinedIcon from "../../../assets/declined.png";
import resolvedIcon from "../../../assets/resolved.png";
import ComplaintDetails from "./ComplaintDetails";

const complaintTypes = [
  "Electricity",
  "Carpenter",
  "Plumber",
  "Garbage",
  "Dustbin",
  "Internet",
  "Other",
];

const locations = [
  "Hall-1",
  "Hall-3",
  "Hall-4",
  "Nagarjun Hostel",
  "Maa Saraswati Hostel",
  "Panini Hostel",
  "LHTC",
  "CORE LAB",
  "CC1",
  "CC2",
  "Rewa Residency",
  "NR2",
];

const statusMapping = {
  0: "Pending",
  2: "Resolved",
  3: "Declined",
};

const calculateDaysElapsed = (complaintDate) => {
  const lodgeDate = new Date(complaintDate);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate - lodgeDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getSeverityColor = (days) => {
  if (days <= 2) return "#4CAF50"; // Green for recent complaints
  if (days <= 5) return "#FFC107"; // Yellow for moderate urgency
  return "#FF5252"; // Red for high urgency
};

function GenerateReport() {
  const [complaintsData, setComplaintsData] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [filters, setFilters] = useState({
    location: "",
    complaintType: "",
    status: "",
    startDate: "",
    endDate: "",
    sortBy: "mostRecent", // Default sort set to most recent
  });

  const username = useSelector((state) => state.user.username);
  const token = localStorage.getItem("authToken");
  const role = useSelector((state) => state.user.role);

  // Fetch complaints data when filters change.
  useEffect(() => {
    async function fetchData() {
      try {
        const { success, data } = await getComplaintReport(filters, token);
        if (success) {
          setComplaintsData(data);
        } else {
          notifications.show({
            title: "Error",
            message: "Error fetching complaints. Please try again.",
            color: "red",
          });
        }
      } catch (error) {
        notifications.show({
          title: "Unexpected Error",
          message: "Unexpected error occurred. Please try again.",
          color: "red",
        });
      }
    }
    fetchData();
  }, [filters, token]);

  const handleDetailsClick = (complaint) => {
    setSelectedComplaint(complaint);
  };

  const handleBackClick = () => {
    setSelectedComplaint(null);
  };

  // Compute filtered data using useMemo to avoid unnecessary state updates.
  const filteredData = useMemo(() => {
    let filtered = [...complaintsData];

    // Location filter – applied if role includes "supervisor"
    if (filters.location) {
      filtered = filtered.filter(
        (complaint) =>
          complaint.location.toLowerCase() === filters.location.toLowerCase(),
      );
    }
    // Complaint type filter – applied if role includes "caretaker" or "convener"
    if (filters.complaintType) {
      filtered = filtered.filter(
        (complaint) =>
          complaint.complaint_type.toLowerCase() ===
          filters.complaintType.toLowerCase(),
      );
    }
    // Status filter
    if (filters.status) {
      filtered = filtered.filter(
        (complaint) => String(complaint.status) === filters.status,
      );
    }
    // Date filters
    if (filters.startDate) {
      filtered = filtered.filter(
        (complaint) =>
          new Date(complaint.complaint_date) >= new Date(filters.startDate),
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(
        (complaint) =>
          new Date(complaint.complaint_date) <= new Date(filters.endDate),
      );
    }
    // Sorting
    if (filters.sortBy) {
      if (filters.sortBy === "status") {
        filtered.sort((a, b) => a.status - b.status);
      } else if (filters.sortBy === "mostRecent") {
        filtered.sort(
          (a, b) => new Date(b.complaint_date) - new Date(a.complaint_date),
        );
      } else if (filters.sortBy === "mostOlder") {
        filtered.sort(
          (a, b) => new Date(a.complaint_date) - new Date(b.complaint_date),
        );
      }
    }
    if (filters.sortBy === "severity") {
      filtered.sort((a, b) => {
        const severityA = calculateDaysElapsed(a.complaint_date);
        const severityB = calculateDaysElapsed(b.complaint_date);
        return severityB - severityA; // Higher severity first
      });
    }
    if (filters.severity) {
      filtered = filtered.filter((complaint) => {
        const daysElapsed = calculateDaysElapsed(complaint.complaint_date);
        if (filters.severity === "high") return daysElapsed > 5;
        if (filters.severity === "medium")
          return daysElapsed > 2 && daysElapsed <= 5;
        if (filters.severity === "low") return daysElapsed <= 2;
        return true;
      });
    }
    return filtered;
  }, [complaintsData, filters]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const generateCSV = () => {
    if (!filteredData.length) {
      notifications.show({
        title: "No Data",
        message: "No data to generate CSV.",
        color: "red",
      });
      return;
    }
    const currentDateTime = new Date().toLocaleString().replace(",", "");
    const reportTitle = `Complaint Report`;
    const dateLine = `Date of Generation: ${currentDateTime}`;
    const userLine = `Generated by: ${username}`;

    const appliedFilters = [
      filters.complaintType && `Complaint Type: ${filters.complaintType}`,
      filters.location && `Location: ${filters.location}`,
      filters.status && `Status: ${statusMapping[filters.status]}`,
      filters.startDate && `From Date: ${filters.startDate}`,
      filters.endDate && `To Date: ${filters.endDate}`,
    ].filter(Boolean);

    // CSV headers
    const headers = ["Complaint Type", "Location", "Status", "Date", "Details"];
    // Create rows from complaints data
    const rows = filteredData.map((complaint) => [
      complaint.complaint_type,
      complaint.location,
      statusMapping[complaint.status] || "Pending",
      formatDate(complaint.complaint_date),
      complaint.details.replace(/,/g, ""), // Remove commas to prevent CSV formatting issues
    ]);

    const csvContent = [
      [reportTitle],
      [dateLine],
      [userLine],
      ...appliedFilters.map((line) => [line]),
      [],
      headers,
      ...rows,
    ]
      .map((row) => row.join(","))
      .join("\n");

    return csvContent;
  };

  const downloadCSV = () => {
    const csvData = generateCSV();
    if (!csvData) return;
    // Create a Blob from the CSV data
    const blob = new Blob([csvData], { type: "text/csv" });
    // Create a download link and simulate a click
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Complaint Report.csv";
    link.click();
  };

  const formatDateTime = (datetimeStr) => {
    const date = new Date(datetimeStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}-${month}-${year}, ${hours}:${minutes}`; // Format: DD-MM-YYYY HH:MM
  };

  return (
    <div className="full-width-container">
      <Paper
        radius="md"
        px="lg"
        pt="sm"
        pb="xl"
        style={{
          borderLeft: "0.6rem solid #15ABFF",
          width: "60vw",
          minHeight: "45vh",
          maxHeight: "78vh",
          overflowY: "auto",
          marginTop: "3.5vh",
        }}
        withBorder
        maw="1240px"
        backgroundColor="white"
      >
        {!selectedComplaint ? (
          <Flex direction="column">
            {filteredData.length > 0 ? (
              filteredData.map((complaint, index) => {
                const displayedStatus =
                  complaint.status === 2
                    ? "Resolved"
                    : complaint.status === 3
                      ? "Declined"
                      : "Pending";
                return (
                  <Paper
                    key={index}
                    radius="md"
                    px="lg"
                    pt="sm"
                    pb="xl"
                    style={{
                      width: "100%",
                      margin: "10px 0",
                    }}
                    withBorder
                  >
                    <Flex direction="column" style={{ width: "100%" }}>
                      <Flex direction="row" justify="space-between">
                        <Flex direction="row" gap="xs" align="center">
                          <Text size="14px" style={{ fontWeight: "bold" }}>
                            Complaint Id: {complaint.id}
                          </Text>
                          <Badge
                            size="lg"
                            color={
                              displayedStatus === "Resolved" ? "green" : "blue"
                            }
                          >
                            {complaint.complaint_type}
                          </Badge>
                          <Badge
                            size="lg"
                            style={{
                              backgroundColor: getSeverityColor(
                                calculateDaysElapsed(complaint.complaint_date),
                              ),
                              color: "white",
                            }}
                          >
                            {calculateDaysElapsed(complaint.complaint_date)}{" "}
                            days
                          </Badge>
                        </Flex>
                        {displayedStatus === "Resolved" ? (
                          <img
                            src={resolvedIcon}
                            alt="Resolved"
                            style={{
                              width: "35px",
                              borderRadius: "50%",
                              backgroundColor: "#2BB673",
                              padding: "10px",
                            }}
                          />
                        ) : displayedStatus === "Declined" ? (
                          <img
                            src={declinedIcon}
                            alt="Declined"
                            style={{
                              width: "35px",
                              borderRadius: "50%",
                              backgroundColor: "#FF6B6B",
                              padding: "10px",
                            }}
                          />
                        ) : (
                          <img
                            src={detailIcon}
                            alt="Pending"
                            style={{
                              width: "35px",
                              borderRadius: "50%",
                              backgroundColor: "#FF6B6B",
                              padding: "10px",
                            }}
                          />
                        )}
                      </Flex>
                      <Flex direction="column" gap="xs">
                        <Text size="14px">
                          <strong>Date:</strong>{" "}
                          {formatDateTime(complaint.complaint_date)}
                        </Text>
                        <Text size="14px">
                          <strong>Location:</strong>{" "}
                          {complaint.specific_location}, {complaint.location}
                        </Text>
                      </Flex>
                      <Divider my="md" size="sm" />
                      <Flex
                        direction="row"
                        justify="space-between"
                        align="center"
                      >
                        <Text size="14px">
                          <strong>Description:</strong> {complaint.details}
                        </Text>
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => handleDetailsClick(complaint)}
                        >
                          Details
                        </Button>
                      </Flex>
                    </Flex>
                  </Paper>
                );
              })
            ) : (
              <p>No complaints found.</p>
            )}
          </Flex>
        ) : (
          <ComplaintDetails
            complaintId={selectedComplaint.id}
            onBack={handleBackClick}
          />
        )}
      </Paper>

      {!selectedComplaint ? (
        <div className="filter-card-container mt-5">
          <h2>Filters</h2>
          {(role.includes("SA") ||
            role.includes("SP") ||
            role.includes("complaint_admin")) && (
            <>
              <div className="filter-label" style={{ fontWeight: "bold" }}>
                Location
              </div>
              <select name="location" onChange={handleFilterChange}>
                <option value="">Select Location</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </>
          )}
          {(role.includes("caretaker") ||
            role.includes("warden") ||
            role.includes("complaint_admin")) && (
            <>
              <div className="filter-label" style={{ fontWeight: "bold" }}>
                Complaint Type
              </div>
              <select name="complaintType" onChange={handleFilterChange}>
                <option value="">Select Complaint Type</option>
                {complaintTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </>
          )}
          <div className="filter-label" style={{ fontWeight: "bold" }}>
            Status
          </div>
          <select name="status" onChange={handleFilterChange}>
            <option value="">Select Status</option>
            <option value="0">Pending</option>
            <option value="2">Resolved</option>
            <option value="3">Declined</option>
          </select>
          <div className="filter-label" style={{ fontWeight: "bold" }}>
            Severity
          </div>
          <select name="severity" onChange={handleFilterChange}>
            <option value="">Select Severity</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <div className="filter-label" style={{ fontWeight: "bold" }}>
            From Date
          </div>
          <input type="date" name="startDate" onChange={handleFilterChange} />
          <div className="filter-label" style={{ fontWeight: "bold" }}>
            To Date
          </div>
          <input type="date" name="endDate" onChange={handleFilterChange} />
          <div className="filter-label" style={{ fontWeight: "bold" }}>
            Sort By
          </div>
          <select name="sortBy" onChange={handleFilterChange}>
            <option value="">Sort By</option>
            <option value="mostRecent">Most Recent</option>
            <option value="mostOlder">Most Older</option>
            <option value="status">Status</option>
            <option value="severity">Severity</option>
          </select>
          <Flex direction="row-reverse">
            <Button onClick={downloadCSV} size="xs" variant="outline">
              Download CSV
            </Button>
          </Flex>
        </div>
      ) : (
        <div />
      )}
    </div>
  );
}

export default GenerateReport;
