import React, { useEffect, useState } from "react";
import axios from "axios";
import { Paper, Title } from "@mantine/core";
import NavCom from "../NavCom";
import { compounderRoute } from "../../../../routes/health_center";
import CustomBreadcrumbs from "../../../../components/Breadcrumbs";

function FeedbackTable() {
  const [feedbackData, setFeedbackData] = useState({ complaints: [] });

  const fetchFeedback = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        compounderRoute,
        { get_feedback: 1 },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      console.log(response);
      setFeedbackData(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    border: "1px solid black",
    textAlign: "center",
  };

  const thStyle = {
    color: "black",
    padding: "10px",
    textAlign: "center",
    borderCollapse: "collapse",
    border: "1px solid black",
  };

  const tdStyle = {
    border: "1px solid black",
    padding: "10px",
    textAlign: "center",
  };

  return (
    <div>
      <CustomBreadcrumbs />
      <NavCom />
      <div style={{ margin: "2rem" }}>
        <Paper shadow="xl" p="xl" withBorder>
          <Title
            order={3}
            style={{
              textAlign: "center",
              margin: "0 auto",
              color: "#15abff",
            }}
          >
            Feedbacks
          </Title>
          <br />
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Feedback By</th>
                <th style={thStyle}>Feedback</th>
              </tr>
            </thead>
            <tbody>
              {feedbackData.complaints.map((item) => (
                <tr key={item.id}>
                  <td style={tdStyle}>{item.user_id}</td>
                  <td style={tdStyle}>{item.complaint}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Paper>
      </div>
    </div>
  );
}

export default FeedbackTable;
