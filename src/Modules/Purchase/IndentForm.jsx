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
  Badge,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconPlus, IconTrash, IconUpload } from "@tabler/icons-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { createProposalRoute } from "../../routes/purchaseRoutes";

const ITEM_TYPES = ["Equipment", "Consumable", "Furniture", "Books"];

const emptyItem = {
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
  file: null,
};

export function IndentForm() {
  const [submitting, setSubmitting] = useState(false);
  const [designations, setDesignations] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
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
      receiverDesignation: "",
      items: [{ ...emptyItem }],
    },
    validate: {
      title: (value) => (!value ? "Title is required" : null),
      forwardTo: (value) => (!value ? "Forward to is required" : null),
      receiverDesignation: (value) =>
        !value ? "Receiver designation is required" : null,
      items: {
        itemName: (value) => (!value ? "Item name is required" : null),
        quantity: (value) =>
          value <= 0 ? "Quantity must be greater than 0" : null,
        itemType: (value) => (!value ? "Item type is required" : null),
      },
    },
  });

  const addItem = () => {
    form.insertListItem("items", { ...emptyItem });
  };

  const removeItem = (index) => {
    if (form.values.items.length > 1) {
      form.removeListItem("items", index);
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
    fetchDesignations(value);
  };

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem("authToken");

      const requests = values.items.map((item) => {
        const data = new FormData();

        // Append general information
        data.append("title", values.title);
        data.append("description", values.description);
        data.append("forwardTo", values.forwardTo);
        data.append("receiverDesignation", values.receiverDesignation);
        data.append("uploaderUsername", uploaderUsername);

        // Append item-specific information
        data.append("item_name", item.itemName);
        data.append("quantity", item.quantity);
        data.append("estimated_cost", item.cost);
        data.append("item_type", item.itemType);
        data.append("present_stock", item.presentStock);
        data.append("purpose", item.purpose);
        data.append("specification", item.specification);
        data.append("itemSubtype", item.itemSubtype);
        data.append("budgetary_head", item.budgetaryHead);
        data.append("expected_delivery", formatDate(item.expectedDelivery));
        data.append("sources_of_supply", item.sourceOfSupply);
        data.append("remark", item.remark);

        // Handle file upload
        if (item.file) {
          data.append("file", item.file);
        } else {
          data.append("file", "null");
        }

        return axios.post(createProposalRoute(role), data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${token}`,
          },
        });
      });

      await Promise.all(requests);
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

            {/* General Information */}
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

            {/* Items */}
            {form.values.items.map((item, index) => (
              <Card key={index} withBorder shadow="sm" p="md">
                <Group position="apart">
                  <Badge size="lg" variant="filled">
                    Item {index + 1}
                  </Badge>
                  <ActionIcon
                    color="red"
                    onClick={() => removeItem(index)}
                    disabled={form.values.items.length === 1}
                    variant="light"
                    size="lg"
                  >
                    <IconTrash size={20} />
                  </ActionIcon>
                </Group>

                <Grid>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Item Name *"
                      required
                      value={item.itemName}
                      onChange={(event) =>
                        form.setFieldValue(
                          `items.${index}.itemName`,
                          event.currentTarget.value,
                        )
                      }
                      error={form.errors.items?.[index]?.itemName}
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <NumberInput
                      label="Quantity *"
                      required
                      min={1}
                      value={item.quantity}
                      onChange={(value) =>
                        form.setFieldValue(`items.${index}.quantity`, value)
                      }
                      error={form.errors.items?.[index]?.quantity}
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <NumberInput
                      label="Cost (₹) *"
                      required
                      min={0}
                      value={item.cost}
                      onChange={(value) =>
                        form.setFieldValue(`items.${index}.cost`, value)
                      }
                      error={form.errors.items?.[index]?.cost}
                    />
                  </Grid.Col>
                </Grid>

                <Grid>
                  <Grid.Col span={6}>
                    <Select
                      label="Item Type *"
                      required
                      data={ITEM_TYPES}
                      value={item.itemType}
                      onChange={(value) =>
                        form.setFieldValue(`items.${index}.itemType`, value)
                      }
                      error={form.errors.items?.[index]?.itemType}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Item Subtype"
                      value={item.itemSubtype}
                      onChange={(event) =>
                        form.setFieldValue(
                          `items.${index}.itemSubtype`,
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
                      value={item.presentStock}
                      onChange={(value) =>
                        form.setFieldValue(`items.${index}.presentStock`, value)
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Budgetary Head"
                      value={item.budgetaryHead}
                      onChange={(event) =>
                        form.setFieldValue(
                          `items.${index}.budgetaryHead`,
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
                      value={item.expectedDelivery}
                      onChange={(value) =>
                        form.setFieldValue(
                          `items.${index}.expectedDelivery`,
                          value,
                        )
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Source of Supply"
                      value={item.sourceOfSupply}
                      onChange={(event) =>
                        form.setFieldValue(
                          `items.${index}.sourceOfSupply`,
                          event.currentTarget.value,
                        )
                      }
                    />
                  </Grid.Col>
                </Grid>

                <TextInput
                  label="Remarks"
                  value={item.remark}
                  onChange={(event) =>
                    form.setFieldValue(
                      `items.${index}.remark`,
                      event.currentTarget.value,
                    )
                  }
                />

                <FileInput
                  label="Attachment"
                  placeholder="Upload file"
                  icon={<IconUpload size={14} />}
                  value={item.file}
                  onChange={(file) =>
                    form.setFieldValue(`items.${index}.file`, file)
                  }
                />
              </Card>
            ))}

            {/* Forward Information */}
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

            {/* Buttons */}
            <Group position="center" spacing="md">
              <Button
                variant="outline"
                leftIcon={<IconPlus size={16} />}
                onClick={addItem}
              >
                Add Another Item
              </Button>
              <Button type="submit" loading={submitting}>
                Submit Indent
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}

export default IndentForm;
