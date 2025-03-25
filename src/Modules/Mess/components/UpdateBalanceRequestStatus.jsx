import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Title,
  Space,
  Box,
  Table,
  Flex,
} from "@mantine/core";
import axios from "axios";
import { useSelector } from "react-redux";
import { host } from "../../../routes/globalRoutes";
import { updateBalanceRequestRoute } from "../routes";

const fetchUpdateBalanceRequestsStatus = async (studentId, token) => {
  try {
    const response = await axios.get(
      `${updateBalanceRequestRoute}?student_id=${studentId}`,
      {
        headers: { Authorization: `Token ${token}` },
      },
    );
    return response.data.payload;
  } catch (error) {
    console.error("Error fetching update payment request status:", error);
    throw error;
  }
};

function UpdateBalanceRequest() {
  const [balanceRequests, setBalanceRequests] = useState([]);
  const studentId = useSelector((state) => state.user.roll_no);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUpdateBalanceRequestsStatus(studentId, token);
        setBalanceRequests(data);
        console.log("Data:", data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [studentId, token]);
  const renderHeader = () => (
    <Table.Tr>
      <Table.Th>
        <Flex align="center" justify="center" h="100%">
          Transaction Number
        </Flex>
      </Table.Th>
      <Table.Th>
        <Flex align="center" justify="center" h="100%">
          Image
        </Flex>
      </Table.Th>
      <Table.Th>
        <Flex align="center" justify="center" h="100%">
          Amount
        </Flex>
      </Table.Th>
      <Table.Th>
        <Flex align="center" justify="center" h="100%">
          Remark
        </Flex>
      </Table.Th>
      <Table.Th>
        <Flex align="center" justify="center" h="100%">
          Status
        </Flex>
      </Table.Th>
    </Table.Tr>
  );

  const renderRows = () =>
    balanceRequests.map((item, index) => (
      <Table.Tr key={index} style={{ height: "60px" }}>
        {" "}
        {/* Increase row height */}
        <Table.Td align="center" p={12}>
          {" "}
          {/* Increase cell padding */}
          {item.Txn_no}
        </Table.Td>
        <Table.Td align="center" p={12}>
          <a
            href={`${host}${item.img}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Image
          </a>
        </Table.Td>
        <Table.Td align="center" p={12}>
          {item.amount}
        </Table.Td>
        <Table.Td align="center" p={12}>
          {item.update_remark}
        </Table.Td>
        <Table.Td align="center" p={12}>
          <Box
            display="inline-block"
            p={8}
            fz={14}
            fw={600}
            bg={item.status === "accept" ? "#40C057" : "transparent"}
            bd={
              item.status === "accept"
                ? "1.5px solid #40C057"
                : item.status === "pending"
                  ? "1.5px solid yellow"
                  : "1.5px solid red"
            }
            c={
              item.status === "accept"
                ? "white"
                : item.status === "pending"
                  ? "yellow"
                  : "red"
            }
            style={{ borderRadius: "4px" }}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}{" "}
          </Box>
        </Table.Td>
      </Table.Tr>
    ));

  return (
    <Container
      size="xl"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "25px",
      }}
    >
      <Paper shadow="md" radius="md" p="xl" withBorder miw="75rem">
        <Title order={2} align="center" mb="lg" style={{ color: "#1c7ed6" }}>
          Update Balance Request
        </Title>

        {/* FusionTable */}
        <Table striped highlightOnHover withBorder withColumnBorders>
          <Table.Thead>{renderHeader()}</Table.Thead>
          <Table.Tbody>{renderRows()}</Table.Tbody>
        </Table>
      </Paper>
      <Space h="xl" />
    </Container>
  );
}

export default UpdateBalanceRequest;
