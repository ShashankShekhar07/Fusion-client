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
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconPlus, IconTrash, IconUpload } from "@tabler/icons-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { createProposalRoute } from "../../routes/purchaseRoutes";
import "@mantine/dates/styles.css";

const ITEM_TYPES = ["Equipment", "Consumable", "Furniture", "Books"];

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

export function IndentForm() {
  const [submitting, setSubmitting] = useState(false);
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
        "http://127.0.0.1:8000/purchase-and-store/api/user-suggestions",
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
        `http://127.0.0.1:8000/filetracking/getdesignations/${receiverName}/`,
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

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem("authToken");

      const data = {
        title: values.title,
        description: values.description,
        forwardTo: values.forwardTo,
        role: values.role,
        receiverDesignation: values.receiverDesignation,
        file: values.file,
        uploaderUsername,
        items: values.items.map((item) => ({
          item_name: item.item_name,
          quantity: item.quantity,
          present_stock: item.present_stock,
          estimated_cost: item.estimated_cost,
          purpose: item.purpose,
          specification: item.specification,
          item_type: item.item_type,
          item_subtype: item.item_subtype,
          nature: item.nature,
          indigenous: item.indigenous,
          replaced: item.replaced,
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

      alert("Indent submitted successfully!");
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
                          />
                        </Grid.Col>
                      </Grid>

                      <TextInput
                        label="Purpose"
                        value={item.purpose}
                        onChange={(event) =>
                          form.setFieldValue(
                            `items.${index}.purpose`,
                            event.currentTarget.value,
                          )
                        }
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
                      error={form.errors.receiverDesignation}
                    />
                  </Grid.Col>
                </Grid>
              </Stack>
            </Card>
          </Stack>

          <Group position="center" spacing="md">
            <Button type="submit" loading={submitting}>
              Submit Indent
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}

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
//   Tabs,
//   Box,
// } from "@mantine/core";
// import { DateInput } from "@mantine/dates";
// import { useForm } from "@mantine/form";
// import { IconPlus, IconTrash, IconUpload } from "@tabler/icons-react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import { createProposalRoute } from "../../routes/purchaseRoutes";
// import "@mantine/dates/styles.css";

// const ITEM_TYPES = ["Equipment", "Consumable", "Furniture", "Books"];

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

// export function IndentForm() {
//   const [submitting, setSubmitting] = useState(false);
//   const [designations, setDesignations] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [activeTab, setActiveTab] = useState("0"); // Changed to string to match Mantine Tabs
//   const role = useSelector((state) => state.user.role);
//   const uploaderUsername = useSelector((state) => state.user.username);
//   const navigate = useNavigate();

//   const fetchAllUsers = async () => {
//     try {
//       const response = await axios.get(
//         "http://127.0.0.1:8000/purchase-and-store/api/user-suggestions",
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
//       if (parseInt(activeTab) === index) {
//         if (index === form.values.items.length - 1) {
//           newActiveTab = String(index - 1);
//         } else {
//           newActiveTab = activeTab;
//         }
//       } else if (parseInt(activeTab) > index) {
//         newActiveTab = String(parseInt(activeTab) - 1);
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
//         `http://127.0.0.1:8000/filetracking/getdesignations/${receiverName}/`,
//       );
//       setDesignations(response.data);
//     } catch (error) {
//       console.error("Error fetching designations:", error);
//     }
//   };

//   const handleSearchChange = (value) => {
//     filterUsers(value);
//     fetchDesignations(value);
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
//         items: values.items.map((item) => ({
//           item_name: item.item_name,
//           quantity: item.quantity,
//           present_stock: item.present_stock,
//           estimated_cost: item.estimated_cost,
//           purpose: item.purpose,
//           specification: item.specification,
//           item_type: item.item_type,
//           item_subtype: item.item_subtype,
//           nature: item.nature,
//           indigenous: item.indigenous,
//           replaced: item.replaced,
//           budgetary_head: item.budgetary_head,
//           expected_delivery: formatDate(item.expected_delivery),
//           sources_of_supply: item.sources_of_supply,
//         })),
//       };
//       console.log("data", data);
//       await axios.post(createProposalRoute(role), data, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Token ${token}`,
//         },
//       });

//       alert("Indent submitted successfully!");
//       form.reset();
//       setTimeout(() => {
//         window.location.href = "/purchase/outbox";
//       }, 100);
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

//             {/* General Information */}
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
//                     />
//                   </Grid.Col>
//                 </Grid>
//               </Stack>
//             </Card>

//             {/* Items with Tab Navigation */}
//             <Card withBorder shadow="sm" p="md">
//               <Stack spacing="md">
//                 <Title order={3}>Items</Title>

//                 {/* Custom Tab Navigation */}
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
//                             onClick={() => removeItem(parseInt(activeTab))}
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

//                   <style jsx global>{`
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
//                   `}</style>

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
//                           />
//                         </Grid.Col>
//                       </Grid>

//                       <TextInput
//                         label="Purpose"
//                         value={item.purpose}
//                         onChange={(event) =>
//                           form.setFieldValue(
//                             `items.${index}.purpose`,
//                             event.currentTarget.value,
//                           )
//                         }
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

//             {/* Forward Information */}
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

// import { useState, useEffect, useMemo, useCallback, useRef } from "react";
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
// } from "@mantine/core";
// import { DateInput } from "@mantine/dates";
// import { useForm } from "@mantine/form";
// import { IconPlus, IconTrash, IconUpload } from "@tabler/icons-react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import { createProposalRoute } from "../../routes/purchaseRoutes";
// import "@mantine/dates/styles.css";

// const ITEM_TYPES = ["Equipment", "Consumable", "Furniture", "Books"];

// const emptyItem = {
//   itemName: "",
//   quantity: 0,
//   cost: 0,
//   itemType: "",
//   presentStock: 0,
//   purpose: "",
//   specification: "",
//   itemSubtype: "",
//   budgetaryHead: "",
//   expectedDelivery: null,
//   sourceOfSupply: "",
//   remark: "",
//   file: null,
// };

// export function IndentForm() {
//   const [submitting, setSubmitting] = useState(false);
//   const [designations, setDesignations] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [activeTab, setActiveTab] = useState("0");
//   const [formError, setFormError] = useState({});
//   const [itemCount, setItemCount] = useState(1);

//   const role = useSelector((state) => state.user.role);
//   const titleRef = useRef("");
//   const descriptionRef = useRef("");
//   const forwardToRef = useRef("");
//   const receiverDesignationRef = useRef("");
//   const itemsRef = useRef([{ ...emptyItem }]);

//   const fetchAllUsers = useCallback(async () => {
//     try {
//       const response = await axios.get(
//         "http://127.0.0.1:8000/purchase-and-store/api/user-suggestions",
//       );
//       setUsers(response.data.users);
//       setFilteredUsers(response.data.users);
//     } catch (error) {
//       console.error("Error fetching users", error);
//     }
//   }, []);

//   useEffect(() => {
//     fetchAllUsers();
//   }, [fetchAllUsers]);

//   const form = useForm({
//     initialValues: {
//       title: "",
//       description: "",
//       forwardTo: "",
//       receiverDesignation: "",
//       items: [{ ...emptyItem }],
//     },
//     validate: {
//       title: (value) => (!value ? "Title is required" : null),
//       forwardTo: (value) => (!value ? "Forward to is required" : null),
//       receiverDesignation: (value) =>
//         !value ? "Receiver designation is required" : null,
//       items: {
//         itemName: (value) => (!value ? "Item name is required" : null),
//         quantity: (value) =>
//           value <= 0 ? "Quantity must be greater than 0" : null,
//         itemType: (value) => (!value ? "Item type is required" : null),
//       },
//     },
//   });

//   // Update text/generic field in ref without re-rendering
//   const updateFieldRef = useCallback((ref, value) => {
//     ref.current = value;
//   }, []);

//   // Update item field in ref without re-rendering
//   const updateItemField = useCallback((index, field, value) => {
//     // Clone the current items to avoid reference issues
//     if (!itemsRef.current[index]) {
//       itemsRef.current[index] = { ...emptyItem };
//     }
//     // Update specific field
//     itemsRef.current[index][field] = value;
//   }, []);

//   const addItem = useCallback(() => {
//     if (itemsRef.current.length < 20) {
//       // Add new item to ref
//       itemsRef.current.push({ ...emptyItem });
//       // Update item count state - this will trigger re-render but only when adding item
//       setItemCount((prev) => prev + 1);
//       // Set active tab to the new item
//       const newIndex = itemsRef.current.length - 1;
//       setTimeout(() => {
//         setActiveTab(String(newIndex));
//       }, 50);
//     } else {
//       alert("Maximum of 20 items allowed");
//     }
//   }, []);

//   const removeItem = useCallback(
//     (index) => {
//       if (itemsRef.current.length > 1) {
//         let newActiveTab;
//         if (parseInt(activeTab, 10) === index) {
//           if (index === itemsRef.current.length - 1) {
//             newActiveTab = String(index - 1);
//           } else {
//             newActiveTab = activeTab;
//           }
//         } else if (parseInt(activeTab, 10) > index) {
//           newActiveTab = String(parseInt(activeTab, 10) - 1);
//         } else {
//           newActiveTab = activeTab;
//         }
//         // Remove item from ref
//         itemsRef.current.splice(index, 1);
//         // Update item count state
//         setItemCount((prev) => prev - 1);
//         setTimeout(() => {
//           setActiveTab(newActiveTab);
//         }, 50);
//       }
//     },
//     [activeTab],
//   );

//   const formatDate = useCallback((date) => {
//     if (!date) return null;
//     const d = new Date(date);
//     const year = d.getFullYear();
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const day = String(d.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   }, []);

//   const filterUsers = useCallback(
//     (searchQuery) => {
//       if (searchQuery === "") {
//         setFilteredUsers(users);
//       } else {
//         const filtered = users.filter((user) =>
//           user.username.toLowerCase().includes(searchQuery.toLowerCase()),
//         );
//         setFilteredUsers(filtered);
//       }
//     },
//     [users],
//   );

//   const fetchDesignations = useCallback(async (receiverName) => {
//     try {
//       const response = await axios.get(
//         `http://127.0.0.1:8000/filetracking/getdesignations/${receiverName}/`,
//       );
//       setDesignations(response.data);
//     } catch (error) {
//       console.error("Error fetching designations:", error);
//     }
//   }, []);

//   const handleSearchChange = useCallback(
//     (value) => {
//       filterUsers(value);
//       fetchDesignations(value);
//     },
//     [filterUsers, fetchDesignations],
//   );

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
//         items: values.items.map((item) => ({
//           item_name: item.item_name,
//           quantity: item.quantity,
//           present_stock: item.present_stock,
//           estimated_cost: item.estimated_cost,
//           purpose: item.purpose,
//           specification: item.specification,
//           item_type: item.item_type,
//           item_subtype: item.item_subtype,
//           nature: item.nature,
//           indigenous: item.indigenous,
//           replaced: item.replaced,
//           budgetary_head: item.budgetary_head,
//           expected_delivery: formatDate(item.expected_delivery),
//           sources_of_supply: item.sources_of_supply,
//         })),
//       };
//       console.log("data", data);
//       // await axios.post(createProposalRoute(role), data, {
//       //   headers: {
//       //     "Content-Type": "application/json",
//       //     Authorization: `Token ${token}`,
//       //   },
//       // });

//       // alert("Indent submitted successfully!");
//       // form.reset();
//       // setTimeout(() => {
//       //   window.location.href = "/purchase/outbox";
//       // }, 100);
//     } catch (error) {
//       console.error("Error submitting indent:", error);
//       alert("Failed to submit indent. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Memoize the user data transformation to prevent expensive operations on each render
//   const userOptions = useMemo(
//     () =>
//       filteredUsers.map((user) => ({
//         value: user.username,
//         label: user.username,
//       })),
//     [filteredUsers],
//   );

//   // Memoize designation data transformation
//   const designationOptions = useMemo(
//     () =>
//       designations.map((designation) => ({
//         value: designation,
//         label: designation,
//       })),
//     [designations],
//   );

//   // Memoized style for tabs to prevent recreation on each render
//   const getTabStyle = useCallback(
//     (index) => ({
//       padding: "8px 16px",
//       cursor: "pointer",
//       backgroundColor: activeTab === String(index) ? "#f1f3f5" : "transparent",
//       borderBottom: activeTab === String(index) ? "2px solid #228be6" : "none",
//       display: "flex",
//       alignItems: "center",
//       gap: "4px",
//       whiteSpace: "nowrap",
//       width: "fit-content",
//     }),
//     [activeTab],
//   );

//   // Memoize tab components
//   const tabComponents = useMemo(
//     () =>
//       Array.from({ length: itemCount }).map((_, index) => (
//         <div
//           key={index}
//           onClick={() => setActiveTab(String(index))}
//           onKeyDown={(e) => {
//             if (e.key === "Enter" || e.key === " ") {
//               setActiveTab(String(index));
//             }
//           }}
//           role="tab"
//           tabIndex={0}
//           style={getTabStyle(index)}
//         >
//           <span>Item {index + 1}</span>
//         </div>
//       )),
//     [getTabStyle, setActiveTab, itemCount],
//   );

//   return (
//     <Container size="xl">
//       <Paper p="md" radius="md" withBorder>
//         <form onSubmit={handleSubmit}>
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
//                       defaultValue={titleRef.current}
//                       onChange={(event) =>
//                         updateFieldRef(titleRef, event.currentTarget.value)
//                       }
//                       error={formError.title}
//                     />
//                   </Grid.Col>
//                   <Grid.Col span={12}>
//                     <Textarea
//                       label="Description"
//                       minRows={3}
//                       defaultValue={descriptionRef.current}
//                       onChange={(event) =>
//                         updateFieldRef(
//                           descriptionRef,
//                           event.currentTarget.value,
//                         )
//                       }
//                       error={formError.description}
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
//                           overflowX: "auto",
//                           paddingBottom: "8px",
//                           scrollbarWidth: "thin",
//                           scrollbarColor: "#74c0fc #f8f9fa",
//                         }}
//                         className="custom-scrollbar"
//                       >
//                         {tabComponents}
//                       </div>
//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           gap: "8px",
//                           flexShrink: 0,
//                         }}
//                       >
//                         <div
//                           style={{
//                             width: "1px",
//                             backgroundColor: "#dee2e6",
//                             margin: "0 12px",
//                             alignSelf: "stretch",
//                           }}
//                         />
//                         {itemCount < 20 && (
//                           <ActionIcon
//                             variant="light"
//                             color="blue"
//                             onClick={addItem}
//                             size="md"
//                             title="Add new item"
//                             style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}
//                           >
//                             <IconPlus size={18} />
//                           </ActionIcon>
//                         )}
//                         {itemCount > 1 && (
//                           <ActionIcon
//                             color="red"
//                             variant="light"
//                             onClick={() => removeItem(parseInt(activeTab, 10))}
//                             size="md"
//                             title="Delete current item"
//                             style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}
//                           >
//                             <IconTrash size={18} />
//                           </ActionIcon>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   <style>{`
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
//                   `}</style>

//                   {Array.from({ length: itemCount }).map((_, index) => {
//                     const item = itemsRef.current[index] || { ...emptyItem };

//                     return (
//                       <div
//                         key={index}
//                         style={{
//                           display:
//                             activeTab === String(index) ? "block" : "none",
//                         }}
//                       >
//                         <Grid>
//                           <Grid.Col span={6}>
//                             <TextInput
//                               label="Item Name"
//                               required
//                               defaultValue={item.itemName}
//                               onChange={(event) =>
//                                 updateItemField(
//                                   index,
//                                   "itemName",
//                                   event.currentTarget.value,
//                                 )
//                               }
//                               error={formError.items?.[index]?.itemName}
//                             />
//                           </Grid.Col>
//                           <Grid.Col span={3}>
//                             <NumberInput
//                               label="Quantity"
//                               required
//                               min={1}
//                               defaultValue={item.quantity}
//                               onChange={(value) =>
//                                 updateItemField(index, "quantity", value)
//                               }
//                               error={formError.items?.[index]?.quantity}
//                             />
//                           </Grid.Col>
//                           <Grid.Col span={3}>
//                             <NumberInput
//                               label="Cost (₹)"
//                               required
//                               min={0}
//                               defaultValue={item.cost}
//                               onChange={(value) =>
//                                 updateItemField(index, "cost", value)
//                               }
//                               error={formError.items?.[index]?.cost}
//                             />
//                           </Grid.Col>
//                         </Grid>

//                         <Grid>
//                           <Grid.Col span={6}>
//                             <Select
//                               label="Item Type *"
//                               required
//                               data={ITEM_TYPES}
//                               defaultValue={item.itemType}
//                               onChange={(value) =>
//                                 updateItemField(index, "itemType", value)
//                               }
//                               error={formError.items?.[index]?.itemType}
//                             />
//                           </Grid.Col>
//                           <Grid.Col span={6}>
//                             <TextInput
//                               label="Item Subtype"
//                               defaultValue={item.itemSubtype}
//                               onChange={(event) =>
//                                 updateItemField(
//                                   index,
//                                   "itemSubtype",
//                                   event.currentTarget.value,
//                                 )
//                               }
//                             />
//                           </Grid.Col>
//                         </Grid>

//                         <Grid>
//                           <Grid.Col span={6}>
//                             <NumberInput
//                               label="Present Stock"
//                               min={0}
//                               defaultValue={item.presentStock}
//                               onChange={(value) =>
//                                 updateItemField(index, "presentStock", value)
//                               }
//                             />
//                           </Grid.Col>
//                           <Grid.Col span={6}>
//                             <TextInput
//                               label="Budgetary Head"
//                               defaultValue={item.budgetaryHead}
//                               onChange={(event) =>
//                                 updateItemField(
//                                   index,
//                                   "budgetaryHead",
//                                   event.currentTarget.value,
//                                 )
//                               }
//                             />
//                           </Grid.Col>
//                         </Grid>

//                         <TextInput
//                           label="Purpose"
//                           defaultValue={item.purpose}
//                           onChange={(event) =>
//                             updateItemField(
//                               index,
//                               "purpose",
//                               event.currentTarget.value,
//                             )
//                           }
//                         />
//                         <TextInput
//                           label="Specification"
//                           defaultValue={item.specification}
//                           onChange={(event) =>
//                             updateItemField(
//                               index,
//                               "specification",
//                               event.currentTarget.value,
//                             )
//                           }
//                         />

//                         <Grid>
//                           <Grid.Col span={6}>
//                             <DateInput
//                               label="Expected Delivery"
//                               defaultValue={item.expectedDelivery}
//                               onChange={(value) =>
//                                 updateItemField(
//                                   index,
//                                   "expectedDelivery",
//                                   value,
//                                 )
//                               }
//                             />
//                           </Grid.Col>
//                           <Grid.Col span={6}>
//                             <TextInput
//                               label="Source of Supply"
//                               defaultValue={item.sourceOfSupply}
//                               onChange={(event) =>
//                                 updateItemField(
//                                   index,
//                                   "sourceOfSupply",
//                                   event.currentTarget.value,
//                                 )
//                               }
//                             />
//                           </Grid.Col>
//                         </Grid>

//                         <TextInput
//                           label="Remarks"
//                           defaultValue={item.remark}
//                           onChange={(event) =>
//                             updateItemField(
//                               index,
//                               "remark",
//                               event.currentTarget.value,
//                             )
//                           }
//                         />

//                         <FileInput
//                           label="Attachment"
//                           placeholder="Upload file"
//                           icon={<IconUpload size={14} />}
//                           defaultValue={item.file}
//                           onChange={(file) =>
//                             updateItemField(index, "file", file)
//                           }
//                         />
//                       </div>
//                     );
//                   })}
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
//                       defaultValue={forwardToRef.current}
//                       onChange={(value) => updateFieldRef(forwardToRef, value)}
//                       data={userOptions}
//                       onSearchChange={handleSearchChange}
//                       searchable
//                       clearable
//                       error={formError.forwardTo}
//                     />
//                   </Grid.Col>
//                   <Grid.Col xs={12} md={6}>
//                     <Select
//                       label="Receiver Designation"
//                       placeholder="Select designation"
//                       data={designationOptions}
//                       defaultValue={receiverDesignationRef.current}
//                       onChange={(value) =>
//                         updateFieldRef(receiverDesignationRef, value)
//                       }
//                       searchable
//                       clearable
//                       error={formError.receiverDesignation}
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

// import { useState, useEffect, useMemo, useCallback, useRef } from "react";
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
// } from "@mantine/core";
// import { DateInput } from "@mantine/dates";
// import { useForm } from "@mantine/form";
// import { IconPlus, IconTrash, IconUpload } from "@tabler/icons-react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import { createProposalRoute } from "../../routes/purchaseRoutes";
// import "@mantine/dates/styles.css";
// import { useNavigate } from "react-router-dom";

// const ITEM_TYPES = ["Equipment", "Consumable", "Furniture", "Books"];

// // const emptyItem = {
// //   itemName: "",
// //   quantity: 0,
// //   cost: 0,
// //   itemType: "",
// //   presentStock: 0,
// //   purpose: "",
// //   specification: "",
// //   itemSubtype: "",
// //   budgetaryHead: "",
// //   expectedDelivery: null,
// //   sourceOfSupply: "",
// //   remark: "",
// //   file: null,
// // };
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

// export function IndentForm() {
//   const [submitting, setSubmitting] = useState(false);
//   const [designations, setDesignations] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [activeTab, setActiveTab] = useState("0");
//   const [formError, setFormError] = useState({});
//   const [itemCount, setItemCount] = useState(1);

//   const role = useSelector((state) => state.user.role);
//   const titleRef = useRef("");
//   const descriptionRef = useRef("");
//   const forwardToRef = useRef("");
//   const receiverDesignationRef = useRef("");
//   const itemsRef = useRef([{ ...emptyItem }]);

//   const fetchAllUsers = useCallback(async () => {
//     try {
//       const response = await axios.get(
//         "http://127.0.0.1:8000/purchase-and-store/api/user-suggestions",
//       );
//       setUsers(response.data.users);
//       setFilteredUsers(response.data.users);
//     } catch (error) {
//       console.error("Error fetching users", error);
//     }
//   }, []);

//   useEffect(() => {
//     fetchAllUsers();
//   }, [fetchAllUsers]);

//   const form = useForm({
//     initialValues: {
//       title: "",
//       description: "",
//       forwardTo: "",
//       receiverDesignation: "",
//       items: [{ ...emptyItem }],
//     },
//     validate: {
//       title: (value) => (!value ? "Title is required" : null),
//       forwardTo: (value) => (!value ? "Forward to is required" : null),
//       receiverDesignation: (value) =>
//         !value ? "Receiver designation is required" : null,
//       // items: {
//       //   itemName: (value) => (!value ? "Item name is required" : null),
//       //   quantity: (value) =>
//       //     value <= 0 ? "Quantity must be greater than 0" : null,
//       //   itemType: (value) => (!value ? "Item type is required" : null),
//       // },
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
//       if (parseInt(activeTab) === index) {
//         if (index === form.values.items.length - 1) {
//           newActiveTab = String(index - 1);
//         } else {
//           newActiveTab = activeTab;
//         }
//       } else if (parseInt(activeTab) > index) {
//         newActiveTab = String(parseInt(activeTab) - 1);
//       } else {
//         newActiveTab = activeTab;
//       }
//       form.removeListItem("items", index);
//       setTimeout(() => {
//         setActiveTab(newActiveTab);
//       }, 50);
//     }
//   };

//   // Update text/generic field in ref without re-rendering
//   const updateFieldRef = useCallback((ref, value) => {
//     ref.current = value;
//   }, []);

//   // Update item field in ref without re-rendering
//   const updateItemField = useCallback((index, field, value) => {
//     // Clone the current items to avoid reference issues
//     if (!itemsRef.current[index]) {
//       itemsRef.current[index] = { ...emptyItem };
//     }
//     // Update specific field
//     itemsRef.current[index][field] = value;
//   }, []);

//   // const addItem = useCallback(() => {
//   //   if (itemsRef.current.length < 20) {
//   //     // Add new item to ref
//   //     itemsRef.current.push({ ...emptyItem });
//   //     // Update item count state - this will trigger re-render but only when adding item
//   //     setItemCount((prev) => prev + 1);
//   //     // Set active tab to the new item
//   //     const newIndex = itemsRef.current.length - 1;
//   //     setTimeout(() => {
//   //       setActiveTab(String(newIndex));
//   //     }, 50);
//   //   } else {
//   //     alert("Maximum of 20 items allowed");
//   //   }
//   // }, []);

//   // const removeItem = useCallback(
//   //   (index) => {
//   //     if (itemsRef.current.length > 1) {
//   //       let newActiveTab;
//   //       if (parseInt(activeTab, 10) === index) {
//   //         if (index === itemsRef.current.length - 1) {
//   //           newActiveTab = String(index - 1);
//   //         } else {
//   //           newActiveTab = activeTab;
//   //         }
//   //       } else if (parseInt(activeTab, 10) > index) {
//   //         newActiveTab = String(parseInt(activeTab, 10) - 1);
//   //       } else {
//   //         newActiveTab = activeTab;
//   //       }
//   //       // Remove item from ref
//   //       itemsRef.current.splice(index, 1);
//   //       // Update item count state
//   //       setItemCount((prev) => prev - 1);
//   //       setTimeout(() => {
//   //         setActiveTab(newActiveTab);
//   //       }, 50);
//   //     }
//   //   },
//   //   [activeTab],
//   // );
//   const navigate = useNavigate();
//   const formatDate = useCallback((date) => {
//     if (!date) return null;
//     const d = new Date(date);
//     const year = d.getFullYear();
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const day = String(d.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   }, []);

//   const filterUsers = useCallback(
//     (searchQuery) => {
//       if (searchQuery === "") {
//         setFilteredUsers(users);
//       } else {
//         const filtered = users.filter((user) =>
//           user.username.toLowerCase().includes(searchQuery.toLowerCase()),
//         );
//         setFilteredUsers(filtered);
//       }
//     },
//     [users],
//   );

//   const fetchDesignations = useCallback(async (receiverName) => {
//     try {
//       const response = await axios.get(
//         `http://127.0.0.1:8000/filetracking/getdesignations/${receiverName}/`,
//       );
//       setDesignations(response.data);
//     } catch (error) {
//       console.error("Error fetching designations:", error);
//     }
//   }, []);

//   const handleSearchChange = useCallback(
//     (value) => {
//       filterUsers(value);
//       fetchDesignations(value);
//     },
//     [filterUsers, fetchDesignations],
//   );

//   // const handleSubmit = async (values) => {
//   //   try {
//   //     setSubmitting(true);
//   //     const token = localStorage.getItem("authToken");

//   //     const data = {
//   //       title: titleRef.current,
//   //       description: descriptionRef.current,
//   //       forwardTo: forwardToRef.current,
//   //       role: role,
//   //       receiverDesignation: receiverDesignationRef.current,
//   //       items: itemsRef.current.map((item) => ({
//   //         item_name: item.itemName,
//   //         quantity: item.quantity,
//   //         present_stock: item.presentStock,
//   //         estimated_cost: item.cost,
//   //         purpose: item.purpose,
//   //         specification: item.specification,
//   //         item_type: item.itemType,
//   //         item_subtype: item.itemSubtype,
//   //         budgetary_head: item.budgetaryHead,
//   //         expected_delivery: formatDate(item.expectedDelivery),
//   //         sources_of_supply: item.sourceOfSupply,
//   //         file: item.file,
//   //         remark: item.remark,
//   //       })),
//   //     };
//   //     console.log("data", data);
//   //     // await axios.post(createProposalRoute(role), data, {
//   //     //   headers: {
//   //     //     "Content-Type": "application/json",
//   //     //     Authorization: `Token ${token}`,
//   //     //   },
//   //     // });

//   //     // alert("Indent submitted successfully!");
//   //     // form.reset();
//   //     // setTimeout(() => {
//   //     //   window.location.href = "/purchase/outbox";
//   //     // }, 100);
//   //   } catch (error) {
//   //     console.error("Error submitting indent:", error);
//   //     alert("Failed to submit indent. Please try again.");
//   //   } finally {
//   //     setSubmitting(false);
//   //   }
//   // };

//   const handleSubmit = async (values) => {
//     event.preventDefault();
//     try {
//       setSubmitting(true);
//       const token = localStorage.getItem("authToken");
//       console.log("items", itemsRef.current);
//       const data = {
//         title: titleRef.current,
//         description: descriptionRef.current,
//         forwardTo: forwardToRef.current,
//         role: role,
//         receiverDesignation: receiverDesignationRef.current,
//         file: values.file, // Assuming the main file is separate from item files
//         items: itemsRef.current.map((item) => ({
//           item_name: item.itemName,
//           quantity: item.quantity,
//           present_stock: item.presentStock,
//           estimated_cost: item.cost,
//           purpose: item.purpose,
//           specification: item.specification,
//           item_type: item.itemType,
//           item_subtype: item.itemSubtype,
//           budgetary_head: item.budgetaryHead,
//           expected_delivery: formatDate(item.expectedDelivery),
//           sources_of_supply: item.sourceOfSupply,
//           nature: item.nature || false,
//           indigenous: item.indigenous || false,
//           replaced: item.replaced || false,
//         })),
//         // items: itemsRef.current.map((item) => ({
//         //   item_name: item.item,
//         //   quantity: item.quantity,
//         //   present_stock: item.present_stock,
//         //   estimated_cost: item.estimated_cost,
//         //   purpose: item.purpose,
//         //   specification: item.specification,
//         //   item_type: item.item_type,
//         //   item_subtype: item.item_subtype,
//         //   nature: item.nature,
//         //   indigenous: item.indigenous,
//         //   replaced: item.replaced,
//         //   budgetary_head: item.budgetary_head,
//         //   expected_delivery: formatDate(item.expected_delivery),
//         //   sources_of_supply: item.sources_of_supply,
//         // })),
//       };

//       console.log("data", data);

//       // Uncomment this when ready for API call
//       await axios.post(createProposalRoute(role), data, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Token ${token}`,
//         },
//       });

//       alert("Indent submitted successfully!");
//       navigate("/purchase/outbox");
//     } catch (error) {
//       console.log("items", itemsRef.current);
//       console.error("Error submitting indent:", error);
//       alert("Failed to submit indent. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Memoize the user data transformation to prevent expensive operations on each render
//   const userOptions = useMemo(
//     () =>
//       filteredUsers.map((user) => ({
//         value: user.username,
//         label: user.username,
//       })),
//     [filteredUsers],
//   );

//   // Memoize designation data transformation
//   const designationOptions = useMemo(
//     () =>
//       designations.map((designation) => ({
//         value: designation,
//         label: designation,
//       })),
//     [designations],
//   );

//   // Memoized style for tabs to prevent recreation on each render
//   const getTabStyle = useCallback(
//     (index) => ({
//       padding: "8px 16px",
//       cursor: "pointer",
//       backgroundColor: activeTab === String(index) ? "#f1f3f5" : "transparent",
//       borderBottom: activeTab === String(index) ? "2px solid #228be6" : "none",
//       display: "flex",
//       alignItems: "center",
//       gap: "4px",
//       whiteSpace: "nowrap",
//       width: "fit-content",
//     }),
//     [activeTab],
//   );

//   // Memoize tab components
//   const tabComponents = useMemo(
//     () =>
//       Array.from({ length: itemCount }).map((_, index) => (
//         <div
//           key={index}
//           onClick={() => setActiveTab(String(index))}
//           onKeyDown={(e) => {
//             if (e.key === "Enter" || e.key === " ") {
//               setActiveTab(String(index));
//             }
//           }}
//           role="tab"
//           tabIndex={0}
//           style={getTabStyle(index)}
//         >
//           <span>Item {index + 1}</span>
//         </div>
//       )),
//     [getTabStyle, setActiveTab, itemCount],
//   );

//   return (
//     <Container size="xl">
//       <Paper p="md" radius="md" withBorder>
//         <form onSubmit={handleSubmit}>
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
//                       defaultValue={titleRef.current}
//                       onChange={(event) =>
//                         updateFieldRef(titleRef, event.currentTarget.value)
//                       }
//                       error={formError.title}
//                     />
//                   </Grid.Col>
//                   <Grid.Col span={12}>
//                     <Textarea
//                       label="Description"
//                       minRows={3}
//                       defaultValue={descriptionRef.current}
//                       onChange={(event) =>
//                         updateFieldRef(
//                           descriptionRef,
//                           event.currentTarget.value,
//                         )
//                       }
//                       error={formError.description}
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
//                           overflowX: "auto",
//                           paddingBottom: "8px",
//                           scrollbarWidth: "thin",
//                           scrollbarColor: "#74c0fc #f8f9fa",
//                         }}
//                         className="custom-scrollbar"
//                       >
//                         {tabComponents}
//                       </div>
//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           gap: "8px",
//                           flexShrink: 0,
//                         }}
//                       >
//                         <div
//                           style={{
//                             width: "1px",
//                             backgroundColor: "#dee2e6",
//                             margin: "0 12px",
//                             alignSelf: "stretch",
//                           }}
//                         />
//                         {itemCount < 20 && (
//                           <ActionIcon
//                             variant="light"
//                             color="blue"
//                             onClick={addItem}
//                             size="md"
//                             title="Add new item"
//                             style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}
//                           >
//                             <IconPlus size={18} />
//                           </ActionIcon>
//                         )}
//                         {itemCount > 1 && (
//                           <ActionIcon
//                             color="red"
//                             variant="light"
//                             onClick={() => removeItem(parseInt(activeTab, 10))}
//                             size="md"
//                             title="Delete current item"
//                             style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}
//                           >
//                             <IconTrash size={18} />
//                           </ActionIcon>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   <style>{`
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
//                   `}</style>

//                   {Array.from({ length: itemCount }).map((_, index) => {
//                     const item = itemsRef.current[index] || { ...emptyItem };

//                     return (
//                       <div
//                         key={index}
//                         style={{
//                           display:
//                             activeTab === String(index) ? "block" : "none",
//                         }}
//                       >
//                         <Grid>
//                           <Grid.Col span={6}>
//                             <TextInput
//                               label="Item Name"
//                               required
//                               defaultValue={item.item_name}
//                               onChange={(event) =>
//                                 updateItemField(
//                                   index,
//                                   "itemName",
//                                   event.currentTarget.value,
//                                 )
//                               }
//                               error={formError.items?.[index]?.item_name}
//                             />
//                           </Grid.Col>
//                           <Grid.Col span={3}>
//                             <NumberInput
//                               label="Quantity"
//                               required
//                               min={1}
//                               defaultValue={item.quantity}
//                               onChange={(value) =>
//                                 updateItemField(index, "quantity", value)
//                               }
//                               error={formError.items?.[index]?.quantity}
//                             />
//                           </Grid.Col>
//                           <Grid.Col span={3}>
//                             <NumberInput
//                               label="Cost (₹)"
//                               required
//                               min={0}
//                               defaultValue={item.cost}
//                               onChange={(value) =>
//                                 updateItemField(index, "cost", value)
//                               }
//                               error={formError.items?.[index]?.cost}
//                             />
//                           </Grid.Col>
//                         </Grid>

//                         <Grid>
//                           <Grid.Col span={6}>
//                             <Select
//                               label="Item Type *"
//                               required
//                               data={ITEM_TYPES}
//                               defaultValue={item.item_type}
//                               onChange={(value) =>
//                                 updateItemField(index, "itemType", value)
//                               }
//                               error={formError.items?.[index]?.item_type}
//                             />
//                           </Grid.Col>
//                           <Grid.Col span={6}>
//                             <TextInput
//                               label="Item Subtype"
//                               defaultValue={item.item_subtype}
//                               onChange={(event) =>
//                                 updateItemField(
//                                   index,
//                                   "itemSubtype",
//                                   event.currentTarget.value,
//                                 )
//                               }
//                             />
//                           </Grid.Col>
//                         </Grid>

//                         <Grid>
//                           <Grid.Col span={6}>
//                             <NumberInput
//                               label="Present Stock"
//                               min={0}
//                               defaultValue={item.present_stock}
//                               onChange={(value) =>
//                                 updateItemField(index, "presentStock", value)
//                               }
//                             />
//                           </Grid.Col>
//                           <Grid.Col span={6}>
//                             <TextInput
//                               label="Budgetary Head"
//                               defaultValue={item.budgetary_head}
//                               onChange={(event) =>
//                                 updateItemField(
//                                   index,
//                                   "budgetaryHead",
//                                   event.currentTarget.value,
//                                 )
//                               }
//                             />
//                           </Grid.Col>
//                         </Grid>

//                         <TextInput
//                           label="Purpose"
//                           defaultValue={item.purpose}
//                           onChange={(event) =>
//                             updateItemField(
//                               index,
//                               "purpose",
//                               event.currentTarget.value,
//                             )
//                           }
//                         />
//                         <TextInput
//                           label="Specification"
//                           defaultValue={item.specification}
//                           onChange={(event) =>
//                             updateItemField(
//                               index,
//                               "specification",
//                               event.currentTarget.value,
//                             )
//                           }
//                         />

//                         <Grid>
//                           <Grid.Col span={6}>
//                             <DateInput
//                               label="Expected Delivery"
//                               defaultValue={item.expected_delivery}
//                               onChange={(value) =>
//                                 updateItemField(
//                                   index,
//                                   "expectedDelivery",
//                                   value,
//                                 )
//                               }
//                             />
//                           </Grid.Col>
//                           <Grid.Col span={6}>
//                             <TextInput
//                               label="Source of Supply"
//                               defaultValue={item.sources_of_supply}
//                               onChange={(event) =>
//                                 updateItemField(
//                                   index,
//                                   "sourceOfSupply",
//                                   event.currentTarget.value,
//                                 )
//                               }
//                             />
//                           </Grid.Col>
//                         </Grid>

//                         <TextInput
//                           label="Remarks"
//                           defaultValue={item.remark}
//                           onChange={(event) =>
//                             updateItemField(
//                               index,
//                               "remark",
//                               event.currentTarget.value,
//                             )
//                           }
//                         />

//                         <FileInput
//                           label="Attachment"
//                           placeholder="Upload file"
//                           icon={<IconUpload size={14} />}
//                           defaultValue={item.file}
//                           onChange={(file) =>
//                             updateItemField(index, "file", file)
//                           }
//                         />
//                       </div>
//                     );
//                   })}
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
//                       defaultValue={forwardToRef.current}
//                       onChange={(value) => updateFieldRef(forwardToRef, value)}
//                       data={userOptions}
//                       onSearchChange={handleSearchChange}
//                       searchable
//                       clearable
//                       error={formError.forwardTo}
//                     />
//                   </Grid.Col>
//                   <Grid.Col xs={12} md={6}>
//                     <Select
//                       label="Receiver Designation"
//                       placeholder="Select designation"
//                       data={designationOptions}
//                       defaultValue={receiverDesignationRef.current}
//                       onChange={(value) =>
//                         updateFieldRef(receiverDesignationRef, value)
//                       }
//                       searchable
//                       clearable
//                       error={formError.receiverDesignation}
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
