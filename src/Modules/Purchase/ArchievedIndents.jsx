import React, { useState, useEffect } from "react";
import {
  MantineProvider,
  Table,
  Button,
  Text,
  Box,
  TextInput,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { CaretUp, CaretDown, ArrowsDownUp } from "@phosphor-icons/react";
import { archiveViewRoute } from "../../routes/purchaseRoutes";

function ArchievedTable() {
  const [indents, setIndents] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const username = useSelector((state) => state.user.roll_no);
  const role = useSelector((state) => state.user.role);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchQuery, setSearchQuery] = useState("");
  console.log(role);
  useEffect(() => {
    const fetchIndents = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(archiveViewRoute(username, role), {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        console.log(response.data.archieves);
        setIndents(response.data.archieves);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch indents.");
        setLoading(false);
      }
    };

    fetchIndents();
  }, []);

  const sortedFiles = [...indents].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const direction = sortConfig.direction === "asc" ? 1 : -1;
    return a[sortConfig.key] > b[sortConfig.key] ? direction : -direction;
  });

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // Optional: Change to 24-hour format if needed
    });
  };

  const filteredFiles = sortedFiles.filter((file) => {
    const idString = `${file.branch}-${new Date(file.upload_date).getFullYear()}-
                      ${(new Date(file.upload_date).getMonth() + 1)
                        .toString()
                        .padStart(2, "0")}
                      -#${file.id}`;
    return (
      idString.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.uploader.toLowerCase().includes(searchQuery.toLowerCase()) ||
      formatDate(file.upload_date)
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text style={{ color: "red" }}>{error}</Text>;
  }
  return (
    <Box p="md" style={{ margin: 0 }}>
      {" "}
      {/* Removed margin-top completely */}
      <Box
        mb="md"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          size="26px"
          style={{
            fontWeight: "bold",
            textAlign: "center",
            color: "#1881d9",
          }}
        >
          Archived Indents
        </Text>
        <TextInput
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: "10px", marginLeft: "auto" }}
        />
      </Box>
      <Table
        style={{
          backgroundColor: "#f3f9ff",
          borderRadius: "8px",
          overflow: "hidden",
          border: "1px solid #E0E0E0",
        }}
      >
        <thead>
          {/* <tr>
            <th style={{ backgroundColor: "#D9EAF7", padding: "12px" }}>
              Received as
            </th>
            <th style={{ backgroundColor: "#D9EAF7", padding: "12px" }}>
              File Id
            </th>
            <th style={{ backgroundColor: "#D9EAF7", padding: "12px" }}>
              Subject
            </th>
            <th style={{ backgroundColor: "#D9EAF7", padding: "12px" }}>
              Date
            </th>
            <th style={{ backgroundColor: "#D9EAF7", padding: "12px" }}>
              Features
            </th>
          </tr> */}
          <tr style={{ backgroundColor: "#D9EAF7" }}>
            {[
              { key: "id", label: "File ID" },
              { key: "uploader", label: "Uploader" },
              { key: "subject", label: "Subject" },
              { key: "upload_date", label: "Date" },
            ].map(({ key, label }) => (
              <th
                key={key}
                onClick={() => handleSort(key)}
                style={{
                  cursor: "pointer",
                  padding: "12px",
                  width: "15.5%",
                  border: "1px solid #D9EAF7",
                  alignItems: "center",
                  gap: "5px",
                  textAlign: "center",
                }}
              >
                {label}
                {sortConfig.key === key ? (
                  sortConfig.direction === "asc" ? (
                    <CaretUp size={16} />
                  ) : (
                    <CaretDown size={16} />
                  )
                ) : (
                  <ArrowsDownUp size={16} opacity={0.6} />
                )}
              </th>
            ))}
            <th
              style={{
                padding: "12px",
                width: "8.5%",
                border: "1px solid #ddd",
              }}
            >
              View File
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredFiles && filteredFiles.length > 0 ? (
            filteredFiles.map((booking, index) => (
              <tr
                key={booking.id}
                style={{
                  backgroundColor: index % 2 === 0 ? "#f8fafb" : "white",
                }}
              >
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  {booking.id}
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  {booking.uploader}
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  {booking.subject}
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  {formatDate(booking.upload_date)}
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  <Button
                    color="green"
                    style={{ marginRight: "8px" }}
                    onClick={() =>
                      navigate(
                        `/purchase/employeeviewfiledindent/${booking.id}`,
                      )
                    }
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="5"
                style={{
                  textAlign: "center",
                  padding: "24px",
                  color: "black",
                  fontSize: "16px",
                }}
              >
                <strong>No archived indents yet</strong>
                <div
                  style={{ marginTop: "4px", fontSize: "14px", color: "black" }}
                >
                  Start by creating one to see it listed here.
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Box>
  );
}

function Archieved() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          overflow: "auto",
        }}
      >
        <Box
          style={{
            maxWidth: "1440px",
            width: "100%",
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "16px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            overflowX: "auto",
            overflowY: "auto",
            maxHeight: "80vh",
          }}
        >
          <ArchievedTable />
        </Box>
      </Box>
    </MantineProvider>
  );
}

export default Archieved;
