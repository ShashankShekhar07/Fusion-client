import { useEffect, useState } from "react";
import { Button, Paper, Flex, Title } from "@mantine/core";
import axios from "axios";
import NavCom from "../NavCom";
import Changenav from "./changenav";
import CustomBreadcrumbs from "../../../../components/Breadcrumbs";
import { compounderRoute } from "../../../../routes/health_center";

export default function Removedoctor() {
  const [doctors, setDoctor] = useState([]);
  const [doctorName, setDoctorName] = useState("");

  const fetchDoctors = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        compounderRoute,
        { get_doctors: 1 },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      console.log(response);
      setDoctor(response.data.doctors);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);
  const selectStyle = {
    padding: "10px",
    width: "30%",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  };
  const handelRemove = async () => {
    if (doctorName === "") {
      alert("select doctor");
    }
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        compounderRoute,
        {
          doctor_active: doctorName,
          remove_doctor: 1,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      console.log(response);
      alert("Doctor Removed Successfully");
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
          align="center"
          order={3}
          style={{ color: "#15abff", marginBottom: "20px" }}
        >
          Remove Doctor
        </Title>
        <Flex display="flex" justify="space-evenly" wrap="wrap">
          <select
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
            style={selectStyle}
          >
            <option value="" disabled>
              Select Doctor
            </option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.doctor_name}
              </option>
            ))}
          </select>
          <Button style={{ backgroundColor: "#15abff" }} onClick={handelRemove}>
            Remove
          </Button>
        </Flex>
      </Paper>
    </>
  );
}
