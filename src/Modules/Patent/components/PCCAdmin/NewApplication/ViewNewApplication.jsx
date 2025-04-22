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
  Textarea,
  Modal,
  Group,
  ActionIcon,
  Box,
} from "@mantine/core";
import { ArrowLeft, Download } from "phosphor-react"; // Changed DownloadSimple to Download
import "../../../style/Pcc_Admin/ViewNewApplication.css";
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
        leftIcon={<Download size={18} />} // Changed from DownloadSimple to Download
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
      leftIcon={<Download size={18} />} // Changed from DownloadSimple to Download
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

function ViewNewApplication({ applicationId, handleBackToList }) {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [attorneys, setAttorneys] = useState([]);
  const [selectedAttorneyId, setSelectedAttorneyId] = useState("");
  const [comments, setComments] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [commentError, setCommentError] = useState(null);

  // Modal states
  const [forwardModalOpen, setForwardModalOpen] = useState(false);
  const [modificationModalOpen, setModificationModalOpen] = useState(false);

  const API_BASE_URL = `${host}/patentsystem`;
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch application details
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
          setComments(response.data.comments || "");
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

  // Fetch attorneys list for the dropdown
  useEffect(() => {
    const fetchAttorneys = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/pccAdmin/attorneys/`,
          {
            headers: {
              Authorization: `Token ${authToken}`,
            },
          },
        );

        if (response.data) {
          // Transform data for select dropdown
          const attorneyOptions = response.data.map((attorney) => ({
            value: attorney.id.toString(),
            label: attorney.name,
          }));
          setAttorneys(attorneyOptions);
        }
      } catch (err) {
        console.error("Error fetching attorneys list:", err);
        // Don't set error state to avoid interrupting the main UI flow
      }
    };

    fetchAttorneys();
  }, [authToken]);

  const openForwardModal = () => {
    setSelectedAttorneyId("");
    setComments("");
    setActionError(null);
    setCommentError(null);
    setForwardModalOpen(true);
  };

  const openModificationModal = () => {
    setComments("");
    setActionError(null);
    setCommentError(null);
    setModificationModalOpen(true);
  };

  // Handler for forward to director
  const handleForwardToDirector = async () => {
    // Reset errors
    setActionError(null);
    setCommentError(null);

    // Validate attorney selection
    if (!selectedAttorneyId) {
      setActionError("Please select an attorney");
      return;
    }

    // Validate comments
    if (!comments.trim()) {
      setCommentError("Comments are required for forwarding to director");
      return;
    }

    setActionLoading(true);

    try {
      const selectedAttorney = attorneys.find(
        (a) => a.value === selectedAttorneyId,
      );
      const attorneyName = selectedAttorney ? selectedAttorney.label : "";

      await axios.post(
        `${API_BASE_URL}/pccAdmin/applications/new/forward/${applicationId}/`,
        {
          attorney_name: attorneyName,
          comments,
        },
        {
          headers: {
            Authorization: `Token ${authToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      setActionSuccess("Application successfully forwarded to director");
      setForwardModalOpen(false);

      // Refresh application details after the action
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
      }
    } catch (err) {
      console.error("Error forwarding to director:", err);
      setActionError(
        `Failed to forward application: ${err.response?.data?.message || err.message}`,
      );
    } finally {
      setActionLoading(false);
      // Clear success message after 3 seconds
      if (actionSuccess) {
        setTimeout(() => setActionSuccess(null), 3000);
      }
    }
  };

  // Handler for request modification
  const handleRequestModification = async () => {
    // Reset errors
    setActionError(null);
    setCommentError(null);

    // Validate comments
    if (!comments.trim()) {
      setCommentError("Comments are required for requesting modification");
      return;
    }

    setActionLoading(true);

    try {
      await axios.post(
        `${API_BASE_URL}/pccAdmin/applications/new/requestModification/${applicationId}/`,
        {
          comments,
        },
        {
          headers: {
            Authorization: `Token ${authToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      setActionSuccess("Modification request sent successfully");
      setModificationModalOpen(false);

      // Refresh application details after the action
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
      }
    } catch (err) {
      console.error("Error requesting modification:", err);
      setActionError(
        `Failed to request modification: ${err.response?.data?.message || err.message}`,
      );
    } finally {
      setActionLoading(false);
      // Clear success message after 3 seconds
      if (actionSuccess) {
        setTimeout(() => setActionSuccess(null), 3000);
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
    status,
    decision_status,
    comments: app_comments,
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
      className={`k-detail-container1 ${isMobile ? "mobile-form-container" : ""}`}
      size="xl"
      px={0}
      fluid
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          position: "relative",
          marginBottom: "0",
        }}
      >
        <Button
          onClick={handleBackToList}
          variant="subtle"
          color="blue"
          leftIcon={<ArrowLeft size={18} />}
          style={{
            position: "absolute",
            left: "50px",
            top: "50%",
            transform: "translateY(-50%)",
            border: "none",
            padding: "10px",
            fontWeight: "500",
          }}
        >
          Back
        </Button>

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

      {actionSuccess && (
        <Alert color="green" title="Success" mb="md">
          {actionSuccess}
        </Alert>
      )}

      {/* Action buttons at the top of the form */}
      <Card className="action-buttons-card">
        <Group
          position="center"
          spacing="md"
          className="action-buttons-group"
          style={{ justifyContent: "center" }}
        >
          <Button
            component="a"
            href={`${API_BASE_URL}/download/${application_id}/`}
            target="_blank"
            download={`Application-${application_id}.pdf`}
            size="md"
            variant="outline"
            color="blue"
            leftIcon={<Download size={18} />}
            className="action-button"
            sx={(theme) => ({
              borderColor: theme.colors.blue[6],
              color: theme.colors.blue[6],
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: `${theme.colors.blue[6]} !important`,
                color: "white !important",
              },
            })}
          >
            Download Application
          </Button>

          <Button
            size="md"
            variant="outline"
            color="green"
            leftIcon={<ActionIcon size={18} />}
            onClick={openForwardModal}
            className="action-button"
            sx={(theme) => ({
              borderColor: theme.colors.green[6],
              color: theme.colors.green[6],
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: `${theme.colors.green[6]} !important`,
                color: "white !important",
              },
            })}
          >
            Forward to Director
          </Button>

          <Button
            size="md"
            variant="outline"
            color="orange"
            leftIcon={<ActionIcon size={18} />}
            onClick={openModificationModal}
            className="action-button"
            sx={(theme) => ({
              borderColor: theme.colors.orange[6],
              color: theme.colors.orange[6],
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: `${theme.colors.orange[6]} !important`,
                color: "white !important",
              },
            })}
          >
            Request Modification
          </Button>
        </Group>
      </Card>

      <div className="pcc-form-content">
        <FormSection title="Application Overview" className="pcc-form-section">
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
              <FormField label="Status:" value={status} />
            </Grid.Col>
            <Grid.Col span={12} md={4}>
              <FormField label="Decision Status:" value={decision_status} />
            </Grid.Col>
            <Grid.Col span={12}>
              <FormField label="Comments:" value={app_comments} />
            </Grid.Col>
          </Grid>
        </FormSection>

        <FormSection title="Key Dates">
          <div className="key-dates-container">
            <div className="key-dates-grid">
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

              <div className="key-date-card">
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
              </div>

              <div className="key-date-card">
                <div className="key-date-title">Final Decision Date</div>
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

        <FormSection title="Inventors">
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
                      Inventor {index + 1}
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

      {/* Forward to Director Modal - Improved UI */}
      <Modal
        opened={forwardModalOpen}
        onClose={() => setForwardModalOpen(false)}
        title={
          <Text style={{ fontSize: "22px", fontWeight: 600, color: "#1a1b1e" }}>
            Forward to Director
          </Text>
        }
        size="lg"
        padding="xl"
        radius="md"
        overlayProps={{
          opacity: 0.55,
          blur: 3,
        }}
        centered
      >
        <Box sx={{ padding: "0 10px" }}>
          {actionError && (
            <Alert color="red" title="Error" mb="xl" radius="md">
              {actionError}
            </Alert>
          )}

          <Select
            data={attorneys}
            label={
              <Text weight={500} mb={5}>
                Select Attorney <span style={{ color: "red" }}>*</span>
              </Text>
            }
            placeholder="Choose an attorney"
            value={selectedAttorneyId}
            onChange={setSelectedAttorneyId}
            required
            mb="xl"
            size="md"
            radius="md"
            error={
              !selectedAttorneyId && actionLoading
                ? "Attorney selection is required"
                : null
            }
            withAsterisk={false}
          />

          <Textarea
            label={
              <Text weight={500} mb={5}>
                Comments for Director <span style={{ color: "red" }}>*</span>
              </Text>
            }
            placeholder="Add detailed comments for the director about this application"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            minRows={4}
            maxRows={6}
            mb="xl"
            size="md"
            radius="md"
            error={commentError}
            required
            withAsterisk={false}
          />

          <Text size="sm" color="dimmed" mb="xl" italic>
            Please provide detailed instructions or notes for the director to
            review this application.
          </Text>

          <Group position="right" mt="xl" spacing="md">
            <Button
              variant="outline"
              size="md"
              radius="md"
              onClick={() => {
                setForwardModalOpen(false);
                setActionError(null);
                setCommentError(null);
              }}
              sx={(theme) => ({
                borderColor: theme.colors.gray[5],
                color: theme.colors.gray[7],
                "&:hover": {
                  backgroundColor: theme.colors.gray[1],
                },
              })}
            >
              Cancel
            </Button>
            <Button
              color="green"
              size="md"
              radius="md"
              onClick={handleForwardToDirector}
              loading={actionLoading}
              sx={(theme) => ({
                backgroundColor: theme.colors.green[6],
                "&:hover": {
                  backgroundColor: theme.colors.green[7],
                },
              })}
            >
              Forward to Director
            </Button>
          </Group>
        </Box>
      </Modal>

      {/* Request Modification Modal - Improved UI */}
      <Modal
        opened={modificationModalOpen}
        onClose={() => setModificationModalOpen(false)}
        title={
          <Text style={{ fontSize: "22px", fontWeight: 600, color: "#1a1b1e" }}>
            Request Modification
          </Text>
        }
        size="lg"
        padding="xl"
        radius="md"
        overlayProps={{
          opacity: 0.55,
          blur: 3,
        }}
        centered
      >
        <Box sx={{ padding: "0 10px" }}>
          {actionError && (
            <Alert color="red" title="Error" mb="xl" radius="md">
              {actionError}
            </Alert>
          )}

          <Text size="md" mb="xl" weight={500}>
            Please specify what aspects of the application need to be modified
            by the applicant.
          </Text>

          <Textarea
            label={
              <Text weight={500} mb={5}>
                Modification Comments <span style={{ color: "red" }}>*</span>
              </Text>
            }
            placeholder="Provide detailed instructions about what needs to be modified in the application"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            minRows={5}
            maxRows={8}
            mb="xl"
            size="md"
            radius="md"
            error={commentError}
            required
            withAsterisk={false}
          />

          <Text size="sm" color="dimmed" mb="xl" italic>
            Be specific about what information is incorrect, missing, or needs
            clarification. These comments will be sent directly to the
            applicant.
          </Text>

          <Group position="right" mt="xl" spacing="md">
            <Button
              variant="outline"
              size="md"
              radius="md"
              onClick={() => {
                setModificationModalOpen(false);
                setActionError(null);
                setCommentError(null);
              }}
              sx={(theme) => ({
                borderColor: theme.colors.gray[5],
                color: theme.colors.gray[7],
                "&:hover": {
                  backgroundColor: theme.colors.gray[1],
                },
              })}
            >
              Cancel
            </Button>
            <Button
              color="orange"
              size="md"
              radius="md"
              onClick={handleRequestModification}
              loading={actionLoading}
              sx={(theme) => ({
                backgroundColor: theme.colors.orange[6],
                "&:hover": {
                  backgroundColor: theme.colors.orange[7],
                },
              })}
            >
              Request Modification
            </Button>
          </Group>
        </Box>
      </Modal>
    </Container>
  );
}

ViewNewApplication.propTypes = {
  applicationId: PropTypes.string.isRequired,
  handleBackToList: PropTypes.func.isRequired,
};

export default ViewNewApplication;
