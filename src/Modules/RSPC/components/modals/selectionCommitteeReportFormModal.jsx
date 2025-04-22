/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
import React, { useState } from "react";
import {
  Modal,
  Button,
  Text,
  Divider,
  Grid,
  TextInput,
  Title,
  NumberInput,
  Anchor,
  Group,
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { Trash, FileText, ThumbsUp, ThumbsDown } from "@phosphor-icons/react";
import classes from "../../styles/formStyle.module.css";
import { staffSelectionReportRoute } from "../../../../routes/RSPCRoutes";
import ConfirmationModal from "../../helpers/confirmationModal";

function SelectionCommitteeReportFormModal({ opened, onClose, staffData }) {
  const [successAlertVisible, setSuccessAlertVisible] = useState(false);
  const [failureAlertVisible, setFailureAlertVisible] = useState(false);
  const [alertHeader, setAlertHeader] = useState(
    "Selection Committee Report Failed",
  );
  const [alertBody, setAlertBody] = useState(
    "The selection committee's report could not be successfully registered! Please verify the filled details and submit the form again.",
  );
  const [confirmationModalOpened, setConfirmationModalOpened] = useState(false);

  const [finalSelection, setFinalSelection] = useState([
    {
      name: "",
      dob: "",
      category: "",
      duration: staffData?.duration,
      salary: staffData?.salary,
      begin: "",
      end: "",
      biodata: null,
    },
  ]);
  const [waitingList, setWaitingList] = useState([]);
  const [adFile, setAdFile] = useState(null);
  const [compFile, setCompFile] = useState(null);

  const form = useForm({
    initialValues: {
      candidates_applied: "",
      candidates_called: "",
      candidates_interviewed: "",
    },
    validate: {
      candidates_applied: (value) =>
        value === "" ? "Number of candidates applied is required" : null,
      candidates_called: (value) =>
        value === "" ? "Number of candidates called is required" : null,
      candidates_interviewed: (value) =>
        value === "" ? "Number of candidates interviewed is required" : null,
    },
  });

  const handleAddCandidate = (type) => {
    const newCandidate = {
      name: "",
      dob: "",
      category: "",
      duration: staffData?.duration,
      salary: staffData?.salary,
      begin: "",
      end: "",
      biodata: null,
    };
    if (type === "final") setFinalSelection([...finalSelection, newCandidate]);
    if (type === "waiting") setWaitingList([...waitingList, newCandidate]);
  };
  const handleCandidateChange = (type, index, field, value) => {
    if (type === "final") {
      const updateList = [...finalSelection];
      updateList[index][field] = value;
      setFinalSelection(updateList);
    } else {
      const updateList = [...waitingList];
      updateList[index][field] = value;
      setWaitingList(updateList);
    }
  };
  const handleRemoveCandidate = (type, index) => {
    if (type === "final")
      setFinalSelection(finalSelection.filter((_, i) => i !== index));
    else setWaitingList(waitingList.filter((_, i) => i !== index));
  };

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("authToken");
    if (!token) return console.error("No authentication token found!");

    try {
      const formData = new FormData();
      formData.append("sid", staffData.sid);
      formData.append("candidates_applied", values.candidates_applied);
      formData.append("candidates_called", values.candidates_called);
      formData.append("candidates_interviewed", values.candidates_interviewed);
      finalSelection.forEach((candidate) => {
        formData.append("biodata_final", candidate.biodata);
        delete candidate.biodata;
      });
      waitingList.forEach((candidate) => {
        formData.append("biodata_waiting", candidate.biodata);
        delete candidate.biodata;
      });
      formData.append("final_selection", JSON.stringify(finalSelection));
      formData.append("waiting_list", JSON.stringify(waitingList));
      if (adFile) {
        formData.append("ad_file", adFile);
      }
      if (compFile) {
        formData.append("comparative_file", compFile);
      }

      const response = await axios.post(staffSelectionReportRoute, formData, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setAlertHeader("Selection Committee Report Successful");
      setAlertBody(
        "The selection committee's report is successfully registered! The report needs to be approved by other members of the selection committee.",
      );
      console.log(response.data);
      onClose();
      setSuccessAlertVisible(true);
      setTimeout(() => {
        setSuccessAlertVisible(false);
        window.location.reload();
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
    <Modal
      opened={opened}
      onClose={onClose}
      size="xl"
      styles={{
        content: {
          borderLeft: "0.7rem solid #15ABFF",
        },
      }}
    >
      <form onSubmit={form.onSubmit(handleFormSubmit)}>
        {staffData &&
        Object.keys(staffData).length > 0 &&
        "sid" in staffData ? (
          <>
            <Title order={2} className={classes.formTitle}>
              Report Of Selection Committee
            </Title>
            {staffData.approval === "Hiring" ? (
              <>
                <Grid gutter="xl">
                  <Grid.Col span={6}>
                    <Text className={classes.fieldLabel}>Project Title</Text>
                    <TextInput
                      value={staffData.project_title}
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
                      value={staffData.pid}
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
                    <Text className={classes.fieldLabel}>Designation</Text>
                    <TextInput
                      value={staffData.type}
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
                    <Text className={classes.fieldLabel}>Sponsor Agency</Text>
                    <TextInput
                      value={staffData.sponsor_agency}
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
                      value={`${staffData.duration_project} months`}
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
                    <Text className={classes.fieldLabel}>Test Date</Text>
                    <TextInput
                      value={new Date(staffData.test_date).toLocaleDateString()}
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
                    <Text className={classes.fieldLabel}>Interview Date</Text>
                    <TextInput
                      value={new Date(
                        staffData.interview_date,
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
                    <Text className={classes.fieldLabel}>Interview Venue</Text>
                    <TextInput
                      value={staffData.interview_place}
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
                      Number Of Candidates Applied{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Text>
                    <NumberInput
                      placeholder="Enter the number of candidates who applied for the position"
                      min={0}
                      {...form.getInputProps("candidates_applied")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text className={classes.fieldLabel}>
                      Number Of Candidates Called For Test{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Text>
                    <NumberInput
                      placeholder="Enter the number of candidates called for written test"
                      min={0}
                      {...form.getInputProps("candidates_called")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text className={classes.fieldLabel}>
                      Number Of Candidates Interviewed{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Text>
                    <NumberInput
                      placeholder="Enter the number of candidates interviewed for position"
                      min={0}
                      {...form.getInputProps("candidates_interviewed")}
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
                    <div
                      style={{
                        display: "flex",
                        alignItems: "space-between",
                        gap: "10px",
                        width: "100%",
                      }}
                    >
                      <Title
                        order={4}
                        style={{
                          textAlign: "center",
                          color: "#A0A0A0",
                          flex: 1,
                        }}
                      >
                        Final Selection(s) For {staffData.type}
                      </Title>
                      <Button
                        onClick={() => handleAddCandidate("final")}
                        color="cyan"
                        variant="outline"
                        style={{
                          borderRadius: "8px",
                          textAlign: "center",
                          flexShrink: 0,
                        }}
                        size="xs"
                      >
                        Add Candidate
                      </Button>
                    </div>

                    {finalSelection.map((candidate, index) => (
                      <Grid key={index} gutter="sm" align="center">
                        <Grid.Col span={11}>
                          <Text style={{ textAlign: "center", width: "100%" }}>
                            {" "}
                            Selection {index + 1}{" "}
                          </Text>
                        </Grid.Col>
                        {index !== 0 && (
                          <Grid.Col span={1}>
                            <Text className={classes.fieldLabel}> Remove </Text>
                            <Button
                              color="red"
                              onClick={() =>
                                handleRemoveCandidate("final", index)
                              }
                              variant="outline"
                              size="xs"
                            >
                              <Trash />
                            </Button>
                          </Grid.Col>
                        )}
                        <Grid.Col span={6}>
                          <Text className={classes.fieldLabel}>
                            Candidate Name{" "}
                            <span style={{ color: "red" }}>*</span>
                          </Text>
                          <TextInput
                            required
                            placeholder="Enter full name of selected candidate"
                            value={candidate.name}
                            onChange={(e) =>
                              handleCandidateChange(
                                "final",
                                index,
                                "name",
                                e.target.value,
                              )
                            }
                          />
                        </Grid.Col>

                        <Grid.Col span={6}>
                          <Text className={classes.fieldLabel}>
                            Date Of Birth
                          </Text>
                          <input
                            type="date"
                            value={candidate.dob}
                            className={classes.dateInput}
                            placeholder="Date of birth of candidate"
                            onChange={(e) =>
                              handleCandidateChange(
                                "final",
                                index,
                                "dob",
                                e.target.value,
                              )
                            }
                          />
                        </Grid.Col>

                        <Grid.Col span={6}>
                          <Text className={classes.fieldLabel}>Category</Text>
                          <TextInput
                            placeholder="Enter category of selected candidate"
                            value={candidate.category}
                            onChange={(e) =>
                              handleCandidateChange(
                                "final",
                                index,
                                "category",
                                e.target.value,
                              )
                            }
                          />
                        </Grid.Col>

                        <Grid.Col span={6}>
                          <Text className={classes.fieldLabel}>
                            Consolidated Salary (in ₹){" "}
                            <span style={{ color: "red" }}>*</span>
                          </Text>
                          <NumberInput
                            required
                            placeholder="Enter net amount (in ₹)"
                            min={0}
                            value={candidate.salary}
                            onChange={(value) =>
                              handleCandidateChange(
                                "final",
                                index,
                                "salary",
                                value,
                              )
                            }
                          />
                        </Grid.Col>

                        <Grid.Col span={6}>
                          <Text className={classes.fieldLabel}>
                            Term Duration (in months){" "}
                            <span style={{ color: "red" }}>*</span>
                          </Text>
                          <NumberInput
                            required
                            placeholder="Enter term duration"
                            value={candidate.duration}
                            min={0}
                            onChange={(value) =>
                              handleCandidateChange(
                                "final",
                                index,
                                "duration",
                                value,
                              )
                            }
                          />
                        </Grid.Col>

                        <Grid.Col span={6}>
                          <Text className={classes.fieldLabel}>
                            Start Date Of Term
                          </Text>
                          <input
                            required
                            type="date"
                            value={candidate.begin}
                            className={classes.dateInput}
                            placeholder="Proposed start date of candidate's term"
                            onChange={(e) =>
                              handleCandidateChange(
                                "final",
                                index,
                                "begin",
                                e.target.value,
                              )
                            }
                          />
                        </Grid.Col>

                        <Grid.Col span={6}>
                          <Text className={classes.fieldLabel}>
                            End Date Of Term
                          </Text>
                          <input
                            required
                            type="date"
                            value={candidate.end}
                            className={classes.dateInput}
                            placeholder="Proposed end date of candidate's term"
                            onChange={(e) =>
                              handleCandidateChange(
                                "final",
                                index,
                                "end",
                                e.target.value,
                              )
                            }
                          />
                        </Grid.Col>

                        <Grid.Col span={6}>
                          <Text className={classes.fieldLabel}>
                            Resume <span style={{ color: "red" }}>*</span>{" "}
                            <Anchor
                              href="https://www.iiitdmj.ac.in/rspc.iiitdmj.ac.in/DRSPC/PEM/PEM03%20Biodata%20of%20the%20candidate%20.doc"
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
                              <FileText
                                size={26}
                                style={{ marginRight: "3px" }}
                              />
                              Choose File
                              <input
                                type="file"
                                hidden
                                required
                                onChange={(event) =>
                                  handleCandidateChange(
                                    "final",
                                    index,
                                    "biodata",
                                    event.currentTarget.files[0],
                                  )
                                }
                              />
                            </Button>
                            {candidate.biodata && (
                              <span className={classes.fileName}>
                                {candidate.biodata.name}
                              </span>
                            )}
                          </div>
                        </Grid.Col>

                        <Grid.Col span={12}>
                          <Divider
                            my="sm"
                            label=""
                            labelPosition="center"
                            size="sm"
                          />
                        </Grid.Col>
                      </Grid>
                    ))}
                  </Grid.Col>

                  <Grid.Col span={12}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "space-between",
                        gap: "10px",
                        width: "100%",
                      }}
                    >
                      <Title
                        order={4}
                        style={{
                          textAlign: "center",
                          color: "#A0A0A0",
                          flex: 1,
                        }}
                      >
                        Waiting List For {staffData.type}
                      </Title>
                      <Button
                        onClick={() => handleAddCandidate("waiting")}
                        color="cyan"
                        variant="outline"
                        style={{
                          borderRadius: "8px",
                          textAlign: "center",
                          flexShrink: 0,
                        }}
                        size="xs"
                      >
                        Add Candidate
                      </Button>
                    </div>

                    {waitingList.map((candidate, index) => (
                      <Grid key={index} gutter="sm" align="center">
                        <Grid.Col span={11}>
                          <Text style={{ textAlign: "center", width: "100%" }}>
                            {" "}
                            Waitlisted {index + 1}{" "}
                          </Text>
                        </Grid.Col>

                        <Grid.Col span={1}>
                          <Text className={classes.fieldLabel}> Remove </Text>
                          <Button
                            color="red"
                            onClick={() =>
                              handleRemoveCandidate("waiting", index)
                            }
                            variant="outline"
                            size="xs"
                          >
                            <Trash />
                          </Button>
                        </Grid.Col>

                        <Grid.Col span={6}>
                          <Text className={classes.fieldLabel}>
                            Candidate Name{" "}
                            <span style={{ color: "red" }}>*</span>
                          </Text>
                          <TextInput
                            required
                            placeholder="Enter full name of waitlisted candidate"
                            value={candidate.name}
                            onChange={(e) =>
                              handleCandidateChange(
                                "waiting",
                                index,
                                "name",
                                e.target.value,
                              )
                            }
                          />
                        </Grid.Col>

                        <Grid.Col span={6}>
                          <Text className={classes.fieldLabel}>
                            Date Of Birth
                          </Text>
                          <input
                            type="date"
                            value={candidate.dob}
                            placeholder="Date of birth of candidate"
                            className={classes.dateInput}
                            onChange={(e) =>
                              handleCandidateChange(
                                "waiting",
                                index,
                                "dob",
                                e.target.value,
                              )
                            }
                          />
                        </Grid.Col>

                        <Grid.Col span={6}>
                          <Text className={classes.fieldLabel}>Category</Text>
                          <TextInput
                            placeholder="Enter category of waitlisted candidate"
                            value={candidate.category}
                            onChange={(e) =>
                              handleCandidateChange(
                                "waiting",
                                index,
                                "category",
                                e.target.value,
                              )
                            }
                          />
                        </Grid.Col>

                        <Grid.Col span={6}>
                          <Text className={classes.fieldLabel}>
                            Consolidated Salary (in ₹){" "}
                            <span style={{ color: "red" }}>*</span>
                          </Text>
                          <NumberInput
                            required
                            placeholder="Enter net amount (in ₹)"
                            min={0}
                            value={candidate.salary}
                            onChange={(value) =>
                              handleCandidateChange(
                                "waiting",
                                index,
                                "salary",
                                value,
                              )
                            }
                          />
                        </Grid.Col>

                        <Grid.Col span={6}>
                          <Text className={classes.fieldLabel}>
                            Term Duration (in months){" "}
                            <span style={{ color: "red" }}>*</span>
                          </Text>
                          <NumberInput
                            required
                            placeholder="Enter term duration of candidate"
                            value={candidate.duration}
                            min={0}
                            onChange={(value) =>
                              handleCandidateChange(
                                "waiting",
                                index,
                                "duration",
                                value,
                              )
                            }
                          />
                        </Grid.Col>

                        <Grid.Col span={6}>
                          <Text className={classes.fieldLabel}>
                            Start Date Of Term
                          </Text>
                          <input
                            required
                            type="date"
                            value={candidate.begin}
                            placeholder="Proposed start date of candidate's term"
                            className={classes.dateInput}
                            onChange={(e) =>
                              handleCandidateChange(
                                "waiting",
                                index,
                                "begin",
                                e.target.value,
                              )
                            }
                          />
                        </Grid.Col>

                        <Grid.Col span={6}>
                          <Text className={classes.fieldLabel}>
                            End Date Of Term
                          </Text>
                          <input
                            required
                            type="date"
                            value={candidate.end}
                            placeholder="Proposed end date of candidate's term"
                            className={classes.dateInput}
                            onChange={(e) =>
                              handleCandidateChange(
                                "waiting",
                                index,
                                "end",
                                e.target.value,
                              )
                            }
                          />
                        </Grid.Col>

                        <Grid.Col span={6}>
                          <Text className={classes.fieldLabel}>
                            Resume <span style={{ color: "red" }}>*</span>{" "}
                            <Anchor
                              href="https://www.iiitdmj.ac.in/rspc.iiitdmj.ac.in/DRSPC/PEM/PEM03%20Biodata%20of%20the%20candidate%20.doc"
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
                              <FileText
                                size={26}
                                style={{ marginRight: "3px" }}
                              />
                              Choose File
                              <input
                                type="file"
                                hidden
                                required
                                onChange={(event) =>
                                  handleCandidateChange(
                                    "waiting",
                                    index,
                                    "biodata",
                                    event.currentTarget.files[0],
                                  )
                                }
                              />
                            </Button>
                            {candidate.biodata && (
                              <span className={classes.fileName}>
                                {candidate.biodata.name}
                              </span>
                            )}
                          </div>
                        </Grid.Col>

                        <Grid.Col span={12}>
                          <Divider
                            my="sm"
                            label=""
                            labelPosition="center"
                            size="sm"
                          />
                        </Grid.Col>
                      </Grid>
                    ))}
                  </Grid.Col>

                  <Grid.Col span={12}>
                    <Group position="apart" align="center">
                      <Text className={classes.fieldLabel}>
                        Copy Of Advertisement Uploaded On Institute Website{" "}
                        <span style={{ color: "red" }}>*</span>
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
                              setAdFile(event.currentTarget.files[0])
                            }
                          />
                        </Button>
                        {adFile && (
                          <span className={classes.fileName}>
                            {adFile.name}
                          </span>
                        )}
                      </div>
                    </Group>
                  </Grid.Col>

                  <Grid.Col span={12}>
                    <Group position="apart" align="center">
                      <Text className={classes.fieldLabel}>
                        Comparative Statements Of Candidates{" "}
                        <span style={{ color: "red" }}>*</span>{" "}
                        <Anchor
                          href="https://www.iiitdmj.ac.in/rspc.iiitdmj.ac.in/DRSPC/PEM/PEM04%20Comparative%20Statement%20Written%20Test%20and%20Interview.docx"
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
                              setCompFile(event.currentTarget.files[0])
                            }
                          />
                        </Button>
                        {compFile && (
                          <span className={classes.fileName}>
                            {compFile.name}
                          </span>
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
                Selection committee report already submitted!
              </Text>
            )}
          </>
        ) : (
          <Text color="red" align="center">
            Failed to load staff details
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
            title={alertHeader}
            icon={
              successAlertVisible ? (
                <ThumbsUp size={96} />
              ) : (
                <ThumbsDown size={96} />
              )
            }
            className={classes.alertBox}
          >
            {alertBody}
          </Alert>
        </div>
      )}
    </Modal>
  );
}

SelectionCommitteeReportFormModal.propTypes = {
  opened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  staffData: PropTypes.shape({
    sid: PropTypes.number,
    pid: PropTypes.number,
    project_title: PropTypes.string,
    eligibility: PropTypes.string,
    sponsor_agency: PropTypes.string,
    duration_project: PropTypes.number,
    ad_file: PropTypes.string,
    comparative_file: PropTypes.string,
    selection_committee: PropTypes.arrayOf(PropTypes.string),
    test_date: PropTypes.string,
    test_mode: PropTypes.string,
    submission_date: PropTypes.string,
    id_card: PropTypes.string,
    duration: PropTypes.number,
    candidates_applied: PropTypes.number,
    candidates_called: PropTypes.number,
    candidates_interviewed: PropTypes.number,
    approval: PropTypes.string,
    joining_report: PropTypes.string,
    type: PropTypes.string,
    sanction_date: PropTypes.string,
    start_date: PropTypes.string,
    interview_date: PropTypes.string,
    interview_place: PropTypes.string,
    salary: PropTypes.number,
    salary_per_month: PropTypes.number,
    person: PropTypes.string,
    biodata_final: PropTypes.arrayOf(PropTypes.string),
    biodata_number: PropTypes.number,
    final_selection: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
    ),
    waiting_list: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
    ),
  }).isRequired,
};

export default SelectionCommitteeReportFormModal;
