import React, { useState, useEffect } from "react";
import {
  Button,
  ScrollArea,
  Table,
  Text,
  Container,
  Paper,
  LoadingOverlay,
} from "@mantine/core";
import AttorneyForm from "./AttorneyDetailsForm.jsx";
import NewAttorneyForm from "./AddNewAttorneyForm.jsx";
import "../../../style/Pcc_Admin/ManageAttorneys.css";
import { attorneyService } from "../../../services/attorneyService.jsx";

function ManageAttorneys() {
  const [attorneys, setAttorneys] = useState([]);
  const [selectedAttorney, setSelectedAttorney] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRemovalMode, setIsRemovalMode] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isAddingNewAttorney, setIsAddingNewAttorney] = useState(false);

  const fetchAttorneys = async () => {
    try {
      setIsLoading(true);
      const data = await attorneyService.getAttorneys();
      setAttorneys(data);
      setError(null);
    } catch (err) {
      if (err.message.includes("Authentication failed")) {
        setError("Please log in to view attorneys");
      } else if (err.message.includes("API endpoint not found")) {
        setError("Server configuration error. Please contact support.");
      } else if (err.message.includes("Network Error")) {
        setError(
          "Unable to connect to the server. Please check your internet connection.",
        );
      } else {
        setError(
          err.message || "Failed to fetch attorneys. Please try again later.",
        );
      }
      console.error("Error details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttorneys();
  }, []);

  const handleViewDetails = (attorney) => {
    setSelectedAttorney(attorney);
    setIsAddingNewAttorney(false);
  };

  const handleBackToList = () => {
    setSelectedAttorney(null);
    setIsAddingNewAttorney(false);
  };

  const handleAddAttorney = async (newAttorney) => {
    try {
      setIsLoading(true);
      await attorneyService.addAttorney(newAttorney);
      await fetchAttorneys(); // Refresh the list after adding
      setIsAddingNewAttorney(false); // Close the form
      setError(null);
    } catch (err) {
      setError(`Failed to add attorney: ${err.message || "Unknown error"}`);
      console.error("Error adding attorney:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNewClick = () => {
    setIsAddingNewAttorney(true);
    setSelectedAttorney(null);
  };

  const handleRemoveAttorneys = async () => {
    try {
      setIsLoading(true);
      const removalPromises = Array.from(selectedRows).map((id) =>
        attorneyService.removeAttorney(id),
      );
      await Promise.all(removalPromises);
      await fetchAttorneys();
      setSelectedRows(new Set());
      setIsRemovalMode(false);
    } catch (err) {
      setError("Failed to remove attorneys");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRemovalMode = () => {
    setIsRemovalMode(!isRemovalMode);
    if (!isRemovalMode) {
      setSelectedRows(new Set());
    }
  };

  const handleRowSelect = (id) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(id)) {
      newSelectedRows.delete(id);
    } else {
      newSelectedRows.add(id);
    }
    setSelectedRows(newSelectedRows);
  };

  if (isLoading) {
    return <LoadingOverlay visible />;
  }

  if (error) {
    return <Text color="red">{error}</Text>;
  }

  if (selectedAttorney) {
    return (
      <AttorneyForm
        attorneyId={selectedAttorney.id}
        onBack={handleBackToList}
      />
    );
  }

  if (isAddingNewAttorney) {
    return (
      <NewAttorneyForm onSubmit={handleAddAttorney} onBack={handleBackToList} />
    );
  }

  return (
    <Container className="manage-attorneys-container">
      {!selectedAttorney ? (
        <>
          <Text className="page-heading-title">Manage Attorney Details</Text>

          {/* Action Buttons */}
          <div className="button-group">
            <Button
              variant="outline"
              color="blue"
              onClick={handleAddNewClick}
              className="add-new-attorney-button"
            >
              + Add New Attorney
            </Button>

            <Button
              variant="outline"
              color="red"
              onClick={toggleRemovalMode}
              className="remove-attorney-button"
            >
              {isRemovalMode ? "Cancel Remove" : "Remove Attorney"}
            </Button>
          </div>

          <Paper className="manage-attorney-table-card">
            <ScrollArea>
              <Table
                highlightOnHover
                striped
                withBorder
                className="manage-attorney-styledTable"
              >
                <thead className="fusionTableHeader">
                  <tr>
                    {isRemovalMode && <th>Select</th>}
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Firm Name</th>
                    <th>Assigned Cases</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {attorneys.map((attorney) => (
                    <tr key={attorney.id}>
                      {isRemovalMode && (
                        <th>
                          <label htmlFor={`select-attorney-${attorney.id}`}>
                            <input
                              id={`select-attorney-${attorney.id}`}
                              type="checkbox"
                              className={{
                                display: "flex",
                                margin: "auto",
                              }}
                              checked={selectedRows.has(attorney.id)}
                              onChange={() => handleRowSelect(attorney.id)}
                            />
                            {/* <span className="visually-hidden">
                              Select Attorney
                            </span> */}
                          </label>
                        </th>
                      )}
                      <td>{attorney.attorney_name || attorney.name}</td>
                      <td>{attorney.email}</td>
                      <td>{attorney.phone || "Not Available"}</td>
                      <td>{attorney.firm_name || "Not Available"}</td>
                      <td style={{ textAlign: "center" }}>
                        {attorney.assigned_applications_count}
                      </td>
                      <td>
                        <Button
                          variant="subtle"
                          color="blue"
                          onClick={() => handleViewDetails(attorney)}
                          className="view-details-button"
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </ScrollArea>
          </Paper>

          {/* Remove Selected Button */}
          {isRemovalMode && selectedRows.size > 0 && (
            <Button
              variant="filled"
              color="red"
              onClick={handleRemoveAttorneys}
              className="remove-selected-button"
            >
              Remove Selected ({selectedRows.size})
            </Button>
          )}
        </>
      ) : (
        // Detailed view of selected attorney
        <AttorneyForm
          attorneyId={selectedAttorney.id}
          onBack={handleBackToList}
        />
      )}
    </Container>
  );
}

export default ManageAttorneys;
