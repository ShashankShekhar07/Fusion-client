/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Button,
  Pagination,
  Paper,
  Table,
  TextInput,
  Title,
} from "@mantine/core";
import { Download } from "@phosphor-icons/react";
import NavCom from "../NavCom";
import HistoryNavBar from "./historyPath";
import CustomBreadcrumbs from "../../../../components/Breadcrumbs";
import { compounderRoute } from "../../../../routes/health_center";

function HistoryCompounder() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [activePage, setPage] = useState(1);

  const navigate = useNavigate();

  const fetchHistory = async (pagenumber) => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        compounderRoute,
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
    navigate(`/healthcenter/compounder/prescription/${id}`);
  };

  const rows = history.map((element) => (
    <tr key={element.id}>
      <td style={{ textAlign: "center" }}>{element.user_id}</td>
      <td style={{ textAlign: "center" }}>{element.doctor_id}</td>
      <td style={{ textAlign: "center" }}>{element.date}</td>
      <td style={{ textAlign: "center" }}>{element.details}</td>
      <td style={{ textAlign: "center" }}>
        {element.report ? (
          <Download size={20} color="#15abff" />
        ) : (
          <Download size={20} color="#15abff" />
        )}
      </td>
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
      <HistoryNavBar />
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
          History
        </Title>
        <br />

        <form>
          <TextInput
            placeholder="Search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </form>
        <br />
        <Table
          withTableBorder
          withColumnBorders
          highlightOnHover
          striped
          horizontalSpacing="sm"
          verticalSpacing="sm"
          style={{ marginBottom: "20px" }}
        >
          <Table.Thead>
            <Table.Tr style={{ textAlign: "center" }}>
              <Table.Th style={{ textAlign: "center" }}>Patient Id</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>Treated By</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>Date</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>Details</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>Report</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>
                View Prescription
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
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

export default HistoryCompounder;
