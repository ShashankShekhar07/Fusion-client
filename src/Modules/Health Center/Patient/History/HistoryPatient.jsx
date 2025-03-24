import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Pagination,
  Paper,
  Table,
  TextInput,
  Title,
} from "@mantine/core";
import axios from "axios";
import NavCom from "../Navigation";
import CustomBreadcrumbs from "../../../../components/Breadcrumbs";
import { studentRoute } from "../../../../routes/health_center";

function HistoryPatient() {
  const [history, setHistory] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [activePage, setPage] = useState(1);

  const navigate = useNavigate();

  const fetchHistory = async (pagenumber) => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        studentRoute,
        { page: pagenumber, search_patientlog: search, datatype: "patientlog" },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      console.log(response);
      setHistory(response.data.report);
      setTotalPages(response.data.total_pages);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const setCurrentPage = async (e) => {
    setPage(e);
    fetchHistory(e);
  };

  useEffect(() => {
    fetchHistory(1);
  }, []);

  const handleViewClick = (id) => {
    navigate(`/healthcenter/student/prescription/${id}`);
  };

  const rows = history.map((element) => (
    <tr key={element.id}>
      <td style={{ textAlign: "center" }}>{element.doctor_id}</td>
      <td style={{ textAlign: "center" }}>{element.date}</td>
      <td style={{ textAlign: "center" }}>{element.details}</td>
      <td style={{ textAlign: "center" }}>{element.dependent_name}</td>
      <td style={{ textAlign: "center" }}>
        <Button
          onClick={() => handleViewClick(element.id)}
          style={{ backgroundColor: "#15abff" }}
        >
          View
        </Button>
      </td>
    </tr>
  ));

  return (
    <>
      <CustomBreadcrumbs />
      <NavCom />
      <br />
      <Paper shadow="xl" p="xl" withBorder>
        <Title
          order={3}
          style={{
            textAlign: "center",
            margin: "0 auto",
            color: "#15abff",
          }}
        >
          Prescription
        </Title>
        <br />
        <form style={{ marginBottom: "10px" }}>
          <TextInput
            placeholder="Search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </form>
        <Table
          withTableBorder
          withColumnBorders
          highlightOnHover
          striped
          horizontalSpacing="sm"
          verticalSpacing="sm"
          style={{ borderCollapse: "collapse", border: "1px solid #ccc" }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ textAlign: "center" }}>Treated By</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>Date</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>Details</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>Report</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>
                View Prescription
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody
            style={{
              textAlign: "center",
              fontSize: "16px",
            }}
          >
            {rows}
          </Table.Tbody>
        </Table>
        <Pagination
          value={activePage}
          onChange={setCurrentPage}
          total={totalPages}
          style={{ marginTop: "20px", margin: "auto", width: "fit-content" }}
        />
      </Paper>
    </>
  );
}

export default HistoryPatient;
