import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Container, Table, Button, Title, Loader, Grid } from "@mantine/core";
import UpdateRequestForm from "./UpdateRequestForm";
import { IWD_ROUTES } from "../routes/iwdRoutes";
import { GetRequestsOrBills } from "../handlers/handlers";

function RejectedRequest() {
  const role = useSelector((state) => state.user.role);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const handleRequestSelect = (request) => {
    setSelectedRequest(request);
  };

  const handleBackToList = () => {
    setSelectedRequest(null);
    setRefresh((prev) => !prev);
  };

  useEffect(() => {
    GetRequestsOrBills({
      setLoading,
      setList: setRejectedRequests,
      role,
      URL: IWD_ROUTES.REJECTED_REQUESTS,
    });
  }, [role, refresh]);

  return (
    <Container style={{ padding: "10px" }}>
      <br />
      {loading ? (
        <Grid mt="xl">
          <Container py="xl">
            <Loader size="lg" />
          </Container>
        </Grid>
      ) : !selectedRequest ? (
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "25px",
            padding: "20px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.15)",
            borderLeft: "10px solid #1E90FF",
          }}
        >
          <Title
            align="center"
            weight={700}
            style={{ fontSize: "26px" }}
            mb="md"
          >
            Rejected Requests
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
              {rejectedRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>{request.name}</td>
                  <td>{request.description}</td>
                  <td>{request.area}</td>
                  <td>{request.requestCreatedBy}</td>
                  <td>
                    <Button
                      size="xs"
                      onClick={() => handleRequestSelect(request)}
                      style={{
                        backgroundColor: "#1E90FF",
                        color: "white",
                        borderRadius: "20px",
                      }}
                    >
                      Update
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <UpdateRequestForm
          selectedRequest={selectedRequest}
          onBack={handleBackToList}
        />
      )}
    </Container>
  );
}

export default RejectedRequest;
