import React, { useState } from "react";
import ConvocationMedal from "../../Convocation/ConvocationMedal";
import ScholarshipForm from "../../MCM_Application/ScholarshipForm";
import styles from "./BrowseApplication.module.css";

function BrowseApplicationPage() {
  const [desc, setDesc] = useState(1);

  const changeDesc = (event) => {
    setDesc(parseInt(event.target.value, 10));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.buttonContainer}>
        <button
          onClick={changeDesc}
          value={1}
          className={`${styles.progressButton} ${desc === 1 ? styles.activeProgress : styles.inactiveProgress}`}
          aria-label="Merit-cum-Means Scholarship Progress"
        >
          Merit-cum-Means Scholarship
        </button>
        <button
          onClick={changeDesc}
          value={2}
          className={`${styles.progressButton} ${desc === 2 ? styles.activeProgress : styles.inactiveProgress}`}
          aria-label="Convocation Medals Progress"
        >
          Convocation Medals
        </button>
      </div>

      <hr className={styles.hr} />

      {desc === 1 && <ScholarshipForm />}
      {desc === 2 && <ConvocationMedal />}
    </div>
  );
}

export default BrowseApplicationPage;
