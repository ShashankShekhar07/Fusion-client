import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Container, Table, Button, Title, Loader, Grid } from "@mantine/core";
import { CaretLeft } from "@phosphor-icons/react";
import ViewRequestFile from "./ViewRequestFile";
import { GetRequestsOrBills } from "../handlers/handlers";
import { IWD_ROUTES } from "../routes/iwdRoutes";

function AuditDocuments() {
  const role = useSelector((state) => state.user.role);
  const [loading, setLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [auditDocumentsList, setAuditDocumentsList] = useState([]);

  const handleViewDocument = (document) => {
    setSelectedDocument(document);
  };

  const handleBackToList = () => {
    setSelectedDocument(null);
    setRefresh((prev) => !prev);
  };
  useEffect(() => {
    if (role) {
      GetRequestsOrBills({
        setLoading,
        setList: setAuditDocumentsList,
        role,
        URL: IWD_ROUTES.AUDIT_DOCUMENTS_VIEW,
      });
    }
  }, [role, refresh]);

  return (
    <Container style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <br />
      {loading ? (
        <Grid mt="md">
          <Container py="md">
            <Loader size="lg" />
          </Container>
        </Grid>
      ) : !selectedDocument ? (
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "25px",
            padding: "20px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.15)",
            borderLeft: "10px solid #1E90FF",
          }}
        >
          <Title size="26px" align="center" style={{ marginBottom: "10px" }}>
            Audit Documents
          </Title>
          <Table highlightOnHover>
            <thead style={{ backgroundColor: "#f5f5f5" }}>
              <tr>
                <th>ID</th>
                <th>File</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {auditDocumentsList.map((document, index) => (
                <tr key={index} id={document.request_id}>
                  <td>{document.request_id}</td>
                  <td>{document.file}</td>
                  <td>
                    <Button
                      size="xs"
                      onClick={() => handleViewDocument(document)}
                      style={{ backgroundColor: "#1E90FF", color: "white" }}
                    >
                      View File
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <>
          <Button
            variant="subtle"
            leftIcon={<CaretLeft size={12} />}
            onClick={handleBackToList}
            style={{ marginBottom: "10px" }}
          >
            Back to List
          </Button>
          <ViewRequestFile
            request={selectedDocument}
            handleBackToList={handleBackToList}
          />
        </>
      )}
    </Container>
  );
}

export default AuditDocuments;
