import { Button, Flex, Paper, TextInput, Title } from "@mantine/core";
import { useState } from "react";
import axios from "axios";
import NavCom from "../NavCom";
import Changenav from "./changenav";
import CustomBreadcrumbs from "../../../../components/Breadcrumbs";
import { compounderRoute } from "../../../../routes/health_center";

export default function Adddoctor() {
  const [doctor, setDoctor] = useState("");
  const [doctor_specialization, setSpecialization] = useState("");
  const [doctor_phone, setPhone] = useState("");

  const handleAdd = async () => {
    if (doctor === "") {
      alert("Enter Valid Doctor's Name");
      return false;
    }
    if (doctor_specialization === "") {
      alert("Enter Valid Doctor's Specialization");
      return false;
    }
    if (doctor_phone === "") {
      alert("Enter Valid Doctor's Phone Number");
      return false;
    }
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        compounderRoute,
        {
          new_doctor: doctor,
          specialization: doctor_specialization,
          phone: doctor_phone,
          add_doctor: 1,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      console.log(response);
      alert("Doctor added successfully");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <CustomBreadcrumbs />
      <NavCom />
      <Changenav />
      <br />
      <Paper shadow="xl" p="xl" withBorder>
        <Title
          order={3}
          style={{
            color: "#15ABFF",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Add Doctor
        </Title>

        <Flex display="flex" flexDirection="row" wrap="wrap" gap="md">
          <TextInput
            label="Doctor Name"
            placeholder="Doctor Name"
            value={doctor}
            onChange={(e) => {
              setDoctor(e.target.value);
            }}
          />
          <TextInput
            label="Specialization"
            placeholder="Specialization"
            value={doctor_specialization}
            onChange={(e) => {
              setSpecialization(e.target.value);
            }}
          />
          <TextInput
            label="Phone Number"
            placeholder="Phone"
            value={doctor_phone}
            onChange={(e) => {
              setPhone(e.target.value);
            }}
          />
          <Button
            mt="lg"
            onClick={handleAdd}
            style={{ backgroundColor: "#15abff" }}
          >
            {" "}
            Add Doctor
          </Button>
        </Flex>
      </Paper>
    </>
  );
}
