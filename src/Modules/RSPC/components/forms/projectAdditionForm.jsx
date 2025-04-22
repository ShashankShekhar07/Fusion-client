/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import {
  Button,
  TextInput,
  Select,
  Radio,
  NumberInput,
  Textarea,
  Paper,
  Title,
  Grid,
  Text,
  Alert,
  Divider,
} from "@mantine/core";
import { User, ThumbsUp, ThumbsDown, Trash } from "@phosphor-icons/react";
import { useForm } from "@mantine/form";
import axios from "axios";
import ConfirmationModal from "../../helpers/confirmationModal";
import classes from "../../styles/formStyle.module.css";

import {
  fetchProfIDsRoute,
  projectFormSubmissionRoute,
} from "../../../../routes/RSPCRoutes";

function ProjectAdditionForm({ setActiveTab }) {
  const [successAlertVisible, setSuccessAlertVisible] = useState(false);
  const [failureAlertVisible, setFailureAlertVisible] = useState(false);
  const [coPIs, setCoPIs] = useState([]);
  const [showCoPISection, setShowCoPISection] = useState(false);
  const [totalBudget, setTotalBudget] = useState(0);
  const [confirmationModalOpened, setConfirmationModalOpened] = useState(false);

  const [profIDs, setProfIDs] = useState([]);
  useEffect(() => {
    const storedProfIDs = localStorage.getItem("profIDs");
    if (storedProfIDs) {
      try {
        const parsedProfIDs = JSON.parse(storedProfIDs);
        if (Array.isArray(parsedProfIDs) && parsedProfIDs.length > 0) {
          setProfIDs(parsedProfIDs); // Use stored data if valid
          return;
        }
      } catch (error) {
        console.error("Error parsing stored profIDs:", error);
      }
    }

    const fetchProfIDs = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return console.error("No authentication token found!");
      try {
        const response = await axios.get(fetchProfIDsRoute, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        const profIDsArray = response.data.profIDs;
        if (Array.isArray(profIDsArray) && profIDsArray.length > 0) {
          localStorage.setItem("profIDs", JSON.stringify(profIDsArray)); // Store only array
          setProfIDs(profIDsArray);
        }
      } catch (error) {
        console.error("Error during Axios GET:", error);
      }
    };
    fetchProfIDs();
  }, []);

  const form = useForm({
    initialValues: {
      name: "",
      pi_id: "",
      access: "",
      type: "",
      dept: "",
      category: "",
      sponsored_agency: "",
      scheme: "",
      description: "",
      duration: 0,
      submission_date: new Date().toISOString().split("T")[0],
      budget: [],
      overhead: "",
      sanction_date: "",
      sanctioned_amount: "",
      start_date: "",
      initial_amount: "",
    },
    validate: {
      name: (value) => (value ? null : "Project title is required"),
      pi_id: (value) =>
        value ? null : "Fusion ID of the project investigator is required",
      access: (value) =>
        value ? null : "Project access specifier is required",
      type: (value) => (value ? null : "Project type is required"),
      dept: (value) => (value ? null : "Department is required"),
      category: (value) => (value ? null : "Project category is required"),
      sponsored_agency: (value) =>
        value ? null : "Project sponsor agency is required",
      duration: (value) =>
        value > 0 ? null : "Project duration must be greater than 0",
    },
  });

  const handleAddCoPI = () => {
    setShowCoPISection(true); // Make Co-PI section visible if hidden
    setCoPIs([
      ...coPIs,
      { type: "Internal", copi_id: "", affiliation: "IIITDMJ" },
    ]);
  };

  const handleCoPIChange = (index, field, value) => {
    const updatedCoPIs = coPIs.map((coPI, i) => {
      if (i === index) {
        return { ...coPI, [field]: value };
      }
      return coPI;
    });
    setCoPIs(updatedCoPIs);
  };

  const handleRemoveCoPI = (index) => {
    const updatedCoPIs = coPIs.filter((_, i) => i !== index);
    setCoPIs(updatedCoPIs);

    // Automatically hide Co-PI section when all Co-PIs are removed
    if (updatedCoPIs.length === 0) {
      setShowCoPISection(false);
    }
  };

  const initializeBudget = (months) => {
    const years = Math.ceil(months / 12);
    form.setFieldValue("duration", months);

    const newBudget = Array.from({ length: years }, () => ({
      manpower: "",
      travel: "",
      contingency: "",
      consumables: "",
      equipments: "",
    }));
    form.setFieldValue("overhead", "");
    form.setFieldValue("budget", newBudget);
  };

  const calculateGrandTotal = (budget, overhead) => {
    if (!budget || !Array.isArray(budget)) return 0;
    const total = budget.reduce((acc, year) => {
      const recurringTotal =
        (year.manpower || 0) +
        (year.travel || 0) +
        (year.contingency || 0) +
        (year.consumables || 0);
      const nonRecurringTotal = year.equipments || 0;
      return acc + recurringTotal + nonRecurringTotal;
    }, 0);
    const grandTotal = total + (overhead || 0);
    setTotalBudget(grandTotal); // Store in state for backend submission
    return grandTotal; // Display in input field
  };
  useEffect(() => {
    calculateGrandTotal(form.values.budget, form.values.overhead);
  }, [form.values.budget, form.values.overhead]);

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("authToken");
    if (!token) return console.error("No authentication token found!");

    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("pi_id", values.pi_id);
      formData.append("coPIs", JSON.stringify(coPIs));
      formData.append("access", values.access);
      formData.append("type", values.type);
      formData.append("dept", values.dept);
      formData.append("category", values.category);
      formData.append("sponsored_agency", values.sponsored_agency);
      formData.append("scheme", values.scheme);
      formData.append("description", values.description);
      formData.append("duration", values.duration);
      formData.append("submission_date", values.submission_date);
      formData.append("total_budget", totalBudget);
      formData.append("budget", JSON.stringify(values.budget));
      formData.append("overhead", values.overhead);
      formData.append("sanction_date", values.sanction_date);
      formData.append("sanctioned_amount", values.sanctioned_amount);
      formData.append("status", "Submitted");
      formData.forEach((value, key) => {
        console.log(key, value);
      });
      const response = await axios.post(projectFormSubmissionRoute, formData, {
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
  const handleFormSubmit = () => {
    if (form.validate().hasErrors) return;
    setConfirmationModalOpened(true);
  };

  return (
    <>
      <form onSubmit={form.onSubmit(handleFormSubmit)}>
        <Paper padding="lg" shadow="s" className={classes.formContainer}>
          <Title order={2} className={classes.formTitle}>
            Add New Project Proposal
          </Title>

          <Grid gutter="xl">
            <Grid.Col span={6}>
              <Text className={classes.fieldLabel}>
                Project Title <span style={{ color: "red" }}>*</span>
              </Text>
              <TextInput
                placeholder="Enter name of project"
                {...form.getInputProps("name")}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <Text className={classes.fieldLabel}>
                Project Investigator <span style={{ color: "red" }}>*</span>
              </Text>
              <div
                style={{
                  display: "flex",
                  alignItems: "space-between",
                  gap: "10px",
                  width: "100%",
                }}
              >
                <Select
                  placeholder="Choose Fusion username of professor"
                  {...form.getInputProps("pi_id")}
                  data={profIDs}
                  icon={<User />}
                  style={{ flex: 1 }}
                  searchable
                />

                <Button
                  onClick={handleAddCoPI}
                  color="cyan"
                  variant="outline"
                  size="xs"
                  style={{
                    borderRadius: "8px",
                    textAlign: "center",
                    flexShrink: 0,
                  }}
                >
                  Add Co-PI
                </Button>
              </div>
            </Grid.Col>

            {showCoPISection && (
              <Grid.Col span={12}>
                <Text
                  className={classes.fieldLabel}
                  style={{ textAlign: "center" }}
                >
                  Co-Principal Investigators
                </Text>
                {coPIs.map((coPI, index) => (
                  <Grid key={index} gutter="sm" align="center">
                    <Grid.Col span={3}>
                      <Text className={classes.fieldLabel}>
                        Co-PI Type <span style={{ color: "red" }}>*</span>
                      </Text>
                      <Select
                        placeholder="Choose whether Co-PI is Internal or External"
                        value={coPI.type || "Internal"}
                        onChange={(value) =>
                          handleCoPIChange(index, "type", value)
                        }
                        data={["Internal", "External"]}
                        icon={<User />}
                      />
                    </Grid.Col>

                    {coPI.type === "Internal" ? (
                      <Grid.Col span={8}>
                        <Text className={classes.fieldLabel}>
                          {`Identity of Co-PI ${index + 1} `}
                          <span style={{ color: "red" }}>*</span>
                        </Text>
                        <Select
                          placeholder="Choose Fusion username of professor"
                          value={coPI.copi_id}
                          onChange={(value) =>
                            handleCoPIChange(index, "copi_id", value)
                          }
                          required
                          data={profIDs}
                          icon={<User />}
                          searchable
                        />
                      </Grid.Col>
                    ) : (
                      <>
                        <Grid.Col span={4}>
                          <Text className={classes.fieldLabel}>
                            {`Identity of Co-PI ${index + 1} `}
                            <span style={{ color: "red" }}>*</span>
                          </Text>
                          <TextInput
                            placeholder="Enter name of external Co-PI"
                            value={coPI.copi_id}
                            required
                            onChange={(e) =>
                              handleCoPIChange(index, "copi_id", e.target.value)
                            }
                          />
                        </Grid.Col>

                        <Grid.Col span={4}>
                          <Text className={classes.fieldLabel}>
                            External Co-PI Affiliation
                          </Text>
                          <TextInput
                            placeholder="Enter affiliation of external Co-PI"
                            value={coPI.affiliation}
                            onChange={(e) =>
                              handleCoPIChange(
                                index,
                                "affiliation",
                                e.target.value,
                              )
                            }
                          />
                        </Grid.Col>
                      </>
                    )}
                    <Grid.Col span={1}>
                      <Text className={classes.fieldLabel}>Remove</Text>
                      <Button
                        onClick={() => handleRemoveCoPI(index)}
                        color="red"
                        variant="outline"
                        size="xs"
                        style={{ width: "100%", borderRadius: "8px" }}
                      >
                        {" "}
                        <Trash />{" "}
                      </Button>
                    </Grid.Col>
                  </Grid>
                ))}
              </Grid.Col>
            )}

            <Grid.Col span={6}>
              <Text className={classes.fieldLabel}>
                Project To Be Operated By{" "}
                <span style={{ color: "red" }}>*</span>
              </Text>
              <Radio.Group {...form.getInputProps("access")}>
                <Radio value="Co" label="Only PI" />
                <Radio value="noCo" label="Either PI or Co-PI(s)" />
              </Radio.Group>
            </Grid.Col>

            {/* -------------- */}
            <Grid.Col span={12}>
              <Divider my="lg" label="" labelPosition="center" size="md" />
            </Grid.Col>

            <Grid.Col span={6}>
              <Text className={classes.fieldLabel}>
                Project Type <span style={{ color: "red" }}>*</span>
              </Text>
              <Radio.Group {...form.getInputProps("type")}>
                <Radio value="Research" label="Research" />
                <Radio value="Consultancy" label="Consultancy" />
              </Radio.Group>
            </Grid.Col>

            <Grid.Col span={6}>
              <Text className={classes.fieldLabel}>
                Select Department <span style={{ color: "red" }}>*</span>
              </Text>
              <Select
                placeholder="Choose academic department overlooking the project"
                {...form.getInputProps("dept")}
                data={[
                  "CSE",
                  "ECE",
                  "ME",
                  "SM",
                  "Design",
                  "NS",
                  "Liberal Arts",
                  "None Of The Above",
                ]}
                icon={<User />}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <Text className={classes.fieldLabel}>
                Category <span style={{ color: "red" }}>*</span>
              </Text>
              <Radio.Group {...form.getInputProps("category")}>
                <Radio value="Government" label="Government" />
                <Radio value="Private" label="Private Entity" />
                <Radio value="IIITDMJ" label="Institute" />
                <Radio value="Other" label="Other" />
              </Radio.Group>
            </Grid.Col>

            <Grid.Col span={6}>
              <Text className={classes.fieldLabel}>
                Project Sponsor Agency <span style={{ color: "red" }}>*</span>
              </Text>
              <TextInput
                placeholder="Enter name of sponsoring agency"
                {...form.getInputProps("sponsored_agency")}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <Text className={classes.fieldLabel}>Project Scheme</Text>
              <TextInput
                placeholder="Enter name of scheme under which project is received"
                {...form.getInputProps("scheme")}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <Text className={classes.fieldLabel}>Project Abstract</Text>
              <Textarea
                placeholder="Enter detailed description of the project for future record-keeping"
                {...form.getInputProps("description")}
              />
            </Grid.Col>

            {/* -------------- */}
            <Grid.Col span={12}>
              <Divider my="lg" label="" labelPosition="center" size="md" />
            </Grid.Col>

            <Grid.Col span={6}>
              <Text className={classes.fieldLabel}>
                Project Duration (in months){" "}
                <span style={{ color: "red" }}>*</span>
              </Text>
              <NumberInput
                placeholder="Enter number of months to complete the project"
                {...form.getInputProps("duration")}
                onChange={(value) => initializeBudget(value)}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <Text className={classes.fieldLabel}>
                Proposal Submission Date <span style={{ color: "red" }}>*</span>
              </Text>
              <input
                type="date"
                required
                {...form.getInputProps("submission_date")}
                className={classes.dateInput}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <Text className={classes.fieldLabel}>
                Project Budget (in ₹) <span style={{ color: "red" }}>*</span>
              </Text>
              <NumberInput
                value={totalBudget}
                readOnly
                styles={{
                  input: {
                    backgroundColor: "#f0f0f0", // Light grey background
                    cursor: "not-allowed", // Show forbidden cursor
                    textAlign: "center",
                  },
                }}
              />
            </Grid.Col>

            {form.values.duration && (
              <Grid.Col key={form.values.duration} span={12}>
                <Text className={classes.fieldLabel}> Recurring Expenses </Text>
                {Array.from(
                  { length: Math.ceil((form.values.duration || 0) / 12) },
                  (_, year) => (
                    <React.Fragment key={year}>
                      <Text style={{ textAlign: "center" }}>
                        {" "}
                        Year {year + 1} Budget{" "}
                      </Text>
                      <Grid gutter="xl" my="lg">
                        <Grid.Col span={3}>
                          <NumberInput
                            placeholder="Manpower (in ₹)"
                            min={0}
                            {...form.getInputProps(`budget.${year}.manpower`)}
                          />
                        </Grid.Col>

                        <Grid.Col span={3}>
                          <NumberInput
                            placeholder="Travel (in ₹)"
                            min={0}
                            {...form.getInputProps(`budget.${year}.travel`)}
                          />
                        </Grid.Col>

                        <Grid.Col span={3}>
                          <NumberInput
                            placeholder="Contingency (in ₹)"
                            min={0}
                            {...form.getInputProps(
                              `budget.${year}.contingency`,
                            )}
                          />
                        </Grid.Col>

                        <Grid.Col span={3}>
                          <NumberInput
                            placeholder="Consumables (in ₹)"
                            min={0}
                            {...form.getInputProps(
                              `budget.${year}.consumables`,
                            )}
                          />
                        </Grid.Col>
                      </Grid>
                    </React.Fragment>
                  ),
                )}

                <Text className={classes.fieldLabel}>
                  {" "}
                  Non-Recurring Expenses{" "}
                </Text>
                {Array.from(
                  { length: Math.ceil((form.values.duration || 0) / 12) },
                  (_, year) => (
                    <React.Fragment key={year}>
                      <Text style={{ textAlign: "center" }}>
                        {" "}
                        Year {year + 1} Budget{" "}
                      </Text>
                      <Grid gutter="xl" my="lg">
                        <Grid.Col span={12}>
                          <NumberInput
                            placeholder="Equipments (in ₹)"
                            min={0}
                            {...form.getInputProps(`budget.${year}.equipments`)}
                          />
                        </Grid.Col>
                      </Grid>
                    </React.Fragment>
                  ),
                )}

                <Text className={classes.fieldLabel}>Overhead</Text>
                <Grid gutter="xl" mb="16px">
                  <Grid.Col span={12}>
                    <NumberInput
                      placeholder="Overhead Costs (in ₹)"
                      min={0}
                      {...form.getInputProps("overhead")}
                    />
                  </Grid.Col>
                </Grid>
              </Grid.Col>
            )}
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
        </Paper>
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
                ? "Form Submission Successful"
                : "Form Submission Failed"
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
              ? "The form has been successfully submitted! Your request will be processed soon!"
              : "The form details could not be saved! Please verify the filled details and submit the form again."}
          </Alert>
        </div>
      )}
    </>
  );
}

ProjectAdditionForm.propTypes = {
  setActiveTab: PropTypes.func.isRequired,
};

export default ProjectAdditionForm;
