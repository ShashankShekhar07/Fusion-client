import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Title,
  Table,
  Button,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { Archive, Eye, CheckCircle } from "@phosphor-icons/react";
import { useSelector } from "react-redux";
import axios from "axios";
import ViewFileStatus from "./ViewFileStatus";
import {
  getFilesRoute,
  createArchiveRoute,
} from "../../../routes/filetrackingRoutes";

export default function Track() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const token = localStorage.getItem("authToken");
  const role = useSelector((state) => state.user.role);
  const username = useSelector((state) => state.user.roll_no);
  let current_module = useSelector((state) => state.module.current_module);
  current_module = current_module.split(" ").join("").toLowerCase();

  const convertDate = (date) => {
    const d = new Date(date);
    return d.toLocaleString();
  };

  const handleArchive = async (fileID) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post(
        `${createArchiveRoute}`,
        { file_id: fileID },
        {
          params: {
            username,
            designation: role,
            src_module: current_module,
          },
          withCredentials: true,
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      // Remove archived file from the list
      const updatedFiles = files.filter((file) => file.id !== fileID);
      setFiles(updatedFiles);
    } catch (error) {
      console.error("Error archiving file:", error);
    }
  };

  const handleViewFile = (file) => {
    setSelectedFile(file);
  };

  const handleBack = () => {
    setSelectedFile(null);
  };

  useEffect(() => {
    const getFiles = async () => {
      try {
        const response = await axios.get(`${getFilesRoute}`, {
          params: {
            username,
            designation: role,
            src_module: current_module,
          },
          withCredentials: true,
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setFiles(response.data);
      } catch (err) {
        console.error("Error fetching files:", err);
      }
    };
    getFiles();
  }, [username, role, current_module, token]);

  return (
    <>
      {/* Embedded Responsive CSS */}
      <style>{`
        .track-card {
          background-color: #f5f7f8;
          max-width: 100%;
          padding: 1rem;
          overflow-x: hidden;
        }
        
        .main-title {
          font-size: 1.5rem;
        }
        
        .files-container {
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #fff;
          overflow-x: auto;
        }
        
        .table-scroll-wrapper {
          min-width: 300px;
        }
        
        .files-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: auto;
          font-size: 14px;
        }
        
        .files-table th {
          padding: 12px;
          border: 1px solid #ddd;
          background-color: #f8f9fa;
          text-align: center;
          min-width: 120px;
        }
        
        .files-table td {
          padding: 12px;
          border: 1px solid #ddd;
          text-align: center;
          vertical-align: middle;
        }
        
        .archive-icon,
        .view-icon {
          margin: 0 auto;
          transition: background-color 0.3s;
          width: 2rem;
          height: 2rem;
        }
        
        .finish-button {
          transition: background-color 0.3s;
          font-size: 0.9rem;
          padding: 0.5rem;
          white-space: nowrap;
        }
        
        .button-text {
          margin-left: 0.5rem;
        }
        
        /* Responsive Styles */
        @media (max-width: 768px) {
          .main-title {
            font-size: 1.25rem;
          }
        
          .files-table {
            display: block;
            width: 100%;
          }
        
          .files-table thead {
            display: none;
          }
        
          .files-table tbody,
          .files-table tr,
          .files-table td {
            display: block;
            width: 100%;
          }
        
          .files-table tr {
            margin-bottom: 1rem;
            border: 2px solid #ddd;
          }
        
          .files-table td {
            text-align: right;
            padding-left: 50%;
            position: relative;
            border: none;
            border-bottom: 1px solid #ddd;
          }
        
          .files-table td::before {
            content: attr(data-label);
            position: absolute;
            left: 0;
            width: 50%;
            padding-left: 1rem;
            text-align: left;
            font-weight: 600;
          }
        
          /* Fix for action cells */
          .archive-cell,
          .view-cell,
          .file-cell[data-label="Finish"] {
            text-align: center !important;
            padding-left: 1rem !important;
          }
        
          .archive-cell::before,
          .view-cell::before,
          .file-cell[data-label="Finish"]::before {
            display: none;
          }
        
          /* Finish button adjustments */
          .finish-button {
            display: inline-flex;
            align-items: center;
            padding: 0.4rem 0.6rem;
            font-size: 0.85rem;
            max-width: 120px;
          }
        
          .button-text {
            display: inline;
            margin-left: 0.75rem;
          }
        }
        
        @media (max-width: 480px) {
          .track-card {
            padding: 0.5rem;
          }
        
          .files-table td {
            padding: 8px;
            padding-left: 50%;
            font-size: 0.875rem;
          }
        
          /* Adjust finish button for small screens */
          .finish-button {
            padding: 0.3rem 0.5rem;
            font-size: 0.75rem;
            max-width: 100px;
          }
        
          .finish-button .button-text {
            display: inline;
            font-size: 0.7rem;
          }
        }
      `}</style>

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
        className="track-card"
      >
        {!selectedFile && (
          <Title order={2} mb="md" className="main-title">
            Track Files
          </Title>
        )}

        {selectedFile ? (
          <div>
            <Title order={3} mb="md" className="sub-title">
              File Status
            </Title>
            <ViewFileStatus
              onBack={handleBack}
              fileID={selectedFile.id}
              updateFiles={() =>
                setFiles(files.filter((f) => f.id !== selectedFile.id))
              }
            />
          </div>
        ) : (
          <Box className="files-container">
            <div className="table-scroll-wrapper">
              <Table className="files-table">
                <thead>
                  <tr>
                    <th data-label="Archive">Archive</th>
                    <th data-label="File ID">File ID</th>
                    <th data-label="Subject">Subject</th>
                    <th data-label="Date">Date</th>
                    <th data-label="Finish">Finish File</th>
                    <th data-label="View">View File Status</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file, index) => (
                    <tr key={index}>
                      <td className="archive-cell" data-label="Archive">
                        <Tooltip label="Archive file" position="top" withArrow>
                          <ActionIcon
                            variant="light"
                            color="red"
                            onClick={() => handleArchive(file.id)}
                            className="archive-icon"
                          >
                            <Archive size="1rem" />
                          </ActionIcon>
                        </Tooltip>
                      </td>
                      <td className="file-cell" data-label="File ID">
                        {file.id}
                      </td>
                      <td className="file-cell" data-label="Subject">
                        {file.subject}
                      </td>
                      <td className="file-cell" data-label="Date">
                        {convertDate(file.upload_date)}
                      </td>
                      <td className="file-cell" data-label="Finish">
                        <Button
                          color="blue"
                          variant="outline"
                          className="finish-button"
                        >
                          <CheckCircle size={16} />
                          <span className="button-text">Finish File</span>
                        </Button>
                      </td>
                      <td className="view-cell" data-label="View">
                        <ActionIcon
                          variant="outline"
                          color="gray"
                          className="view-icon"
                          onClick={() => handleViewFile(file)}
                        >
                          <Eye size="1rem" />
                        </ActionIcon>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Box>
        )}
      </Card>
    </>
  );
}
