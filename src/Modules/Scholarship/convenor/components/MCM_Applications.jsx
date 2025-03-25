import React, { useState, useEffect } from "react";
import { Table, Button } from "@mantine/core";
import axios from "axios";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import styles from "./MCM_applications.module.css";
import MedalApplications from "./medal_applications";
import {
  getMCMApplicationsRoute,
  updateMCMStatusRoute,
} from "../../../../routes/SPACSRoutes";
import { host } from "../../../../routes/globalRoutes";

function MCMApplications() {
  const [activeTab, setActiveTab] = useState("MCM");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(getMCMApplicationsRoute, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data) {
        const incompleteApplications = data.filter(
          (app) => app.status !== "REJECTED",
        );
        setApplications(incompleteApplications);
        console.log("Fetched scholarship details:", incompleteApplications);
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch scholarship details:", error);
      setLoading(false);
    }
  };
  // Fetch scholarship details from the API
  useEffect(() => {
    fetchApplications();
  }, []);

  // Handle MCM status update
  const handleApproval = async (id, action) => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.log("No authorization token found in localStorage.");
        return;
      }

      const apiUrl = updateMCMStatusRoute;
      const payload = {
        id,
        status:
          action === "approved"
            ? "ACCEPTED"
            : action === "rejected"
              ? "REJECTED"
              : "UNDER_REVIEW",
      };

      console.log("Sending payload:", payload);

      const response = await axios.post(apiUrl, payload, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        alert("Status updated successfully");
        console.log("Status updated successfully");
        fetchApplications(); // Refresh application list
      } else {
        console.error("Error updating status:", response);
      }
    } catch (error) {
      console.error("Error updating status:", error.response || error.message);
    }
  };

  const handleExportInExcel = async () => {
    if (applications.length === 0) {
      alert("No applications available to download.");
      return;
    }

    // Generate applications data with all fields, using spread operator
    const applicationsData = applications.map((app, index) => ({
      ...app,
      Marksheet: `Marksheet_${app.student}_${index}.pdf`,
      Aadhar_card: `AadharCard_${app.student}_${index}.pdf`,
      Affidavit: `Affidavit_${app.student}_${index}.pdf`,
      Bank_details: `Bank_details_${app.student}_${index}.pdf`,
      Fee_Receipt: `Fee_Receipt_${app.student}_${index}.pdf`,
      income_certificate: `Income_certificate_${app.student}_${index}.pdf`,
    }));

    // Generate Excel file
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(applicationsData);

    XLSX.utils.book_append_sheet(wb, ws, "applications");

    // Convert Excel file to Blob and add to ZIP
    const excelBlob = new Blob(
      [XLSX.write(wb, { bookType: "xlsx", type: "array" })],
      {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    );
    const excelUrl = URL.createObjectURL(excelBlob);
    const link = document.createElement("a");
    link.href = excelUrl;
    link.download = "applications.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert("ZIP file containing all application details downloaded!");
  };

  const handleDownloadFiles = async (app) => {
    const zip = new JSZip();
    const folder = zip.folder(`Application_${app.student}`);

    const fileFields = [
      "Marksheet",
      "Aadhar",
      "Affidavit",
      "Bank_details",
      "Fee_Receipt",
      "income_certificate",
    ];

    const fetchPromises = fileFields.map(async (field, index) => {
      if (app[field]) {
        const fileUrl = `${host}${app[field]}`;
        try {
          const response = await fetch(fileUrl);
          if (!response.ok) throw new Error(`Failed to fetch ${fileUrl}`);
          const blob = await response.blob();
          folder.file(`${field}_${app.student}_${index}.pdf`, blob);
        } catch (err) {
          console.error("Error fetching file:", err);
        }
      }
    });

    await Promise.all(fetchPromises); // Wait for all files to be added

    // Generate ZIP and trigger download
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, `Application_${app.student}.zip`);
    });
    alert("ZIP file containing all files of the application downloaded!");
  };

  return (
    <div className={styles.container}>
      <div className={styles.whiteBox}>
        <div className={styles.tabs}>
          <div
            role="button"
            tabIndex={0}
            className={activeTab === "MCM" ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab("MCM")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setActiveTab("MCM");
            }}
            style={{
              borderBottom: activeTab === "MCM" ? "4px solid #1e90ff" : "none",
              color: activeTab === "MCM" ? "#1e90ff" : "#000",
            }}
          >
            Merit-cum-Means Scholarship
          </div>
          <div
            role="button"
            tabIndex={0}
            className={activeTab === "Medals" ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab("Medals")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setActiveTab("Medals");
            }}
            style={{
              borderBottom:
                activeTab === "Medals" ? "4px solid #1e90ff" : "none",
              color: activeTab === "Medals" ? "#1e90ff" : "#000",
            }}
          >
            Convocation Medals
          </div>
        </div>

        {activeTab === "MCM" && (
          <>
            <h2>Merit-cum-Means Scholarship</h2>
            {loading ? (
              <p>Loading applications...</p>
            ) : (
              <>
                <button
                  onClick={handleExportInExcel}
                  className={styles.exportButton}
                >
                  Export All
                </button>
                <div className={styles.tableWrapper}>
                  <Table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Roll</th>
                        <th>Income</th>
                        <th>File</th>
                        <th>Accept</th>
                        <th>Reject</th>
                        <th>Under Review</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map(
                        (app, index) =>
                          app.status !== "REJECTED" && (
                            <tr key={index}>
                              <td>{app.student}</td>
                              <td>{app.annual_income}</td>
                              <td>
                                <Button
                                  color="blue"
                                  onClick={() => handleDownloadFiles(app)}
                                >
                                  Files
                                </Button>
                              </td>
                              <td>
                                <Button
                                  color="green"
                                  onClick={() =>
                                    handleApproval(app.id, "approved")
                                  }
                                >
                                  Accept
                                </Button>
                              </td>
                              <td>
                                <Button
                                  color="red"
                                  onClick={() =>
                                    handleApproval(app.id, "rejected")
                                  }
                                >
                                  Reject
                                </Button>
                              </td>
                              <td>
                                <Button
                                  color="gray"
                                  onClick={() =>
                                    handleApproval(app.id, "under_review")
                                  }
                                >
                                  Under Review
                                </Button>
                              </td>
                            </tr>
                          ),
                      )}
                    </tbody>
                  </Table>
                </div>
              </>
            )}
          </>
        )}

        {activeTab === "Medals" && <MedalApplications />}
      </div>
    </div>
  );
}

export default MCMApplications;
