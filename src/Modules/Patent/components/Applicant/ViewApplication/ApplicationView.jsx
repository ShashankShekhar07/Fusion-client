import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Text,
  Box,
  Grid,
  Container,
  Stepper,
  Badge,
  Loader,
  Title,
} from "@mantine/core";
import {
  CalendarCheck,
  User,
  FileText,
  Hourglass,
  Key,
  ArrowLeft,
  DownloadSimple,
  CheckCircle,
  CircleNotch,
  ArrowRight,
} from "phosphor-react";
import PropTypes from "prop-types";
import axios from "axios";
import "../../../style/Applicant/ApplicationView.css";
import { host } from "../../../../../routes/globalRoutes/index.jsx";

// Define API_BASE_URL
const API_BASE_URL = `${host}/patentsystem`;

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

// Application Card Component
function ApplicationCard({
  title,
  date,
  tokenNumber,
  applicationNumber,
  attorney,
  status,
  onViewApplication,
}) {
  const getStatusColor = (currentStatus) => {
    switch (currentStatus) {
      case "Submitted":
        return "blue";
      case "Rejected":
        return "red";
      case "Director's Approval Received":
      case "Patent Filed":
        return "green";
      case "Attorney Assigned":
      case "Forwarded for Director's Review":
      case "Patentability Search Report Generated":
        return "orange";
      default: // Handles "Draft" and any unknown statuses
        return "gray";
    }
  };
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Not available";

  return (
    <Card
      className="application-card"
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
    >
      <Text className="app-card-title" weight={700} size="lg" mb="md">
        {title}
      </Text>

      <div className="app-card-info">
        <div className="info-item">
          <CalendarCheck size={18} />
          <Text className="info-text">{formattedDate}</Text>
        </div>

        <div className="info-item">
          <FileText size={18} />
          <Text className="info-text">Application #{applicationNumber}</Text>
        </div>

        {tokenNumber ? (
          <div className="info-item">
            <Key size={18} />
            <Text className="info-text">Tracking Token: {tokenNumber}</Text>
          </div>
        ) : (
          <div className="info-item">
            <Hourglass size={18} />
            <Text className="info-text">Token: Awaiting assignment</Text>
          </div>
        )}

        <div className="info-item">
          <User size={18} />
          <Text className="info-text">
            {attorney || "No Attorney Assigned"}
          </Text>
        </div>

        <div className="card-badge-container">
          <Badge color={getStatusColor(status)} size="lg">
            {status}
          </Badge>
        </div>
      </div>

      <Button
        variant="filled"
        color="blue"
        fullWidth
        mt="md"
        onClick={() => onViewApplication(applicationNumber)}
        className="view-application-button"
      >
        View Details
      </Button>
    </Card>
  );
}

ApplicationCard.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string,
  tokenNumber: PropTypes.string,
  applicationNumber: PropTypes.string.isRequired,
  attorney: PropTypes.string,
  status: PropTypes.string.isRequired,
  onViewApplication: PropTypes.func.isRequired,
};

function ConditionalFileDownload({ filePath, label, value }) {
  const encodedFilePath = filePath ? encodeURI(filePath) : null;
  const fileUrl = encodedFilePath ? `${API_BASE_URL}${encodedFilePath}` : null;

  return (
    <div className="form-field-with-download">
      <div className="field-label-container">
        <Text className="field-label">{label}</Text>
        <Text className="field-value">{value || "Not provided"}</Text>
      </div>
      {fileUrl ? (
        <div className="download-button-wrapper">
          <Button
            component="a"
            href={fileUrl}
            download
            variant="outline"
            color="blue"
            leftIcon={<DownloadSimple size={18} />}
          >
            Download {label.replace(":", "")}
          </Button>
        </div>
      ) : (
        <Text color="red" size="sm">
          Not submitted
        </Text>
      )}
    </div>
  );
}

ConditionalFileDownload.propTypes = {
  filePath: PropTypes.string,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
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

// Field component for detail view - moved outside of the render function
function FormField({ label, value }) {
  return (
    <div
      className={`form-field ${
        window.innerWidth <= 768 ? "mobile-form-field" : ""
      }`}
    >
      <Text
        className={`field-label ${
          window.innerWidth <= 768 ? "mobile-field-label" : ""
        }`}
      >
        {label}
      </Text>
      <Text
        className={`field-value ${
          window.innerWidth <= 768 ? "mobile-field-value" : ""
        }`}
      >
        {value || "Not provided"}
      </Text>
    </div>
  );
}

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

// Field with download button - moved outside of the render function
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

// Section component for detail view - moved outside of the render function
function FormSection({ title, children }) {
  return (
    <Card
      className={`detail-section ${
        window.innerWidth <= 768 ? "mobile-form-section" : ""
      }`}
      p="lg"
      radius="md"
      withBorder
      mb="md"
    >
      <Title
        className={`section-title ${
          window.innerWidth <= 768 ? "mobile-section-title" : ""
        }`}
      >
        {title}
      </Title>
      {children}
    </Card>
  );
}

FormSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

// Main Application View Component
function ApplicationView({ setActiveTab }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [isMobile, setIsMobile] = useState(false);

  // Retrieve authToken from local storage
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchApplicationData = async () => {
      if (!authToken) {
        setError("Authorization token is missing. Please login again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response = await axios.get(
          `${API_BASE_URL}/applicant/applications/`,
          {
            headers: {
              Authorization: `Token ${authToken}`,
            },
          },
        );

        if (
          response.data &&
          response.data.applications &&
          Array.isArray(response.data.applications)
        ) {
          const formattedApplications = response.data.applications.map(
            (application) => ({
              title: application.title || "Untitled Application",
              date: application.submitted_date || "",
              tokenNumber: application.token_no || null,
              applicationNumber: application.application_id,
              attorney: application.attorney_name || null,
              status: application.status || "Pending",
            }),
          );

          setApplications(formattedApplications);
        } else {
          setError("No applications found or invalid response format");
        }
      } catch (err) {
        console.error("Error fetching application data:", err);
        setError("Failed to load application data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationData();
  }, [authToken]);

  const handleViewApplication = async (applicationNumber) => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_BASE_URL}/applicant/applications/details/${applicationNumber}`,
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        },
      );

      if (response.data) {
        setSelectedApplication(response.data);
        setViewMode("detail");
        localStorage.setItem("selectedApplicationId", applicationNumber);
      }
    } catch (err) {
      console.error("Error fetching application details:", err);
      setError("Failed to load application details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedApplication(null);
  };

  // Render application list view with improved loading and error states
  const renderApplicationList = () => (
    // Replace the Grid component with this structure:
    <Box className="applications-container">
      <Text className="view-app-page-title">Your Patent Applications</Text>

      {loading ? (
        <div className="loader-container">
          <Loader size="lg" color="blue" />
          <Text mt="md">Loading your applications...</Text>
        </div>
      ) : error ? (
        <Card className="error-card" p="xl" radius="md" withBorder>
          <Text color="red" size="lg" weight={500}>
            {error}
          </Text>
          <Button mt="md" color="blue" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Card>
      ) : applications.length === 0 ? (
        <Card className="empty-state-card" p="xl" radius="md" withBorder>
          <Text size="lg" align="center">
            You haven't submitted any patent applications yet.
          </Text>
          <Button
            mt="lg"
            color="blue"
            onClick={() => setActiveTab("newApplication")}
          >
            Create Your First Application
          </Button>
        </Card>
      ) : (
        <div className="view-applications-grid">
          {applications.map((app, index) => (
            <ApplicationCard
              key={index}
              title={app.title}
              date={app.date}
              tokenNumber={app.tokenNumber}
              applicationNumber={app.applicationNumber}
              attorney={app.attorney}
              status={app.status}
              onViewApplication={handleViewApplication}
            />
          ))}
        </div>
      )}
    </Box>
  );

  // Render application detail view with enhanced UI
  const renderApplicationDetail = () => {
    if (!selectedApplication) return null;

    const {
      application_id,
      title,
      token_no,
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
    const pocFileUrl = section_I?.poc_file
      ? `${API_BASE_URL}/download/file/${section_I.poc_file}/`
      : null;
    const sourceAgreementFileUrl = section_II?.source_agreement_file
      ? `${API_BASE_URL}/download/file/${section_II.source_agreement_file}/`
      : null;
    const mouFileUrl = section_II?.mou_file
      ? `${API_BASE_URL}/download/file/${section_II.mou_file}/`
      : null;
    const formIIIFileUrl = section_III?.form_iii
      ? `${API_BASE_URL}/download/file/${section_III.form_iii}/`
      : null;

    return (
      <Container
        className={`detail-container ${
          isMobile ? "mobile-form-container" : ""
        }`}
        size="100%"
        style={{ maxWidth: "100%", padding: "2rem" }}
      >
        <div className="application-view-detail-header">
          <Button
            onClick={handleBackToList}
            leftIcon={<ArrowLeft size={18} />}
            className="application-view-back-button"
          >
            Back
          </Button>
          <Text className="application-view-page-title">
            {application_id} : {title}
          </Text>
          <Button
            component="a"
            href={`${API_BASE_URL}/download/${application_id}/`}
            target="_blank"
            download={`Application-${application_id}.pdf`}
            className="application-view-download-button"
            rightIcon={<DownloadSimple size={18} />}
          >
            Download
          </Button>
        </div>

        <div>
          <FormSection
            title="Application Overview"
            className="application-view-form-section"
          >
            <Grid>
              <Grid.Col span={12} md={4}>
                <FormField label="Title of Application:" value={title} />
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
                      ? new Date(
                          dates.director_approval_date,
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Not yet approved"}
                  </div>
                </div>

                <div className="key-date-card">
                  <div className="key-date-title">
                    Patentability Check Start
                  </div>
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
                      ? new Date(
                          dates.patent_published_date,
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
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
                <FormField
                  label="Objective of your invention:"
                  value={section_I?.objective}
                />
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

          <FormSection title="Inventor">
            {applicants && applicants.length > 0 ? (
              <div className="inventors-container">
                {applicants.map((applicant, index) => (
                  <Card
                    key={index}
                    className="inventor-card"
                    p="md"
                    radius="sm"
                    withBorder
                  >
                    <Text weight={600} size="lg" mb="xs" align="center">
                      Inventor {index + 1}
                    </Text>
                    <div className="inventor-details">
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
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Text color="dimmed">No inventor information available</Text>
            )}
          </FormSection>

          <FormSection title="Application Progress">
            <PatentProgressBar currentStatus={status} isMobile={isMobile} />
          </FormSection>
        </div>
      </Container>
    );
  };

  return (
    <Box className="application-view-container">
      {viewMode === "list"
        ? renderApplicationList()
        : renderApplicationDetail()}
    </Box>
  );
}

ApplicationView.propTypes = {
  setActiveTab: PropTypes.func.isRequired,
};

export default ApplicationView;
