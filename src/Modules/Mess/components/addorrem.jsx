import React, { useState } from "react";
import {
  Container,
  TextInput,
  Button,
  Group,
  Select,
  FileInput,
  Paper,
  Title,
  Space,
} from "@mantine/core";
import {
  FileArrowUp,
  MagnifyingGlass,
  PlusCircle,
  TrashSimple,
} from "@phosphor-icons/react";

function ManageMess() {
  const [mess, setMess] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [excelFile, setExcelFile] = useState(null);

  return (
    <Container
      size="lg"
      style={{
        width: "100%", // Ensure it takes full width but respects min width
        display: "flex", // Use flexbox to center the content
        justifyContent: "center", // Horizontally centers the content
        marginTop: "25px",
      }}
    >
      <Paper
        shadow="md"
        radius="md"
        p="xl"
        withBorder
        style={{
          minWidth: "75rem", // Set the minimum width to 75rem
          width: "100%", // Ensure it is responsive
          padding: "30px",
          margin: "auto", // Center the Paper component
        }}
      >
        <Title order={2} align="center" mb="lg" style={{ color: "#1c7ed6" }}>
          View Mess Registrations
        </Title>

        <Space h="md" />
        <form>
          {/* Mess and Roll Number Fields */}
          <Group grow mb="md">
            <Select
              label="Mess*"
              placeholder="Select Mess"
              value={mess}
              onChange={setMess}
              data={["Mess 1", "Mess 2"]}
            />
            <TextInput
              label="Roll No*"
              placeholder="Student Roll Number Here"
              value={rollNo}
              onChange={(event) => setRollNo(event.currentTarget.value)}
            />
          </Group>

          {/* Buttons for Search, Add, Remove */}
          <Group
            spacing="sm"
            mb="md"
            position="center" // Center the buttons horizontally
          >
            <Button
              leftIcon={<MagnifyingGlass size={18} />} // Search icon
              onClick={() => {
                console.log("Searching for Roll No:", rollNo);
              }}
            >
              Search
            </Button>
            <Button
              leftIcon={<PlusCircle size={18} />} // New PlusCircle icon
              color="green"
              onClick={() => {
                console.log("Adding Roll No:", rollNo);
              }}
            >
              Add
            </Button>
            <Button
              leftIcon={<TrashSimple size={18} />} // Replacing Trash with TrashSimple
              color="red"
              onClick={() => {
                console.log("Removing Roll No:", rollNo);
              }}
            >
              Remove
            </Button>
          </Group>

          {/* Remove All Buttons */}
          <Group
            spacing="sm"
            mb="md"
            position="center" // Center the buttons horizontally
          >
            <Button
              variant="outline"
              color="red"
              onClick={() => {
                console.log("Remove all from Mess 1");
              }}
            >
              Remove All from Mess 1
            </Button>
            <Button
              variant="outline"
              color="red"
              onClick={() => {
                console.log("Remove all from Mess 2");
              }}
            >
              Remove All from Mess 2
            </Button>
          </Group>

          {/* File Upload for Excel */}
          <Group direction="column" spacing="sm" mb="md">
            <Title order={6}>Add by uploading Excel</Title>
            <FileInput
              placeholder="Choose File"
              value={excelFile}
              onChange={setExcelFile}
              accept=".xlsx,.xls"
              icon={<FileArrowUp size={18} />} // Updated to FileArrowUp icon
            />
          </Group>

          {/* Register All Button */}
          <Button
            leftIcon={<FileArrowUp size={18} />} // Updated icon for Register All
            fullWidth
            color="blue"
            onClick={() => {
              console.log("Register all from file:", excelFile);
            }}
          >
            Register All
          </Button>

          {/* Notes */}
          <Space h="lg" />
          <div style={{ fontSize: "12px", color: "gray" }}>
            <ul>
              <li>
                The excel sheet should only contain three columns including the
                heading - Roll no, Balance, mess_option.
              </li>
              <li>File should be in .xlsx or .xls format.</li>
              <li>
                This registration will add the Students to the provided
                mess_option.
              </li>
            </ul>
          </div>
        </form>
      </Paper>
    </Container>
  );
}

export default ManageMess;
