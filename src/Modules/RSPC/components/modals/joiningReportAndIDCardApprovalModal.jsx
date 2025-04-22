import PropTypes from "prop-types";
import React, { useState } from "react";
import {
  Modal,
  Group,
  Button,
  Text,
  Grid,
  Divider,
  GridCol,
  Alert,
  Title,
} from "@mantine/core";
import axios from "axios";
import { ThumbsUp, ThumbsDown, FileText } from "@phosphor-icons/react";
import classes from "../../styles/formStyle.module.css";
import { staffDecisionRoute } from "../../../../routes/RSPCRoutes";
import { host } from "../../../../routes/globalRoutes";

function JoiningReportAndIDCardApprovalModal({
  opened,
  onClose,
  staffData,
  setActiveTab,
}) {
  const [successAlertVisible, setSuccessAlertVisible] = useState(false);
  const [failureAlertVisible, setFailureAlertVisible] = useState(false);
  const [alertHeader, setAlertHeader] = useState(
    "Joining Report And ID Card Approval Failed",
  );
  const [alertBody, setAlertBody] = useState(
    "Your action on joining report and ID card upload could not be successfully registered! Please verify the filled details and try again.",
  );

  const handleStaffDecision = async (action) => {
    const token = localStorage.getItem("authToken");
    if (!token) return console.error("No authentication token found!");

    try {
      const formData = new FormData();
      formData.append("sid", staffData.sid);
      formData.append("action", action);
      formData.append("form", "doc");
      formData.forEach((value, key) => {
        console.log(key, value);
      });
      const response = await axios.post(staffDecisionRoute, formData, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      onClose();
      setAlertHeader("Joining Report And ID Card Upload Decision Successful");
      setAlertBody(
        "Your decision on joining report and ID card upload is successfully registered!",
      );
      console.log(response.data);
      setSuccessAlertVisible(true);
      setTimeout(() => {
        setSuccessAlertVisible(false);
        setActiveTab("0");
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

  return (
    <>
      <Modal opened={opened} onClose={onClose} size="xl">
        {staffData && Object.keys(staffData).length > 0 ? (
          <>
            <Group position="apart" style={{ marginBottom: 10 }}>
              <Title order={2}>Approval Of Joining Report And ID Card</Title>
              <Group position="left" style={{ marginTop: "20px" }}>
                <Button
                  color="green"
                  style={{ borderRadius: "8px" }}
                  size="xs"
                  onClick={() => handleStaffDecision("approve")}
                >
                  <ThumbsUp size={26} style={{ marginRight: "3px" }} />
                  Approve
                </Button>
                <Button
                  color="red"
                  style={{ borderRadius: "8px" }}
                  onClick={() => handleStaffDecision("reject")}
                  size="xs"
                  variant="outline"
                >
                  <ThumbsDown size={26} style={{ marginRight: "3px" }} />
                  Reject
                </Button>
              </Group>
            </Group>

            <Grid gutter="xs" style={{ marginBottom: 20 }}>
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>Project Title:</strong>{" "}
                  {staffData.project_title}
                </Text>
              </GridCol>
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>Project ID:</strong>{" "}
                  {staffData.pid}
                </Text>
              </GridCol>
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>Personnel Name:</strong>{" "}
                  {staffData.person}
                </Text>
              </GridCol>
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>Staff ID:</strong>{" "}
                  {staffData.sid}
                </Text>
              </GridCol>
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>Designation:</strong>{" "}
                  {staffData.type}
                </Text>
              </GridCol>
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>
                    Consolidated Salary:
                  </strong>{" "}
                  {staffData.salary} (in INR)
                </Text>
              </GridCol>
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>
                    Appointment Duration:
                  </strong>{" "}
                  {staffData.duration} months
                </Text>
              </GridCol>

              {/* -------------- */}
              <Grid.Col span={12}>
                <Divider my="sm" label="" labelPosition="center" size="sm" />
              </Grid.Col>

              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>
                    Salary Per Month (as mentioned in Joining Report):
                  </strong>{" "}
                  {staffData.salary} (in INR)
                </Text>
              </GridCol>
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>
                    Joining Date (as mentioned in Joining Report):
                  </strong>{" "}
                  {new Date(staffData.start_date).toLocaleDateString()}
                </Text>
              </GridCol>
              <GridCol span={12}>
                <Text size="xl">
                  <strong
                    style={{
                      color: "blue",
                      textAlign: "center",
                      width: "100%",
                    }}
                  >
                    Joining Report
                  </strong>
                </Text>
                {staffData.joining_report && (
                  <Button
                    variant="outline"
                    color="#15ABFF"
                    size="md"
                    className={classes.fileInputButton}
                    style={{ borderRadius: "8px" }}
                    component="a"
                    href={`${host}/${staffData.joining_report}`} // Directly access the file URL
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText size={26} style={{ marginRight: "3px" }} />
                    Open Report
                  </Button>
                )}
              </GridCol>

              {/* -------------- */}
              <Grid.Col span={12}>
                <Divider my="sm" label="" labelPosition="center" size="sm" />
              </Grid.Col>
              <GridCol span={12}>
                <Text size="xl">
                  <strong
                    style={{
                      color: "blue",
                      textAlign: "center",
                      width: "100%",
                    }}
                  >
                    ID Card
                  </strong>
                </Text>
                {staffData.id_card && (
                  <Button
                    variant="outline"
                    color="#15ABFF"
                    size="md"
                    className={classes.fileInputButton}
                    style={{ borderRadius: "8px" }}
                    component="a"
                    href={`${host}/${staffData.id_card}`} // Directly access the file URL
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText size={26} style={{ marginRight: "3px" }} />
                    Open ID
                  </Button>
                )}
              </GridCol>
            </Grid>
          </>
        ) : (
          <Text color="red" size="xl" weight={700} align="center">
            Failed to load advertisement and committee details
          </Text>
        )}
      </Modal>

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
    </>
  );
}

JoiningReportAndIDCardApprovalModal.propTypes = {
  opened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  staffData: PropTypes.shape({
    sid: PropTypes.number,
    pid: PropTypes.number,
    project_title: PropTypes.string,
    sponsor_agency: PropTypes.string,
    duration_project: PropTypes.number,
    selection_committee: PropTypes.arrayOf(PropTypes.string),
    test_date: PropTypes.string,
    submission_date: PropTypes.string,
    id_card: PropTypes.string,
    duration: PropTypes.number,
    pi_name: PropTypes.string,
    approval: PropTypes.string,
    joining_report: PropTypes.string,
    type: PropTypes.string,
    sanction_date: PropTypes.string,
    start_date: PropTypes.string,
    interview_date: PropTypes.string,
    interview_place: PropTypes.string,
    salary: PropTypes.number,
    has_funds: PropTypes.string,
    person: PropTypes.string,
  }).isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

export default JoiningReportAndIDCardApprovalModal;
