import { useState, useEffect } from "react";
// import { Save } from "lucide-react";
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
  ActionIcon,
  Pagination,
} from "@mantine/core";
import { FloppyDisk, PencilSimple, Trash } from "@phosphor-icons/react";
import { useSelector } from "react-redux";
import {
  getAwardsRoute,
  insertAwardRoute,
  deleteAchievementRoute,
} from "../../../../routes/facultyProfessionalProfileRoutes";
// import { useSelector } from "react-redux";

export default function AchievementsForm() {
  const [inputs, setInputs] = useState({
    day: "",
    month: "",
    year: "",
    achievementType: "",
    title: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isEdit, setEdit] = useState(false);
  const [Id, setId] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const rowsPerPage = 10; // Number of rows per page

  const pfNo = useSelector((state) => state.pfNo.value);

  // function changeAchievements() {
  //   setAchievements(1);
  // }
  // changeAchievements();

  const days = Array.from({ length: 31 }, (_, i) => ({
    value: (i + 1).toString(),
    label: (i + 1).toString(),
  }));
  const months = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ].map((month) => ({ value: month, label: month }));
  const years = Array.from({ length: 50 }, (_, i) => ({
    value: (new Date().getFullYear() - i).toString(),
    label: (new Date().getFullYear() - i).toString(),
  }));
  const achievementTypes = [
    "Award",
    "Publication",
    "Presentation",
    "Other",
  ].map((type) => ({ value: type, label: type }));

  const fetchProjects = async () => {
    try {
      const response = await axios.get(getAwardsRoute, {
        params: { pfNo },
      });
      const projects = response.data;
      setTableData(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
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
      formData.append("type", inputs.achievementType);
      formData.append("a_day", inputs.day);
      formData.append("a_month", inputs.month);
      formData.append("a_year", inputs.year);
      formData.append("details", inputs.title);

      if (isEdit === false) {
        const res = await axios.post(insertAwardRoute, formData);
        console.log(res.data);
      } else {
        formData.append("ach_id", Id);
        const res = await axios.post(insertAwardRoute, formData);
        console.log(res.data);
        setEdit(false);
        setId(0);
      }

      fetchProjects(); // Refresh the list of achievements

      setInputs({
        day: "",
        month: "",
        year: "",
        achievementType: "",
        title: "",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (achievement) => {
    setInputs({
      day: achievement.a_day,
      month: achievement.a_month,
      year: achievement.a_year,
      achievementType: achievement.a_type,
      title: achievement.details,
    });

    setId(achievement.id);
    setEdit(true);
  };

  const handleDelete = async (achievementId) => {
    if (window.confirm("Are you sure you want to delete this achievement?")) {
      try {
        await axios.post(
          deleteAchievementRoute,
          new URLSearchParams({ pk: achievementId }),
        ); // Adjust the delete URL as needed
        fetchProjects(); // Refresh the project list after deletion
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
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
          p="lg"
          withBorder
          style={{
            borderLeft: "8px solid #2185d0",
            backgroundColor: "#f9fafb",
          }} // Light background for contrast
        >
          <Title order={2} mb="lg" style={{ color: "#2185d0" }}>
            {" "}
            {/* Consistent color with border */}
            Add an Achievement
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
                  label="Day"
                  placeholder="Select Day"
                  data={days}
                  value={inputs.day}
                  onChange={(value) =>
                    setInputs({ ...inputs, day: value || "" })
                  }
                  required
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <Select
                  label="Month"
                  placeholder="Select Month"
                  data={months}
                  value={inputs.month}
                  onChange={(value) =>
                    setInputs({ ...inputs, month: value || "" })
                  }
                  required
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <Select
                  label="Year"
                  placeholder="Select Year"
                  data={years}
                  value={inputs.year}
                  onChange={(value) =>
                    setInputs({ ...inputs, year: value || "" })
                  }
                  required
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <Select
                  label="Achievement Type"
                  placeholder="Select Type"
                  data={achievementTypes}
                  value={inputs.achievementType}
                  onChange={(value) =>
                    setInputs({ ...inputs, achievementType: value || "" })
                  }
                  required
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  required
                  label="Title"
                  placeholder="Title"
                  value={inputs.title}
                  onChange={(e) =>
                    setInputs({ ...inputs, title: e.target.value })
                  }
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

        {/* <Paper mt="xl" p="lg" withBorder shadow="sm" style={{ border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
          <Title order={3} mb="lg" style={{ color: "#2185d0" }}>
            Projects Report:
          </Title>
          <Table striped highlightOnHover>
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <th style={{ padding: "12px", textAlign: "center", border: "1px solid #dee2e6" }}>Sr.</th>
                <th style={{ padding: "12px", textAlign: "center", border: "1px solid #dee2e6" }}>Achievement</th>
                <th style={{ padding: "12px", textAlign: "center", border: "1px solid #dee2e6" }}>Title</th>
                <th style={{ padding: "12px", textAlign: "center", border: "1px solid #dee2e6" }}>Day/Month/Year</th>
                <th style={{ padding: "12px", textAlign: "center", border: "1px solid #dee2e6" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableData.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "10px" }}>
                    No Achievements Recorded Yet
                  </td>
                </tr>
              ) : (
                tableData.map((achievement) => (
                  <tr key={achievement.id} style={{ backgroundColor: "#fff" }}>
                    <td style={{ padding: "12px", textAlign: "center", border: "1px solid #dee2e6" }}>{achievement.id}</td>
                    <td style={{ padding: "12px", textAlign: "center", border: "1px solid #dee2e6" }}>{achievement.a_type}</td>
                    <td style={{ padding: "12px", textAlign: "center", border: "1px solid #dee2e6" }}>{achievement.details}</td>
                    <td style={{ padding: "12px", textAlign: "center", border: "1px solid #dee2e6" }}>{`${achievement.a_day}/${achievement.a_month}/${achievement.a_year}`}</td>
                    <td style={{ padding: "12px", textAlign: "center", border: "1px solid #dee2e6" }}>
                      <ActionIcon color="blue" onClick={() => handleEdit(achievement)} variant="light" style={{ marginRight: "8px" }}>
                        <PencilSimple size={16} />
                      </ActionIcon>
                      <ActionIcon color="red" onClick={() => handleDelete(achievement.id)} variant="light">
                        <Trash size={16} />
                      </ActionIcon>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Paper> */}

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
            style={{ borderCollapse: "collapse", width: "100%" }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                {[
                  "Sr.",
                  "Achievement",
                  "Title",
                  "Day/Month/Year",
                  "Actions",
                ].map((header, index) => (
                  <th
                    key={index}
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      border: "1px solid #dee2e6",
                      color: "#495057",
                      fontWeight: "600",
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      textAlign: "center",
                      padding: "10px",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    No Achievements Recorded Yet
                  </td>
                </tr>
              ) : (
                currentRows.map((achievement, index) => (
                  <tr key={achievement.id} style={{ backgroundColor: "#fff" }}>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      {index + 1}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      {achievement.a_type}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      {achievement.details}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      {`${achievement.a_day}/${achievement.a_month}/${achievement.a_year}`}
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
                        onClick={() => handleEdit(achievement)}
                        variant="light"
                        style={{ marginRight: "8px" }}
                      >
                        <PencilSimple size={16} />
                      </ActionIcon>
                      <ActionIcon
                        color="red"
                        onClick={() => handleDelete(achievement.id)}
                        variant="light"
                      >
                        <Trash size={16} />
                      </ActionIcon>
                    </td>
                  </tr>
                ))
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
