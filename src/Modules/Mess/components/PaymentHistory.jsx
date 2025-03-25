import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
import { Table, Text, Container, Paper, Title, Flex } from "@mantine/core";
import { paymentRoute } from "../routes";

function PaymentHistory() {
  // const roleno = useSelector((state) => state.user.roll_no); // Use Redux state to get roll number
  const [paymentData, setPaymentData] = useState([]); // Store payment data
  const authToken = localStorage.getItem("authToken"); // Authorization token

  // Fetch payment data from API
  useEffect(() => {
    fetch(paymentRoute, {
      method: "GET",
      headers: {
        Authorization: `Token ${authToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Map API response to the required format
        const mappedData = data.payload.map((payment) => ({
          paymentDate: payment.payment_date,
          amount: payment.amount_paid,
          month: payment.payment_month,
          year: payment.payment_year,
        }));
        setPaymentData(mappedData);
      })
      .catch((error) => {
        console.error("Error fetching payment data:", error);
      });
  }, [authToken]);

  // Render table header
  const renderHeader = () => (
    <Table.Tr>
      <Table.Th>
        <Flex align="center" justify="center" h="100%">
          Payment Date
        </Flex>
      </Table.Th>
      <Table.Th>
        <Flex align="center" justify="center" h="100%">
          Amount (₹)
        </Flex>
      </Table.Th>
      <Table.Th>
        <Flex align="center" justify="center" h="100%">
          Month
        </Flex>
      </Table.Th>
      <Table.Th>
        <Flex align="center" justify="center" h="100%">
          Year
        </Flex>
      </Table.Th>
    </Table.Tr>
  );

  // Render table rows dynamically from API data
  const renderRows = () =>
    paymentData.map((row, index) => (
      <Table.Tr key={index}>
        <Table.Td align="center" p={12}>
          {row.paymentDate}
        </Table.Td>
        <Table.Td align="center" p={12}>
          ₹{row.amount}
        </Table.Td>
        <Table.Td align="center" p={12}>
          {row.month}
        </Table.Td>
        <Table.Td align="center" p={12}>
          {row.year}
        </Table.Td>
      </Table.Tr>
    ));

  // Calculate total payments
  const totalPayments = paymentData.reduce(
    (total, item) => total + item.amount,
    0,
  );

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
        <Title order={2} align="center" mb="lg" style={{ color: "#1c7ed6" }}>
          Payment History
        </Title>

        {/* Table */}
        <Table striped highlightOnHover withBorder withColumnBorders>
          <Table.Thead>{renderHeader()}</Table.Thead>
          <Table.Tbody>{renderRows()}</Table.Tbody>
        </Table>

        <Flex direction="column" mt="lg">
          <Text size="lg" weight={700} align="center" mt="md">
            Total Payments: ₹{totalPayments}
          </Text>
        </Flex>
      </Paper>
    </Container>
  );
}

export default PaymentHistory;
