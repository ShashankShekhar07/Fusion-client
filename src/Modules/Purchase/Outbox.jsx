import React, { useState, useEffect } from "react";
import { Table, Button, Text, Box, Flex, TextInput, Card } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { CaretUp, CaretDown, ArrowsDownUp } from "@phosphor-icons/react";
import { outboxViewRoute2 } from "../../routes/purchaseRoutes";

export default function Outboxfunc() {
  const [outbox, setOutbox] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const role = useSelector((state) => state.user.role);
  const username = useSelector((state) => state.user.roll_no);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchIndents = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(outboxViewRoute2(username, role), {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setOutbox(response.data.in_file);
        console.log(response.data.in_file);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch indents.");
        setLoading(false);
      }
    };

    fetchIndents();
  }, []);

  const sortedFiles = [...outbox].sort((a, b) => {
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
        .includes(searchQuery.toLowerCase()) ||
      file.receiver_designation
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      file.receiver.toLowerCase().includes(searchQuery.toLowerCase())
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
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{
        backgroundColor: "#F5F7F8",
        position: "absolute",
        height: "70vh",
        width: "90vw",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
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
          Outbox
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
          {/* <tr style={{ textAlign: "center" }}>
            <th
              style={{
                backgroundColor: "white",
                padding: "12px",
                textAlign: "center",
              }}
            >
              Send to
            </th>
            <th
              style={{
                backgroundColor: "white",
                padding: "12px",
                textAlign: "center",
              }}
            >
              File Id
            </th>
            <th
              style={{
                backgroundColor: "white",
                padding: "12px",
                textAlign: "center",
              }}
            >
              Subject
            </th>
            <th
              style={{
                backgroundColor: "white",
                padding: "12px",
                textAlign: "center",
              }}
            >
              Date
            </th>
            <th
              style={{
                backgroundColor: "white",
                padding: "12px",
                textAlign: "center",
              }}
            >
              Features
            </th>
          </tr> */}
          <tr style={{ backgroundColor: "#0000" }}>
            {[
              { key: "Indent id", label: "File ID" },
              { key: "uploader", label: "Uploader" },
              { key: "receiver", label: "Sent to" },
              {
                key: "receiver_designation",
                label: "Receiver's Designation",
              },
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
            filteredFiles.map((row, index) => (
              <tr
                key={row.id}
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
                  {row.id}
                </td>
                <td
                  style={{
                    padding: "12px",
                    border: "1px solid #ddd",
                    textAlign: "center",
                  }}
                >
                  {row.uploader}
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  <Text weight={500}>{row.receiver}</Text>
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  <Text weight={500}>{row.receiver_designation}</Text>
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  {row.subject === "" ? "No Subject" : row.subject}
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  {formatDate(row.upload_date)}
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  <Flex
                    direction="row"
                    gap="md"
                    justify="center"
                    align="center"
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                  >
                    <Button
                      color="green"
                      style={{ marginRight: "8px" }}
                      onClick={() =>
                        navigate(`/purchase/Employeeviewfiledindent/${row.id}`)
                      }
                    >
                      View
                    </Button>
                  </Flex>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="7"
                style={{
                  textAlign: "center",
                  padding: "24px",
                  color: "black",
                  fontSize: "16px",
                }}
              >
                <strong>No indent found</strong>
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
    </Card>
  );
}
