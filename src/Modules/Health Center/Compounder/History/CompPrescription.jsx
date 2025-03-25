import {
  Alert,
  Autocomplete,
  Button,
  Checkbox,
  Flex,
  Grid,
  Input,
  Loader,
  Paper,
  Radio,
  Select,
  Table,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Check, X } from "@phosphor-icons/react";
import { useParams } from "react-router-dom";
import { useForm } from "@mantine/form";
import axios from "axios";
import NavCom from "../NavCom";
import CustomBreadcrumbs from "../../../../components/Breadcrumbs";
import {
  compounderRoute,
  GetfileRoute,
} from "../../../../routes/health_center";

// function getDummyData(medicineName) {
//   const dummyDatabase = {
//     dolo: {
//       manufacturerName: "Sahil",
//       packSize: 2,
//       stock: 100,
//       expiryDate: "2025-01-01",
//       stockQuantity: 450,
//     },
//     paracetamol: {
//       manufacturerName: "ABC Pharma",
//       packSize: 10,
//       stock: 200,
//       expiryDate: "2024-12-01",
//       stockQuantity: 1000,
//     },
//   };

//   return dummyDatabase[medicineName.toLowerCase()] || null;
// }

function CompPrescription() {
  const [prescrip, setPrescrip] = useState(null);
  const [notification, setNotification] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [printMode, setPrintMode] = useState("latest");
  const [showFollowupForm, setShowFollowupForm] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [medicineSearch, setMedicineSearch] = useState("");
  const [doctors, setDoctor] = useState([]);
  const [doctorName, setDoctorName] = useState("");
  const [diseaseDetails, setdiseaseDetails] = useState("");
  const [entries, setEntries] = useState([]);
  const [medicine, setMedicine] = useState("");
  const [quantity, setQuantity] = useState("");
  const [days, setDays] = useState("");
  const [timesPerDay, setTimesPerDay] = useState("");
  const [stockQuantity, setstockQuantity] = useState(0);
  const [loading, setLoading] = useState(true);
  const [manuname, setmanu] = useState("");
  const [packsize, setpack] = useState(0);
  const [expiry, setexpiry] = useState("");
  const [stock, setStock] = useState("");
  const [allstock, setallstock] = useState([]);
  const [similar, setsimilar] = useState([]);
  const [medicineName, setMedicineName] = useState([]);
  const [selectstock, setselectstock] = useState([]);
  const [RevokeData, setRevokeData] = useState([
    { id: 1, medicine: "Paracetamol", quantity: "10", days: "5", times: "2" },
  ]);
  const [testsSuggested, setTestsSuggested] = useState("");
  const [revoke, setRevoke] = useState([]);
  const [followid, setFollowid] = useState(0);
  const [reportfile, setFile] = useState(null);

  const handelcheck = async (event) => {
    const { value, checked } = event.target;

    setRevoke((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value),
    );
    console.log(revoke);
  };
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
      setDoctor(response.data.doctors);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const form = useForm({
    initialValues: {
      doctor: "Dr. John Doe",
      diseaseDetails: "Chronic Disease Details",
      testsSuggested: "",
      report: null,
    },
  });

  const medicineData = [
    {
      id: 11,
      name: "Challa",
      manufacturer: "Pharma A",
      packSize: "10mg",
      stock: 100,
      expiry: "2025-02-07",
    },
    {
      id: 12,
      name: "sahil_varma",
      manufacturer: "Pharma B",
      packSize: "20mg",
      stock: 50,
      expiry: "2025-02-23",
    },
  ];
  const { id } = useParams();

  const handleAddMedicine = () => {
    if (!showFollowupForm) {
      setShowFollowupForm(true);
      return;
    }

    const selectedMed = medicineData.find((m) => m.name === medicineSearch);
    if (selectedMed) {
      setMedicines([
        ...medicines,
        {
          id: selectedMed.id,
          name: selectedMed.name,
          quantity: 1,
          days: 1,
          times: 1,
          expiry: selectedMed.expiry,
          manufacturer: selectedMed.manufacturer,
          packSize: selectedMed.packSize,
          stock: selectedMed.stock,
          revoked: false,
        },
      ]);
      setMedicineSearch("");
    }
  };

  const handleSubmitFollowup = async () => {
    const token = localStorage.getItem("authToken");
    try {
      let fileBase64 = null;
      if (reportfile !== null) {
        const fileArrayBuffer = await reportfile.arrayBuffer();
        fileBase64 = btoa(
          new Uint8Array(fileArrayBuffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            "",
          ),
        );
      }
      const response = await axios.post(
        compounderRoute,
        {
          file: fileBase64,
          pre_id: id,
          doctor: doctorName,
          details: diseaseDetails,
          presc_followup: 1,
          pre_medicine: entries,
          tests: testsSuggested,
          revoked: revoke,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      console.log(response);
      if (response.data.status === -1) {
        alert("No patient found");
      } else if (response.data.status === 0) {
        alert("Prescription Failed!");
      } else {
        alert("Followup Added Successfully");
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    console.log("CHANGE");
    console.log(reportfile);
  };

  useEffect(() => {
    if (reportfile) {
      console.log("State Updated:", reportfile);
    }
  }, [reportfile]);

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
              file_id: 0,
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
              file_id: 0,
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
          compounderRoute,
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
        setLoading(false);
        setPrescrip(data);
        setRevokeData(response.data.not_revoked);
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
        <h2>Prescription not available!</h2>
      </div>
    );
  }

  const handelgetfile = (fid) => {
    console.log("clicked");
    const url = `${GetfileRoute}${fid}`;
    console.log(url);
    window.open(url, "_blank");
  };

  // const filteredPrescription = prescrip?.prescriptions?.find(
  //   (prescription) => prescription.id === followid,
  // );

  const handleAddEntry = () => {
    if (medicine && quantity && days && timesPerDay) {
      if (stockQuantity >= quantity || stock === "N/A at moment") {
        const newEntry = {
          brand_name: medicine,
          quantity,
          Days: days,
          Times: timesPerDay,
          astock: stock,
        };
        setEntries([...entries, newEntry]);

        // const data = getDummyData(medicine);
        // setDummyData(data);

        setMedicine("");
        setQuantity("");
        setDays("");
        setTimesPerDay("");
        setstockQuantity(0);
        setexpiry("");
        setmanu("");
        setpack("");
        console.log(entries);
        setNotification({
          type: "success",
          message: "Your medicine entry has been successfully added.",
        });
      } else {
        alert("Stock is not enough");
      }
    } else {
      setNotification({
        type: "error",
        message: "Please fill in all fields before adding an entry.",
      });
    }

    setTimeout(() => setNotification(null), 5000);
  };

  const fetchMedicine = async (med) => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        compounderRoute,
        {
          medicine_name_for_stock: med,
          get_stock: 1,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      console.log(response);
      const arr = [];
      response.data.sim.forEach((value) => {
        const tp = `${value.brand_name},${value.id}`;
        arr.push(tp);
      });
      setsimilar(response.data.sim);
      setMedicineName(arr);
      if (response.data.val.length > 0) {
        const arr1 = [];
        response.data.val.forEach((value) => {
          const tp = `${value.brand_name},${value.id}`;
          arr1.push(tp);
        });
        setselectstock(arr1);
        setallstock(response.data.val);
        console.log(response);
      } else {
        setselectstock(["N/A at moment"]);
        setallstock([]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handlebrand = (event) => {
    console.log(event);
    setMedicine(event);
    let fl = 1;
    similar.forEach((item) => {
      const tp = `${item.brand_name},${item.id}`;
      if (tp === event) {
        fl = 0;
        setmanu(item.manufacturer_name);
        setpack(item.pack_size_label);
        // setSelected(item.id);
        fetchMedicine(tp);
      }
    });
    if (fl) {
      fetchMedicine(event);
    }
  };

  const handleDeleteEntry = (index) => {
    const newEntries = entries.filter((_, i) => i !== index);
    setEntries(newEntries);
    setNotification({
      type: "success",
      message: "Successfully Deleted",
    });

    setTimeout(() => setNotification(null), 5000);
  };

  const handelstock = (event) => {
    setStock(event);
    setexpiry("");
    setstockQuantity(0);
    allstock.forEach((item) => {
      const tp = `${item.brand_name},${item.id}`;
      if (tp === event) {
        setexpiry(item.expiry);
        setstockQuantity(item.quantity);
      }
    });
  };

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

        {prescription.file_id !== 0 ? (
          <Button
            style={{
              backgroundColor: "#15abff",
              color: "white",
              padding: "5px 30px",
            }}
            onClick={() => handelgetfile(prescription.file_id)}
          >
            View Report
          </Button>
        ) : null}
      </Flex>
    </div>
  );

  return (
    <>
      <CustomBreadcrumbs />
      <NavCom />
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

        <Flex gap="lg" align="center">
          <Button
            style={{
              marginTop: "1.4rem",
              backgroundColor: "#15abff",
            }}
            onClick={handleAddMedicine}
          >
            Add Follow-up
          </Button>
        </Flex>
        <br />

        {showFollowupForm && (
          <Paper p="md" mt="md">
            <form onSubmit={form.onSubmit(handleSubmitFollowup)}>
              <Grid>
                <Flex direction="column">
                  <Flex gap="md" mb="lg" align="center" justify="center">
                    <Select
                      name="doctor"
                      label="Doctor"
                      placeholder="--Select--"
                      value={doctorName}
                      onChange={(e) => setDoctorName(e)}
                      data={doctors.map((doc) => doc.doctor_name)}
                    />

                    <Textarea
                      type="text"
                      label="Details of Disease"
                      name="diseaseDetails"
                      placeholder="Input Text"
                      value={diseaseDetails}
                      onChange={(e) => setdiseaseDetails(e.target.value)}
                      autosize
                      style={{ width: "100%" }}
                    />
                  </Flex>

                  <Flex direction="row" wrap="wrap">
                    <Title
                      order={5}
                      style={{
                        textAlign: "center",
                        color: "#15abff",
                        display: "flex",
                        margin: "auto",
                      }}
                    >
                      Revoked Medicine
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
                          <Table.Th style={{ textAlign: "center" }}>
                            ID
                          </Table.Th>
                          <Table.Th style={{ textAlign: "center" }}>
                            Medicine
                          </Table.Th>
                          <Table.Th style={{ textAlign: "center" }}>
                            Quantity
                          </Table.Th>
                          <Table.Th style={{ textAlign: "center" }}>
                            Days
                          </Table.Th>
                          <Table.Th style={{ textAlign: "center" }}>
                            Times
                          </Table.Th>
                          <Table.Th style={{ textAlign: "center" }}>
                            Revoke
                          </Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {RevokeData.map((med) => (
                          <Table.Tr key={med.medicine}>
                            <Table.Td>{med.id}</Table.Td>
                            <Table.Td>{med.medicine}</Table.Td>
                            <Table.Td>{med.quantity}</Table.Td>
                            <Table.Td>{med.days}</Table.Td>
                            <Table.Td>{med.times}</Table.Td>
                            <Table.Td>
                              <Checkbox value={med.id} onChange={handelcheck} />
                            </Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  </Flex>
                </Flex>

                <div style={{ display: "flex", marginBottom: "1rem" }}>
                  <div style={{ marginRight: "5px", flex: 1 }}>
                    <Title
                      order={5}
                      style={{
                        textAlign: "center",
                        margin: "0 auto",
                        color: "#15abff",
                      }}
                    >
                      Recommend Medicine
                    </Title>

                    <Table
                      highlightOnHover
                      withTableBorder
                      withColumnBorders
                      striped
                    >
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Medicine</Table.Th>
                          <Table.Th>Quantity</Table.Th>
                          <Table.Th>No. of Days</Table.Th>
                          <Table.Th>Times per Day</Table.Th>
                          <Table.Th>Stocks</Table.Th>
                          <Table.Th>Actions</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {entries.map((entry, index) => (
                          <Table.Tr key={index}>
                            <Table.Td>{entry.brand_name}</Table.Td>
                            <Table.Td>{entry.quantity}</Table.Td>
                            <Table.Td>{entry.Days}</Table.Td>
                            <Table.Td>{entry.Times}</Table.Td>
                            <Table.Td>{entry.astock}</Table.Td>
                            <Table.Td>
                              <Button
                                onClick={() => handleDeleteEntry(index)}
                                style={{
                                  backgroundColor: "#FF4D4D",
                                  color: "white",
                                  padding: "5px 10px",
                                  cursor: "pointer",
                                }}
                              >
                                Delete
                              </Button>
                            </Table.Td>
                          </Table.Tr>
                        ))}
                        <Table.Tr>
                          <Table.Td>
                            <div style={{ display: "flex", gap: "1rem" }}>
                              <Autocomplete
                                name="medicine"
                                value={medicine}
                                onChange={handlebrand}
                                data={medicineName}
                                placeholder="Write Medicine Name"
                              />
                            </div>
                          </Table.Td>
                          <Table.Td>
                            <Input
                              type="number"
                              name="quantity"
                              placeholder="Quantity"
                              value={quantity}
                              onChange={(e) => setQuantity(e.target.value)}
                            />
                          </Table.Td>
                          <Table.Td>
                            <Input
                              type="number"
                              name="days"
                              placeholder="No. of Days"
                              value={days}
                              onChange={(e) => setDays(e.target.value)}
                            />
                          </Table.Td>
                          <Table.Td>
                            <Input
                              type="number"
                              name="timesPerDay"
                              placeholder="Times per Day"
                              value={timesPerDay}
                              onChange={(e) => setTimesPerDay(e.target.value)}
                            />
                          </Table.Td>
                          <Table.Td>
                            <Select
                              name="stock"
                              placeholder="--Select--"
                              value={stock}
                              onChange={handelstock}
                              data={selectstock}
                              required
                            />
                          </Table.Td>
                          <Table.Td>
                            <Button
                              onClick={handleAddEntry}
                              style={{
                                backgroundColor: "#15abff",
                                color: "white",
                                padding: "5px 18px",
                                cursor: "pointer",
                              }}
                            >
                              Add
                            </Button>
                          </Table.Td>
                        </Table.Tr>
                      </Table.Tbody>
                    </Table>

                    <Paper p="sm" withBorder mt="sm">
                      <TextInput
                        label="Manufacturer Name"
                        placeholder="Manufacturer Name"
                        readOnly
                        value={manuname}
                      />
                      <TextInput
                        label="Pack Size"
                        placeholder="Pack Size"
                        readOnly
                        value={packsize}
                      />

                      <TextInput
                        label="Expiry Date"
                        placeholder="Expiry Date"
                        value={expiry}
                        readOnly
                      />
                      <TextInput
                        label="Stock Quantity"
                        placeholder="Stock Quantity"
                        value={stockQuantity}
                        readOnly
                      />
                    </Paper>
                  </div>
                </div>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Textarea
                    label="Tests Suggested"
                    value={testsSuggested}
                    onChange={(event) => setTestsSuggested(event.target.value)}
                    error={form.errors.testsSuggested}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Input.Label style={{ marginBottom: "0.5rem" }}>
                    Upload Report
                  </Input.Label>
                  <Input
                    type="file"
                    name="report"
                    onChange={handleFileChange}
                    style={{
                      width: "100%",
                    }}
                  />
                </Grid.Col>

                <Grid.Col span={12}>
                  <Flex justify="flex-end" gap="md">
                    <Button
                      variant="outline"
                      onClick={() => setShowFollowupForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" color="blue">
                      Submit Follow-up
                    </Button>
                  </Flex>
                </Grid.Col>
              </Grid>
            </form>
          </Paper>
        )}

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
