import React, { useState } from "react";
import {
  Button,
  TextInput,
  Grid,
  Textarea,
  FileButton,
  Group,
  Container,
  Paper,
  Title,
} from "@mantine/core";
import { submitPdmRoute } from "../../../routes/SPACSRoutes";

export default function DMProficiencyForm() {
  const [formData, setFormData] = useState({
    award_type: "DMProficiencyform",
    justification: "",
    correspondence_address: "",
    nearest_policestation: "",
    nearest_railwaystation: "",
    financial_assistance: "",
    grand_total: "",
    title_name: "",
    no_of_students: "",
    roll_no1: "",
    roll_no2: "",
    roll_no3: "",
    roll_no4: "",
    roll_no5: "",
    brief_description: "",
    cse_topic: "",
    ece_topic: "",
    mech_topic: "",
    design_topic: "",
    cse_percentage: "",
    ece_percentage: "",
    mech_percentage: "",
    design_percentage: "",
    Marksheet: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (file) => {
    setFormData((prev) => ({ ...prev, Marksheet: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("User is not authenticated. Please log in.");
        return;
      }

      const response = await fetch(submitPdmRoute, {
        method: "POST",
        body: formDataToSend,
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Form submitted successfully:", result);
        alert("Form submitted successfully!");
      } else {
        const errorData = await response.json();
        console.error("Submission failed:", errorData);
        alert(
          `Failed to submit the form: ${errorData.detail || response.statusText}`,
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <Container size="lg">
      <Paper radius="md" padding="sm">
        <Title order={2} mb="lg">
          DM Proficiency Form
        </Title>
        <form onSubmit={handleSubmit}>
          <Grid gutter="lg">
            {/* Basic Information */}

            {/* Addresses */}
            <Grid.Col span={12}>
              <Textarea
                label="Justification"
                name="justification"
                value={formData.justification}
                onChange={handleChange}
                placeholder="Enter Justification"
                minRows={3}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea
                label="Correspondence Address"
                name="correspondence_address"
                value={formData.correspondence_address}
                onChange={handleChange}
                placeholder="Enter Correspondence Address"
                minRows={3}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="Nearest Police Station"
                name="nearest_policestation"
                value={formData.nearest_policestation}
                onChange={handleChange}
                placeholder="Enter Nearest Police Station"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="Nearest Railway Station"
                name="nearest_railwaystation"
                value={formData.nearest_railwaystation}
                onChange={handleChange}
                placeholder="Enter Nearest Railway Station"
              />
            </Grid.Col>

            {/* Financial Information */}
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="Financial Assistance"
                name="financial_assistance"
                value={formData.financial_assistance}
                onChange={handleChange}
                placeholder="Enter Financial Assistance"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="Grand Total"
                name="grand_total"
                type="number"
                value={formData.grand_total}
                onChange={handleChange}
                placeholder="Enter Grand Total"
              />
            </Grid.Col>

            {/* Project/Team Information */}
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="Title Name"
                name="title_name"
                value={formData.title_name}
                onChange={handleChange}
                placeholder="Enter Title Name"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="Number of Students"
                name="no_of_students"
                type="number"
                value={formData.no_of_students}
                onChange={handleChange}
                placeholder="Enter Number of Students"
              />
            </Grid.Col>
            {[1, 2, 3, 4, 5].map((num) => (
              <Grid.Col span={{ base: 12, sm: 6 }} key={`roll_no${num}`}>
                <TextInput
                  label={`Roll No ${num}`}
                  name={`roll_no${num}`}
                  value={formData[`roll_no${num}`]}
                  onChange={handleChange}
                  placeholder={`Enter Roll No ${num}`}
                />
              </Grid.Col>
            ))}

            {/* Brief Description */}
            <Grid.Col span={12}>
              <Textarea
                label="Brief Description"
                name="brief_description"
                value={formData.brief_description}
                onChange={handleChange}
                placeholder="Enter a brief description"
                minRows={4}
              />
            </Grid.Col>

            {/* Disciplines */}
            {["cse", "ece", "mech", "design"].map((field) => (
              <React.Fragment key={field}>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label={`${field.toUpperCase()} Topic`}
                    name={`${field}_topic`}
                    value={formData[`${field}_topic`]}
                    onChange={handleChange}
                    placeholder={`Enter ${field.toUpperCase()} Topic`}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label={`${field.toUpperCase()} Percentage`}
                    name={`${field}_percentage`}
                    type="number"
                    value={formData[`${field}_percentage`]}
                    onChange={handleChange}
                    placeholder={`Enter ${field.toUpperCase()} Percentage`}
                  />
                </Grid.Col>
              </React.Fragment>
            ))}

            {/* File Upload */}
            <Grid.Col span={12}>
              <FileButton onChange={handleFileUpload} accept="application/pdf">
                {(props) => (
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  <Button {...props} fullWidth>
                    Upload Marksheet (PDF)
                  </Button>
                )}
              </FileButton>
              {formData.Marksheet && formData.Marksheet.name && (
                <TextInput
                  value={formData.Marksheet.name}
                  readOnly
                  mt="sm"
                  label="Uploaded File"
                />
              )}
            </Grid.Col>
          </Grid>

          <Group position="right" mt="xl">
            <Button type="submit" color="blue">
              Submit
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}
