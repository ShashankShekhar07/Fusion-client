import axios from "axios";
import { host } from "../../../routes/globalRoutes/index.jsx";

const API_BASE = `${host}/patentsystem`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    headers: {
      Authorization: `Token ${token}`,
    },
  };
};

export const fetchDocuments = async () => {
  const response = await axios.get(`${API_BASE}/documents/`, getAuthHeaders());
  return response.data;
};

export const addDocument = async (document) => {
  try {
    const response = await axios.post(
      `${API_BASE}/documents/`,
      document,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error adding document:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const deleteDocument = async (id) => {
  await axios.delete(
    `${API_BASE}/pccAdmin/documents/${id}/delete/`,
    getAuthHeaders(),
  );
};
