import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { host } from "../../../routes/globalRoutes";

export default function FacilitiesDescriptive({ branch }) {
  const [data, setData] = useState({
    phone_number: "",
    email: "",
    facilites: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${host}/dep/api/information/`);
        const result = await response.json();

        // Filter the data based on the branch
        const branchData = result.find((item) => {
          // Match branch name to ID: CSE: 1, ECE: 2, ME: 3, SM: 4
          switch (branch) {
            case "CSE":
              return item.department === 51;
            case "ECE":
              return item.department === 30;
            case "ME":
              return item.department === 37;
            case "SM":
              return item.department === 53;
            case "DS":
              return item.department === 44;
            case "Natural Science":
              return item.department === 31;
            default:
              return null; // No matching branch found
          }
        });

        // Set the data to state, fallback to "NA" if not found
        setData({
          phone_number: branchData?.phone_number || "NA",
          email: branchData?.email || "NA",
          facilites: branchData?.facilites || "NA",
        });
      } catch (error) {
        console.error("Error fetching information data:", error);
      }
    };

    fetchData();
  }, [branch]); // Adding branch as a dependency

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <div
        style={{
          width: "80%",
          backgroundColor: "#fff",
          padding: "20px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontSize: "14px", color: "#000", fontWeight: "bold" }}>
            Phone Number: {data.phone_number}
          </p>
          <div
            style={{
              height: "1px",
              backgroundColor: "#000",
              width: "100%",
            }}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontSize: "14px", color: "#000", fontWeight: "bold" }}>
            Email: {data.email}
          </p>
          <div
            style={{
              height: "1px",
              backgroundColor: "#000",
              width: "100%",
            }}
          />
        </div>
        <div>
          <p style={{ fontSize: "14px", color: "#000", fontWeight: "bold" }}>
            Facilities Description: {data.facilites}
          </p>
          <div
            style={{
              height: "1px",
              backgroundColor: "#000",
              width: "100%",
            }}
          />
        </div>
      </div>
    </div>
  );
}

FacilitiesDescriptive.propTypes = {
  branch: PropTypes.string.isRequired,
};
