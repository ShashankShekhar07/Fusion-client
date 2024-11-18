import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
import {
  Container,
  Grid,
  Paper,
  Text,
  Group,
  Button,
  Title,
} from "@mantine/core";
import axios from "axios";
import { useSelector } from "react-redux";
import DataTable from "./Table";
import { viewIndentRoute } from "../../routes/purchaseRoutes";

function EmployeeViewFileIndent() {
  const { indentID } = useParams();
  const token = localStorage.getItem("authToken");
  const role = useSelector((state) => state.user.role);
  const archieveIndent = async () => {
    // Send POST request to archive the file
    const id = indentID;
    try {
      // setLoading(true);
      const response = await axios.get(
        `http://127.0.0.1:8000/purchase-and-store/api/archieve_indent/4322/?role=${role}&file_id=${id}`, // Fixed URL format
        {
          headers: {
            Authorization: `Token ${token}`, // Correct placement of headers
          },
        },
      );

      console.log(response);
      // navigate("/purchase/outbox");
      // setLoading(false);
    } catch (err) {
      console.log(err);
      // setError("Failed to archieve indent."); // Handle errors
      // setLoading(false);
    }
  };
  const [indent, setIndent] = useState(null);

  const fetchIndentDetails = async () => {
    try {
      // const token = localStorage.getItem("authToken");
      const response = await axios.post(
        viewIndentRoute,
        { file_id: indentID },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      setIndent(response.data.indent);
    } catch (error) {
      console.error("Error fetching indents:", error);
    }
  };

  useEffect(() => {
    if (indentID) {
      fetchIndentDetails(indentID);
    }
  }, [indentID]);

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
          <form onSubmit={archieveIndent} style={{ marginLeft: "24px" }}>
            <Group position="right" mt="lg" style={{ justifyContent: "end" }}>
              <Button type="submit" variant="fill" color="blue">
                Archieve
              </Button>
            </Group>
          </form>
        </Paper>
      </Container>
    </div>
  );
}

export default EmployeeViewFileIndent;
