import "@mantine/dates/styles.css";

import React, { useState } from "react";
import {
  Modal,
  Card,
  Title,
  Grid,
  TextInput,
  Select,
  Textarea,
  Group,
  Button,
  MultiSelect,
} from "@mantine/core";
import { DateInput, TimeInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import PropTypes from "prop-types";

function EditPlacementForm({ isOpen, onClose, placementData, onSubmit }) {
  const { companyName, location, position, jobType, description, salary } =
    placementData;

  const [company, setCompany] = useState(companyName);
  const [date, setDate] = useState(new Date());
  const [locationInput, setLocation] = useState(location);
  const [ctc, setCtc] = useState(salary);
  const [time, setTime] = useState(new Date());
  const [placementType, setPlacementType] = useState(jobType);
  const [descriptionInput, setDescription] = useState(description);
  const [datePickerOpened, setDatePickerOpened] = useState(false);
  const [role, setRole] = useState(position);

  const [tpoFields] = useState([
    { value: "field1", label: "Field 1" },
    { value: "field2", label: "Field 2" },
    { value: "field3", label: "Field 3" },
  ]);

  const [selectedFields, setSelectedFields] = useState([]);

  const getFormattedDate = (date_) => {
    if (!date_) return null;
    const year = date_.getFullYear();
    const month = String(date_.getMonth() + 1).padStart(2, "0");
    const day = String(date_.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = () => {
    const parsedCtc = parseFloat(ctc);
    if (Number.isNaN(parsedCtc) || parsedCtc <= 0) {
      alert("CTC must be a valid positive decimal number.");
      return;
    }

    const formattedCtc = parsedCtc.toFixed(2);

    onSubmit({
      company,
      date: getFormattedDate(date),
      location: locationInput,
      ctc: formattedCtc,
      time,
      placementType,
      description: descriptionInput,
      role,
    });

    notifications.show({
      title: "Success",
      message: "Placement event updated successfully!",
      color: "green",
      position: "top-center",
    });

    onClose();
  };

  return (
    <Modal size="lg" centered opened={isOpen} onClose={onClose}>
      <Card>
        <Title order={3} align="center" style={{ marginBottom: "20px" }}>
          Edit Placement Event
        </Title>
        <Grid gutter="lg">
          <Grid.Col span={4}>
            <TextInput
              label="Company Name"
              placeholder="Enter company name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </Grid.Col>

          <Grid.Col span={4}>
            <DateInput
              label="Date"
              placeholder="Pick a date"
              value={date}
              onChange={(d) => {
                setDate(d);
              }}
              opened={datePickerOpened}
              onFocus={() => setDatePickerOpened(true)}
              onBlur={() => setDatePickerOpened(false)}
              styles={{
                input: {
                  border: "1px solid #ced4da",
                  borderRadius: "4px",
                  padding: "10px",
                  fontSize: "14px",
                  width: "100%",
                  boxSizing: "border-box",
                  "&:focus": {
                    outline: "none",
                    borderColor: "#1c7ed6",
                  },
                },
                label: {
                  display: "block",
                  marginBottom: "5px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#425047",
                },
              }}
            />
          </Grid.Col>

          <Grid.Col span={4}>
            <TextInput
              label="Location"
              placeholder="Enter location"
              value={locationInput}
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
            <TimeInput
              label="Time"
              placeholder="Select time"
              value={time}
              onChange={setTime}
              format="24"
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
              resize="vertical"
              label="Description"
              placeholder="Enter a description"
              value={descriptionInput}
              onChange={(e) => setDescription(e.target.value)}
              minRows={3}
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <TextInput
              label="Role Offered"
              placeholder="Enter the role offered"
              value={position}
              onChange={(e) => setRole(e.target.value)}
            />
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
        </Grid>

        <Group position="right" style={{ marginTop: "20px" }}>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </Group>
      </Card>
    </Modal>
  );
}

EditPlacementForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  placementData: PropTypes.shape({
    companyLogo: PropTypes.string,
    companyName: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    jobType: PropTypes.string.isRequired,
    description: PropTypes.string,
    salary: PropTypes.string,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default EditPlacementForm;
