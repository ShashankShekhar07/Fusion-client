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
import { showDirectorGoldSubmitRoute } from "../../../routes/SPACSRoutes";

export default function DirectorGoldForm() {
  const [formData, setFormData] = useState({
    justification: "",
    correspondence_address: "",
    nearest_policestation: "",
    nearest_railwaystation: "",
    financial_assistance: "",
    grand_total: "",
    academic_achievements: "",
    social: "",
    corporate: "",
    hall_activities: "",
    gymkhana_activities: "",
    institute_activities: "",
    counselling_activities: "",
    other_activities: "",
    science_inside: "",
    science_outside: "",
    games_inside: "",
    games_outside: "",
    cultural_inside: "",
    cultural_outside: "",
    Marksheet: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (file) => {
    setFormData((prev) => ({ ...prev, Marksheet: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        formDataToSend.append(key, value);
      }
    });

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("User is not authenticated. Please log in.");
        return;
      }

      const response = await fetch(showDirectorGoldSubmitRoute, {
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
      <Paper radius="md" p="sm">
        <Title order={2} mb="lg">
          Director's Gold Medal Application Form
        </Title>
        <form onSubmit={handleSubmit}>
          <Grid gutter="lg">
            {/* Basic Information */}
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
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="Grand Total Amount"
                name="grand_total"
                type="number"
                value={formData.grand_total}
                onChange={handleChange}
                placeholder="Enter Grand Total Amount"
              />
            </Grid.Col>
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
            <Grid.Col span={12}>
              <Textarea
                label="Financial Assistance"
                name="financial_assistance"
                value={formData.financial_assistance}
                onChange={handleChange}
                placeholder="Describe Financial Assistance"
                minRows={3}
              />
            </Grid.Col>

            {/* Achievements Section */}
            {[
              "academic_achievements",
              "social",
              "corporate",
              "hall_activities",
              "gymkhana_activities",
              "institute_activities",
              "counselling_activities",
              "other_activities",
              "science_inside",
              "science_outside",
              "games_inside",
              "games_outside",
              "cultural_inside",
              "cultural_outside",
            ].map((field) => (
              <Grid.Col span={{ base: 12, sm: 6 }} key={field}>
                <Textarea
                  label={field.replace(/_/g, " ")}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={`Enter ${field.replace(/_/g, " ")}`}
                  minRows={2}
                />
              </Grid.Col>
            ))}

            {/* Marksheet Upload at the Bottom */}
            <Grid.Col span={12}>
              <FileButton onChange={handleFileChange} accept="application/pdf">
                {(props) => (
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  <Button {...props} fullWidth>
                    Upload Marksheet (PDF)
                  </Button>
                )}
              </FileButton>
              {formData.Marksheet && (
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
