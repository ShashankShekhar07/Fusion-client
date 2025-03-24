import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Container,
  Table,
  Button,
  Title,
  Loader,
  Grid,
  Center,
  CheckIcon,
} from "@mantine/core";
import { IWD_ROUTES } from "../routes/iwdRoutes";
import {
  GetRequestsOrBills,
  HandleMarkAsCompleted,
} from "../handlers/handlers";

function RequestsInProgress() {
  const [loading, setLoading] = useState(false);
  const [RequestsInProgressData, setRequestsInProgress] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const role = useSelector((state) => state.user.role);
  const [refresh, setRefresh] = useState(false);

  const handleDoneRequest = (request) => {
    // TODO:
    console.log(request);
  };

  const handleGenerateBill = (request) => {
    // TODO:
    console.log(request);
  };

  useEffect(() => {
    GetRequestsOrBills({
      setLoading,
      setList: setRequestsInProgress,
      role,
      URL: IWD_ROUTES.REQUESTS_IN_PROGRESS,
    });
  }, [refresh]);

  return (
    <Container style={{ padding: "10px" }}>
      <br />
      {loading ? (
        <Grid mt="xl">
          <Container py="xl">
            <Loader size="lg" />
          </Container>
        </Grid>
      ) : (
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "25px",
            padding: "20px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.15)",
            borderLeft: "10px solid #1E90FF",
          }}
        >
          <Title align="center" weight={700} size="26px" mb="md">
            Requests In Progress
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
              {RequestsInProgressData.map((request) => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>{request.name}</td>
                  <td>{request.description}</td>
                  <td>{request.area}</td>
                  <td>{request.requestCreatedBy}</td>
                  <td>
                    {request.workCompleted ? (
                      <div
                        className="buttonContatiner"
                        style={{ display: "flex", flexDirection: "row" }}
                      >
                        <Button
                          size="xs"
                          onClick={() => handleGenerateBill(request)}
                          style={{
                            backgroundColor: "#1E90FF",
                            color: "white",
                            borderRadius: "20px",
                            marginRight: "10px",
                          }}
                          disabled={isLoading || isSuccess}
                        >
                          Generate Bill
                        </Button>
                        <Button
                          size="xs"
                          onClick={() => handleDoneRequest(request)}
                          style={{
                            backgroundColor: "#1E90FF",
                            color: "white",
                            borderRadius: "20px",
                          }}
                          disabled={isLoading || isSuccess}
                        >
                          Done
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Button
                          size="xs"
                          onClick={() =>
                            HandleMarkAsCompleted({
                              setIsLoading,
                              setIsSuccess,
                              setRefresh,
                              request,
                            })
                          }
                          key={request.id}
                          style={{
                            backgroundColor: "#1E90FF",
                            color: "white",
                            borderRadius: "20px",
                            marginRight: "10px",
                          }}
                          disabled={isLoading || isSuccess}
                        >
                          {isLoading ? (
                            <Center>
                              <Loader color="black" size="xs" />
                            </Center>
                          ) : isSuccess ? (
                            <Center>
                              <CheckIcon size="16px" color="black" />
                            </Center>
                          ) : (
                            "Mark as Completed"
                          )}
                        </Button>
                        {/* <Button
                          size="xs"
                          onClick={() => handleInventory(request)}
                          style={{
                            backgroundColor: "#1E90FF",
                            color: "white",
                            borderRadius: "20px",
                          }}
                        >
                          Inventory
                        </Button> */}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
}

export default RequestsInProgress;
