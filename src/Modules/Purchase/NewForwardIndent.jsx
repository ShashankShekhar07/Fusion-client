// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   Container,
//   Tabs,
//   Paper,
//   Text,
//   Select,
//   Button,
//   Textarea,
//   FileInput,
//   Stack,
//   Title,
//   LoadingOverlay,
// } from "@mantine/core";
// import { IconNotes, IconPaperclip } from "@tabler/icons-react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import DataTable from "./Table";
// import { viewIndentRoute } from "../../routes/purchaseRoutes";

// const ROUTES = {
//   forwardIndent: (id) =>
//     `http://127.0.0.1:8000/purchase-and-store/api/forward-indent/${id}`,
//   getDesignations: (name) =>
//     `http://127.0.0.1:8000/purchase-and-store/api/get-designations/${name}`,
//   viewIndent: "http://127.0.0.1:8000/purchase-and-store/api/view-indent",
//   userSuggestions:
//     "http://127.0.0.1:8000/purchase-and-store/api/user-suggestions",
// };

// function NewForwardIndent() {
//   const [activeTab, setActiveTab] = useState("notesheets");
//   const [loading, setLoading] = useState(false);
//   const [file, setFile] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [designations, setDesignations] = useState([]);
//   const [indent, setIndent] = useState(null);
//   const [fileInfo, setFileInfo] = useState(null);

//   const [formData, setFormData] = useState({
//     remark: "",
//     forwardTo: "",
//     receiverDesignation: "",
//   });

//   const navigate = useNavigate();
//   const { indentID } = useParams();
//   const uploader_username = useSelector((state) => state.user.roll_no);
//   const role = useSelector((state) => state.user.role);

//   useEffect(() => {
//     fetchInitialData();
//   }, [indentID]);

//   const fetchInitialData = async () => {
//     setLoading(true);
//     try {
//       await Promise.all([fetchUsers(), fetchIndentDetails()]);
//     } catch (error) {
//       console.error("Error fetching initial data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUsers = async () => {
//     try {
//       const response = await axios.get(ROUTES.userSuggestions);
//       setUsers(response.data.users);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   };

//   const fetchIndentDetails = async () => {
//     if (!indentID) return;

//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.post(
//         viewIndentRoute,
//         { file_id: indentID },
//         {
//           headers: {
//             Authorization: `Token ${token}`,
//             "Content-Type": "application/json",
//           },
//         },
//       );
//       const indent = response.data.indent;
//       setIndent(Array.isArray(indent) ? indent : [indent]);
//       setFileInfo(response.data.file);
//     } catch (error) {
//       console.error("Error fetching indent details:", error);
//     }
//   };

//   const fetchDesignations = async (receiverName) => {
//     try {
//       const response = await axios.get(ROUTES.getDesignations(receiverName));
//       setDesignations(response.data);
//     } catch (error) {
//       console.error("Error fetching designations:", error);
//     }
//   };

//   const handleUserChange = (value) => {
//     setFormData((prev) => ({ ...prev, forwardTo: value }));
//     if (value) {
//       fetchDesignations(value);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const formDataToSend = new FormData();
//     if (file) formDataToSend.append("file", file);
//     formDataToSend.append("remark", formData.remark);
//     formDataToSend.append("forwardTo", formData.forwardTo);
//     formDataToSend.append("receiverDesignation", formData.receiverDesignation);
//     formDataToSend.append("uploaderUsername", uploader_username);
//     formDataToSend.append("role", role);

//     if (Array.isArray(indent)) {
//       indent.forEach((item, index) => {
//         Object.entries(item).forEach(([key, value]) => {
//           formDataToSend.append(`items[${index}][${key}]`, value);
//         });
//       });
//     }

//     try {
//       const token = localStorage.getItem("authToken");
//       await axios.post(ROUTES.forwardIndent(indentID), formDataToSend, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Token ${token}`,
//         },
//       });
//       navigate("/purchase/all_filed_indents");
//     } catch (error) {
//       console.error("Error submitting form:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container size="xl" py="xl">
//       <Paper shadow="sm" p="md" radius="md" pos="relative">
//         <LoadingOverlay visible={loading} overlayBlur={2} />

//         <Title order={2} mb="lg">
//           Forward Indent
//         </Title>

//         <Tabs value={activeTab} onChange={setActiveTab}>
//           <Tabs.List mb="md">
//             <Tabs.Tab value="notesheets" leftSection={<IconNotes size={16} />}>
//               Note Sheets
//             </Tabs.Tab>
//             <Tabs.Tab
//               value="attachments"
//               leftSection={<IconPaperclip size={16} />}
//             >
//               Attachments
//             </Tabs.Tab>
//           </Tabs.List>

//           <Tabs.Panel value="notesheets">
//             <Stack spacing="md">
//               {indent && <DataTable indent={indent} />}
//             </Stack>
//           </Tabs.Panel>

//           <Tabs.Panel value="attachments">
//             <Stack spacing="md">
//               <Text>Current attachments will be displayed here</Text>
//             </Stack>
//           </Tabs.Panel>
//         </Tabs>

//         <Paper withBorder p="md" mt="xl">
//           <form onSubmit={handleSubmit}>
//             <Stack spacing="md">
//               <Textarea
//                 label="Remark"
//                 placeholder="Enter your remark here"
//                 minRows={3}
//                 value={formData.remark}
//                 onChange={(e) =>
//                   setFormData((prev) => ({ ...prev, remark: e.target.value }))
//                 }
//                 required
//               />

//               <Select
//                 label="Forward To"
//                 placeholder="Select user"
//                 data={users.map((user) => ({
//                   value: user.username,
//                   label: user.username,
//                 }))}
//                 value={formData.forwardTo}
//                 onChange={handleUserChange}
//                 searchable
//                 required
//               />

//               <Select
//                 label="Receiver Designation"
//                 placeholder="Select designation"
//                 data={designations.map((d) => ({ value: d, label: d }))}
//                 value={formData.receiverDesignation}
//                 onChange={(value) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     receiverDesignation: value || "",
//                   }))
//                 }
//                 searchable
//                 required
//               />

//               <FileInput
//                 label="Attachment"
//                 placeholder="Upload file"
//                 accept="application/pdf,image/jpeg,image/png"
//                 value={file}
//                 onChange={setFile}
//               />

//               <Button type="submit" color="blue" fullWidth mt="md">
//                 Submit Forward Request
//               </Button>
//             </Stack>
//           </form>
//         </Paper>
//       </Paper>
//     </Container>
//   );
// }

// export default NewForwardIndent;

// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Container,
//   Paper,
//   Title,
//   Group,
//   Badge,
//   Text,
//   Grid,
//   Card,
//   Button,
//   Textarea,
//   Select,
//   FileInput,
//   Timeline,
//   Accordion,
// } from "@mantine/core";
// import {
//   IconFileDescription,
//   IconPaperclip,
//   IconSend,
//   IconCheck,
//   IconClock,
//   IconArrowForward,
//   IconMessageDots,
// } from "@tabler/icons-react";
// import dayjs from "dayjs";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import {
//   forwardIndentRoute,
//   getDesignationsRoute,
//   viewIndentRoute,
// } from "../../routes/purchaseRoutes";

// // const mockDesignations = [
// //   "Department Head",
// //   "Director",
// //   "Financial Officer",
// //   "Store Manager",
// //   "Purchase Committee",
// // ];

// export default function NewForwardIndent() {
//   // const [remark, setRemark] = useState("");
//   // const [selectedDesignation, setSelectedDesignation] = useState(null);
//   // const [attachment, setAttachment] = useState(null);
//   const [file, setFile] = useState(null);
//   const [receiverName, setReceiverName] = useState("");
//   const [designations, setDesignations] = useState([]);
//   const navigate = useNavigate();
//   const uploader_username = useSelector((state) => state.user.roll_no);
//   console.log(uploader_username);
//   const role = useSelector((state) => state.user.role);
//   const [users, setUsers] = useState([]); // Store all users data here
//   const [filteredUsers, setFilteredUsers] = useState([]); // Store filtered users
//   const [selectedUser, setSelectedUser] = useState(""); // Selected user from dropdown

//   const fetchAllUsers = async () => {
//     try {
//       const response = await axios.get(
//         " http://127.0.0.1:8000/purchase-and-store/api/user-suggestions",
//       );
//       setUsers(response.data.users); // Save all users data to state
//       setFilteredUsers(response.data.users); // Initially, show all users
//     } catch (error) {
//       console.error("Error fetching all users", error);
//     }
//   };

//   useEffect(() => {
//     fetchAllUsers(); // Fetch all users on mount
//   }, []);

//   const filterUsers = (searchQuery) => {
//     if (searchQuery === "") {
//       setFilteredUsers(users); // If query is empty, show all users
//     } else {
//       const filtered = users.filter((user) =>
//         user.username.toLowerCase().includes(searchQuery.toLowerCase()),
//       );
//       setFilteredUsers(filtered); // Set the filtered users
//     }
//   };

//   const { indentID } = useParams();
//   const [indent, setIndent] = useState(null);
//   const [fileInfo, setFileInfo] = useState(null);
//   const [department, setDepartment] = useState("");

//   const fetchIndentDetails = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.post(
//         viewIndentRoute,
//         { file_id: indentID },
//         {
//           headers: {
//             Authorization: `Token ${token}`,
//             "Content-Type": "application/json",
//           },
//         },
//       );
//       setIndent(response.data.indent);
//       setFileInfo(response.data.file);
//       setDepartment(response.data.department);
//       console.log(response.data);
//     } catch (error) {
//       console.error("Error fetching indents:", error);
//     }
//   };

//   useEffect(() => {
//     if (indentID) {
//       console.log(indentID);
//       fetchIndentDetails(indentID);
//     }
//   }, []);
//   console.log(indent);

//   const year = fileInfo ? fileInfo.upload_date.slice(0, 4) : "";
//   const month = fileInfo ? fileInfo.upload_date.slice(5, 7) : "";
//   const [formValues, setFormValues] = useState({
//     title: "",
//     description: "",
//     itemName: "",
//     quantity: 0,
//     cost: 0,
//     itemType: "",
//     presentStock: 0,
//     purpose: "",
//     specification: "",
//     itemSubtype: "",
//     budgetaryHead: "",
//     expectedDelivery: null,
//     sourceOfSupply: "",
//     remark: "",
//     forwardTo: "",
//     receiverDesignation: "",
//     role: "",
//   });

//   const handleInputChange = (field) => (event) => {
//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [field]: event.currentTarget.value,
//     }));
//   };

//   // Fetch designations based on the entered receiver name
//   // eslint-disable-next-line no-shadow
//   const fetchDesignations = async (receiverName) => {
//     try {
//       const response = await axios.get(getDesignationsRoute(receiverName));
//       console.log("Fetched designations:", response.data);
//       setDesignations(response.data); // Set the fetched designations in state
//     } catch (error) {
//       console.error("Error fetching designations:", error);
//       // setErrorMessage(
//       //   error.response
//       //     ? error.response.data
//       //     : "An error occurred while fetching designations",
//       // );
//     }
//   };

//   // const handleReceiverChange = (value) => {
//   //   setReceiverName(value);
//   //   fetchDesignations(value);
//   // };
//   const handleSearchChange = (value) => {
//     filterUsers(value);
//     fetchDesignations(value);
//   };
//   const handleDesignationChange = (value) => {
//     setFormValues((prevValues) => ({
//       ...prevValues,
//       receiverDesignation: value,
//     }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const data = new FormData();
//     data.append("title", indent.item_name);
//     data.append("description", indent.item_name);
//     data.append("item_name", indent.item_name);
//     data.append("quantity", indent.quantity);
//     data.append("estimated_cost", indent.estimated_cost);
//     data.append("item_type", indent.item_type);
//     data.append("present_stock", indent.present_stock);
//     data.append("purpose", indent.purpose);
//     data.append("specification", indent.specification);
//     data.append("itemSubtype", indent.item_subtype);
//     data.append("budgetary_head", indent.budgetary_head);
//     data.append("expected_delivery", indent.expected_delivery);
//     data.append("sources_of_supply", indent.sources_of_supply);
//     data.append("file", file);
//     data.append("remark", formValues.remark);
//     data.append("forwardTo", selectedUser);
//     data.append("receiverDesignation", formValues.receiverDesignation);
//     data.append("receiverName", receiverName);
//     data.append("uploaderUsername", uploader_username);
//     console.log("Form data:", data.get("receiverDesignation"));
//     data.append("role", role);
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.post(forwardIndentRoute(indentID), data, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Token ${token}`,
//         },
//       });

//       console.log("Success:", response.data);
//       navigate("/purchase/all_filed_indents");
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       // setErrorMessage(
//       //   error.response
//       //     ? error.response.data
//       //     : "An error occurred during submission",
//       // );
//     }
//   };

//   // useEffect(() => {
//   //   // Mock data fetch - replace with actual API call
//   //   const fetchindent = async () => {
//   //     // Simulated API response
//   //     const mockData = {
//   //       file_info: parseInt(indentId || "0"),
//   //       items: [
//   //         {
//   //           id: 1,
//   //           item_name: "GPU Workstation",
//   //           quantity: 2,
//   //           present_stock: 0,
//   //           estimated_cost: 150000,
//   //           purpose: "Research and Development",
//   //           specification: "NVIDIA RTX 4090, 64GB RAM, 2TB SSD",
//   //           item_type: "Equipment",
//   //           item_subtype: "Computing",
//   //           nature: true,
//   //           indigenous: true,
//   //           replaced: false,
//   //           budgetary_head: "Research Equipment",
//   //           expected_delivery: "2024-03-30",
//   //           sources_of_supply: "Authorized NVIDIA Dealer",
//   //           indent_file: parseInt(indentId || "0"),
//   //         },
//   //       ],
//   //       head_approval: true,
//   //       director_approval: false,
//   //       financial_approval: false,
//   //       purchased: false,
//   //       revised: false,
//   //       message: "Indent Filed Successfully!",
//   //     };
//   //     setindent(mockData);
//   //   };

//   //   fetchindent();
//   // }, [indentId]);

//   // const handleSubmit = () => {
//   //   console.log({
//   //     indentId,
//   //     remark,
//   //     selectedDesignation,
//   //     attachment,
//   //   });
//   //   // Implement submission logic here
//   // };

//   if (!indent) {
//     return (
//       <Container size="xl" py="xl">
//         <Text>Loading...</Text>
//       </Container>
//     );
//   }

//   return (
//     <Container size="xl" py="xl">
//       {/* Header Section */}
//       <Paper shadow="sm" p="md" mb="xl" radius="md">
//         <Group position="apart" mb="md">
//           <Group>
//             <IconFileDescription size={32} />
//             <div>
//               <Title order={2}>Indent #{indent.file_info}</Title>
//               <Text color="dimmed">
//                 Filed on {dayjs().format("MMMM D, YYYY")}
//               </Text>
//             </div>
//           </Group>
//           <Group>
//             <Badge size="lg" color={indent.purchased ? "green" : "blue"}>
//               {indent.purchased ? "Purchased" : "In Progress"}
//             </Badge>
//             {indent.revised && (
//               <Badge size="lg" color="yellow">
//                 Revised
//               </Badge>
//             )}
//           </Group>
//         </Group>

//         {/* Approval Status */}
//         <Timeline active={1} bulletSize={24} lineWidth={2}>
//           <Timeline.Item
//             bullet={
//               indent.head_approval ? (
//                 <IconCheck size={12} />
//               ) : (
//                 <IconClock size={12} />
//               )
//             }
//             title="Head Approval"
//           >
//             <Text color="dimmed" size="sm">
//               Department head approval status
//             </Text>
//           </Timeline.Item>
//           <Timeline.Item
//             bullet={
//               indent?.director_approval ? (
//                 <IconCheck size={12} />
//               ) : (
//                 <IconClock size={12} />
//               )
//             }
//             title="Director Approval"
//           >
//             <Text color="dimmed" size="sm">
//               Director approval status
//             </Text>
//           </Timeline.Item>
//           <Timeline.Item
//             bullet={
//               indent?.financial_approval ? (
//                 <IconCheck size={12} color="blue" />
//               ) : (
//                 <IconClock size={12} />
//               )
//             }
//             title="Bill Approval"
//           >
//             <Text color="dimmed" size="sm">
//               Financial clearance status
//             </Text>
//           </Timeline.Item>
//         </Timeline>
//       </Paper>

//       {/* Items Section */}
//       <Title order={3} mb="md">
//         Indent Items
//       </Title>
//       <Accordion variant="contained" radius="md" mb="xl">
//         <Accordion.Item value={indent.file_info.toString()}>
//           <Accordion.Control>
//             <Group position="apart">
//               <Group>
//                 <Text weight={500}>{indent.item_name}</Text>
//                 <Badge>Qty: {indent.quantity}</Badge>
//               </Group>
//               <Text weight={500} color="blue">
//                 ₹{indent.estimated_cost.toLocaleString()}
//               </Text>
//             </Group>
//           </Accordion.Control>
//           <Accordion.Panel>
//             <Grid>
//               <Grid.Col span={6}>
//                 <Card withBorder p="md">
//                   <Text weight={500} mb="xs">
//                     Specifications
//                   </Text>
//                   <Text size="sm">{indent.specification}</Text>
//                 </Card>
//               </Grid.Col>
//               <Grid.Col span={6}>
//                 <Card withBorder p="md">
//                   <Text weight={500} mb="xs">
//                     Purpose
//                   </Text>
//                   <Text size="sm">{indent.purpose}</Text>
//                 </Card>
//               </Grid.Col>
//               <Grid.Col span={12}>
//                 <Grid>
//                   <Grid.Col span={3}>
//                     <Card withBorder p="md">
//                       <Text weight={500}>Item Nature</Text>
//                       <Badge color={indent.nature ? "green" : "red"}>
//                         {indent.nature ? "Yes" : "No"}
//                       </Badge>
//                     </Card>
//                   </Grid.Col>
//                   <Grid.Col span={3}>
//                     <Card withBorder p="md">
//                       <Text weight={500}>Replaced</Text>
//                       <Badge color={indent.replaced ? "green" : "red"}>
//                         {indent.replaced ? "Yes" : "No"}
//                       </Badge>
//                     </Card>
//                   </Grid.Col>
//                   <Grid.Col span={3}>
//                     <Card withBorder p="md">
//                       <Text weight={500}>Indigenous</Text>
//                       <Badge color={indent.indigenous ? "green" : "red"}>
//                         {indent.indigenous ? "Yes" : "No"}
//                       </Badge>
//                     </Card>
//                   </Grid.Col>
//                   <Grid.Col span={3}>
//                     <Card withBorder p="md">
//                       <Text weight={500}>Present Stock</Text>
//                       <Text size="sm">{indent.present_stock}</Text>
//                     </Card>
//                   </Grid.Col>
//                 </Grid>
//               </Grid.Col>
//               <Grid.Col span={12}>
//                 <Grid>
//                   <Grid.Col span={4}>
//                     <Card withBorder p="md">
//                       <Text weight={500}>Type</Text>
//                       <Text size="sm">
//                         {indent.item_type} - {indent.item_subtype}
//                       </Text>
//                     </Card>
//                   </Grid.Col>
//                   <Grid.Col span={4}>
//                     <Card withBorder p="md">
//                       <Text weight={500}>Budgetary Head</Text>
//                       <Text size="sm">{indent.budgetary_head}</Text>
//                     </Card>
//                   </Grid.Col>
//                   <Grid.Col span={4}>
//                     <Card withBorder p="md">
//                       <Text weight={500}>Expected Delivery</Text>
//                       <Text size="sm">
//                         {dayjs(indent.expected_delivery).format("MMM D, YYYY")}
//                       </Text>
//                     </Card>
//                   </Grid.Col>
//                 </Grid>
//               </Grid.Col>
//               <Grid.Col span={12}>
//                 <Card withBorder p="md">
//                   <Text weight={500} mb="xs">
//                     Sources of Supply
//                   </Text>
//                   <Text size="sm">{indent.sources_of_supply}</Text>
//                 </Card>
//               </Grid.Col>
//             </Grid>
//           </Accordion.Panel>
//         </Accordion.Item>
//       </Accordion>

//       {/* Forward Section */}
//       <Paper shadow="sm" p="lg" radius="md">
//         <Title order={3} mb="lg">
//           Forward Indent
//         </Title>
//         <Grid>
//           <Grid.Col span={12}>
//             <Textarea
//               label="Remarks"
//               placeholder="Add your remarks here..."
//               minRows={4}
//               value={formValues.remark}
//               onChange={handleInputChange("remark")}
//               icon={<IconMessageDots size={14} />}
//             />
//           </Grid.Col>
//           <Grid.Col span={12}>
//             <Select
//               label="Forward To"
//               placeholder="Select receiver"
//               value={selectedUser}
//               onChange={setSelectedUser}
//               data={filteredUsers.map((user) => ({
//                 value: user.username,
//                 label: user.username,
//               }))}
//               onSearchChange={handleSearchChange} // Trigger when user types
//               searchable
//               clearable
//             />
//           </Grid.Col>

//           <Grid.Col sm={12}>
//             <Select
//               label="Receiver Designation"
//               placeholder="Select designation"
//               data={designations.map((designation) => ({
//                 value: designation,
//                 label: designation,
//               }))}
//               value={formValues.receiverDesignation}
//               onChange={handleDesignationChange} // Update designation on selection
//               searchable
//               clearable
//             />
//           </Grid.Col>

//           <Grid.Col span={12}>
//             {/* <FileInput
//               label="Attachments"
//               placeholder="Upload files"
//               accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//               icon={<IconPaperclip size={14} />}
//               value={attachment}
//               onChange={setAttachment}
//             /> */}
//             <FileInput
//               label="File Upload"
//               placeholder="Upload file"
//               onChange={setFile}
//               icon={<IconPaperclip size={14} />}
//               accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//             />
//           </Grid.Col>
//           <Grid.Col span={12}>
//             <Group position="right">
//               <Button
//                 variant="filled"
//                 color="green"
//                 size="md"
//                 leftIcon={<IconSend size={20} />}
//                 onClick={handleSubmit}
//               >
//                 Submit
//               </Button>
//             </Group>
//           </Grid.Col>
//         </Grid>
//       </Paper>
//     </Container>
//   );
// }

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Title,
  Group,
  Badge,
  Text,
  Grid,
  Card,
  Button,
  Textarea,
  Select,
  FileInput,
  Timeline,
  Accordion,
} from "@mantine/core";
import {
  IconFileDescription,
  IconPaperclip,
  IconSend,
  IconCheck,
  IconClock,
  IconMessageDots,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  forwardIndentRoute,
  getDesignationsRoute,
  viewIndentRoute,
} from "../../routes/purchaseRoutes";

export default function NewForwardIndent() {
  const [file, setFile] = useState(null);
  const [receiverName] = useState("");
  const [designations, setDesignations] = useState([]);
  const navigate = useNavigate();
  const uploader_username = useSelector((state) => state.user.roll_no);
  const role = useSelector((state) => state.user.role);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  const { indentID } = useParams();
  const [indent, setIndent] = useState(null);
  // const [fileInfo, setFileInfo] = useState(null);
  // const [department, setDepartment] = useState("");

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
    role: "",
  });

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/purchase-and-store/api/user-suggestions",
      );
      setUsers(response.data.users);
      setFilteredUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching all users", error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchIndentDetails = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        viewIndentRoute,
        { file_id: indentID },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      setIndent(response.data.indent);
      // setFileInfo(response.data.file);
      // setDepartment(response.data.department);
      console.log(response.data.indent);
    } catch (error) {
      console.error("Error fetching indents:", error);
    }
  };

  useEffect(() => {
    if (indentID) {
      fetchIndentDetails(indentID);
    }
  }, []);

  const filterUsers = (searchQuery) => {
    if (searchQuery === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredUsers(filtered);
    }
  };

  const fetchDesignations = async (x) => {
    try {
      const response = await axios.get(getDesignationsRoute(x));
      setDesignations(response.data);
    } catch (error) {
      console.error("Error fetching designations:", error);
    }
  };

  const handleSearchChange = (value) => {
    filterUsers(value);
    fetchDesignations(value);
  };

  const handleInputChange = (field) => (event) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: event.currentTarget.value,
    }));
  };

  const handleDesignationChange = (value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      receiverDesignation: value,
    }));
  };

  const showStockEntryButton = () => {
    return (
      indent?.head_approval &&
      indent?.director_approval &&
      !indent?.financial_approval
    );
  };

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
    data.append("forwardTo", selectedUser);
    data.append("receiverDesignation", formValues.receiverDesignation);
    data.append("receiverName", receiverName);
    data.append("uploaderUsername", uploader_username);
    data.append("role", role);

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(forwardIndentRoute(indentID), data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        },
      });

      console.log("Success:", response.data);
      navigate("/purchase/all_filed_indents");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (!indent) {
    return (
      <Container size="xl" py="xl">
        <Text>Loading...</Text>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Paper shadow="sm" p="md" mb="xl" radius="md">
        <Group position="apart" mb="md">
          <Group>
            <IconFileDescription size={32} />
            <div>
              <Title order={2}>Indent #{indent.file_info}</Title>
              <Text color="dimmed">
                Filed on {dayjs().format("MMMM D, YYYY")}
              </Text>
            </div>
          </Group>
          <Group>
            <Badge size="lg" color={indent.purchased ? "green" : "blue"}>
              {indent.purchased ? "Purchased" : "In Progress"}
            </Badge>
            {indent.revised && (
              <Badge size="lg" color="yellow">
                Revised
              </Badge>
            )}
            {showStockEntryButton() && (
              <Button
                color="green"
                onClick={() =>
                  navigate(`/purchase/stock_entry/`, { state: indent })
                }
              >
                Stock Entry
              </Button>
            )}
          </Group>
        </Group>

        <Timeline active={1} bulletSize={24} lineWidth={2}>
          <Timeline.Item
            bullet={
              indent.head_approval ? (
                <IconCheck size={12} />
              ) : (
                <IconClock size={12} />
              )
            }
            title="Head Approval"
          >
            <Text color="dimmed" size="sm">
              Department head approval status
            </Text>
          </Timeline.Item>
          <Timeline.Item
            bullet={
              indent?.director_approval ? (
                <IconCheck size={12} />
              ) : (
                <IconClock size={12} />
              )
            }
            title="Director Approval"
          >
            <Text color="dimmed" size="sm">
              Director approval status
            </Text>
          </Timeline.Item>
          <Timeline.Item
            bullet={
              indent?.financial_approval ? (
                <IconCheck size={12} color="blue" />
              ) : (
                <IconClock size={12} />
              )
            }
            title="Bill Approval"
          >
            <Text color="dimmed" size="sm">
              Financial clearance status
            </Text>
          </Timeline.Item>
        </Timeline>
      </Paper>

      <Title order={3} mb="md">
        Indent Items
      </Title>
      <Accordion variant="contained" radius="md" mb="xl">
        <Accordion.Item value={indent.file_info.toString()}>
          <Accordion.Control>
            <Group position="apart">
              <Group>
                <Text weight={500}>{indent.item_name}</Text>
                <Badge>Qty: {indent.quantity}</Badge>
              </Group>
              <Text weight={500} color="blue">
                ₹{indent.estimated_cost.toLocaleString()}
              </Text>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Grid>
              <Grid.Col span={6}>
                <Card withBorder p="md">
                  <Text weight={500} mb="xs">
                    Specifications
                  </Text>
                  <Text size="sm">{indent.specification}</Text>
                </Card>
              </Grid.Col>
              <Grid.Col span={6}>
                <Card withBorder p="md">
                  <Text weight={500} mb="xs">
                    Purpose
                  </Text>
                  <Text size="sm">{indent.purpose}</Text>
                </Card>
              </Grid.Col>
              <Grid.Col span={12}>
                <Grid>
                  <Grid.Col span={3}>
                    <Card withBorder p="md">
                      <Text weight={500}>Item Nature</Text>
                      <Badge color={indent.nature ? "green" : "red"}>
                        {indent.nature ? "Yes" : "No"}
                      </Badge>
                    </Card>
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <Card withBorder p="md">
                      <Text weight={500}>Replaced</Text>
                      <Badge color={indent.replaced ? "green" : "red"}>
                        {indent.replaced ? "Yes" : "No"}
                      </Badge>
                    </Card>
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <Card withBorder p="md">
                      <Text weight={500}>Indigenous</Text>
                      <Badge color={indent.indigenous ? "green" : "red"}>
                        {indent.indigenous ? "Yes" : "No"}
                      </Badge>
                    </Card>
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <Card withBorder p="md">
                      <Text weight={500}>Present Stock</Text>
                      <Text size="sm">{indent.present_stock}</Text>
                    </Card>
                  </Grid.Col>
                </Grid>
              </Grid.Col>
              <Grid.Col span={12}>
                <Grid>
                  <Grid.Col span={4}>
                    <Card withBorder p="md">
                      <Text weight={500}>Type</Text>
                      <Text size="sm">
                        {indent.item_type} - {indent.item_subtype}
                      </Text>
                    </Card>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Card withBorder p="md">
                      <Text weight={500}>Budgetary Head</Text>
                      <Text size="sm">{indent.budgetary_head}</Text>
                    </Card>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Card withBorder p="md">
                      <Text weight={500}>Expected Delivery</Text>
                      <Text size="sm">
                        {dayjs(indent.expected_delivery).format("MMM D, YYYY")}
                      </Text>
                    </Card>
                  </Grid.Col>
                </Grid>
              </Grid.Col>
              <Grid.Col span={12}>
                <Card withBorder p="md">
                  <Text weight={500} mb="xs">
                    Sources of Supply
                  </Text>
                  <Text size="sm">{indent.sources_of_supply}</Text>
                </Card>
              </Grid.Col>
            </Grid>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      <Paper shadow="sm" p="lg" radius="md">
        <Title order={3} mb="lg">
          Forward Indent
        </Title>
        <Grid>
          <Grid.Col span={12}>
            <Textarea
              label="Remarks"
              placeholder="Add your remarks here..."
              minRows={4}
              value={formValues.remark}
              onChange={handleInputChange("remark")}
              icon={<IconMessageDots size={14} />}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Select
              label="Forward To"
              placeholder="Select receiver"
              value={selectedUser}
              onChange={setSelectedUser}
              data={filteredUsers.map((user) => ({
                value: user.username,
                label: user.username,
              }))}
              onSearchChange={handleSearchChange}
              searchable
              clearable
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
              onChange={handleDesignationChange}
              searchable
              clearable
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <FileInput
              label="Attachments"
              placeholder="Upload files"
              accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              icon={<IconPaperclip size={14} />}
              onChange={setFile}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Group position="right">
              <Button
                variant="filled"
                color="green"
                size="md"
                leftIcon={<IconSend size={20} />}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Group>
          </Grid.Col>
        </Grid>
      </Paper>
    </Container>
  );
}
