import React, { useState, useEffect } from "react";
import {
  TextInput,
  Button,
  Group,
  Select,
  Textarea,
  Card,
  Title,
  Grid,
  ActionIcon,
  Chip,
  MultiSelect,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import {
  addPlacementEventForm,
  fetchRegistrationRoute,
  fetchFieldsSubmitformRoute,
} from "../../../routes/placementCellRoutes";

function AddPlacementEventForm({ onClose }) {
  const [company, setCompany] = useState("");
  const [date, setDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [location, setLocation] = useState("");
  const [ctc, setCtc] = useState("");
  const [time, setTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [placementType, setPlacementType] = useState("");
  const [description, setDescription] = useState("");
  const [jobrole, setRole] = useState("");
  const [eligibility, setEligibility] = useState([]);
  const [datePickerOpened, setDatePickerOpened] = useState(false);
  const [endDatePickerOpened, setEndDatePickerOpened] = useState(false);
  const [passoutYear, setPassoutYear] = useState(-1);
  const [gender, setGender] = useState("All");
  const [cpi, setCpi] = useState(-1);
  const [branch, setBranch] = useState("All");
  const [showPassoutYearInput, setShowPassoutYearInput] = useState(false);
  const [showGenderSelect, setShowGenderSelect] = useState(false);
  const [showCpiInput, setShowCpiInput] = useState(false);
  const [showBranchSelect, setShowBranchSelect] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [tpoFields, setTpoFields] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-GB", { hour12: false });
  };

  const getCompanyId = (companyName) => {
    const _company = companies.find((c) => c.companyName === companyName);
    setCompany(_company.companyName);
    return _company ? _company.id : null;
  };

  useEffect(() => {
    const fetchRegistrationData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(fetchRegistrationRoute, {
          headers: { Authorization: `Token ${token}` },
        });

        if (response.status !== 200) {
          notifications.show({
            title: "Error fetching data",
            message: `Error fetching data: ${response.status}`,
            color: "red",
          });
        } else {
          const uniqueCompanies = [];
          const companyNames = new Set();

          response.data.forEach((comp) => {
            if (!companyNames.has(comp.companyName)) {
              companyNames.add(comp.companyName);
              uniqueCompanies.push(comp);
            }
          });

          setCompanies(uniqueCompanies);
        }
      } catch (error) {
        notifications.show({
          title: "Failed to fetch data",
          message: "Failed to fetch companies list",
          color: "red",
        });
        console.error(error);
      }
    };
    fetchRegistrationData();
  }, []);

  useEffect(() => {
    setTime(getCurrentTime());
  }, []);

  useEffect(() => {
    const fetchFieldsData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(fetchFieldsSubmitformRoute, {
          headers: { Authorization: `Token ${token}` },
        });

        if (response.status !== 200) {
          notifications.show({
            title: "Error fetching data",
            message: `Error fetching data: ${response.status}`,
            color: "red",
          });
        } else {
          const formattedFields = response.data.map((field) => ({
            value: field.name,
            label: field.name,
            id: field.id,
          }));
          setTpoFields(formattedFields);
        }
      } catch (error) {
        notifications.show({
          title: "Failed to fetch fields data",
          message: "Failed to fetch fields list",
          color: "red",
        });
        console.error(error);
      }
    };
    fetchFieldsData();
  }, []);

  const handleSubmit = async () => {
    console.log("Submitting form");

    const token = localStorage.getItem("authToken");
    if (!token) {
      notifications.show({
        title: "Unauthorized",
        message: "You must log in to perform this action.",
        color: "red",
        position: "top-center",
      });
      return;
    }
    const companyId = getCompanyId(selectedCompany);
    const matchingIds = selectedFields
      .map((value) => {
        const field = tpoFields.find((f) => f.value === value);
        if (!field) {
          console.error(`Field not found for value: ${value}`);
        }
        return field ? field.id : null;
      })
      .filter((id) => id !== null); // Filter out invalid/null IDs

    if (matchingIds.length === 0) {
      notifications.show({
        title: "Error",
        message: "No valid fields selected. Please select valid fields.",
        color: "red",
        position: "top-center",
      });
      return;
    }

    const formData = new FormData();
    formData.append("placement_type", placementType);
    formData.append("company_name", selectedCompany);
    formData.append("company_id", companyId);
    formData.append("ctc", ctc);
    formData.append("description", description);
    formData.append("title", company);
    formData.append("location", location);
    formData.append("role", jobrole);
    formData.append("eligibility", eligibility.join(", "));
    formData.append("passoutyr", passoutYear);
    formData.append("gender", gender);
    formData.append("cpi", cpi);
    formData.append("branch", branch);
    formData.append("schedule_at", time);
    formData.append("fields", matchingIds);

    if (date) {
      formData.append("placement_date", date.toISOString().split("T")[0]);
    }

    if (endDate) {
      formData.append("end_date", endDate.toISOString().split("T")[0]);
    }

    if (endDateTime) {
      formData.append("end_datetime", endDateTime);
    }

    formData.append("selected_fields", selectedFields.join(", "));

    console.log("\n formData", formData);

    try {
      await axios.post(addPlacementEventForm, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        },
      });
      if (onClose) {
        onClose();
      }
      notifications.show({
        title: "Event Added",
        message: "Placement Event has been added successfully.",
        color: "green",
        position: "top-center",
      });
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      notifications.show({
        title: "Error",
        message: `Failed to add Placement Event: ${errorMessage}`,
        color: "red",
        position: "top-center",
      });
      console.error(
        "Error adding schedule:",
        error.response?.data?.error || error.message,
      );
    }
  };

  return (
    <Card style={{ maxWidth: "800px", margin: "0 auto" }}>
      <Title order={3} align="center" style={{ marginBottom: "20px" }}>
        Add Placement Event
      </Title>

      <Grid gutter="lg">
        <Grid.Col span={4} style={{ position: "relative" }}>
          <Select
            label="Select Company"
            placeholder="Select a company"
            data={companies.map((company_) => company_.companyName)}
            value={selectedCompany}
            onChange={setSelectedCompany}
            required
          />
        </Grid.Col>

        <Grid.Col span={6} style={{ position: "relative" }}>
          <DateTimePicker
            label="Start Date and Time"
            placeholder="Pick start date and time"
            value={date}
            onChange={(selectedDate) => setDate(selectedDate)}
            required
          />
        </Grid.Col>

        <Grid.Col span={6} style={{ position: "relative" }}>
          <DateTimePicker
            label="End Date and Time"
            placeholder="Pick end date and time"
            value={endDate}
            onChange={(selectedDate) => setEndDate(selectedDate)}
            required
          />
        </Grid.Col>

        <Grid.Col span={4}>
          <TextInput
            label="Location"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </Grid.Col>

        <Grid.Col span={4}>
          <TextInput
            label="CTC In Lpa"
            placeholder="Enter CTC"
            value={ctc}
            onChange={(e) => setCtc(e.target.value)}
          />
        </Grid.Col>
        
        <Grid.Col span={4}>
          <Select
            label="Placement Type"
            placeholder="Select placement type"
            data={["Placement", "Internship"]}
            value={placementType}
            onChange={setPlacementType}
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <Textarea
            label="Description"
            placeholder="Enter a description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            minRows={3}
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <TextInput
            label="Role Offered"
            placeholder="Enter the role offered"
            value={jobrole}
            onChange={(e) => setRole(e.target.value)}
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <b>Eligibility Criteria</b>
          <Chip.Group
            multiple
            value={eligibility}
            onChange={setEligibility}
            style={{ marginTop: "10px" }}
          >
            {eligibility.map((criteria, index) => (
              <Chip key={index} value={criteria}>
                {criteria}
              </Chip>
            ))}
          </Chip.Group>
        </Grid.Col>

        <Grid.Col span={12}>
          <Group direction="column" spacing="xs">
            <Button
              onClick={() => setShowPassoutYearInput(!showPassoutYearInput)}
            >
              Passout Year
            </Button>
            {showPassoutYearInput && (
              <TextInput
                placeholder="Enter Passout Year"
                value={passoutYear}
                onChange={(e) => setPassoutYear(e.target.value)}
              />
            )}

            <Button onClick={() => setShowGenderSelect(!showGenderSelect)}>
              Gender
            </Button>
            {showGenderSelect && (
              <Select
                value={gender}
                onChange={setGender}
                data={["Male", "Female"]}
                placeholder="Select Gender"
              />
            )}

            <Button onClick={() => setShowCpiInput(!showCpiInput)}>CPI</Button>
            {showCpiInput && (
              <TextInput
                placeholder="Enter CPI"
                value={cpi}
                onChange={(e) => setCpi(e.target.value)}
              />
            )}

            <Button onClick={() => setShowBranchSelect(!showBranchSelect)}>
              Branch
            </Button>
            {showBranchSelect && (
              <Select
                value={branch}
                onChange={setBranch}
                data={["CSE", "ECE", "MECH", "SM", "BDES"]}
                placeholder="Select Branch"
              />
            )}
          </Group>
        </Grid.Col>

        <Grid.Col span={12}>
          <MultiSelect
            label="Select Fields"
            placeholder="Select fields"
            data={tpoFields}
            value={selectedFields}
            onChange={setSelectedFields}
            searchable
            clearable
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <Button onClick={handleSubmit} fullWidth>
            Submit
          </Button>
        </Grid.Col>
      </Grid>
    </Card>
  );
}

export default AddPlacementEventForm;
