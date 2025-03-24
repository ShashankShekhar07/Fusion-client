import React from "react";
import { Link } from "react-router-dom";

function Unauthorized() {
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#f8f9fa",
      textAlign: "center",
    },
    heading: {
      fontSize: "36px",
      fontWeight: "bold",
      color: "#dc3545",
    },
    message: {
      fontSize: "18px",
      margin: "20px 0",
    },
    link: {
      color: "#007bff",
      textDecoration: "none",
      fontSize: "16px",
    },
  };
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Unauthorized Access</h1>
      <p style={styles.message}>
        You do not have permission to view this page.
      </p>
      <Link to="/accounts/login" style={styles.link}>
        Go to Login
      </Link>
    </div>
  );
}

export default Unauthorized;
