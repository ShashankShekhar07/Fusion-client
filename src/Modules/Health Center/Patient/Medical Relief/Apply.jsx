import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  Button,
  FileInput,
  Textarea,
  Select,
  Paper,
  Flex,
  Title,
} from "@mantine/core";
import Navigation from "../Navigation";
import MedicalNavBar from "./medicalPath";
import CustomBreadcrumbs from "../../../../components/Breadcrumbs";
import { studentRoute } from "../../../../routes/health_center";

function Apply() {
  const [send_file, setFile] = useState(null);
  const [recipient, setRecipient] = useState("Compounder(Pkumar)");
  const [desc, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [isSubmitting, setSubmitting] = useState(false);
  const role = useSelector((state) => state.user.role);
  const validate = () => {
    const newErrors = {};
    if (!desc.trim()) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    const formData = new FormData();
    if (send_file) formData.append("file", send_file);
    formData.append("recipient", recipient);
    formData.append("description", desc);
    formData.append("medical_relief_submit", 1);

    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        studentRoute,
        {
          description: desc,
          designation: "pkumar",
          selected_role: role,
          // file: send_file,
          medical_relief_submit: 1,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      console.log(response.data);
      alert("File forwarded successfully");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <CustomBreadcrumbs />
      <Navigation />
      <MedicalNavBar />
      <br />
      <Paper shadow="xl" p="xl" withBorder>
        <Title order={3} style={{ textAlign: "center", color: "#15abff" }}>
          Apply for Medical Relief
        </Title>
        <form onSubmit={handleSubmit}>
          <Flex gap="xl" wrap="wrap">
            <FileInput
              label="Upload file"
              placeholder="Choose file"
              value={send_file}
              onChange={(e) => {
                setFile(e.target.files[0]);
              }}
              error={errors.file}
            />

            <Select
              label="Send to"
              data={[{ value: "Compounder", label: "Compounder(Pkumar)" }]}
              value={recipient}
              onChange={setRecipient}
              error={errors.recipient}
              placeholder="Select Recipient"
            />
          </Flex>
          <Flex display="flex" justify="space-between">
            <Textarea
              label="Description"
              value={desc}
              onChange={(e) => setDescription(e.target.value)}
              error={errors.description}
              style={{ width: "80%", margin: "0 0.5rem 0 0" }}
              autosize
              placeholder="Enter description"
            />

            <Button
              type="submit"
              variant="filled"
              color="#15abff"
              style={{ padding: "0.5rem 2rem", marginTop: "24px" }}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </Flex>
        </form>
      </Paper>
    </>
  );
}

export default Apply;
