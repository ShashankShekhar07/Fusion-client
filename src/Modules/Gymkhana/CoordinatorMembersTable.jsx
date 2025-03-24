import "@mantine/core/styles.css";
import "@mantine/dates/styles.css"; // if using mantine date picker features
import "mantine-react-table/styles.css"; // make sure MRT styles were imported in your app root (once)
import { useMemo, useState } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { ActionIcon, Flex, Tooltip } from "@mantine/core";
import { IconTrash, IconCheck } from "@tabler/icons-react";
import PropTypes from "prop-types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useGetClubMembers } from "./BackendLogic/ApiRoutes";
import { host } from "../../routes/globalRoutes/index.jsx";

function CoordinatorMembers({ clubName }) {
  const token = localStorage.getItem("authToken");
  const [validationErrors] = useState({});
  const {
    data: fetchedEvents = [],
    isError: isLoadingEventsError,
    isFetching: isFetchingEvents,
    isLoading: isLoadingEvents,
    refetch: refetchEvents,
  } = useGetClubMembers(clubName, token);
  const approvemutation = useMutation({
    mutationFn: (clubMemberId) => {
      return axios.post(
        `${host}/gymkhana/api/member_approve/`,
        { id: clubMemberId },
        {
          headers: {
            Authorization: `Token ${token}`, // Token for Authorization
          },
        },
      );
    },
    onSuccess: (response) => {
      console.log("Successfully approved:", response.data);
      alert("Successfully approved");
      refetchEvents();
      // setMessage({ type: "success", text: "Approval successful!" });
    },
    onError: (error) => {
      console.error("Error during approval:", error);
      // setMessage({
      //   type: "error",
      //   text: "Approval failed. Please try again.",
      // });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (clubMemberId) => {
      return axios.post(
        `${host}/gymkhana/api/member_reject/`,
        { id: clubMemberId },
        {
          headers: {
            Authorization: `Token ${token}`, // Token for Authorization
          },
        },
      );
    },
    onSuccess: (response) => {
      console.log("Successfully rejected:", response.data);
      alert("Successfully rejected");
      refetchEvents();
      // setMessage({ type: "success", text: "Rejection successful!" });
    },
    onError: (error) => {
      console.error("Error during rejection:", error);
      alert("Successfully rejected");
      // setMessage({
      //   type: "error",
      //   text: "Rejection failed. Please try again.",
      // });
    },
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: "club", // Key in your data object
        header: "Club", // Column header name
      },
      {
        accessorKey: "description",
        header: "Description",
      },

      {
        accessorKey: "member",
        header: "Member",
      },
      {
        accessorKey: "remarks",
        header: "Remarks",
      },
      {
        accessorKey: "status",
        header: "Status",
      },
    ],
    [validationErrors],
  );

  console.log(fetchedEvents, clubName);
  const table = useMantineReactTable({
    columns,
    data: fetchedEvents,
    enableEditing: true,
    getRowId: (row) => row.id,
    mantineToolbarAlertBannerProps: isLoadingEventsError
      ? {
          color: "red",
          children: "Error loading data",
        }
      : undefined,
    renderRowActions: ({ row }) => (
      <Flex gap="md">
        {row.original.status === "open" ? (
          // Approve icon for open status
          <>
            <Tooltip label="Approve">
              <ActionIcon
                color="green"
                onClick={() => {
                  // setMessage({ type: "", text: "" });
                  approvemutation.mutate(row.original.id);
                }}
              >
                <IconCheck /> {/* Approve icon */}
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Reject">
              <ActionIcon
                color="red"
                onClick={() => rejectMutation.mutate(row.original.id)}
              >
                <IconTrash />
              </ActionIcon>
            </Tooltip>
          </>
        ) : row.original.status === "member" ? (
          <Tooltip label="Delete">
            <ActionIcon
              color="red"
              onClick={() => {
                // setMessage({ type: "", text: "" }); // Reset message
                rejectMutation.mutate(row.original.id);
              }}
            >
              <IconTrash />
            </ActionIcon>
          </Tooltip>
        ) : (
          <p>No action</p>
        )}
      </Flex>
    ),
    state: {
      isLoading: isLoadingEvents,
      showAlertBanner: isLoadingEventsError,
      showProgressBars: isFetchingEvents,
    },
  });

  return <MantineReactTable table={table} />;
}

function CoordinatorMembersWithProviders({ clubName }) {
  return <CoordinatorMembers clubName={clubName} />;
}
CoordinatorMembersWithProviders.propTypes = {
  clubName: PropTypes.string,
};
CoordinatorMembers.propTypes = {
  clubName: PropTypes.string,
};

export default CoordinatorMembersWithProviders;
