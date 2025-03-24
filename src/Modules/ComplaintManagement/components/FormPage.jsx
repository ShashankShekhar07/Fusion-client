// MainPage.jsx
import React, { useState } from "react";
import ComplaintForm from "./ComplainForm"; // Corrected import path
import AcknowledgmentPage from "./FormAcknowledgmentPage"; // Corrected import path

function MainPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [complaintDetails, setComplaintDetails] = useState(null);

  const handleFormSubmit = (details) => {
    setComplaintDetails(details);
    setIsSubmitted(true);
  };

  const handleBackToForm = () => {
    setIsSubmitted(false);
    setComplaintDetails(null);
  };

  return isSubmitted ? (
    <AcknowledgmentPage
      complaintDetails={complaintDetails}
      onBackToForm={handleBackToForm}
    />
  ) : (
    <ComplaintForm onSubmit={handleFormSubmit} />
  );
}

export default MainPage;
