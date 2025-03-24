import { useState } from "react";
import { Button, Alert, Radio } from "@mantine/core";
import axios from "axios";
import { host } from "../../routes/globalRoutes/index.jsx";

function DownloadNewsletter() {
  const [errorMessage, setErrorMessage] = useState("");
  const token = localStorage.getItem("authToken");
  const [selectedOption, setSelectedOption] = useState("6 months");
  const handleDownloadPDF = async () => {
    try {
      const response = await axios.get(
        `${host}/gymkhana/api/newsletter_pdf/?timeframe=${selectedOption}`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "newsletter.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      setErrorMessage("Failed to download the newsletter PDF.");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        maxWidth: "600px",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <h2 style={{ color: "#1976D2" }}>Download Newsletter</h2>

      <div style={{ width: "100%", textAlign: "center" }}>
        <h3>Select Newsletter Duration:</h3>
        <Radio.Group
          value={selectedOption}
          onChange={setSelectedOption}
          name="newsletter-duration"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* <Radio value="weekly" label="Weekly" /> */}
          {/* <Radio value="monthly" label="Monthly" /> */}
          <Radio value="6 months" label="6 Months" />
        </Radio.Group>
      </div>

      <div style={{ marginTop: "20px" }}>
        <Button
          style={{
            backgroundColor: "#1976D2",
            color: "white",
            fontSize: "16px",
            padding: "10px 20px",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
          }}
          onClick={handleDownloadPDF}
        >
          Download Newsletter PDF
        </Button>
      </div>

      {errorMessage && (
        <Alert
          style={{
            marginTop: "20px",
            textAlign: "center",
            color: "red",
          }}
        >
          {errorMessage}
        </Alert>
      )}
    </div>
  );
}

export default DownloadNewsletter;
