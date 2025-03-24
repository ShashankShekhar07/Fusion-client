import React, { useState } from "react";
import {
  TextInput,
  NumberInput,
  Button,
  Container,
  Title,
  Paper,
  FileInput,
  Textarea,
  Select,
  Group,
} from "@mantine/core";
import { useSelector } from "react-redux";
import { DateInput } from "@mantine/dates";
import axios from "axios";
import { FunnelSimple } from "@phosphor-icons/react";
import { registrationRequestRoute } from "../routes";

function Registration() {
  const roll_no = useSelector((state) => state.user.roll_no);
  const [txnNo, setTxnNo] = useState("");
  const [amount, setAmount] = useState(0);
  const [file, setFile] = useState(null);
  const [paymentDate, setPaymentDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [error, setError] = useState(null);
  const [messOption, setMessOption] = useState("");
  const [remark, setRemark] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Authentication token not found.");
      return;
    }

    const formattedPaymentDate = paymentDate
      ? paymentDate.toISOString().split("T")[0]
      : "";
    const formattedStartDate = startDate
      ? startDate.toISOString().split("T")[0]
      : "";

    const formData = new FormData();
    formData.append("Txn_no", txnNo);
    formData.append("amount", amount);
    formData.append("img", file);
    formData.append("payment_date", formattedPaymentDate);
    formData.append("start_date", formattedStartDate);
    // formData.append("student_id", studentId);
    formData.append("mess_option", messOption);
    formData.append("student_id", roll_no);
    formData.append("registration_remark", remark);

    try {
      const response = await axios.post(registrationRequestRoute, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        },
      });

      if (response.status === 200) {
        console.log("Form submitted successfully", response.data);
        setError(null);
      }
    } catch (errors) {
      setError("Error submitting the form. Please try again.");
      console.error("Error:", errors.response?.data || errors.message);
    }
  };

  return (
    <Container
      size="lg"
      style={{ maxWidth: "800px", width: "570px", marginTop: "25px" }}
    >
      <Paper
        shadow="md"
        radius="md"
        p="xl"
        withBorder
        style={{ width: "100%", padding: "30px" }}
      >
        <Title order={2} align="center" mb="lg" style={{ color: "#1c7ed6" }}>
          Registration Form
        </Title>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <Group grow mb="lg">
            <Select
              label="Select Mess"
              placeholder="Choose Mess"
              value={messOption}
              onChange={(value) => setMessOption(value)}
              data={[
                { value: "mess1", label: "Mess 1" },
                { value: "mess2", label: "Mess 2" },
              ]}
              radius="md"
              size="md"
              icon={<FunnelSimple size={18} />}
              required
            />
          </Group>

          <TextInput
            label="Transaction No."
            placeholder="Transaction No."
            value={txnNo}
            onChange={(e) => setTxnNo(e.target.value)}
            required
            radius="md"
            size="md"
            mt="xl"
            mb="md"
          />

          <NumberInput
            label="Amount"
            placeholder="Balance Amount"
            value={amount}
            onChange={setAmount}
            required
            radius="md"
            size="md"
            min={0}
            step={100}
            mb="lg"
          />

          <FileInput
            label="Image"
            placeholder="Choose file"
            value={file}
            onChange={setFile}
            accept="image/*"
            required
            size="md"
            mb="lg"
          />

          <DateInput
            label="Payment Date"
            placeholder="Select date"
            value={paymentDate}
            onChange={setPaymentDate}
            required
            radius="md"
            size="md"
            mb="lg"
            valueFormat="MMMM D, YYYY"
          />

          <DateInput
            label="Start Date"
            placeholder="Select date"
            value={startDate}
            onChange={setStartDate}
            required
            radius="md"
            size="md"
            mb="lg"
            valueFormat="MMMM D, YYYY"
          />

          <Textarea
            label="Remark"
            placeholder="Add any remarks"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            radius="md"
            size="md"
            mb="lg"
          />

          <Button fullWidth size="md" radius="md" color="blue" type="submit">
            Submit
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default Registration;
