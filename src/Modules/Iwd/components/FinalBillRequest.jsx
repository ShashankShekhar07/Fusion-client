import React from "react";
import { Table, Button, Container, Title } from "@mantine/core";

function FinalBillRequest() {
  const handleGenerateFinalBill = (request) => {
    // TODO:
    console.log(request);
  };

  const RequestsInProgressData = [
    {
      id: "1",
      name: "divyansh",
      description: "ahgo",
      area: "lhtc",
      completed: false,
      "created-by": "me",
    },
    {
      id: "3",
      name: "dvijay",
      description: "ahgo",
      area: "lhtc",
      completed: true,
      "created-by": "me",
    },
    {
      id: "4",
      name: "suniljatt",
      description: "ahgo",
      area: "lhtc",
      completed: false,
      "created-by": "me",
    },
  ];

  return (
    <Container style={{ padding: "10px", fontFamily: "Arial, sans-serif" }}>
      <br />
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "25px",
          padding: "20px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.15)",
          borderLeft: "10px solid #1E90FF",
        }}
      >
        <Title align="center" weight={700} style={{ fontSize: "26px" }} mb="md">
          Details
        </Title>
        <Table highlightOnHover withBorder withColumnBorders>
          <thead style={{ backgroundColor: "#f5f5f5" }}>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Area</th>
              <th>Created By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {RequestsInProgressData.map((request, index) => (
              <tr key={index} id={request.id}>
                <td>{request.id}</td>
                <td>{request.name}</td>
                <td>{request.description}</td>
                <td>{request.area}</td>
                <td>{request["created-by"]}</td>
                <td>
                  <Button
                    size="xs"
                    onClick={() => handleGenerateFinalBill(request)}
                    style={{
                      padding: "10px 20px",
                      marginRight: "10px",
                      backgroundColor: "#1E90FF",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: "20px",
                    }}
                  >
                    Generate Bill
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
}

export default FinalBillRequest;
