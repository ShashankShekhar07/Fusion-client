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
  Button,
  Table,
  ActionIcon,
  Pagination,
} from "@mantine/core";
import { FloppyDisk, PencilSimple, Trash } from "@phosphor-icons/react";
import { useSelector } from "react-redux";
import {
  getIVisitsRoute,
  insertIVisitsRoute,
  deleteIVisitsRoute,
} from "../../../../routes/facultyProfessionalProfileRoutes";
// import { useSelector } from "react-redux";

export default function IndianVisits() {
  const [inputs, setInputs] = useState({
    country: "India",
    place: "",
    fromDate: "",
    toDate: "",
    purpose: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [, setError] = useState(null); // For error handling
  const [isEdit, setEdit] = useState(false);
  const [Id, setId] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const rowsPerPage = 10; // Number of rows per page

  const pfNo = useSelector((state) => state.pfNo.value);

  // Fetch projects from the backend
  const fetchProjects = async () => {
    try {
      const response = await axios.get(getIVisitsRoute, {
        params: { pfNo },
      });
      const projects = response.data;
      // Sort projects by submission date in descending order
      const sortedProjects = projects.sort(
        (a, b) => new Date(b.submission_date) - new Date(a.submission_date),
      );
      setTableData(sortedProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
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
      formData.append("country", inputs.country);
      formData.append("place", inputs.place);
      formData.append("purpose", inputs.purpose);
      formData.append("start_date", inputs.fromDate);
      formData.append("end_date", inputs.toDate);

      if (isEdit === false) {
        const res = await axios.post(insertIVisitsRoute, formData);
        console.log(res.data);
      } else {
        formData.append("ivisit_id", Id);
        const res = await axios.post(insertIVisitsRoute, formData);
        console.log(res.data);
        setEdit(false);
        setId(0);
      }

      // fetchForeignVisits() // Refresh the list of foreign visits

      // Fetch updated project list after submission
      fetchProjects();

      // Reset the input fields
      setInputs({
        country: "India",
        place: "",
        fromDate: "",
        toDate: "",
        purpose: "",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (project) => {
    // Populate the inputs with the project data for editing
    setInputs({
      country: project.country,
      place: project.place,
      fromDate: project.start_date,
      toDate: project.end_date,
      purpose: project.purpose,
    });

    setId(project.id);
    setEdit(true);
  };

  const handleDelete = async (projectId) => {
    console.log(projectId);
    if (window.confirm("Are you sure you want to delete this Visit?")) {
      try {
        await axios.post(
          deleteIVisitsRoute,
          new URLSearchParams({ pk: projectId }),
        ); // Adjust the delete URL as needed
        fetchProjects(); // Refresh the project list after deletion
      } catch (error) {
        console.error("Error deleting project:", error);
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
          shadow="xs"
          p="md"
          withBorder
          style={{
            borderLeft: "8px solid #2185d0",
            backgroundColor: "#f9fafb",
          }} // Light background for contrast
        >
          <Title order={2} mb="sm" style={{ color: "#2185d0" }}>
            Add a India Visit
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
                  label="Country"
                  placeholder="Country"
                  value={inputs.country}
                  onChange={(e) =>
                    setInputs({ ...inputs, country: e.target.value })
                  }
                  style={{ padding: "10px" }} // Consistent padding
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <TextInput
                  required
                  label="Place"
                  placeholder="Place"
                  value={inputs.place}
                  onChange={(e) =>
                    setInputs({ ...inputs, place: e.target.value })
                  }
                  style={{ padding: "10px" }} // Consistent padding
                />
              </Grid.Col>

              {/* <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <DatePickerInput
                  label="From"
                  placeholder="Select date"
                  value={inputs.fromDate}
                  onChange={(date) => setInputs({ ...inputs, fromDate: date })}
                  style={{ padding: "10px" }} // Consistent padding
                />
              </Grid.Col> */}

              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <TextInput
                  label="From"
                  name="fromDate"
                  value={inputs.fromDate}
                  onChange={handleInputChange}
                  placeholder="Select Date"
                  type="date"
                  style={{ padding: "10px" }} // Consistent padding
                />
              </Grid.Col>

              {/* <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <DatePickerInput
                  label="To"
                  placeholder="Select date"
                  value={inputs.toDate}
                  onChange={(date) => setInputs({ ...inputs, toDate: date })}
                  style={{ padding: "10px" }} // Consistent padding
                />
              </Grid.Col> */}

              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <TextInput
                  label="To"
                  name="toDate"
                  value={inputs.toDate}
                  onChange={handleInputChange}
                  placeholder="Select Date"
                  type="date"
                  style={{ padding: "10px" }} // Consistent padding
                />
              </Grid.Col>

              <Grid.Col span={12}>
                <TextInput
                  required
                  label="Purpose"
                  placeholder="Purpose"
                  value={inputs.purpose}
                  onChange={(e) =>
                    setInputs({ ...inputs, purpose: e.target.value })
                  }
                  style={{ padding: "10px" }} // Consistent padding
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
                  "Country",
                  "Place",
                  "Purpose",
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
                currentRows.map((visit) => (
                  <tr key={visit.id} style={{ backgroundColor: "#fff" }}>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      {visit.country}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      {visit.place}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      {visit.purpose}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      {visit.start_date}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      {visit.end_date}
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
                        onClick={() => handleEdit(visit)}
                        variant="light"
                        style={{ marginRight: "8px" }}
                      >
                        <PencilSimple size={16} />
                      </ActionIcon>
                      <ActionIcon
                        color="red"
                        onClick={() => handleDelete(visit.id)}
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
                    No visits found.
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
