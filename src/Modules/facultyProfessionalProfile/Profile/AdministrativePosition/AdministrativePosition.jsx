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
} from "@mantine/core";
import { FloppyDisk, PencilSimple, Trash } from "@phosphor-icons/react";
import { useSelector } from "react-redux";
import {
  deleteAdministrativePosition,
  getAdministrativePosition,
  insertAdministrativePosition,
} from "../../../../routes/facultyProfessionalProfileRoutes";
// import { useSelector } from "react-redux";

export default function AdministrativePosition() {
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    dateFrom: "",
    dateTo: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isEdit, setEdit] = useState(false);
  const [Id, setId] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const pfNo = useSelector((state) => state.pfNo.value);

  //   const userId = useSelector((state) => state.userId.value);

  // Function to fetch positions from the backend
  const fetchPositions = async () => {
    try {
      const response = await axios.get(getAdministrativePosition, {
        params: { pfNo },
      });
      const positions = response.data;
      // Sort positions by created_at date in descending order
      const sortedPositions = positions.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at),
      );
      setTableData(sortedPositions);
    } catch (error) {
      console.error("Error fetching positions:", error);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("user_id", pfNo);
      formData.append("title", inputs.title);
      formData.append("description", inputs.description);
      formData.append("from_date", inputs.dateFrom);
      formData.append("to_date", inputs.dateTo);

      if (!isEdit) {
        await axios.post(insertAdministrativePosition, formData);
      } else {
        formData.append("position_id", Id);
        await axios.post(insertAdministrativePosition, formData);
        setEdit(false);
        setId(0);
      }

      fetchPositions();
      setInputs({
        title: "",
        description: "",
        dateFrom: "",
        dateTo: "",
      });
    } catch (error) {
      console.error("Error saving position:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (position) => {
    setInputs({
      title: position.title,
      description: position.description,
      dateFrom: position.from_date,
      dateTo: position.to_date,
    });
    setId(position.id);
    setEdit(true);
  };

  const handleDelete = async (positionId) => {
    if (window.confirm("Are you sure you want to delete this position?")) {
      try {
        await axios.post(
          deleteAdministrativePosition,
          new URLSearchParams({ pk: positionId }),
        ); // Adjust the delete URL as needed
        fetchPositions();
      } catch (error) {
        console.error("Error deleting position:", error);
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
            Add Administrative Position
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
                  placeholder="Position Title"
                  value={inputs.title}
                  onChange={(e) =>
                    setInputs({ ...inputs, title: e.target.value })
                  }
                  style={{ padding: "10px" }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <TextInput
                  required
                  label="Description"
                  placeholder="Position Description"
                  value={inputs.description}
                  onChange={(e) =>
                    setInputs({ ...inputs, description: e.target.value })
                  }
                  style={{ padding: "10px" }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <TextInput
                  label="From Date"
                  type="date"
                  value={inputs.dateFrom}
                  onChange={(e) =>
                    setInputs({ ...inputs, dateFrom: e.target.value })
                  }
                  style={{ padding: "10px" }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <TextInput
                  label="To Date"
                  type="date"
                  value={inputs.dateTo}
                  onChange={(e) =>
                    setInputs({ ...inputs, dateTo: e.target.value })
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
            Administrative Positions:
          </Title>
          <Table
            striped
            highlightOnHover
            style={{ minWidth: "100%", borderCollapse: "collapse" }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                {["Title", "Description", "From", "To", "Actions"].map(
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
                currentRows.map((position, index) => (
                  <tr key={index} style={{ backgroundColor: "#fff" }}>
                    <td
                      style={{
                        padding: "12px 16px",
                        textAlign: "center",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      {position.title}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        textAlign: "center",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      {position.description}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        textAlign: "center",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      {position.from_date}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        textAlign: "center",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      {position.to_date}
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
                        onClick={() => handleEdit(position)}
                        variant="light"
                        style={{ marginRight: "8px" }}
                      >
                        <PencilSimple size={16} />
                      </ActionIcon>
                      <ActionIcon
                        color="red"
                        onClick={() => handleDelete(position.id)}
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
                      padding: "20px",
                      color: "#6c757d",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    No administrative positions found.
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
