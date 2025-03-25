import { useEffect, useState } from "react";
import { Button, Paper, Table, Text, Title } from "@mantine/core";
import axios from "axios";
import NavCom from "../Navigation";
import Changenav from "./schedulePath";
import CustomBreadcrumbs from "../../../../components/Breadcrumbs";
import { compounderRoute } from "../../../../routes/health_center";

export default function DoctorPath() {
  const handlePrint = () => {
    window.print();
  };

  const [doctors, setDoctors] = useState([]);

  const fetchDoctors = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        compounderRoute,
        { get_doctors: 1 },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      console.log(response);
      setDoctors(response.data.doctors);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <>
      <CustomBreadcrumbs />
      <NavCom />
      <Changenav />
      <br />
      <Paper shadow="xl" p="xl" withBorder>
        <Title
          order={3}
          style={{
            color: "#15abff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Doctor's List
        </Title>
        <Button
          onClick={handlePrint}
          style={{
            float: "right",
            backgroundColor: "#15abff",
            margin: "0.5rem 0",
          }}
        >
          Download
        </Button>
        {doctors.map((element, index) => (
          <Table
            mt="lg"
            mb="lg"
            key={index}
            withBorder
            withColumnBorders
            withRowBorders
            striped
            style={{
              border: "1px solid #15abff",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <Table.Tr>
              <Table.Td style={{ backgroundColor: "#f0f0f0" }}>
                <Text fw={700}>Doctor</Text>
              </Table.Td>
              <Table.Td>
                <Text>{element.doctor_name}</Text>
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td style={{ backgroundColor: "#f0f0f0" }}>
                <Text fw={700}>Specialization</Text>
              </Table.Td>
              <Table.Td>
                <Text>{element.specialization}</Text>
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td style={{ backgroundColor: "#f0f0f0" }}>
                <Text fw={700}>Phone Number</Text>
              </Table.Td>
              <Table.Td>
                <Text>{element.doctor_phone}</Text>
              </Table.Td>
            </Table.Tr>
          </Table>
        ))}
      </Paper>
    </>
  );
}
