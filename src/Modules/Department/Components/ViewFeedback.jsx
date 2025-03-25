import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import SpecialTable from "./SpecialTable.jsx"; // Import your SpecialTable component
import { host } from "../../../routes/globalRoutes";

const columns = [
  {
    accessorKey: "remark", // Changed order: remark first
    header: "Remark",
  },
  {
    accessorKey: "rating", // Rating second
    header: "Rating",
  },
  // Removed the department column
];

export default function ViewFeedback({ branch }) {
  // Accept branch as a prop
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const authToken = localStorage.getItem("authToken"); // Get the token from local storage

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get(`${host}/dep/api/feedback/`, {
          headers: {
            Authorization: `Token ${authToken}`, // Include the token in the headers
          },
        });
        // Filter feedback based on the branch
        const filteredFeedback = response.data.filter(
          (item) => item.department === branch,
        );
        setData(filteredFeedback);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [branch, authToken]); // Add authToken to the dependency array

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  return (
    <div
      style={{
        overflowX: "auto", // Enable horizontal scrolling
        width: "100%", // Ensure the container takes the full width
        marginTop: "10px", // Add some spacing
      }}
    >
      <SpecialTable
        title={`Feedback for ${branch}`}
        columns={columns}
        data={data.map(({ id, ...rest }) => rest)} // Exclude 'id' from the displayed data
        rowOptions={["10", "15", "20"]}
      />
    </div>
  );
}

ViewFeedback.propTypes = {
  branch: PropTypes.string.isRequired,
};
