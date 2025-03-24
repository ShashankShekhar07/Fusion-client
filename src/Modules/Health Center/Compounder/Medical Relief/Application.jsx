import React, { useEffect, useState } from "react";
import { Button, Paper, Textarea, Title } from "@mantine/core";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { compounderRoute } from "../../../../routes/health_center";
import NavCom from "../NavCom";
import CustomBreadcrumbs from "../../../../components/Breadcrumbs";

function Application() {
  const [application, setApplication] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  const get_application = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        compounderRoute,
        { aid: id, get_application: 1 },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      console.log(response.data);
      setApplication(response.data.inbox);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    get_application();
  }, []);

  const handel_forward = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        compounderRoute,
        { file_id: id, compounder_forward: 1 },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      console.log(response.data);
      alert("Application forwarded");
      navigate("/compounder/medical-relief/inbox");
    } catch (err) {
      console.log(err);
    }
  };

  const handel_reject = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        compounderRoute,
        {
          file_id: id,
          rejected_user: application.uploader,
          compounder_reject: 1,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      console.log(response.data);
      alert("Application rejected");
      navigate("/healthcenter/compounder/medical-relief/inbox");
    } catch (err) {
      console.log(err);
    }
  };

  if (!application) {
    return <p>No Application Available!</p>;
  }

  return (
    <>
      <CustomBreadcrumbs />
      <NavCom />
      <br />
      <Paper shadow="xl" p="xl" withBorder>
        <div style={{ margin: "2rem" }}>
          <Title order={2} style={{ marginBottom: "1rem" }}>
            {application.uploader}'s Medical relief application
          </Title>

          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", gap: "1rem" }}>
              <Textarea
                style={{ flex: 1, maxWidth: "40%" }}
                readOnly
                label="Date"
                value={application.upload_date}
                minRows={1}
              />
              <Textarea
                style={{ flex: 1 }}
                readOnly
                label="Description"
                value={application.desc}
                minRows={6}
              />
            </div>
            <br />
            <div style={{ display: "flex", gap: "1rem" }}>
              <Button color="green">View File</Button>
              <Button color="teal" onClick={handel_forward}>
                Forward
              </Button>
              <Button color="red" onClick={handel_reject}>
                Reject
              </Button>
            </div>
          </div>
        </div>
      </Paper>
    </>
  );
}

export default Application;
