import { TextInput, Button, Paper, Flex, Title } from "@mantine/core";
import axios from "axios";
import { useState } from "react";
import NavCom from "../NavCom";
import Changenav from "./changenav";
import CustomBreadcrumbs from "../../../../components/Breadcrumbs";
import { compounderRoute } from "../../../../routes/health_center";

export default function Addpath() {
  const [pathologist, setPathologist] = useState("");
  const [pathologist_specialization, setSpecialization] = useState("");
  const [pathologist_phone, setPhone] = useState("");

  const handleAdd = async () => {
    if (pathologist === "") {
      alert("Enter Valid Doctor's Name");
      return false;
    }
    if (pathologist_specialization === "") {
      alert("Enter Valid Doctor's Specialization");
      return false;
    }
    if (pathologist_phone === "") {
      alert("Enter Valid Doctor's Phone Number");
      return false;
    }
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        compounderRoute,
        {
          new_pathologist: pathologist,
          specialization: pathologist_specialization,
          phone: pathologist_phone,
          add_pathologist: 1,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      console.log(response);
      alert("Pathologist added successfully");
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
            textAlign: "center",
            color: "#15abff",
            marginBottom: "20px",
          }}
        >
          Add Pathologist
        </Title>
        <Flex display="flex" flexDirection="row" wrap="wrap" gap="md">
          <TextInput
            label="Pathologist Name"
            placeholder="Pathologist Name"
            value={pathologist}
            onChange={(e) => {
              setPathologist(e.target.value);
            }}
          />
          <TextInput
            label="Specialization"
            placeholder="Specialization"
            value={pathologist_specialization}
            onChange={(e) => {
              setSpecialization(e.target.value);
            }}
          />
          <TextInput
            label="Phone Number"
            placeholder="Phone"
            value={pathologist_phone}
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
            Add Pathologist
          </Button>
        </Flex>
      </Paper>
    </>
  );
}
