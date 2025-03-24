import React, { useEffect, useState } from "react";
import { Paper, Table, Title } from "@mantine/core";
import axios from "axios";
import { compounderRoute } from "../../../../routes/health_center";
import NavCom from "../NavCom";
import AnnounceNavBar from "./announPath";
import CustomBreadcrumbs from "../../../../components/Breadcrumbs";

function Record() {
  const [test, StateTest] = useState({ announcements: [] });

  useEffect(() => {
    const get_announcement = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await axios.post(
          compounderRoute,
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
      <Table.Td>{element.message}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <CustomBreadcrumbs />
      <NavCom />
      <AnnounceNavBar />
      <br />
      <Paper p="xl" shadow="xl" withBorder>
        <div style={{ margin: "2rem" }}>
          <div
            style={{
              width: "80%",
              margin: "0 auto",
            }}
          >
            <Title
              order={5}
              style={{
                textAlign: "center",
                margin: "0 auto",
                color: "#15abff",
              }}
            >
              Announcements Record
            </Title>
            <br />
            <Table
              striped
              withTableBorder
              withColumnBorders
              highlightOnHover
              horizontalSpacing="sm"
              verticalSpacing="sm"
              style={{ width: "100%" }}
            >
              <Table.Thead>
                <Table.Tr style={{}}>
                  <Table.Th style={{ textAlign: "center" }}>
                    Announcements Details
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
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

export default Record;
