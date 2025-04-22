import axios from "axios";
import { host } from "../../../routes/globalRoutes/index";

const hostAdd = host;

// Function to lodge a complaint
export const lodgeComplaint = async (role, complaintData, token) => {
  const url = role.includes("service_provider")
    ? `${hostAdd}/complaint/service_provider/lodge/`
    : role.includes("caretaker") || role.includes("convener")
      ? `${hostAdd}/complaint/caretaker/lodge/`
      : `${hostAdd}/complaint/user/`;

  try {
    const response = await axios.post(url, complaintData, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    const errorResponse = error.response?.data || error.message;
    return { success: false, error: errorResponse };
  }
};

// Function to fetch complaint details
export const getComplaintDetails = async (complaintId, token) => {
  const url = `${hostAdd}/complaint/caretaker/detail2/${complaintId}/`;

  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    const errorResponse = error.response?.data || error.message;
    return { success: false, error: errorResponse };
  }
};

// Function to fetch complaints by role
export const getComplaintsByRole = async (role, token) => {
  const url = role.includes("service_provider")
    ? `${hostAdd}/complaint/service_provider/`
    : role.includes("caretaker") || role.includes("convener")
      ? `${hostAdd}/complaint/caretaker/`
      : `${hostAdd}/complaint/user/`;

  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    const errorResponse = error.response?.data || error.message;
    return { success: false, error: errorResponse };
  }
};

// Function to fetch complaints for feedback
export const getUserComplaints = async (token) => {
  const url = `${hostAdd}/complaint/user/`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    const errorResponse = error.response?.data || error.message;
    return { success: false, error: errorResponse };
  }
};

// Function to fetch complaint report data based on filters
export const getComplaintReport = async (filters, token) => {
  const url = `${hostAdd}/complaint/generate-report/`;

  try {
    const response = await axios.get(url, {
      params: filters,
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    const errorResponse = error.response?.data || error.message;
    return { success: false, error: errorResponse };
  }
};

// Function to forward a complaint
export const forwardComplaint = async (complaintId, token) => {
  const url = `${host}/complaint/caretaker/${complaintId}/`;

  try {
    const response = await axios.post(
      url,
      {},
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      },
    );
    return { success: true, data: response };
  } catch (error) {
    const errorResponse = error.response?.data || error.message;
    return { success: false, error: errorResponse };
  }
};

// Function to update complaint status
export const updateComplaintStatus = async (complaintId, formData, token) => {
  console.log("Received Data in API Function:", formData);

  const url = `${host}/complaint/caretaker/pending/${complaintId}/`;

  try {
    const response = await axios.post(url, formData, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("API Response:", response.data);
    return { success: true, data: response.data };
  } catch (error) {
    const errorResponse = error.response?.data || error.message;
    console.error("Error from API:", errorResponse);
    return { success: false, error: errorResponse };
  }
};

export const submitFeedback = async (complaintId, feedbackData, token) => {
  const url = `${host}/complaint/user/${complaintId}/`;

  try {
    const response = await axios.post(url, feedbackData, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    const errorResponse = error.response?.data || error.message;
    return { success: false, error: errorResponse };
  }
};
