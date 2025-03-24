import { useState, useEffect } from "react";
import axios from "axios";
import {
  MantineProvider,
  Container,
  Paper,
  Title,
  Text,
  Table,
  ScrollArea,
  Pagination,
} from "@mantine/core";
import { Briefcase } from "@phosphor-icons/react";
import { useSelector } from "react-redux";
import { getConsultancyProjectRoute } from "../../../../routes/facultyProfessionalProfileRoutes";
// import { useSelector } from "react-redux";

export default function ViewConsultancyProject() {
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(null); // For error handling
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const rowsPerPage = 10; // Number of rows per page

  const pfNo = useSelector((state) => state.pfNo.value);

  // Function to fetch Consultancy Projects from the backend
  const fetchProjects = async () => {
    try {
      const response = await axios.get(getConsultancyProjectRoute, {
        params: { pfNo },
      });
      const projects = response.data;
      // Sort projects by submission date in descending order
      const sortedProjects = projects.sort(
        (a, b) => new Date(b.submission_date) - new Date(a.submission_date),
      );
      setTableData(sortedProjects);
    } catch (e) {
      console.error("Error fetching projects:", error);
      setError("Failed to fetch projects. Please try again later."); // Set error message
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Calculate the current rows to display based on pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Container size="2xl" mt="xl">
        <Paper
          shadow="sm"
          p="lg"
          withBorder
          style={{
            borderLeft: "8px solid #228be6",
            backgroundColor: "#f9fafb",
          }}
        >
          <Title
            order={2}
            mb="lg"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "#228be6",
            }}
          >
            <Briefcase size={24} />
            Consultancy Projects
          </Title>

          {error && (
            <Text color="red" mb="sm" style={{ textAlign: "center" }}>
              {error}
            </Text>
          )}

          {/* <ScrollArea>
            <Table striped highlightOnHover withBorder style={{ minWidth: "100%" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "8px" }}>Title</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Consultant</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Client</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Start Date</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>End Date</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Financial Outlay</th>
                </tr>
              </thead>
              <tbody>
                {tableData.length > 0 ? (
                  tableData.map((project) => (
                    <tr key={project.id}>
                      <td style={{ padding: "8px" }}>{project.title}</td>
                      <td style={{ padding: "8px" }}>{project.consultants}</td>
                      <td style={{ padding: "8px" }}>{project.client}</td>
                      <td style={{ padding: "8px" }}>{project.start_date}</td>
                      <td style={{ padding: "8px" }}>{project.end_date}</td>
                      <td style={{ padding: "8px" }}>{project.financial_outlay}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "8px" }}>
                      No projects found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </ScrollArea> */}

          <ScrollArea>
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
          </ScrollArea>

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
