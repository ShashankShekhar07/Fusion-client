import { useState, useEffect } from "react";
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
  ScrollArea,
  ActionIcon,
  Pagination,
} from "@mantine/core";
// import { DatePickerInput } from "@mantine/dates";
import { FloppyDisk, PencilSimple, Trash } from "@phosphor-icons/react";
import { useSelector } from "react-redux";
import {
  getJournalRoute,
  insertJournalRoute,
  updateJournalRoute,
  deleteResearchPaperRoute,
} from "../../../../routes/facultyProfessionalProfileRoutes";

export default function Journal() {
  const [inputs, setInputs] = useState({
    author: "",
    coAuthors: "",
    journalName: "",
    // journalFile: null,
    year: "",
    title: "",
    // volume: "",
    // pageNo: "",
    // paperRefNo: "",
    // dateSubmission: "",
    // datePublication: "",
    // status: "",
    // category: "",
    // doi: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [editingId, setEditingId] = useState(null); // For editing
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const rowsPerPage = 10; // Number of rows per page

  const pfNo = useSelector((state) => state.pfNo.value);

  const fetchAchievements = async () => {
    try {
      const res = await axios.get(getJournalRoute, {
        params: { pfNo },
      });
      // console.log(res.data);
      setTableData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch achievements on component mount
  useEffect(() => {
    fetchAchievements();
  }, [pfNo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("user_id", pfNo); // Adjust this as needed
      formData.append("authors", inputs.author);
      formData.append("title", inputs.title);
      formData.append("co_author", inputs.coAuthors);
      formData.append("name", inputs.journalName);
      formData.append("year", inputs.year);
      if (editingId) {
        // Update the book
        formData.append("journalpk", editingId);
        await axios.post(updateJournalRoute, formData);
      } else {
        // Create a new book
        await axios.post(insertJournalRoute, formData);
      }
      setInputs({
        author: "",
        coAuthors: "",
        journalName: "",
        // journalFile: null,
        year: "",
        title: "",
        // volume: "",
        // pageNo: "",
        // paperRefNo: "",
        // dateSubmission: "",
        // datePublication: "",
        // status: "",
        // category: "",
        // doi: "",
      });
      setEditingId(null); // Reset editing ID
      // Refresh the list of achievements
      fetchAchievements();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete action
  const handleDelete = async (achievement) => {
    if (window.confirm("Are you sure you want to delete this Journal?")) {
      try {
        // console.log(achievement)
        await axios.post(
          deleteResearchPaperRoute,
          new URLSearchParams({ pk: achievement }),
        ); // Adjust the delete URL as needed
        fetchAchievements();
      } catch (error) {
        console.error("Error deleting Journal:", error);
      }
    }
  };

  // Handle edit action
  const handleEdit = (project) => {
    setInputs({
      author: project.authors,
      coAuthors: project.co_authors,
      journalName: project.name,
      year: project.year,
      title: project.title_paper,
      // volume: project.year,
      // pageNo: project.page_no,
      // paperRefNo: project.ref,
      // dateSubmission: project.dos,
      // datePublication: project.dop,
      // status: project.status,
      // category: project.is_sci ? "SCI" : "SCIE",
    });
    setEditingId(project.id);
  };

  // Calculate the current rows to display based on pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow);

  const years = Array.from({ length: 31 }, (_, i) => (2000 + i).toString());

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
            {inputs.id ? "Edit Journal" : "Add a Journal"}
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
                  label="Author"
                  placeholder="Author"
                  value={inputs.author}
                  onChange={(e) =>
                    setInputs({ ...inputs, author: e.target.value })
                  }
                  style={{ padding: "10px" }} // Consistent padding
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <TextInput
                  required
                  label="Co-author(s)"
                  placeholder="Co-author(s)"
                  value={inputs.coAuthors}
                  onChange={(e) =>
                    setInputs({ ...inputs, coAuthors: e.target.value })
                  }
                  style={{ padding: "10px" }} // Consistent padding
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <TextInput
                  required
                  label="Journal Name"
                  placeholder="Journal Name"
                  value={inputs.journalName}
                  onChange={(e) =>
                    setInputs({ ...inputs, journalName: e.target.value })
                  }
                  style={{ padding: "10px" }} // Consistent padding
                />
              </Grid.Col>
              {/* <Grid.Col span={3}>
                <TextInput
                  type="file"
                  label="Journal File"
                  placeholder="Choose File"
                  onChange={(e) =>
                    setInputs({ ...inputs, journalFile: e.target.files[0] })
                  }
                  style={{ padding: "10px" }} // Consistent padding
                />
              </Grid.Col> */}
              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <Select
                  label="Year"
                  placeholder="Select year"
                  data={years}
                  value={inputs.year}
                  onChange={(value) =>
                    setInputs({ ...inputs, year: value || "" })
                  }
                  required
                  style={{ padding: "10px" }} // Consistent padding
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  required
                  label="Title"
                  placeholder="Journal Title"
                  value={inputs.title}
                  onChange={(e) =>
                    setInputs({ ...inputs, title: e.target.value })
                  }
                  style={{ padding: "10px" }} // Consistent padding
                />
              </Grid.Col>
              {/* <Grid.Col span={12} style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  type="submit"
                  mt="md"
                  loading={isLoading}
                  leftIcon={<FloppyDisk size={16} />}
                  style={{ backgroundColor: "#2185d0", color: "#fff" }} // Custom button styling
                >
                  {inputs.id ? "Update" : "Save"}
                </Button>
              </Grid.Col> */}
              {/* <Grid.Col span={12}>
                <details>
                  <summary style={{ cursor: "pointer", color: "#2185d0" }}>
                    Optional Journal Details
                  </summary>
                  <Grid gutter="md">
                    <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                      <TextInput
                        label="Volume No./Issue No."
                        placeholder="Volume No./Issue No."
                        value={inputs.volume}
                        onChange={(e) =>
                          setInputs({ ...inputs, volume: e.target.value })
                        }
                        style={{ padding: "10px" }} // Consistent padding
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                      <TextInput
                        label="Page No."
                        placeholder="Page No."
                        value={inputs.pageNo}
                        onChange={(e) =>
                          setInputs({ ...inputs, pageNo: e.target.value })
                        }
                        style={{ padding: "10px" }} // Consistent padding
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                      <TextInput
                        label="Paper Reference No."
                        placeholder="Paper Reference No."
                        value={inputs.paperRefNo}
                        onChange={(e) =>
                          setInputs({ ...inputs, paperRefNo: e.target.value })
                        }
                        style={{ padding: "10px" }} // Consistent padding
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                      <DatePickerInput
                        label="Date Of Submission"
                        placeholder="Select date"
                        value={inputs.dateSubmission}
                        onChange={(date) =>
                          setInputs({ ...inputs, dateSubmission: date })
                        }
                        style={{ padding: "10px" }} // Consistent padding
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                      <DatePickerInput
                        label="Date of Publication"
                        placeholder="Select date"
                        value={inputs.datePublication}
                        onChange={(date) =>
                          setInputs({ ...inputs, datePublication: date })
                        }
                        style={{ padding: "10px" }} // Consistent padding
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                      <TextInput
                        label="DOI"
                        placeholder="DOI"
                        value={inputs.doi}
                        onChange={(e) =>
                          setInputs({ ...inputs, doi: e.target.value })
                        }
                        style={{ padding: "10px" }} // Consistent padding
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                      <Select
                        label="SCI/SCIE"
                        placeholder="Select category"
                        data={[
                          { value: "sci", label: "SCI" },
                          { value: "scie", label: "SCIE" },
                        ]}
                        value={inputs.category}
                        onChange={(value) =>
                          setInputs({ ...inputs, category: value || "" })
                        }
                        style={{ padding: "10px" }} // Consistent padding
                      />
                    </Grid.Col>
                  </Grid>
                </details>
              </Grid.Col> */}
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
                  {inputs.id ? "Update" : "Save"}
                </Button>
              </Grid.Col>
            </Grid>
          </form>
        </Paper>

        {/* <Paper mt="xl" p="md" withBorder>
          <Title order={3} mb="sm" style={{ color: "#2185d0" }}>
            Journal Report:
          </Title>
          {tableData.length === 0 ? (
            <p>No Journals Recorded Yet</p>
          ) : (
            <Table striped highlightOnHover>
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px",
                      color: "#2185d0",
                    }}
                  >
                    Sr.
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px",
                      color: "#2185d0",
                    }}
                  >
                    Title of Paper
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px",
                      color: "#2185d0",
                    }}
                  >
                    Authors
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px",
                      color: "#2185d0",
                    }}
                  >
                    Journal Name
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px",
                      color: "#2185d0",
                    }}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((project, index) => (
                  <tr key={project.id}>
                    <td style={{ textAlign: "left", padding: "10px" }}>
                      {index + 1}
                    </td>
                    <td style={{ textAlign: "left", padding: "10px" }}>
                      {project.title}
                    </td>
                    <td
                      style={{ textAlign: "left", padding: "10px" }}
                    >{`${project.authors}, ${project.coAuthors}`}</td>
                    <td style={{ textAlign: "left", padding: "10px" }}>
                      {project.journalName}
                    </td>
                    <td style={{ textAlign: "left", padding: "10px" }}>
                      <Button
                        variant="subtle"
                        color="blue"
                        leftIcon={<PencilSimple size={16} />}
                        onClick={() => handleEdit(project)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="subtle"
                        color="red"
                        leftIcon={<Trash size={16} />}
                        onClick={() => handleDelete(project.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Paper> */}

        <Paper mt="xl" p="md" withBorder>
          <Title order={3} mb="sm" style={{ color: "#2185d0" }}>
            Report:
          </Title>
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
                    "Title Of Journal",
                    "Authors",
                    "Co-Authors",
                    "Journal Name",
                    "Year",
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
                        {project.title_paper}
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
                        {project.co_authors}
                      </td>
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
                        {project.year}
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
                      No Journals found.
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
