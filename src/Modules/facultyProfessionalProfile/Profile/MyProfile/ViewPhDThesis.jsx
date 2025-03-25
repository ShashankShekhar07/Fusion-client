import { useState, useEffect } from "react";
import axios from "axios";
import {
  MantineProvider,
  Container,
  Paper,
  Title,
  Table,
  ScrollArea,
  Text,
  Pagination,
} from "@mantine/core";
import { Books } from "@phosphor-icons/react";
import { useSelector } from "react-redux";
import { getPhDThesisRoute } from "../../../../routes/facultyProfessionalProfileRoutes";

export default function ViewPhdThesis() {
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(null); // For error handling
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const rowsPerPage = 10; // Number of rows per page

  const pfNo = useSelector((state) => state.pfNo.value);

  // Fetch projects from the backend
  const fetchProjects = async () => {
    try {
      const response = await axios.get(getPhDThesisRoute, {
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
            <Books size={24} />
            PG Thesis
          </Title>

          {error && (
            <Text color="red" mb="sm" style={{ textAlign: "center" }}>
              {error}
            </Text>
          )}

          {/* <ScrollArea>
            <Table striped highlightOnHover style={{ minWidth: "100%" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "10px" }}>Title</th>
                  <th style={{ textAlign: "left", padding: "10px" }}>Roll Number</th>
                  <th style={{ textAlign: "left", padding: "10px" }}>Name</th>
                  <th style={{ textAlign: "left", padding: "10px" }}>Year</th>
                  <th style={{ textAlign: "left", padding: "10px" }}>Month</th>
                </tr>
              </thead>
              <tbody>
                {tableData.length > 0 ? (
                  tableData.map((project) => (
                    <tr key={project.id}>
                      <td style={{ padding: "10px" }}>{project.title}</td>
                      <td style={{ padding: "10px" }}>{project.rollno}</td>
                      <td style={{ padding: "10px" }}>{project.s_name}</td>
                      <td style={{ padding: "10px" }}>{project.s_year}</td>
                      <td style={{ padding: "10px" }}>{project.a_month}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "10px" }}>
                      No theses found.
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
                  {["Title", "Roll Number", "Name", "Year", "Month"].map(
                    (header, index) => (
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
                    ),
                  )}
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
                        {project.rollno}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          textAlign: "center",
                          border: "1px solid #dee2e6",
                        }}
                      >
                        {project.s_name}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          textAlign: "center",
                          border: "1px solid #dee2e6",
                        }}
                      >
                        {project.s_year}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          textAlign: "center",
                          border: "1px solid #dee2e6",
                        }}
                      >
                        {project.a_month}
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
                      No theses found.
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
