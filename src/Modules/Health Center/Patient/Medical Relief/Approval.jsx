import { Paper, Table, Title, Loader } from "@mantine/core";
import { useEffect, useState } from "react";
import { Download } from "@phosphor-icons/react";
import { useSelector } from "react-redux";
import axios from "axios";
import { studentRoute } from "../../../../routes/health_center";
import NavPatient from "../Navigation";
import MedicalNavBar from "./medicalPath";
import CustomBreadcrumbs from "../../../../components/Breadcrumbs";

function Approval() {
  const [elements, setMedical] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = useSelector((state) => state.user.role);

  const get_relief = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        studentRoute,
        { get_relief: 1, selected_role: role },
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
    } finally {
      setLoading(false);
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
      <Table.Td>{element.approval_date}</Table.Td>
      <Table.Td>{element.upload_date}</Table.Td>
      <Table.Td>{element.desc}</Table.Td>
      <Table.Td>
        <Download size={20} /> {element.file}
      </Table.Td>
      <Table.Td
        style={{
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
      <NavPatient />
      <MedicalNavBar />
      <br />
      <Paper shadow="xl" p="xl" withBorder>
        <div>
          <div>
            <Title
              order={3}
              style={{
                textAlign: "center",
                margin: "0 auto",
                color: "#15abff",
              }}
            >
              Approval Status
            </Title>
            <br />
            {loading ? ( // Display loader while loading
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "200px",
                }}
              >
                <Loader color="blue" size="lg" />
              </div>
            ) : (
              <Table
                withTableBorder
                withColumnBorders
                highlightOnHover
                striped
                horizontalSpacing="sm"
                verticalSpacing="sm"
                style={{
                  textAlign: "center",
                }}
              >
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Uploaded Date</Table.Th>
                    <Table.Th>Approval Date</Table.Th>
                    <Table.Th>Description</Table.Th>
                    <Table.Th>File</Table.Th>
                    <Table.Th>Status</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            )}
          </div>
        </div>
      </Paper>
    </>
  );
}

export default Approval;
