import React, { useState } from "react";
import {
  TextInput,
  Button,
  Container,
  Title,
  Paper,
  FileInput,
  Grid,
  Space,
} from "@mantine/core"; // Import Mantine components

function BillBase() {
  const [amount, setAmount] = useState(""); // State for base amount
  const [file, setFile] = useState(null); // State for file upload

  // Function to handle the update of the base amount (for demo purposes)
  const updateBaseAmount = (event) => {
    event.preventDefault();
    alert(`Updated base amount to: Rs. ${amount}`); // Alert to simulate update
  };

  // Function to handle the file upload (for demo purposes)
  const uploadFile = (event) => {
    event.preventDefault();
    if (file) {
      alert(`File uploaded: ${file.name}`);
    } else {
      alert("Please select a file to upload.");
    }
  };

  return (
    <Container
      size="lg"
      style={{
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
          minWidth: "75rem", // Set the min-width to 75rem
          padding: "2rem", // Add padding for better spacing
        }}
      >
        <Title order={2} align="center" mb="xl" style={{ color: "#1c7ed6" }}>
          Monthly Bill Base
        </Title>
        {/* Update Base Amount Form */}
        <form onSubmit={updateBaseAmount}>
          <Grid>
            <Grid.Col span={8}>
              <TextInput
                label="Current Base Amount"
                placeholder="Enter the new base amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number" // Numeric input
                required
                radius="md"
                size="md"
                style={{ marginTop: "20px" }} // Increased margin top
                labelStyle={{ marginBottom: "10px" }} // Add space between label and input
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Button
                type="submit"
                style={{
                  width: "200px", // Reduced width of the button
                  marginTop: "47px", // Margin top for button to align with input
                  backgroundColor: "#1c7ed6",
                  color: "white",
                  fontWeight: "bold",
                  marginLeft: "30px",
                }}
              >
                Update Base Amount
              </Button>
            </Grid.Col>
          </Grid>
        </form>
        <Space h="xl" /> {/* Space between forms */}
        <hr />
        <Space h="xl" /> {/* Space between forms */}
        {/* Upload Monthly Bill Form */}
        <form onSubmit={uploadFile}>
          <Grid>
            <Grid.Col span={8}>
              <FileInput
                label="Upload Monthly Bill"
                placeholder="Choose Excel file"
                value={file}
                onChange={setFile}
                accept=".xlsx,.xls"
                required
                styles={{ input: { width: "100%" } }}
                radius="md"
                size="md"
                style={{ marginTop: "20px" }} // Increased margin top
                labelStyle={{ marginBottom: "10px" }} // Add space between label and input
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Button
                type="submit"
                style={{
                  width: "200px", // Reduced width of the button
                  marginTop: "47px", // Margin top for button to align with input
                  backgroundColor: "#1c7ed6",
                  color: "white",
                  fontWeight: "bold",
                  marginLeft: "30px",
                }}
              >
                Update Bills
              </Button>
            </Grid.Col>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}

export default BillBase;
