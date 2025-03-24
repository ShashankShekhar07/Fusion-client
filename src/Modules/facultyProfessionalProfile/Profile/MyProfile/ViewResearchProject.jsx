import { useState, useEffect } from "react";
import axios from "axios";
import {
  MantineProvider,
  Container,
  Paper,
  Title,
  Table,
  ScrollArea,
  Pagination,
} from "@mantine/core";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useSelector } from "react-redux";
import { getResearchProjectsRoute } from "../../../../routes/facultyProfessionalProfileRoutes";

export default function ViewResearchProject() {
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const rowsPerPage = 10; // Number of rows per page

  const pfNo = useSelector((state) => state.pfNo.value);

  // Function to fetch projects from the backend
  const fetchProjects = async () => {
    try {
      const response = await axios.get(getResearchProjectsRoute, {
        params: { pfNo },
      });
      const projects = response.data;
      // Sort projects by submission date in descending order
      const sortedProjects = projects.sort(
        (a, b) => new Date(b.submission_date) - new Date(a.submission_date),
      );
      console.log(sortedProjects);
      setTableData(sortedProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
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
            backgroundColor: "#f9fafb", // Light background for better contrast
          }}
        >
          <Title
            order={2}
            mb="lg"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "#228be6", // Consistent color with border
            }}
          >
            <MagnifyingGlass size={24} />
            Research Projects
          </Title>

          {/* <ScrollArea>
            <Table striped highlightOnHover style={{ minWidth: "100%" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "10px" }}>Title</th>
                  <th style={{ textAlign: "left", padding: "10px" }}>PI</th>
                  <th style={{ textAlign: "left", padding: "10px" }}>Co-PI</th>
                  <th style={{ textAlign: "left", padding: "10px" }}>Funding Agency</th>
                  <th style={{ textAlign: "left", padding: "10px" }}>Status</th>
                  <th style={{ textAlign: "left", padding: "10px" }}>Submission Date</th>
                  <th style={{ textAlign: "left", padding: "10px" }}>Start Date</th>
                  <th style={{ textAlign: "left", padding: "10px" }}>Expected Finish Date</th>
                  <th style={{ textAlign: "left", padding: "10px" }}>Financial Outlay</th>
                </tr>
              </thead>
              <tbody>
                {tableData.length > 0 ? (
                  tableData.map((project, index) => (
                    <tr key={index}>
                      <td style={{ padding: "10px" }}>{project.title}</td>
                      <td style={{ padding: "10px" }}>{project.pi}</td>
                      <td style={{ padding: "10px" }}>{project.co_pi}</td>
                      <td style={{ padding: "10px" }}>{project.funding_agency}</td>
                      <td style={{ padding: "10px" }}>{project.status}</td>
                      <td style={{ padding: "10px" }}>{project.date_submission}</td>
                      <td style={{ padding: "10px" }}>{project.start_date}</td>
                      <td style={{ padding: "10px" }}>{project.finish_date}</td>
                      <td style={{ padding: "10px" }}>{project.financial_outlay}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center", padding: "10px" }}>
                      No research projects found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </ScrollArea> */}

          {/* <ScrollArea style={{ padding: "20px", borderRadius: "8px", border: "1px solid #e0e0e0", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
            <Table striped highlightOnHover style={{ minWidth: "100%", borderCollapse: "separate", borderSpacing: "0 8px" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8f9fa" }}>
                  {["Title", "PI", "Co-PI", "Funding Agency", "Status", "Submission Date", "Start Date", "Expected Finish Date", "Financial Outlay"].map((header, index) => (
                    <th key={index} style={{ textAlign: "left", padding: "12px 16px", color: "#495057", fontWeight: "600", borderBottom: "2px solid #dee2e6" }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.length > 0 ? (
                  tableData.map((project, index) => (
                    <tr key={index} style={{ backgroundColor: "#fff", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)" }}>
                      <td style={{ padding: "12px 16px" }}>{project.title}</td>
                      <td style={{ padding: "12px 16px" }}>{project.pi}</td>
                      <td style={{ padding: "12px 16px" }}>{project.co_pi}</td>
                      <td style={{ padding: "12px 16px" }}>{project.funding_agency}</td>
                      <td style={{ padding: "12px 16px" }}>{project.status}</td>
                      <td style={{ padding: "12px 16px" }}>{project.date_submission}</td>
                      <td style={{ padding: "12px 16px" }}>{project.start_date}</td>
                      <td style={{ padding: "12px 16px" }}>{project.finish_date}</td>
                      <td style={{ padding: "12px 16px", color: "#0d6efd", fontWeight: "500" }}>{project.financial_outlay}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center", padding: "20px", color: "#6c757d" }}>
                      No research projects found.
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
              style={{ minWidth: "100%", borderCollapse: "collapse" }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f8f9fa" }}>
                  {[
                    "Title",
                    "PI",
                    "Co-PI",
                    "Funding Agency",
                    "Status",
                    "Submission Date",
                    "Start Date",
                    "Expected Finish Date",
                    "Financial Outlay",
                  ].map((header, index) => (
                    <th
                      key={index}
                      style={{
                        textAlign: "center",
                        padding: "12px 16px",
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
                  currentRows.map((project, index) => (
                    <tr key={index} style={{ backgroundColor: "#fff" }}>
                      <td
                        style={{
                          padding: "12px 16px",
                          textAlign: "center",
                          border: "1px solid #dee2e6",
                        }}
                      >
                        {project.title}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          textAlign: "center",
                          border: "1px solid #dee2e6",
                        }}
                      >
                        {project.pi}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          textAlign: "center",
                          border: "1px solid #dee2e6",
                        }}
                      >
                        {project.co_pi}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          textAlign: "center",
                          border: "1px solid #dee2e6",
                        }}
                      >
                        {project.funding_agency}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          textAlign: "center",
                          border: "1px solid #dee2e6",
                        }}
                      >
                        {project.status}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          textAlign: "center",
                          border: "1px solid #dee2e6",
                        }}
                      >
                        {project.date_submission}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          textAlign: "center",
                          border: "1px solid #dee2e6",
                        }}
                      >
                        {project.start_date}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          textAlign: "center",
                          border: "1px solid #dee2e6",
                        }}
                      >
                        {project.finish_date}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
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
                      colSpan={9}
                      style={{
                        textAlign: "center",
                        padding: "20px",
                        color: "#6c757d",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      No research projects found.
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
