import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  Text,
  Button,
  Group,
  Container,
  Paper,
  Title,
  Flex,
} from "@mantine/core";
import { DownloadSimple } from "@phosphor-icons/react";
import { viewBillsRoute, getMessStatusRoute } from "../routes";

function MessBilling() {
  const rollNo = useSelector((state) => state.user.roll_no); // Use Redux state to get roll number
  const [billData, setBillData] = useState([]); // Store fetched bill data
  const [totalBalance, setTotalBalance] = useState(0); // Track total remaining balance
  const [messStatus, setMessStatus] = useState(""); // Track current mess status
  const authToken = localStorage.getItem("authToken"); // Authorization token

  // Fetch payment data from API
  useEffect(() => {
    fetch(viewBillsRoute, {
      method: "POST",
      headers: {
        Authorization: `Token ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        student_id: rollNo, // Send roll number as student_id
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.payload) {
          // Map API response to the required format
          const mappedData = data.payload.map((bill) => ({
            month: `${bill.month}-${bill.year}`,
            baseAmount: bill.amount,
            rebateCount: bill.rebate_count,
            rebateAmount: bill.rebate_amount,
            monthlyBill: bill.total_bill,
          }));
          setBillData(mappedData);
        }
      })
      .catch((error) => {
        console.error("Error fetching payment data:", error);
      });
  }, [authToken, rollNo]);

  useEffect(() => {
    // Fetch registration status
    const fetchRegistrationStatus = async () => {
      try {
        const response = await fetch(getMessStatusRoute, {
          method: "GET",
          headers: {
            Authorization: `Token ${authToken}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setMessStatus(data.payload.current_mess_status);
        setTotalBalance(data.payload.current_rem_balance);
      } catch (error) {
        console.error("Error fetching registration status:", error);
      }
    };
    if (rollNo) {
      fetchRegistrationStatus();
    }
  });

  const renderHeader = () => (
    <Table.Tr>
      <Table.Th>
        <Flex align="center" justify="center" h="100%">
          Month
        </Flex>
      </Table.Th>
      <Table.Th>
        <Flex align="center" justify="center" h="100%">
          Monthly Base Amount (₹)
        </Flex>
      </Table.Th>
      <Table.Th>
        <Flex align="center" justify="center" h="100%">
          Rebate Count
        </Flex>
      </Table.Th>
      <Table.Th>
        <Flex align="center" justify="center" h="100%">
          Rebate Amount (₹)
        </Flex>
      </Table.Th>
      <Table.Th>
        <Flex align="center" justify="center" h="100%">
          Your Monthly Bill (₹)
        </Flex>
      </Table.Th>
    </Table.Tr>
  );

  const renderRows = () =>
    billData.map((row, index) => (
      <Table.Tr key={index}>
        <Table.Td align="center" p={12}>
          {row.month}
        </Table.Td>
        <Table.Td align="center" p={12}>
          {row.baseAmount}
        </Table.Td>
        <Table.Td align="center" p={12}>
          {row.rebateCount}
        </Table.Td>
        <Table.Td align="center" p={12}>
          {row.rebateAmount}
        </Table.Td>
        <Table.Td align="center" p={12}>
          {row.monthlyBill}
        </Table.Td>
      </Table.Tr>
    ));

  return (
    <Container
      size="lg"
      style={{
        display: "flex",
        justifyContent: "center", // Centers the form horizontally
        marginTop: "40px",
      }}
    >
      <Paper
        shadow="md"
        radius="md"
        p="xl"
        withBorder
        style={{
          width: "100%",
          minWidth: "75rem", // Set the min-width to 75rem
          padding: "2rem", // Add padding for better spacing
        }}
      >
        <Title order={2} align="center" mb="x1" style={{ color: "#1c7ed6" }}>
          View Bill
        </Title>

        {/* Table */}
        <Table striped highlightOnHover withBorder withColumnBorders>
          <Table.Thead>{renderHeader()}</Table.Thead>
          <Table.Tbody>{renderRows()}</Table.Tbody>
        </Table>

        <Flex direction="column" mt="lg">
          <Text size="lg" weight={700} mb="xs">
            Total Remaining Balance: ₹{totalBalance}
          </Text>
          <Text size="lg" weight={600}>
            Current Mess Status: {messStatus}
          </Text>
        </Flex>

        <Group position="right" mt="md">
          <Button
            variant="filled"
            color="blue"
            leftIcon={<DownloadSimple size={16} />}
          >
            Download
          </Button>
        </Group>
      </Paper>
    </Container>
  );
}

export default MessBilling;
