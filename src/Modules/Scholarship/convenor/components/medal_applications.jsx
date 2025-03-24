/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import styles from "./medal_applications.module.css"; // Ensure this file is present with correct styles
import {
  getDirectorGoldApplicationsRoute,
  getDirectorSilverApplicationsRoute,
  getProficiencyDMApplicationsRoute,
  updateDirectorGoldStatusRoute,
  updateDirectorSilverStatusRoute,
  updateProficiencyDMStatusRoute,
} from "../../../../routes/SPACSRoutes";
import { host } from "../../../../routes/globalRoutes";

function MedalApplications() {
  const [selectedAward, setSelectedAward] = useState("Director's Silver Medal");
  const [medals, setMedals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch medals data based on the selected award
  const fetchMedalsData = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.log("No authorization token found in localStorage.");
        setError("No authorization token found.");
        setIsLoading(false);
        return;
      }

      let apiUrl = "";
      // Select the API based on the selected award
      if (selectedAward === "Director's Silver Medal") {
        apiUrl = getDirectorSilverApplicationsRoute;
      } else if (selectedAward === "Director's Gold Medal") {
        apiUrl = getDirectorGoldApplicationsRoute;
      } else if (selectedAward === "D&M Proficiency Gold Medal") {
        apiUrl = getProficiencyDMApplicationsRoute;
      }

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data) {
        const incompleteMedals = response.data.filter(
          (medal) => medal.status === "INCOMPLETE",
        );
        setMedals(incompleteMedals);
        console.log(incompleteMedals);
      } else {
        setError("No data received from the API.");
      }
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching medals data:", err);
      setError("Error fetching medals data.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedalsData();
    console.log(medals);
  }, [selectedAward]);

  const handleApproval = async (medalId, action) => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.log("No authorization token found in localStorage.");
        setError("No authorization token found.");
        return;
      }

      let apiUrl = "";
      let payload = {};

      if (selectedAward === "Director's Gold Medal") {
        apiUrl = updateDirectorGoldStatusRoute;
        // For Gold Medal, send "accept" or "reject" as action
        payload = {
          id: medalId,
          action: action === "approved" ? "accept" : "reject", // Ensure it's 'accept' or 'reject'
        };
      } else if (selectedAward === "Director's Silver Medal") {
        apiUrl = updateDirectorSilverStatusRoute;
        // For Silver Medal, send 'ACCEPTED' or 'REJECTED'
        payload = {
          id: medalId,
          status: action === "approved" ? "ACCEPTED" : "REJECTED",
        };
      } else if (selectedAward === "D&M Proficiency Gold Medal") {
        apiUrl = updateProficiencyDMStatusRoute;
        payload = {
          id: medalId,
          status: action === "approved" ? "ACCEPTED" : "REJECTED",
        };
      }

      console.log("Sending payload:", payload); // Log payload for debugging

      const response = await axios.post(apiUrl, payload, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        fetchMedalsData(); // Refresh the list of medals
        setError(null);
      } else {
        setError("Error updating status.");
      }
    } catch (err) {
      console.error("Error updating status:", err.response || err.message);
      setError(
        `Error updating status: ${err.response ? err.response.data : err.message}`,
      );
    }
  };

  const handleDownloadAllMarksheets = async () => {
    if (medals.length === 0) {
      alert("No medals available to download.");
      return;
    }

    const zip = new JSZip();
    const folder = zip.folder("Marksheets");

    // Generate medals data with all fields, using spread operator
    const medalsData = medals.map((medal, index) => ({
      ...medal, // Spread all medal fields dynamically
      Marksheet: `Marksheet_${medal.student}_${index}.pdf`, // Add Marksheet link field
    }));

    // Generate Excel file
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(medalsData);

    XLSX.utils.book_append_sheet(wb, ws, "Medals");

    // Convert Excel file to Blob and add to ZIP
    const excelBlob = new Blob(
      [XLSX.write(wb, { bookType: "xlsx", type: "array" })],
      {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    );
    folder.file("Medals.xlsx", excelBlob);

    // Fetch and add marksheets
    const fetchPromises = medals.map(async (medal, index) => {
      if (medal.Marksheet) {
        const markSheetUrl = `${host}${medal.Marksheet}`;
        try {
          const response = await fetch(markSheetUrl);
          if (!response.ok) throw new Error(`Failed to fetch ${markSheetUrl}`);
          const blob = await response.blob();
          folder.file(`Marksheet_${medal.student}_${index}.pdf`, blob);
        } catch (err) {
          console.error("Error fetching file:", err);
        }
      }
    });

    await Promise.all(fetchPromises); // Wait for all files to be added

    // Generate ZIP and trigger download
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "All_Marksheets.zip");
    });
    alert("ZIP file containing all marksheets and Excel file downloaded!");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Medal Applications</h2>
      <button
        onClick={handleDownloadAllMarksheets}
        className={styles.exportButton}
      >
        Export All
      </button>

      <div className={styles.awardSelector}>
        <label htmlFor="award-select">Select Award:</label>
        <select
          id="award-select"
          value={selectedAward}
          onChange={(e) => setSelectedAward(e.target.value)}
          className={styles.select}
        >
          <option value="Director's Silver Medal">
            Director's Silver Medal
          </option>
          <option value="Director's Gold Medal">Director's Gold Medal</option>
          <option value="D&M Proficiency Gold Medal">
            D&M Proficiency Gold Medal
          </option>
        </select>
      </div>

      {isLoading && <p>Loading medals...</p>}

      {!isLoading && !error && medals.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Award</th>
              <th>File</th>
              <th>Accept</th>
              <th>Reject</th>
            </tr>
          </thead>
          <tbody>
            {medals.map((medal, index) => (
              <tr key={index}>
                <td>{medal.student}</td>
                <td>{selectedAward}</td>
                <td>
                  <a
                    href={`${host}${medal.Marksheet}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.button} ${styles.fileButton}`}
                  >
                    View Marksheet
                  </a>
                </td>
                <td>
                  <button
                    className={`${styles.button} ${styles.acceptButton}`}
                    onClick={() => handleApproval(medal.id, "approved")}
                  >
                    Approve
                  </button>
                </td>
                <td>
                  <button
                    className={`${styles.button} ${styles.rejectButton}`}
                    onClick={() => handleApproval(medal.id, "rejected")}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!isLoading && !error && medals.length === 0 && <p>No medals found.</p>}
    </div>
  );
}

export default MedalApplications;
