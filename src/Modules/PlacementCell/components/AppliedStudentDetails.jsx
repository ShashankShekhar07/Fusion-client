import React, { useEffect, useState, useMemo } from "react";
import {
  Select,
  Title,
  Container,
  Button,
  Loader,
  Alert,
  Paper,
  Flex,
} from "@mantine/core";
import axios from "axios";
import { MantineReactTable } from "mantine-react-table";
import { notifications } from "@mantine/notifications";
import {
  downloadExcelRoute,
  fetchApplicationsRoute,
  handleStatusChangeRoute,
  fetchFormFieldsRoute,
} from "../../../routes/placementCellRoutes";
import { DatePickerInput } from "@mantine/dates";

function JobApplicationsTable() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState([]);
  const recordsPerPage = 10;

  const jobId = new URLSearchParams(window.location.search).get("jobId");

  // Fetch applications and fields on component mount
  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem("authToken");
      try {
        setLoading(true);
        const response = await axios.get(`${fetchApplicationsRoute}${jobId}/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setApplications(response.data.students);
      } catch (error) {
        notifications.show({
          title: "Error",
          message: "Failed to fetch applications.",
          color: "red",
        });
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchFieldsList = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await axios.get(fetchFormFieldsRoute, {
          headers: { Authorization: `Token ${token}` },
          params: { jobId },
        });
        if (response.status === 200) {
          setFields(response.data);
        }
      } catch (error) {
        notifications.show({
          title: "Error",
          message: "Failed to fetch fields list.",
          color: "red",
        });
        console.error("Error fetching fields list:", error);
      }
    };

    fetchApplications();
    fetchFieldsList();
  }, [jobId]);

  // Handle status change for an application
  const handleStatusChange = async (applicationId, status) => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.put(
        `${handleStatusChangeRoute}${applicationId}/`,
        { status },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setApplications((prevApplications) =>
          prevApplications.map((application) =>
            application.id === applicationId
              ? { ...application, status }
              : application
          )
        );
        notifications.show({
          title: "Success",
          message: "Application status updated successfully.",
          color: "green",
        });
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to update application status.",
        color: "red",
      });
      console.error("Error updating application status:", error);
    }
  };

  const downloadExcel = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get(`${downloadExcelRoute}${jobId}/`, {
        headers: { Authorization: `Token ${token}` },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `applications_${jobId}.xlsx`);
      document.body.appendChild(link);
      link.click();
      notifications.show({
        title: "Success",
        message: "Excel file downloaded successfully.",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to download Excel file.",
        color: "red",
      });
      console.error("Error downloading Excel:", error);
    }
  };

  // Define table columns
  const columns = useMemo(
    () => [
      { accessorKey: "name", header: "Name", size: 200 },
      { accessorKey: "roll_no", header: "Roll No", size: 150 },
      { accessorKey: "email", header: "Email", size: 250 },
      { accessorKey: "cpi", header: "CPI", size: 100 },
      {
        accessorKey: "status",
        header: "Status",
        size: 120,
        Cell: ({ row }) => (
          <Select
            data={[
              { value: "accept", label: "Accept" },
              { value: "reject", label: "Reject" },
            ]}
            value={row.original.status}
            onChange={(value) => handleStatusChange(row.original.id, value)}
          />
        ),
      },
    ],
    []
  );

  if (loading) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: "200px" }}>
        <Loader size="xl" />
      </Flex>
    );
  }

  return (
    <>
        <Flex justify="space-between" align="center" mb="lg">
          <Title order={2} >
            Student Job Applications
          </Title>
          <Button onClick={downloadExcel} color="blue">
            Download Excel
          </Button>
        </Flex>

        {applications.length > 0 ? (
          <MantineReactTable columns={columns} data={applications} />
        ) : (
          <Alert color="yellow" title="No Applications">
            No applications available for this job.
          </Alert>
        )}
    </>
  );
}

export default JobApplicationsTable;