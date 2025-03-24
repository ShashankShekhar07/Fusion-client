import { useState, useEffect } from "react";
// import { Save, Edit, Trash } from 'lucide-react'
import axios from "axios";

import {
  MantineProvider,
  Container,
  Title,
  Paper,
  Grid,
  TextInput,
  Select,
  Button,
  Table,
  ActionIcon,
  Pagination,
} from "@mantine/core";
import { FloppyDisk, PencilSimple, Trash } from "@phosphor-icons/react";
import { useSelector } from "react-redux";
import {
  getEventRoute,
  insertEventRoute,
  updateEventRoute,
  deleteEventRoute,
} from "../../../../routes/facultyProfessionalProfileRoutes";
// import { useSelector } from "react-redux";

export default function WorkshopForm() {
  const [inputs, setInputs] = useState({
    role: "",
    sponsoringAgency: "",
    startDate: "",
    endDate: "",
    venue: "",
    eventType: "",
    name: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [, setError] = useState(null); // For error handling
  const [isEdit, setEdit] = useState(false);
  const [eventId, setEventId] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const rowsPerPage = 10; // Number of rows per page

  const pfNo = useSelector((state) => state.pfNo.value);

  // new URLSearchParams({"pk": projectId}))

  // Fetch projects from the backend
  const fetchProjects = async () => {
    try {
      const response = await axios.get(getEventRoute, {
        params: { pfNo },
      });
      const projects = response.data;
      // Sort projects by submission date in descending order
      const sortedProjects = projects.sort(
        (a, b) => new Date(b.submission_date) - new Date(a.submission_date),
      );
      setTableData(sortedProjects);
    } catch (e) {
      console.error("Error fetching projects:", e);
      setError("Failed to fetch projects. Please try again later."); // Set error message
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("user_id", pfNo);
      formData.append("event_role", inputs.role);
      formData.append("event_name", inputs.name);
      formData.append("event_venue", inputs.venue);
      formData.append("sponsoring_agency", inputs.sponsoringAgency);
      formData.append("event_type", inputs.eventType);
      formData.append("event_start_date", inputs.startDate);
      formData.append("event_end_date", inputs.endDate);

      if (isEdit === false) {
        const res = await axios.post(insertEventRoute, formData);
        console.log(res.data);
      } else {
        formData.append("eventpk", eventId);
        const res = await axios.post(updateEventRoute, formData);
        console.log(res.data);
        setEdit(false);
        setEventId(0);
      }

      // Fetch updated project list after submission
      fetchProjects();

      // Reset the input fields
      setInputs({
        role: "",
        sponsoringAgency: "",
        startDate: "",
        endDate: "",
        venue: "",
        eventType: "",
        name: "",
      });
    } catch (e1) {
      console.log(e1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (project) => {
    setInputs({
      role: project.role,
      sponsoringAgency: project.sponsoring_agency,
      startDate: project.start_date,
      endDate: project.end_date,
      venue: project.venue,
      eventType: project.type,
      name: project.name,
    });

    setEventId(project.id);
    setEdit(true);
  };

  const handleDelete = async (projectId) => {
    console.log(projectId);
    if (window.confirm("Are you sure you want to delete this Event?")) {
      try {
        await axios.post(
          deleteEventRoute,
          new URLSearchParams({ pk: projectId }),
        ); // Adjust the delete URL as needed
        fetchProjects(); // Refresh the project list after deletion
      } catch (e2) {
        console.error("Error deleting project:", e2);
      }
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputs((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Calculate the current rows to display based on pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: "light" }}
    >
      <Container size="2xl" mt="xl">
        <Paper
          shadow="md"
          p="lg"
          withBorder
          style={{
            borderLeft: "8px solid #2185d0",
            backgroundColor: "#f9fafb",
          }}
        >
          <Title
            order={2}
            mb="lg"
            style={{ color: "#2185d0", textAlign: "left" }}
          >
            Add an Event
          </Title>
          <form onSubmit={handleSubmit}>
            <Grid
              type="container"
              breakpoints={{
                xs: "100px",
                sm: "200px",
                md: "700px",
                lg: "900px",
                xl: "1000px",
              }}
            >
              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <Select
                  label="Role"
                  placeholder="Select Role"
                  data={[
                    { value: "Author", label: "Coordinator" },
                    { value: "Co-Author", label: "Co-Coordinator" },
                  ]}
                  value={inputs.role}
                  onChange={(value) =>
                    setInputs({ ...inputs, role: value || "" })
                  }
                  style={{ padding: "10px" }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <TextInput
                  required
                  label="Sponsoring Agency"
                  placeholder="Sponsoring Agency"
                  value={inputs.sponsoringAgency}
                  onChange={(e) =>
                    setInputs({ ...inputs, sponsoringAgency: e.target.value })
                  }
                  style={{ padding: "10px" }}
                />
              </Grid.Col>

              {/* <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <DatePickerInput
                  label="Start Date"
                  placeholder="Select date"
                  value={inputs.startDate}
                  onChange={(date) => setInputs({ ...inputs, startDate: date })}
                />
              </Grid.Col> */}

              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <TextInput
                  label="Start Date"
                  name="startDate"
                  value={inputs.startDate}
                  onChange={handleInputChange}
                  placeholder="Select Date"
                  type="date"
                  style={{ padding: "10px" }} // Consistent padding
                />
              </Grid.Col>

              {/* <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <DatePickerInput
                  label="End Date"
                  placeholder="Select date"
                  value={inputs.endDate}
                  onChange={(date) => setInputs({ ...inputs, endDate: date })}
                />
              </Grid.Col> */}

              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <TextInput
                  label="End Date"
                  name="endDate"
                  value={inputs.endDate}
                  onChange={handleInputChange}
                  placeholder="Select Date"
                  type="date"
                  style={{ padding: "10px" }} // Consistent padding
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <TextInput
                  required
                  label="Venue"
                  placeholder="Venue"
                  value={inputs.venue}
                  onChange={(e) =>
                    setInputs({ ...inputs, venue: e.target.value })
                  }
                  style={{ padding: "10px" }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <Select
                  label="Event Type"
                  placeholder="Select Event Type"
                  data={[
                    { value: "Workshop", label: "Workshop" },
                    { value: "Training Program", label: "Training Program" },
                  ]}
                  value={inputs.eventType}
                  onChange={(value) =>
                    setInputs({ ...inputs, eventType: value || "" })
                  }
                  style={{ padding: "10px" }}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  required
                  label="Event Name"
                  placeholder="Name"
                  value={inputs.name}
                  onChange={(e) =>
                    setInputs({ ...inputs, name: e.target.value })
                  }
                  style={{ padding: "10px" }}
                />
              </Grid.Col>
              <Grid.Col
                span={12}
                p="md"
                style={{ display: "flex", justifyContent: "flex-start" }}
              >
                <Button
                  type="submit"
                  mt="md"
                  loading={isLoading}
                  leftIcon={<FloppyDisk size={16} />}
                  style={{ backgroundColor: "#2185d0", color: "#fff" }} // Custom button styling
                >
                  Save
                </Button>
              </Grid.Col>
            </Grid>
          </form>
        </Paper>

        {/* <Paper mt="xl" p="lg" withBorder shadow="sm" style={{ border: "1px solid #ddd" }}>
          <Table striped highlightOnHover withBorder>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "8px" }}>Name</th>
                <th style={{ textAlign: "left", padding: "8px" }}>Role</th>
                <th style={{ textAlign: "left", padding: "8px" }}>Sponsoring Agency</th>
                <th style={{ textAlign: "left", padding: "8px" }}>Event Type</th>
                <th style={{ textAlign: "left", padding: "8px" }}>Venue</th>
                <th style={{ textAlign: "left", padding: "8px" }}>Start Date</th>
                <th style={{ textAlign: "left", padding: "8px" }}>End Date</th>
                <th style={{ textAlign: "left", padding: "8px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((project) => (
                <tr key={project.id}>
                  <td style={{ padding: "8px" }}>{project.name}</td>
                  <td style={{ padding: "8px" }}>{project.role}</td>
                  <td style={{ padding: "8px" }}>{project.sponsoring_agency}</td>
                  <td style={{ padding: "8px" }}>{project.type}</td>
                  <td style={{ padding: "8px" }}>{project.venue}</td>
                  <td style={{ padding: "8px" }}>{project.start_date}</td>
                  <td style={{ padding: "8px" }}>{project.end_date}</td>
                  <td style={{ padding: "8px" }}>
                    <ActionIcon
                      color="blue"
                      onClick={() => handleEdit(project)}
                      variant="light"
                      style={{ marginRight: "8px" }}
                    >
                      <PencilSimple size={16} />
                    </ActionIcon>
                    <ActionIcon
                      color="red"
                      onClick={() => handleDelete(project.id)}
                      variant="light"
                    >
                      <Trash size={16} />
                    </ActionIcon>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Paper> */}

        <Paper
          mt="xl"
          p="lg"
          withBorder
          shadow="sm"
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Title order={3} mb="lg" style={{ color: "#2185d0" }}>
            Report:
          </Title>
          <Table
            striped
            highlightOnHover
            withBorder
            style={{ minWidth: "100%", borderCollapse: "collapse" }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                {[
                  "Name",
                  "Role",
                  "Sponsoring Agency",
                  "Event Type",
                  "Venue",
                  "Start Date",
                  "End Date",
                  "Actions",
                ].map((header, index) => (
                  <th
                    key={index}
                    style={{
                      textAlign: "center",
                      padding: "12px",
                      color: "#495057",
                      fontWeight: "600",
                      border: "1px solid #dee2e6",
                      backgroundColor: "#f1f3f5",
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentRows.map((project) => (
                <tr key={project.id} style={{ backgroundColor: "#fff" }}>
                  <td
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    {project.name}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    {project.role}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    {project.sponsoring_agency}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    {project.type}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    {project.venue}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    {project.start_date}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    {project.end_date}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      border: "1px solid #dee2e6",
                      whiteSpace: "nowrap", // Prevent text wrapping
                      width: "100px", // Ensure sufficient space for icons
                    }}
                  >
                    <ActionIcon
                      color="blue"
                      onClick={() => handleEdit(project)}
                      variant="light"
                      style={{ marginRight: "8px" }}
                    >
                      <PencilSimple size={16} />
                    </ActionIcon>
                    <ActionIcon
                      color="red"
                      onClick={() => handleDelete(project.id)}
                      variant="light"
                    >
                      <Trash size={16} />
                    </ActionIcon>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination Component */}
          <Pagination
            total={Math.ceil(tableData.length / rowsPerPage)} // Total pages
            page={currentPage} // Current page
            onChange={setCurrentPage} // Handle page change
            mt="lg" // Add margin-top
            position="center" // Center the pagination
          />
        </Paper>
      </Container>
    </MantineProvider>
  );
}
