import React, { useState } from "react";
import styles from "./ScholarshipStatusPage.module.css"; // Import CSS module
import ScholarshipStatus from "../components/ScholarshipStatus";

function ScholarStatusPage() {
  const [desc, setDesc] = useState(1);

  const changeDesc = (event) => {
    setDesc(parseInt(event.target.value, 10)); // Ensure the value is an integer
  };

  return (
    <>
      {/* <UserBreadcumbs /> */}
      <div className={styles.pageContainer}>
        <div className={styles.gridContainer}>
          <button
            onClick={changeDesc}
            value={1}
            className={`${styles.progressButton} ${desc === 1 ? styles.active : styles.inactive}`}
            aria-label="Progress Button"
          >
            View Application Status
          </button>
        </div>
        {desc === 1 && <ScholarshipStatus />}
      </div>
    </>
  );
}

export default ScholarStatusPage;
