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
  Select,
  Group,
} from "@mantine/core";
import { ArrowLeft, DownloadSimple } from "phosphor-react";
import "../../../style/Director/StatusView.css";
import { host } from "../../../../../routes/globalRoutes/index.jsx";

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

function PatentApplication() {
  const [applicationData, setApplicationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applicationId, setApplicationId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [attorneys, setAttorneys] = useState([]);
  const [selectedAttorneyId, setSelectedAttorneyId] = useState("");
  const [attorneysLoading, setAttorneysLoading] = useState(true);
  const API_BASE_URL = `${host}/patentsystem`;
  const authToken = localStorage.getItem("authToken");
  // Add this useEffect hook near your existing useEffect hooks
  // Add authToken to dependency array
  useEffect(() => {
    const fetchAttorneys = async () => {
      try {
        setAttorneysLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/pccAdmin/attorneys/`,
          {
            headers: {
              Authorization: `Token ${authToken}`,
            },
          },
        );

        const attorneyOptions = response.data.map((attorney) => ({
          value: attorney.id.toString(),
          label: `${attorney.name} (${attorney.specialization || "Attorney"})`,
        }));

        setAttorneys(attorneyOptions);
      } catch (err) {
        console.error("Error fetching attorneys:", err);
        alert(
          `Failed to load attorneys: ${err.response?.data?.error || err.message}`,
        );
        setAttorneys([]);
      } finally {
        setAttorneysLoading(false);
      }
    };

    fetchAttorneys();
  }, [authToken]);
  const handleAccept = async () => {
    if (!selectedAttorneyId) {
      alert("Please select an attorney before Approving");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/director/application/accept`,
        {
          application_id: applicationId,
          attorney_id: selectedAttorneyId, // Changed from attorney_name to attorney_id
        },
        {
          headers: {
            Authorization: `Token ${authToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      // Get attorney name for success message
      const selectedAttorney = attorneys.find(
        (a) => a.value === selectedAttorneyId,
      );
      const attorneyName = selectedAttorney
        ? attorneys
            .find((a) => a.value === selectedAttorneyId)
            ?.label.split(" (")[0]
        : "Unassigned";

      alert(
        `Application Approved and assigned to ${attorneyName} successfully!`,
      );
      window.history.back();
    } catch (err) {
      console.error("Error in approving application:", err);
      alert(`Failed to approve: ${err.response?.data?.error || err.message}`);
    }
  };
  const handleReject = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/director/application/reject`,
        { application_id: applicationId },
        {
          headers: {
            Authorization: `Token ${authToken}`,
            "Content-Type": "application/json",
          },
        },
      );
      alert("Application Reverted successfully!");
      window.history.back();
    } catch (err) {
      console.error("Error in Reverting application:", err);
      alert(`Failed to Revert: ${err.response?.data?.error || err.message}`);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const storedId = localStorage.getItem("selectedApplicationId");
    if (storedId) {
      const idParts = storedId.split("_");
      const numericId = idParts.length > 1 ? idParts[1] : storedId;
      setApplicationId(numericId);
    } else {
      setError("No application selected - Please choose an application first");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      if (!applicationId) return;

      try {
        setLoading(true);
        const response = await axios.post(
          `${API_BASE_URL}/director/application/details`,
          { application_id: applicationId },
          {
            headers: {
              Authorization: `Token ${authToken}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (response.data) {
          setApplicationData(response.data);
          setApplicationId(response.data.application_id);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching details:", err);
        setError(
          `Failed to load details: ${err.response?.data?.error || err.message}`,
        );
      } finally {
        setLoading(false);
      }
    };

    if (applicationId) fetchApplicationDetails();
  }, [applicationId, authToken]);

  useEffect(() => {
    return () => {
      localStorage.removeItem("selectedApplicationId");
      localStorage.removeItem("selectedApplicationToken");
    };
  }, []);

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
        <Button mt="md" onClick={() => window.history.back()}>
          Back to Applications
        </Button>
      </Container>
    );
  }

  if (!applicationData) {
    return (
      <Container className="error-container">
        <Alert color="blue" title="No Data">
          No application data found
        </Alert>
        <Button mt="md" onClick={() => window.history.back()}>
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
    last_updated_at,
  } = applicationData;

  const formatDate = (dateString, fallbackText = "Not recorded") => {
    if (!dateString) return fallbackText;
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Container
      className={`director-detail-container ${isMobile ? "mobile-form-container" : ""}`}
    >
      <div className="detail-header">
        <Button
          onClick={() => window.history.back()}
          variant="outline"
          color="blue"
          leftIcon={<ArrowLeft size={18} />}
          className="director-view-back-button"
        >
          Back
        </Button>
        <Title
          className={`detail-page-title ${
            isMobile ? "mobile-detail-page-title" : ""
          }`}
        >
          Application Details
        </Title>
      </div>

      <div className="form-content">
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
              <FormField
                label="Submission Date:"
                value={formatDate(dates?.submitted_date)}
              />
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
            <Grid.Col span={12} md={4}>
              <FormField
                label="Last Updated:"
                value={formatDate(last_updated_at)}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <FormField label="Comments:" value={comments} />
            </Grid.Col>
          </Grid>
        </FormSection>
        <FormSection title="Key Dates">
          <div className="key-dates-grid">
            <div className="key-date-card">
              <div className="key-date-title">Submitted</div>
              <div className="key-date-value">
                {formatDate(dates?.submitted_date, "Not yet submitted")}
              </div>
            </div>
            <div className="key-date-card">
              <div className="key-date-title">Reviewed by PCC</div>
              <div className="key-date-value">
                {formatDate(dates?.reviewed_by_pcc_date, "Not yet reviewed")}
              </div>
            </div>
            <div className="key-date-card">
              <div className="key-date-title">Forwarded to Director</div>
              <div className="key-date-value">
                {formatDate(
                  dates?.forwarded_to_director_date,
                  "Not yet forwarded",
                )}
              </div>
            </div>
            <div className="key-date-card">
              <div className="key-date-title">Director Approval</div>
              <div className="key-date-value">
                {formatDate(dates?.director_approval_date, "Not yet approved")}
              </div>
            </div>
            <div className="key-date-card">
              <div className="key-date-title">Patentability Check Started</div>
              <div className="key-date-value">
                {formatDate(
                  dates?.patentability_check_start_date,
                  "Not started",
                )}
              </div>
            </div>
            <div className="key-date-card">
              <div className="key-date-title">
                Patentability Check Completed
              </div>
              <div className="key-date-value">
                {formatDate(
                  dates?.patentability_check_completed_date,
                  "Not completed",
                )}
              </div>
            </div>
            <div className="key-date-card">
              <div className="key-date-title">Search Report Generated</div>
              <div className="key-date-value">
                {formatDate(
                  dates?.search_report_generated_date,
                  "Not generated",
                )}
              </div>
            </div>
            <div className="key-date-card">
              <div className="key-date-title">Patent Filed</div>
              <div className="key-date-value">
                {formatDate(dates?.patent_filed_date, "Not filed")}
              </div>
            </div>
            <div className="key-date-card">
              <div className="key-date-title">Patent Published</div>
              <div className="key-date-value">
                {formatDate(dates?.patent_published_date, "Not published")}
              </div>
            </div>
            <div className="key-date-card">
              <div className="key-date-title">Final Decision</div>
              <div className="key-date-value">
                {formatDate(dates?.final_decision_date, "No final decision")}
              </div>
            </div>
            <div className="key-date-card">
              <div className="key-date-title">Decision Date</div>
              <div className="key-date-value">
                {formatDate(dates?.decision_date, "No decision")}
              </div>
            </div>
          </div>
        </FormSection>
        <FormSection title="Section I: Administrative and Technical Details">
          <Grid>
            <Grid.Col span={12} md={6}>
              <FormField label="Type of IP:" value={section_I?.type_of_ip} />
            </Grid.Col>
            <Grid.Col span={12} md={6}>
              <FormField label="Area:" value={section_I?.area} />
            </Grid.Col>
            <Grid.Col span={12}>
              <FormField label="Problem:" value={section_I?.problem} />
            </Grid.Col>
            <Grid.Col span={12}>
              <FormField label="Objective:" value={section_I?.objective} />
            </Grid.Col>
            <Grid.Col span={12}>
              <FormField label="Novelty:" value={section_I?.novelty} />
            </Grid.Col>
            <Grid.Col span={12}>
              <FormField label="Advantages:" value={section_I?.advantages} />
            </Grid.Col>
            <Grid.Col span={12} md={6}>
              <FormField
                label="Is Tested:"
                value={
                  section_I?.is_tested === true
                    ? "Yes"
                    : section_I?.is_tested === false
                      ? "No"
                      : "Not specified"
                }
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <FormField
                label="Applications:"
                value={section_I?.applications}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <FormFieldWithDownload
                label="Proof of Concept Details:"
                value="Proof of Concept Documentation"
                fileUrl={section_I?.poc_details}
                fileLabel="Proof of Concept"
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
            <Grid.Col span={12}>
              <FormFieldWithDownload
                label="Source Agreement:"
                value="Source Agreement Document"
                fileUrl={section_II?.source_agreement}
                fileLabel="Agreement Document"
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <FormField
                label="Publication Details:"
                value={section_II?.publication_details}
              />
            </Grid.Col>
            <Grid.Col span={12} md={6}>
              <FormField label="MOU Details:" value={section_II?.mou_details} />
            </Grid.Col>
            <Grid.Col span={12}>
              <FormFieldWithDownload
                label="MOU File:"
                value="MOU Document"
                fileUrl={section_II?.mou_file}
                fileLabel="MOU Document"
              />
            </Grid.Col>
            <Grid.Col span={12}>
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
              <FormField
                label="Development Stage:"
                value={section_III?.development_stage}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <FormFieldWithDownload
                label="Form III:"
                value="Form III Document"
                fileUrl={section_III?.form_iii}
                fileLabel="Form III"
              />
            </Grid.Col>
          </Grid>
        </FormSection>
        <FormSection title="Applicants">
          {applicants?.length > 0 ? (
            <Grid>
              {applicants.map((applicant, index) => (
                <Grid.Col key={index} span={12} md={6}>
                  <Card className="applicant-card">
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
        <FormSection title="Application Decision">
          <div className="decision-section">
            <div className="assign-attorney-section">
              <Text size="lg" weight={500} mb="sm">
                Modify Assigned Attorney
              </Text>
              {attorneys.length === 0 && !attorneysLoading ? (
                <Text color="dimmed" mt="sm">
                  No attorneys available
                </Text>
              ) : (
                <Select
                  data={attorneys}
                  placeholder={
                    attorneysLoading
                      ? "Loading attorneys..."
                      : "Select an attorney"
                  }
                  value={selectedAttorneyId}
                  onChange={setSelectedAttorneyId}
                  mb="md"
                  className="attorney-select"
                  disabled={attorneysLoading}
                  nothingFound="No attorneys available"
                />
              )}
            </div>

            <div className="decision-buttons">
              <Group spacing="md">
                <Button
                  color="green"
                  size="md"
                  onClick={handleAccept}
                  className="decision-button"
                >
                  Approve
                </Button>
                <Button
                  color="red"
                  size="md"
                  onClick={handleReject}
                  className="decision-button"
                >
                  Revert
                </Button>
              </Group>
            </div>
          </div>
        </FormSection>
      </div>
    </Container>
  );
}

export default PatentApplication;
