import React, { useState } from "react";
import AwardsAndScholarshipCatalog from "../components/AwardsAndScholarshipCatalog";
import SpacsMembers from "../components/SpacsMembers";
import PreviousWinners from "../components/PreviousWinners";
import styles from "./ScholarshipPage.module.css";

function CatalogPage() {
  const [desc, setDesc] = useState(1);

  const changeDesc = (event) => {
    setDesc(parseInt(event.target.value, 10));
  };

  return (
    <div className={styles.pageBackground}>
      <div className={styles.wrapper}>
        <div className={styles.buttonContainer}>
          <button onClick={changeDesc} value={1} className={styles.button}>
            Awards and Scholarship Catalogue
          </button>
          <button onClick={changeDesc} value={2} className={styles.button}>
            SPACS Members and details
          </button>
          <button onClick={changeDesc} value={3} className={styles.button}>
            Previous Winners
          </button>
        </div>

        <div className={styles.progressBar}>
          <button
            onClick={changeDesc}
            value={1}
            aria-label="Awards and Scholarship Catalogue"
            className={`${styles.progressButton} ${desc === 1 ? styles.activeProgress : styles.inactiveProgress}`}
          />
          <button
            onClick={changeDesc}
            value={2}
            aria-label="SPACS Members and details"
            className={`${styles.progressButton} ${desc === 2 ? styles.activeProgress : styles.inactiveProgress}`}
          />
          <button
            onClick={changeDesc}
            value={3}
            aria-label="Previous Winners"
            className={`${styles.progressButton} ${desc === 3 ? styles.activeProgress : styles.inactiveProgress}`}
          />
        </div>

        {desc === 1 && <AwardsAndScholarshipCatalog />}
        {desc === 2 && <SpacsMembers />}
        {desc === 3 && <PreviousWinners />}
      </div>
    </div>
  );
}

export default CatalogPage;
