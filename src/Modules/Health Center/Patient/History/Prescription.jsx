import {
  Alert,
  Button,
  Flex,
  Loader,
  Paper,
  Radio,
  Select,
  Table,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Check, X } from "@phosphor-icons/react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CustomBreadcrumbs from "../../../../components/Breadcrumbs";
import { studentRoute } from "../../../../routes/health_center";
import NavPatient from "../Navigation";

function CompPrescription() {
  const [prescrip, setPrescrip] = useState(null);
  const [notification, setNotification] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [printMode, setPrintMode] = useState("latest");
  const [loading, setLoading] = useState(true);
  const [followid, setFollowid] = useState(0);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const data = {
          rollNumber: "22bcs219",
          prescriptions: [
            {
              id: 0,
              followUpDate: "2024-11-15",
              doctor: "Dr. Challa",
              diseaseDetails: "Chronic Disease Details",
              tests: "trial test1",
              revoked_medicines: [
                {
                  medicine: "Medicine R",
                  quantity: "2",
                  days: "7",
                  times: "3",
                  date: "2024-11-20",
                },
                {
                  medicine: "Medicine Re",
                  quantity: "1",
                  days: "5",
                  times: "2",
                  date: "2024-11-18",
                },
              ],
              medicines: [
                {
                  medicine: "Medicine A",
                  quantity: "2",
                  days: "7",
                  times: "3",
                  date: "2024-11-20",
                },
                {
                  medicine: "Medicine B",
                  quantity: "1",
                  days: "5",
                  times: "2",
                  date: "2024-11-18",
                },
              ],
            },
            {
              id: 1,
              followUpDate: "2024-11-10",
              doctor: "Dr. Sahil",
              diseaseDetails: "Chronic Disease Details",
              tests: "trial test",
              revoked_medicines: [
                {
                  medicine: "Medicine Ra",
                  quantity: "2",
                  days: "7",
                  times: "3",
                  date: "2024-11-20",
                },
                {
                  medicine: "Medicine Rb",
                  quantity: "1",
                  days: "5",
                  times: "2",
                  date: "2024-11-18",
                },
              ],
              medicines: [
                {
                  medicine: "Medicine C",
                  quantity: "1",
                  days: "3",
                  times: "2",
                  date: "2024-11-14",
                },
              ],
            },
          ],
        };
        const response = await axios.post(
          studentRoute,
          {
            presc_id: id,
            get_prescription: 1,
          },
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          },
        );
        console.log(response);
        if (response.data.prescription.dependent_name === "SELF") {
          data.rollNumber = response.data.prescription.user_id;
        } else {
          data.rollNumber = response.data.prescription.dependent_name;
        }
        data.prescriptions = response.data.prescriptions;
        setPrescrip(data);
        setLoading(false);
        if (data?.prescriptions?.length > 0) {
          setSelectedDate(data.prescriptions[0].followUpDate);
          setFollowid(data.prescriptions[0].id);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Loader />
      </div>
    );
  }

  if ((prescrip === null || prescrip.length === 0) && !loading) {
    return (
      <div>
        <h2>No prescriptions found!</h2>
      </div>
    );
  }

  const generatePrescriptionTable = (prescription) => (
    <div key={prescription.id}>
      <Flex gap="lg" mb="md">
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <Text>Doctor</Text>
          <Text
            style={{
              color: "#15abff",
              textTransform: "capitalize",
              fontWeight: "bold",
            }}
          >
            {prescription.doctor}
          </Text>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Text>Details of Disease</Text>
          <Text
            style={{
              color: "#15abff",
              textTransform: "capitalize",
              fontWeight: "bold",
            }}
          >
            {prescription.diseaseDetails}
          </Text>
        </div>
      </Flex>
      <Title
        order={5}
        style={{
          textAlign: "center",
          color: "#15abff",
        }}
      >
        Revoked Medicine in Follow-up on {prescription.followUpDate}
      </Title>
      <Table
        withTableBorder
        withColumnBorders
        highlightOnHover
        striped
        style={{ textAlign: "center" }}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ textAlign: "center" }}>Medicine</Table.Th>
            <Table.Th style={{ textAlign: "center" }}>Quantity</Table.Th>
            <Table.Th style={{ textAlign: "center" }}>Days</Table.Th>
            <Table.Th style={{ textAlign: "center" }}>Times</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {prescription.revoked_medicines.map((med) => (
            <Table.Tr key={med.medicine}>
              <Table.Td>{med.medicine}</Table.Td>
              <Table.Td>{med.quantity}</Table.Td>
              <Table.Td>{med.days}</Table.Td>
              <Table.Td>{med.times}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      <Title
        order={5}
        style={{
          textAlign: "center",
          color: "#15abff",
        }}
      >
        Prescribed Medicine in Follow-up on {prescription.followUpDate}
      </Title>
      <Table
        withTableBorder
        withColumnBorders
        highlightOnHover
        striped
        style={{ textAlign: "center" }}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ textAlign: "center" }}>Medicine</Table.Th>
            <Table.Th style={{ textAlign: "center" }}>Quantity</Table.Th>
            <Table.Th style={{ textAlign: "center" }}>Days</Table.Th>
            <Table.Th style={{ textAlign: "center" }}>Times</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {prescription.medicines.map((med) => (
            <Table.Tr key={med.medicine}>
              <Table.Td>{med.medicine}</Table.Td>
              <Table.Td>{med.quantity}</Table.Td>
              <Table.Td>{med.days}</Table.Td>
              <Table.Td>{med.times}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Flex align="center" justify="space-between">
        <Textarea
          label="Text Suggested"
          placeholder="Write Here"
          style={{ width: "60%" }}
          autosize
        >
          {prescription.tests}
        </Textarea>

        <Button
          style={{
            backgroundColor: "#15abff",
            color: "white",
            padding: "5px 30px",
          }}
        >
          View Report
        </Button>
      </Flex>
    </div>
  );

  return (
    <>
      <CustomBreadcrumbs />
      <NavPatient />
      <br />
      <Paper shadow="xl" p="xl" withBorder>
        <h1 style={{ textAlign: "center", color: "#15abff" }}>
          {prescrip?.rollNumber}'s Prescription History
        </h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Radio.Group
              name="prescription-options"
              value={printMode}
              onChange={setPrintMode}
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                gap: "1rem",
              }}
            >
              <Radio value="latest" label="Print Latest Follow-up" />
              <Radio value="whole" label="Print Whole Prescription" />
            </Radio.Group>
          </div>

          {printMode === "latest" && prescrip?.prescriptions?.length > 0 && (
            <div style={{ width: "30%" }}>
              <Select
                value={`Follow-up on ${selectedDate} id ${followid}`}
                onChange={(value) => {
                  const [_, date, fid] = value.match(
                    /Follow-up on (.+) id (.+)/,
                  );
                  console.log(_);
                  console.log(date);
                  console.log(fid);
                  setSelectedDate(date);
                  setFollowid(fid);
                }}
                data={prescrip?.prescriptions?.map(
                  (prescription) =>
                    `Follow-up on ${prescription.followUpDate} id ${prescription.id}`,
                )}
                sort={(a, b) => {
                  return (
                    new Date(b.split(" on ")[1]) - new Date(a.split(" on ")[1])
                  );
                }}
              />
            </div>
          )}

          <Button
            style={{
              backgroundColor: "#15abff",
              color: "white",
              padding: "10px 16px",
              cursor: "pointer",
            }}
            onClick={() => window.print()}
          >
            Print
          </Button>
        </div>

        <br />

        <div>
          {printMode === "latest"
            ? prescrip?.prescriptions
                ?.filter((prescription) => prescription.id === Number(followid))
                .map((prescription) => generatePrescriptionTable(prescription))
            : prescrip?.prescriptions?.map((prescription) =>
                generatePrescriptionTable(prescription),
              )}
        </div>
      </Paper>
      {notification && (
        <Alert
          icon={
            notification.type === "success" ? (
              <Check size={16} />
            ) : (
              <X size={16} />
            )
          }
          title={notification.type === "success" ? "Success" : "Error"}
          color={notification.type === "success" ? "green" : "red"}
          withCloseButton
          onClose={() => setNotification(null)}
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            width: "auto",
          }}
        >
          <Text>{notification.message}</Text>
        </Alert>
      )}
    </>
  );
}

export default CompPrescription;
