import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { usePDF } from "react-to-pdf";
import {
  Container,
  Paper,
  Text,
  Group,
  Button,
  Title,
  Timeline,
  Badge,
  Card,
  Textarea,
  Grid,
  Accordion,
  Tabs,
  ActionIcon,
  FileInput,
  Select,
  Tooltip,
} from "@mantine/core";
import {
  IconFileDescription,
  IconArchive,
  IconCheck,
  IconSend,
  IconClock,
  IconNotes,
  IconPaperclip,
  IconMessageDots,
  IconPrinter,
} from "@tabler/icons-react";
import axios from "axios";
import dayjs from "dayjs";
import {
  archiveIndentRoute,
  viewIndentRoute,
  getDesignationsRoute,
  forwardIndentRoute,
} from "../../routes/purchaseRoutes";

function EmployeeViewFileIndent() {
  const navigate = useNavigate();
  const { indentID } = useParams();
  const role = useSelector((state) => state.user.role);
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(null);
  const [activeTab, setActiveTab] = useState("notesheets");
  const [loading, setLoading] = useState(false);
  const [designations, setDesignations] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [file, setFile] = useState(null);
  const [users, setUsers] = useState([]);
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
  const showStockEntryButton = () => {
    console.log(`hello${indent.indent.director_approval}`);
    return (
      indent?.indent.head_approval &&
      indent?.indent.director_approval &&
      !indent?.indent.financial_approval
    );
  };
  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/purchase-and-store/api/user-suggestions",
      );
      setUsers(response.data.users);
      setFilteredUsers(response.data.users);
    } catch (err) {
      console.error("Error fetching all users", err);
    }
  };

  useEffect(() => {
    fetchAllUsers();
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
  const handleDesignationChange = (value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      receiverDesignation: value,
    }));
  };
  const fetchDesignations = async (receiverName) => {
    try {
      const response = await axios.get(getDesignationsRoute(receiverName));
      setDesignations(response.data);
    } catch (err) {
      console.error("Error fetching designations:", err);
    }
  };
  const handleSearchChange = (value) => {
    filterUsers(value);
    fetchDesignations(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData();
    // data.append("title", indent.indent.item_name);
    // data.append("description", indent.item_name);
    // data.append("item_name", indent.item_name);
    // data.append("quantity", indent.quantity);
    // data.append("estimated_cost", indent.estimated_cost);
    // data.append("item_type", indent.item_type);
    // data.append("present_stock", indent.present_stock);
    // data.append("purpose", indent.purpose);
    // data.append("specification", indent.specification);
    // data.append("itemSubtype", indent.item_subtype);
    // data.append("budgetary_head", indent.budgetary_head);
    // data.append("expected_delivery", indent.expected_delivery);
    // data.append("sources_of_supply", indent.sources_of_supply);
    data.append("file", file);
    data.append("remarks", formValues.remark);
    data.append("forwardTo", selectedUser);
    data.append("receiverDesignation", formValues.receiverDesignation);
    // data.append("receiverName", receiverName);
    // data.append("uploaderUsername", uploader_username);
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
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };
  const handleInputChange = (field) => (event) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: event.currentTarget.value,
    }));
  };
  const { toPDF, targetRef } = usePDF({ filename: `indent_${indentID}.pdf` });

  const archiveIndent = async (indentId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      await axios.get(archiveIndentRoute(role, indentId), {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      navigate("/purchase/archieved_indents");
    } catch (err) {
      setError("Failed to archive indent.");
      console.error("Archive error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchIndentDetails = async () => {
    try {
      setLoading(true);
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
      setIndent(response.data);
      // if (
      //   response.data.director_approval &&
      //   response.data.head_approval &&
      //   !response.data.financial_approval
      // ) {
      //   console.log()
      //   setStockEntryShow(true);
      // }
      console.log(response.data);
    } catch (err) {
      console.error("Error fetching indents:", err);
      setError("Failed to fetch indent details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (indentID) {
      fetchIndentDetails();
    }
  }, [indentID]);

  if (!indent) {
    return (
      <Container size="xl" py="xl">
        <Text>Loading indent details...</Text>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <div ref={targetRef}>
        {/* Header Section */}
        <Paper shadow="sm" p="md" mb="xl" radius="md">
          <Group position="apart" mb="md">
            <Group>
              <IconFileDescription size={32} />
              <div>
                <Title order={2}>
                  Indent #{indent.indent.file_info} -{" "}
                  {indent.indent.indent_name}
                </Title>
                <Text color="dimmed">
                  Filed on{" "}
                  {dayjs(indent.indent.upload_date).format("MMMM D, YYYY")}
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
              <Tooltip label="Print Indent">
                <ActionIcon variant="light" size="lg" onClick={() => toPDF()}>
                  <IconPrinter size={20} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>

          {/* Approval Timeline */}
          <Timeline active={1} bulletSize={24} lineWidth={2}>
            <Timeline.Item
              bullet={
                indent.indent.head_approval ? (
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
                indent.indent.director_approval ? (
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
                indent.indent.financial_approval ? (
                  <IconCheck size={12} />
                ) : (
                  <IconClock size={12} />
                )
              }
              title="Financial Approval"
            >
              <Text color="dimmed" size="sm">
                Financial clearance status
              </Text>
            </Timeline.Item>
          </Timeline>
        </Paper>

        <Card shadow="sm" radius="md" p="md" withBorder>
          <Text weight={500} mb="xs">
            Description
          </Text>
          <Text size="sm" color="dimmed">
            {indent.indent.description || "No description provided."}
          </Text>
        </Card>

        {/* Content Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab} mb="xl">
          <Tabs.List>
            <Tabs.Tab value="notesheets" leftSection={<IconNotes size={16} />}>
              Note Sheets
            </Tabs.Tab>
            <Tabs.Tab
              value="attachments"
              leftSection={<IconPaperclip size={16} />}
            >
              Attachments
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="notesheets" pt="md">
            <Card shadow="sm" radius="md" p="md">
              <Grid>
                <Grid.Col span={6}>
                  <Group>
                    <Text weight={600}>Created by:</Text>
                    <Text>{indent.created_by || "atul-professor"}</Text>
                  </Group>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Group>
                    <Text weight={600}>File ID:</Text>
                    <Text>CSE-2024-02-#{indent.indent.file_info}</Text>
                  </Group>
                </Grid.Col>
              </Grid>
            </Card>

            {/* Indent Details */}
            <Accordion variant="contained" radius="md" mt="md">
              <Accordion.Item value="details">
                <Accordion.Control>
                  <Group position="apart">
                    {/* <Text weight={500}>Indent Details</Text> */}
                    <Badge>Indent Details</Badge>
                  </Group>
                </Accordion.Control>
                <Accordion variant="contained" radius="md" mb="xl">
                  {indent.items.map((item) => (
                    <Accordion.Item key={item.id} value={item.id.toString()}>
                      <Accordion.Control>
                        <Group position="apart" style={{ width: "100%" }}>
                          <Group>
                            <Text weight={500}>{item.item_name}</Text>
                            <Badge>Qty: {item.quantity}</Badge>
                            <Text weight={500} color="blue">
                              ₹{item.estimated_cost.toLocaleString()}
                            </Text>
                          </Group>
                          <Group
                            style={{ marginLeft: "auto", paddingRight: "10px" }}
                          >
                            {showStockEntryButton() && (
                              <Button
                                color="green"
                                onClick={() =>
                                  navigate(`/purchase/stock_entry/`, {
                                    state: {
                                      file: indent.file,
                                      department: indent.department,
                                      indent: indent.indent, // Not indent.indent (unless it's a nested object)
                                      item, // Ensure you're sending only the selected item
                                    },
                                  })
                                }
                              >
                                Stock Entry
                              </Button>
                            )}
                          </Group>
                        </Group>
                      </Accordion.Control>
                      <Accordion.Panel>
                        <Grid>
                          <Grid.Col span={6}>
                            <Card withBorder p="md">
                              <Text weight={500} mb="xs">
                                Specifications
                              </Text>
                              <Text size="sm">{item.specification}</Text>
                            </Card>
                          </Grid.Col>
                          <Grid.Col span={6}>
                            <Card withBorder p="md">
                              <Text weight={500} mb="xs">
                                Purpose
                              </Text>
                              <Text size="sm">{item.purpose}</Text>
                            </Card>
                          </Grid.Col>
                          <Grid.Col span={12}>
                            <Grid>
                              <Grid.Col span={3}>
                                <Card withBorder p="md">
                                  <Text weight={500}>Item Nature</Text>
                                  <Badge color={item.nature ? "green" : "red"}>
                                    {item.nature ? "Yes" : "No"}
                                  </Badge>
                                </Card>
                              </Grid.Col>
                              <Grid.Col span={3}>
                                <Card withBorder p="md">
                                  <Text weight={500}>Replaced</Text>
                                  <Badge
                                    color={item.replaced ? "green" : "red"}
                                  >
                                    {item.replaced ? "Yes" : "No"}
                                  </Badge>
                                </Card>
                              </Grid.Col>
                              <Grid.Col span={3}>
                                <Card withBorder p="md">
                                  <Text weight={500}>Indigenous</Text>
                                  <Badge
                                    color={item.indigenous ? "green" : "red"}
                                  >
                                    {item.indigenous ? "Yes" : "No"}
                                  </Badge>
                                </Card>
                              </Grid.Col>
                              <Grid.Col span={3}>
                                <Card withBorder p="md">
                                  <Text weight={500}>Present Stock</Text>
                                  <Text size="sm">{item.present_stock}</Text>
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
                                    {item.item_type} - {item.item_subtype}
                                  </Text>
                                </Card>
                              </Grid.Col>
                              <Grid.Col span={4}>
                                <Card withBorder p="md">
                                  <Text weight={500}>Budgetary Head</Text>
                                  <Text size="sm">{item.budgetary_head}</Text>
                                </Card>
                              </Grid.Col>
                              <Grid.Col span={4}>
                                <Card withBorder p="md">
                                  <Text weight={500}>Expected Delivery</Text>
                                  <Text size="sm">
                                    {dayjs(item.expected_delivery).format(
                                      "MMM D, YYYY",
                                    )}
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
                              <Text size="sm">{item.sources_of_supply}</Text>
                            </Card>
                          </Grid.Col>
                        </Grid>
                      </Accordion.Panel>
                    </Accordion.Item>
                  ))}
                </Accordion>
                {/* <Accordion.Panel>
                  <DataTable indent={indent} />
                </Accordion.Panel> */}
              </Accordion.Item>
            </Accordion>
          </Tabs.Panel>

          <Tabs.Panel value="attachments" pt="md">
            <Card shadow="sm" radius="md" p="md">
              <Text>No attachments available</Text>
            </Card>
          </Tabs.Panel>
        </Tabs>
      </div>
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
      {/* Action Buttons */}
      <Group position="right">
        <Button
          variant="light"
          color="blue"
          leftIcon={<IconArchive size={20} />}
          onClick={() => archiveIndent(indentID)}
          loading={loading}
        >
          Archive Indent
        </Button>
      </Group>

      {/* Error Message */}
      {error && (
        <Text color="red" mt="md">
          {error}
        </Text>
      )}
    </Container>
  );
}

export default EmployeeViewFileIndent;
