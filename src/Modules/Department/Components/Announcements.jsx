import React, { useEffect, useState, Suspense } from "react";
import PropTypes from "prop-types";
import { Grid, Paper, Flex, Text, Divider } from "@mantine/core";
import { host } from "../../../routes/globalRoutes";

// Function to format the date with a period after the month
function formatDateWithPeriod(dateString) {
  if (!dateString) return ""; // Check if dateString exists
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString; // Check if the date is valid

  const options = { year: "numeric", month: "short", day: "numeric" };
  let formattedDate = date.toLocaleDateString("en-US", options);

  // Add a period after the abbreviated month
  formattedDate = formattedDate.replace(/(\w+)\s/, "$1. ");

  return formattedDate;
}

export default function Announcements({ branch }) {
  const [announcementsData, setAnnouncementsData] = useState([]);
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    fetch(`${host}/dep/api/ann-data/${branch}/`, {
      method: "GET",
      headers: {
        Authorization: `Token ${authToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Format announcement dates
        const formattedData =
          data?.map((announcement) => ({
            ...announcement,
            ann_date: formatDateWithPeriod(announcement.ann_date),
          })) || [];
        setAnnouncementsData(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching announcements data:", error);
      });
  }, [authToken, branch]);

  return (
    <Suspense fallback={<p>Loading announcements...</p>}>
      <Grid>
        {announcementsData.length > 0 ? (
          announcementsData.map((announcement) => (
            <Grid.Col span={{ base: 12, md: 6 }} key={announcement.id}>
              <Paper
                radius="md"
                px="lg"
                pt="sm"
                pb="xl"
                style={{ borderLeft: "0.6rem solid #15ABFF" }}
                withBorder
                maw="1240px"
              >
                <Flex justify="space-between">
                  <Flex direction="column">
                    <Flex gap="md">
                      <Text fw={600} size="1.2rem" mb="0.4rem">
                        {`${branch} Announcements`}
                      </Text>
                    </Flex>
                    <Text color="dimmed" size="0.7rem">
                      {announcement.ann_date}
                    </Text>
                    <Divider my="sm" w="10rem" />
                  </Flex>
                </Flex>
                <Flex justify="space-between">
                  <Text>{announcement.message || "No details available."}</Text>
                  <Text>
                    <b>{`by ${announcement.maker_id || "Unknown"}`}</b>
                  </Text>
                </Flex>
                {/* <br/>
            <Text>
            <b>File : </b>{`${announcement.upload_announcement || "Unknown"}`}
            </Text> */}
              </Paper>
            </Grid.Col>
          ))
        ) : (
          <Text>No announcements available for this branch.</Text>
        )}
      </Grid>
    </Suspense>
  );
}

Announcements.propTypes = {
  branch: PropTypes.string.isRequired,
};
