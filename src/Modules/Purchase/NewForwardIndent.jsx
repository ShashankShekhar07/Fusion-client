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
  ThemeIcon,
  Box,
  Drawer,
  Center,
  Loader,
  Modal,
} from "@mantine/core";
import {
  IconFileDescription,
  IconPaperclip,
  IconSend,
  IconCheck,
  // IconClock,
  IconMessageDots,
  IconArrowForward,
  IconFileDownload,
  IconCalendarTime,
  IconHistory,
  IconThumbUp,
} from "@tabler/icons-react";
import { Paperclip } from "@phosphor-icons/react";

import dayjs from "dayjs";
import axios from "axios";
import { useSelector } from "react-redux";
import { useMediaQuery } from "@mantine/hooks";
import { host } from "../../routes/globalRoutes";
import {
  forwardIndentRoute,
  getDesignationsRoute,
  viewIndentRoute,
} from "../../routes/purchaseRoutes";
import { historyRoute } from "../../routes/filetrackingRoutes";

export default function NewForwardIndent() {
  const [file, setFile] = useState(null);
  const [designations, setDesignations] = useState([]);
  const navigate = useNavigate();
  const role = useSelector((state) => state.user.role);
  const username = useSelector((state) => state.user.username);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [fileHistory, setFileHistory] = useState([]);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [selectedHistoryFile] = useState({
    id: null,
    file: null,
  });
  const [confirmForwardOpen, setConfirmForwardOpen] = useState(false);
  const [stringg, setstringg] = useState("");
  const [approvalHistory, setApprovalHistory] = useState([]);

  const { indentID } = useParams();
  const [indent, setIndent] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [department, setDepartment] = useState("");
  const [formValues, setFormValues] = useState({
    remark: "",
    forwardTo: "",
    receiverDesignation: "",
  });
  console.log(fileInfo, stringg, department);

  const getHistory = async (fileID) => {
    try {
      const response = await axios.get(`${historyRoute}${fileID}`, {
        withCredentials: true,
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
      });
      setFileHistory(response.data.reverse());
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

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
      setIndent(response.data);
      console.log(response.data);
      setstringg(response.data.indent.approved_by);
      console.log(response.data.indent.approved_by);
      if (response.data.indent.approved_by) {
        const approvals = response.data.indent.approved_by
          .split(",")
          .map((approval) => {
            const trimmed = approval.trim();
            const lastDashIndex = trimmed.lastIndexOf("-");
            const namePart = trimmed.slice(0, lastDashIndex);
            const rolePart = trimmed.slice(lastDashIndex + 1);

            const name = namePart.replace(/_/g, " ");
            const rolee = rolePart.trim();

            return { name, rolee };
          });

        setApprovalHistory(approvals);
      }
      setFileInfo(response.data.file);
      setDepartment(response.data.department);
      await getHistory(indentID);
    } catch (error) {
      console.error("Error fetching indents:", error);
    }
  };

  const handleApprove = async () => {
    if (isApproving) return;
    setIsApproving(true);
    try {
      const token = localStorage.getItem("authToken");
      console.log(indentID);
      console.log(`${username}-${role}`);
      await axios.post(
        `${host}/purchase-and-store/api/approve-indent/`,
        {
          indent_id: indentID,
          approval_data: `${username}-${role}`,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      await fetchIndentDetails();
    } catch (error) {
      console.error("Error approving indent:", error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(
        `${host}/purchase-and-store/api/user-suggestions`,
      );
      setUsers(response.data.users);
      setFilteredUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching all users", error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
    if (indentID) {
      fetchIndentDetails(indentID);
    }
  }, [indentID]);

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
      const response = await axios.get(getDesignationsRoute(receiverName));
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

  const isMobile = useMediaQuery("(max-width: 768px)");

  const showStockEntryButton = () => {
    return (
      indent?.indent.head_approval &&
      // indent?.indent.director_approval &&
      // indent?.indent.purchased &&
      // !indent?.indent.financial_approval &&
      role !== "Professor"
    );
  };

  // const handleviewattachment = async (historyId) => {
  //   try {
  //     const token = localStorage.getItem("authToken");
  //     const response = await axios.get(`${host}/filetracking/api/file/788`, {
  //       headers: {
  //         Authorization: `Token ${token}`,
  //       },
  //     });
  //     setSelectedHistoryFile({
  //       id: historyId,
  //       file: response.data.upload_file,
  //     });
  //   } catch (error) {
  //     console.error("Error fetching file:", error);
  //   }
  // };

  const handleSubmit = async () => {
    const data = new FormData();
    data.append("file", file);
    data.append("remarks", formValues.remark);
    data.append("forwardTo", selectedUser);
    data.append("receiverDesignation", formValues.receiverDesignation);
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
      setConfirmForwardOpen(false);
      navigate("/purchase/outbox");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

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
      <Modal
        opened={confirmForwardOpen}
        onClose={() => setConfirmForwardOpen(false)}
        title="Confirm Forward"
        centered
      >
        <Text size="sm" mb="lg">
          Are you sure you want to forward this indent to {selectedUser}?
        </Text>
        <Group position="right" spacing="sm">
          <Button variant="light" onClick={() => setConfirmForwardOpen(false)}>
            Cancel
          </Button>
          <Button color="blue" onClick={handleSubmit}>
            Confirm
          </Button>
        </Group>
      </Modal>

      <Paper shadow="sm" p="md" mb="xl" radius="md">
        <Group position="apart" mb="md">
          <Group>
            <IconFileDescription size={32} />
            <div>
              <Title order={2}>Indent #{indent.indent.indent_name}</Title>
              <Text color="dimmed">
                Filed on {dayjs().format("MMMM D, YYYY")}
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
            {role !== "Professor" && (
              <Button
                variant="light"
                color="green"
                size="md"
                leftIcon={<IconThumbUp size={20} />}
                onClick={handleApprove}
                disabled={isApproving}
              >
                {isApproving ? "Approved" : "Approve Indent"}
              </Button>
            )}
            <Badge size="lg" color={indent.indent.purchased ? "green" : "blue"}>
              {indent.indent.purchased ? "Purchased" : "In Progress"}
            </Badge>
            {indent.indent.revised && (
              <Badge size="lg" color="yellow">
                Revised
              </Badge>
            )}
          </Group>
        </Group>

        {/* <Timeline
          active={
            indent.indent.financial_approval
              ? 2
              : indent.indent.director_approval
                ? 1
                : indent.indent.head_approval
                  ? 0
                  : -1
          }
          mb="xl"
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
            title="Bill Approval"
          >
            <Text color="dimmed" size="sm">
              Financial clearance status
            </Text>
          </Timeline.Item>
        </Timeline> */}
        <Box mb="xl">
          <Title order={4} mb="md">
            Approval Status
          </Title>

          {approvalHistory.length === 0 ? (
            <Text size="sm" color="dimmed">
              No approvals received yet.
            </Text>
          ) : (
            approvalHistory.map((approval, index) => (
              <Paper
                key={index}
                p="md"
                mb="xs"
                withBorder
                sx={(theme) => ({
                  backgroundColor: theme.colors.gray[0],
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing.sm,
                })}
              >
                <ThemeIcon color="green" size={28} radius="xl">
                  <IconCheck size={18} />
                </ThemeIcon>
                <div>
                  <Text size="sm" weight={500}>
                    Approved by {approval.name}
                  </Text>
                  <Text size="xs" color="dimmed" transform="capitalize">
                    {approval.rolee.replace(/_/g, " ")}
                  </Text>
                </div>
              </Paper>
            ))
          )}
        </Box>
      </Paper>

      <Title order={3} mb="md">
        Indent Items
      </Title>
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
                <Text weight={500} color="blue" size={isMobile ? "sm" : "md"}>
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
                            <Badge color={color}>{value ? "Yes" : "No"}</Badge>
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
                      { label: "Budgetary Head", value: item.budgetary_head },
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
                onClick={() => setConfirmForwardOpen(true)}
              >
                Forward
              </Button>
            </Group>
          </Grid.Col>
        </Grid>
      </Paper>

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
                  />
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
                {selectedHistoryFile.id === history.id &&
                  selectedHistoryFile.file && (
                    <Group spacing="xs" mt="xs">
                      <Paperclip size="1rem" />
                      <Button
                        variant="light"
                        component="a"
                        href={`${host}/${selectedHistoryFile.file}`}
                        target="_blank"
                        radius="md"
                        sx={{
                          textOverflow: "ellipsis",
                          maxWidth: "200px",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {selectedHistoryFile.file.split("/")[2]}
                      </Button>
                    </Group>
                  )}
              </Box>
            </Timeline.Item>
          ))}
        </Timeline>
      </Drawer>
    </Container>
  );
}
