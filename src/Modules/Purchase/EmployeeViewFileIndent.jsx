import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { PiPrinter } from "react-icons/pi";
import {
  Container,
  Grid,
  Paper,
  Text,
  Group,
  Button,
  // TextInput,
  // FileInput,
  Title,
} from "@mantine/core";
import axios from "axios";
import DataTable from "./Table";
// import DataTable2 from "./Table2";

// const username = useSelector((state) => state.user.roll_no);

function EmployeeViewFileIndent() {
  // const [remarks, setRemarks] = useState("");
  // const [file, setFile] = useState(null);
  // const [receiver, setReceiver] = useState("");
  const navigate = useNavigate();
  const { indentID } = useParams();
  const handleSubmit = () => {
    navigate("/Inbox");
    alert("Submitted");
    // alert(`Remarks: ${remarks}`);
    // alert(`File: ${file ? file.name : "No file selected"}`);
    // alert(`Receiver: ${receiver}`);
  };

  const [indent, setIndent] = useState(null);

  const fetchIndentDetails = async () => {
    try {
      const token = localStorage.getItem("authToken"); // Assuming token is stored in localStorage
      const response = await axios.post(
        "http://127.0.0.1:8000/purchase-and-store/api/view_indent/",
        { file_id: indentID },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      setIndent(response.data);
    } catch (error) {
      console.error("Error fetching indents:", error);
    }
  };

  useEffect(() => {
    if (indentID) {
      fetchIndentDetails(indentID);
    }
  }, [indentID]);
  console.log(indent);
  return (
    <div>
      <Container
        size="lg"
        px="md"
        backgroundColor="white"
        style={{
          backgroundColor: "white",
          shadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          padding: "20px",
        }}
      >
        <Paper
          shadow="sm"
          padding="lg"
          radius="md"
          style={{
            // backgroundColor: "#f3f9ff",
            backgroundColor: "#D9EAF7",
            marginRight: "170px",
            marginLeft: "170px",
            marginTop: "2px",
            padding: "5px",
          }}
        >
          {/* Header Section */}
          <Group position="apart" mb="lg" justify="space-evenly">
            <Title order={3}>Note Sheets</Title>
            {/* <PiPrinter size={28} /> */}
            <Title order={3}>Attachments</Title>
          </Group>

          {/* Created By and File ID Section */}
          <Grid columns={2} gutter="lg" style={{ marginLeft: "24px" }}>
            <Grid.Col span={1}>
              <Group>
                <Text weight={600}>
                  <strong>Created by:</strong>
                </Text>
                <Text>atul-professor</Text>
              </Group>
            </Grid.Col>
            <Grid.Col span={1}>
              <Group>
                <Text weight={600}>
                  <strong>File ID:</strong>
                </Text>
                <Text>CSE-2027-9-#{indentID}</Text>
              </Group>
            </Grid.Col>
            <Grid.Col span={2}>
              <Text>
                <DataTable indent={indent} />
              </Text>
            </Grid.Col>
            {/* <Grid.Col span={2}>
              <Text>
                <DataTable2 />
              </Text>
            </Grid.Col> */}
          </Grid>

          {/* Description and Approval Section */}

          {/* Remarks and Form Section */}
          {/* <Group
            direction="column"
            spacing="sm"
            mt="xl"
            style={{ marginLeft: "24px" }}
          >
            <Group position="apart">
              <Text>
                <strong>Atul-Professor:</strong> Sept 10, 2024, 8:19 p.m.
              </Text>
              <Text marginLeft="40px">
                <strong>Received By:</strong> vkjain-HOD(CSE)
              </Text>
            </Group>
            <Group position="apart">
              <Text>File with id#619 created by Atul and sent to vkJain</Text>
            </Group>

            <Group position="apart">
              
              <Text>
                <strong>vkJain-HOD(CSE):</strong> nice
              </Text>
              <Text style={{ marginLeft: "50px" }}>
                <strong>Received By:</strong> bhartenduks-Director
              </Text>
            </Group>
            <Group position="apart">
              <Text>
                <strong>bhartenduks-Director:</strong> good
              </Text>
              <Text style={{ marginLeft: "50px" }}>
                <strong>Received By:</strong> psadmin
              </Text>
            </Group>
          </Group> */}

          {/* Form to Submit Remarks, Receiver, and File */}
          <form onSubmit={handleSubmit} style={{ marginLeft: "24px" }}>
            {/* <TextInput
              label="Remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add remarks here..."
              required
              mt="md"
            />

            <TextInput
              label="Receiver"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              placeholder="Enter receiver name..."
              required
              mt="md"
            />

            <FileInput
              label="Attach Files"
              placeholder="Choose file..."
              value={file}
              onChange={setFile}
              mt="md"
              required
            /> */}

            {/* Submit and Archive Buttons */}
            <Group position="right" mt="lg" style={{ justifyContent: "end" }}>
              <Button
                type="submit"
                variant="fill"
                color="blue"
                // color="#9095A0FF"
                onClick={() => navigate("/archive")}
              >
                Archieve
              </Button>
              {/* <Button type="submit" color="#9095A0FF">
                Send
              </Button> */}
            </Group>
          </form>
        </Paper>
      </Container>
    </div>
  );
}

export default EmployeeViewFileIndent;
