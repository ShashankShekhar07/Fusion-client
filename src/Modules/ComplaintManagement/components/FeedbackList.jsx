import React from "react";
import { Flex, Text } from "@mantine/core";
import PropTypes from "prop-types";
import FeedbackItem from "./FeedbackItem";

function FeedbackList({ complaints, setSelectedComplaint }) {
  const filteredComplaints = complaints.filter(
    (complaint) => complaint.status === 2,
  );

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        overflowY: "auto",
      }}
    >
      <Flex
        direction="column"
        gap="md"
        style={{
          width: "100%",
          flexGrow: 1,
        }}
      >
        {filteredComplaints.length === 0 ? (
          <Text align="center" color="gray" style={{ fontSize: "14px" }}>
            No resolved complaints available.
          </Text>
        ) : (
          filteredComplaints.map((complaint) => (
            <FeedbackItem
              key={complaint.id}
              complaint={complaint}
              setSelectedComplaint={setSelectedComplaint}
            />
          ))
        )}
      </Flex>
    </div>
  );
}

export default FeedbackList;

FeedbackList.propTypes = {
  complaints: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      complaint_type: PropTypes.string.isRequired,
      complaint_date: PropTypes.string.isRequired,
      complaint_finish: PropTypes.string,
      location: PropTypes.string.isRequired,
      specific_location: PropTypes.string.isRequired,
      details: PropTypes.string.isRequired,
      status: PropTypes.number.isRequired,
      feedback: PropTypes.string,
      comment: PropTypes.string,
    }),
  ).isRequired,
  setSelectedComplaint: PropTypes.func.isRequired,
};
