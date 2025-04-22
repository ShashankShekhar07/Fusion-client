import axios from "axios";
import { host } from "../../../routes/globalRoutes/index.jsx";

const API_BASE_URL = `${host}/patentsystem`;

// Helper function to get token
const getAuthToken = () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Authentication token not found. Please log in.");
  }
  return token;
};

// Helper function to validate ID
const validateId = (id, entityName) => {
  if (id === undefined || id === null || id === "") {
    throw new Error(`${entityName} ID is required`);
  }
  // Convert to string for comparison since IDs might come as numbers
  if (String(id) === "undefined") {
    throw new Error(`Invalid ${entityName} ID provided`);
  }
};

export const attorneyService = {
  // Get all attorneys with their application counts
  getAttorneys: async () => {
    try {
      const token = getAuthToken();
      // First get the list of attorneys
      const attorneysResponse = await axios.get(
        `${API_BASE_URL}/pccAdmin/attorneys/`,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      // For each attorney, fetch their application count
      const attorneysWithCounts = await Promise.all(
        attorneysResponse.data.map(async (attorney) => {
          try {
            const applicationsResponse = await axios.get(
              `${API_BASE_URL}/pccAdmin/attorneys/${attorney.id}/applications/`,
              {
                headers: {
                  Authorization: `Token ${token}`,
                  "Content-Type": "application/json",
                },
              },
            );
            return {
              ...attorney,
              assigned_applications_count:
                applicationsResponse.data.assigned_applications_count || 0,
            };
          } catch (error) {
            console.error(
              `Error fetching applications for attorney ${attorney.id}:`,
              error,
            );
            return {
              ...attorney,
              assigned_applications_count: 0,
            };
          }
        }),
      );

      return attorneysWithCounts;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Authentication failed. Please log in again.");
      } else if (error.response?.status === 404) {
        throw new Error(
          "API endpoint not found. Please check the server configuration.",
        );
      }
      console.error("Error fetching attorneys:", error);
      throw error;
    }
  },

  // Get attorney details with applications
  getAttorneyDetails: async (attorneyId) => {
    try {
      validateId(attorneyId, "attorney");
      const token = getAuthToken();

      // Get the attorney details from the main endpoint
      const detailsResponse = await axios.get(
        `${API_BASE_URL}/pccAdmin/attorneys/`,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      // Find the attorney with matching ID and normalize the data structure
      const attorneyDetails = detailsResponse.data.find(
        (attorney) => attorney.id === attorneyId,
      );

      if (!attorneyDetails) {
        throw new Error("Attorney not found");
      }

      // Get the applications data from the applications endpoint
      const applicationsResponse = await axios.get(
        `${API_BASE_URL}/pccAdmin/attorneys/${attorneyId}/applications/`,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      // Combine and normalize the data from both endpoints
      const combinedData = {
        id: attorneyDetails.id,
        name: attorneyDetails.name,
        email: attorneyDetails.email,
        phone: attorneyDetails.phone,
        firm_name: attorneyDetails.firm_name,
        applications: applicationsResponse.data.applications || [],
        assigned_applications_count:
          applicationsResponse.data.assigned_applications_count || 0,
      };

      console.log("Combined attorney details:", combinedData);
      return combinedData;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Authentication failed. Please log in again.");
      } else if (error.response?.status === 404) {
        throw new Error("Attorney not found.");
      }
      console.error("Error fetching attorney details:", error);
      throw error;
    }
  },

  // Update attorney details
  updateAttorney: async (attorneyId, data) => {
    try {
      validateId(attorneyId, "attorney");
      const token = getAuthToken();
      const response = await axios.put(
        `${API_BASE_URL}/pccAdmin/attorneys/${attorneyId}/update/`,
        data,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Authentication failed. Please log in again.");
      } else if (error.response?.status === 404) {
        throw new Error("Attorney not found.");
      }
      console.error("Error updating attorney:", error);
      throw error;
    }
  },

  // Add new attorney
  addAttorney: async (data) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(
        `${API_BASE_URL}/pccAdmin/attorneys/add/`,
        data,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Authentication failed. Please log in again.");
      } else if (error.response?.status === 400) {
        throw new Error("Invalid attorney data. Please check your input.");
      }
      console.error("Error adding attorney:", error);
      throw error;
    }
  },

  // Remove attorney
  removeAttorney: async (attorneyId) => {
    try {
      validateId(attorneyId, "attorney");
      const token = getAuthToken();
      const response = await axios.delete(
        `${API_BASE_URL}/pccAdmin/attorneys/${attorneyId}/remove/`,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Authentication failed. Please log in again.");
      } else if (error.response?.status === 404) {
        throw new Error("Attorney not found.");
      }
      console.error("Error removing attorney:", error);
      throw error;
    }
  },
};
