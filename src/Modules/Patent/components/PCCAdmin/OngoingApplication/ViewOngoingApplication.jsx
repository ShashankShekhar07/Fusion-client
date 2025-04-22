import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
  Container,
  Text,
  Card,
  Grid,
  Button,
  Loader,
  Alert,
  Title,
  Stepper,
  Group,
  Select,
} from "@mantine/core";
import {
  ArrowLeft,
  DownloadSimple,
  CheckCircle,
  CircleNotch,
  ArrowRight,
} from "phosphor-react";
import { host } from "../../../../../routes/globalRoutes/index.jsx";

// Field component for detail view
function FormField({ label, value }) {
  return (
    <div className="form-field">
      <Text className="field-label">{label}</Text>
      <Text className="field-value">{value || "Not provided"}</Text>
    </div>
  );
}

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

// Field with download button for direct file URLs
function FormFieldWithDownload({ label, value, fileUrl, fileLabel }) {
  return (
    <div className="form-field-with-download">
      <div className="field-label-container">
        <Text className="field-label">{label}</Text>
        <Text className="field-value">{value || "Not provided"}</Text>
      </div>
      <div className="download-button-wrapper">
        <FileDownloadButton
          fileUrl={fileUrl}
          label={fileLabel}
          disabled={!fileUrl || fileUrl === "null"}
        />
      </div>
    </div>
  );
}

FormFieldWithDownload.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fileUrl: PropTypes.string,
  fileLabel: PropTypes.string.isRequired,
};

// File Download Button Component
function FileDownloadButton({ fileUrl, label, disabled }) {
  if (!fileUrl || fileUrl === "null" || disabled) {
    return (
      <Button
        variant="outline"
        color="gray"
        leftIcon={<DownloadSimple size={18} />}
        disabled
      >
        No {label} Available
      </Button>
    );
  }

  return (
    <Button
      component="a"
      href={fileUrl}
      download
      variant="outline"
      color="blue"
      leftIcon={<DownloadSimple size={18} />}
    >
      Download {label}
    </Button>
  );
}

FileDownloadButton.propTypes = {
  fileUrl: PropTypes.string,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

// Section component for detail view
function FormSection({ title, children }) {
  return (
    <Card className="detail-section" p="lg" radius="md" withBorder mb="md">
      <Title className="section-title">{title}</Title>
      {children}
    </Card>
  );
}

FormSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

// Progress Bar Component
function PatentProgressBar({ currentStatus, isMobile }) {
  const allStatuses = [
    "Submitted",
    "Reviewed by PCC Admin",
    "Attorney Assigned",
    "Forwarded for Director's Review",
    "Director's Approval Received",
    "Patentability Check Started",
    "Patentability Check Completed",
    "Patentability Search Report Generated",
    "Patent Filed",
    "Patent Published",
    "Patent Granted",
    "Patent Refused",
  ];

  const getStepIndex = (status) => {
    if (status === "Rejected") return -1;
    return allStatuses.findIndex((s) => s === status);
  };

  const currentStep = getStepIndex(currentStatus);
  const isRejected = currentStatus === "Rejected";
  const isRefused = currentStatus === "Patent Refused";
  const isGranted = currentStatus === "Patent Granted";

  // Determine which statuses to display based on current status
  let displayStatuses;
  if (isRefused) {
    displayStatuses = ["Submitted", "Patent Refused"];
  } else if (isGranted) {
    // Show only the first 11 stages without "Patent Refused" for granted patents
    displayStatuses = allStatuses.slice(0, 11);
  } else {
    displayStatuses = allStatuses;
  }

  return (
    <div className={`progress-container ${isRejected ? "rejected" : ""}`}>
      {isRejected && (
        <Text color="red" size="lg" weight={600} className="rejection-label">
          Application Rejected
        </Text>
      )}

      {!isMobile ? (
        // Desktop view
        <div className="desktop-stepper">
          {isRefused ? (
            // Simple two-step progress for refused patents
            <Stepper
              active={1}
              className="workflow-stepper"
              size="md"
              color="red"
              orientation="horizontal"
              iconSize={24}
              breakpoint="sm"
            >
              <Stepper.Step
                key="Submitted"
                icon={<CheckCircle size={18} />}
                label="Stage 1"
                description="Submitted"
                className="completed-step"
              />
              <Stepper.Step
                key="Patent Refused"
                icon={<CircleNotch size={18} />}
                label="Stage 2"
                description="Patent Refused"
                className="completed-step"
              />
            </Stepper>
          ) : (
            // Regular view with two rows for normal flow
            <>
              <Stepper
                active={isGranted ? 4 : currentStep}
                className="workflow-stepper"
                size="md"
                color={isRejected ? "red" : "blue"}
                orientation="horizontal"
                iconSize={24}
                breakpoint="sm"
              >
                {displayStatuses.slice(0, 4).map((status, index) => (
                  <Stepper.Step
                    key={status}
                    icon={
                      isGranted || index < currentStep ? (
                        <CheckCircle size={18} />
                      ) : index === currentStep ? (
                        <CircleNotch size={18} />
                      ) : (
                        <ArrowRight size={18} />
                      )
                    }
                    label={`Stage ${index + 1}`}
                    description={status}
                    className={
                      isGranted || index <= currentStep
                        ? "completed-step"
                        : "pending-step"
                    }
                  />
                ))}
              </Stepper>
              <Stepper
                active={isGranted ? 7 : Math.max(0, currentStep - 4)} // All steps active if granted
                className="workflow-stepper second-row"
                size="md"
                color={isRejected ? "red" : "blue"}
                orientation="horizontal"
                iconSize={24}
                breakpoint="sm"
              >
                {displayStatuses.slice(4).map((status, index) => (
                  <Stepper.Step
                    key={status}
                    icon={
                      isGranted || index + 4 < currentStep ? (
                        <CheckCircle size={18} />
                      ) : index + 4 === currentStep ? (
                        <CircleNotch size={18} />
                      ) : (
                        <ArrowRight size={18} />
                      )
                    }
                    label={`Stage ${index + 5}`}
                    description={status}
                    className={
                      isGranted || index + 4 <= currentStep
                        ? "completed-step"
                        : "pending-step"
                    }
                  />
                ))}
              </Stepper>
            </>
          )}
        </div>
      ) : (
        // Mobile view - vertical stepper
        <Stepper
          active={
            isRefused ? 1 : isGranted ? displayStatuses.length - 1 : currentStep
          }
          className="workflow-stepper mobile-view"
          size="sm"
          color={isRefused ? "red" : isRejected ? "red" : "blue"}
          orientation="vertical"
          iconSize={16}
        >
          {displayStatuses.map((status, index) => (
            <Stepper.Step
              key={status}
              icon={
                isGranted || index < (isRefused ? 1 : currentStep) ? (
                  <CheckCircle size={16} />
                ) : index === (isRefused ? 1 : currentStep) ? (
                  <CircleNotch size={16} />
                ) : (
                  <ArrowRight size={16} />
                )
              }
              label={`Stage ${index + 1}`}
              description={status}
              className={
                isGranted || index <= (isRefused ? 1 : currentStep)
                  ? "completed-step"
                  : "pending-step"
              }
            />
          ))}
        </Stepper>
      )}
    </div>
  );
}

PatentProgressBar.propTypes = {
  currentStatus: PropTypes.string.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

function ViewOngoingApplication({ applicationId, handleBackToList }) {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusUpdateMessage, setStatusUpdateMessage] = useState(null);

  const API_BASE_URL = `${host}/patentsystem`;
  const authToken = localStorage.getItem("authToken");

  // These statuses must match the backend's expected REVIEW_STATUSES
  const statusOptions = [
    {
      value: "Director's Approval Received",
      label: "Director's Approval Received",
    },
    {
      value: "Patentability Check Started",
      label: "Patentability Check Started",
    },
    {
      value: "Patentability Check Completed",
      label: "Patentability Check Completed",
    },
    {
      value: "Patentability Search Report Generated",
      label: "Patentability Search Report Generated",
    },
    { value: "Patent Filed", label: "Patent Filed" },
    { value: "Patent Published", label: "Patent Published" },
    { value: "Patent Granted", label: "Patent Granted" },
    { value: "Patent Refused", label: "Patent Refused" },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      if (!applicationId) {
        setError("No application ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/pccAdmin/applications/details/${applicationId}/`,
          {
            headers: {
              Authorization: `Token ${authToken}`,
            },
          },
        );

        if (response.data) {
          setSelectedApplication(response.data);
          setError(null);
        } else {
          setError("No application data found");
        }
      } catch (err) {
        console.error("Error fetching application details:", err);
        setError(`Failed to load application details: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [applicationId, authToken]);

  const handleStatusChange = async (newStatus) => {
    if (!newStatus || newStatus === selectedApplication.status) return;

    // Prevent moving past "Patent Granted" status
    if (selectedApplication.status === "Patent Granted") {
      setStatusUpdateMessage({
        type: "info",
        text: "This application has already been granted a patent. No further status changes are allowed.",
      });

      // Clear info message after 5 seconds
      setTimeout(() => {
        setStatusUpdateMessage(null);
      }, 5000);

      return;
    }

    // For "Patent Refused" status, show confirmation dialog
    if (newStatus === "Patent Refused") {
      const confirmRefusal = window.confirm(
        "Are you sure you want to mark this application as 'Patent Refused'? This action cannot be undone.",
      );

      if (!confirmRefusal) {
        return; // User canceled the operation
      }
    }

    try {
      setUpdatingStatus(true);
      setStatusUpdateMessage(null);

      // Update to match the backend's expected parameter name
      const response = await axios.post(
        `${API_BASE_URL}/pccAdmin/applications/ongoing/changeStatus/${applicationId}/`,
        { next_status: newStatus }, // Changed from 'status' to 'next_status'
        {
          headers: {
            Authorization: `Token ${authToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data && response.status === 200) {
        // Update the application object with new status
        setSelectedApplication({
          ...selectedApplication,
          status: newStatus,
        });
        setStatusUpdateMessage({
          type: "success",
          text: `Status successfully updated to ${newStatus}`,
        });
      } else {
        setStatusUpdateMessage({
          type: "error",
          text: "Failed to update status. Please try again.",
        });
      }
    } catch (err) {
      console.error("Error updating application status:", err);
      setStatusUpdateMessage({
        type: "error",
        text: `Error: ${err.response?.data?.error || err.message}`,
      });
    } finally {
      setUpdatingStatus(false);

      // Clear success message after 5 seconds
      if (
        statusUpdateMessage?.type === "success" ||
        statusUpdateMessage?.type === "info"
      ) {
        setTimeout(() => {
          setStatusUpdateMessage(null);
        }, 5000);
      }
    }
  };

  if (loading) {
    return (
      <Container className="loader-container">
        <Loader size="lg" color="blue" />
        <Text mt="md">Loading application details...</Text>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="error-container">
        <Alert color="red" title="Error">
          {error}
        </Alert>
        <Button mt="md" onClick={handleBackToList}>
          Back to Applications
        </Button>
      </Container>
    );
  }

  if (!selectedApplication) {
    return (
      <Container className="error-container">
        <Alert color="blue" title="No Data">
          No application data found
        </Alert>
        <Button mt="md" onClick={handleBackToList}>
          Back to Applications
        </Button>
      </Container>
    );
  }

  const {
    application_id,
    title,
    token_no,
    primary_applicant_name,
    attorney_name,
    status,
    decision_status,
    comments,
    applicants,
    section_I,
    section_II,
    section_III,
    dates,
  } = selectedApplication;

  const submittedDate = dates?.submitted_date
    ? new Date(dates.submitted_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not recorded";

  // Build file URLs
  const mouFileUrl = section_II?.mou_file
    ? `${API_BASE_URL}/download/file/${section_II.mou_file}/`
    : null;
  const formIIIFileUrl = section_III?.form_iii
    ? `${API_BASE_URL}/download/file/${section_III.form_iii}/`
    : null;
  const pocFileUrl = section_I?.poc_file
    ? `${API_BASE_URL}/download/file/${section_I.poc_file}/`
    : null;
  const sourceAgreementFileUrl = section_II?.source_agreement_file
    ? `${API_BASE_URL}/download/file/${section_II.source_agreement_file}/`
    : null;

  // Get the next allowed status based on current status
  const getCurrentStatusIndex = () => {
    return statusOptions.findIndex((option) => option.value === status);
  };

  const getNextStatus = () => {
    const currentIndex = getCurrentStatusIndex();
    return currentIndex >= 0 && currentIndex < statusOptions.length - 1
      ? statusOptions[currentIndex + 1].value
      : null;
  };

  const getPreviousStatus = () => {
    const currentIndex = getCurrentStatusIndex();
    return currentIndex > 0 ? statusOptions[currentIndex - 1].value : null;
  };

  return (
    <Container
      className={`detail-container ${isMobile ? "mobile-form-container" : ""}`}
      size={isMobile ? "sm" : "lg"}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          position: "relative",
          marginBottom: "0",
          backgroundColor: "#f5f7f8",
          height: "60px",
          zIndex: 10,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 20,
            cursor: "pointer",
          }}
        >
          <Button
            variant="subtle"
            color="blue"
            leftIcon={<ArrowLeft size={18} />}
            style={{
              border: "none",
              padding: "10px",
              background: "none",
              cursor: "pointer",
              fontWeight: "500",
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (typeof handleBackToList === "function") {
                handleBackToList();
              } else {
                window.history.back();
              }
            }}
          >
            Back
          </Button>
        </div>

        <div
          style={{
            position: "absolute",
            right: "50px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 20,
          }}
        >
          <Button
            component="a"
            href={`${API_BASE_URL}/download/${application_id}/`}
            target="_blank"
            download={`Application-${application_id}.pdf`}
            variant="subtle"
            color="blue"
            rightIcon={<DownloadSimple size={18} />}
            style={{
              border: "none",
              padding: "10px",
              background: "none",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Download
          </Button>
        </div>

        <Text
          className={`detail-page-title ${isMobile ? "mobile-detail-page-title" : ""}`}
          style={{
            fontSize: "24px",
            fontWeight: "600",
            textAlign: "center",
            margin: "0 auto",
          }}
        >
          Application Details
        </Text>
      </div>

      <div
        className="form-content"
        style={{
          backgroundColor: "#f5f7f8",
          boxShadow: "0px 5px 15px rgba(0, 0, 0, 0)",
        }}
      >
        <FormSection title="Application Overview">
          <Grid>
            <Grid.Col span={12} md={4}>
              <FormField label="Application ID:" value={application_id} />
            </Grid.Col>
            <Grid.Col span={12} md={4}>
              <FormField label="Title:" value={title} />
            </Grid.Col>
            <Grid.Col span={12} md={4}>
              <FormField
                label="Primary Applicant:"
                value={primary_applicant_name}
              />
            </Grid.Col>
            <Grid.Col span={12} md={4}>
              <FormField label="Submission Date:" value={submittedDate} />
            </Grid.Col>
            <Grid.Col span={12} md={4}>
              <FormField label="Token Number:" value={token_no} />
            </Grid.Col>
            <Grid.Col span={12} md={4}>
              <FormField label="Attorney:" value={attorney_name} />
            </Grid.Col>
            <Grid.Col span={12} md={4}>
              <FormField label="Status:" value={status} />
            </Grid.Col>
            <Grid.Col span={12} md={4}>
              <FormField label="Decision Status:" value={decision_status} />
            </Grid.Col>
            <Grid.Col span={12}>
              <FormField label="Comments:" value={comments} />
            </Grid.Col>
          </Grid>
        </FormSection>

        <FormSection title="Key Dates">
          <div className="key-dates-container">
            <div className="key-dates-grid">
              {/* <div className="key-date-card">
                <div className="key-date-title">Reviewed by PCC</div>
                <div className="key-date-value">
                  {dates?.reviewed_by_pcc_date
                    ? new Date(dates.reviewed_by_pcc_date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )
                    : "Not yet reviewed"}
                </div>
              </div> */}

              <div className="key-date-card">
                <div className="key-date-title">Forwarded to Director</div>
                <div className="key-date-value">
                  {dates?.forwarded_to_director_date
                    ? new Date(
                        dates.forwarded_to_director_date,
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Not yet forwarded"}
                </div>
              </div>

              <div className="key-date-card">
                <div className="key-date-title">Director Approval</div>
                <div className="key-date-value">
                  {dates?.director_approval_date
                    ? new Date(dates.director_approval_date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )
                    : "Not yet approved"}
                </div>
              </div>

              <div className="key-date-card">
                <div className="key-date-title">Patentability Check Start</div>
                <div className="key-date-value">
                  {dates?.patentability_check_start_date
                    ? new Date(
                        dates.patentability_check_start_date,
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Not started"}
                </div>
              </div>

              <div className="key-date-card">
                <div className="key-date-title">
                  Patentability Check Completed
                </div>
                <div className="key-date-value">
                  {dates?.patentability_check_completed_date
                    ? new Date(
                        dates.patentability_check_completed_date,
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Not completed"}
                </div>
              </div>

              <div className="key-date-card">
                <div className="key-date-title">Search Report Generated</div>
                <div className="key-date-value">
                  {dates?.search_report_generated_date
                    ? new Date(
                        dates.search_report_generated_date,
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Not generated"}
                </div>
              </div>

              <div className="key-date-card">
                <div className="key-date-title">Date of Filing</div>
                <div className="key-date-value">
                  {dates?.patent_filed_date
                    ? new Date(dates.patent_filed_date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )
                    : "Not recorded"}
                </div>
              </div>

              <div className="key-date-card">
                <div className="key-date-title">Date of Publication</div>
                <div className="key-date-value">
                  {dates?.patent_published_date
                    ? new Date(dates.patent_published_date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )
                    : "Not yet published"}
                </div>
              </div>

              {/* <div className="key-date-card">
                <div className="key-date-title">Decision Date</div>
                <div className="key-date-value">
                  {dates?.decision_date
                    ? new Date(dates.decision_date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )
                    : "No decision yet"}
                </div>
              </div> */}

              <div className="key-date-card">
                <div className="key-date-title"> Date of Granting</div>
                <div className="key-date-value">
                  {dates?.final_decision_date
                    ? new Date(dates.final_decision_date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )
                    : "No final decision yet"}
                </div>
              </div>
            </div>
          </div>
        </FormSection>

        <FormSection title="Section I: Administrative and Technical Details">
          <Grid>
            <Grid.Col span={12} md={6}>
              <FormField
                label="Type of IP:"
                value={
                  Array.isArray(section_I?.type_of_ip)
                    ? section_I?.type_of_ip.join(", ")
                    : section_I?.type_of_ip
                }
              />
            </Grid.Col>
            <Grid.Col span={12} md={6}>
              <FormField
                label="Area of the invention:"
                value={section_I?.area}
              />
            </Grid.Col>
            <Grid.Col span={12} md={6}>
              <FormField
                label="Problem in the area:"
                value={section_I?.problem}
              />
            </Grid.Col>
            <Grid.Col span={12} md={6}>
              <FormField label="Objective:" value={section_I?.objective} />
            </Grid.Col>
            <Grid.Col span={12} md={6}>
              <FormField label="Novelty:" value={section_I?.novelty} />
            </Grid.Col>
            <Grid.Col span={12} md={6}>
              <FormField label="Advantages:" value={section_I?.advantages} />
            </Grid.Col>
            <Grid.Col span={12} md={6}>
              <FormField
                label="Tested:"
                value={
                  section_I?.is_tested === true
                    ? "Yes"
                    : section_I?.is_tested === false
                      ? "No"
                      : ""
                }
              />
            </Grid.Col>
            <Grid.Col span={12} md={6}>
              <FormFieldWithDownload
                label="POC Details:"
                value={section_I?.poc_details}
                fileUrl={pocFileUrl}
                fileLabel="POC File"
              />
            </Grid.Col>
            <Grid.Col span={12} md={6}>
              <FormField
                label="Applications:"
                value={section_I?.applications}
              />
            </Grid.Col>
          </Grid>
        </FormSection>

        <FormSection title="Section II: IPR Ownership">
          <Grid>
            <Grid.Col span={12} md={6}>
              <FormField
                label="Funding Details:"
                value={section_II?.funding_details}
              />
            </Grid.Col>
            <Grid.Col span={12} md={6}>
              <FormField
                label="Funding Source:"
                value={section_II?.funding_source}
              />
            </Grid.Col>
            <Grid.Col span={12} md={6}>
              <FormFieldWithDownload
                label="Source Agreement:"
                value={section_II?.source_agreement}
                fileUrl={sourceAgreementFileUrl}
                fileLabel="Source Agreement"
              />
            </Grid.Col>
            <Grid.Col span={12} md={6}>
              <FormField
                label="Publication Details:"
                value={section_II?.publication_details}
              />
            </Grid.Col>
            <Grid.Col span={12} md={6}>
              <FormFieldWithDownload
                label="MOU Details:"
                value={section_II?.mou_details}
                fileUrl={mouFileUrl}
                fileLabel="MOU File"
              />
            </Grid.Col>
            <Grid.Col span={12} md={6}>
              <FormField
                label="Research Details:"
                value={section_II?.research_details}
              />
            </Grid.Col>
          </Grid>
        </FormSection>

        <FormSection title="Section III: Commercialization">
          <Grid>
            <Grid.Col span={12} md={6}>
              <FormField
                label="Company Name:"
                value={section_III?.company_name}
              />
            </Grid.Col>
            <Grid.Col span={12} md={6}>
              <FormField
                label="Contact Person:"
                value={section_III?.contact_person}
              />
            </Grid.Col>
            <Grid.Col span={12} md={6}>
              <FormField
                label="Contact Number:"
                value={section_III?.contact_no}
              />
            </Grid.Col>
            <Grid.Col span={12} md={6}>
              <FormFieldWithDownload
                label="Development Stage:"
                value={section_III?.development_stage}
                fileUrl={formIIIFileUrl}
                fileLabel="Form III"
              />
            </Grid.Col>
          </Grid>
        </FormSection>

        <FormSection title="Applicants">
          {applicants && applicants.length > 0 ? (
            <Grid>
              {applicants.map((applicant, index) => (
                <Grid.Col key={index} span={12} md={6}>
                  <Card
                    className="applicant-card"
                    p="md"
                    radius="sm"
                    withBorder
                  >
                    <Text weight={600} size="lg" mb="xs">
                      Applicant {index + 1}
                    </Text>
                    <FormField label="Name:" value={applicant.name} />
                    <FormField label="Email:" value={applicant.email} />
                    <FormField label="Mobile:" value={applicant.mobile} />
                    <FormField label="Address:" value={applicant.address} />
                    <FormField
                      label="Share Percentage:"
                      value={
                        applicant.percentage_share
                          ? `${applicant.percentage_share}%`
                          : ""
                      }
                    />
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          ) : (
            <Text color="dimmed">No applicant information available</Text>
          )}
        </FormSection>

        <FormSection title="Application Progress">
          <PatentProgressBar currentStatus={status} isMobile={isMobile} />

          <div className="status-update-section">
            <Text size="md" weight={500} mb="xs" mt="lg">
              Update Application Status
            </Text>

            {statusUpdateMessage && (
              <Alert
                color={statusUpdateMessage.type === "success" ? "green" : "red"}
                title={
                  statusUpdateMessage.type === "success" ? "Success" : "Error"
                }
                mb="md"
                withCloseButton
                onClose={() => setStatusUpdateMessage(null)}
              >
                {statusUpdateMessage.text}
              </Alert>
            )}

            <Group
              position="apart"
              align="flex-end"
              className="status-update-group"
            >
              <Select
                label="Select New Status"
                placeholder="Choose status"
                data={statusOptions}
                value={status}
                onChange={handleStatusChange}
                style={{ minWidth: isMobile ? "100%" : "300px" }}
                disabled={updatingStatus}
              />

              <div className="status-button-group">
                <Button
                  color="blue"
                  loading={updatingStatus}
                  disabled={updatingStatus || !getNextStatus()}
                  onClick={() => {
                    const nextStatus = getNextStatus();
                    if (nextStatus) {
                      handleStatusChange(nextStatus);
                    }
                  }}
                >
                  Move to Next Stage
                </Button>

                <Button
                  color="red"
                  variant="outline"
                  loading={updatingStatus}
                  disabled={updatingStatus || !getPreviousStatus()}
                  onClick={() => {
                    const prevStatus = getPreviousStatus();
                    if (prevStatus) {
                      handleStatusChange(prevStatus);
                    }
                  }}
                  ml="xs"
                >
                  Move to Previous Stage
                </Button>
              </div>
            </Group>
          </div>
        </FormSection>
      </div>
    </Container>
  );
}

ViewOngoingApplication.propTypes = {
  applicationId: PropTypes.string.isRequired,
  handleBackToList: PropTypes.func.isRequired,
};

export default ViewOngoingApplication;
