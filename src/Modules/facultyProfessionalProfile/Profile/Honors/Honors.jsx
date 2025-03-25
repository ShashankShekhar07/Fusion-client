import { useState, useEffect } from "react";
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
  Textarea,
} from "@mantine/core";
import { FloppyDisk, PencilSimple, Trash } from "@phosphor-icons/react";
import { useSelector } from "react-redux";
import {
  deleteHonors,
  getHonors,
  insertHonors,
} from "../../../../routes/facultyProfessionalProfileRoutes";

export default function Honors() {
  const [inputs, setInputs] = useState({
    title: "",
    period: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isEdit, setEdit] = useState(false);
  const [Id, setId] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const pfNo = useSelector((state) => state.pfNo.value);

  const fetchHonors = async () => {
    try {
      const response = await axios.get(getHonors, {
        params: { pfNo },
      });
      const honors = response.data;
      const sortedHonors = honors.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at),
      );
      setTableData(sortedHonors);
    } catch (error) {
      console.error("Error fetching honors:", error);
    }
  };

  useEffect(() => {
    fetchHonors();
  }, []); // Fixed: Added empty dependency array to useEffect

  const handleSubmit = async (e) => {
    // eslint-disable-next-line no-undef
    e.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("user_id", pfNo);
      formData.append("title", inputs.title);
      formData.append("period", inputs.period);
      formData.append("description", inputs.description);

      if (!isEdit) {
        await axios.post(insertHonors, formData);
      } else {
        formData.append("honor_id", Id.toString());
        await axios.post(insertHonors, formData);
        setEdit(false);
        setId(0);
      }

      fetchHonors();
      setInputs({
        title: "",
        period: "",
        description: "",
      });
    } catch (error) {
      console.error("Error saving honor:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (honor) => {
    setInputs({
      title: honor.title,
      period: honor.period,
      description: honor.description,
    });
    setId(honor.id);
    setEdit(true);
  };

  const handleDelete = async (honorId) => {
    if (window.confirm("Are you sure you want to delete this honor?")) {
      try {
        await axios.post(deleteHonors, new URLSearchParams({ pk: honorId })); // Adjust the delete URL as needed
        fetchHonors();
      } catch (error) {
        console.error("Error deleting honor:", error);
      }
    }
  };

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
          }}
        >
          <Title order={2} mb="sm" style={{ color: "#2185d0" }}>
            Add Honor
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
                  label="Title"
                  placeholder="Enter honor title"
                  value={inputs.title}
                  onChange={(e) =>
                    setInputs({ ...inputs, title: e.target.value })
                  }
                  style={{ padding: "10px" }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <TextInput
                  label="Period"
                  placeholder="Enter period (optional)"
                  value={inputs.period}
                  onChange={(e) =>
                    setInputs({ ...inputs, period: e.target.value })
                  }
                  style={{ padding: "10px" }}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Textarea
                  label="Description"
                  placeholder="Enter description (optional)"
                  value={inputs.description}
                  onChange={(e) =>
                    setInputs({ ...inputs, description: e.target.value })
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
                  style={{ backgroundColor: "#2185d0", color: "#fff" }}
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
            Honors:
          </Title>
          <Table
            striped
            highlightOnHover
            style={{ minWidth: "100%", borderCollapse: "collapse" }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                {["Title", "Period", "Description", "Actions"].map(
                  (header, index) => (
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
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {currentRows.length > 0 ? (
                currentRows.map((honor, index) => (
                  <tr key={index} style={{ backgroundColor: "#fff" }}>
                    <td
                      style={{
                        padding: "12px 16px",
                        textAlign: "center",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      {honor.title}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        textAlign: "center",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      {honor.period}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        textAlign: "center",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      {honor.description}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        border: "1px solid #dee2e6",
                        whiteSpace: "nowrap",
                        width: "100px",
                      }}
                    >
                      <ActionIcon
                        color="blue"
                        onClick={() => handleEdit(honor)}
                        variant="light"
                        style={{ marginRight: "8px" }}
                      >
                        <PencilSimple size={16} />
                      </ActionIcon>
                      <ActionIcon
                        color="red"
                        onClick={() => handleDelete(honor.id)}
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
                    colSpan={4}
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#6c757d",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    No honors found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          <Pagination
            total={Math.ceil(tableData.length / rowsPerPage)}
            page={currentPage}
            onChange={setCurrentPage}
            mt="lg"
            position="center"
          />
        </Paper>
      </Container>
    </MantineProvider>
  );
}
