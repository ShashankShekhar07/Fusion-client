import {
  Alert,
  Autocomplete,
  Button,
  Flex,
  Input,
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
import axios from "axios";
import NavCom from "../NavCom";
import HistoryNavBar from "./historyPath";
import CustomBreadcrumbs from "../../../../components/Breadcrumbs";
import { compounderRoute } from "../../../../routes/health_center";

function getDummyData(medicineName) {
  const dummyDatabase = {
    dolo: {
      manufacturerName: "Sahil",
      packSize: 2,
      stock: 100,
      expiryDate: "2025-01-01",
      stockQuantity: 450,
    },
    paracetamol: {
      manufacturerName: "ABC Pharma",
      packSize: 10,
      stock: 200,
      expiryDate: "2024-12-01",
      stockQuantity: 1000,
    },
  };

  return dummyDatabase[medicineName.toLowerCase()] || null;
}

function UpdatePatient() {
  const [patientId, setpatientId] = useState("");
  const [entries, setEntries] = useState([]);
  const [medicine, setMedicine] = useState("");
  const [quantity, setQuantity] = useState("");
  const [days, setDays] = useState("");
  const [timesPerDay, setTimesPerDay] = useState("");
  const [selectedOption, setSelectedOption] = useState("self");
  const [dummyData, setDummyData] = useState(null);
  const [notification, setNotification] = useState(null);
  const [doctors, setDoctor] = useState([]);
  const [doctorName, setDoctorName] = useState("");
  const [medicineName, setMedicineName] = useState([]);
  const [similar, setsimilar] = useState([]);
  const [manuname, setmanu] = useState("");
  const [packsize, setpack] = useState(0);
  const [stock, setStock] = useState("");
  const [selectstock, setselectstock] = useState([]);
  const [allstock, setallstock] = useState([]);
  const [expiry, setexpiry] = useState("");
  const [stockQuantity, setstockQuantity] = useState(0);
  const [dependent, setDependent] = useState("");
  const [alldependent, setAllDependent] = useState([]);
  const [relation, setrelation] = useState("");
  const [diseaseDetails, setdiseaseDetails] = useState("");
  const [textSuggested, setTextSuggested] = useState("");
  const [reportfile, setFile] = useState(null);

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

  const fetchDependent = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        compounderRoute,
        {
          user_for_dependents: patientId,
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
        setSelectedOption("self");
      } else if (response.data.dep.length === 0) {
        alert("No Dependent found");
        setSelectedOption("self");
      } else {
        setAllDependent(response.data.dep);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDependent = async () => {
    setSelectedOption("dependent");
    fetchDependent();
  };
  const handelsetrelation = (event) => {
    setDependent(event);
    alldependent.forEach((item) => {
      if (item.name === event) {
        setrelation(item.relation);
      }
    });
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

        const data = getDummyData(medicine);
        setDummyData(data);

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

  const handleDeleteEntry = (index) => {
    const newEntries = entries.filter((_, i) => i !== index);
    setEntries(newEntries);
    setNotification({
      type: "success",
      message: "Successfully Deleted",
    });

    setTimeout(() => setNotification(null), 5000);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("authToken");

    try {
      const fileArrayBuffer = await reportfile.arrayBuffer();
      const fileBase64 = btoa(
        new Uint8Array(fileArrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          "",
        ),
      );
      const response = await axios.post(
        compounderRoute,
        {
          file: fileBase64,
          user: patientId,
          doctor: doctorName,
          details: diseaseDetails,
          is_dependent: selectedOption,
          prescribe_b: 1,
          dependent_name: dependent,
          dependent_relation: relation,
          pre_medicine: entries,
          tests: textSuggested,
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
        alert("Prescribed Medicine Successfully");
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
  return (
    <>
      <CustomBreadcrumbs />
      <NavCom />
      <HistoryNavBar />
      <br />
      <Paper shadow="xl" p="xl" withBorder>
        <div>
          <div style={{ display: "flex" }}>
            <div style={{ paddingRight: "100px" }}>
              <p style={{ marginBottom: "2px" }}>Patient</p>
              <Input
                type="text"
                placeholder="Patient Id"
                value={patientId}
                onChange={(e) => setpatientId(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", gap: "2rem" }}>
              <div>
                <p style={{ marginBottom: "2px" }}>Doctor</p>
                <Select
                  name="doctor"
                  placeholder="--Select--"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e)}
                  data={doctors.map((doc) => doc.doctor_name)}
                />
              </div>

              <div>
                <p style={{ marginBottom: "2px" }}>Details of Disease</p>
                <Input
                  type="text"
                  name="diseaseDetails"
                  placeholder="Input Text"
                  value={diseaseDetails}
                  onChange={(e) => setdiseaseDetails(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <br />
        <div style={{ display: "flex", gap: "1rem" }}>
          <Radio
            label="Self"
            value="self"
            checked={selectedOption === "self"}
            onChange={() => setSelectedOption("self")}
          />
          <Radio
            label="Dependent"
            value="dependent"
            checked={selectedOption === "dependent"}
            onChange={handleDependent}
          />
        </div>

        {selectedOption === "dependent" && (
          <Flex
            direction="row"
            gap="1rem"
            style={{ maxWidth: "400px", display: "flex", marginTop: "1rem" }}
          >
            <div>
              <p style={{ marginBottom: "2px" }}>Dependent Name</p>
              <Select
                name="dependent_name"
                placeholder="--Select--"
                value={dependent}
                onChange={handelsetrelation}
                data={alldependent.map((dep) => dep.name)}
              />
            </div>
            <TextInput
              label="Relation"
              placeholder="Write Relation"
              value={relation}
              readOnly
            />
          </Flex>
        )}

        <br />
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

            <Table highlightOnHover withTableBorder withColumnBorders striped>
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

        {dummyData && (
          <div style={{ marginTop: "2rem" }}>
            <Title
              order={5}
              style={{
                textAlign: "center",
                color: "#15abff",
              }}
            >
              Medicine's Details
            </Title>
            <Table highlightOnHover withTableBorder withColumnBorders striped>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Manufacturer Name</Table.Th>
                  <Table.Th>Pack Size</Table.Th>
                  <Table.Th>Stock</Table.Th>
                  <Table.Th>Expiry Date</Table.Th>
                  <Table.Th>Stock Quantity</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td>{dummyData.manufacturerName}</Table.Td>
                  <Table.Td>{dummyData.packSize}</Table.Td>
                  <Table.Td>{dummyData.stock}</Table.Td>
                  <Table.Td>{dummyData.expiryDate}</Table.Td>
                  <Table.Td>{dummyData.stockQuantity}</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </div>
        )}

        <div style={{ display: "flex", gap: "2rem" }}>
          <div
            style={{ display: "flex", flexDirection: "column", width: "30%" }}
          >
            <Input.Label style={{ marginBottom: "0.5rem" }}>
              Test Suggested
            </Input.Label>
            <Textarea
              type="text"
              name="textSuggested"
              value={textSuggested}
              onChange={(e) => setTextSuggested(e.target.value)}
              placeholder="Input Text"
              style={{
                width: "100%",
              }}
            />
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", width: "30%" }}
          >
            <Input.Label style={{ marginBottom: "0.5rem" }}>Report</Input.Label>
            <Input
              type="file"
              name="report"
              onChange={handleFileChange}
              style={{
                width: "100%",
              }}
            />
          </div>
        </div>

        <br />

        <Button
          style={{
            backgroundColor: "#15abff",
            color: "white",
            padding: "5px 20px",
            width: "20%",
          }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
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

export default UpdatePatient;
