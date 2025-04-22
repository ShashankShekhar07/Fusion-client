/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextInput,
  Radio,
  NumberInput,
  Textarea,
  Paper,
  Title,
  Grid,
  Text,
  Anchor,
  Alert,
  Divider,
  Group,
} from "@mantine/core";
import { FileText, ThumbsUp, ThumbsDown } from "@phosphor-icons/react";
import { useForm } from "@mantine/form";
import axios from "axios";
import classes from "../../styles/formStyle.module.css";
import { projectRegisterCommencementRoute } from "../../../../routes/RSPCRoutes";
import ConfirmationModal from "../../helpers/confirmationModal";

function ProjectRegisterForm({ projectData }) {
  const [file, setFile] = useState(null);
  const [successAlertVisible, setSuccessAlertVisible] = useState(false);
  const [failureAlertVisible, setFailureAlertVisible] = useState(false);
  const [confirmationModalOpened, setConfirmationModalOpened] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      name: projectData.name,
      type: projectData.type,
      access: projectData.access,
      sponsored_agency: projectData.sponsored_agency,
      sanctioned_amount: 0,
      sanction_date: new Date().toISOString().split("T")[0],
    },
    validate: {
      sanctioned_amount: (value) =>
        value > 0 ? null : "Total sanctioned amount must be greater than 0",
      name: (value) => (value ? null : "Project title is required"),
      access: (value) =>
        value ? null : "Project access specifier is required",
      type: (value) => (value ? null : "Project type is required"),
      sponsored_agency: (value) =>
        value ? null : "Project sponsor agency is required",
    },
  });

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("authToken");
    if (!token) return console.error("No authentication token found!");

    try {
      const formData = new FormData();
      formData.append("pid", projectData.pid);
      formData.append("name", values.name);
      formData.append("access", values.access);
      formData.append("type", values.type);
      formData.append("sponsored_agency", values.sponsored_agency);
      formData.append("sanction_date", values.sanction_date);
      formData.append("sanctioned_amount", values.sanctioned_amount);
      formData.append("status", "Registered");
      if (file) {
        formData.append("file", file);
      }
      formData.forEach((value, key) => {
        console.log(key, value);
      });
      const response = await axios.post(
        projectRegisterCommencementRoute,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        },
      );
      console.log(response.data);
      setSuccessAlertVisible(true);
      setTimeout(() => {
        setSuccessAlertVisible(false);
        navigate("/research");
      }, 2500);
    } catch (error) {
      console.error("Error during Axios POST:", error);
      setFailureAlertVisible(true);
      setTimeout(() => {
        setFailureAlertVisible(false);
      }, 2500);
    }
  };
  const handleFormSubmit = () => {
    if (form.validate().hasErrors) return;
    setConfirmationModalOpened(true);
  };

  return (
    <>
      <form onSubmit={form.onSubmit(handleFormSubmit)}>
        {projectData &&
        Object.keys(projectData).length > 0 &&
        "pi_id" in projectData ? (
          <Paper padding="lg" shadow="s" className={classes.formContainer}>
            <Title order={2} className={classes.formTitle}>
              Register Project
            </Title>

            {projectData.status === "Submitted" ? (
              <>
                <Grid gutter="xl">
                  <Grid.Col span={6}>
                    <Text className={classes.fieldLabel}>Project Title</Text>
                    <TextInput
                      placeholder="Enter name of project"
                      {...form.getInputProps("name")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text className={classes.fieldLabel}>Project ID</Text>
                    <TextInput
                      value={projectData.pid}
                      readOnly
                      styles={{
                        input: {
                          backgroundColor: "#f0f0f0",
                          cursor: "not-allowed", // Show forbidden cursor
                        },
                      }}
                    />
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <Text className={classes.fieldLabel}>
                      Project Investigator
                    </Text>
                    <TextInput
                      value={projectData.pi_name}
                      readOnly
                      styles={{
                        input: {
                          backgroundColor: "#f0f0f0",
                          cursor: "not-allowed", // Show forbidden cursor
                        },
                      }}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text className={classes.fieldLabel}>
                      Co-Principal Investigators
                    </Text>
                    {projectData.copis.length > 0 ? (
                      <ul style={{ paddingLeft: "20px", margin: "0 0" }}>
                        {projectData.copis.map((copi, index) => (
                          <li key={index}>
                            <Text>{copi}</Text>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <Text color="dimmed">No Co-PIs</Text>
                    )}
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text className={classes.fieldLabel}>
                      Project To Be Operated By
                    </Text>
                    <Radio.Group
                      {...form.getInputProps("access")}
                      value={form.values.access}
                    >
                      <Radio value="Co" label="Only PI" />
                      <Radio value="noCo" label="Either PI or Co-PI(s)" />
                    </Radio.Group>
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <Text className={classes.fieldLabel}>Project Type</Text>
                    <Radio.Group
                      {...form.getInputProps("type")}
                      value={form.values.type}
                    >
                      <Radio value="Research" label="Research" />
                      <Radio value="Consultancy" label="Consultancy" />
                    </Radio.Group>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text className={classes.fieldLabel}>Department</Text>
                    <TextInput
                      value={projectData.dept}
                      readOnly
                      styles={{
                        input: {
                          backgroundColor: "#f0f0f0",
                          cursor: "not-allowed", // Show forbidden cursor
                        },
                      }}
                    />
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <Text className={classes.fieldLabel}>Category</Text>
                    <TextInput
                      value={projectData.category}
                      readOnly
                      styles={{
                        input: {
                          backgroundColor: "#f0f0f0",
                          cursor: "not-allowed", // Show forbidden cursor
                        },
                      }}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text className={classes.fieldLabel}>
                      Project Sponsor Agency
                    </Text>
                    <TextInput
                      placeholder="Enter name of sponsoring agency"
                      {...form.getInputProps("sponsored_agency")}
                    />
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <Text className={classes.fieldLabel}>Project Scheme</Text>
                    <TextInput
                      value={projectData.scheme}
                      readOnly
                      styles={{
                        input: {
                          backgroundColor: "#f0f0f0",
                          cursor: "not-allowed", // Show forbidden cursor
                        },
                      }}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Text className={classes.fieldLabel}>Project Abstract</Text>
                    <Textarea
                      value={projectData.description}
                      readOnly
                      styles={{
                        input: {
                          backgroundColor: "#f0f0f0",
                          cursor: "not-allowed", // Show forbidden cursor
                        },
                      }}
                    />
                  </Grid.Col>

                  <Grid.Col span={12}>
                    <Divider
                      my="sm"
                      label=""
                      labelPosition="center"
                      size="sm"
                    />
                  </Grid.Col>

                  <Grid.Col span={12}>
                    <Text>
                      <strong>Note:</strong> If the project duration has changed
                      considerably from the figure given below or the sanctioned
                      amount is considerably less than proposed budget, then
                      please add the project again fresh with the accurate
                      head-wise budget details and duration.
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text className={classes.fieldLabel}>Project Duration</Text>
                    <TextInput
                      value={`${projectData.duration} months`}
                      readOnly
                      styles={{
                        input: {
                          backgroundColor: "#f0f0f0",
                          cursor: "not-allowed", // Show forbidden cursor
                        },
                      }}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text className={classes.fieldLabel}>
                      Project Sanction Date{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Text>
                    <input
                      type="date"
                      required
                      {...form.getInputProps("sanction_date")}
                      className={classes.dateInput}
                    />
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <Text className={classes.fieldLabel}>
                      Project Budget Proposed
                    </Text>
                    <TextInput
                      value={`₹${projectData.total_budget}`}
                      readOnly
                      styles={{
                        input: {
                          backgroundColor: "#f0f0f0",
                          cursor: "not-allowed", // Show forbidden cursor
                        },
                      }}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text className={classes.fieldLabel}>
                      Total Amount Sanctioned (in ₹){" "}
                      <span style={{ color: "red" }}>*</span>
                    </Text>
                    <NumberInput
                      placeholder="Total budget for project (in ₹)"
                      min={0}
                      {...form.getInputProps("sanctioned_amount")}
                    />
                  </Grid.Col>

                  <Grid.Col span={12}>
                    <Group position="apart" align="center">
                      <Text className={classes.fieldLabel}>
                        Project Agreement (Sanction Letter, MoU, etc.)
                      </Text>
                      <div className={classes.fileInputContainer}>
                        <Button
                          variant="outline"
                          color="#15ABFF"
                          size="xs"
                          component="label"
                          className={classes.fileInputButton}
                          style={{ borderRadius: "8px" }}
                        >
                          <FileText size={26} style={{ marginRight: "3px" }} />
                          Choose File
                          <input
                            type="file"
                            hidden
                            onChange={(event) =>
                              setFile(event.currentTarget.files[0])
                            }
                          />
                        </Button>
                        {file && (
                          <span className={classes.fileName}>{file.name}</span>
                        )}
                      </div>
                    </Group>
                  </Grid.Col>

                  <Grid.Col span={12}>
                    <Text>
                      <strong>Note:</strong> Along with filling this form,
                      please also fill the hard copy of New Project Registration
                      Form{" "}
                      <Anchor
                        href="https://www.iiitdmj.ac.in/rspc.iiitdmj.ac.in/DRSPC/PM/1_NPR.doc"
                        style={{ fontSize: "0.85em" }}
                      >
                        (Download here)
                      </Anchor>{" "}
                      which shall be handled by institute's Assistant Registrar
                      (Finance & Accounts).
                    </Text>
                  </Grid.Col>
                </Grid>

                <div className={classes.submitButtonContainer}>
                  <Button
                    size="lg"
                    type="submit"
                    color="cyan"
                    style={{ borderRadius: "8px" }}
                  >
                    Submit
                  </Button>
                </div>
              </>
            ) : (
              <Text color="red" align="center">
                Project is already registered!
              </Text>
            )}
          </Paper>
        ) : (
          <Text color="red" align="center">
            Failed to load project details
          </Text>
        )}
      </form>

      <ConfirmationModal
        opened={confirmationModalOpened}
        onClose={() => setConfirmationModalOpened(false)}
        onConfirm={() => {
          setConfirmationModalOpened(false);
          form.onSubmit(handleSubmit)();
        }}
      />

      {(successAlertVisible || failureAlertVisible) && (
        <div className={classes.overlay}>
          <Alert
            variant="filled"
            color={successAlertVisible ? "#85B5D9" : "red"}
            title={
              successAlertVisible
                ? "Project Registration Successful"
                : "Project Registration Failed"
            }
            icon={
              successAlertVisible ? (
                <ThumbsUp size={96} />
              ) : (
                <ThumbsDown size={96} />
              )
            }
            className={classes.alertBox}
          >
            {successAlertVisible
              ? "The project has been successfully registered! The project details have been successfully updated!"
              : "The project could not be registered! Please verify the filled details and submit the form again."}
          </Alert>
        </div>
      )}
    </>
  );
}

ProjectRegisterForm.propTypes = {
  projectData: PropTypes.shape({
    pid: PropTypes.string.isRequired,
    name: PropTypes.string,
    type: PropTypes.string,
    access: PropTypes.string,
    sponsored_agency: PropTypes.string,
    status: PropTypes.string,
    pi_name: PropTypes.string,
    copis: PropTypes.arrayOf(PropTypes.string),
    dept: PropTypes.string,
    category: PropTypes.string,
    scheme: PropTypes.string,
    description: PropTypes.string,
    duration: PropTypes.number,
    total_budget: PropTypes.number,
  }).isRequired,
};

export default ProjectRegisterForm;
