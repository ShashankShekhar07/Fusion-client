import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { PiPrinter } from "react-icons/pi";
import {
  Container,
  Grid,
  Paper,
  Text,
  Select,
  Group,
  Button,
  TextInput,
  Title,
} from "@mantine/core";
import axios from "axios";
import { useSelector } from "react-redux";
import DataTable from "./Table";
// import DataTable2 from "./Table2";

function ViewIndent() {
  // const [remarks, setRemarks] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [file, _setFile] = useState(null); // ignore
  // const [receiver, setReceiver] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [designations, setDesignations] = useState([]);
  const navigate = useNavigate();
  const uploader_username = useSelector((state) => state.user.roll_no);
  const role = useSelector((state) => state.user.role);
  const { indentID } = useParams();

  const [indent, setIndent] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [department, setDepartment] = useState("");

  const fetchIndentDetails = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        "http://127.0.0.1:8000/purchase-and-store/api/view_indent/",
        { file_id: indentID },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      setIndent(response.data.indent);
      setFileInfo(response.data.file);
      setDepartment(response.data.department);
      console.log(response.data);
      console.log(indent);
    } catch (error) {
      console.error("Error fetching indents:", error);
    }
  };

  useEffect(() => {
    if (indentID) {
      console.log(indentID);
      fetchIndentDetails(indentID);
    }
  }, []);

  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    itemName: "",
    quantity: 0,
    cost: 0,
    itemType: "",
    presentStock: 0,
    purpose: "",
    specification: "",
    itemSubtype: "",
    budgetaryHead: "",
    expectedDelivery: null,
    sourceOfSupply: "",
    remark: "",
    forwardTo: "",
    receiverDesignation: "",
  });

  const handleInputChange = (field) => (event) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: event.currentTarget.value,
    }));
  };

  // Fetch designations based on the entered receiver name
  // eslint-disable-next-line no-shadow
  const fetchDesignations = async (receiverName) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/filetracking/getdesignations/${receiverName}`,
      );
      console.log("Fetched designations:", response.data);
      setDesignations(response.data); // Set the fetched designations in state
    } catch (error) {
      console.error("Error fetching designations:", error);
      // setErrorMessage(
      //   error.response
      //     ? error.response.data
      //     : "An error occurred while fetching designations",
      // );
    }
  };

  const handleReceiverChange = (value) => {
    setReceiverName(value);
    fetchDesignations(value);
  };

  const handleDesignationChange = (value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      receiverDesignation: value,
    }));
  };
  const year = fileInfo ? fileInfo.upload_date.slice(0, 4) : "";
  const month = fileInfo ? fileInfo.upload_date.slice(5, 7) : "";
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append("title", indent.item_name);
    data.append("description", indent.item_name);
    data.append("item_name", indent.item_name);
    data.append("quantity", indent.quantity);
    data.append("estimated_cost", indent.estimated_cost);
    data.append("item_type", indent.item_type);
    data.append("present_stock", indent.present_stock);
    data.append("purpose", indent.purpose);
    data.append("specification", indent.specification);
    data.append("itemSubtype", indent.item_subtype);
    data.append("budgetary_head", indent.budgetary_head);
    data.append("expected_delivery", indent.expected_delivery);
    data.append("sources_of_supply", indent.sources_of_supply);
    data.append("file", file);
    data.append("remark", formValues.remark);
    data.append("forwardTo", formValues.forwardTo);
    data.append("receiverDesignation", formValues.receiverDesignation);
    data.append("receiverName", receiverName);
    data.append("uploaderUsername", uploader_username);
    console.log("Form data:", data.get("receiverDesignation"));

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `http://127.0.0.1:8000/purchase-and-store/api/create_proposal/?role=${role}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${token}`,
          },
        },
      );

      console.log("Success:", response.data);
      navigate("/purchase/all_filed_indents");
    } catch (error) {
      console.error("Error submitting form:", error);
      // setErrorMessage(
      //   error.response
      //     ? error.response.data
      //     : "An error occurred during submission",
      // );
    }
  };

  return (
    <div>
      <Container
        size="lg"
        px="md"
        backgroundColor="white"
        style={{
          backgroundColor: "white",
          shadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          padding: "20px",
        }}
      >
        {/* Main Paper/Card Container */}
        <Paper
          shadow="sm"
          padding="lg"
          radius="md"
          style={{
            backgroundColor: "#f3f9ff",
            marginRight: "170px",
            marginLeft: "170px",
            marginTop: "2px",
            padding: "5px",
          }}
        >
          {/* Header Section */}
          <Group position="apart" mb="lg" justify="space-evenly">
            <Title order={3}>Note Sheets</Title>
            {/* <PiPrinter size={28} /> */}
            <Title order={3}>Attachments</Title>
          </Group>

          {/* Created By and File ID Section */}
          <Grid columns={2} gutter="lg" style={{ marginLeft: "24px" }}>
            <Grid.Col span={1}>
              <Group>
                <Text weight={600}>
                  <strong>Created by:</strong>
                </Text>
                <Text>
                  {uploader_username} - {role}{" "}
                </Text>
              </Group>
            </Grid.Col>
            <Grid.Col span={1}>
              <Group>
                <Text weight={600}>
                  <strong>File ID:</strong>
                </Text>
                <Text>
                  {department}-{year}-{month}-#{fileInfo ? fileInfo.id : ""}
                </Text>
              </Group>
            </Grid.Col>
            <Grid.Col span={2}>
              <Text>
                <DataTable indent={indent} />
              </Text>
            </Grid.Col>
            {/* <Grid.Col span={2}>
              <Text>
                <DataTable2 />
              </Text>
            </Grid.Col> */}
          </Grid>

          <form onSubmit={handleSubmit} style={{ marginLeft: "24px" }}>
            <Grid>
              <Grid.Col sm={12}>
                <TextInput
                  label="Forward To"
                  placeholder="Enter forward to"
                  value={formValues.forwardTo}
                  onChange={handleInputChange("forwardTo")}
                />
              </Grid.Col>

              <Grid.Col sm={12}>
                <TextInput
                  label="Receiver Name"
                  placeholder="Enter receiver name"
                  value={receiverName}
                  onChange={(event) =>
                    handleReceiverChange(event.currentTarget.value)
                  } // Manual input for receiver name
                />
              </Grid.Col>

              <Grid.Col sm={12}>
                <Select
                  label="Receiver Designation"
                  placeholder="Select designation"
                  data={designations.map((designation) => ({
                    value: designation,
                    label: designation,
                  }))}
                  value={formValues.receiverDesignation}
                  onChange={handleDesignationChange} // Update designation on selection
                  searchable
                  clearable
                />
              </Grid.Col>

              {/* <Grid.Col sm={12}>
                <Button
                  type="submit"
                  fullWidth
                  color="green"
                  style={{ marginRight: "8px" }}
                >
                  Submit Indent
                </Button>
              </Grid.Col> */}
            </Grid>

            {/* Submit and Archive Buttons */}
            <Group position="right" mt="lg" style={{ justifyContent: "end" }}>
              <Button
                color="green"
                style={{ marginRight: "8px" }}
                type="submit"
                onClick={() => navigate("/archive")}
              >
                Archieve
              </Button>
              <Button
                type="submit"
                color="green"
                style={{ marginRight: "8px" }}
              >
                Send
              </Button>
            </Group>
          </form>
        </Paper>
      </Container>
    </div>
    // <></>
  );
}

export default ViewIndent;
