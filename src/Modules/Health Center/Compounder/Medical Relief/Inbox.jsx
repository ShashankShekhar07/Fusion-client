import { Paper, Table, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Download } from "@phosphor-icons/react";
import axios from "axios";
import NavCom from "../NavCom";
import { compounderRoute } from "../../../../routes/health_center";
import CustomBreadcrumbs from "../../../../components/Breadcrumbs";

function Inbox() {
  const navigate = useNavigate();
  const [elements, setMedical] = useState([]);

  const get_relief = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        compounderRoute,
        { get_relief: 1 },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      console.log(response.data);
      setMedical(response.data.relief);
    } catch (err) {
      console.log(err);
    }
  };

  const handleStatusClick = (id, status) => {
    if (status === "Pending") {
      navigate(`/healthcenter/compounder/medical-relief/application/${id}`);
    }
  };

  const get_status = (element) => {
    if (element.status1 === true) return "Approved";
    if (element.status === true) return "Forwarded";
    if (element.status2 === true) return "Rejected";
    return "Pending";
  };
  useEffect(() => {
    get_relief();
  }, []);

  const rows = elements.map((element) => (
    <Table.Tr key={element.id}>
      <Table.Td>{element.uploader}</Table.Td>
      <Table.Td>{element.upload_date}</Table.Td>
      <Table.Td>{element.desc}</Table.Td>
      <Table.Td>
        <Download size={20} /> {element.file}
      </Table.Td>
      <Table.Td
        onClick={() => handleStatusClick(element.id, get_status(element))}
        style={{
          cursor: get_status(element) === "Pending" ? "pointer" : "default",
          color: get_status(element) === "Pending" ? "#15abff" : "gray",
        }}
      >
        {get_status(element)}
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <CustomBreadcrumbs />
      <NavCom />
      <br />
      <Paper shadow="xl" p="xl" withBorder>
        <div>
          <div>
            <Title
              order={5}
              style={{
                textAlign: "center",
                margin: "0 auto",
                color: "#15abff",
              }}
            >
              Inbox
            </Title>
            <br />
            <Table
              withTableBorder
              withColumnBorders
              highlightOnHover
              striped
              horizontalSpacing="sm"
              verticalSpacing="sm"
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Uploaded ID</Table.Th>
                  <Table.Th>Uploaded Date</Table.Th>
                  <Table.Th>Description</Table.Th>
                  <Table.Th>File</Table.Th>
                  <Table.Th>Status</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </div>
        </div>
      </Paper>
    </>
  );
}

export default Inbox;
