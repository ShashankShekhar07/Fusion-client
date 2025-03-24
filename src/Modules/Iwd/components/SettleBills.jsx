import React, { useState } from "react";
import { Table, Button, Container, Group, Title } from "@mantine/core";
import ViewRequestFile from "./ViewRequestFile";

function SettleBills() {
  const [selectedBill, setSelectedBill] = useState(null);
  const handleViewFile = (bill) => {
    // TODO:
    setSelectedBill(bill);
  };
  const handleSettleBill = (bill) => {
    // TODO:
    console.log(bill);
  };
  const handleBackToBills = () => {
    setSelectedBill(null);
  };
  const budgetList = [
    {
      id: "1",
      bill: "bill_1.pdf",
    },
  ];
  return (
    <Container style={{ padding: "10px" }}>
      {!selectedBill ? (
        <div style={{ padding: "20px" }}>
          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: "25px",
              padding: "20px",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.15)",
              borderLeft: "10px solid #1E90FF",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                backgroundColor: "#f5f5f5",
                padding: "10px",
                borderBottom: "1px solid #ccc",
                marginBottom: "10px",
              }}
            >
              <Title align="center" size="26px">
                Details
              </Title>
            </div>
            <Table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "20px",
              }}
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Bill</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {budgetList.map((bill) => (
                  <tr key={bill.id}>
                    <td>{bill.id}</td>
                    <td>{bill.bill}</td>
                    <td>
                      <Group
                      // style={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <Button
                          style={{
                            backgroundColor: "#1E90FF",
                            color: "white",
                            borderRadius: "20px",
                            textAlign: "center",
                          }}
                          onClick={() => handleViewFile(bill)}
                        >
                          View File
                        </Button>
                        <Button
                          style={{
                            backgroundColor: "#1E90FF",
                            color: "white",
                            borderRadius: "20px",
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            handleSettleBill(bill);
                          }}
                        >
                          Settle
                        </Button>
                      </Group>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      ) : (
        <ViewRequestFile
          selectedBill={selectedBill}
          onBack={handleBackToBills}
        />
      )}
    </Container>
  );
}

export default SettleBills;
