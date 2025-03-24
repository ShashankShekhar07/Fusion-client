import React, { useEffect, useState } from "react";
import { Box, Card, Title, Table, ActionIcon, Tooltip } from "@mantine/core";
import { Archive, Eye } from "@phosphor-icons/react";
import axios from "axios";
import { useSelector } from "react-redux";
import View from "./ViewFile";
import {
  getFilesRoute,
  createArchiveRoute,
} from "../../../routes/filetrackingRoutes";

export default function Inboxfunc() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const token = localStorage.getItem("authToken");
  const role = useSelector((state) => state.user.role);
  const username = useSelector((state) => state.user.roll_no);
  let current_module = useSelector((state) => state.module.current_module);
  current_module = current_module.split(" ").join("").toLowerCase();

  // Helper function to convert dates
  const convertDate = (date) => {
    const d = new Date(date);
    return d.toLocaleString();
  };

  // Fetch files on component mount
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
        console.log(response.data);
      } catch (err) {
        console.error("Error fetching files:", err);
      }
    };

    getFiles();
  }, [username, role, current_module, token]);

  // Archive file handler
  const handleArchive = async (fileID) => {
    try {
      await axios.post(
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

  const handleBack = () => {
    setSelectedFile(null);
  };

  // Using e.currentTarget ensures the style is applied to the ActionIcon element
  const handleMouseEnter = (e) => {
    e.currentTarget.style.backgroundColor = e.currentTarget.dataset.hoverColor;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.backgroundColor =
      e.currentTarget.dataset.defaultColor;
  };

  return (
    <>
      {/* Embedded Responsive CSS */}
      <style>{`
        .inbox-card {
          background-color: #f5f7f8;
          max-width: 100%;
          padding: 1rem;
          overflow-x: hidden;
        }
        
        .main-title {
          font-size: 24px;
        }
        
        .view-title {
          font-size: 26px;
          text-align: center;
        }
        
        .files-container {
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow-y: scroll;
          height: 100vh;
          background-color: #fff;
        }
        
        .table-scroll-wrapper {
          min-width: 300px;
        }
        
        .files-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          font-size: 14px;
          text-align: center;
        }
        
        .files-table th {
          padding: 12px;
          border: 1px solid #ddd;
          background-color: #f8f9fa;
          text-align: center;
          min-width: 100px;
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
        
        /* Responsive Styles */
        @media (max-width: 768px) {
          .main-title {
            font-size: 20px;
          }
          
          .view-title {
            font-size: 22px;
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
          
          /* For textual data cells: align text to right with header labels */
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
            width: 45%;
            padding-left: 1rem;
            text-align: left;
            font-weight: 600;
          }
          
          /* For Archive and View File cells: do not display header labels and center the content */
          .archive-cell::before,
          .view-cell::before {
            content: "";
          }
          .archive-cell,
          .view-cell {
            text-align: center !important;
            padding-left: 0 !important;
          }
        }
        
        @media (max-width: 480px) {
          .inbox-card {
            padding: 0.5rem;
          }
          .files-table td {
            padding: 8px;
            padding-left: 50%;
            font-size: 0.875rem;
          }
        }
      `}</style>

      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        className="inbox-card"
        style={{
          backgroundColor: "#F5F7F8",
          position: "absolute",
          height: "70vh",
          width: "90vw",
          overflowY: "auto",
        }}
      >
        {!selectedFile && (
          <Title order={2} mb="md" className="main-title">
            Inbox
          </Title>
        )}

        {selectedFile ? (
          <div>
            <Title order={3} mb="md" className="view-title">
              File Subject
            </Title>
            <View
              onBack={handleBack}
              fileID={selectedFile.id}
              updateFiles={() =>
                setFiles(files.filter((f) => f.id !== selectedFile.id))
              }
            />
          </div>
        ) : (
          <Box
            className="files-container"
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              overflowY: "scroll",
              height: "57vh",
              backgroundColor: "#fff",
            }}
          >
            <div className="table-scroll-wrapper">
              <Table className="files-table" highlightOnHover>
                <thead>
                  <tr>
                    {/* In responsive view, leave header labels empty for Archive and View File */}
                    <th data-label="">Archive</th>
                    <th data-label="Sent By">Sent By</th>
                    <th data-label="File ID">File ID</th>
                    <th data-label="Subject">Subject</th>
                    <th data-label="Date">Date</th>
                    <th data-label="">View File</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file, index) => (
                    <tr key={index}>
                      <td className="archive-cell" data-label="">
                        <Tooltip label="Archive file" position="top" withArrow>
                          <ActionIcon
                            variant="light"
                            color="blue"
                            className="archive-icon"
                            data-default-color="transparent"
                            data-hover-color="#ffebee"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => handleArchive(file.id)}
                          >
                            <Archive size="1rem" />
                          </ActionIcon>
                        </Tooltip>
                      </td>
                      <td className="uploader-cell" data-label="Sent By">
                        {file.uploader}
                      </td>
                      <td className="file-cell" data-label="File ID">
                        {file.id}
                      </td>
                      <td className="subject-cell" data-label="Subject">
                        {file.subject}
                      </td>
                      <td className="date-cell" data-label="Date">
                        {convertDate(file.upload_date)}
                      </td>
                      <td className="view-cell" data-label="">
                        <ActionIcon
                          variant="outline"
                          color="black"
                          className="view-icon"
                          data-default-color="white"
                          data-hover-color="#e0e0e0"
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                          onClick={() => setSelectedFile(file)}
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
