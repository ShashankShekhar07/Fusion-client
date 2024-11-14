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
import DataTable2 from "./Table2";

function ViewIndentInbox() {
  // const [remarks, setRemarks] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [file, _setFile] = useState(null); // ignore
  // const [receiver, setReceiver] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [designations, setDesignations] = useState([]);
  const navigate = useNavigate();
  const uploader_username = useSelector((state) => state.user);
  const { indentID } = useParams();

  const [indent, setIndent] = useState(null);

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
      setIndent(response.data);
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append("sender", uploader_username);
    data.append("receive", formValues.receiverName);
    // data.append("remarks", formValues.remark);
    // data.append("sender", rolereceiverDesignation);
    // data.append("receive", formValues.forwardTo); // Receiver ID
    data.append("myfile", file); // File attachment, if any
    console.log(data);
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        // http://127.0.0.1:8000/purchase-and-store/forwardindent/630/
        `http://127.0.0.1:8000/purchase-and-store/api/indentFile/forward/${indentID}`,
        data,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      console.log("Indent forwarded successfully:", response.data);
      navigate("/purchase/all_filed_indents");
    } catch (error) {
      console.error("Error forwarding indent:", error);
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
                <Text>atul-professor</Text>
              </Group>
            </Grid.Col>
            <Grid.Col span={1}>
              <Group>
                <Text weight={600}>
                  <strong>File ID:</strong>
                </Text>
                <Text>CSE-2027-9-#619</Text>
              </Group>
            </Grid.Col>
            <Grid.Col span={2}>
              <Text>
                <DataTable indent={indent} />
              </Text>
            </Grid.Col>
            <Grid.Col span={2}>
              <Text>
                <DataTable2 />
              </Text>
            </Grid.Col>
          </Grid>

          <form onSubmit={handleSubmit} style={{ marginLeft: "24px" }}>
            <Grid>
              <Grid.Col sm={12}>
                <TextInput
                  label="Remarks"
                  placeholder="Enter your remarks here"
                  value={formValues.remark}
                  onChange={handleInputChange("remark")}
                />
              </Grid.Col>

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

              <Grid.Col sm={12}>
                <Button
                  type="submit"
                  fullWidth
                  color="green"
                  style={{ marginRight: "8px" }}
                >
                  Submit Indent
                </Button>
              </Grid.Col>
            </Grid>

            {/* Submit and Archive Buttons */}
            <Group position="right" mt="lg" style={{ justifyContent: "end" }}>
              <Button
                type="submit"
                color="green"
                style={{ marginRight: "8px" }}
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

export default ViewIndentInbox;

// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   Container,
//   Grid,
//   Paper,
//   Text,
//   Select,
//   Group,
//   Button,
//   TextInput,
//   Title,
// } from "@mantine/core";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import DataTable from "./Table";
// import DataTable2 from "./Table2";

// function ViewIndentInbox() {
//   const [file, setFile] = useState(null); // File state for attachments
//   const [receiverName, setReceiverName] = useState(""); // Receiver name input
//   const [designations, setDesignations] = useState([]); // Designations for receiver
//   const [indent, setIndent] = useState(null); // Loaded indent data
//   const navigate = useNavigate();
//   const { indentID } = useParams();
//   const uploaderUsername = useSelector((state) => state.user.username); // Current user
//   const role = useSelector((state) => state.user.role); // Current user role

//   // Fetch indent details from backend
//   const fetchIndentDetails = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.post(
//         "http://127.0.0.1:8000/purchase-and-store/api/view_indent/",
//         { file_id: indentID },
//         {
//           headers: {
//             Authorization: `Token ${token}`,
//             "Content-Type": "application/json",
//           },
//         },
//       );
//       setIndent(response.data);
//       console.log(response.data);
//       console.log(indent);
//     } catch (error) {
//       console.error("Error fetching indents:", error);
//     }
//   };

//   useEffect(() => {
//     if (indentID) {
//       fetchIndentDetails();
//     }
//   }, [indentID]);

//   // Form input handling
//   const [formValues, setFormValues] = useState({
//     remarks: "",
//     forwardTo: "",
//     receiverDesignation: "",
//   });

//   const handleInputChange = (field) => (event) => {
//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [field]: event.currentTarget.value,
//     }));
//   };

//   // Fetch designations based on the receiver's name
//   const fetchDesignations = async (receivername) => {
//     try {
//       const response = await axios.get(
//         `http://127.0.0.1:8000/filetracking/getdesignations/${receivername}`,
//       );
//       setDesignations(response.data);
//     } catch (error) {
//       console.error("Error fetching designations:", error);
//     }
//   };

//   const handleReceiverChange = (value) => {
//     setReceiverName(value);
//     fetchDesignations(value);
//   };

//   const handleDesignationChange = (value) => {
//     setFormValues((prevValues) => ({
//       ...prevValues,
//       receiverDesignation: value,
//     }));
//   };

//   // Submit the form to forward the indent
//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const data = new FormData();
//     data.append("remarks", formValues.remarks);
//     data.append("sender", role);
//     data.append("receive", formValues.forwardTo); // Receiver ID
//     data.append("myfile", file); // File attachment, if any
//     console.log(data);
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.post(
//         // http://127.0.0.1:8000/purchase-and-store/forwardindent/630/
//         `http://127.0.0.1:8000/purchase-and-store/api/indentFile/forward/${indentID}`,
//         data,
//         {
//           headers: {
//             Authorization: `Token ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         },
//       );
//       console.log("Indent forwarded successfully:", response.data);
//       navigate("/purchase/all_filed_indents");
//     } catch (error) {
//       console.error("Error forwarding indent:", error);
//     }
//   };

//   return (
//     <Container
//       size="lg"
//       px="md"
//       style={{
//         backgroundColor: "white",
//         shadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
//         padding: "20px",
//       }}
//     >
//       <Paper
//         shadow="sm"
//         padding="lg"
//         radius="md"
//         style={{
//           backgroundColor: "#f3f9ff",
//           margin: "2px 170px",
//           padding: "5px",
//         }}
//       >
//         <Group position="apart" mb="lg" justify="space-evenly">
//           <Title order={3}>Note Sheets</Title>
//           <Title order={3}>Attachments</Title>
//         </Group>

//         <Grid columns={2} gutter="lg" style={{ marginLeft: "24px" }}>
//           <Grid.Col span={1}>
//             <Group>
//               <Text weight={600}>
//                 <strong>Created by:</strong>
//               </Text>
//               <Text>{uploaderUsername}</Text>
//             </Group>
//           </Grid.Col>
//           <Grid.Col span={1}>
//             <Group>
//               <Text weight={600}>
//                 <strong>File ID:</strong>
//               </Text>
//               <Text>{indent ? indent.file_id : "Loading..."}</Text>
//             </Group>
//           </Grid.Col>
//           <Grid.Col span={2}>
//             <Text>
//               <DataTable indent={indent} />
//             </Text>
//           </Grid.Col>
//           <Grid.Col span={2}>
//             <Text>
//               <DataTable2 />
//             </Text>
//           </Grid.Col>
//         </Grid>

//         <form onSubmit={handleSubmit} style={{ marginLeft: "24px" }}>
//           <Grid>
//             <Grid.Col sm={12}>
//               <TextInput
//                 label="Remarks"
//                 placeholder="Enter your remarks here"
//                 value={formValues.remarks}
//                 onChange={handleInputChange("remarks")}
//               />
//             </Grid.Col>

//             <Grid.Col sm={12}>
//               <TextInput
//                 label="Forward To"
//                 placeholder="Enter forward to"
//                 value={formValues.forwardTo}
//                 onChange={handleInputChange("forwardTo")}
//               />
//             </Grid.Col>

//             <Grid.Col sm={12}>
//               <TextInput
//                 label="Receiver Name"
//                 placeholder="Enter receiver name"
//                 value={receiverName}
//                 onChange={(event) =>
//                   handleReceiverChange(event.currentTarget.value)
//                 }
//               />
//             </Grid.Col>

//             <Grid.Col sm={12}>
//               <Select
//                 label="Receiver Designation"
//                 placeholder="Select designation"
//                 data={designations.map((designation) => ({
//                   value: designation,
//                   label: designation,
//                 }))}
//                 value={formValues.receiverDesignation}
//                 onChange={handleDesignationChange}
//                 searchable
//                 clearable
//               />
//             </Grid.Col>

//             <Grid.Col sm={12}>
//               <Button type="submit" fullWidth>
//                 Submit Indent
//               </Button>
//             </Grid.Col>
//           </Grid>

//           <Group position="right" mt="lg" style={{ justifyContent: "end" }}>
//             <Button color="#9095A0FF" onClick={() => navigate("/archive")}>
//               Archive
//             </Button>
//             <Button color="#9095A0FF" type="submit">
//               Send
//             </Button>
//           </Group>
//         </form>
//       </Paper>
//     </Container>
//   );
// }

// export default ViewIndentInbox;
