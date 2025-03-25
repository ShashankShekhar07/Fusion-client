import React, { useState, useEffect } from "react";
import { Container, Table, Title, Grid, Loader } from "@mantine/core";
import { GetBudgets } from "../handlers/handlers";
import "./GlobTable.css";

// view budget fxn
export default function ViewBudget() {
  const [loading, setLoading] = useState(false);

  const [ViewBudgetList, setBudgetList] = useState([]);

  useEffect(() => {
    GetBudgets({ setLoading, setBudgetList });
  }, []);

  // const ViewBudgetList = [
  //   {
  //     id: "1",
  //     name: "divyansh",
  //     budgetIssued: 2000,
  //   },
  //   {
  //     id: "2",
  //     name: "user2",
  //     budgetIssued: 2200,
  //   },
  //   {
  //     id: "3",
  //     name: "user3",
  //     budgetIssued: 2100,
  //   },
  // ];

  return (
    <Container className="container" style={{ padding: "10px" }}>
      <br />

      {loading ? (
        <Grid my="xl">
          <Container py="xl">
            <Loader size="lg" />
          </Container>
        </Grid>
      ) : (
        // <Paper className="s-table" shadow="xs">
        <div className="details-wrapper">
          <Title align="center" weight={700} size="26px" mb="md">
            Details
          </Title>
          {ViewBudgetList.length > 0 ? (
            <Table>
              <thead style={{ backgroundColor: "#f5f5f5" }}>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Budget Issued</th>
                </tr>
              </thead>
              <tbody>
                {ViewBudgetList.map((request, index) => (
                  <tr key={index}>
                    <td>{request.id}</td>
                    <td>{request.name}</td>
                    <td>{request.budgetIssued}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Title align="center" size="14px" mt="md">
              Empty List: No Budgets Found
            </Title>
          )}
        </div>
        // </Paper>
      )}
    </Container>
  );
}
