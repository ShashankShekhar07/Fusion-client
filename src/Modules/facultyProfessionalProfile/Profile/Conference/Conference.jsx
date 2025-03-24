import { useState, useEffect } from "react";
// import { Save, Edit, Trash } from 'lucide-react';
import axios from "axios";

import {
  MantineProvider,
  Container,
  Title,
  Paper,
  Grid,
  TextInput,
  Button,
  Table,
  ActionIcon,
  Pagination,
} from "@mantine/core";
import { FloppyDisk, PencilSimple, Trash } from "@phosphor-icons/react";
import { useSelector } from "react-redux";
import {
  getConsymRoute,
  insertConsymRoute,
  updateConsymRoute,
  deleteConsymRoute,
} from "../../../../routes/facultyProfessionalProfileRoutes";
// import { useSelector } from "react-redux";

export default function ConferenceSymposium() {
  const [inputs, setInputs] = useState({
    role: "",
    venue: "",
    startDate: "",
    endDate: "",
    conferenceName: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(null); // For error handling
  const [isEdit, setEdit] = useState(false);
  const [Id, setId] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const rowsPerPage = 10; // Number of rows per page

  const pfNo = useSelector((state) => state.pfNo.value);

  function seeError() {
    console.log(error);
  }

  seeError();
  // Fetch projects from the backend
  const fetchProjects = async () => {
    try {
      const response = await axios.get(getConsymRoute, {
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
      formData.append("conference_name", inputs.conferenceName);
      formData.append("conference_venue", inputs.venue);
      formData.append("conference_role", inputs.role);
      formData.append("conference_start_date", inputs.startDate);
      formData.append("conference_end_date", inputs.endDate);

      if (isEdit === false) {
        const res = await axios.post(insertConsymRoute, formData);
        console.log(res.data);
      } else {
        formData.append("conferencepk2", Id);
        const res = await axios.post(updateConsymRoute, formData);
        console.log(res.data);
        setEdit(false);
        setId(0);
      }

      // Fetch updated project list after submission
      fetchProjects();

      // Reset the input fields
      setInputs({
        role: "",
        venue: "",
        startDate: "",
        endDate: "",
        conferenceName: "",
      });
    } catch (e1) {
      console.error(e1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (project) => {
    // Populate the inputs with the project data for editing
    setInputs({
      role: project.role1,
      venue: project.venue,
      startDate: project.start_date,
      endDate: project.end_date,
      conferenceName: project.name,
    });

    setId(project.id);
    setEdit(true);
  };

  const handleDelete = async (projectId) => {
    console.log(projectId);
    if (
      window.confirm(
        "Are you sure you want to delete this Conference/Symposium?",
      )
    ) {
      try {
        await axios.post(
          deleteConsymRoute,
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
    <MantineProvider withGlobalStyles withNormalizeCSS>
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
            Add a Conference/Symposium
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
                <TextInput
                  required
                  label="Role"
                  placeholder="Role"
                  value={inputs.role}
                  onChange={(e) =>
                    setInputs({ ...inputs, role: e.target.value })
                  }
                  style={{ padding: "10px" }}
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

              <Grid.Col span={12}>
                <TextInput
                  required
                  label="Event Name"
                  placeholder="Conference Name"
                  value={inputs.conferenceName}
                  onChange={(e) =>
                    setInputs({ ...inputs, conferenceName: e.target.value })
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
                  "Conference Name",
                  "Venue",
                  "Role",
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
              {currentRows.length > 0 ? (
                currentRows.map((project) => (
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
                      {project.venue}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      {project.role1}
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
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      textAlign: "center",
                      padding: "12px",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    No Conferences/Symposium found.
                  </td>
                </tr>
              )}
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
