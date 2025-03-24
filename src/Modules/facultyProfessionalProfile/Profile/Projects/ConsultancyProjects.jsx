import { useState, useEffect } from "react";
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
import axios from "axios";
import { useSelector } from "react-redux";
import {
  getConsultancyProjectRoute,
  insertConsultancyProjectRoute,
  deleteConsultancyProjectRoute,
} from "../../../../routes/facultyProfessionalProfileRoutes";
// import { useSelector } from "react-redux";

export default function ConsultancyProjects() {
  const [inputs, setInputs] = useState({
    consultant: "",
    client: "",
    financialOutlay: "",
    startDate: "",
    endDate: "",
    title: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [, setError] = useState(null); // For error handling
  const [isEdit, setEdit] = useState(false);
  const [Id, setId] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const rowsPerPage = 10; // Number of rows per page

  const pfNo = useSelector((state) => state.pfNo.value);

  // Function to fetch Consultancy Projects from the backend
  const fetchProjects = async () => {
    try {
      // const formData = new FormData();
      // formData.append("user_id", pfNo);
      const response = await axios.get(getConsultancyProjectRoute, {
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
      formData.append("consultants", inputs.consultant);
      formData.append("client", inputs.client);
      formData.append("start", inputs.startDate);
      formData.append("end", inputs.endDate);
      formData.append("financial_outlay", Number(inputs.financialOutlay)); // Parse to number
      formData.append("title", inputs.title);

      if (isEdit === false) {
        const res = await axios.post(insertConsultancyProjectRoute, formData);
        console.log(res.data);
      } else {
        formData.append("consultancy_id", Id);
        const res = await axios.post(insertConsultancyProjectRoute, formData);
        console.log(res.data);
        setEdit(false);
        setId(0);
      }

      // Fetch updated project list after submission
      fetchProjects();

      // Reset the input fields
      setInputs({
        consultant: "",
        client: "",
        financialOutlay: "",
        startDate: "",
        endDate: "",
        title: "",
      });
    } catch (error) {
      console.error(error);
      setError("Failed to save project. Please try again."); // Set error message
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (project) => {
    // Populate the inputs with the project data for editing
    setInputs({
      consultant: project.consultants,
      client: project.client,
      financialOutlay: project.financial_outlay, // Ensure correct field
      startDate: project.start_date, // Ensure correct field
      endDate: project.end_date, // Ensure correct field
      title: project.title,
    });

    setId(project.id);
    setEdit(true);
  };

  const handleDelete = async (projectId) => {
    console.log(projectId);
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await axios.post(
          deleteConsultancyProjectRoute,
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
          p="lg" // Increased padding for a more spacious layout
          withBorder
          style={{
            borderLeft: "8px solid #2185d0",
            backgroundColor: "#f9fafb",
          }} // Light background for contrast
        >
          <Title order={2} mb="lg" style={{ color: "#2185d0" }}>
            {" "}
            {/* Consistent color with border */}
            Add a Consultancy Project
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
                  label="Consultant"
                  placeholder="Consultant"
                  value={inputs.consultant}
                  onChange={(e) =>
                    setInputs({ ...inputs, consultant: e.target.value })
                  }
                  style={{ padding: "10px" }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <TextInput
                  required
                  label="Client"
                  placeholder="Client"
                  value={inputs.client}
                  onChange={(e) =>
                    setInputs({ ...inputs, client: e.target.value })
                  }
                  style={{ padding: "10px" }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <TextInput
                  required
                  label="Financial Outlay"
                  placeholder="Financial Outlay"
                  value={inputs.financialOutlay}
                  onChange={(e) =>
                    setInputs({ ...inputs, financialOutlay: e.target.value })
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
                  required
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
                  required
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
                  label="Title"
                  placeholder="Project Title"
                  value={inputs.title}
                  onChange={(e) =>
                    setInputs({ ...inputs, title: e.target.value })
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
                  "Title",
                  "Consultant",
                  "Client",
                  "Start Date",
                  "End Date",
                  "Financial Outlay",
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
                      {project.title}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      {project.consultants}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      {project.client}
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
                        color: "#0d6efd",
                        fontWeight: "500",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      {project.financial_outlay}
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
                    colSpan={6}
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#6c757d",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    No projects found.
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
