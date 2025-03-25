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
import { Books } from "@phosphor-icons/react";
import { useSelector } from "react-redux";
import { getBooksRoute } from "../../../../routes/facultyProfessionalProfileRoutes";

export default function ViewBooks() {
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(null); // For error handling
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const rowsPerPage = 10; // Number of rows per page

  const pfNo = useSelector((state) => state.pfNo.value);

  // Fetch projects from the backend
  const fetchProjects = async () => {
    try {
      const response = await axios.get(getBooksRoute, {
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

  // return (
  //     <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-8xl border-l-8 border-customSaveButtonColor">
  //         <h1 className="text-lg font-medium text-gray-800 mb-1">PG Thesis</h1>
  //         <hr />
  //         {error && <p className="text-red-500">{error}</p>} {/* Error message display */}

  //         <div className="overflow-x-auto">
  //             <table className="min-w-full border border-gray-300">
  //             <thead>
  //                 <tr>
  //                 <th className="border border-gray-300 p-2">Title</th>
  //                 <th className="border border-gray-300 p-2">Roll Number</th>
  //                 <th className="border border-gray-300 p-2">Name</th>
  //                 <th className="border border-gray-300 p-2">Year</th>
  //                 <th className="border border-gray-300 p-2">Month</th>
  //                 </tr>
  //             </thead>
  //             <tbody>
  //                 {tableData.length > 0 ? (
  //                 tableData.map((project) => (
  //                     <tr key={project.id}>
  //                     <td className="border border-gray-300 p-2">{project.title}</td>
  //                     <td className="border border-gray-300 p-2">{project.rollno}</td>
  //                     <td className="border border-gray-300 p-2">{project.s_name}</td>
  //                     <td className="border border-gray-300 p-2">{project.s_year}</td>
  //                     <td className="border border-gray-300 p-2">{project.a_month}</td>
  //                     </tr>
  //                 ))
  //                 ) : (
  //                 <tr>
  //                     <td colSpan="7" className="border border-gray-300 p-2 text-center">No projects found.</td>
  //                 </tr>
  //                 )}
  //             </tbody>
  //             </table>
  //         </div>
  //     </div>
  // );
  // return (
  //   <MantineProvider withGlobalStyles withNormalizeCSS>
  //     <Container size="xl">
  //       <Paper
  //         shadow="sm"
  //         p="md"
  //         withBorder
  //         style={{ borderLeft: "8px solid #228be6" }}
  //       >
  //         <Title
  //           order={2}
  //           mb="sm"
  //           style={{ display: "flex", alignItems: "center", gap: "10px" }}
  //         >
  //           <Books size={24} />
  //           PG Thesis
  //         </Title>
  //         {error && (
  //           <Text color="red" mb="sm">
  //             {error}
  //           </Text>
  //         )}
  //         <ScrollArea>
  //           <Table striped highlightOnHover style={{ minWidth: "100%" }}>
  //             <thead>
  //               <tr>
  //                 <th>Title</th>
  //                 <th>Roll Number</th>
  //                 <th>Name</th>
  //                 <th>Year</th>
  //                 <th>Month</th>
  //               </tr>
  //             </thead>
  //             <tbody>
  //               {tableData.length > 0 ? (
  //                 tableData.map((project) => (
  //                   <tr key={project.id}>
  //                     <td>{project.title}</td>
  //                     <td>{project.rollno}</td>
  //                     <td>{project.s_name}</td>
  //                     <td>{project.s_year}</td>
  //                     <td>{project.a_month}</td>
  //                   </tr>
  //                 ))
  //               ) : (
  //                 <tr>
  //                   <td colSpan={5} style={{ textAlign: "center" }}>
  //                     No projects found.
  //                   </td>
  //                 </tr>
  //               )}
  //             </tbody>
  //           </Table>
  //         </ScrollArea>
  //       </Paper>
  //     </Container>
  //   </MantineProvider>
  // );
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
            Books
          </Title>

          {error && (
            <Text color="red" mb="sm" style={{ textAlign: "center" }}>
              {error}
            </Text>
          )}

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
                    "Title Of Book",
                    "Authors",
                    "Publish Type",
                    "Year",
                    "Publisher",
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
                        {project.authors}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          textAlign: "center",
                          border: "1px solid #dee2e6",
                        }}
                      >
                        {project.p_type}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          textAlign: "center",
                          border: "1px solid #dee2e6",
                        }}
                      >
                        {project.pyear}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          textAlign: "center",
                          border: "1px solid #dee2e6",
                        }}
                      >
                        {project.publisher}
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
                      No Books found.
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
