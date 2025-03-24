import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios"; // Import axios
import PropTypes from "prop-types";
import FacilitiesDescriptive from "./FacilitiesDescriptive.jsx";
import EditFacilities from "./EditFacilities.jsx";
import SpecialTable from "./SpecialTable.jsx"; // Make sure to keep this import
import { host } from "../../../routes/globalRoutes/index.jsx";

const columns = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "capacity",
    header: "Capacity",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
];

function Facilities({ branch }) {
  const [isEditing, setIsEditing] = useState(false); // State to manage editing
  const role = useSelector((state) => state.user.role);
  const [labs, setLabs] = useState([]); // State to store labs data
  const [setSelectedLabs] = useState([]); // State to store selected labs

  useEffect(() => {
    // Fetch the lab data from the API
    const fetchLabs = async () => {
      const token = localStorage.getItem("authToken"); // Get the token from local storage

      try {
        const response = await axios.get(`${host}/dep/api/labs/`, {
          headers: {
            Authorization: `Token ${token}`, // Include the token in the headers
          },
        });
        setLabs(response.data); // Set labs data from the response
      } catch (error) {
        console.error("Error fetching labs:", error);
      }
    };

    fetchLabs(); // Call the function to fetch labs
  }, []); // Empty dependency array to run once on mount

  // Filter labs based on branch
  const filteredLabs = labs.filter((lab) => lab.department === branch);

  const handleEditClick = () => {
    setIsEditing(true); // Set editing mode to true when edit button is clicked
  };

  // Determine if the edit button should be shown based on branch and role
  const isEditButtonVisible = () => {
    const allowedRoles = ["HOD", "admin"];
    const rolePrefix = role.split(" ")[0]; // Get the prefix of the role, e.g., "HOD" or "admin"

    // Check if the role is allowed for the specific branch
    switch (branch) {
      case "CSE":
        return allowedRoles.includes(rolePrefix) && role.includes("(CSE)");
      case "ECE":
        return allowedRoles.includes(rolePrefix) && role.includes("(ECE)");
      case "SM":
        return allowedRoles.includes(rolePrefix) && role.includes("(SM)");
      case "ME":
        return allowedRoles.includes(rolePrefix) && role.includes("(ME)");
      case "DS":
        return allowedRoles.includes(rolePrefix) && role.includes("(Design)");
      case "Natural Science":
        return allowedRoles.includes(rolePrefix) && role.includes("(NS)");
      default:
        return false;
    }
  };

  return (
    <div>
      {isEditing ? ( // Conditionally render the EditFacilities component
        <EditFacilities branch={branch} setIsEditing={setIsEditing} />
      ) : (
        <>
          <FacilitiesDescriptive branch={branch} />
          <div
            style={{
              overflowX: "auto", // Enable horizontal scrolling
              width: "100%", // Ensure the container takes the full width
              marginTop: "10px", // Add some spacing
            }}
          >
            <SpecialTable
              title="Labs"
              columns={columns}
              data={filteredLabs} // Feed the filtered labs based on the branch
              rowOptions={["3", "4", "6"]}
              onRowSelectionChange={setSelectedLabs} // Assuming the SpecialTable accepts this prop
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              marginBottom: "10px",
              marginTop: "10px",
            }}
          >
            {isEditButtonVisible() && ( // Check if the edit button should be visible
              <button
                onClick={handleEditClick} // Call handleEditClick on button click
                style={{
                  padding: "5px 20px",
                  backgroundColor: "rgb(21, 171, 255)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Edit
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Facilities;

Facilities.propTypes = {
  branch: PropTypes.string.isRequired,
};
