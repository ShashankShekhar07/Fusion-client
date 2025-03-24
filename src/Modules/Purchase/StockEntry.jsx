// import { useState } from "react";
// // import { PiPrinter } from "react-icons/pi";
// import axios from "axios";
// // import { useSelector } from "react-redux";
// import {
//   TextInput,
//   Select,
//   Button,
//   FileInput,
//   Textarea,
//   Center,
//   Paper,
//   // Title,
//   Grid,
//   Flex,
//   Text,
//   Group,
// } from "@mantine/core";
// import { useNavigate } from "react-router-dom";
// import { useForm } from "@mantine/form";
// import { DateInput } from "@mantine/dates";
// import { useSelector } from "react-redux";
// import {
//   createProposalRoute,
//   getDesignationsRoute,
// } from "../../routes/purchaseRoutes";

// function StockEntry() {
//   const [designations, setDesignations] = useState([]);
//   const navigate = useNavigate();
//   const uploader_username = useSelector((state) => state.user);
//   const username = useSelector((state) => state.user.roll_no);
//   const role = useSelector((state) => state.user.role);
//   const [loading, setLoading] = useState(false); // State for loading status
//   const [err, setErr] = useState(null);
//   // console.log(uploader_username);
//   const form = useForm({
//     initialValues: {
//       title: "",
//       description: "",
//       itemName: "",
//       quantity: 0,
//       cost: 0,
//       itemType: "",
//       presentStock: 0,
//       purpose: "",
//       specification: "",
//       itemSubtype: "",
//       budgetaryHead: "",
//       expectedDelivery: null,
//       sourceOfSupply: "",
//       remark: "",
//       forwardTo: "",
//       receiverDesignation: "",
//       receiverName: "",
//       file: null,
//       item_id: "",
//       vendor: "",
//       recieved_date: "",
//       bill: "",
//       dealing_assistant_id: "",
//       location: "",
//     },
//   });
//   const [pid, setPid] = useState("");
//   const [vendor, setVendor] = useState("");
//   const [pquantity, setPquantity] = useState("");
//   const [cat, setCat] = useState("");
//   const [receivedDate, setReceivedDate] = useState("");
//   const [files, setFiles] = useState("");

//   const formatDate = (date) => {
//     if (!date) return null;
//     const d = new Date(date);
//     const year = d.getFullYear();
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const day = String(d.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
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

//   const handleReceiverChange = (value) => {
//     form.setFieldValue("receiverName", value);
//     // setReceiverName(value);
//     fetchDesignations(value);
//   };

//   const handleSubmit = async (values) => {
//     const data = new FormData();
//     data.append("title", values.title);
//     data.append("description", values.description);
//     data.append("item_name", values.itemName);
//     data.append("quantity", values.quantity);
//     data.append("estimated_cost", values.cost);
//     data.append("item_type", values.itemType);
//     data.append("present_stock", values.presentStock);
//     data.append("purpose", values.purpose);
//     data.append("specification", values.specification);
//     data.append("itemSubtype", values.itemSubtype);
//     data.append("budgetary_head", values.budgetaryHead);
//     data.append("expected_delivery", formatDate(values.expectedDelivery));
//     data.append("sources_of_supply", values.sourceOfSupply);
//     data.append("file", values.file);
//     data.append("remark", values.remark);
//     data.append("forwardTo", values.forwardTo);
//     data.append("receiverDesignation", values.receiverDesignation);
//     data.append("receiverName", values.receiverName);
//     data.append("uploaderUsername", uploader_username);
//     data.append("role", role);
//     console.log(data);
//     // console.log("Form data:", data.get("receiverDesignation"));

//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.post(
//         `127.0.0.1:8000/purchase-and-store/api/stockEntry/4322`,
//         data,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Token ${token}`,
//           },
//         },
//       );
//       // navigate("/purchase/");
//       console.log("Success:", response.data);
//     } catch (error) {
//       console.error(
//         "Error:",
//         error.response ? error.response.data : error.message,
//       );
//     }

//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.post(createProposalRoute(role), data, {
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

//   // const handleDraft = async (values) => {
//   //   const data = new FormData();
//   //   data.append("title", values.title);
//   //   data.append("description", values.description);
//   //   data.append("item_name", values.itemName);
//   //   data.append("quantity", values.quantity);
//   //   data.append("estimated_cost", values.cost);
//   //   data.append("item_type", values.itemType);
//   //   data.append("present_stock", values.presentStock);
//   //   data.append("purpose", values.purpose);
//   //   data.append("specification", values.specification);
//   //   data.append("itemSubtype", values.itemSubtype);
//   //   data.append("budgetary_head", values.budgetaryHead);
//   //   data.append("expected_delivery", formatDate(values.expectedDelivery));
//   //   data.append("sources_of_supply", values.sourceOfSupply);
//   //   data.append("file", values.file);
//   //   data.append("remark", values.remark);
//   //   data.append("forwardTo", values.forwardTo);
//   //   data.append("receiverDesignation", values.receiverDesignation);
//   //   data.append("receiverName", values.receiverName);
//   //   console.log("Form data:", data.get("receiverDesignation"));

//   //   try {
//   //     const token = localStorage.getItem("authToken");
//   //     const response = await axios.post(
//   //       "http://127.0.0.1:8000/purchase-and-store/api/create_draft/",
//   //       data,
//   //       {
//   //         headers: {
//   //           "Content-Type": "multipart/form-data",
//   //           Authorization: `Token ${token}`,
//   //         },
//   //       },
//   //     );

//   //     console.log("Success:", response.data);
//   //     navigate("/purchase/saved_indents");
//   //     // navigate("/purchase/saved_indents");
//   //   } catch (error) {
//   //     console.error("Error submitting form:", error);
//   //     // setErrorMessage(
//   //     //   error.response
//   //     //     ? error.response.data
//   //     //     : "An error occurred during submission",
//   //     // );
//   //   }
//   // };

//   const handleme = async () => {
//     // event.preventDefault();
//     const formData = new FormData();

//     formData.append("id", pid); // Assuming pname represents id
//     formData.append("vendor", vendor); // Replace with actual vendor input
//     formData.append("current_stock", pquantity);
//     formData.append("bill", files); // Ensure file is a File object
//     formData.append("location", cat); // Assuming category is location
//     formData.append("recieved_date", receivedDate);
//     formData.append("role", role);
//     setLoading(true);

//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.post(
//         `http://127.0.0.1:8000/purchase-and-store/api/stockEntry/${username}/`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Token ${token}`, // Add token for authentication
//           },
//         },
//       );
//       // navigate("/purchase/");
//       console.log("Success:", response.data);
//       setLoading(false);
//     } catch (error) {
//       setErr(error);
//       console.error(
//         "Error:",
//         error.response ? error.response.data : error.message,
//       );
//       setLoading(false);
//     }
//   };
//   if (loading) {
//     return <Text>Loading...</Text>; // Display loading state
//   }

//   if (err) {
//     return <Text style={{ color: "red" }}>{err.message}</Text>; // Display error message
//   }
//   return (
//     <Center style={{ minHeight: "100vh" }}>
//       {/* <Paper
//         shadow="md"
//         radius="md"
//         p="lg"
//         withBorder
//         style={{
//           maxWidth: "1000px",
//           width: "100%",
//         }}
//       > */}
//       <Paper
//         shadow="md"
//         radius="md"
//         p="lg"
//         withBorder
//         style={{
//           maxWidth: "calc(100% - 64px)", // Ensure the paper takes full width minus the margin (32px on each side)
//           margin: "32px auto", // Add 32px margin on the left and right, and center it
//           width: "100%",
//         }}
//       >
//         <Text
//           size="26px"
//           style={{
//             fontWeight: "bold",
//             textAlign: "center",
//             color: "#1881d9",
//           }}
//         >
//           Stock Entry
//         </Text>

//         {/* {errorMessage && (
//           <div
//             style={{ color: "red", textAlign: "center", marginBottom: "20px" }}
//           >
//             {errorMessage}
//           </div>
//         )} */}

//         <form
//           onSubmit={form.onSubmit(handleSubmit)}
//           style={{ marginRight: "50px", marginLeft: "100px" }}
//         >
//           <Grid>
//             <Grid.Col span={{ base: 16, md: 6, lg: 5 }}>
//               <Flex gap="80px">
//                 <Grid.Col sm={6}>
//                   <TextInput
//                     label="Title of Indent File"
//                     placeholder="Enter title"
//                     value={form.values.title}
//                     onChange={(event) =>
//                       form.setFieldValue("title", event.currentTarget.value)
//                     }
//                   />
//                 </Grid.Col>

//                 <Grid.Col sm={6}>
//                   <TextInput
//                     label="Description"
//                     placeholder="Enter description"
//                     value={form.values.description}
//                     onChange={(event) =>
//                       form.setFieldValue(
//                         "description",
//                         event.currentTarget.value,
//                       )
//                     }
//                   />
//                 </Grid.Col>
//               </Flex>
//               <Flex gap="80px">
//                 <Grid.Col sm={6}>
//                   <TextInput
//                     label="Item Name"
//                     placeholder="Enter item name"
//                     value={form.values.itemName}
//                     onChange={(event) =>
//                       form.setFieldValue("itemName", event.currentTarget.value)
//                     }
//                   />
//                 </Grid.Col>

//                 <Grid.Col sm={6}>
//                   <TextInput
//                     type="number"
//                     label="Quantity"
//                     placeholder="Enter quantity"
//                     value={form.values.quantity}
//                     onChange={(event) => {
//                       form.setFieldValue("quantity", event.target.value);
//                     }}
//                   />
//                 </Grid.Col>
//               </Flex>
//               <Flex gap="80px">
//                 <Grid.Col sm={6}>
//                   <TextInput
//                     type="number"
//                     label="Estimated Cost Per Price"
//                     placeholder="Enter estimated cost"
//                     value={form.values.cost}
//                     onChange={(event) =>
//                       form.setFieldValue("cost", event.currentTarget.value)
//                     }
//                   />
//                 </Grid.Col>

//                 <Grid.Col sm={6}>
//                   <Select
//                     label="Item Type"
//                     placeholder="Select item type"
//                     data={[
//                       { value: "Equipment", label: "Equipment" },
//                       { value: "Consumable", label: "Consumable" },
//                     ]}
//                     value={form.values.itemType}
//                     onChange={(value) => form.setFieldValue("itemType", value)}
//                   />
//                 </Grid.Col>
//               </Flex>
//               <Flex gap="80px">
//                 <Grid.Col sm={6}>
//                   <TextInput
//                     type="number"
//                     label="Present Stock"
//                     placeholder="Enter present stock"
//                     value={form.values.presentStock}
//                     onChange={(event) => {
//                       setPquantity(event.target.value);
//                       form.setFieldValue("presentStock", event.target.value);
//                     }}
//                   />
//                 </Grid.Col>

//                 <Grid.Col sm={6}>
//                   <TextInput
//                     label="Purpose"
//                     placeholder="Enter purpose"
//                     value={form.values.purpose}
//                     onChange={(event) =>
//                       form.setFieldValue("purpose", event.currentTarget.value)
//                     }
//                   />
//                 </Grid.Col>
//               </Flex>
//               <Flex gap="80px">
//                 <Grid.Col sm={6}>
//                   <TextInput
//                     label="Specification"
//                     placeholder="Enter specification"
//                     value={form.values.specification}
//                     onChange={(event) =>
//                       form.setFieldValue(
//                         "specification",
//                         event.currentTarget.value,
//                       )
//                     }
//                   />
//                 </Grid.Col>

//                 <Grid.Col sm={6}>
//                   <TextInput
//                     label="Item Subtype"
//                     placeholder="Enter item subtype"
//                     value={form.values.itemSubtype}
//                     onChange={(event) =>
//                       form.setFieldValue(
//                         "itemSubtype",
//                         event.currentTarget.value,
//                       )
//                     }
//                   />
//                 </Grid.Col>
//               </Flex>
//               <Flex gap="80px">
//                 <Grid.Col sm={6}>
//                   <TextInput
//                     label="Budgetary Head"
//                     placeholder="Enter budgetary head"
//                     value={form.values.budgetaryHead}
//                     onChange={(event) =>
//                       form.setFieldValue(
//                         "budgetaryHead",
//                         event.currentTarget.value,
//                       )
//                     }
//                   />
//                 </Grid.Col>

//                 <Grid.Col sm={6}>
//                   <DateInput
//                     label="Expected Delivery"
//                     placeholder="Pick a date"
//                     value={form.values.expectedDelivery}
//                     onChange={(date) =>
//                       form.setFieldValue("expectedDelivery", date)
//                     }
//                   />
//                 </Grid.Col>
//               </Flex>

//               <Flex gap="80px">
//                 <Grid.Col sm={6}>
//                   <TextInput
//                     label="Product_id"
//                     placeholder="Enter product_id"
//                     value={pid}
//                     onChange={(e) => setPid(e.target.value)}
//                     type="number"
//                     required
//                   />
//                 </Grid.Col>

//                 <Grid.Col sm={6}>
//                   <TextInput
//                     label="Vendor name"
//                     placeholder="Enter vendor name"
//                     value={vendor}
//                     onChange={(e) => setVendor(e.target.value)}
//                     required
//                   />
//                 </Grid.Col>
//               </Flex>

//               <Flex gap="80px">
//                 <Grid.Col sm={6}>
//                   <TextInput
//                     label="Location"
//                     placeholder="Enter location"
//                     value={cat}
//                     onChange={(e) => setCat(e.target.value)}
//                   />
//                 </Grid.Col>

//                 <Grid.Col sm={6}>
//                   <Group align="flex-start" position="apart" grow>
//                     <TextInput
//                       label="Received Date"
//                       value={receivedDate}
//                       onChange={(e) => setReceivedDate(e.target.value)}
//                       type="date" // Use date input
//                       required
//                       style={{ flexGrow: 1 }}
//                     />
//                   </Group>

//                   {/* <DateInput
//                     label="Received Date"
//                     placeholder="Enter recieved Date"
//                     value={receivedDate}
//                     onChange={(e) => setReceivedDate(e.target.value)}
//                   /> */}
//                 </Grid.Col>
//               </Flex>

//               <Flex gap="80px">
//                 <Grid.Col sm={6}>
//                   <TextInput
//                     label="Source of Supply"
//                     placeholder="Enter source of supply"
//                     value={form.values.sourceOfSupply}
//                     onChange={(event) =>
//                       form.setFieldValue(
//                         "sourceOfSupply",
//                         event.currentTarget.value,
//                       )
//                     }
//                   />
//                 </Grid.Col>

//                 <Grid.Col sm={6}>
//                   <Textarea
//                     label="Remark"
//                     placeholder="Enter remark"
//                     value={form.values.remark}
//                     onChange={(event) =>
//                       form.setFieldValue("remark", event.currentTarget.value)
//                     }
//                   />
//                 </Grid.Col>
//               </Flex>
//             </Grid.Col>
//             <Grid.Col sm={6}>
//               <FileInput
//                 label="Bill Upload"
//                 placeholder="Upload file"
//                 value={form.values.file}
//                 onChange={(file) => {
//                   setFiles(file);
//                   form.setFieldValue("file", file);
//                 }}
//                 accept="application/pdf,image/jpeg,image/png"
//               />
//             </Grid.Col>

//             <Grid.Col sm={6}>
//               <Button
//                 type="button"
//                 color="green"
//                 onClick={form.onSubmit(handleme)}
//                 style={{ float: "right" }}
//               >
//                 Stock Entry
//               </Button>
//             </Grid.Col>

//             <Grid.Col sm={6}>
//               <TextInput
//                 label="Forward To"
//                 placeholder="Enter forward to"
//                 value={form.values.forwardTo}
//                 onChange={(event) =>
//                   form.setFieldValue("forwardTo", event.currentTarget.value)
//                 }
//               />
//             </Grid.Col>

//             <Grid.Col sm={6}>
//               <TextInput
//                 label="Receiver Name"
//                 placeholder="Enter receiver name"
//                 value={form.values.receiverName}
//                 onChange={(event) =>
//                   handleReceiverChange(event.currentTarget.value)
//                 }
//               />
//             </Grid.Col>

//             <Grid.Col sm={6}>
//               <Select
//                 label="Receiver Designation"
//                 placeholder="Select designation"
//                 data={designations.map((designation) => ({
//                   value: designation,
//                   label: designation,
//                 }))}
//                 value={form.values.receiverDesignation}
//                 onChange={(value) =>
//                   form.setFieldValue("receiverDesignation", value)
//                 }
//                 searchable
//                 clearable
//               />
//             </Grid.Col>

//             <Grid.Col sm={6}>
//               <Button type="submit" color="green" style={{ float: "right" }}>
//                 Submit Indent
//               </Button>
//             </Grid.Col>
//           </Grid>
//         </form>
//       </Paper>
//     </Center>
//   );
// }

// export default StockEntry;

import { useState, useEffect } from "react";
// import { PiPrinter } from "react-icons/pi";
import axios from "axios";
// import { useSelector } from "react-redux";
import {
  TextInput,
  Select,
  Button,
  FileInput,
  Textarea,
  Center,
  Paper,
  // Box,
  // Title,
  Grid,
  Flex,
  Text,
  Group,
} from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import { useSelector } from "react-redux";
import {
  createProposalRoute,
  getDesignationsRoute,
} from "../../routes/purchaseRoutes";
import { host } from "../../routes/globalRoutes";

function StockEntry() {
  const [designations, setDesignations] = useState([]);
  const navigate = useNavigate();
  const uploader_username = useSelector((state) => state.user);
  const username = useSelector((state) => state.user.roll_no);
  const role = useSelector((state) => state.user.role);
  const [loading, setLoading] = useState(false); // State for loading status
  const [err, setErr] = useState(null);
  // console.log(uploader_username);
  const location = useLocation();
  const indentData = location.state || {};
  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      itemName: indentData.item_name || "",
      quantity: indentData.quantity || "",
      cost: indentData.estimated_cost || "",
      itemType: indentData.item_type || "",
      presentStock: indentData.present_stock || "",
      purpose: indentData.purpose || "",
      specification: indentData.specification || "",
      itemSubtype: indentData.item_subtype || "",
      budgetaryHead: indentData.budgetary_head || "",
      expectedDelivery: "",
      sourceOfSupply: indentData.sources_of_supply || "",
      remark: "",
      forwardTo: "",
      receiverDesignation: "",
      receiverName: "",
      file: null,
      item_id: "",
      vendor: "",
      recieved_date: "",
      bill: "",
      dealing_assistant_id: "",
      location: "",
    },
  });
  const [pid, setPid] = useState("");
  const [vendor, setVendor] = useState("");
  const [pquantity, setPquantity] = useState(0);
  const [cat, setCat] = useState("");
  const [receivedDate, setReceivedDate] = useState("");
  const [files, setFiles] = useState("");

  const [users, setUsers] = useState([]); // Store all users data here
  const [filteredUsers, setFilteredUsers] = useState([]); // Store filtered users
  const [selectedUser, setSelectedUser] = useState(""); // Selected user from dropdown

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(
        `${host}/purchase-and-store/api/user-suggestions`,
      );
      setUsers(response.data.users); // Save all users data to state
      setFilteredUsers(response.data.users); // Initially, show all users
    } catch (error) {
      console.error("Error fetching all users", error);
    }
  };

  useEffect(() => {
    console.log(indentData);
    fetchAllUsers(); // Fetch all users on mount
  }, []);

  useEffect(() => {
    if (location.state) {
      console.log("Received Item:", location.state.item); // Debugging
      form.setValues({
        title: "",
        description: "",
        itemName: location.state.item.item_name || "",
        quantity: location.state.item.quantity || "",
        cost: location.state.item.estimated_cost || "",
        itemType: location.state.item.item_type || "",
        presentStock: location.state.item.present_stock || "",
        purpose: location.state.item.purpose || "",
        specification: location.state.item.specification || "",
        itemSubtype: location.state.item.item_subtype || "",
        budgetaryHead: location.state.item.budgetary_head || "",
        expectedDelivery: "",
        sourceOfSupply: location.state.item.sources_of_supply || "",
        remark: "",
        forwardTo: "",
        receiverDesignation: "",
        receiverName: "",
        file: null,
        item_id: location.state.item.id || "",
        vendor: "",
        recieved_date: "",
        bill: "",
        dealing_assistant_id: "",
        location: "",
      });
    }
  }, [location.state]); // ✅ Runs when location.state changes

  useEffect(() => {
    // if (formData) {
    form.setValues({
      title: "",
      description: "",
      itemName: indentData.item.item_name || "",
      quantity: indentData.item.quantity || "",
      cost: indentData.item.estimated_cost || "",
      itemType: indentData.item.item_type || "",
      presentStock: indentData.item.presentStock || "",
      purpose: indentData.item.purpose || "",
      specification: indentData.item.specification || "",
      itemSubtype: indentData.item.item_subtype || "",
      budgetaryHead: indentData.item.budgetary_head || "",
      expectedDelivery: "",
      sourceOfSupply: indentData.item.sources_of_supply || "",
      remark: "",
      forwardTo: "",
      receiverDesignation: "",
      receiverName: "",
      file: null,
      item_id: indentData.item.item_id || "",
      vendor: "",
      recieved_date: "",
      bill: "",
      dealing_assistant_id: "",
      location: "",
    });
    // }
  }, [indentData]);
  // console.log("Users:", users);
  // Handle search input change

  // Filter users based on the query
  const filterUsers = (searchQuery) => {
    if (searchQuery === "") {
      setFilteredUsers(users); // If query is empty, show all users
    } else {
      const filtered = users.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredUsers(filtered); // Set the filtered users
    }
  };
  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Fetch designations based on the entered receiver name
  // eslint-disable-next-line no-shadow
  const fetchDesignations = async (receiverName) => {
    try {
      const response = await axios.get(getDesignationsRoute(receiverName));
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
  const handleSearchChange = (value) => {
    filterUsers(value);
    fetchDesignations(value);
  };
  // const handleReceiverChange = (value) => {
  //   form.setFieldValue("receiverName", value);
  //   // setReceiverName(value);
  //   fetchDesignations(value);
  // };

  const handleSubmit = async (values) => {
    const data = new FormData();
    data.append("title", values.title);
    data.append("description", values.description);
    data.append("item_name", values.itemName);
    data.append("quantity", values.quantity);
    data.append("estimated_cost", values.cost);
    data.append("item_type", values.itemType);
    data.append("current_stock", values.presentStock);
    data.append("purpose", values.purpose);
    data.append("specification", values.specification);
    data.append("itemSubtype", values.itemSubtype);
    data.append("budgetary_head", values.budgetaryHead);
    data.append("expected_delivery", formatDate(values.expectedDelivery));
    data.append("sources_of_supply", values.sourceOfSupply);
    data.append("file", values.file);
    data.append("remark", values.remark);
    data.append("forwardTo", selectedUser);
    data.append("receiverDesignation", values.receiverDesignation);
    data.append("receiverName", values.receiverName);
    data.append("uploaderUsername", uploader_username);
    data.append("role", role);
    console.log(data);
    // console.log("Form data:", data.get("receiverDesignation"));

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${host}/purchase-and-store/api/stockEntry/4322`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${token}`,
          },
        },
      );
      // navigate("/purchase/");
      console.log("Success:", response.data);
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message,
      );
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(createProposalRoute(role), data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        },
      });

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

  // const handleDraft = async (values) => {
  //   const data = new FormData();
  //   data.append("title", values.title);
  //   data.append("description", values.description);
  //   data.append("item_name", values.itemName);
  //   data.append("quantity", values.quantity);
  //   data.append("estimated_cost", values.cost);
  //   data.append("item_type", values.itemType);
  //   data.append("present_stock", values.presentStock);
  //   data.append("purpose", values.purpose);
  //   data.append("specification", values.specification);
  //   data.append("itemSubtype", values.itemSubtype);
  //   data.append("budgetary_head", values.budgetaryHead);
  //   data.append("expected_delivery", formatDate(values.expectedDelivery));
  //   data.append("sources_of_supply", values.sourceOfSupply);
  //   data.append("file", values.file);
  //   data.append("remark", values.remark);
  //   data.append("forwardTo", values.forwardTo);
  //   data.append("receiverDesignation", values.receiverDesignation);
  //   data.append("receiverName", values.receiverName);
  //   console.log("Form data:", data.get("receiverDesignation"));

  //   try {
  //     const token = localStorage.getItem("authToken");
  //     const response = await axios.post(
  //       "http://127.0.0.1:8000/purchase-and-store/api/create_draft/",
  //       data,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Token ${token}`,
  //         },
  //       },
  //     );

  //     console.log("Success:", response.data);
  //     navigate("/purchase/saved_indents");
  //     // navigate("/purchase/saved_indents");
  //   } catch (error) {
  //     console.error("Error submitting form:", error);
  //     // setErrorMessage(
  //     //   error.response
  //     //     ? error.response.data
  //     //     : "An error occurred during submission",
  //     // );
  //   }
  // };

  const handleme = async () => {
    // event.preventDefault();
    const formData = new FormData();

    formData.append("id", pid); // Assuming pname represents id
    formData.append("vendor", vendor); // Replace with actual vendor input
    formData.append("current_stock", pquantity);
    formData.append("bill", files); // Ensure file is a File object
    formData.append("location", cat); // Assuming category is location
    formData.append("received_date", receivedDate);
    formData.append("role", role);
    setLoading(true);
    console.log(formData);
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${host}/purchase-and-store/api/stockEntry/${username}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${token}`, // Add token for authentication
          },
        },
      );
      // navigate("/purchase/");
      console.log("Success:", response.data);
      setLoading(false);
    } catch (error) {
      setErr(error);
      console.error(
        "Error:",
        error.response ? error.response.data : error.message,
      );
      setLoading(false);
    }
  };
  if (loading) {
    return <Text>Loading...</Text>; // Display loading state
  }

  if (err) {
    return <Text style={{ color: "red" }}>{err.message}</Text>; // Display error message
  }
  return (
    <Center style={{ minHeight: "100vh" }}>
      {/* <Paper
        shadow="md"
        radius="md"
        p="lg"
        withBorder
        style={{
          maxWidth: "1000px",
          width: "100%",
        }}
      > */}
      <Paper
        shadow="md"
        radius="md"
        p="lg"
        withBorder
        style={{
          maxWidth: "calc(100% - 64px)", // Ensure the paper takes full width minus the margin (32px on each side)
          margin: "32px auto", // Add 32px margin on the left and right, and center it
          width: "100%",
        }}
      >
        <Text
          size="26px"
          style={{
            fontWeight: "bold",
            textAlign: "center",
            color: "#1881d9",
          }}
        >
          Stock Entry
        </Text>

        {/* {errorMessage && (
          <div
            style={{ color: "red", textAlign: "center", marginBottom: "20px" }}
          >
            {errorMessage}
          </div>
        )} */}

        <form
          onSubmit={form.onSubmit(handleSubmit)}
          style={{ marginRight: "50px", marginLeft: "100px" }}
        >
          <Grid>
            <Grid.Col span={{ base: 16, md: 6, lg: 5 }}>
              <Flex gap="80px">
                <Grid.Col sm={6}>
                  <TextInput
                    label="Title of Indent File"
                    placeholder="Enter title"
                    value={form.values.title}
                    onChange={(event) =>
                      form.setFieldValue("title", event.currentTarget.value)
                    }
                  />
                </Grid.Col>

                <Grid.Col sm={6}>
                  <TextInput
                    label="Description"
                    placeholder="Enter description"
                    value={form.values.description}
                    onChange={(event) =>
                      form.setFieldValue(
                        "description",
                        event.currentTarget.value,
                      )
                    }
                  />
                </Grid.Col>
              </Flex>
              <Flex gap="80px">
                <Grid.Col sm={6}>
                  <TextInput
                    label="Item Name"
                    placeholder="Enter item name"
                    value={form.values.itemName}
                    onChange={(event) =>
                      form.setFieldValue("itemName", event.currentTarget.value)
                    }
                  />
                </Grid.Col>

                <Grid.Col sm={6}>
                  <TextInput
                    type="number"
                    label="Quantity"
                    placeholder="Enter quantity"
                    value={form.values.quantity}
                    onChange={(event) => {
                      form.setFieldValue("quantity", event.target.value);
                    }}
                  />
                </Grid.Col>
              </Flex>
              <Flex gap="80px">
                <Grid.Col sm={6}>
                  <TextInput
                    type="number"
                    label="Estimated Cost Per Price"
                    placeholder="Enter estimated cost"
                    value={form.values.cost}
                    onChange={(event) =>
                      form.setFieldValue("cost", event.currentTarget.value)
                    }
                  />
                </Grid.Col>

                <Grid.Col sm={6}>
                  <Select
                    label="Item Type"
                    placeholder="Select item type"
                    data={[
                      { value: "Equipment", label: "Equipment" },
                      { value: "Consumable", label: "Consumable" },
                    ]}
                    value={form.values.itemType}
                    onChange={(value) => form.setFieldValue("itemType", value)}
                  />
                </Grid.Col>
              </Flex>
              <Flex gap="80px">
                <Grid.Col sm={6}>
                  <TextInput
                    type="number"
                    label="Present Stock"
                    placeholder="Enter present stock"
                    value={form.values.presentStock}
                    onChange={(event) => {
                      setPquantity(event.target.value);
                      form.setFieldValue("presentStock", event.target.value);
                    }}
                  />
                </Grid.Col>

                <Grid.Col sm={6}>
                  <TextInput
                    label="Purpose"
                    placeholder="Enter purpose"
                    value={form.values.purpose}
                    onChange={(event) =>
                      form.setFieldValue("purpose", event.currentTarget.value)
                    }
                  />
                </Grid.Col>
              </Flex>
              <Flex gap="80px">
                <Grid.Col sm={6}>
                  <TextInput
                    label="Specification"
                    placeholder="Enter specification"
                    value={form.values.specification}
                    onChange={(event) =>
                      form.setFieldValue(
                        "specification",
                        event.currentTarget.value,
                      )
                    }
                  />
                </Grid.Col>

                <Grid.Col sm={6}>
                  <TextInput
                    label="Item Subtype"
                    placeholder="Enter item subtype"
                    value={form.values.itemSubtype}
                    onChange={(event) =>
                      form.setFieldValue(
                        "itemSubtype",
                        event.currentTarget.value,
                      )
                    }
                  />
                </Grid.Col>
              </Flex>
              <Flex gap="80px">
                <Grid.Col sm={6}>
                  <TextInput
                    label="Budgetary Head"
                    placeholder="Enter budgetary head"
                    value={form.values.budgetaryHead}
                    onChange={(event) =>
                      form.setFieldValue(
                        "budgetaryHead",
                        event.currentTarget.value,
                      )
                    }
                  />
                </Grid.Col>

                <Grid.Col sm={6}>
                  <DateInput
                    label="Expected Delivery Date"
                    placeholder="Pick a date"
                    value={form.values.expectedDelivery}
                    onChange={(date) =>
                      form.setFieldValue("expectedDelivery", date)
                    }
                  />
                </Grid.Col>
              </Flex>

              <Flex gap="80px">
                <Grid.Col sm={6}>
                  <TextInput
                    label="Product_id"
                    placeholder="Enter product_id"
                    value={pid}
                    onChange={(e) => setPid(e.target.value)}
                    type="number"
                    required
                  />
                </Grid.Col>

                <Grid.Col sm={6}>
                  <TextInput
                    label="Vendor name"
                    placeholder="Enter vendor name"
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    required
                  />
                </Grid.Col>
              </Flex>

              <Flex gap="80px">
                <Grid.Col sm={6}>
                  <TextInput
                    label="Location"
                    placeholder="Enter location"
                    value={cat}
                    onChange={(e) => setCat(e.target.value)}
                  />
                </Grid.Col>

                <Grid.Col sm={6}>
                  <Group align="flex-start" position="apart" grow>
                    <TextInput
                      label="Received Date"
                      value={receivedDate}
                      onChange={(e) => setReceivedDate(e.target.value)}
                      type="date" // Use date input
                      required
                      style={{ flexGrow: 1 }}
                    />
                  </Group>

                  {/* <DateInput
                    label="Received Date"
                    placeholder="Enter recieved Date"
                    value={receivedDate}
                    onChange={(e) => setReceivedDate(e.target.value)}
                  /> */}
                </Grid.Col>
              </Flex>

              <Flex gap="80px">
                <Grid.Col sm={6}>
                  <TextInput
                    label="Source of Supply"
                    placeholder="Enter source of supply"
                    value={form.values.sourceOfSupply}
                    onChange={(event) =>
                      form.setFieldValue(
                        "sourceOfSupply",
                        event.currentTarget.value,
                      )
                    }
                  />
                </Grid.Col>

                <Grid.Col sm={6}>
                  <Textarea
                    label="Remark"
                    placeholder="Enter remark"
                    value={form.values.remark}
                    onChange={(event) =>
                      form.setFieldValue("remark", event.currentTarget.value)
                    }
                  />
                </Grid.Col>
              </Flex>
            </Grid.Col>
            <Grid.Col sm={6}>
              <FileInput
                label="Bill Upload"
                placeholder="Upload file"
                value={form.values.file}
                onChange={(file) => {
                  setFiles(file);
                  form.setFieldValue("file", file);
                }}
                accept="application/pdf,image/jpeg,image/png"
              />
            </Grid.Col>

            <Grid.Col sm={6}>
              <Button
                type="button"
                color="green"
                onClick={form.onSubmit(handleme)}
                style={{ float: "right" }}
              >
                Stock Entry
              </Button>
            </Grid.Col>

            <Grid.Col xs={12} sm={6}>
              <Select
                label="Forward To"
                placeholder="Select receiver"
                value={selectedUser}
                onChange={setSelectedUser}
                data={filteredUsers.map((user) => ({
                  value: user.username,
                  label: user.username,
                }))}
                onSearchChange={handleSearchChange} // Trigger when user types
                searchable
                clearable
              />
            </Grid.Col>

            {/* <Grid.Col sm={6}>
              <TextInput
                label="Receiver Name"
                placeholder="Enter receiver name"
                value={form.values.receiverName}
                onChange={(event) =>
                  handleReceiverChange(event.currentTarget.value)
                }
              />
            </Grid.Col> */}

            <Grid.Col sm={6}>
              <Select
                label="Receiver Designation"
                placeholder="Select designation"
                data={designations.map((designation) => ({
                  value: designation,
                  label: designation,
                }))}
                value={form.values.receiverDesignation}
                onChange={(value) =>
                  form.setFieldValue("receiverDesignation", value)
                }
                searchable
                clearable
              />
            </Grid.Col>

            <Grid.Col sm={6}>
              <Button type="submit" color="green" style={{ float: "right" }}>
                Submit Indent
              </Button>
            </Grid.Col>
          </Grid>
        </form>
      </Paper>
    </Center>
  );
}

export default StockEntry;

// import { useState } from "react";
// // import { PiPrinter } from "react-icons/pi";
// import axios from "axios";
// // import { useSelector } from "react-redux";
// import {
//   TextInput,
//   Select,
//   Button,
//   FileInput,
//   Textarea,
//   Center,
//   Paper,
//   Title,
//   Grid,
//   Flex,
//   Group,
// } from "@mantine/core";
// import { useNavigate } from "react-router-dom";
// import { useForm } from "@mantine/form";
// import { DateInput } from "@mantine/dates";
// import { useSelector } from "react-redux";
// import {
//   createProposalRoute,
//   getDesignationsRoute,
// } from "../../routes/purchaseRoutes";

// function StockEntry() {
//   const [designations, setDesignations] = useState([]);
//   const navigate = useNavigate();
//   const uploader_username = useSelector((state) => state.user);
//   // const username = useSelector((state) => state.user.roll_no);
//   const role = useSelector((state) => state.user.role);
//   // console.log(uploader_username);
//   const form = useForm({
//     initialValues: {
//       title: "",
//       description: "",
//       itemName: "",
//       quantity: 0,
//       cost: 0,
//       itemType: "",
//       presentStock: 0,
//       purpose: "",
//       specification: "",
//       itemSubtype: "",
//       budgetaryHead: "",
//       expectedDelivery: null,
//       sourceOfSupply: "",
//       remark: "",
//       forwardTo: "",
//       receiverDesignation: "",
//       receiverName: "",
//       file: null,
//       item_id: "",
//       vendor: "",
//       recieved_date: "",
//       bill: "",
//       dealing_assistant_id: "",
//       location: "",
//     },
//   });
//   const [pid, setPid] = useState("");
//   const [vendor, setVendor] = useState("");
//   const [pquantity, setPquantity] = useState("");
//   const [cat, setCat] = useState("");
//   const [receivedDate, setReceivedDate] = useState("");
//   const [files, setFiles] = useState("");

//   const formatDate = (date) => {
//     if (!date) return null;
//     const d = new Date(date);
//     const year = d.getFullYear();
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const day = String(d.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
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

//   const handleReceiverChange = (value) => {
//     form.setFieldValue("receiverName", value);
//     // setReceiverName(value);
//     fetchDesignations(value);
//   };

//   const handleSubmit = async (values) => {
//     const data = new FormData();
//     data.append("title", values.title);
//     data.append("description", values.description);
//     data.append("item_name", values.itemName);
//     data.append("quantity", values.quantity);
//     data.append("estimated_cost", values.cost);
//     data.append("item_type", values.itemType);
//     data.append("present_stock", values.presentStock);
//     data.append("purpose", values.purpose);
//     data.append("specification", values.specification);
//     data.append("itemSubtype", values.itemSubtype);
//     data.append("budgetary_head", values.budgetaryHead);
//     data.append("expected_delivery", formatDate(values.expectedDelivery));
//     data.append("sources_of_supply", values.sourceOfSupply);
//     data.append("file", values.file);
//     data.append("remark", values.remark);
//     data.append("forwardTo", values.forwardTo);
//     data.append("receiverDesignation", values.receiverDesignation);
//     data.append("receiverName", values.receiverName);
//     data.append("uploaderUsername", uploader_username);
//     data.append("role", role);
//     console.log(data);
//     // console.log("Form data:", data.get("receiverDesignation"));

//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.post(
//         `127.0.0.1:8000/purchase-and-store/api/stockEntry/4322`,
//         data,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Token ${token}`,
//           },
//         },
//       );
//       // navigate("/purchase/");
//       console.log("Success:", response.data);
//     } catch (error) {
//       console.error(
//         "Error:",
//         error.response ? error.response.data : error.message,
//       );
//     }

//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.post(createProposalRoute(role), data, {
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

//   // const handleDraft = async (values) => {
//   //   const data = new FormData();
//   //   data.append("title", values.title);
//   //   data.append("description", values.description);
//   //   data.append("item_name", values.itemName);
//   //   data.append("quantity", values.quantity);
//   //   data.append("estimated_cost", values.cost);
//   //   data.append("item_type", values.itemType);
//   //   data.append("present_stock", values.presentStock);
//   //   data.append("purpose", values.purpose);
//   //   data.append("specification", values.specification);
//   //   data.append("itemSubtype", values.itemSubtype);
//   //   data.append("budgetary_head", values.budgetaryHead);
//   //   data.append("expected_delivery", formatDate(values.expectedDelivery));
//   //   data.append("sources_of_supply", values.sourceOfSupply);
//   //   data.append("file", values.file);
//   //   data.append("remark", values.remark);
//   //   data.append("forwardTo", values.forwardTo);
//   //   data.append("receiverDesignation", values.receiverDesignation);
//   //   data.append("receiverName", values.receiverName);
//   //   console.log("Form data:", data.get("receiverDesignation"));

//   //   try {
//   //     const token = localStorage.getItem("authToken");
//   //     const response = await axios.post(
//   //       "http://127.0.0.1:8000/purchase-and-store/api/create_draft/",
//   //       data,
//   //       {
//   //         headers: {
//   //           "Content-Type": "multipart/form-data",
//   //           Authorization: Token ${token},
//   //         },
//   //       },
//   //     );

//   //     console.log("Success:", response.data);
//   //     navigate("/purchase/saved_indents");
//   //     // navigate("/purchase/saved_indents");
//   //   } catch (error) {
//   //     console.error("Error submitting form:", error);
//   //     // setErrorMessage(
//   //     //   error.response
//   //     //     ? error.response.data
//   //     //     : "An error occurred during submission",
//   //     // );
//   //   }
//   // };

//   const handleme = async () => {
//     // event.preventDefault();
//     const formData = new FormData();

//     formData.append("id", pid); // Assuming pname represents id
//     formData.append("vendor", vendor); // Replace with actual vendor input
//     formData.append("current_stock", pquantity);
//     formData.append("bill", files); // Ensure file is a File object
//     formData.append("location", cat); // Assuming category is location
//     formData.append("recieved_date", receivedDate);

//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.post(
//         `http://127.0.0.1:8000/purchase-and-store/api/stockEntry/4322`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Token ${token}`, // Add token for authentication
//           },
//         },
//       );
//       // navigate("/purchase/");
//       console.log("Success:", response.data);
//     } catch (error) {
//       console.error(
//         "Error:",
//         error.response ? error.response.data : error.message,
//       );
//     }
//   };

//   return (
//     <Center style={{ minHeight: "100vh" }}>
//       <Paper
//         shadow="md"
//         radius="md"
//         p="lg"
//         withBorder
//         style={{
//           maxWidth: "1000px",
//           width: "100%",
//         }}
//       >
//         <Title order={2} align="center" mb="md">
//           Stock Entry
//         </Title>

//         {/* {errorMessage && (
//           <div
//             style={{ color: "red", textAlign: "center", marginBottom: "20px" }}
//           >
//             {errorMessage}
//           </div>
//         )} */}

//         <form
//           onSubmit={form.onSubmit(handleSubmit)}
//           style={{ marginRight: "50px", marginLeft: "100px" }}
//         >
//           <Grid>
//             <Grid.Col span={{ base: 16, md: 6, lg: 5 }}>
//               <Flex gap="80px">
//                 <Grid.Col sm={6}>
//                   <TextInput
//                     label="Title of Indent File"
//                     placeholder="Enter title"
//                     value={form.values.title}
//                     onChange={(event) =>
//                       form.setFieldValue("title", event.currentTarget.value)
//                     }
//                     required
//                   />
//                 </Grid.Col>

//                 <Grid.Col sm={6}>
//                   <TextInput
//                     label="Description"
//                     placeholder="Enter description"
//                     value={form.values.description}
//                     onChange={(event) =>
//                       form.setFieldValue(
//                         "description",
//                         event.currentTarget.value,
//                       )
//                     }
//                     required
//                   />
//                 </Grid.Col>
//               </Flex>
//               <Flex gap="2px">
//                 <Grid.Col sm={6}>
//                   <TextInput
//                     label="Item Name"
//                     placeholder="Enter item name"
//                     value={form.values.itemName}
//                     onChange={(event) =>
//                       form.setFieldValue("itemName", event.currentTarget.value)
//                     }
//                     style={{ width: "180px" }}
//                     required
//                   />
//                 </Grid.Col>

//                 <Grid.Col sm={6}>
//                   <TextInput
//                     type="number"
//                     label="Quantity"
//                     placeholder="Enter quantity"
//                     value={form.values.quantity}
//                     onChange={(event) => {
//                       form.setFieldValue("quantity", event.target.value);
//                     }}
//                     style={{ width: "180px" }}
//                     required
//                   />
//                 </Grid.Col>
//                 <Grid.Col sm={6}>
//                   <TextInput
//                     type="number"
//                     label="Estimated Cost Per Price"
//                     placeholder="Enter estimated cost"
//                     value={form.values.cost}
//                     onChange={(event) =>
//                       form.setFieldValue("cost", event.currentTarget.value)
//                     }
//                     required
//                     style={{ width: "180px" }}
//                   />
//                 </Grid.Col>
//               </Flex>
//               <Flex gap="2px">
//                 <Grid.Col sm={6}>
//                   <Select
//                     label="Item Type"
//                     placeholder="Select item type"
//                     data={[
//                       { value: "Equipment", label: "Equipment" },
//                       { value: "Consumable", label: "Consumable" },
//                     ]}
//                     value={form.values.itemType}
//                     onChange={(value) => form.setFieldValue("itemType", value)}
//                     style={{ width: "180px" }}
//                     required
//                   />
//                 </Grid.Col>
//                 <Grid.Col sm={6}>
//                   <TextInput
//                     type="number"
//                     label="Present Stock"
//                     placeholder="Enter present stock"
//                     value={form.values.presentStock}
//                     onChange={(event) => {
//                       setPquantity(event.target.value);
//                       form.setFieldValue("presentStock", event.target.value);
//                     }}
//                     style={{ width: "180px" }}
//                     required
//                   />
//                 </Grid.Col>

//                 <Grid.Col sm={6}>
//                   <TextInput
//                     label="Purpose"
//                     placeholder="Enter purpose"
//                     value={form.values.purpose}
//                     onChange={(event) =>
//                       form.setFieldValue("purpose", event.currentTarget.value)
//                     }
//                     style={{ width: "180px" }}
//                     required
//                   />
//                 </Grid.Col>
//               </Flex>
//               <Flex gap="80px">
//                 <Grid.Col sm={6}>
//                   <TextInput
//                     label="Specification"
//                     placeholder="Enter specification"
//                     value={form.values.specification}
//                     onChange={(event) =>
//                       form.setFieldValue(
//                         "specification",
//                         event.currentTarget.value,
//                       )
//                     }
//                     required
//                   />
//                 </Grid.Col>

//                 <Grid.Col sm={6}>
//                   <TextInput
//                     label="Item Subtype"
//                     placeholder="Enter item subtype"
//                     value={form.values.itemSubtype}
//                     onChange={(event) =>
//                       form.setFieldValue(
//                         "itemSubtype",
//                         event.currentTarget.value,
//                       )
//                     }
//                     required
//                   />
//                 </Grid.Col>
//               </Flex>
//               <Flex gap="80px">
//                 <Grid.Col sm={6}>
//                   <TextInput
//                     label="Budgetary Head"
//                     placeholder="Enter budgetary head"
//                     value={form.values.budgetaryHead}
//                     onChange={(event) =>
//                       form.setFieldValue(
//                         "budgetaryHead",
//                         event.currentTarget.value,
//                       )
//                     }
//                     required
//                   />
//                 </Grid.Col>

//                 <Grid.Col sm={6}>
//                   <DateInput
//                     label="Expected Delivery"
//                     placeholder="Pick a date"
//                     value={form.values.expectedDelivery}
//                     onChange={(date) =>
//                       form.setFieldValue("expectedDelivery", date)
//                     }
//                     required
//                   />
//                 </Grid.Col>
//               </Flex>

//               <Flex gap="80px">
//                 <Grid.Col sm={6}>
//                   <TextInput
//                     label="Product_id"
//                     placeholder="Enter product_id"
//                     value={pid}
//                     onChange={(e) => setPid(e.target.value)}
//                     type="number"
//                     required
//                   />
//                 </Grid.Col>

//                 <Grid.Col sm={6}>
//                   <TextInput
//                     label="Vendor name"
//                     placeholder="Enter vendor name"
//                     value={vendor}
//                     onChange={(e) => setVendor(e.target.value)}
//                     required
//                   />
//                 </Grid.Col>
//               </Flex>

//               <Flex gap="80px">
//                 <Grid.Col sm={6}>
//                   <TextInput
//                     label="Location"
//                     placeholder="Enter location"
//                     value={cat}
//                     onChange={(e) => setCat(e.target.value)}
//                     required
//                   />
//                 </Grid.Col>

//                 <Grid.Col sm={6}>
//                   <Group align="flex-start" position="apart" grow>
//                     <TextInput
//                       label="Received Date"
//                       value={receivedDate}
//                       onChange={(e) => setReceivedDate(e.target.value)}
//                       type="date" // Use date input
//                       required
//                       style={{ flexGrow: 1 }}
//                     />
//                   </Group>

//                   {/* <DateInput
//                     label="Received Date"
//                     placeholder="Enter recieved Date"
//                     value={receivedDate}
//                     onChange={(e) => setReceivedDate(e.target.value)}
//                   /> */}
//                 </Grid.Col>
//               </Flex>

//               <Flex gap="80px">
//                 <Grid.Col sm={6}>
//                   <TextInput
//                     label="Source of Supply"
//                     placeholder="Enter source of supply"
//                     value={form.values.sourceOfSupply}
//                     onChange={(event) =>
//                       form.setFieldValue(
//                         "sourceOfSupply",
//                         event.currentTarget.value,
//                       )
//                     }
//                     required
//                   />
//                 </Grid.Col>

//                 <Grid.Col sm={6}>
//                   <Textarea
//                     label="Remark"
//                     placeholder="Enter remark"
//                     value={form.values.remark}
//                     onChange={(event) =>
//                       form.setFieldValue("remark", event.currentTarget.value)
//                     }
//                   />
//                 </Grid.Col>
//               </Flex>
//             </Grid.Col>
//             <Grid.Col sm={6}>
//               <FileInput
//                 label="Bill Upload"
//                 placeholder="Upload file"
//                 value={form.values.file}
//                 onChange={(file) => {
//                   setFiles(file);
//                   form.setFieldValue("file", file);
//                 }}
//                 required
//                 accept="application/pdf,image/jpeg,image/png"
//               />
//             </Grid.Col>

//             <Grid.Col sm={6}>
//               <Button
//                 type="button"
//                 color="green"
//                 onClick={form.onSubmit(handleme)}
//                 style={{ float: "right" }}
//               >
//                 Stock Entry
//               </Button>
//             </Grid.Col>

//             <Grid.Col sm={6}>
//               <TextInput
//                 label="Forward To"
//                 placeholder="Enter forward to"
//                 value={form.values.forwardTo}
//                 onChange={(event) =>
//                   form.setFieldValue("forwardTo", event.currentTarget.value)
//                 }
//               />
//             </Grid.Col>

//             <Grid.Col sm={6}>
//               <TextInput
//                 label="Receiver Name"
//                 placeholder="Enter receiver name"
//                 value={form.values.receiverName}
//                 onChange={(event) =>
//                   handleReceiverChange(event.currentTarget.value)
//                 }
//               />
//             </Grid.Col>

//             <Grid.Col sm={6}>
//               <Select
//                 label="Receiver Designation"
//                 placeholder="Select designation"
//                 data={designations.map((designation) => ({
//                   value: designation,
//                   label: designation,
//                 }))}
//                 value={form.values.receiverDesignation}
//                 onChange={(value) =>
//                   form.setFieldValue("receiverDesignation", value)
//                 }
//                 searchable
//                 clearable
//               />
//             </Grid.Col>

//             <Grid.Col sm={6}>
//               <Button type="submit" color="green" style={{ float: "right" }}>
//                 Submit Indent
//               </Button>
//             </Grid.Col>
//           </Grid>
//         </form>
//       </Paper>
//     </Center>
//   );
// }

// export default StockEntry;
