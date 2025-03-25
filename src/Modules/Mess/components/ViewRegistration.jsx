import React, { useState, useEffect } from "react";
import {
  TextInput,
  Button,
  Container,
  Title,
  Paper,
  Table,
  Space,
  Group,
  Select,
} from "@mantine/core"; // Mantine UI components
import { MagnifyingGlass, FunnelSimple } from "@phosphor-icons/react"; // Phosphor Icons
import axios from "axios";
import { notifications } from "@mantine/notifications";
import { viewRegistrationDataRoute } from "../routes"; // Import the API endpoint

function ViewRegistrations() {
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [programFilter, setProgramFilter] = useState("All");
  const [messFilter, setMessFilter] = useState("All");

  const fetchRegistrations = async (search) => {
    try {
      const token = localStorage.getItem("authToken");
      let requestData = {};

      if (search) {
        requestData = {
          type: "search",
          student_id: searchQuery.toUpperCase(),
        };
      } else {
        requestData = {
          type: "filter",
          status: statusFilter === "All" ? "all" : statusFilter,
          program: programFilter === "All" ? "all" : programFilter,
          mess_option: messFilter.toLowerCase().replace(/\s+/g, ""),
        };
      }

      const response = await axios.post(
        viewRegistrationDataRoute,
        requestData,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );

      console.log("Fetched Data:", response.data); // Log the fetched data
      if (response.data.payload) {
        setFilteredStudents(
          Array.isArray(response.data.payload)
            ? response.data.payload
            : [response.data.payload],
        );
      } else {
        setFilteredStudents(
          Array.isArray(response.data) ? response.data : [response.data],
        );
      }
      console.log("Filtered Students Length:", filteredStudents.length);
    } catch (error) {
      console.error("Error fetching registrations:", error);
      if (error.response && error.response.status === 404) {
        notifications.show({
          title: "Student Not Found",
          message: "The student does not exist.",
          color: "red",
        });
      } else {
        console.error("Error fetching registrations:", error);
      }
    }
  };

  useEffect(() => {
    fetchRegistrations(false);
  }, []);

  const centeredCellStyle = {
    textAlign: "center",
  };

  return (
    <Container
      size="xl"
      style={{
        width: "100%", // Ensure it takes full width but respects min width
        display: "flex", // Use flexbox to center the content
        justifyContent: "center", // Horizontally centers the content
        marginTop: "25px",
      }}
    >
      <Paper
        shadow="md"
        radius="md"
        p="xl"
        withBorder
        style={{
          minWidth: "75rem", // Set the minimum width to 75rem
          width: "100%", // Ensure it is responsive
          padding: "30px",
          margin: "auto", // Center the Paper component
        }}
      >
        <Title order={2} align="center" mb="lg" style={{ color: "#1c7ed6" }}>
          View Mess Registrations
        </Title>

        <form>
          {/* Search section with icon */}
          <Group grow mb="lg" align="flex-end">
            <TextInput
              label="Search by Roll Number"
              placeholder="Enter Roll Number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              radius="md"
              size="md"
              icon={<MagnifyingGlass size={18} />} // Added Phosphor icon
            />
            <Button
              size="md"
              radius="md"
              color="blue"
              onClick={() => fetchRegistrations(true)}
              style={{ alignSelf: "flex-end", flex: "0 1 auto" }} // Adjust button size
            >
              Search
            </Button>
          </Group>

          {/* Filter section */}
          <Group grow mb="lg">
            <Select
              label="Filter by Status"
              placeholder="Select Status"
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              data={["Registered", "Deregistered", "All"]}
              radius="md"
              size="md"
              icon={<FunnelSimple size={18} />} // Added Phosphor icon
            />
            <Select
              label="Filter by Program"
              placeholder="Select Program"
              value={programFilter}
              onChange={(value) => setProgramFilter(value)}
              data={["B.Tech", "M.Tech", "All"]}
              radius="md"
              size="md"
              icon={<FunnelSimple size={18} />} // Added Phosphor icon
            />
            <Select
              label="Filter by Mess"
              placeholder="Select Mess"
              value={messFilter}
              onChange={(value) => setMessFilter(value)}
              data={["Mess 1", "Mess 2", "All"]}
              radius="md"
              size="md"
              icon={<FunnelSimple size={18} />} // Added Phosphor icon
            />
          </Group>

          <Button
            fullWidth
            size="md"
            radius="md"
            color="blue"
            onClick={() => fetchRegistrations(false)}
          >
            Apply Filters
          </Button>

          <Space h="lg" />

          {/* Students Table */}
          <Table
            striped
            highlightOnHover
            style={{
              border: "1px solid #e0e0e0", // Border for the table
              borderRadius: "8px", // Rounded corners
            }}
          >
            <thead style={{ backgroundColor: "#f7f7f7" }}>
              <tr>
                <th style={centeredCellStyle}>Name</th>
                <th style={centeredCellStyle}>Roll No</th>
                <th style={centeredCellStyle}>Program</th>
                <th style={centeredCellStyle}>Status</th>
                <th style={centeredCellStyle}>Mess</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td style={centeredCellStyle}>{student.first_name}</td>
                    <td style={centeredCellStyle}>{student.student_id}</td>
                    <td style={centeredCellStyle}>{student.program}</td>
                    <td style={centeredCellStyle}>
                      {student.current_mess_status}
                    </td>
                    <td style={centeredCellStyle}>{student.mess_option}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>
                    No registrations found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </form>
      </Paper>
    </Container>
  );
}

export default ViewRegistrations;
