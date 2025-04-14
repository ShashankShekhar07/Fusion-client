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
  Text,
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
                <div>
                  <TextInput
                    label="Title"
                    required
                    value={form.values.title}
                    onChange={(event) =>
                      form.setFieldValue("title", event.currentTarget.value)
                    }
                    error={form.errors.title}
                  />
                </div>
                <div>
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
                </div>
              </Stack>
            </Card>

            <Card withBorder shadow="sm" p="md">
              <Stack spacing="md">
                <Title order={3}>Items</Title>
                <div className="items-container">
                  <div className="items-tabs">
                    {form.values.items.map((_, index) => (
                      // <div
                      //   key={index}
                      //   className={`item-tab ${activeTab === String(index) ? "active" : ""}`}
                      //   onClick={() => setActiveTab(String(index))}
                      //   role="button"
                      //   tabIndex={0}
                      // >
                      <div
                        key={index}
                        className={`item-tab ${activeTab === String(index) ? "active" : ""}`}
                        onClick={() => setActiveTab(String(index))}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            setActiveTab(String(index));
                          }
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        Item {index + 1}
                      </div>
                    ))}
                    <div className="tab-actions">
                      {form.values.items.length < 20 && (
                        <ActionIcon
                          variant="light"
                          color="blue"
                          onClick={addItem}
                          size="md"
                          title="Add new item"
                        >
                          <IconPlus size={18} />
                        </ActionIcon>
                      )}
                      {form.values.items.length > 1 && (
                        <ActionIcon
                          variant="light"
                          color="red"
                          onClick={() => removeItem(parseInt(activeTab, 10))}
                          size="md"
                          title="Remove current item"
                        >
                          <IconTrash size={18} />
                        </ActionIcon>
                      )}
                    </div>
                  </div>

                  {form.values.items.map((item, index) => (
                    <div
                      key={index}
                      className="item-content"
                      style={{
                        display: activeTab === String(index) ? "block" : "none",
                      }}
                    >
                      <div className="form-row">
                        <div className="form-field" style={{ flex: 2 }}>
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
                        </div>
                        <div className="form-field">
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
                        </div>
                        <div className="form-field">
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
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-field">
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
                        </div>
                        <div className="form-field">
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
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-field">
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
                        </div>
                        <div className="form-field">
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
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-field">
                          <Text size="sm" fw={500} mb={8}>
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
                        <div className="form-field">
                          <Text size="sm" fw={500} mb={8}>
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
                        <div className="form-field">
                          <Text size="sm" fw={500} mb={8}>
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
                      </div>

                      <div className="form-field">
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
                      </div>

                      <div className="form-field">
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
                      </div>

                      <div className="form-row">
                        <div className="form-field">
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
                        </div>
                        <div className="form-field">
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
                        </div>
                      </div>

                      <div className="form-field">
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
                    </div>
                  ))}
                </div>
              </Stack>
            </Card>

            <Card withBorder shadow="sm" p="md">
              <Stack spacing="md">
                <Title order={3}>Forward Information</Title>
                <div className="form-row">
                  <div className="form-field">
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
                  </div>
                  <div className="form-field">
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
                  </div>
                </div>
              </Stack>
            </Card>

            <Group position="center" spacing="md">
              <Button type="submit" loading={submitting} color="green">
                Submit Indent
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>

      <style>
        {`
          .items-container {
            width: 100%;
          }

          .items-tabs {
            display: flex;
            align-items: center;
            border-bottom: 1px solid #dee2e6;
            margin-bottom: 20px;
            overflow-x: auto;
            scrollbar-width: thin;
            scrollbar-color: #74c0fc #f8f9fa;
          }

          .item-tab {
            padding: 8px 16px;
            cursor: pointer;
            white-space: nowrap;
            border-bottom: 2px solid transparent;
            transition: all 0.2s;
          }

          .item-tab.active {
            background-color: #f1f3f5;
            border-bottom: 2px solid #228be6;
          }

          .tab-actions {
            display: flex;
            gap: 8px;
            padding-left: 16px;
            margin-left: auto;
          }

          .form-row {
            display: flex;
            gap: 16px;
            margin-bottom: 16px;
          }

          .form-field {
            flex: 1;
          }

          .form-field:last-child {
            margin-bottom: 0;
          }

          ::-webkit-scrollbar {
            height: 4px;
          }

          ::-webkit-scrollbar-track {
            background: #f8f9fa;
            border-radius: 10px;
          }

          ::-webkit-scrollbar-thumb {
            background: #74c0fc;
            border-radius: 10px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: #4dabf7;
          }
        `}
      </style>
    </Container>
  );
}
