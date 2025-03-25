import React, { useState } from "react";
import {
  TextInput,
  Button,
  Container,
  Title,
  Paper,
  Group,
  Select,
  Table,
  Space,
  Modal,
} from "@mantine/core"; // Mantine UI components
import { MagnifyingGlass, Money, Receipt } from "@phosphor-icons/react"; // Phosphor icons

// Dummy Data for students
const studentsData = [
  {
    id: 1,
    first_name: "Karthik",
    last_name: "Padarthi",
    student_id: "22BCS177",
    programme: "B.Tech",
    status: "Registered",
    balance: 5000,
    mess_option: "Mess 1",
  },
  {
    id: 2,
    first_name: "Utkarsh",
    last_name: "Purohit",
    student_id: "22BCS260",
    programme: "M.Tech",
    status: "Deregistered",
    balance: 2000,
    mess_option: "Mess 2",
  },
  {
    id: 3,
    first_name: "Swaran",
    last_name: "Tej",
    student_id: "22BCS263",
    programme: "B.Tech",
    status: "Registered",
    balance: 3000,
    mess_option: "Mess 1",
  },
  // Add more student objects as needed
];

// Dummy Data for bills
const billsData = [
  {
    month: "January",
    year: 2024,
    baseAmount: 3000,
    rebateCount: 1,
    rebateAmount: 500,
    yourAmount: 2500,
  },
  {
    month: "February",
    year: 2024,
    baseAmount: 3000,
    rebateCount: 0,
    rebateAmount: 0,
    yourAmount: 3000,
  },
  {
    month: "March",
    year: 2024,
    baseAmount: 3000,
    rebateCount: 2,
    rebateAmount: 1000,
    yourAmount: 2000,
  },
  // Add more bill objects as needed
];

// Dummy Data for payments
const paymentData = [
  { month: "January", year: "2024", amountPaid: 3000 },
  { month: "February", year: "2024", amountPaid: 3000 },
  { month: "March", year: "2024", amountPaid: 2000 },
  // Add more payment objects as needed
];

function UpdateStudentBill() {
  const [filteredStudents, setFilteredStudents] = useState(studentsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [programFilter, setProgramFilter] = useState("All");
  const [messFilter, setMessFilter] = useState("All");

  const [openedBillModal, setOpenedBillModal] = useState(false);
  const [openedPaymentModal, setOpenedPaymentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Function to handle filtering
  const handleFilter = () => {
    let filtered = studentsData;

    // Check if search query is present
    if (searchQuery) {
      // Filter by search query (roll number)
      filtered = filtered.filter((student) =>
        student.student_id.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    } else {
      // Filter by status if no search query is present
      if (statusFilter !== "All") {
        filtered = filtered.filter(
          (student) => student.status === statusFilter,
        );
      }

      // Filter by program
      if (programFilter !== "All") {
        filtered = filtered.filter(
          (student) => student.programme === programFilter,
        );
      }

      // Filter by mess option
      if (messFilter !== "All") {
        filtered = filtered.filter(
          (student) => student.mess_option === messFilter,
        );
      }
    }

    setFilteredStudents(filtered);
  };

  // Open Bill Modal
  const handleViewBill = (student) => {
    setSelectedStudent(student);
    setOpenedBillModal(true);
  };

  // Open Payment Modal
  const handleViewPayments = (student) => {
    setSelectedStudent(student);
    setOpenedPaymentModal(true);
  };

  const centeredCellStyle = {
    textAlign: "center",
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        marginTop: "0px",
      }}
    >
      <Container
        size="lg"
        miw="75rem"
        style={{
          maxWidth: "1250px",
          marginTop: "-180px", // Reduce the margin top of the container
        }}
      >
        <Paper
          shadow="md"
          radius="md"
          p="xl"
          withBorder
          style={{ padding: "30px" }}
        >
          <Title order={2} align="center" mb="lg" style={{ color: "#1c7ed6" }}>
            Student Bill Management
          </Title>

          <form>
            {/* Search section */}
            <TextInput
              label="Search by Roll Number"
              placeholder="Enter Roll Number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              radius="md"
              size="md"
              mb="lg"
              icon={<MagnifyingGlass size={18} />}
            />

            <Space h="md" />

            {/* Filter section */}
            <Group grow mb="lg">
              <Select
                label="Filter by Status"
                placeholder="Select Status"
                value={statusFilter}
                onChange={(value) => setStatusFilter(value)}
                data={["Registered", "Deregistered", "All"]}
                radius="md"
                size="md"
              />
              <Select
                label="Filter by Program"
                placeholder="Select Program"
                value={programFilter}
                onChange={(value) => setProgramFilter(value)}
                data={["B.Tech", "M.Tech", "All"]}
                radius="md"
                size="md"
              />
              <Select
                label="Filter by Mess"
                placeholder="Select Mess"
                value={messFilter}
                onChange={(value) => setMessFilter(value)}
                data={["Mess 1", "Mess 2", "All"]}
                radius="md"
                size="md"
              />
            </Group>

            <Button
              fullWidth
              size="md"
              radius="md"
              color="blue"
              onClick={handleFilter}
            >
              Apply Filters
            </Button>

            <Space h="lg" />

            {/* Students Table */}
            <Table
              striped
              highlightOnHover
              withBorder
              style={{
                border: "1px solid #e0e0e0", // Border for the table
                borderRadius: "8px", // Rounded corners
              }}
            >
              <thead style={{ backgroundColor: "#f7f7f7" }}>
                <tr>
                  <th style={centeredCellStyle}>Name</th>
                  <th style={centeredCellStyle}>Roll No</th>
                  <th style={centeredCellStyle}>Program</th>
                  <th style={centeredCellStyle}>Status</th>
                  <th style={centeredCellStyle}>Balance</th>
                  <th style={centeredCellStyle}>Mess</th>
                  <th style={centeredCellStyle}>View Bill</th>
                  <th style={centeredCellStyle}>View Payments</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr
                    key={student.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#fafafa" : "white",
                    }}
                  >
                    <td style={centeredCellStyle}>
                      {student.first_name} {student.last_name}
                    </td>
                    <td style={centeredCellStyle}>{student.student_id}</td>
                    <td style={centeredCellStyle}>{student.programme}</td>
                    <td style={centeredCellStyle}>{student.status}</td>
                    <td style={centeredCellStyle}>{student.balance}</td>
                    <td style={centeredCellStyle}>{student.mess_option}</td>
                    <td style={centeredCellStyle}>
                      <Button
                        variant="outline"
                        size="xs"
                        radius="md"
                        onClick={() => handleViewBill(student)}
                        leftIcon={<Receipt size={16} />}
                      >
                        View Bills
                      </Button>
                    </td>
                    <td style={centeredCellStyle}>
                      <Button
                        variant="outline"
                        size="xs"
                        radius="md"
                        onClick={() => handleViewPayments(student)}
                        leftIcon={<Money size={16} />}
                      >
                        View Payments
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </form>
        </Paper>

        {/* Bill Modal */}
        <Modal
          opened={openedBillModal}
          onClose={() => setOpenedBillModal(false)}
          title={`Bills for ${selectedStudent?.first_name} ${selectedStudent?.last_name}`}
          centered
          size="lg"
        >
          <Table striped highlightOnHover>
            <thead>
              <tr>
                <th>Month</th>
                <th>Year</th>
                <th>Base Amount</th>
                <th>Rebate Count</th>
                <th>Rebate Amount</th>
                <th>Your Amount</th>
              </tr>
            </thead>
            <tbody>
              {billsData.map((bill, index) => (
                <tr key={index}>
                  <td>{bill.month}</td>
                  <td>{bill.year}</td>
                  <td>{bill.baseAmount}</td>
                  <td>{bill.rebateCount}</td>
                  <td>{bill.rebateAmount}</td>
                  <td>{bill.yourAmount}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal>

        {/* Payment Modal */}
        <Modal
          opened={openedPaymentModal}
          onClose={() => setOpenedPaymentModal(false)}
          title={`Payments for ${selectedStudent?.first_name} ${selectedStudent?.last_name}`}
          centered
          size="lg"
        >
          <Table striped highlightOnHover>
            <thead>
              <tr>
                <th>Month</th>
                <th>Year</th>
                <th>Amount Paid</th>
              </tr>
            </thead>
            <tbody>
              {paymentData.map((payment, index) => (
                <tr key={index}>
                  <td>{payment.month}</td>
                  <td>{payment.year}</td>
                  <td>{payment.amountPaid}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal>
      </Container>
    </div>
  );
}

export default UpdateStudentBill;
