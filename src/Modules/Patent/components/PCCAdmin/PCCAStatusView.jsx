import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
  Container,
  Text,
  Card,
  Stepper,
  Button,
  Loader,
  Alert,
} from "@mantine/core";
import {
  IconInfoCircle,
  IconAlertCircle,
  IconDownload,
  IconFile,
} from "@tabler/icons-react";
import { CheckCircle, CircleNotch, ArrowRight } from "phosphor-react";
import "../../style/Pcc_Admin/PCCAStatus.css";
import { host } from "../../../../routes/globalRoutes/index.jsx";

// Progress Bar Component
function PatentProgressBar({ currentStatus, isMobile }) {
  const statuses = [
    "Submitted",
    "Reviewed by PCC Admin",
    "Attorney Assigned",
    "Forwarded for Director's Review",
    "Director's Approval Received",
    "Patentability Check",
    "Patentability Search Report Generated",
    "Patent Filed",
  ];

  const getStepIndex = (status) => {
    if (status === "Rejected") return -1;
    return statuses.findIndex((s) => s === status);
  };

  const currentStep = getStepIndex(currentStatus);
  const isRejected = currentStatus === "Rejected";

  return (
    <div className={`progress-container ${isRejected ? "rejected" : ""}`}>
      {isRejected && (
        <Text color="red" size="lg" weight={600} className="rejection-label">
          Application Rejected
        </Text>
      )}

      <Stepper
        active={currentStep}
        className={`workflow-stepper ${isMobile ? "mobile-view" : ""}`}
        size={isMobile ? "sm" : "md"}
        color={isRejected ? "red" : "blue"}
        orientation={isMobile ? "vertical" : "horizontal"}
        iconSize={isMobile ? 16 : 24}
      >
        {statuses.map((status, index) => (
          <Stepper.Step
            key={status}
            icon={
              index < currentStep ? (
                <CheckCircle size={isMobile ? 16 : 18} />
              ) : index === currentStep ? (
                <CircleNotch size={isMobile ? 16 : 18} />
              ) : (
                <ArrowRight size={isMobile ? 16 : 18} />
              )
            }
            label={`Stage ${index + 1}`}
            description={status}
            className={index <= currentStep ? "completed-step" : "pending-step"}
          />
        ))}
      </Stepper>
    </div>
  );
}

PatentProgressBar.propTypes = {
  currentStatus: PropTypes.string.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

// Format date helper function
const formatDate = (dateString) => {
  if (!dateString) return "Not Available";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

// File Download Button Component
function FileDownloadButton({ fileUrl, fileName, disabled }) {
  return (
    <Button
      component="a"
      href={fileUrl}
      target="_blank"
      download={fileName}
      color="blue"
      className="down-button"
      disabled={disabled}
      leftIcon={<IconFile size={16} />}
    >
      Download {fileName}
    </Button>
  );
}

FileDownloadButton.propTypes = {
  fileUrl: PropTypes.string,
  fileName: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

function PCCAStatusView({ applicationId }) {
  const [applicationData, setApplicationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
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
          `${host}/patentsystem/pccAdmin/applications/status/details/${applicationId}/`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("authToken")}`,
            },
          },
        );
        setApplicationData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching application details:", err);
        setError("Failed to load application details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [applicationId]);

  const handleDownloadForm = () => {
    // Logic to download the entire form
    // This would typically be an API call to get a PDF or other document format
    alert("Downloading the complete application form...");

    // Example implementation:
    // window.location.href = `http://127.0.0.1:8000/patentsystem/pccAdmin/applications/download/${applicationId}/`;
  };

  if (loading) {
    return (
      <Container
        className="form-container"
        size="lg"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
        }}
      >
        <Loader size="xl" variant="dots" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="form-container" size="lg">
        <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
          {error}
        </Alert>
      </Container>
    );
  }

  if (!applicationData) {
    return (
      <Container className="form-container" size="lg">
        <Alert icon={<IconInfoCircle size={16} />} title="No Data" color="blue">
          No application data found for the specified ID.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="form-container" size="lg">
      <Text className="form-title">{applicationData.title || "Untitled"}</Text>

      <Card className="form-section">
        <Text className="section-title">Application Details</Text>
        <div className="form-field">
          <Text className="field-heading">Primary Applicant:</Text>
          <Text className="field-value">
            {applicationData.primary_applicant_name || "—"}
          </Text>
        </div>
        <div className="form-field">
          <Text className="field-heading">Submission Date:</Text>
          <Text className="field-value">
            {formatDate(applicationData.dates?.submitted_date)}
          </Text>
        </div>
        <div className="form-field">
          <Text className="field-heading">Application ID:</Text>
          <Text className="field-value">
            {applicationData.application_id || "—"}
          </Text>
        </div>
        <div className="form-field">
          <Text className="field-heading">Token Number:</Text>
          <Text className="field-value">
            {applicationData.token_no || "Not Assigned"}
          </Text>
        </div>
        <div className="form-field">
          <Text className="field-heading">Attorney Name:</Text>
          <Text className="field-value">
            {applicationData.attorney_name || "Not Assigned"}
          </Text>
        </div>
        <div className="form-field">
          <Text className="field-heading">Status:</Text>
          <Text className="field-value">
            {applicationData.status || "Draft"}
          </Text>
        </div>
        <div className="form-field">
          <Text className="field-heading">Decision Status:</Text>
          <Text className="field-value">
            {applicationData.decision_status || "Pending"}
          </Text>
        </div>
      </Card>

      <Card className="form-section">
        <Text className="section-title">Applicants</Text>
        {applicationData.applicants && applicationData.applicants.length > 0 ? (
          applicationData.applicants.map((applicant, index) => (
            <div key={index} className="inventor-container">
              <Text className="inventor-title">Applicant {index + 1}</Text>
              <div className="form-field">
                <Text className="field-heading">Name:</Text>
                <Text className="field-value">{applicant.name || "—"}</Text>
              </div>
              <div className="form-field">
                <Text className="field-heading">Email:</Text>
                <Text className="field-value">{applicant.email || "—"}</Text>
              </div>
              <div className="form-field">
                <Text className="field-heading">Contact Address:</Text>
                <Text className="field-value">{applicant.address || "—"}</Text>
              </div>
              <div className="form-field">
                <Text className="field-heading">Mobile:</Text>
                <Text className="field-value">{applicant.mobile || "—"}</Text>
              </div>
              <div className="form-field">
                <Text className="field-heading">Percentage Share:</Text>
                <Text className="field-value">
                  {applicant.percentage_share || "—"}%
                </Text>
              </div>
            </div>
          ))
        ) : (
          <Text>No applicant information available</Text>
        )}
      </Card>

      <Card className="form-section">
        <Text className="section-title">
          Section I: Administrative and Technical Details
        </Text>
        <div className="form-field">
          <Text className="field-heading">Title of Application:</Text>
          <Text className="field-value">{applicationData.title || "—"}</Text>
        </div>
        <div className="form-field">
          <Text className="field-heading">Area of the invention:</Text>
          <Text className="field-value">
            {applicationData.section_I?.area || "—"}
          </Text>
        </div>
        <div className="form-field">
          <Text className="field-heading">Problem in the area:</Text>
          <Text className="field-value">
            {applicationData.section_I?.problem || "—"}
          </Text>
        </div>
        <div className="form-field">
          <Text className="field-heading">Objective of your invention:</Text>
          <Text className="field-value">
            {applicationData.section_I?.objective || "—"}
          </Text>
        </div>
        <div className="form-field">
          <Text className="field-heading">Novelty:</Text>
          <Text className="field-value">
            {applicationData.section_I?.novelty || "—"}
          </Text>
        </div>
        <div className="form-field">
          <Text className="field-heading">Advantages:</Text>
          <Text className="field-value">
            {applicationData.section_I?.advantages || "—"}
          </Text>
        </div>
        <div className="form-field">
          <Text className="field-heading">Tested:</Text>
          <Text className="field-value">
            {applicationData.section_I?.is_tested === true
              ? "Yes"
              : applicationData.section_I?.is_tested === false
                ? "No"
                : "—"}
          </Text>
        </div>
        <div className="form-field">
          <Text className="field-heading">Proof of Concept Details:</Text>
          <Text className="field-value">
            {applicationData.section_I?.poc_details || "—"}
          </Text>
        </div>
        <div className="form-field">
          <Text className="field-heading">Applications:</Text>
          <Text className="field-value">
            {applicationData.section_I?.applications || "—"}
          </Text>
        </div>
      </Card>

      <Card className="form-section">
        <Text className="section-title">Section II: IPR Ownership</Text>
        <div className="form-field">
          <Text className="field-heading">Funding Details:</Text>
          <Text className="field-value">
            {applicationData.section_II?.funding_details || "—"}
          </Text>
        </div>
        <div className="form-field">
          <Text className="field-heading">Source of funding:</Text>
          <Text className="field-value">
            {applicationData.section_II?.funding_source || "—"}
          </Text>
        </div>
        <div className="form-field">
          <Text className="field-heading">Source Agreement:</Text>
          <div className="field-value">
            {applicationData.section_II?.source_agreement ? (
              <FileDownloadButton
                fileUrl={applicationData.section_II.source_agreement}
                fileName="Source-Agreement.pdf"
                disabled={!applicationData.section_II?.source_agreement}
              />
            ) : (
              "No file available"
            )}
          </div>
        </div>
        <div className="form-field">
          <Text className="field-heading">Publication Details:</Text>
          <Text className="field-value">
            {applicationData.section_II?.publication_details || "—"}
          </Text>
        </div>
        <div className="form-field">
          <Text className="field-heading">MOU Details:</Text>
          <Text className="field-value">
            {applicationData.section_II?.mou_details || "—"}
          </Text>
        </div>
        <div className="form-field">
          <Text className="field-heading">MOU File:</Text>
          <div className="field-value">
            {applicationData.section_II?.mou_file ? (
              <FileDownloadButton
                fileUrl={applicationData.section_II.mou_file}
                fileName="MOU-File.pdf"
                disabled={!applicationData.section_II?.mou_file}
              />
            ) : (
              "No file available"
            )}
          </div>
        </div>
        <div className="form-field">
          <Text className="field-heading">Research Details:</Text>
          <Text className="field-value">
            {applicationData.section_II?.research_details || "—"}
          </Text>
        </div>
      </Card>

      <Card className="form-section">
        <Text className="section-title">Section III: Commercialization</Text>
        <div className="form-field">
          <Text className="field-heading">Target Company:</Text>
          <Text className="field-value">
            {applicationData.section_III?.company_name || "—"}
          </Text>
        </div>
        <div className="form-field">
          <Text className="field-heading">Contact Person:</Text>
          <Text className="field-value">
            {applicationData.section_III?.contact_person || "—"}
          </Text>
        </div>
        <div className="form-field">
          <Text className="field-heading">Contact Number:</Text>
          <Text className="field-value">
            {applicationData.section_III?.contact_no || "—"}
          </Text>
        </div>
        <div className="form-field">
          <Text className="field-heading">Development Stage:</Text>
          <Text className="field-value">
            {applicationData.section_III?.development_stage || "—"}
          </Text>
        </div>
        <div className="form-field">
          <Text className="field-heading">Form-III:</Text>
          <div className="field-value">
            {applicationData.section_III?.form_iii ? (
              <FileDownloadButton
                fileUrl={applicationData.section_III.form_iii}
                fileName="Form-III.pdf"
                disabled={!applicationData.section_III?.form_iii}
              />
            ) : (
              "No file available"
            )}
          </div>
        </div>
      </Card>

      <Card className="form-section">
        <Text className="section-title">Important Dates</Text>
        <div className="form-field">
          <Text className="field-heading">Submission Date:</Text>
          <Text className="field-value">
            {formatDate(applicationData.dates?.submitted_date)}
          </Text>
        </div>
        <div className="form-field">
          <Text className="field-heading">Assigned Date:</Text>
          <Text className="field-value">
            {formatDate(applicationData.dates?.assigned_date)}
          </Text>
        </div>
        <div className="form-field">
          <Text className="field-heading">Decision Date:</Text>
          <Text className="field-value">
            {formatDate(applicationData.dates?.decision_date)}
          </Text>
        </div>
        <div className="form-field">
          <Text className="field-heading">Patentability Check Date:</Text>
          <Text className="field-value">
            {formatDate(applicationData.dates?.patentability_check_date)}
          </Text>
        </div>
        <div className="form-field">
          <Text className="field-heading">Patentability File Date:</Text>
          <Text className="field-value">
            {formatDate(applicationData.dates?.patentability_file_date)}
          </Text>
        </div>
      </Card>

      <Card className="form-section">
        <Text className="section-title">Comments</Text>
        <div className="form-field">
          <Text className="field-value">
            {applicationData.comments || "No comments available."}
          </Text>
        </div>
      </Card>

      <Card className="form-section">
        <Text className="section-title">Application Progress</Text>
        <PatentProgressBar
          currentStatus={applicationData.status || "Draft"}
          isMobile={isMobile}
        />
      </Card>

      <div className="form-actions">
        <Button
          onClick={handleDownloadForm}
          color="blue"
          className="down-button"
          leftIcon={<IconDownload size={16} />}
        >
          Download Complete Form
        </Button>
      </div>
    </Container>
  );
}

PCCAStatusView.propTypes = {
  applicationId: PropTypes.string.isRequired,
};

export default PCCAStatusView;
