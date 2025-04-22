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
} from "@mantine/core";
import { ArrowLeft, DownloadSimple } from "phosphor-react";
import "../../../style/Pcc_Admin/PastApplications.css";
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
    <Card
      className="detail-section"
      p="lg"
      radius="md"
      withBorder
      mb="md"
      style={{ width: "100%" }}
    >
      <Title className="section-title">{title}</Title>
      {children}
    </Card>
  );
}

FormSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

function ViewPastApplication({ applicationId, handleBackToList }) {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const API_BASE_URL = `${host}/patentsystem`;
  const authToken = localStorage.getItem("authToken");

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
            left: "30px",
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
            right: "110px",
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
          paddingRight: "80px",
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
                <div className="key-date-title">Date of Granting</div>
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
              <FormField label="Type of IP:" value={section_I?.type_of_ip} />
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
      </div>
    </Container>
  );
}

ViewPastApplication.propTypes = {
  applicationId: PropTypes.string.isRequired,
  handleBackToList: PropTypes.func.isRequired,
};

export default ViewPastApplication;
