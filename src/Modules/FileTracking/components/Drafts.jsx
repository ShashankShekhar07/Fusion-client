import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Title,
  Table,
  Button,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { Archive, PencilSimple } from "@phosphor-icons/react";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { useSelector } from "react-redux";
import EditDraft from "./EditDraft";
import {
  createArchiveRoute,
  createFileRoute,
  getDraftRoute,
} from "../../../routes/filetrackingRoutes";

export default function Draft() {
  const [files, setFiles] = useState([]);
  const token = localStorage.getItem("authToken");
  const role = useSelector((state) => state.user.role);
  const username = useSelector((state) => state.user.roll_no);
  let current_module = useSelector((state) => state.module.current_module);
  current_module = current_module.split(" ").join("").toLowerCase();

  useEffect(() => {
    const getFiles = async () => {
      try {
        const response = await axios.get(
          `${getDraftRoute}`,

          {
            params: {
              username,
              designation: role,
              src_module: current_module,
            },
            withCredentials: true,
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
        // Set the response data to the files state
        setFiles(response.data);
        console.log(response.data);
      } catch (err) {
        console.error("Error fetching files:", err);
      }
    };

    // Call the getFiles function to fetch data on component mount
    getFiles();
  }, []);
  const [editFile, setEditFile] = useState(null); // File being edited

  const handleArchive = async (fileID) => {
    // eslint-disable-next-line no-unused-vars
    const response = await axios.post(
      `${createArchiveRoute}`,
      {
        file_id: fileID,
      },
      {
        params: {
          username,
          designation: role,
          src_module: current_module,
        },
        withCredentials: true,
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );
    const updatedFiles = files.filter((file) => file.id !== fileID);
    setFiles(updatedFiles);
  };

  const handleDeleteFile = async (fileID) => {
    // eslint-disable-next-line no-unused-vars
    const response = await axios.delete(`${createFileRoute}${fileID}`, {
      withCredentials: true,
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileID));
    notifications.show({
      title: "File deleted",
      message: "The file has been successfully deleted",
      color: "red",
    });
  };

  const handleEditFile = (file) => {
    setEditFile(file); // Set the file to edit mode
  };

  const handleBack = () => {
    setEditFile(null); // Exit edit mode and go back
  };

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
        overflowY: "auto",
      }}
    >
      {!editFile && (
        <Title
          order={2}
          mb="md"
          style={{
            fontSize: "24px",
          }}
        >
          Drafts
        </Title>
      )}

      {editFile ? (
        <EditDraft file={editFile} onBack={handleBack} />
      ) : (
        <Box
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            overflowY: "auto",
            height: "56vh",
            backgroundColor: "#fff",
          }}
        >
          <Table
            highlightOnHover
            style={{
              width: "100%",
              borderCollapse: "collapse",
              tableLayout: "fixed",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#0000" }}>
                <th
                  style={{
                    padding: "12px",
                    width: "8%",
                    border: "1px solid #ddd",
                  }}
                >
                  Archive
                </th>
                {/* <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                  File type
                </th> */}
                <th
                  style={{
                    padding: "12px",
                    width: "12%",
                    border: "1px solid #ddd",
                  }}
                >
                  Being Sent to
                </th>
                <th
                  style={{
                    padding: "12px",
                    width: "12%",
                    border: "1px solid #ddd",
                  }}
                >
                  File ID
                </th>
                <th
                  style={{
                    padding: "12px",
                    width: "33%",
                    border: "1px solid #ddd",
                  }}
                >
                  Subject
                </th>
                <th
                  style={{
                    padding: "12px",
                    width: "12.5%",
                    border: "1px solid #ddd",
                  }}
                >
                  Delete draft
                </th>
                <th
                  style={{
                    padding: "12px",
                    width: "8.5%",
                    border: "1px solid #ddd",
                  }}
                >
                  Edit Draft
                </th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, index) => (
                <tr key={index}>
                  <td
                    style={{
                      padding: "8px",
                      textAlign: "center",
                      border: "1px solid #ddd",
                    }}
                  >
                    <Tooltip label="Archive file" position="top" withArrow>
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => handleArchive(file.id)}
                        style={{
                          transition: "background-color 0.3s",
                          width: "2rem",
                          height: "2rem",
                        }}
                        // eslint-disable-next-line no-return-assign
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#ffebee")
                        }
                        // eslint-disable-next-line no-return-assign
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                      >
                        <Archive size="1rem" />
                      </ActionIcon>
                    </Tooltip>
                  </td>
                  {/* <td
                    style={{
                      padding: "12px",
                      border: "1px solid #ddd",
                      textAlign: "center",
                    }}
                  >
                    {file.fileType}
                  </td> */}
                  <td
                    style={{
                      padding: "12px",
                      border: "1px solid #ddd",
                      textAlign: "center",
                    }}
                  >
                    {file.uploader}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      border: "1px solid #ddd",
                      textAlign: "center",
                    }}
                  >
                    {file.id}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      border: "1px solid #ddd",
                      textAlign: "center",
                    }}
                  >
                    {file.subject}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      border: "1px solid #ddd",
                      textAlign: "center",
                    }}
                  >
                    <Button
                      color="blue"
                      variant="outline"
                      style={{
                        transition: "background-color 0.3s",
                        fontSize: "0.9rem",
                        padding: "0.5rem 1rem",
                      }}
                      // eslint-disable-next-line no-return-assign
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#e3f2fd")
                      }
                      // eslint-disable-next-line no-return-assign
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "white")
                      }
                      onClick={() => handleDeleteFile(file.id)}
                    >
                      Delete file
                    </Button>
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      border: "1px solid #ddd",
                      textAlign: "center",
                      verticalAlign: "middle",
                    }}
                  >
                    <ActionIcon
                      variant="outline"
                      color="black"
                      style={{
                        transition: "background-color 0.3s",
                        width: "2rem",
                        height: "2rem",
                      }}
                      onClick={() => handleEditFile(file)} // Switch to edit mode
                      // eslint-disable-next-line no-return-assign
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#e0e0e0")
                      }
                      // eslint-disable-next-line no-return-assign
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "white")
                      }
                    >
                      <PencilSimple size="1rem" />
                    </ActionIcon>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Box>
      )}
    </Card>
  );
}
