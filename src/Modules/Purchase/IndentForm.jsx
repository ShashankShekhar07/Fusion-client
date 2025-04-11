// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Paper,
//   Title,
//   Button,
//   Group,
//   Stack,
//   TextInput,
//   NumberInput,
//   Select,
//   Textarea,
//   FileInput,
//   ActionIcon,
//   Card,
//   Container,
//   Grid,
//   Text,
//   SimpleGrid,
// } from "@mantine/core";
// import { DateInput } from "@mantine/dates";
// import { useForm } from "@mantine/form";
// import { IconPlus, IconTrash, IconUpload } from "@tabler/icons-react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import { createProposalRoute } from "../../routes/purchaseRoutes";
// import "@mantine/dates/styles.css";
// import { host } from "../../routes/globalRoutes";

// const ITEM_TYPES = ["Equipment", "Consumable", "Furniture", "Books"];
// const YES_NO_OPTIONS = [
//   { value: "true", label: "Yes" },
//   { value: "false", label: "No" },
// ];

// const emptyItem = {
//   item_name: "",
//   quantity: 0,
//   present_stock: 0,
//   estimated_cost: 0,
//   purpose: "",
//   specification: "",
//   item_type: "",
//   item_subtype: "",
//   nature: false,
//   indigenous: false,
//   replaced: false,
//   budgetary_head: "",
//   expected_delivery: null,
//   sources_of_supply: "",
// };

// export default function IndentForm() {
//   const [submitting, setSubmitting] = useState(false);
//   const [designations, setDesignations] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [activeTab, setActiveTab] = useState("0");
//   const role = useSelector((state) => state.user.role);
//   const uploaderUsername = useSelector((state) => state.user.username);
//   const navigate = useNavigate();

//   const fetchAllUsers = async () => {
//     try {
//       const response = await axios.get(
//         `${host}/purchase-and-store/api/user-suggestions`,
//       );
//       setUsers(response.data.users);
//       setFilteredUsers(response.data.users);
//     } catch (error) {
//       console.error("Error fetching users", error);
//     }
//   };

//   useEffect(() => {
//     fetchAllUsers();
//   }, []);

//   const form = useForm({
//     initialValues: {
//       title: "",
//       description: "",
//       forwardTo: "",
//       role: "Professor",
//       receiverDesignation: "Professor",
//       file: null,
//       items: [{ ...emptyItem }],
//     },
//     validate: {
//       title: (value) => (!value ? "Title is required" : null),
//       forwardTo: (value) => (!value ? "Forward to is required" : null),
//       receiverDesignation: (value) =>
//         !value ? "Receiver designation is required" : null,
//       items: {
//         item_name: (value) => (!value ? "Item name is required" : null),
//         quantity: (value) =>
//           value <= 0 ? "Quantity must be greater than 0" : null,
//         item_type: (value) => (!value ? "Item type is required" : null),
//       },
//     },
//   });

//   const addItem = () => {
//     if (form.values.items.length < 20) {
//       const newIndex = form.values.items.length;
//       form.insertListItem("items", { ...emptyItem });
//       setTimeout(() => {
//         setActiveTab(String(newIndex));
//       }, 50);
//     } else {
//       alert("Maximum of 20 items allowed");
//     }
//   };

//   const removeItem = (index) => {
//     if (form.values.items.length > 1) {
//       let newActiveTab;
//       if (parseInt(activeTab, 10) === index) {
//         if (index === form.values.items.length - 1) {
//           newActiveTab = String(index - 1);
//         } else {
//           newActiveTab = activeTab;
//         }
//       } else if (parseInt(activeTab, 10) > index) {
//         newActiveTab = String(parseInt(activeTab, 10) - 1);
//       } else {
//         newActiveTab = activeTab;
//       }
//       form.removeListItem("items", index);
//       setTimeout(() => {
//         setActiveTab(newActiveTab);
//       }, 50);
//     }
//   };

//   const formatDate = (date) => {
//     if (!date) return null;
//     const d = new Date(date);
//     const year = d.getFullYear();
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const day = String(d.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   };

//   const filterUsers = (searchQuery) => {
//     if (searchQuery === "") {
//       setFilteredUsers(users);
//     } else {
//       const filtered = users.filter((user) =>
//         user.username.toLowerCase().includes(searchQuery.toLowerCase()),
//       );
//       setFilteredUsers(filtered);
//     }
//   };

//   const fetchDesignations = async (receiverName) => {
//     try {
//       const response = await axios.get(
//         `${host}/filetracking/getdesignations/${receiverName}/`,
//       );
//       setDesignations(response.data);
//     } catch (error) {
//       console.error("Error fetching designations:", error);
//     }
//   };

//   const handleSearchChange = (value) => {
//     filterUsers(value);
//     if (value) {
//       fetchDesignations(value);
//     }
//   };

//   const handleSubmit = async (values) => {
//     try {
//       setSubmitting(true);
//       const token = localStorage.getItem("authToken");

//       const data = {
//         title: values.title,
//         description: values.description,
//         forwardTo: values.forwardTo,
//         role: values.role,
//         receiverDesignation: values.receiverDesignation,
//         file: values.file,
//         uploaderUsername,
//         items: values.items.map((item) => ({
//           item_name: item.item_name,
//           quantity: item.quantity,
//           present_stock: item.present_stock,
//           estimated_cost: item.estimated_cost,
//           purpose: item.purpose,
//           specification: item.specification,
//           item_type: item.item_type,
//           item_subtype: item.item_subtype,
//           nature: item.nature === "true",
//           indigenous: item.indigenous === "true",
//           replaced: item.replaced === "true",
//           budgetary_head: item.budgetary_head,
//           expected_delivery: formatDate(item.expected_delivery),
//           sources_of_supply: item.sources_of_supply,
//         })),
//       };

//       await axios.post(createProposalRoute(role), data, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Token ${token}`,
//         },
//       });

//       alert("Indent submitted successfully!");
//       form.reset();
//       navigate("/purchase/outbox");
//     } catch (error) {
//       console.error("Error submitting indent:", error);
//       alert("Failed to submit indent. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <Container size="xl">
//       <Paper p="md" radius="md" withBorder>
//         <form onSubmit={form.onSubmit(handleSubmit)}>
//           <Stack spacing="md">
//             <Title order={2} align="center">
//               Create New Indent
//             </Title>

//             <Card withBorder shadow="sm" p="md">
//               <Stack spacing="md">
//                 <Title order={3}>General Information</Title>
//                 <Grid>
//                   <Grid.Col span={12}>
//                     <TextInput
//                       label="Title"
//                       required
//                       value={form.values.title}
//                       onChange={(event) =>
//                         form.setFieldValue("title", event.currentTarget.value)
//                       }
//                       error={form.errors.title}
//                     />
//                   </Grid.Col>
//                   <Grid.Col span={12}>
//                     <Textarea
//                       label="Description"
//                       minRows={3}
//                       value={form.values.description}
//                       onChange={(event) =>
//                         form.setFieldValue(
//                           "description",
//                           event.currentTarget.value,
//                         )
//                       }
//                       error={form.errors.description}
//                       required
//                     />
//                   </Grid.Col>
//                 </Grid>
//               </Stack>
//             </Card>

//             <Card withBorder shadow="sm" p="md">
//               <Stack spacing="md">
//                 <Title order={3}>Items</Title>

//                 <div>
//                   <div
//                     style={{
//                       display: "flex",
//                       flexDirection: "column",
//                       marginBottom: "16px",
//                       position: "relative",
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         borderBottom: "1px solid #dee2e6",
//                       }}
//                     >
//                       <div
//                         style={{
//                           display: "flex",
//                           flex: 1,
//                           overflowX: "auto",
//                           paddingBottom: "8px",
//                           scrollbarWidth: "thin",
//                           scrollbarColor: "#74c0fc #f8f9fa",
//                         }}
//                         className="custom-scrollbar"
//                       >
//                         {form.values.items.map((_, index) => (
//                           <div
//                             key={index}
//                             onClick={() => setActiveTab(String(index))}
//                             onKeyDown={(e) => {
//                               if (e.key === "Enter" || e.key === " ") {
//                                 setActiveTab(String(index));
//                               }
//                             }}
//                             role="button"
//                             tabIndex={0}
//                             style={{
//                               padding: "8px 16px",
//                               cursor: "pointer",
//                               backgroundColor:
//                                 activeTab === String(index)
//                                   ? "#f1f3f5"
//                                   : "transparent",
//                               borderBottom:
//                                 activeTab === String(index)
//                                   ? "2px solid #228be6"
//                                   : "none",
//                               display: "flex",
//                               alignItems: "center",
//                               marginRight: "4px",
//                               whiteSpace: "nowrap",
//                               minWidth: "fit-content",
//                             }}
//                           >
//                             <span>Item {index + 1}</span>
//                           </div>
//                         ))}
//                       </div>

//                       <div
//                         style={{
//                           width: "1px",
//                           backgroundColor: "#dee2e6",
//                           margin: "0 12px",
//                           alignSelf: "stretch",
//                         }}
//                       />

//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           gap: "8px",
//                           flexShrink: 0,
//                         }}
//                       >
//                         {form.values.items.length < 20 && (
//                           <ActionIcon
//                             variant="light"
//                             color="blue"
//                             onClick={addItem}
//                             size="md"
//                             title="Add new item"
//                             style={{
//                               boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
//                             }}
//                           >
//                             <IconPlus size={18} />
//                           </ActionIcon>
//                         )}

//                         {form.values.items.length > 1 && (
//                           <ActionIcon
//                             color="red"
//                             variant="light"
//                             onClick={() => removeItem(parseInt(activeTab, 10))}
//                             size="md"
//                             title="Delete current item"
//                             style={{
//                               boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
//                             }}
//                           >
//                             <IconTrash size={18} />
//                           </ActionIcon>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   <style>
//                     {`
//                     .custom-scrollbar::-webkit-scrollbar {
//                       height: 4px;
//                     }

//                     .custom-scrollbar::-webkit-scrollbar-track {
//                       background: #f8f9fa;
//                       border-radius: 10px;
//                     }

//                     .custom-scrollbar::-webkit-scrollbar-thumb {
//                       background: #74c0fc;
//                       border-radius: 10px;
//                       opacity: 0.7;
//                     }

//                     .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//                       background: #4dabf7;
//                       opacity: 1;
//                     }
//                     `}
//                   </style>

//                   {form.values.items.map((item, index) => (
//                     <div
//                       key={index}
//                       style={{
//                         display: activeTab === String(index) ? "block" : "none",
//                       }}
//                     >
//                       <Grid>
//                         <Grid.Col span={6}>
//                           <TextInput
//                             label="Item Name"
//                             required
//                             value={item.item_name}
//                             onChange={(event) =>
//                               form.setFieldValue(
//                                 `items.${index}.item_name`,
//                                 event.currentTarget.value,
//                               )
//                             }
//                             error={form.errors.items?.[index]?.item_name}
//                           />
//                         </Grid.Col>
//                         <Grid.Col span={3}>
//                           <NumberInput
//                             label="Quantity"
//                             required
//                             min={1}
//                             value={item.quantity}
//                             onChange={(value) =>
//                               form.setFieldValue(
//                                 `items.${index}.quantity`,
//                                 value,
//                               )
//                             }
//                             error={form.errors.items?.[index]?.quantity}
//                           />
//                         </Grid.Col>
//                         <Grid.Col span={3}>
//                           <NumberInput
//                             label="Estimated Cost (₹)"
//                             required
//                             min={0}
//                             value={item.estimated_cost}
//                             onChange={(value) =>
//                               form.setFieldValue(
//                                 `items.${index}.estimated_cost`,
//                                 value,
//                               )
//                             }
//                             error={form.errors.items?.[index]?.estimated_cost}
//                           />
//                         </Grid.Col>
//                       </Grid>

//                       <Grid>
//                         <Grid.Col span={6}>
//                           <Select
//                             label="Item Type"
//                             required
//                             data={ITEM_TYPES}
//                             value={item.item_type}
//                             onChange={(value) =>
//                               form.setFieldValue(
//                                 `items.${index}.item_type`,
//                                 value,
//                               )
//                             }
//                             error={form.errors.items?.[index]?.item_type}
//                           />
//                         </Grid.Col>
//                         <Grid.Col span={6}>
//                           <TextInput
//                             label="Item Subtype"
//                             value={item.item_subtype}
//                             onChange={(event) =>
//                               form.setFieldValue(
//                                 `items.${index}.item_subtype`,
//                                 event.currentTarget.value,
//                               )
//                             }
//                             required
//                           />
//                         </Grid.Col>
//                       </Grid>

//                       <Grid>
//                         <Grid.Col span={6}>
//                           <NumberInput
//                             label="Present Stock"
//                             min={0}
//                             value={item.present_stock}
//                             onChange={(value) =>
//                               form.setFieldValue(
//                                 `items.${index}.present_stock`,
//                                 value,
//                               )
//                             }
//                             required
//                           />
//                         </Grid.Col>
//                         <Grid.Col span={6}>
//                           <TextInput
//                             label="Budgetary Head"
//                             value={item.budgetary_head}
//                             onChange={(event) =>
//                               form.setFieldValue(
//                                 `items.${index}.budgetary_head`,
//                                 event.currentTarget.value,
//                               )
//                             }
//                             required
//                           />
//                         </Grid.Col>
//                       </Grid>

//                       <SimpleGrid cols={3} spacing="md" mt="md">
//                         <div>
//                           <Text size="sm" fw={500}>
//                             Nature <span style={{ color: "red" }}>*</span>
//                           </Text>
//                           <Select
//                             data={YES_NO_OPTIONS}
//                             value={String(item.nature)}
//                             onChange={(value) =>
//                               form.setFieldValue(`items.${index}.nature`, value)
//                             }
//                             required
//                           />
//                         </div>
//                         <div>
//                           <Text size="sm" fw={500}>
//                             Indigenous <span style={{ color: "red" }}>*</span>
//                           </Text>
//                           <Select
//                             data={YES_NO_OPTIONS}
//                             value={String(item.indigenous)}
//                             onChange={(value) =>
//                               form.setFieldValue(
//                                 `items.${index}.indigenous`,
//                                 value,
//                               )
//                             }
//                             required
//                           />
//                         </div>
//                         <div>
//                           <Text size="sm" fw={500}>
//                             Replaced <span style={{ color: "red" }}>*</span>
//                           </Text>
//                           <Select
//                             data={YES_NO_OPTIONS}
//                             value={String(item.replaced)}
//                             onChange={(value) =>
//                               form.setFieldValue(
//                                 `items.${index}.replaced`,
//                                 value,
//                               )
//                             }
//                             required
//                           />
//                         </div>
//                       </SimpleGrid>

//                       <TextInput
//                         label="Purpose"
//                         value={item.purpose}
//                         onChange={(event) =>
//                           form.setFieldValue(
//                             `items.${index}.purpose`,
//                             event.currentTarget.value,
//                           )
//                         }
//                         required
//                       />
//                       <TextInput
//                         label="Specification"
//                         value={item.specification}
//                         onChange={(event) =>
//                           form.setFieldValue(
//                             `items.${index}.specification`,
//                             event.currentTarget.value,
//                           )
//                         }
//                         required
//                       />

//                       <Grid>
//                         <Grid.Col span={6}>
//                           <DateInput
//                             label="Expected Delivery"
//                             value={item.expected_delivery}
//                             onChange={(value) =>
//                               form.setFieldValue(
//                                 `items.${index}.expected_delivery`,
//                                 value,
//                               )
//                             }
//                             required
//                             minDate={new Date()}
//                           />
//                         </Grid.Col>
//                         <Grid.Col span={6}>
//                           <TextInput
//                             label="Source of Supply"
//                             value={item.sources_of_supply}
//                             onChange={(event) =>
//                               form.setFieldValue(
//                                 `items.${index}.sources_of_supply`,
//                                 event.currentTarget.value,
//                               )
//                             }
//                             required
//                           />
//                         </Grid.Col>
//                       </Grid>

//                       <FileInput
//                         label="Attachment"
//                         placeholder="Upload file"
//                         icon={<IconUpload size={14} />}
//                         value={item.file}
//                         onChange={(file) =>
//                           form.setFieldValue(`items.${index}.file`, file)
//                         }
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </Stack>
//             </Card>

//             <Card withBorder shadow="sm" p="md">
//               <Stack spacing="md">
//                 <Title order={3}>Forward Information</Title>
//                 <Grid>
//                   <Grid.Col xs={12} md={6}>
//                     <Select
//                       label="Forward To"
//                       placeholder="Select receiver"
//                       value={form.values.forwardTo}
//                       onChange={(value) =>
//                         form.setFieldValue("forwardTo", value)
//                       }
//                       data={filteredUsers.map((user) => ({
//                         value: user.username,
//                         label: user.username,
//                       }))}
//                       onSearchChange={handleSearchChange}
//                       searchable
//                       required
//                       clearable
//                       error={form.errors.forwardTo}
//                     />
//                   </Grid.Col>
//                   <Grid.Col xs={12} md={6}>
//                     <Select
//                       label="Receiver Designation"
//                       placeholder="Select designation"
//                       data={designations.map((designation) => ({
//                         value: designation,
//                         label: designation,
//                       }))}
//                       value={form.values.receiverDesignation}
//                       onChange={(value) =>
//                         form.setFieldValue("receiverDesignation", value)
//                       }
//                       searchable
//                       clearable
//                       required
//                       error={form.errors.receiverDesignation}
//                     />
//                   </Grid.Col>
//                 </Grid>
//               </Stack>
//             </Card>
//           </Stack>

//           <Group position="center" spacing="md">
//             <Button type="submit" loading={submitting}>
//               Submit Indent
//             </Button>
//           </Group>
//         </form>
//       </Paper>
//     </Container>
//   );
// }

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  Title,
  Button,
  Group,
  Stack,
  TextInput,
  NumberInput,
  Select,
  Textarea,
  FileInput,
  ActionIcon,
  Card,
  Container,
  Grid,
  Text,
  SimpleGrid,
  Modal,
  List,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import {
  IconPlus,
  IconTrash,
  IconUpload,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { createProposalRoute } from "../../routes/purchaseRoutes";
import "@mantine/dates/styles.css";
import { host } from "../../routes/globalRoutes";

const ITEM_TYPES = ["Equipment", "Consumable", "Furniture", "Books"];
const YES_NO_OPTIONS = [
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
];

const emptyItem = {
  item_name: "",
  quantity: 0,
  present_stock: 0,
  estimated_cost: 0,
  purpose: "",
  specification: "",
  item_type: "",
  item_subtype: "",
  nature: false,
  indigenous: false,
  replaced: false,
  budgetary_head: "",
  expected_delivery: null,
  sources_of_supply: "",
};

export default function IndentForm() {
  const [submitting, setSubmitting] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [designations, setDesignations] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("0");
  const role = useSelector((state) => state.user.role);
  const uploaderUsername = useSelector((state) => state.user.username);
  const navigate = useNavigate();

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(
        `${host}/purchase-and-store/api/user-suggestions`,
      );
      setUsers(response.data.users);
      setFilteredUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      forwardTo: "",
      role: "Professor",
      receiverDesignation: "Professor",
      file: null,
      items: [{ ...emptyItem }],
    },
    validate: {
      title: (value) => (!value ? "Title is required" : null),
      forwardTo: (value) => (!value ? "Forward to is required" : null),
      receiverDesignation: (value) =>
        !value ? "Receiver designation is required" : null,
      items: {
        item_name: (value) => (!value ? "Item name is required" : null),
        quantity: (value) =>
          value <= 0 ? "Quantity must be greater than 0" : null,
        item_type: (value) => (!value ? "Item type is required" : null),
      },
    },
  });

  const addItem = () => {
    if (form.values.items.length < 20) {
      const newIndex = form.values.items.length;
      form.insertListItem("items", { ...emptyItem });
      setTimeout(() => {
        setActiveTab(String(newIndex));
      }, 50);
    } else {
      alert("Maximum of 20 items allowed");
    }
  };

  const removeItem = (index) => {
    if (form.values.items.length > 1) {
      let newActiveTab;
      if (parseInt(activeTab, 10) === index) {
        if (index === form.values.items.length - 1) {
          newActiveTab = String(index - 1);
        } else {
          newActiveTab = activeTab;
        }
      } else if (parseInt(activeTab, 10) > index) {
        newActiveTab = String(parseInt(activeTab, 10) - 1);
      } else {
        newActiveTab = activeTab;
      }
      form.removeListItem("items", index);
      setTimeout(() => {
        setActiveTab(newActiveTab);
      }, 50);
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

  const fetchDesignations = async (receiverName) => {
    try {
      const response = await axios.get(
        `${host}/filetracking/getdesignations/${receiverName}/`,
      );
      setDesignations(response.data);
    } catch (error) {
      console.error("Error fetching designations:", error);
    }
  };

  const handleSearchChange = (value) => {
    filterUsers(value);
    if (value) {
      fetchDesignations(value);
    }
  };

  const calculateTotalCost = () => {
    return form.values.items.reduce(
      (total, item) => total + item.estimated_cost * item.quantity,
      0,
    );
  };

  const handleSubmit = async (values) => {
    console.log(values);
    setConfirmModalOpen(true);
  };

  const confirmSubmit = async () => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem("authToken");

      const data = {
        title: form.values.title,
        description: form.values.description,
        forwardTo: form.values.forwardTo,
        role: form.values.role,
        receiverDesignation: form.values.receiverDesignation,
        file: form.values.file,
        uploaderUsername,
        items: form.values.items.map((item) => ({
          item_name: item.item_name,
          quantity: item.quantity,
          present_stock: item.present_stock,
          estimated_cost: item.estimated_cost,
          purpose: item.purpose,
          specification: item.specification,
          item_type: item.item_type,
          item_subtype: item.item_subtype,
          nature: item.nature === "true",
          indigenous: item.indigenous === "true",
          replaced: item.replaced === "true",
          budgetary_head: item.budgetary_head,
          expected_delivery: formatDate(item.expected_delivery),
          sources_of_supply: item.sources_of_supply,
        })),
      };

      await axios.post(createProposalRoute(role), data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });

      setConfirmModalOpen(false);
      form.reset();
      navigate("/purchase/outbox");
    } catch (error) {
      console.error("Error submitting indent:", error);
      alert("Failed to submit indent. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container size="xl">
      <Modal
        opened={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title={<Title order={3}>Confirm Indent Submission</Title>}
        size="lg"
      >
        <Stack spacing="md">
          <Text>Please review the following details before submitting:</Text>

          <Card withBorder>
            <Stack spacing="xs">
              <Text fw={500}>Title: {form.values.title}</Text>
              <Text fw={500}>Forward To: {form.values.forwardTo}</Text>
              <Text fw={500}>Total Items: {form.values.items.length}</Text>
              <Text fw={500}>
                Total Estimated Cost: ₹
                {calculateTotalCost().toLocaleString("en-IN")}
              </Text>
            </Stack>
          </Card>

          <List>
            {form.values.items.map((item, index) => (
              <List.Item key={index}>
                <Text fw={500}>{item.item_name}</Text>
                <Text size="sm" color="dimmed">
                  Quantity: {item.quantity} | Cost: ₹
                  {item.estimated_cost.toLocaleString("en-IN")}
                </Text>
              </List.Item>
            ))}
          </List>

          <Group position="center" spacing="md" mt="md">
            <Button
              variant="outline"
              color="red"
              onClick={() => setConfirmModalOpen(false)}
              leftIcon={<IconX size={20} />}
            >
              Cancel
            </Button>
            <Button
              color="green"
              onClick={confirmSubmit}
              loading={submitting}
              leftIcon={<IconCheck size={20} />}
            >
              Confirm Submission
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Paper p="md" radius="md" withBorder>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack spacing="md">
            <Title order={2} align="center">
              Create New Indent
            </Title>

            <Card withBorder shadow="sm" p="md">
              <Stack spacing="md">
                <Title order={3}>General Information</Title>
                <Grid>
                  <Grid.Col span={12}>
                    <TextInput
                      label="Title"
                      required
                      value={form.values.title}
                      onChange={(event) =>
                        form.setFieldValue("title", event.currentTarget.value)
                      }
                      error={form.errors.title}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Textarea
                      label="Description"
                      minRows={3}
                      value={form.values.description}
                      onChange={(event) =>
                        form.setFieldValue(
                          "description",
                          event.currentTarget.value,
                        )
                      }
                      error={form.errors.description}
                      required
                    />
                  </Grid.Col>
                </Grid>
              </Stack>
            </Card>

            <Card withBorder shadow="sm" p="md">
              <Stack spacing="md">
                <Title order={3}>Items</Title>

                <div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginBottom: "16px",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        borderBottom: "1px solid #dee2e6",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flex: 1,
                          overflowX: "auto",
                          paddingBottom: "8px",
                          scrollbarWidth: "thin",
                          scrollbarColor: "#74c0fc #f8f9fa",
                        }}
                        className="custom-scrollbar"
                      >
                        {form.values.items.map((_, index) => (
                          <div
                            key={index}
                            onClick={() => setActiveTab(String(index))}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                setActiveTab(String(index));
                              }
                            }}
                            role="button"
                            tabIndex={0}
                            style={{
                              padding: "8px 16px",
                              cursor: "pointer",
                              backgroundColor:
                                activeTab === String(index)
                                  ? "#f1f3f5"
                                  : "transparent",
                              borderBottom:
                                activeTab === String(index)
                                  ? "2px solid #228be6"
                                  : "none",
                              display: "flex",
                              alignItems: "center",
                              marginRight: "4px",
                              whiteSpace: "nowrap",
                              minWidth: "fit-content",
                            }}
                          >
                            <span>Item {index + 1}</span>
                          </div>
                        ))}
                      </div>

                      <div
                        style={{
                          width: "1px",
                          backgroundColor: "#dee2e6",
                          margin: "0 12px",
                          alignSelf: "stretch",
                        }}
                      />

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          flexShrink: 0,
                        }}
                      >
                        {form.values.items.length < 20 && (
                          <ActionIcon
                            variant="light"
                            color="blue"
                            onClick={addItem}
                            size="md"
                            title="Add new item"
                            style={{
                              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                            }}
                          >
                            <IconPlus size={18} />
                          </ActionIcon>
                        )}

                        {form.values.items.length > 1 && (
                          <ActionIcon
                            color="red"
                            variant="light"
                            onClick={() => removeItem(parseInt(activeTab, 10))}
                            size="md"
                            title="Delete current item"
                            style={{
                              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                            }}
                          >
                            <IconTrash size={18} />
                          </ActionIcon>
                        )}
                      </div>
                    </div>
                  </div>

                  <style>
                    {`
                    .custom-scrollbar::-webkit-scrollbar {
                      height: 4px;
                    }

                    .custom-scrollbar::-webkit-scrollbar-track {
                      background: #f8f9fa;
                      border-radius: 10px;
                    }

                    .custom-scrollbar::-webkit-scrollbar-thumb {
                      background: #74c0fc;
                      border-radius: 10px;
                      opacity: 0.7;
                    }

                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                      background: #4dabf7;
                      opacity: 1;
                    }
                    `}
                  </style>

                  {form.values.items.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: activeTab === String(index) ? "block" : "none",
                      }}
                    >
                      <Grid>
                        <Grid.Col span={6}>
                          <TextInput
                            label="Item Name"
                            required
                            value={item.item_name}
                            onChange={(event) =>
                              form.setFieldValue(
                                `items.${index}.item_name`,
                                event.currentTarget.value,
                              )
                            }
                            error={form.errors.items?.[index]?.item_name}
                          />
                        </Grid.Col>
                        <Grid.Col span={3}>
                          <NumberInput
                            label="Quantity"
                            required
                            min={1}
                            value={item.quantity}
                            onChange={(value) =>
                              form.setFieldValue(
                                `items.${index}.quantity`,
                                value,
                              )
                            }
                            error={form.errors.items?.[index]?.quantity}
                          />
                        </Grid.Col>
                        <Grid.Col span={3}>
                          <NumberInput
                            label="Estimated Cost (₹)"
                            required
                            min={0}
                            value={item.estimated_cost}
                            onChange={(value) =>
                              form.setFieldValue(
                                `items.${index}.estimated_cost`,
                                value,
                              )
                            }
                            error={form.errors.items?.[index]?.estimated_cost}
                          />
                        </Grid.Col>
                      </Grid>

                      <Grid>
                        <Grid.Col span={6}>
                          <Select
                            label="Item Type"
                            required
                            data={ITEM_TYPES}
                            value={item.item_type}
                            onChange={(value) =>
                              form.setFieldValue(
                                `items.${index}.item_type`,
                                value,
                              )
                            }
                            error={form.errors.items?.[index]?.item_type}
                          />
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <TextInput
                            label="Item Subtype"
                            value={item.item_subtype}
                            onChange={(event) =>
                              form.setFieldValue(
                                `items.${index}.item_subtype`,
                                event.currentTarget.value,
                              )
                            }
                            required
                          />
                        </Grid.Col>
                      </Grid>

                      <Grid>
                        <Grid.Col span={6}>
                          <NumberInput
                            label="Present Stock"
                            min={0}
                            value={item.present_stock}
                            onChange={(value) =>
                              form.setFieldValue(
                                `items.${index}.present_stock`,
                                value,
                              )
                            }
                            required
                          />
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <TextInput
                            label="Budgetary Head"
                            value={item.budgetary_head}
                            onChange={(event) =>
                              form.setFieldValue(
                                `items.${index}.budgetary_head`,
                                event.currentTarget.value,
                              )
                            }
                            required
                          />
                        </Grid.Col>
                      </Grid>

                      <SimpleGrid cols={3} spacing="md" mt="md">
                        <div>
                          <Text size="sm" fw={500}>
                            Nature <span style={{ color: "red" }}>*</span>
                          </Text>
                          <Select
                            data={YES_NO_OPTIONS}
                            value={String(item.nature)}
                            onChange={(value) =>
                              form.setFieldValue(`items.${index}.nature`, value)
                            }
                            required
                          />
                        </div>
                        <div>
                          <Text size="sm" fw={500}>
                            Indigenous <span style={{ color: "red" }}>*</span>
                          </Text>
                          <Select
                            data={YES_NO_OPTIONS}
                            value={String(item.indigenous)}
                            onChange={(value) =>
                              form.setFieldValue(
                                `items.${index}.indigenous`,
                                value,
                              )
                            }
                            required
                          />
                        </div>
                        <div>
                          <Text size="sm" fw={500}>
                            Replaced <span style={{ color: "red" }}>*</span>
                          </Text>
                          <Select
                            data={YES_NO_OPTIONS}
                            value={String(item.replaced)}
                            onChange={(value) =>
                              form.setFieldValue(
                                `items.${index}.replaced`,
                                value,
                              )
                            }
                            required
                          />
                        </div>
                      </SimpleGrid>

                      <TextInput
                        label="Purpose"
                        value={item.purpose}
                        onChange={(event) =>
                          form.setFieldValue(
                            `items.${index}.purpose`,
                            event.currentTarget.value,
                          )
                        }
                        required
                      />
                      <TextInput
                        label="Specification"
                        value={item.specification}
                        onChange={(event) =>
                          form.setFieldValue(
                            `items.${index}.specification`,
                            event.currentTarget.value,
                          )
                        }
                        required
                      />

                      <Grid>
                        <Grid.Col span={6}>
                          <DateInput
                            label="Expected Delivery"
                            value={item.expected_delivery}
                            onChange={(value) =>
                              form.setFieldValue(
                                `items.${index}.expected_delivery`,
                                value,
                              )
                            }
                            required
                            minDate={new Date()}
                          />
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <TextInput
                            label="Source of Supply"
                            value={item.sources_of_supply}
                            onChange={(event) =>
                              form.setFieldValue(
                                `items.${index}.sources_of_supply`,
                                event.currentTarget.value,
                              )
                            }
                            required
                          />
                        </Grid.Col>
                      </Grid>

                      <FileInput
                        label="Attachment"
                        placeholder="Upload file"
                        icon={<IconUpload size={14} />}
                        value={item.file}
                        onChange={(file) =>
                          form.setFieldValue(`items.${index}.file`, file)
                        }
                      />
                    </div>
                  ))}
                </div>
              </Stack>
            </Card>

            <Card withBorder shadow="sm" p="md">
              <Stack spacing="md">
                <Title order={3}>Forward Information</Title>
                <Grid>
                  <Grid.Col xs={12} md={6}>
                    <Select
                      label="Forward To"
                      placeholder="Select receiver"
                      value={form.values.forwardTo}
                      onChange={(value) =>
                        form.setFieldValue("forwardTo", value)
                      }
                      data={filteredUsers.map((user) => ({
                        value: user.username,
                        label: user.username,
                      }))}
                      onSearchChange={handleSearchChange}
                      searchable
                      required
                      clearable
                      error={form.errors.forwardTo}
                    />
                  </Grid.Col>
                  <Grid.Col xs={12} md={6}>
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
                      required
                      error={form.errors.receiverDesignation}
                    />
                  </Grid.Col>
                </Grid>
              </Stack>
            </Card>
          </Stack>

          <Group position="center" spacing="md">
            <Button type="submit" loading={submitting} color="green">
              Submit Indent
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}
