import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import PropTypes from "prop-types";
import {
  TextInput,
  Textarea,
  Button,
  Container,
  Title,
  Table,
  Divider,
} from "@mantine/core";
import { host } from "../../../routes/globalRoutes";

function GoBackButton({ setIsEditing }) {
  return (
    <div>
      <button
        onClick={() => setIsEditing(false)}
        style={{
          padding: "5px 10px",
          backgroundColor: "indigo",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Go Back
      </button>
    </div>
  );
}

// Prop validation for GoBackButton
GoBackButton.propTypes = {
  setIsEditing: PropTypes.func.isRequired,
};

export default function EditFacilities({ setIsEditing, branch }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [facilitiesDescription, setFacilitiesDescription] = useState("");
  const [loading, setLoading] = useState(false); // To manage loading state
  const [errorMessage, setErrorMessage] = useState(""); // To handle errors
  const [isSuccess, setIsSuccess] = useState(false); // To handle success message

  // States for the Edit Labs form
  const [labName, setLabName] = useState("");
  const [labCapacity, setLabCapacity] = useState("");
  const [labLocation, setLabLocation] = useState("");
  const [labLoading, setLabLoading] = useState(false); // To manage loading state for labs
  const [setLabErrorMessage] = useState(""); // To handle errors for labs
  const [labIsSuccess, setLabIsSuccess] = useState(false); // To handle success message for labs

  // State for labs data
  const [labs, setLabs] = useState([]);
  const [selectedLabs, setSelectedLabs] = useState([]); // State to store selected labs for potential deletion

  // Fetch the labs data when the component mounts
  useEffect(() => {
    const fetchLabs = async () => {
      const token = localStorage.getItem("authToken"); // Get token from local storage

      try {
        const response = await axios.get(`${host}/dep/api/labs/`, {
          headers: {
            Authorization: `Token ${token}`, // Include the token in the headers
          },
        });
        // Filter labs by the current branch
        setLabs(response.data.filter((lab) => lab.department === branch));
      } catch (error) {
        console.error("Error fetching labs:", error);
      }
    };

    fetchLabs(); // Call the function to fetch labs
  }, [branch]); // Run when branch changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    const token = localStorage.getItem("authToken"); // Get token from local storage

    // Construct the data to be sent for facilities
    const data = {
      phone_number: phoneNumber,
      email,
      facilites: facilitiesDescription, // Ensure the spelling matches your API's expectations
      department: branch === "DS" ? "Design" : branch, // Include the branch in the request
    };

    try {
      // Make the API request using PUT method
      await axios.put(`${host}/dep/api/information/update-create/`, data, {
        headers: {
          Authorization: `Token ${token}`, // Include the token in the headers
        },
      });

      setIsSuccess(true); // Set success state

      // Reset the form fields
      setPhoneNumber("");
      setEmail("");
      setFacilitiesDescription("");
    } catch (error) {
      const errorResponse = error.response?.data || error.message;
      setErrorMessage(
        errorResponse.detail || "Error updating data. Please try again.",
      );
      console.error("Error updating data:", errorResponse);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleLabSubmit = async (e) => {
    e.preventDefault();
    setLabLoading(true); // Start loading for lab submission

    const token = localStorage.getItem("authToken"); // Get token from local storage

    // Construct the data to be sent for lab
    const labData = {
      name: labName,
      capacity: labCapacity,
      location: labLocation,
      department: branch, // Include the branch in the request
    };

    try {
      // Make the API request using POST method
      await axios.post(`${host}/dep/api/labsadd/`, labData, {
        headers: {
          Authorization: `Token ${token}`, // Include the token in the headers
        },
      });

      setLabIsSuccess(true); // Set success state for lab submission

      // Reset the form fields
      setLabName("");
      setLabCapacity("");
      setLabLocation("");
      // Re-fetch labs to update the table after adding a new lab
      const responseLabs = await axios.get(`{host}/dep/api/labs/`, {
        headers: {
          Authorization: `Token ${token}`, // Include the token in the headers
        },
      });
      setLabs(responseLabs.data.filter((lab) => lab.department === branch));
    } catch (error) {
      const errorResponse = error.response?.data || error.message;
      setLabErrorMessage(
        errorResponse.detail || "Error adding lab. Please try again.",
      );
      console.error("Error adding lab:", errorResponse);
    } finally {
      setLabLoading(false); // Stop loading for lab submission
    }
  };

  const handleLabSelection = (labId) => {
    setSelectedLabs((prev) =>
      prev.includes(labId)
        ? prev.filter((id) => id !== labId)
        : [...prev, labId],
    );
  };

  const handleDeleteLabs = async () => {
    if (selectedLabs.length === 0) {
      alert("No labs selected for deletion.");
      return; // Exit if no labs are selected
    }

    const token = localStorage.getItem("authToken"); // Get token from local storage

    try {
      await axios.delete(`${host}/dep/api/labs/delete/`, {
        headers: {
          Authorization: `Token ${token}`, // Include the token in the headers
        },
        data: {
          lab_ids: selectedLabs, // Send the selected lab IDs as an array
        },
      });

      // Re-fetch labs to update the table after deletion
      const responseLabs = await axios.get(`${host}/dep/api/labs/`, {
        headers: {
          Authorization: `Token ${token}`, // Include the token in the headers
        },
      });
      setLabs(responseLabs.data.filter((lab) => lab.department === branch));

      // Reset selected labs
      setSelectedLabs([]);
    } catch (error) {
      const errorResponse = error.response?.data || error.message;
      setErrorMessage(
        errorResponse.detail || "Error deleting labs. Please try again.",
      );
      console.error("Error deleting labs:", errorResponse);
    }
  };

  return (
    <div>
      <GoBackButton setIsEditing={setIsEditing} />
      <Container
        style={{
          padding: "20px",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column", // Set to column for the GoBackButton and Title
        }}
      >
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        {/* Flex container for horizontal layout */}
        <div style={{ display: "flex", gap: "20px" }}>
          {/* Facilities Form */}
          <form
            onSubmit={handleSubmit}
            style={{
              flex: "1",
              border: "1px solid #ccc",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <Title order={6} style={{ marginBottom: "20px" }}>
              Information
            </Title>
            <TextInput
              label="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              style={{ marginBottom: "15px" }}
            />
            <TextInput
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ marginBottom: "15px" }}
            />
            <Textarea
              label="Facilities Description"
              value={facilitiesDescription}
              onChange={(e) => setFacilitiesDescription(e.target.value)}
              style={{ marginBottom: "15px" }}
            />
            <Button
              type="submit"
              loading={loading}
              style={{ marginTop: "15px", backgroundColor: "indigo" }}
            >
              Update
            </Button>
            {isSuccess && (
              <p style={{ color: "green" }}>Facilities updated successfully!</p>
            )}
          </form>

          {/* Labs Form */}
          <form
            onSubmit={handleLabSubmit}
            style={{
              flex: "1",
              border: "1px solid #ccc",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <Title order={6} style={{ marginBottom: "20px" }}>
              Add Lab
            </Title>
            <TextInput
              label="Lab Name"
              value={labName}
              onChange={(e) => setLabName(e.target.value)}
              style={{ marginBottom: "15px" }}
            />
            <TextInput
              label="Lab Capacity"
              value={labCapacity}
              onChange={(e) => setLabCapacity(e.target.value)}
              style={{ marginBottom: "15px" }}
            />
            <TextInput
              label="Lab Location"
              value={labLocation}
              onChange={(e) => setLabLocation(e.target.value)}
              style={{ marginBottom: "15px" }}
            />
            <Button
              type="submit"
              loading={labLoading}
              style={{ marginTop: "35px", backgroundColor: "indigo" }}
            >
              Add Lab
            </Button>
            {labIsSuccess && (
              <p style={{ color: "green" }}>Lab added successfully!</p>
            )}
          </form>
        </div>

        <Divider style={{ margin: "20px 0" }} />

        <Title order={6} style={{ marginBottom: "20px" }}>
          Labs
        </Title>
        <Table>
          <thead>
            <tr>
              <br />
              <th>Lab Name</th>
              <th>Capacity</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {labs.map((lab) => (
              <tr key={lab.id}>
                <td>
                  <label htmlFor={`lab-${lab.id}`}>
                    <input
                      type="checkbox"
                      id={`lab-${lab.id}`}
                      checked={selectedLabs.includes(lab.id)}
                      onChange={() => handleLabSelection(lab.id)}
                    />
                    {lab.name}
                  </label>
                </td>
                <td>{lab.name}</td>
                <td>{lab.capacity}</td>
                <td>{lab.location}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button
          onClick={handleDeleteLabs}
          disabled={selectedLabs.length === 0} // Disable if no labs are selected
          style={{ marginTop: "20px", backgroundColor: "indigo" }}
        >
          Delete Selected Labs
        </Button>
      </Container>
    </div>
  );
}

EditFacilities.propTypes = {
  setIsEditing: PropTypes.bool.isRequired,
  branch: PropTypes.string.isRequired,
};
