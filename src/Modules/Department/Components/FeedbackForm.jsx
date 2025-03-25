import React, { useState } from "react";
import axios from "axios";
import classes from "../styles/Departmentmodule.module.css";
import { host } from "../../../routes/globalRoutes";

const styles = {
  formContainer: {
    width: "600px",
    margin: "auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
  },
  formGroup: {
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "14px",
    margin: "5px 0",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  textarea: {
    width: "100%",
    padding: "14px",
    height: "150px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "16px",
    backgroundColor: "#15ABFF",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "20px",
  },
  header: {
    textAlign: "left",
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "15px",
  },
};

export default function Feedbackform() {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState("Poor"); // Updated to match the initial option value
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleRatingChange = (e) => {
    setRating(e.target.value);
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const token = localStorage.getItem("authToken");
    const url = `${host}/dep/api/feedback/create/`;

    const feedbackData = {
      department: selectedDepartment,
      rating,
      remark: feedback,
    };

    try {
      await axios.post(url, feedbackData, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Reset form fields after submission if needed
      setFeedback("");
      setRating("Poor"); // Reset to default
      setSelectedDepartment("");
    } catch (error) {
      const errorResponse = error.response?.data || error.message;
      setErrorMessage(
        errorResponse.detail || "Error submitting feedback. Please try again.",
      );
      console.error("Error submitting feedback:", errorResponse);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${classes.flex} ${classes.w_full}`}>
      <form onSubmit={handleSubmit} style={styles.formContainer}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            height: "auto",
          }}
        >
          <h2>Department Feedback</h2>
        </div>

        {errorMessage && (
          <div style={{ color: "red", marginBottom: "15px" }}>
            {errorMessage}
          </div>
        )}

        <div style={styles.formGroup}>
          <label htmlFor="feedback">
            Remark:
            <textarea
              value={feedback}
              onChange={handleFeedbackChange}
              placeholder="Enter your feedback here..."
              style={styles.textarea}
              id="feedback"
              required
            />
          </label>
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="rating">
            Rating
            <select
              value={rating}
              onChange={handleRatingChange}
              style={styles.input}
              id="rating"
              required
            >
              <option value="Poor">Poor</option>
              <option value="Good">Good</option>
              <option value="Excellent">Excellent</option>
            </select>
          </label>
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="department">
            Select Department
            <select
              value={selectedDepartment}
              onChange={handleDepartmentChange}
              style={styles.input}
              id="department"
              required
            >
              <option value="">Select a department</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="ME">ME</option>
              <option value="SM">SM</option>
              <option value="BDES">BDES</option>
              <option value="LA">Liberal Arts</option>
              <option value="Natural Science">Natural Science</option>
            </select>
          </label>
        </div>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
}
