import React, { useEffect, useState } from "react";
import { Paper, Table, Title } from "@mantine/core";
import axios from "axios";
import { studentRoute } from "../../../../routes/health_center";
import NavPatient from "../Navigation";
import CustomBreadcrumbs from "../../../../components/Breadcrumbs";

function Announcement() {
  const [test, StateTest] = useState({ announcements: [] });

  useEffect(() => {
    const get_announcement = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await axios.post(
          studentRoute,
          { get_annoucements: 1 },
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          },
        );
        StateTest(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    get_announcement();
  }, []);
  console.log(test);
  const rows = test.announcements.map((element, index) => (
    <Table.Tr key={index}>
      <Table.Td
        style={{
          borderLeft: "15px solid #15abff",
          backgroundColor: "white",
          color: "black",
          textTransform: "capitalize",
        }}
      >
        {element.message}
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <CustomBreadcrumbs />
      <NavPatient />
      <br />
      <Paper p="xl" shadow="xl" withBorder>
        <div style={{ margin: "2rem" }}>
          <div
            style={{
              width: "100%",
              margin: "0 auto",
            }}
          >
            <Title
              order={3}
              style={{
                textAlign: "center",
                color: "#15abff",
              }}
            >
              Announcements Record
            </Title>
            <br />
            <Table
              horizontalSpacing="lg"
              verticalSpacing="lg"
              style={{ width: "100%" }}
            >
              <Table.Tbody
                style={{
                  textAlign: "center",
                }}
              >
                {rows}
              </Table.Tbody>
            </Table>
          </div>
        </div>
      </Paper>
    </>
  );
}

export default Announcement;
