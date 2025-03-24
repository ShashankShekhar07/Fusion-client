import { useState, useEffect } from "react";
import axios from "axios";
import {
  MantineProvider,
  Container,
  Paper,
  Title,
  Grid,
  TextInput,
  Select,
  Button,
  Table,
  ScrollArea,
  ActionIcon,
  Pagination,
} from "@mantine/core";
import { FloppyDisk, Trash, PencilSimple } from "@phosphor-icons/react";
import { useSelector } from "react-redux";
import {
  deleteBooksRoute,
  getBooksRoute,
  insertBooksRoute,
  updateBooksRoute,
} from "../../../../routes/facultyProfessionalProfileRoutes";

export default function Books() {
  const [inputs, setInputs] = useState({
    publishType: "",
    author: "",
    publisher: "",
    year: "",
    title: "",
  });
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null); // For editing
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const rowsPerPage = 10; // Number of rows per page

  const pfNo = useSelector((state) => state.pfNo.value);
  // const csrfToken = document.querySelector('meta[name="csrf-token"]');
  //   .getAttribute("content");
  // console.log(csrfToken);
  // console.log(pfNo);

  const fetchAchievements = async () => {
    try {
      const res = await axios.get(getBooksRoute, {
        params: { pfNo },
      });
      console.log(res.data);
      setTableData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch achievements on component mount
  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("user_id", pfNo); // Adjust this as needed
      formData.append("book_p_type", inputs.publishType);
      formData.append("book_author", inputs.author);
      formData.append("book_publisher", inputs.publisher);
      formData.append("book_year", inputs.year);
      formData.append("book_title", inputs.title);
      if (editingId) {
        // Update the book
        formData.append("bookspk", editingId);
        await axios.post(updateBooksRoute, formData);
      } else {
        // Create a new book
        await axios.post(insertBooksRoute, formData);
      }
      setInputs({
        publishType: "",
        author: "",
        publisher: "",
        year: "",
        title: "",
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

  const handleEdit = (achievement) => {
    setInputs({
      publishType: achievement.p_type,
      author: achievement.authors,
      publisher: achievement.publisher,
      year: achievement.pyear,
      title: achievement.title,
    });
    setEditingId(achievement.id); // Store the ID of the book being edited
  };

  const handleDelete = async (achievement) => {
    if (window.confirm("Are you sure you want to delete this Book?")) {
      try {
        // console.log(achievement)
        await axios.post(
          deleteBooksRoute,
          new URLSearchParams({ pk: achievement }),
        ); // Adjust the delete URL as needed
        fetchAchievements(); // Refresh the project list after deletion
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
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
            {editingId ? "Edit Book/Book Chapter" : "Add a Book/Book Chapter"}
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
                  label="Publish Type"
                  placeholder="Select Type"
                  data={[
                    { value: "book", label: "Book" },
                    { value: "monograph", label: "Monograph" },
                    { value: "book-chapter", label: "Book Chapter" },
                    { value: "handbook", label: "Handbook" },
                    { value: "technical-report", label: "Technical Report" },
                  ]}
                  value={inputs.publishType}
                  onChange={(value) =>
                    setInputs({ ...inputs, publishType: value })
                  }
                  required
                  style={{ padding: "10px" }} // Consistent padding
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <TextInput
                  label="Author"
                  placeholder="Author"
                  value={inputs.author}
                  onChange={(e) =>
                    setInputs({ ...inputs, author: e.target.value })
                  }
                  required
                  style={{ padding: "10px" }} // Consistent padding
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <TextInput
                  label="Publisher"
                  placeholder="Publisher"
                  value={inputs.publisher}
                  onChange={(e) =>
                    setInputs({ ...inputs, publisher: e.target.value })
                  }
                  required
                  style={{ padding: "10px" }} // Consistent padding
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <Select
                  label="Publishing Year"
                  placeholder="Select Year"
                  data={years}
                  value={inputs.year}
                  onChange={(value) => setInputs({ ...inputs, year: value })}
                  required
                  style={{ padding: "10px" }} // Consistent padding
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Title"
                  placeholder="Title"
                  value={inputs.title}
                  onChange={(e) =>
                    setInputs({ ...inputs, title: e.target.value })
                  }
                  required
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
                    "Title Of Book",
                    "Authors",
                    "Publish Type",
                    "Year",
                    "Publisher",
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
