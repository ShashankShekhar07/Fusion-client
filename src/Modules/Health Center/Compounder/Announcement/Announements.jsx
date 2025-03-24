import { Button, Paper, Textarea, Title } from "@mantine/core";
import axios from "axios";
import { useState } from "react";
import NavCom from "../NavCom";
import { compounderRoute } from "../../../../routes/health_center";
import AnnounceNavBar from "./announPath";
import CustomBreadcrumbs from "../../../../components/Breadcrumbs";

function CompAnnounements() {
  const [announce, setAnnounce] = useState("");

  const make_announcement = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        compounderRoute,
        { announcement: announce, comp_announce: 1 },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      console.log(response);
      if (response.data.status === 1) {
        alert("announcement done");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handletextAnnounc = (event) => {
    setAnnounce(event.target.value);
  };

  return (
    <>
      <CustomBreadcrumbs />
      <NavCom />
      <AnnounceNavBar style={{ display: "flex" }} />
      <br />

      <Paper shadow="xl" p="xl" withBorder>
        <Title
          order={3}
          style={{
            color: "#15abff",
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          Make a new Announcement
        </Title>

        <div>
          <Textarea
            value={announce}
            onChange={handletextAnnounc}
            label="Announcement Details"
            placeholder="What is the Announcement?"
          />
        </div>

        <br />
        <Button
          style={{
            backgroundColor: "#15abff",
            color: "white",
            padding: "10px 30px",
            border: "none",
            margin: "auto",
            display: "block",
          }}
          onClick={make_announcement}
        >
          Publish
        </Button>
      </Paper>
    </>
  );
}

export default CompAnnounements;
