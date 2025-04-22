/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextInput,
  NumberInput,
  Textarea,
  Paper,
  Title,
  Grid,
  Text,
  Alert,
  Anchor,
  Divider,
  Group,
} from "@mantine/core";
import {
  FileText,
  ThumbsUp,
  ThumbsDown,
  DownloadSimple,
} from "@phosphor-icons/react";
import { useForm } from "@mantine/form";
import axios from "axios";
import classes from "../../styles/formStyle.module.css";
import { projectRegisterCommencementRoute } from "../../../../routes/RSPCRoutes";
import { host } from "../../../../routes/globalRoutes";
import ConfirmationModal from "../../helpers/confirmationModal";

function ProjectCommencementForm({ projectData }) {
  const [file, setFile] = useState(null);
  const [successAlertVisible, setSuccessAlertVisible] = useState(false);
  const [failureAlertVisible, setFailureAlertVisible] = useState(false);
  const [confirmationModalOpened, setConfirmationModalOpened] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      start_date: new Date().toISOString().split("T")[0],
      initial_amount: 0,
    },
    validate: {
      initial_amount: (value) =>
        value > 0 ? null : "Initial funding amount must be greater than 0",
    },
  });

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("authToken");
    if (!token) return console.error("No authentication token found!");

    try {
      const formData = new FormData();
      formData.append("pid", projectData.pid);
      formData.append("start_date", values.start_date);
      formData.append("initial_amount", values.initial_amount);
      formData.append("status", "OnGoing");
      if (file) {
        formData.append("registration_form", file);
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
              Commence Project
            </Title>

            {projectData.status === "Registered" ? (
              <>
                <Grid gutter="xl">
                  <Grid.Col span={6}>
                    <Text className={classes.fieldLabel}>Project Title</Text>
                    <TextInput
                      value={projectData.name}
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
                    <TextInput
                      value={
                        projectData.access === "Co"
                          ? "Only PI"
                          : "Either PI or Co-PI(s)"
                      }
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
                    <Text className={classes.fieldLabel}>Project Type</Text>
                    <TextInput
                      value={projectData.type}
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
                      value={projectData.sponsored_agency}
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
                  <Grid.Col span={6}>
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
                      Total Amount Sanctioned
                    </Text>
                    <TextInput
                      value={`₹${projectData.sanctioned_amount}`}
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
                      Project Sanction Date
                    </Text>
                    <TextInput
                      value={new Date(
                        projectData.sanction_date,
                      ).toLocaleDateString()}
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
                    <Group position="apart" align="center">
                      <Text className={classes.fieldLabel}>
                        Project Agreement (Sanction Letter, MoU, etc.)
                      </Text>
                      {projectData.file ? (
                        <Button
                          variant="outline"
                          color="#15ABFF"
                          size="xs"
                          className={classes.fileInputButton}
                          style={{ borderRadius: "8px" }}
                          component="a"
                          href={`${host}/${projectData.file}`} // Directly access the file URL
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <DownloadSimple
                            size={26}
                            style={{ marginRight: "3px" }}
                          />
                          Open File
                        </Button>
                      ) : (
                        <span>No file uploaded</span>
                      )}
                    </Group>
                  </Grid.Col>

                  <Grid.Col span={12}>
                    <Divider
                      my="sm"
                      label=""
                      labelPosition="center"
                      size="sm"
                    />
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <Text className={classes.fieldLabel}>
                      Date Of Receiving First Funding And Commencement Of
                      Project <span style={{ color: "red" }}>*</span>
                    </Text>
                    <input
                      type="date"
                      required
                      {...form.getInputProps("start_date")}
                      className={classes.dateInput}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text className={classes.fieldLabel}>
                      Amount Received In First Funding (in ₹){" "}
                      <span style={{ color: "red" }}>*</span>
                    </Text>
                    <NumberInput
                      placeholder="Initial Funds (in ₹)"
                      min={0}
                      {...form.getInputProps("initial_amount")}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Group position="apart" align="center">
                      <Text className={classes.fieldLabel}>
                        Project Registration Form{" "}
                        <span style={{ color: "red" }}>*</span>{" "}
                        <Anchor
                          href="https://www.iiitdmj.ac.in/rspc.iiitdmj.ac.in/DRSPC/PM/1_NPR.doc"
                          style={{ fontSize: "0.85em" }}
                        >
                          (Download format here)
                        </Anchor>
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
                            required
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
                Project has already commenced!
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
                ? "Project Commencement Successful"
                : "Project Commencement Failed"
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
              ? "The project has been successfully started! The project details have been successfully updated!"
              : "The project could not be commenced! Please verify the filled details and submit the form again."}
          </Alert>
        </div>
      )}
    </>
  );
}

ProjectCommencementForm.propTypes = {
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
    sanctioned_amount: PropTypes.number,
    description: PropTypes.string,
    duration: PropTypes.number,
    sanction_date: PropTypes.string,
    file: PropTypes.string,
  }).isRequired,
};

export default ProjectCommencementForm;
