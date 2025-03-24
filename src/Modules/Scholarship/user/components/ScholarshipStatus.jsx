import React, { useState } from "react";
import { Table } from "@mantine/core";
import styles from "./ScholarshipStatus.module.css";
import {
  showMcmStatusRoute,
  showGoldStatusRoute,
  showSilverStatusRoute,
  showPdmStatusRoute,
} from "../../../../routes/SPACSRoutes";

function ScholarshipStatus() {
  const [page, setPage] = useState(1);
  const [showStatus, setShowStatus] = useState(false);
  const [applications, setApplications] = useState([]);

  const navigateToForm = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleSubmit1 = async (event) => {
    event.preventDefault();
    setShowStatus(true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(showMcmStatusRoute, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Received Data:", data);
        setApplications(data);
      } else {
        console.log(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleSubmit2 = async (event) => {
    event.preventDefault();
    setShowStatus(true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(showGoldStatusRoute, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Received Data:", data);
        setApplications(data);
      } else {
        console.log(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleSubmit3 = async (event) => {
    event.preventDefault();
    setShowStatus(true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(showSilverStatusRoute, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Received Data:", data);
        setApplications(data);
      } else {
        console.log(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleSubmit4 = async (event) => {
    event.preventDefault();
    setShowStatus(true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(showPdmStatusRoute, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Received Data:", data);
        setApplications(data);
      } else {
        console.log(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  return (
    <div className={styles.wrapper}>
      {page === 1 && (
        <div className={styles.scholarshipContainer}>
          <div className={styles.sch}>
            <div className={styles.scholarshipName}>
              Merit-Cum-Means Scholarship
            </div>
            <button
              className={styles.checkStatusButton}
              onClick={() => navigateToForm(2)}
            >
              Check Status
            </button>
          </div>

          <div className={styles.sch}>
            <div className={styles.scholarshipName}>Director's Gold Medal</div>
            <button
              className={styles.checkStatusButton}
              onClick={() => navigateToForm(3)}
            >
              Check Status
            </button>
          </div>

          <div className={styles.sch}>
            <div className={styles.scholarshipName}>
              Director's Silver Medal
            </div>
            <button
              className={styles.checkStatusButton}
              onClick={() => navigateToForm(4)}
            >
              Check Status
            </button>
          </div>

          <div className={styles.sch}>
            <div className={styles.scholarshipName}>
              D&M Proficiency Gold Medal
            </div>
            <button
              className={styles.checkStatusButton}
              onClick={() => navigateToForm(5)}
            >
              Check Status
            </button>
          </div>
        </div>
      )}

      {page === 2 && (
        <div className={styles.formContainer}>
          <h3 className={styles.scholarshipName}>
            Merit-Cum-Means Scholarship
          </h3>
          {!showStatus ? (
            <form className={styles.form} onSubmit={handleSubmit1}>
              <button type="submit" className={styles.checkStatusButton}>
                Check Status
              </button>
            </form>
          ) : (
            <div className={styles.applicationsList}>
              <h4>Application Status</h4>
              <div className={styles.tableContainer}>
                <Table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Application ID:</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((winner, index) => (
                      <tr key={index}>
                        <td>{winner.id}</td>
                        <td>{winner.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              {applications.length === 0 && <h3>no application found</h3>}
            </div>
          )}
        </div>
      )}

      {page === 3 && (
        <div className={styles.formContainer}>
          <h3 className={styles.scholarshipName}>Director's Gold Medal</h3>
          {!showStatus ? (
            <form className={styles.form} onSubmit={handleSubmit2}>
              <button type="submit" className={styles.checkStatusButton}>
                Check Status
              </button>
            </form>
          ) : (
            <div className={styles.applicationsList}>
              <h4>Application Status</h4>
              <div className={styles.tableContainer}>
                <Table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Application ID:</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((winner, index) => (
                      <tr key={index}>
                        <td>{winner.id}</td>
                        <td>{winner.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              {applications.length === 0 && <h3>no application found</h3>}
            </div>
          )}
        </div>
      )}

      {page === 4 && (
        <div className={styles.formContainer}>
          <h3 className={styles.scholarshipName}>Director's Silver Medal</h3>
          {!showStatus ? (
            <form className={styles.form} onSubmit={handleSubmit3}>
              <button type="submit" className={styles.checkStatusButton}>
                Check Status
              </button>
            </form>
          ) : (
            <div className={styles.applicationsList}>
              <h4>Application Status</h4>
              <div className={styles.tableContainer}>
                <Table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Application ID:</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((winner, index) => (
                      <tr key={index}>
                        <td>{winner.id}</td>
                        <td>{winner.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              {applications.length === 0 && <h3>no application found</h3>}
            </div>
          )}
        </div>
      )}

      {page === 5 && (
        <div className={styles.formContainer}>
          <h3 className={styles.scholarshipName}>D&M Proficiency Gold Medal</h3>
          {!showStatus ? (
            <form className={styles.form} onSubmit={handleSubmit4}>
              <button type="submit" className={styles.checkStatusButton}>
                Check Status
              </button>
            </form>
          ) : (
            <div className={styles.applicationsList}>
              <h4>Application Status</h4>
              <div className={styles.tableContainer}>
                <Table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Application ID:</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((winner, index) => (
                      <tr key={index}>
                        <td>{winner.id}</td>
                        <td>{winner.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              {applications.length === 0 && <h3>no application found</h3>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ScholarshipStatus;
