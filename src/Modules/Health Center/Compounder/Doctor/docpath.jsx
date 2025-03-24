import { useEffect, useState } from "react";
import { Box, Button, Paper, Table, Text, Title } from "@mantine/core";
import axios from "axios";
import NavCom from "../NavCom";
import Changenav from "./changenav";
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
        <Title order={3} style={{ color: "#15abff", textAlign: "center" }}>
          Doctor's List
        </Title>
        <Button
          onClick={handlePrint}
          style={{
            float: "right",
            backgroundColor: "#15abff",
            marginBottom: "10px",
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
            style={{ textAlign: "center" }}
          >
            <Table.Tr>
              <Table.Td>
                <Text fw={700}>Doctor</Text>
              </Table.Td>
              <Table.Td>
                <Text>{element.doctor_name}</Text>
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>
                <Text fw={700}>Specialization</Text>
              </Table.Td>
              <Table.Td>
                <Text>{element.specialization}</Text>
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>
                <Text fw={700}>Phone Number</Text>
              </Table.Td>
              <Table.Td>
                <Text style={{ marginRight: "10px" }}>
                  {element.doctor_phone}
                </Text>
              </Table.Td>
            </Table.Tr>

            <Box
              sx={{
                height: "2px",
                backgroundColor: "black",
                width: "100%",
                margin: "20px 0",
              }}
            />
          </Table>
        ))}
      </Paper>
    </>
  );
}
