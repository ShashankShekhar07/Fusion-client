import { useEffect, useState } from "react";
import { Button, Paper, Table, Text, Title } from "@mantine/core";
import axios from "axios";
import NavCom from "../Navigation";
import Changenav from "./schedulePath";
import CustomBreadcrumbs from "../../../../components/Breadcrumbs";
import { compounderRoute } from "../../../../routes/health_center";

export default function PathDoc() {
  const handlePrint = () => {
    window.print();
  };

  // eslint-disable-next-line no-unused-vars
  const [pathologists, setPathologists] = useState([]);
  const fetchPathologists = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        compounderRoute,
        { get_pathologists: 1 },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      console.log(response);
      setPathologists(response.data.pathologists);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPathologists();
  }, []);

  return (
    <>
      <CustomBreadcrumbs />
      <NavCom />
      <Changenav />
      <br />
      <Paper shadow="xl" p="xl" withBorder>
        <Title order={3} style={{ color: "#15abff", textAlign: "center" }}>
          Pathologist's List
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

        {pathologists.map((element, index) => (
          <Table
            mt="lg"
            mb="lg"
            key={index}
            withBorder
            withColumnBorders
            style={{ border: "1px solid #15abff" }}
          >
            <Table.Tr>
              <Table.Td style={{ backgroundColor: "#f0f0f0" }}>
                <Text fw={700}>Pathologist</Text>
              </Table.Td>
              <Table.Td>
                <Text>{element.pathologist_name}</Text>
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
                <Text>{element.pathologist_phone}</Text>
              </Table.Td>
            </Table.Tr>
          </Table>
        ))}
      </Paper>
    </>
  );
}
