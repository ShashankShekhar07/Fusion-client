// // // import {
// // //   TextInput,
// // //   Select,
// // //   Button,
// // //   FileInput,
// // //   Textarea,
// // //   Center,
// // //   Paper,
// // //   Title,
// // //   Grid,
// // // } from "@mantine/core";
// // // import { DateInput } from "@mantine/dates";
// // // import { useState } from "react";
// // // import { useSelector } from "react-redux";
// // // import { useNavigate } from "react-router-dom";
// // // import axios from "axios";

// // // function IndentForm() {
// // //   const [file, setFile] = useState(null);
// // //   const [receiverName, setReceiverName] = useState("");
// // //   const [designations, setDesignations] = useState([]);
// // //   const navigate = useNavigate();
// // //   const uploader_username = useSelector((state) => state.user);
// // //   const [formValues, setFormValues] = useState({
// // //     title: "",
// // //     description: "",
// // //     itemName: "",
// // //     quantity: 0,
// // //     cost: 0,
// // //     itemType: "",
// // //     presentStock: 0,
// // //     purpose: "",
// // //     specification: "",
// // //     itemSubtype: "",
// // //     budgetaryHead: "",
// // //     expectedDelivery: null,
// // //     sourceOfSupply: "",
// // //     remark: "",
// // //     forwardTo: "",
// // //     receiverDesignation: "",
// // //   });

// // //   const handleInputChange = (field) => (event) => {
// // //     setFormValues((prevValues) => ({
// // //       ...prevValues,
// // //       [field]: event.currentTarget.value,
// // //     }));
// // //   };

// // //   const handleNumberChange = (field) => (event) => {
// // //     setFormValues((prevValues) => ({
// // //       ...prevValues,
// // //       [field]: parseInt(event.currentTarget.value, 10) || 0, // Convert to integer or fallback to 0
// // //     }));
// // //   };

// // //   const handleDateChange = (field) => (date) => {
// // //     setFormValues((prevValues) => ({
// // //       ...prevValues,
// // //       [field]: date,
// // //     }));
// // //   };

// // //   const formatDate = (date) => {
// // //     if (!date) return null;
// // //     const d = new Date(date);
// // //     const year = d.getFullYear();
// // //     const month = String(d.getMonth() + 1).padStart(2, "0");
// // //     const day = String(d.getDate()).padStart(2, "0");
// // //     return `${year}-${month}-${day}`;
// // //   };

// // //   // Fetch designations based on the entered receiver name
// // //   // eslint-disable-next-line no-shadow
// // //   const fetchDesignations = async (receiverName) => {
// // //     try {
// // //       const response = await axios.get(
// // //         `http://127.0.0.1:8000/filetracking/getdesignations/${receiverName}`,
// // //       );
// // //       console.log("Fetched designations:", response.data);
// // //       setDesignations(response.data); // Set the fetched designations in state
// // //     } catch (error) {
// // //       console.error("Error fetching designations:", error);
// // //       // setErrorMessage(
// // //       //   error.response
// // //       //     ? error.response.data
// // //       //     : "An error occurred while fetching designations",
// // //       // );
// // //     }
// // //   };

// // //   const handleReceiverChange = (value) => {
// // //     setReceiverName(value);
// // //     fetchDesignations(value);
// // //   };

// // //   const handleDesignationChange = (value) => {
// // //     setFormValues((prevValues) => ({
// // //       ...prevValues,
// // //       receiverDesignation: value,
// // //     }));
// // //   };

// // //   const handleSubmit = async (event) => {
// // //     event.preventDefault();
// // //     const data = new FormData();
// // //     data.append("title", formValues.title);
// // //     data.append("description", formValues.description);
// // //     data.append("item_name", formValues.itemName);
// // //     data.append("quantity", formValues.quantity);
// // //     data.append("estimated_cost", formValues.cost);
// // //     data.append("item_type", formValues.itemType);
// // //     data.append("present_stock", formValues.presentStock);
// // //     data.append("purpose", formValues.purpose);
// // //     data.append("specification", formValues.specification);
// // //     data.append("itemSubtype", formValues.itemSubtype);
// // //     data.append("budgetary_head", formValues.budgetaryHead);
// // //     data.append("expected_delivery", formatDate(formValues.expectedDelivery));
// // //     data.append("sources_of_supply", formValues.sourceOfSupply);
// // //     data.append("file", file);
// // //     data.append("remark", formValues.remark);
// // //     data.append("forwardTo", formValues.forwardTo);
// // //     data.append("receiverDesignation", formValues.receiverDesignation);
// // //     data.append("receiverName", receiverName);
// // //     data.append("uploaderUsername", uploader_username);
// // //     console.log("Form data:", data.get("receiverDesignation"));

// // //     try {
// // //       const token = localStorage.getItem("authToken");
// // //       const response = await axios.post(
// // //         "http://127.0.0.1:8000/purchase-and-store/api/create_proposal/",
// // //         data,
// // //         {
// // //           headers: {
// // //             "Content-Type": "multipart/form-data",
// // //             Authorization: `Token ${token}`,
// // //           },
// // //         },
// // //       );

// // //       console.log("Success:", response.data);
// // //       navigate("/purchase/all_filed_indents");
// // //     } catch (error) {
// // //       console.error("Error submitting form:", error);
// // //       // setErrorMessage(
// // //       //   error.response
// // //       //     ? error.response.data
// // //       //     : "An error occurred during submission",
// // //       // );
// // //     }
// // //   };
// // //   const handleDraft = async (event) => {
// // //     event.preventDefault();
// // //     const data = new FormData();
// // //     data.append("title", formValues.title);
// // //     data.append("description", formValues.description);
// // //     data.append("item_name", formValues.itemName);
// // //     data.append("quantity", formValues.quantity);
// // //     data.append("estimated_cost", formValues.cost);
// // //     data.append("item_type", formValues.itemType);
// // //     data.append("present_stock", formValues.presentStock);
// // //     data.append("purpose", formValues.purpose);
// // //     data.append("specification", formValues.specification);
// // //     data.append("itemSubtype", formValues.itemSubtype);
// // //     data.append("budgetary_head", formValues.budgetaryHead);
// // //     data.append("expected_delivery", formatDate(formValues.expectedDelivery));
// // //     data.append("sources_of_supply", formValues.sourceOfSupply);
// // //     data.append("file", file);
// // //     data.append("remark", formValues.remark);
// // //     data.append("forwardTo", formValues.forwardTo);
// // //     data.append("receiverDesignation", formValues.receiverDesignation);
// // //     data.append("receiverName", receiverName);
// // //     console.log("Form data:", data.get("receiverDesignation"));

// // //     try {
// // //       const token = localStorage.getItem("authToken");
// // //       const response = await axios.post(
// // //         "http://127.0.0.1:8000/purchase-and-store/api/create_draft/",
// // //         data,
// // //         {
// // //           headers: {
// // //             "Content-Type": "multipart/form-data",
// // //             Authorization: `Token ${token}`,
// // //           },
// // //         },
// // //       );

// // //       console.log("Success:", response.data);
// // //       // navigate("/purchase/saved_indents");
// // //       navigate("/purchase/saved_indents");
// // //     } catch (error) {
// // //       console.error("Error submitting form:", error);
// // //       // setErrorMessage(
// // //       //   error.response
// // //       //     ? error.response.data
// // //       //     : "An error occurred during submission",
// // //       // );
// // //     }
// // //   };

// // //   return (
// // //     <Center style={{ minHeight: "100vh" }}>
// // //       <Paper
// // //         shadow="md"
// // //         radius="md"
// // //         p="lg"
// // //         withBorder
// // //         style={{
// // //           maxWidth: "1000px",
// // //           width: "100%",
// // //         }}
// // //       >
// // //         <Title order={2} align="center" mb="md">
// // //           Indent Form
// // //         </Title>

// // //         {/* {errorMessage && (
// // //           <div
// // //             style={{ color: "red", textAlign: "center", marginBottom: "20px" }}
// // //           >
// // //             {errorMessage}
// // //           </div>
// // //         )} */}

// // //         <form onSubmit={handleSubmit}>
// // //           <Grid>
// // //             <Grid.Col sm={12}>
// // //               <TextInput
// // //                 label="Title of Indent File"
// // //                 placeholder="Enter title"
// // //                 value={formValues.title}
// // //                 onChange={handleInputChange("title")}
// // //               />
// // //             </Grid.Col>

// // //             <Grid.Col sm={12}>
// // //               <TextInput
// // //                 label="Description"
// // //                 placeholder="Enter description"
// // //                 value={formValues.description}
// // //                 onChange={handleInputChange("description")}
// // //               />
// // //             </Grid.Col>

// // //             <Grid.Col sm={12}>
// // //               <TextInput
// // //                 label="Item Name"
// // //                 placeholder="Enter item name"
// // //                 value={formValues.itemName}
// // //                 onChange={handleInputChange("itemName")}
// // //               />
// // //             </Grid.Col>

// // //             <Grid.Col sm={6}>
// // //               <TextInput
// // //                 type="number"
// // //                 label="Quantity"
// // //                 placeholder="Enter quantity"
// // //                 value={formValues.quantity}
// // //                 onChange={handleNumberChange("quantity")}
// // //               />
// // //             </Grid.Col>

// // //             <Grid.Col sm={6}>
// // //               <TextInput
// // //                 type="number"
// // //                 label="Estimated Cost Per Price"
// // //                 placeholder="Enter estimated cost"
// // //                 value={formValues.cost}
// // //                 onChange={handleNumberChange("cost")}
// // //               />
// // //             </Grid.Col>

// // //             <Grid.Col sm={12}>
// // //               <Select
// // //                 label="Item Type"
// // //                 placeholder="Select item type"
// // //                 data={[
// // //                   { value: "Equipment", label: "Equipment" },
// // //                   { value: "Consumable", label: "Consumable" },
// // //                 ]}
// // //                 value={formValues.itemType}
// // //                 onChange={(value) =>
// // //                   setFormValues((prevValues) => ({
// // //                     ...prevValues,
// // //                     itemType: value,
// // //                   }))
// // //                 }
// // //               />
// // //             </Grid.Col>

// // //             <Grid.Col sm={12}>
// // //               <TextInput
// // //                 type="number"
// // //                 label="Present Stock"
// // //                 placeholder="Enter present stock"
// // //                 value={formValues.presentStock}
// // //                 onChange={handleNumberChange("presentStock")}
// // //               />
// // //             </Grid.Col>

// // //             <Grid.Col sm={12}>
// // //               <TextInput
// // //                 label="Purpose"
// // //                 placeholder="Enter purpose"
// // //                 value={formValues.purpose}
// // //                 onChange={handleInputChange("purpose")}
// // //               />
// // //             </Grid.Col>

// // //             <Grid.Col sm={12}>
// // //               <TextInput
// // //                 label="Specification"
// // //                 placeholder="Enter specification"
// // //                 value={formValues.specification}
// // //                 onChange={handleInputChange("specification")}
// // //               />
// // //             </Grid.Col>

// // //             <Grid.Col sm={12}>
// // //               <TextInput
// // //                 label="Item Subtype"
// // //                 placeholder="Enter item subtype"
// // //                 value={formValues.itemSubtype}
// // //                 onChange={handleInputChange("itemSubtype")}
// // //               />
// // //             </Grid.Col>

// // //             <Grid.Col sm={12}>
// // //               <TextInput
// // //                 label="Budgetary Head"
// // //                 placeholder="Enter budgetary head"
// // //                 value={formValues.budgetaryHead}
// // //                 onChange={handleInputChange("budgetaryHead")}
// // //               />
// // //             </Grid.Col>

// // //             <Grid.Col sm={12}>
// // //               <DateInput
// // //                 label="Expected Delivery"
// // //                 placeholder="Pick a date"
// // //                 value={formValues.expectedDelivery}
// // //                 onChange={handleDateChange("expectedDelivery")}
// // //               />
// // //             </Grid.Col>

// // //             <Grid.Col sm={12}>
// // //               <TextInput
// // //                 label="Source of Supply"
// // //                 placeholder="Enter source of supply"
// // //                 value={formValues.sourceOfSupply}
// // //                 onChange={handleInputChange("sourceOfSupply")}
// // //               />
// // //             </Grid.Col>

// // //             <Grid.Col sm={12}>
// // //               <Textarea
// // //                 label="Remark"
// // //                 placeholder="Enter remark"
// // //                 value={formValues.remark}
// // //                 onChange={handleInputChange("remark")}
// // //               />
// // //             </Grid.Col>

// // //             <Grid.Col sm={12}>
// // //               <FileInput
// // //                 label="File Upload"
// // //                 placeholder="Upload file"
// // //                 onChange={setFile}
// // //                 accept="application/pdf,image/jpeg,image/png"
// // //               />
// // //             </Grid.Col>

// // //             {/* create button for draft */}
// // //             <Grid.Col sm={12}>
// // //               <Button type="submit" fullWidth onClick={handleDraft}>
// // //                 Save Draft
// // //               </Button>
// // //             </Grid.Col>

// // //             <Grid.Col sm={12}>
// // //               <TextInput
// // //                 label="Forward To"
// // //                 placeholder="Enter forward to"
// // //                 value={formValues.forwardTo}
// // //                 onChange={handleInputChange("forwardTo")}
// // //               />
// // //             </Grid.Col>

// // //             <Grid.Col sm={12}>
// // //               <TextInput
// // //                 label="Receiver Name"
// // //                 placeholder="Enter receiver name"
// // //                 value={receiverName}
// // //                 onChange={(event) =>
// // //                   handleReceiverChange(event.currentTarget.value)
// // //                 } // Manual input for receiver name
// // //               />
// // //             </Grid.Col>

// // //             <Grid.Col sm={12}>
// // //               <Select
// // //                 label="Receiver Designation"
// // //                 placeholder="Select designation"
// // //                 data={designations.map((designation) => ({
// // //                   value: designation,
// // //                   label: designation,
// // //                 }))}
// // //                 value={formValues.receiverDesignation}
// // //                 onChange={handleDesignationChange} // Update designation on selection
// // //                 searchable
// // //                 clearable
// // //               />
// // //             </Grid.Col>

// // //             <Grid.Col sm={12}>
// // //               <Button type="submit" fullWidth>
// // //                 Submit Indent
// // //               </Button>
// // //             </Grid.Col>
// // //           </Grid>
// // //         </form>
// // //       </Paper>
// // //     </Center>
// // //   );
// // // }

// // // export default IndentForm;

// // import {
// //   TextInput,
// //   Select,
// //   Button,
// //   FileInput,
// //   Textarea,
// //   Center,
// //   Paper,
// //   Title,
// //   Grid,
// // } from "@mantine/core";
// // import { DateInput } from "@mantine/dates";
// // import { useState } from "react";
// // import { useSelector } from "react-redux";
// // import { useNavigate } from "react-router-dom";
// // import axios from "axios";

// // function IndentForm() {
// //   const [file, setFile] = useState(null);
// //   const [receiverName, setReceiverName] = useState("");
// //   const [designations, setDesignations] = useState([]);
// //   const navigate = useNavigate();
// //   const uploader_username = useSelector((state) => state.user);
// //   const [formValues, setFormValues] = useState({
// //     title: "",
// //     description: "",
// //     itemName: "",
// //     quantity: 0,
// //     cost: 0,
// //     itemType: "",
// //     presentStock: 0,
// //     purpose: "",
// //     specification: "",
// //     itemSubtype: "",
// //     budgetaryHead: "",
// //     expectedDelivery: null,
// //     sourceOfSupply: "",
// //     remark: "",
// //     forwardTo: "",
// //     receiverDesignation: "",
// //   });

// //   const handleInputChange = (field) => (event) => {
// //     setFormValues((prevValues) => ({
// //       ...prevValues,
// //       [field]: event.currentTarget.value,
// //     }));
// //   };

// //   const handleNumberChange = (field) => (event) => {
// //     setFormValues((prevValues) => ({
// //       ...prevValues,
// //       [field]: parseInt(event.currentTarget.value, 10) || 0, // Convert to integer or fallback to 0
// //     }));
// //   };

// //   const handleDateChange = (field) => (date) => {
// //     setFormValues((prevValues) => ({
// //       ...prevValues,
// //       [field]: date,
// //     }));
// //   };

// //   const formatDate = (date) => {
// //     if (!date) return null;
// //     const d = new Date(date);
// //     const year = d.getFullYear();
// //     const month = String(d.getMonth() + 1).padStart(2, "0");
// //     const day = String(d.getDate()).padStart(2, "0");
// //     return `${year}-${month}-${day}`;
// //   };

// //   // Fetch designations based on the entered receiver name
// //   // eslint-disable-next-line no-shadow
// //   const fetchDesignations = async (receiverName) => {
// //     try {
// //       const response = await axios.get(
// //         `http://127.0.0.1:8000/filetracking/getdesignations/${receiverName}`,
// //       );
// //       console.log("Fetched designations:", response.data);
// //       setDesignations(response.data); // Set the fetched designations in state
// //     } catch (error) {
// //       console.error("Error fetching designations:", error);
// //       // setErrorMessage(
// //       //   error.response
// //       //     ? error.response.data
// //       //     : "An error occurred while fetching designations",
// //       // );
// //     }
// //   };

// //   const handleReceiverChange = (value) => {
// //     setReceiverName(value);
// //     fetchDesignations(value);
// //   };

// //   const handleDesignationChange = (value) => {
// //     setFormValues((prevValues) => ({
// //       ...prevValues,
// //       receiverDesignation: value,
// //     }));
// //   };

// //   const handleSubmit = async (event) => {
// //     event.preventDefault();
// //     const data = new FormData();
// //     data.append("title", formValues.title);
// //     data.append("description", formValues.description);
// //     data.append("item_name", formValues.itemName);
// //     data.append("quantity", formValues.quantity);
// //     data.append("estimated_cost", formValues.cost);
// //     data.append("item_type", formValues.itemType);
// //     data.append("present_stock", formValues.presentStock);
// //     data.append("purpose", formValues.purpose);
// //     data.append("specification", formValues.specification);
// //     data.append("itemSubtype", formValues.itemSubtype);
// //     data.append("budgetary_head", formValues.budgetaryHead);
// //     data.append("expected_delivery", formatDate(formValues.expectedDelivery));
// //     data.append("sources_of_supply", formValues.sourceOfSupply);
// //     data.append("file", file);
// //     data.append("remark", formValues.remark);
// //     data.append("forwardTo", formValues.forwardTo);
// //     data.append("receiverDesignation", formValues.receiverDesignation);
// //     data.append("receiverName", receiverName);
// //     data.append("uploaderUsername", uploader_username);
// //     console.log("Form data:", data.get("receiverDesignation"));

// //     try {
// //       const token = localStorage.getItem("authToken");
// //       const response = await axios.post(
// //         "http://127.0.0.1:8000/purchase-and-store/api/create_proposal/",
// //         data,
// //         {
// //           headers: {
// //             "Content-Type": "multipart/form-data",
// //             Authorization: `Token ${token}`,
// //           },
// //         },
// //       );

// //       console.log("Success:", response.data);
// //       navigate("/purchase/all_filed_indents");
// //     } catch (error) {
// //       console.error("Error submitting form:", error);
// //       // setErrorMessage(
// //       //   error.response
// //       //     ? error.response.data
// //       //     : "An error occurred during submission",
// //       // );
// //     }
// //   };
// //   const handleDraft = async (event) => {
// //     event.preventDefault();
// //     const data = new FormData();
// //     data.append("title", formValues.title);
// //     data.append("description", formValues.description);
// //     data.append("item_name", formValues.itemName);
// //     data.append("quantity", formValues.quantity);
// //     data.append("estimated_cost", formValues.cost);
// //     data.append("item_type", formValues.itemType);
// //     data.append("present_stock", formValues.presentStock);
// //     data.append("purpose", formValues.purpose);
// //     data.append("specification", formValues.specification);
// //     data.append("itemSubtype", formValues.itemSubtype);
// //     data.append("budgetary_head", formValues.budgetaryHead);
// //     data.append("expected_delivery", formatDate(formValues.expectedDelivery));
// //     data.append("sources_of_supply", formValues.sourceOfSupply);
// //     data.append("file", file);
// //     data.append("remark", formValues.remark);
// //     data.append("forwardTo", formValues.forwardTo);
// //     data.append("receiverDesignation", formValues.receiverDesignation);
// //     data.append("receiverName", receiverName);
// //     console.log("Form data:", data.get("receiverDesignation"));

// //     try {
// //       const token = localStorage.getItem("authToken");
// //       const response = await axios.post(
// //         "http://127.0.0.1:8000/purchase-and-store/api/create_draft/",
// //         data,
// //         {
// //           headers: {
// //             "Content-Type": "multipart/form-data",
// //             Authorization: `Token ${token}`,
// //           },
// //         },
// //       );

// //       console.log("Success:", response.data);
// //       // navigate("/purchase/saved_indents");
// //       navigate("/purchase/saved_indents");
// //     } catch (error) {
// //       console.error("Error submitting form:", error);
// //       // setErrorMessage(
// //       //   error.response
// //       //     ? error.response.data
// //       //     : "An error occurred during submission",
// //       // );
// //     }
// //   };

// //   return (
// //     <Center style={{ minHeight: "100vh" }}>
// //       <Paper
// //         shadow="md"
// //         radius="md"
// //         p="lg"
// //         withBorder
// //         style={{
// //           maxWidth: "1000px",
// //           width: "100%",
// //         }}
// //       >
// //         <Title order={2} align="center" mb="md">
// //           Indent Form
// //         </Title>

// //         {/* {errorMessage && (
// //         <div
// //           style={{ color: "red", textAlign: "center", marginBottom: "20px" }}
// //         >
// //           {errorMessage}
// //         </div>
// //       )} */}

// //         <form onSubmit={handleSubmit}>
// //           <Grid>
// //             <Grid.Col sm={12}>
// //               <TextInput
// //                 label="Title of Indent File"
// //                 placeholder="Enter title"
// //                 value={formValues.title}
// //                 onChange={handleInputChange("title")}
// //               />
// //             </Grid.Col>

// //             <Grid.Col sm={12}>
// //               <TextInput
// //                 label="Description"
// //                 placeholder="Enter description"
// //                 value={formValues.description}
// //                 onChange={handleInputChange("description")}
// //               />
// //             </Grid.Col>

// //             <Grid.Col sm={12}>
// //               <TextInput
// //                 label="Item Name"
// //                 placeholder="Enter item name"
// //                 value={formValues.itemName}
// //                 onChange={handleInputChange("itemName")}
// //               />
// //             </Grid.Col>

// //             <Grid.Col sm={6}>
// //               <TextInput
// //                 type="number"
// //                 label="Quantity"
// //                 placeholder="Enter quantity"
// //                 value={formValues.quantity}
// //                 onChange={handleNumberChange("quantity")}
// //               />
// //             </Grid.Col>

// //             <Grid.Col sm={6}>
// //               <TextInput
// //                 type="number"
// //                 label="Estimated Cost Per Price"
// //                 placeholder="Enter estimated cost"
// //                 value={formValues.cost}
// //                 onChange={handleNumberChange("cost")}
// //               />
// //             </Grid.Col>

// //             <Grid.Col sm={12}>
// //               <Select
// //                 label="Item Type"
// //                 placeholder="Select item type"
// //                 data={[
// //                   { value: "Equipment", label: "Equipment" },
// //                   { value: "Consumable", label: "Consumable" },
// //                 ]}
// //                 value={formValues.itemType}
// //                 onChange={(value) =>
// //                   setFormValues((prevValues) => ({
// //                     ...prevValues,
// //                     itemType: value,
// //                   }))
// //                 }
// //               />
// //             </Grid.Col>

// //             <Grid.Col sm={12}>
// //               <TextInput
// //                 type="number"
// //                 label="Present Stock"
// //                 placeholder="Enter present stock"
// //                 value={formValues.presentStock}
// //                 onChange={handleNumberChange("presentStock")}
// //               />
// //             </Grid.Col>

// //             <Grid.Col sm={12}>
// //               <TextInput
// //                 label="Purpose"
// //                 placeholder="Enter purpose"
// //                 value={formValues.purpose}
// //                 onChange={handleInputChange("purpose")}
// //               />
// //             </Grid.Col>

// //             <Grid.Col sm={12}>
// //               <TextInput
// //                 label="Specification"
// //                 placeholder="Enter specification"
// //                 value={formValues.specification}
// //                 onChange={handleInputChange("specification")}
// //               />
// //             </Grid.Col>

// //             <Grid.Col sm={12}>
// //               <TextInput
// //                 label="Item Subtype"
// //                 placeholder="Enter item subtype"
// //                 value={formValues.itemSubtype}
// //                 onChange={handleInputChange("itemSubtype")}
// //               />
// //             </Grid.Col>

// //             <Grid.Col sm={12}>
// //               <TextInput
// //                 label="Budgetary Head"
// //                 placeholder="Enter budgetary head"
// //                 value={formValues.budgetaryHead}
// //                 onChange={handleInputChange("budgetaryHead")}
// //               />
// //             </Grid.Col>

// //             <Grid.Col sm={12}>
// //               <DateInput
// //                 label="Expected Delivery"
// //                 placeholder="Pick a date"
// //                 value={formValues.expectedDelivery}
// //                 onChange={handleDateChange("expectedDelivery")}
// //               />
// //             </Grid.Col>

// //             <Grid.Col sm={12}>
// //               <TextInput
// //                 label="Source of Supply"
// //                 placeholder="Enter source of supply"
// //                 value={formValues.sourceOfSupply}
// //                 onChange={handleInputChange("sourceOfSupply")}
// //               />
// //             </Grid.Col>

// //             <Grid.Col sm={12}>
// //               <Textarea
// //                 label="Remark"
// //                 placeholder="Enter remark"
// //                 value={formValues.remark}
// //                 onChange={handleInputChange("remark")}
// //               />
// //             </Grid.Col>

// //             <Grid.Col sm={12}>
// //               <FileInput
// //                 label="File Upload"
// //                 placeholder="Upload file"
// //                 onChange={setFile}
// //                 accept="application/pdf,image/jpeg,image/png"
// //               />
// //             </Grid.Col>

// //             {/* create button for draft */}
// //             <Grid.Col sm={12}>
// //               <div style={{ display: "flex", justifyContent: "flex-end" }}>
// //                 <Button type="submit" onClick={handleDraft}>
// //                   Save Draft
// //                 </Button>
// //               </div>
// //             </Grid.Col>

// //             <Grid.Col sm={12}>
// //               <TextInput
// //                 label="Forward To"
// //                 placeholder="Enter forward to"
// //                 value={formValues.forwardTo}
// //                 onChange={handleInputChange("forwardTo")}
// //               />
// //             </Grid.Col>

// //             <Grid.Col sm={12}>
// //               <TextInput
// //                 label="Receiver Name"
// //                 placeholder="Enter receiver name"
// //                 value={receiverName}
// //                 onChange={(event) =>
// //                   handleReceiverChange(event.currentTarget.value)
// //                 } // Manual input for receiver name
// //               />
// //             </Grid.Col>

// //             <Grid.Col sm={12}>
// //               <Select
// //                 label="Receiver Designation"
// //                 placeholder="Select designation"
// //                 data={designations.map((designation) => ({
// //                   value: designation,
// //                   label: designation,
// //                 }))}
// //                 value={formValues.receiverDesignation}
// //                 onChange={handleDesignationChange} // Update designation on selection
// //                 searchable
// //                 clearable
// //               />
// //             </Grid.Col>

// //             <Grid.Col sm={12}>
// //               <div style={{ display: "flex", justifyContent: "flex-end" }}>
// //                 <Button type="submit">Submit Indent</Button>
// //               </div>
// //             </Grid.Col>
// //           </Grid>
// //         </form>
// //       </Paper>
// //     </Center>
// //   );
// // }

// export default IndentForm;
import {
  TextInput,
  Select,
  Button,
  FileInput,
  Textarea,
  Center,
  Paper,
  Title,
  Grid,
} from "@mantine/core";
import "@mantine/dates/styles.css";
import { DateInput } from "@mantine/dates";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function IndentForm() {
  const [file, setFile] = useState(null);
  const [receiverName, setReceiverName] = useState("");
  const [designations, setDesignations] = useState([]);
  const navigate = useNavigate();
  const uploader_username = useSelector((state) => state.user);
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

  const handleNumberChange = (field) => (event) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: parseInt(event.currentTarget.value, 10) || 0, // Convert to integer or fallback to 0
    }));
  };

  const handleDateChange = (field) => (date) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: date,
    }));
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
    data.append("title", formValues.title);
    data.append("description", formValues.description);
    data.append("item_name", formValues.itemName);
    data.append("quantity", formValues.quantity);
    data.append("estimated_cost", formValues.cost);
    data.append("item_type", formValues.itemType);
    data.append("present_stock", formValues.presentStock);
    data.append("purpose", formValues.purpose);
    data.append("specification", formValues.specification);
    data.append("itemSubtype", formValues.itemSubtype);
    data.append("budgetary_head", formValues.budgetaryHead);
    data.append("expected_delivery", formatDate(formValues.expectedDelivery));
    data.append("sources_of_supply", formValues.sourceOfSupply);
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
        "http://127.0.0.1:8000/purchase-and-store/api/create_proposal/",
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
  const handleDraft = async (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append("title", formValues.title);
    data.append("description", formValues.description);
    data.append("item_name", formValues.itemName);
    data.append("quantity", formValues.quantity);
    data.append("estimated_cost", formValues.cost);
    data.append("item_type", formValues.itemType);
    data.append("present_stock", formValues.presentStock);
    data.append("purpose", formValues.purpose);
    data.append("specification", formValues.specification);
    data.append("itemSubtype", formValues.itemSubtype);
    data.append("budgetary_head", formValues.budgetaryHead);
    data.append("expected_delivery", formatDate(formValues.expectedDelivery));
    data.append("sources_of_supply", formValues.sourceOfSupply);
    data.append("file", file);
    data.append("remark", formValues.remark);
    data.append("forwardTo", formValues.forwardTo);
    data.append("receiverDesignation", formValues.receiverDesignation);
    data.append("receiverName", receiverName);
    console.log("Form data:", data.get("receiverDesignation"));

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        "http://127.0.0.1:8000/purchase-and-store/api/create_draft/",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${token}`,
          },
        },
      );

      console.log("Success:", response.data);
      // navigate("/purchase/saved_indents");
      navigate("/purchase/saved_indents");
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
    <Center style={{ minHeight: "100vh" }}>
      <Paper
        shadow="md"
        radius="md"
        p="lg"
        withBorder
        style={{
          maxWidth: "1000px",
          width: "100%",
        }}
      >
        <Title order={2} align="center" mb="md">
          Indent Form
        </Title>

        {/* {errorMessage && (
          <div
            style={{ color: "red", textAlign: "center", marginBottom: "20px" }}
          >
            {errorMessage}
          </div>
        )} */}

        <form onSubmit={handleSubmit}>
          <Grid>
            <Grid.Col sm={12}>
              <TextInput
                label="Title of Indent File"
                placeholder="Enter title"
                value={formValues.title}
                onChange={handleInputChange("title")}
              />
            </Grid.Col>

            <Grid.Col sm={12}>
              <TextInput
                label="Description"
                placeholder="Enter description"
                value={formValues.description}
                onChange={handleInputChange("description")}
              />
            </Grid.Col>

            <Grid.Col sm={12}>
              <TextInput
                label="Item Name"
                placeholder="Enter item name"
                value={formValues.itemName}
                onChange={handleInputChange("itemName")}
              />
            </Grid.Col>

            <Grid.Col sm={6}>
              <TextInput
                type="number"
                label="Quantity"
                placeholder="Enter quantity"
                value={formValues.quantity}
                onChange={handleNumberChange("quantity")}
              />
            </Grid.Col>

            <Grid.Col sm={6}>
              <TextInput
                type="number"
                label="Estimated Cost Per Price"
                placeholder="Enter estimated cost"
                value={formValues.cost}
                onChange={handleNumberChange("cost")}
              />
            </Grid.Col>

            <Grid.Col sm={12}>
              <Select
                label="Item Type"
                placeholder="Select item type"
                data={[
                  { value: "Equipment", label: "Equipment" },
                  { value: "Consumable", label: "Consumable" },
                ]}
                value={formValues.itemType}
                onChange={(value) =>
                  setFormValues((prevValues) => ({
                    ...prevValues,
                    itemType: value,
                  }))
                }
              />
            </Grid.Col>

            <Grid.Col sm={12}>
              <TextInput
                type="number"
                label="Present Stock"
                placeholder="Enter present stock"
                value={formValues.presentStock}
                onChange={handleNumberChange("presentStock")}
              />
            </Grid.Col>

            <Grid.Col sm={12}>
              <TextInput
                label="Purpose"
                placeholder="Enter purpose"
                value={formValues.purpose}
                onChange={handleInputChange("purpose")}
              />
            </Grid.Col>

            <Grid.Col sm={12}>
              <TextInput
                label="Specification"
                placeholder="Enter specification"
                value={formValues.specification}
                onChange={handleInputChange("specification")}
              />
            </Grid.Col>

            <Grid.Col sm={12}>
              <TextInput
                label="Item Subtype"
                placeholder="Enter item subtype"
                value={formValues.itemSubtype}
                onChange={handleInputChange("itemSubtype")}
              />
            </Grid.Col>

            <Grid.Col sm={12}>
              <TextInput
                label="Budgetary Head"
                placeholder="Enter budgetary head"
                value={formValues.budgetaryHead}
                onChange={handleInputChange("budgetaryHead")}
              />
            </Grid.Col>

            <Grid.Col sm={12}>
              <DateInput
                label="Expected Delivery"
                placeholder="Pick a date"
                value={formValues.expectedDelivery}
                onChange={handleDateChange("expectedDelivery")}
              />
            </Grid.Col>

            <Grid.Col sm={12}>
              <TextInput
                label="Source of Supply"
                placeholder="Enter source of supply"
                value={formValues.sourceOfSupply}
                onChange={handleInputChange("sourceOfSupply")}
              />
            </Grid.Col>

            <Grid.Col sm={12}>
              <Textarea
                label="Remark"
                placeholder="Enter remark"
                value={formValues.remark}
                onChange={handleInputChange("remark")}
              />
            </Grid.Col>

            <Grid.Col sm={12}>
              <FileInput
                label="File Upload"
                placeholder="Upload file"
                onChange={setFile}
                accept="application/pdf,image/jpeg,image/png"
              />
            </Grid.Col>

            {/* create button for draft */}
            <Grid.Col sm={12}>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  type="submit"
                  color="green"
                  style={{ marginRight: "8px" }}
                  onClick={handleDraft}
                >
                  Save Draft
                </Button>
              </div>
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
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  type="submit"
                  color="green"
                  style={{ marginRight: "8px" }}
                >
                  Submit Indent
                </Button>
              </div>
            </Grid.Col>
          </Grid>
        </form>
      </Paper>
    </Center>
  );
}

export default IndentForm;

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
// } from "@mantine/core";
// import "@mantine/dates/styles.css";
// import { DateInput } from "@mantine/dates";
// import { useForm } from "@mantine/form"; // Import useForm from Mantine
// import { useState } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// function IndentForm() {
//   const [file, setFile] = useState(null);
//   const [designations, setDesignations] = useState([]);
//   const navigate = useNavigate();
//   const uploader_username = useSelector((state) => state.user);

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
//       receiverName: "",
//       receiverDesignation: "",
//     },
//   });

//   const fetchDesignations = async (receiverName) => {
//     try {
//       const response = await axios.get(
//         `http://127.0.0.1:8000/filetracking/getdesignations/${receiverName}`,
//       );
//       console.log("Fetched designations:", response.data);
//       setDesignations(response.data);
//     } catch (error) {
//       console.error("Error fetching designations:", error);
//     }
//   };

//   const handleReceiverChange = (value) => {
//     form.setFieldValue("receiverName", value);
//     fetchDesignations(value);
//   };

//   const formatDate = (date) => {
//     if (!date) return null;
//     const d = new Date(date);
//     const year = d.getFullYear();
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const day = String(d.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const data = new FormData();
//     const { values } = form;

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
//     data.append("file", file);
//     data.append("remark", values.remark);
//     data.append("forwardTo", values.forwardTo);
//     data.append("receiverDesignation", values.receiverDesignation);
//     data.append("receiverName", values.receiverName);
//     data.append("uploaderUsername", uploader_username);

//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.post(
//         "http://127.0.0.1:8000/purchase-and-store/api/create_proposal/",
//         data,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Token ${token}`,
//           },
//         },
//       );

//       console.log("Success:", response.data);
//       navigate("/purchase/all_filed_indents");
//     } catch (error) {
//       console.error("Error submitting form:", error);
//     }
//   };

//   const handleDraft = async (event) => {
//     event.preventDefault();
//     const data = new FormData();
//     data.append("title", formValues.title);
//     data.append("description", formValues.description);
//     data.append("item_name", formValues.itemName);
//     data.append("quantity", formValues.quantity);
//     data.append("estimated_cost", formValues.cost);
//     data.append("item_type", formValues.itemType);
//     data.append("present_stock", formValues.presentStock);
//     data.append("purpose", formValues.purpose);
//     data.append("specification", formValues.specification);
//     data.append("itemSubtype", formValues.itemSubtype);
//     data.append("budgetary_head", formValues.budgetaryHead);
//     data.append("expected_delivery", formatDate(formValues.expectedDelivery));
//     data.append("sources_of_supply", formValues.sourceOfSupply);
//     data.append("file", file);
//     data.append("remark", formValues.remark);
//     data.append("forwardTo", formValues.forwardTo);
//     data.append("receiverDesignation", formValues.receiverDesignation);
//     data.append("receiverName", receiverName);
//     console.log("Form data:", data.get("receiverDesignation"));

//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.post(
//         "http://127.0.0.1:8000/purchase-and-store/api/create_draft/",
//         data,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Token ${token}`,
//           },
//         },
//       );

//       console.log("Success:", response.data);
//       // navigate("/purchase/saved_indents");
//       navigate("/purchase/saved_indents");
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       // setErrorMessage(
//       //   error.response
//       //     ? error.response.data
//       //     : "An error occurred during submission",
//       // );
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
//           Indent Form
//         </Title>

//         <form onSubmit={handleSubmit}>
//           <Grid>
//             <Grid.Col sm={12}>
//               <TextInput
//                 label="Title of Indent File"
//                 placeholder="Enter title"
//                 value={form.values.title}
//                 onChange={(event) =>
//                   form.setFieldValue("title", event.currentTarget.value)
//                 }
//                 error={form.errors.title}
//               />
//             </Grid.Col>

//             <Grid.Col sm={12}>
//               <TextInput
//                 label="Description"
//                 placeholder="Enter description"
//                 value={form.values.description}
//                 onChange={(event) =>
//                   form.setFieldValue("description", event.currentTarget.value)
//                 }
//                 error={form.errors.description}
//               />
//             </Grid.Col>

//             <Grid.Col sm={12}>
//               <TextInput
//                 label="Item Name"
//                 placeholder="Enter item name"
//                 value={form.values.itemName}
//                 onChange={(event) =>
//                   form.setFieldValue("itemName", event.currentTarget.value)
//                 }
//                 error={form.errors.itemName}
//               />
//             </Grid.Col>

//             <Grid.Col sm={6}>
//               <TextInput
//                 type="number"
//                 label="Quantity"
//                 placeholder="Enter quantity"
//                 value={form.values.quantity}
//                 onChange={(event) =>
//                   form.setFieldValue("quantity", event.currentTarget.value)
//                 }
//                 error={form.errors.quantity}
//               />
//             </Grid.Col>

//             <Grid.Col sm={6}>
//               <TextInput
//                 type="number"
//                 label="Estimated Cost Per Price"
//                 placeholder="Enter estimated cost"
//                 value={form.values.cost}
//                 onChange={(event) =>
//                   form.setFieldValue("cost", event.currentTarget.value)
//                 }
//                 error={form.errors.cost}
//               />
//             </Grid.Col>

//             <Grid.Col sm={12}>
//               <Select
//                 label="Item Type"
//                 placeholder="Select item type"
//                 data={[
//                   { value: "Equipment", label: "Equipment" },
//                   { value: "Consumable", label: "Consumable" },
//                 ]}
//                 value={form.values.itemType}
//                 onChange={(value) => form.setFieldValue("itemType", value)}
//                 error={form.errors.itemType}
//               />
//             </Grid.Col>

//             <Grid.Col sm={12}>
//               <TextInput
//                 type="number"
//                 label="Present Stock"
//                 placeholder="Enter present stock"
//                 value={form.values.presentStock}
//                 onChange={(event) =>
//                   form.setFieldValue("presentStock", event.currentTarget.value)
//                 }
//                 error={form.errors.presentStock}
//               />
//             </Grid.Col>

//             <Grid.Col sm={12}>
//               <TextInput
//                 label="Purpose"
//                 placeholder="Enter purpose"
//                 value={form.values.purpose}
//                 onChange={(event) =>
//                   form.setFieldValue("purpose", event.currentTarget.value)
//                 }
//                 error={form.errors.purpose}
//               />
//             </Grid.Col>

//             <Grid.Col sm={12}>
//               <TextInput
//                 label="Specification"
//                 placeholder="Enter specification"
//                 value={form.values.specification}
//                 onChange={(event) =>
//                   form.setFieldValue("specification", event.currentTarget.value)
//                 }
//                 error={form.errors.specification}
//               />
//             </Grid.Col>

//             <Grid.Col sm={12}>
//               <TextInput
//                 label="Item Subtype"
//                 placeholder="Enter item subtype"
//                 value={form.values.itemSubtype}
//                 onChange={(event) =>
//                   form.setFieldValue("itemSubtype", event.currentTarget.value)
//                 }
//                 error={form.errors.itemSubtype}
//               />
//             </Grid.Col>

//             <Grid.Col sm={12}>
//               <TextInput
//                 label="Budgetary Head"
//                 placeholder="Enter budgetary head"
//                 value={form.values.budgetaryHead}
//                 onChange={(event) =>
//                   form.setFieldValue("budgetaryHead", event.currentTarget.value)
//                 }
//                 error={form.errors.budgetaryHead}
//               />
//             </Grid.Col>

//             <Grid.Col sm={12}>
//               <DateInput
//                 label="Expected Delivery"
//                 placeholder="Pick a date"
//                 value={form.values.expectedDelivery}
//                 onChange={(value) =>
//                   form.setFieldValue("expectedDelivery", value)
//                 }
//                 error={form.errors.expectedDelivery}
//               />
//             </Grid.Col>

//             <Grid.Col sm={12}>
//               <TextInput
//                 label="Source of Supply"
//                 placeholder="Enter source of supply"
//                 value={form.values.sourceOfSupply}
//                 onChange={(event) =>
//                   form.setFieldValue(
//                     "sourceOfSupply",
//                     event.currentTarget.value,
//                   )
//                 }
//                 error={form.errors.sourceOfSupply}
//               />
//             </Grid.Col>

//             <Grid.Col sm={12}>
//               <Textarea
//                 label="Remark"
//                 placeholder="Enter remark"
//                 value={form.values.sourceOfSupply}
//                 onChange={(event) =>
//                   form.setFieldValue("remark", event.currentTarget.remark)
//                 }
//                 error={form.errors.remark}
//                 // {...form.getInputProps("remark")}
//               />
//             </Grid.Col>

//             <Grid.Col sm={12}>
//               <FileInput
//                 label="File Upload"
//                 placeholder="Upload file"
//                 onChange={setFile}
//                 accept="application/pdf,image/jpeg,image/png"
//               />
//             </Grid.Col>

//             <Grid.Col sm={12}>
//               <TextInput
//                 label="Forward To"
//                 placeholder="Enter forward to"
//                 value={form.values.forwardTo}
//                 onChange={(event) =>
//                   form.setFieldValue("forwardTo", event.currentTarget.forwardTo)
//                 }
//                 error={form.errors.forwardTo}
//               />
//             </Grid.Col>

//             <Grid.Col sm={12}>
//               <TextInput
//                 label="Receiver Name"
//                 placeholder="Enter receiver name"
//                 value={form.values.receiverName}
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
//                 value={form.values.receiverDesignation}
//                 onChange={(event) =>
//                   form.setFieldValue(
//                     "receiverDesignation",
//                     event.currentTarget.receiverDesignation,
//                   )
//                 }
//                 error={form.errors.receiverDesignation}
//                 // {...form.getInputProps("receiverDesignation")}
//                 searchable
//                 clearable
//               />
//             </Grid.Col>

//             <Grid.Col sm={12}>
//               <div style={{ display: "flex", justifyContent: "flex-end" }}>
//                 <Button
//                   type="submit"
//                   color="green"
//                   style={{ marginRight: "8px" }}
//                 >
//                   Submit Indent
//                 </Button>
//               </div>
//             </Grid.Col>
//           </Grid>
//         </form>
//       </Paper>
//     </Center>
//   );
// }

// export default IndentForm;
