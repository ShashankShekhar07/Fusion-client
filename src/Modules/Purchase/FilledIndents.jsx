import React, { useState, useEffect } from "react";
import { Table, Button, Text, Box, TextInput, Card } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { CaretUp, CaretDown, ArrowsDownUp } from "@phosphor-icons/react";
import { filedIndentRoute } from "../../routes/purchaseRoutes";

export default function OutboxTable() {
  const [outbox, setOutbox] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const role = useSelector((state) => state.user.role);
  const username = useSelector((state) => state.user.roll_no);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchQuery, setSearchQuery] = useState("");

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    const fetchIndents = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(filedIndentRoute(username), {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        console.log(response.data.results);
        setOutbox(response.data.results);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch indents.");
        setLoading(false);
      }
    };
    fetchIndents();
  }, [username, role]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text style={{ color: "red" }}>{error}</Text>;

  const getStatus = (row) => {
    if (row.head_approval && row.director_approval && !row.financial_approval)
      return "Approved";
    if (row.head_approval && row.director_approval && row.financial_approval)
      return "Completed";
    return "In-Progress";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "In-Progress":
        return "orange";
      case "Completed":
        return "green";
      case "Approved":
        return "blue";
      default:
        return "gray";
    }
  };

  const sortedFiles = [...outbox].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const direction = sortConfig.direction === "asc" ? 1 : -1;
    return a[sortConfig.key] > b[sortConfig.key] ? direction : -direction;
  });

  const filteredFiles = sortedFiles.filter((file) => {
    const idString = `${file.branch}-${new Date(file.upload_date).getFullYear()}-
                      ${(new Date(file.upload_date).getMonth() + 1)
                        .toString()
                        .padStart(2, "0")}
                      -#${file.id}`;
    console.log(file);
    return (
      idString.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.indent_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getStatus(file.status)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
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

  return (
    <Card>
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
          style={{ fontWeight: "bold", textAlign: "center", color: "#1881d9" }}
        >
          All Filed Indents
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
          width: "100%",
          tableLayout: "fixed",
        }}
      >
        <thead>
          {/* <tr>
            <th
              style={{ padding: "12px", textAlign: "center", minWidth: "80px" }}
            >
              File Id
            </th>
            <th
              style={{
                padding: "12px",
                textAlign: "center",
                minWidth: "150px",
              }}
            >
              Indent Name
            </th>
            <th
              style={{
                padding: "12px",
                textAlign: "center",
                minWidth: "180px",
              }}
            >
              Date
            </th>
            <th
              style={{
                padding: "12px",
                textAlign: "center",
                minWidth: "120px",
              }}
            >
              Status
            </th>
            <th
              style={{
                padding: "12px",
                textAlign: "center",
                minWidth: "120px",
              }}
            >
              Features
            </th>
          </tr> */}
          <tr style={{ backgroundColor: "#D9EAF7" }}>
            {[
              { key: "id", label: "File ID" },
              { key: "indent_name", label: "Indent Name" },
              { key: "upload_date", label: "Date" },
              {
                key: "status",
                label: "Status",
              },
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
          {/* {outbox.map((row, index) => {
            const status = getStatus(row.status);
            return (
              <tr
                key={row.id}
                style={{
                  backgroundColor: index % 2 === 0 ? "#f8fafb" : "white",
                }}
              >
                <td style={{ padding: "12px", textAlign: "center" }}>
                  {row.id}
                </td>
                <td style={{ padding: "12px", textAlign: "center" }}>
                  {row.indent_name}
                </td>
                <td style={{ padding: "12px", textAlign: "center" }}>
                  {formatDate(row.upload_date)}
                </td>
                <td
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    color: getStatusColor(status),
                    fontWeight: 500,
                  }}
                >
                  {status}
                </td>
                <td style={{ padding: "12px", textAlign: "center" }}>
                  <Button
                    color="green"
                    onClick={() =>
                      navigate(`/purchase/Employeeviewfiledindent/${row.id}`)
                    }
                  >
                    View
                  </Button>
                </td>
              </tr>
            );
          })} */}
          {filteredFiles && filteredFiles.length > 0 ? (
            filteredFiles.map((row, index) => {
              const status = getStatus(row.status);
              return (
                <tr
                  key={row.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#f8fafb" : "white",
                  }}
                >
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    {row.id}
                  </td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    {row.indent_name}
                  </td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    {formatDate(row.upload_date)}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      color: getStatusColor(status),
                      fontWeight: 500,
                    }}
                  >
                    {status}
                  </td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    <Button
                      color="green"
                      onClick={() =>
                        navigate(`/purchase/Employeeviewfiledindent/${row.id}`)
                      }
                    >
                      View
                    </Button>
                  </td>
                </tr>
              );
            })
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
                <strong>No filed indents found</strong>
                <div
                  style={{ marginTop: "4px", fontSize: "14px", color: "black" }}
                >
                  Once you file an indent, it will show up here.
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Card>
  );
}
