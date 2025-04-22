import React, { useEffect, useState } from "react";
import { Button, Text, Table, LoadingOverlay } from "@mantine/core";
import { ArrowCircleDown } from "@phosphor-icons/react";
import { fetchDocuments } from "../../../services/documentService.jsx";

function DownloadsSection() {
  const [downloadsData, setDownloadsData] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const data = await fetchDocuments();
      setDownloadsData(data);
    } catch (error) {
      console.error("Error fetching documents:", error);
      alert("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  return (
    <div
      className="downloads-container"
      style={{
        position: "relative",
        marginLeft: "0px",
        width: "100%",
      }}
    >
      <LoadingOverlay visible={loading} overlayBlur={2} />

      <Text align="left" className="dashboard-section-title" mb={20}>
        Documents & Downloads
      </Text>

      <div style={{ overflowX: "auto", width: "100%" }}>
        <Table className="downloads-table">
          <thead>
            <tr>
              <th style={{ width: "8%" }}>S.No.</th>
              <th style={{ width: "72%" }}>Document Title</th>
              <th style={{ width: "20%" }}>Download</th>
            </tr>
          </thead>
          <tbody>
            {downloadsData.map((download, index) => (
              <tr key={download.id}>
                <td>{index + 1}</td>
                <td>{download.title}</td>
                <td style={{ textAlign: "center" }}>
                  <Button
                    component="a"
                    href={download.link}
                    target="_blank"
                    color="blue"
                    variant="outline"
                    className="download-button"
                  >
                    <ArrowCircleDown size={16} style={{ marginRight: "8px" }} />
                    Download
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default DownloadsSection;
