import React from "react";
import { Tabs, Container, Paper, Title } from "@mantine/core";
import ApplyForRebate from "./ApplyForRebate"; // Import the Apply for Rebate component
import RebateStatus from "./Rebatestatus"; // Import the Rebate Status component

function RebateRequestPage() {
  return (
    <Container
      size="lg"
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center", // Centers the form horizontally
        marginTop: "40px",
      }}
    >
      <Paper
        shadow="md"
        radius="md"
        p="xl"
        withBorder
        style={{
          width: "100%",
          minWidth: "80rem", // Set the min-width to 75rem
          padding: "30px", // Add padding for better spacing
        }}
      >
        <Title order={2} align="center" mb="lg" style={{ color: "#1c7ed6" }}>
          Rebate Request
        </Title>

        {/* Tabs to switch between Apply for Rebate and Rebate Status */}
        <Tabs defaultValue="apply">
          <Tabs.List>
            <Tabs.Tab value="apply">Apply for Rebate</Tabs.Tab>
            <Tabs.Tab value="status">Rebate Status</Tabs.Tab>
          </Tabs.List>

          {/* Apply for Rebate Panel */}
          <Tabs.Panel value="apply" pt="md">
            <ApplyForRebate />{" "}
            {/* Render the Apply for Rebate component here */}
          </Tabs.Panel>

          {/* Rebate Status Panel */}
          <Tabs.Panel value="status" pt="md">
            <RebateStatus /> {/* Render the Rebate Status component here */}
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Container>
  );
}

export default RebateRequestPage;
