/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextInput,
  Paper,
  Title,
  Grid,
  Text,
  Alert,
  Anchor,
  Group,
} from "@mantine/core";
import { FileText, ThumbsUp, ThumbsDown } from "@phosphor-icons/react";
import { useForm } from "@mantine/form";
import axios from "axios";
import classes from "../../styles/formStyle.module.css";
import { projectClosureRoute } from "../../../../routes/RSPCRoutes";
import ConfirmationModal from "../../helpers/confirmationModal";

function ProjectClosureForm({ projectData }) {
  const [file, setFile] = useState(null);
  const [successAlertVisible, setSuccessAlertVisible] = useState(false);
  const [failureAlertVisible, setFailureAlertVisible] = useState(false);
  const [confirmationModalOpened, setConfirmationModalOpened] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {},
    validate: {},
  });

  const handleSubmit = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return console.error("No authentication token found!");

    try {
      const formData = new FormData();
      formData.append("pid", projectData.pid);
      if (file) {
        formData.append("end_report", file);
      }
      formData.forEach((value, key) => {
        console.log(key, value);
      });
      const response = await axios.post(projectClosureRoute, formData, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
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
              Final Utilization Certificate & Statement of Expenditure and
              Closure of Project
            </Title>

            {projectData.status === "OnGoing" ? (
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
                      Project Start Date
                    </Text>
                    <TextInput
                      value={new Date(
                        projectData.start_date,
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

                  <Grid.Col span={12}>
                    <Group position="apart" align="center">
                      <Text className={classes.fieldLabel}>
                        Upload UC/SE <span style={{ color: "red" }}>*</span>{" "}
                        <Anchor
                          href="https://www.iiitdmj.ac.in/rspc.iiitdmj.ac.in/DRSPC/PM/5_UC_SE.doc"
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
                Project has not yet commenced or is already closed!
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
                ? "Project Closure Successful"
                : "Project Closure Failed"
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
              ? "The project has been successfully closed! The project details have been successfully updated!"
              : "The project could not be closed! Please verify the filled details and submit the form again."}
          </Alert>
        </div>
      )}
    </>
  );
}

ProjectClosureForm.propTypes = {
  projectData: PropTypes.shape({
    pid: PropTypes.string.isRequired,
    name: PropTypes.string,
    type: PropTypes.string,
    access: PropTypes.string,
    sanctioned_amount: PropTypes.number,
    status: PropTypes.string,
    pi_name: PropTypes.string,
    copis: PropTypes.arrayOf(PropTypes.string),
    dept: PropTypes.string,
    category: PropTypes.string,
    scheme: PropTypes.string,
    start_date: PropTypes.string,
    duration: PropTypes.number,
  }).isRequired,
};

export default ProjectClosureForm;
