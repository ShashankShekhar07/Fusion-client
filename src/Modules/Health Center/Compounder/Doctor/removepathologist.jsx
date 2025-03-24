import { useEffect, useState } from "react";
import { Button, Paper, Flex, Title } from "@mantine/core";
import axios from "axios";
import NavCom from "../NavCom";
import Changenav from "./changenav";
import CustomBreadcrumbs from "../../../../components/Breadcrumbs";
import { compounderRoute } from "../../../../routes/health_center";

export default function Removepath() {
  // eslint-disable-next-line no-unused-vars
  const [doctorName, setDoctorName] = useState("");
  const [pathologists, setPathologists] = useState([]);

  const fetchPathologists = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        compounderRoute,
        { get_pathologists: 1 },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      console.log(response);
      setPathologists(response.data.pathologists);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPathologists();
  }, []);

  const handelRemove = async () => {
    if (doctorName === "") {
      alert("select doctor");
    }
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        compounderRoute,
        {
          pathologist_active: doctorName,
          remove_pathologist: 1,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      console.log(response);
      alert("Pathologist Removed Successfully");
    } catch (err) {
      console.log(err);
    }
  };

  const selectStyle = {
    padding: "10px",
    width: "30%",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  };

  return (
    <div>
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
          Remove Pathologist
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
            {pathologists.map((pathologist) => (
              <option key={pathologist.id} value={pathologist.id}>
                {pathologist.pathologist_name}
              </option>
            ))}
          </select>
          <Button style={{ backgroundColor: "#15abff" }} onClick={handelRemove}>
            Remove
          </Button>
        </Flex>
      </Paper>
    </div>
  );
}
