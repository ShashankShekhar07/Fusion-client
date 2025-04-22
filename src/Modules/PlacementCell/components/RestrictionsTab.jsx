import React, { useState, useEffect } from "react";
import {
  Container,
  Title,
  Button,
  Select,
  TextInput,
  Grid,
  Modal,
  Chip,
  Text,
  Group,
  ActionIcon,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Pencil, Trash } from "@phosphor-icons/react";
import axios from "axios";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { fetchRestrictionsRoute } from "../../../routes/placementCellRoutes";

const columns = [
  { accessorKey: "criteria", header: "Criteria" },
  { accessorKey: "condition", header: "Condition" },
  { accessorKey: "value", header: "Value" },
  { accessorKey: "description", header: "Description" },
];

function RestrictionsTab() {
  const [restrictions, setRestrictions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [criteria, setCriteria] = useState("");
  const [condition, setCondition] = useState("");
  const [values, setValues] = useState([]);
  const [editingRestriction, setEditingRestriction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const conditionOptions = {
    cgpa: [
      { value: "less_than", label: "CGPA <" },
      { value: "greater_than", label: "CGPA >" },
    ],
    company: [
      { value: "equal", label: "Company = " },
      { value: "not_equal", label: "Company ≠" },
    ],
    year: [
      { value: "equal", label: "Year = " },
      { value: "greater_than", label: "Year >" },
      { value: "less_than", label: "Year <" },
    ],
    ctc: [
      { value: "greater_than", label: "CTC >" },
      { value: "less_than", label: "CTC <" },
    ],
  };

  useEffect(() => {
    const fetchRestrictionsList = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(fetchRestrictionsRoute, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (response.status === 200) {
          setRestrictions(response.data);
        } else {
          notifications.show({
            title: "Error fetching data",
            message: `Error fetching data: ${response.status}`,
            color: "red",
          });
        }
      } catch (error) {
        setIsError(true);
        notifications.show({
          title: "Failed to fetch data",
          message: "Failed to fetch restrictions list",
          color: "red",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchRestrictionsList();
  }, []);

  const getRuleDescription = () => {
    if (!criteria || !condition || values.length === 0) return "";

    if (criteria === "cgpa") {
      return condition === "greater_than"
        ? `Students with CGPA > ${values[0]} are not allowed to participate in further drives.`
        : `Students with CGPA < ${values[0]} are not allowed to participate in further drives.`;
    }
    if (criteria === "company") {
      return condition === "equal"
        ? `Students placed in ${values.join(", ")} are not allowed to participate in further drives.`
        : `Students not placed in ${values.join(", ")} are not allowed to participate in further drives.`;
    }
    if (criteria === "year") {
      return condition === "greater_than"
        ? `Students in year > ${values[0]} are not allowed to participate in further drives.`
        : `Students in year < ${values[0]} are not allowed to participate in further drives.`;
    }
    if (criteria === "ctc") {
      return condition === "greater_than"
        ? `Students with CTC > ${values[0]} are not allowed to participate in further drives.`
        : `Students with CTC < ${values[0]} are not allowed to participate in further drives.`;
    }
    return "";
  };

  const resetForm = () => {
    setCriteria("");
    setCondition("");
    setValues([]);
    setEditingRestriction(null);
  };

  const handleSubmit = async () => {
    const restrictionData = {
      criteria,
      condition,
      value: values.join(", "),
      description: getRuleDescription(),
    };

    if (editingRestriction) {
      setRestrictions(
        restrictions.map((r) =>
          r.id === editingRestriction.id ? { ...restrictionData, id: r.id } : r,
        ),
      );
      notifications.show({
        title: "Success",
        message: "Restriction updated successfully!",
        color: "green",
      });
    } else {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.post(
          fetchRestrictionsRoute,
          restrictionData,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          },
        );

        if (response.status === 200) {
          notifications.show({
            title: "Success",
            message: "Restriction added successfully!",
            color: "green",
          });
          setRestrictions([
            ...restrictions,
            { ...restrictionData, id: response.data.id },
          ]);
        } else {
          notifications.show({
            title: "Failed",
            message: "Failed to add restriction.",
            color: "red",
          });
        }
      } catch (error) {
        console.error("Error adding restriction:", error);
        notifications.show({
          title: "Error",
          message: "Failed to add restriction.",
          color: "red",
        });
      }
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`${fetchRestrictionsRoute}/${id}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      setRestrictions((prev) => prev.filter((r) => r.id !== id));
      notifications.show({
        title: "Success",
        message: "Restriction deleted successfully!",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to delete restriction.",
        color: "red",
      });
    }
  };

  const handleEdit = (restriction) => {
    setEditingRestriction(restriction);
    setCriteria(restriction.criteria);
    setCondition(restriction.condition);
    setValues(restriction.value.split(", "));
    setIsModalOpen(true);
  };

  const table = useMantineReactTable({
    columns,
    data: restrictions,
    enableEditing: false,
    getRowId: (row) => row.id,
    enableRowActions: true,
    positionActionsColumn: "last",
    displayColumnDefOptions: {
      "mrt-row-actions": {
        header: "Actions",
      },
    },
    renderRowActions: ({ row }) => (
      <Group spacing="xs">
        {/* Edit Button */}
        <ActionIcon
          color="blue"
          onClick={() => handleEdit(row.original)}
          title="Edit Restriction"
        >
          <Pencil size={18} />
        </ActionIcon>

        {/* Delete Button */}
        <ActionIcon
          color="red"
          onClick={() => handleDelete(row.original.id)}
          title="Delete Restriction"
        >
          <Trash size={18} />
        </ActionIcon>
      </Group>
    ),
    mantineToolbarAlertBannerProps: isError
      ? { color: "red", children: "Error loading data" }
      : undefined,
    state: {
      isLoading,
      showAlertBanner: isError,
    },
  });

  return (
    <Container fluid mt={32}>
      <Container
        fluid
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        my={16}
      >
        <Title order={2}>Restrictions</Title>
        <Group position="right">
          <Button
            variant="outline"
            onClick={() => {
              resetForm();
              setEditingRestriction(null);
              setIsModalOpen(true);
            }}
          >
            Add Restriction
          </Button>
        </Group>
      </Container>

      <MantineReactTable table={table} />

      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRestriction ? "Edit Restriction" : "Add Restriction"}
        centered
        size="lg"
      >
        <Container fluid>
          <Grid gutter="lg">
            <Grid.Col span={12}>
              <Select
                label="Criteria"
                placeholder="Select criteria"
                data={[
                  { value: "company", label: "Company" },
                  { value: "cgpa", label: "CGPA" },
                  { value: "year", label: "Year of Study" },
                  { value: "ctc", label: "CTC" },
                ]}
                value={criteria}
                onChange={setCriteria}
              />
            </Grid.Col>

            {criteria && (
              <Grid.Col span={12}>
                <Select
                  label="Condition"
                  placeholder="Select condition"
                  data={conditionOptions[criteria] || []}
                  value={condition}
                  onChange={setCondition}
                />
              </Grid.Col>
            )}

            <Grid.Col span={12}>
              <TextInput
                label="Value(s)"
                placeholder="Enter value(s)"
                value={values.join(", ")}
                onChange={(e) =>
                  setValues(e.target.value.split(", ").map((v) => v.trim()))
                }
              />
              <div style={{ marginTop: 10 }}>
                {values.map((value, index) => (
                  <Chip key={index} color="blue" style={{ margin: 3 }}>
                    {value}
                  </Chip>
                ))}
              </div>
            </Grid.Col>

            <Grid.Col span={12} mt={4}>
              <Text size="sm" style={{ marginBottom: 5 }}>
                Rule Preview:
              </Text>
              {criteria && condition && values.length > 0 && (
                <Chip color="teal">{getRuleDescription()}</Chip>
              )}
            </Grid.Col>

            <Grid.Col display="flex" mt={16}>
              <Button onClick={handleSubmit}>Submit</Button>
            </Grid.Col>
          </Grid>
        </Container>
      </Modal>
    </Container>
  );
}

export default RestrictionsTab;
