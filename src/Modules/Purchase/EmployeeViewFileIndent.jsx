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
  Anchor,
  Accordion,
  Tabs,
  ActionIcon,
  FileInput,
  Select,
  Tooltip,
  Center,
  Box,
  Loader,
  Drawer,
  ThemeIcon,
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
  IconHistory,
  IconArrowForward,
  IconCalendarTime,
  IconFileDownload,
} from "@tabler/icons-react";
import axios from "axios";
import dayjs from "dayjs";
import { useMediaQuery } from "@mantine/hooks";
import { host } from "../../routes/globalRoutes";
import { historyRoute } from "../../routes/filetrackingRoutes";
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
  const [fileHistory, setFileHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
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
      indent?.indent.purchased &&
      !indent?.indent.financial_approval &&
      role === "ps_admin"
    );
  };

  const getHistory = async (fileID) => {
    try {
      const response = await axios.get(`${historyRoute}${fileID}`, {
        withCredentials: true,
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
      });

      console.log("History Data:", response.data); // Logging the input
      setFileHistory(response.data.reverse()); // Set the response data
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(
        `${host}/purchase-and-store/api/user-suggestions`,
      );
      setUsers(response.data.users);
      setFilteredUsers(response.data.users);
      await getHistory(indentID);
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

  const isMobile = useMediaQuery("(max-width: 768px)");

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
      console.log("indent", response.data);
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
      <Center style={{ height: "80vh" }}>
        <Paper shadow="md" radius="md" p="xl" withBorder>
          <Box>
            <Loader size="sm" color="blue" />
            <Text mt="sm">Loading indent details...</Text>
          </Box>
        </Paper>
      </Center>
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
              <Button
                variant="light"
                color="blue"
                size="md"
                leftIcon={<IconHistory size={20} />}
                onClick={() => setHistoryDrawerOpen(true)}
              >
                View Indent History
              </Button>
              <Badge
                size="lg"
                color={indent.indent.purchased ? "green" : "blue"}
              >
                {indent.indent.purchased ? "Purchased" : "In Progress"}
              </Badge>
              {indent.indent.revised && (
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
          <Timeline
            active={
              indent.indent.financial_approval
                ? 2
                : indent.indent.director_approval
                  ? 1
                  : indent.indent.head_approval
                    ? 0
                    : -1
            }
          >
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
                Bill approval status
              </Text>
            </Timeline.Item>
            {/* <Timeline.Item
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
            </Timeline.Item> */}
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
                        <Group
                          position="apart"
                          wrap="nowrap"
                          style={{ flexWrap: isMobile ? "wrap" : "nowrap" }}
                        >
                          <Group>
                            <Text weight={500} size={isMobile ? "sm" : "md"}>
                              {item.item_name}
                            </Text>
                            <Badge>Qty: {item.quantity}</Badge>
                          </Group>
                          <Text
                            weight={500}
                            color="blue"
                            size={isMobile ? "sm" : "md"}
                          >
                            ₹{item.estimated_cost.toLocaleString()}
                          </Text>
                          {showStockEntryButton() && (
                            <Button
                              color="green"
                              size={isMobile ? "xs" : "sm"}
                              onClick={() =>
                                navigate("/purchase/stock_entry/", {
                                  state: {
                                    file: indent.file,
                                    department: indent.department,
                                    indent: indent.indent,
                                    item,
                                  },
                                })
                              }
                            >
                              Stock Entry
                            </Button>
                          )}
                        </Group>
                      </Accordion.Control>
                      <Accordion.Panel>
                        <Grid gutter="md">
                          <Grid.Col span={isMobile ? 12 : 6}>
                            <Card withBorder p="md">
                              <Text weight={500} mb="xs">
                                Specifications
                              </Text>
                              <Text size="sm">{item.specification}</Text>
                            </Card>
                          </Grid.Col>
                          <Grid.Col span={isMobile ? 12 : 6}>
                            <Card withBorder p="md">
                              <Text weight={500} mb="xs">
                                Purpose
                              </Text>
                              <Text size="sm">{item.purpose}</Text>
                            </Card>
                          </Grid.Col>
                          <Grid.Col span={12}>
                            <Grid gutter="md">
                              {[
                                {
                                  label: "Item Nature",
                                  value: item.nature,
                                  color: item.nature ? "green" : "red",
                                },
                                {
                                  label: "Replaced",
                                  value: item.replaced,
                                  color: item.replaced ? "green" : "red",
                                },
                                {
                                  label: "Indigenous",
                                  value: item.indigenous,
                                  color: item.indigenous ? "green" : "red",
                                },
                                {
                                  label: "Present Stock",
                                  value: item.present_stock,
                                  text: true,
                                },
                              ].map(({ label, value, color, text }) => (
                                <Grid.Col key={label} span={isMobile ? 6 : 3}>
                                  <Card withBorder p="md">
                                    <Text weight={500}>{label}</Text>
                                    {text ? (
                                      <Text size="sm">{value}</Text>
                                    ) : (
                                      <Badge color={color}>
                                        {value ? "Yes" : "No"}
                                      </Badge>
                                    )}
                                  </Card>
                                </Grid.Col>
                              ))}
                            </Grid>
                          </Grid.Col>
                          <Grid.Col span={12}>
                            <Grid gutter="md">
                              {[
                                {
                                  label: "Type",
                                  value: `${item.item_type} - ${item.item_subtype}`,
                                },
                                {
                                  label: "Budgetary Head",
                                  value: item.budgetary_head,
                                },
                                {
                                  label: "Expected Delivery",
                                  value: dayjs(item.expected_delivery).format(
                                    "MMM D, YYYY",
                                  ),
                                },
                              ].map(({ label, value }) => (
                                <Grid.Col key={label} span={isMobile ? 12 : 4}>
                                  <Card withBorder p="md">
                                    <Text weight={500}>{label}</Text>
                                    <Text size="sm">{value}</Text>
                                  </Card>
                                </Grid.Col>
                              ))}
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
              </Accordion.Item>
            </Accordion>
          </Tabs.Panel>

          <Tabs.Panel value="attachments" pt="md">
            {fileHistory?.filter((item) => item.upload_file !== null).length ===
            0 ? (
              <Card shadow="sm" radius="md" p="md">
                <Text>No attachments available</Text>
              </Card>
            ) : (
              <Card shadow="md" radius="md" p="lg" withBorder>
                <Text size="xl" fw={600} mb="md" ta="center">
                  📎 Uploaded Attachments
                </Text>

                {fileHistory
                  .filter((item) => item.upload_file !== null)
                  .map((item, index) => {
                    const fileName = item.upload_file.split("/").pop();
                    const uploader = item.current_id;
                    const date = new Date(item.forward_date).toLocaleString();

                    return (
                      <Card
                        key={index}
                        shadow="xs"
                        radius="md"
                        p="md"
                        mb="sm"
                        withBorder
                        style={{ backgroundColor: "#f9f9f9" }}
                      >
                        <Anchor
                          href={`${host}${item.upload_file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          fw={500}
                          c="blue"
                          underline="hover"
                        >
                          <IconPaperclip
                            size={18}
                            style={{ display: "inline", marginRight: 6 }}
                          />
                          {fileName}
                        </Anchor>

                        <Text size="sm" c="dimmed" mt={4}>
                          Uploaded by <strong>{uploader}</strong> on{" "}
                          <em>{date}</em>
                        </Text>
                      </Card>
                    );
                  })}
              </Card>
            )}
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
      <Drawer
        opened={historyDrawerOpen}
        onClose={() => setHistoryDrawerOpen(false)}
        title={<Title order={3}>File History</Title>}
        padding="lg"
        size="lg"
        position="right"
      >
        <Timeline active={fileHistory.length - 1} bulletSize={24} lineWidth={2}>
          {fileHistory.map((history, index) => (
            <Timeline.Item
              key={history.id}
              bullet={
                <ThemeIcon
                  size={24}
                  radius="xl"
                  color={index === fileHistory.length - 1 ? "blue" : "gray"}
                >
                  <IconArrowForward size={12} />
                </ThemeIcon>
              }
              title={
                <Group spacing="xs">
                  <Text weight={500}>{history.current_id}</Text>
                  <IconArrowForward size={14} />
                  <Text weight={500}>{history.receiver_id}</Text>
                  <Badge size="sm">{history.receive_design}</Badge>
                </Group>
              }
            >
              <Box ml="xs">
                <Text size="sm" color="dimmed" mb="xs">
                  <IconCalendarTime
                    size={14}
                    style={{ verticalAlign: "middle" }}
                  />{" "}
                  {dayjs(history.forward_date).format("MMM D, YYYY h:mm A")}
                </Text>
                {history.remarks && (
                  <Paper p="xs" bg="gray.0" radius="sm" mb="xs">
                    <Text size="sm">{history.remarks}</Text>
                  </Paper>
                )}
                {history.upload_file && (
                  <Button
                    variant="light"
                    size="xs"
                    leftIcon={<IconFileDownload size={14} />}
                    component="a"
                    href={`${host}${history.upload_file}`}
                    target="_blank"
                  >
                    View Attachment
                  </Button>
                )}
              </Box>
            </Timeline.Item>
          ))}
        </Timeline>
      </Drawer>

      {error && (
        <Text color="red" mt="md">
          {error}
        </Text>
      )}
    </Container>
  );
}

export default EmployeeViewFileIndent;
