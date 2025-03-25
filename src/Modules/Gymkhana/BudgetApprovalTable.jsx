import React, { useMemo, useState } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import {
  ActionIcon,
  Flex,
  Stack,
  Text,
  Input,
  Tooltip,
  Modal,
  Box,
  Button,
  CloseButton,
  Group,
  Divider,
  ScrollArea,
  Pill,
} from "@mantine/core";
import { IconEye, IconEdit, IconSend } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { notifications } from "@mantine/notifications";
import { host } from "../../routes/globalRoutes/index.jsx";
import {
  useGetUpcomingBudgets,
  useGetCommentsBudgetInfo,
  approveFICBudgetButton,
  approveCounsellorBudgetButton,
  approveDeanBudgetButton,
  rejectBudgetButton,
  modifyBudgetButton,
  reviewDeanBudgetButton,
} from "./BackendLogic/ApiRoutes";

import { BudgetApprovalForm } from "./BudgetForm";
import CounsellorReview from "./CounsellorReview";

function BudgetApprovals({ clubName }) {
  const user = useSelector((state) => state.user);
  const userRole = user.role;
  const token = localStorage.getItem("authToken");
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [validationErrors] = useState({});
  const [commentValue, setCommentValue] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { data: commentsData, refetch: refetchComments } =
    useGetCommentsBudgetInfo(selectedBudget?.id, token);

  const columns = useMemo(
    () => [
      {
        accessorKey: "status",
        header: "Status",
      },
      {
        accessorKey: "budget_for",
        header: "Budget Title",
      },
      {
        accessorKey: "budget_requested",
        header: "Budget Requested",
      },
      {
        accessorKey: "budget_allocated",
        header: "Budget Allocated",
      },
      {
        accessorKey: "budget_comment",
        header: "Budget Comment",
      },
      {
        accessorKey: "remarks",
        header: "Remarks",
      },
    ],
    [validationErrors],
  );

  const {
    data: fetchedBudgets = [],
    isError: isLoadingBudgetsError,
    isFetching: isFetchingBudgets,
    isLoading: isLoadingBudgets,
    refetch: refetchBudget,
  } = useGetUpcomingBudgets(token); // Fetch budgets for the club (implement the API call)

  const filteredBudgets = useMemo(() => {
    return fetchedBudgets.filter((budget) => {
      if (
        (budget.status.toLowerCase() === "coordinator" ||
          budget.status.toLowerCase() === "reject") &&
        userRole.toLowerCase() === "co-ordinator"
      ) {
        return true;
      }
      if (budget.status.toLowerCase() === "fic") {
        if (
          userRole.toLowerCase() === "co-ordinator" ||
          userRole.toLowerCase() === "professor" ||
          userRole.toLowerCase() === "assistant professor"
        ) {
          return true;
        }
      }
      if (budget.status.toLowerCase() === "counsellor") {
        if (
          userRole.toLowerCase() === "counsellor" ||
          userRole.toLowerCase() === "professor" ||
          userRole.toLowerCase() === "assistant professor" ||
          userRole.toLowerCase() === "co-ordinator"
        ) {
          return true;
        }
      }
      if (budget.status.toLowerCase() === "rereview") {
        if (
          userRole.toLowerCase() === "counsellor" ||
          userRole.toLowerCase() === "professor" ||
          userRole.toLowerCase() === "assistant professor" ||
          userRole.toLowerCase() === "co-ordinator" ||
          userRole.toLowerCase() === "dean_s"
        ) {
          return true;
        }
      }
      if (
        budget.status.toLowerCase() === "dean" ||
        budget.status.toLowerCase() === "accept"
      ) {
        if (
          userRole.toLowerCase() === "dean_s" ||
          userRole.toLowerCase() === "counsellor" ||
          userRole.toLowerCase() === "professor" ||
          userRole.toLowerCase() === "assistant professor" ||
          userRole.toLowerCase() === "co-ordinator"
        ) {
          return true;
        }
      }
      return false;
    });
  }, [fetchedBudgets, userRole]);

  const openViewModal = (budget) => {
    setSelectedBudget(budget);
  };

  const closeViewModal = () => {
    setSelectedBudget(null);
  };

  const openEditModal = (budget) => {
    setSelectedBudget(budget);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedBudget(null);
  };

  const updateBudgetMutation = useMutation({
    mutationFn: (updatedBudgetData) => {
      return axios.put(
        `${host}/gymkhana/api/update_budget/`,
        updatedBudgetData,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
    },
    onSuccess: () => {
      closeEditModal();
      refetchBudget();
      // You might want to refresh your events data here
    },
  });

  const mutation = useMutation({
    mutationFn: (commentData) => {
      return axios.post(
        `${host}/gymkhana/api/create_budget_comment/`,
        {
          budget_id: commentData.selectedBudget.id,
          commentator_designation: commentData.userRole,
          comment: commentData.commentValue,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
    },
  });

  const handleCommentSubmit = (values) => {
    mutation.mutate(values, {
      onSuccess: (response) => {
        console.log("Successfully comment posted!!!", response.data);
        setCommentValue(""); // Clear the comment input field
        refetchComments(); // Refresh the comments list
      },
      onError: (error) => {
        console.error("Error during posting comment", error);
        notifications.show({
          title: "Error",
          message: (
            <Flex gap="4px">
              <Text fz="sm">Error during posting comment</Text>
            </Flex>
          ),
          color: "green",
        });
      },
    });
  };

  const approveFICMutation = useMutation({
    mutationFn: (budgetId) => approveFICBudgetButton(budgetId, token),
    onSuccess: () => {
      notifications.show({
        title: "Approved by FIC",
        message: (
          <Flex gap="4px">
            <Text fz="sm">Approved by FIC</Text>
          </Flex>
        ),
        color: "green",
      });
      closeViewModal();
      refetchBudget();
    },
  });

  const updateAllocatedBudgetMutation = useMutation({
    mutationFn: (updatedBudgetData) => {
      return axios.put(
        `${host}/gymkhana/api/counsellor_approve_budget/`,
        updatedBudgetData,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
    },
    onSuccess: () => {
      closeEditModal();
      refetchBudget();
    },
  });

  const approveCounsellorMutation = useMutation({
    mutationFn: (budgetId) => approveCounsellorBudgetButton(budgetId, token),
    onSuccess: () => {
      notifications.show({
        title: "Approved by Counsellor",
        message: (
          <Flex gap="4px">
            <Text fz="sm">Approved by Counsellor</Text>
          </Flex>
        ),
        color: "green",
      });
      closeViewModal();
      refetchBudget();
    },
  });

  const approveDeanMutation = useMutation({
    mutationFn: (budgetId) => approveDeanBudgetButton(budgetId, token),
    onSuccess: () => {
      notifications.show({
        title: "Approved by Dean",
        message: (
          <Flex gap="4px">
            <Text fz="sm">Approved by Dean</Text>
          </Flex>
        ),
        color: "green",
      });
      closeViewModal();
      refetchBudget();
    },
  });

  const reviewDeanMutation = useMutation({
    mutationFn: (budgetId) => reviewDeanBudgetButton(budgetId, token),
    onSuccess: () => {
      notifications.show({
        title: "Review by Dean",
        message: (
          <Flex gap="4px">
            <Text fz="sm">Review by Dean</Text>
          </Flex>
        ),
        color: "green",
      });
      closeViewModal();
      refetchBudget();
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (budgetId) => rejectBudgetButton(budgetId, token),
    onSuccess: () => {
      notifications.show({
        title: "Rejected",
        message: (
          <Flex gap="4px">
            <Text fz="sm">Rejected</Text>
          </Flex>
        ),
        color: "green",
      });
      closeViewModal();
      refetchBudget();
    },
  });

  const modifyMutation = useMutation({
    mutationFn: (budgetId) => modifyBudgetButton(budgetId, token),
    onSuccess: () => {
      closeViewModal();
      refetchBudget();
    },
  });

  const handleFICApproveButton = (budgetId) => {
    approveFICMutation.mutate(budgetId);
  };
  const handleCounsellorApproveButton = (budgetId) => {
    approveCounsellorMutation.mutate(budgetId);
  };
  const handleDeanApproveButton = (budgetId) => {
    approveDeanMutation.mutate(budgetId);
  };

  const handleDeanReviewButton = (budgetId) => {
    reviewDeanMutation.mutate(budgetId);
  };

  const handleRejectButton = (budgetId) => {
    rejectMutation.mutate(budgetId);
  };
  const handleModifyButton = (budgetId) => {
    modifyMutation.mutate(budgetId);
  };
  const renderRoleBasedActions = useMemo(() => {
    if (!selectedBudget) return null;

    if (
      selectedBudget.status === "FIC" &&
      (userRole === "Professor" || userRole === "Assistant Professor")
    ) {
      return (
        <>
          <Button
            color="blue"
            onClick={() => handleFICApproveButton(selectedBudget.id)}
          >
            FIC Approve
          </Button>
          <Button
            color="red"
            onClick={() => handleRejectButton(selectedBudget.id)}
          >
            Reject
          </Button>
          <Button
            color="yellow"
            onClick={() => handleModifyButton(selectedBudget.id)}
          >
            Modify
          </Button>
        </>
      );
    }
    if (selectedBudget.status === "COUNSELLOR" && userRole === "Counsellor") {
      return (
        <>
          <Button
            color="blue"
            onClick={() => handleCounsellorApproveButton(selectedBudget.id)}
          >
            Counsellor Approve
          </Button>
          <Button
            color="red"
            onClick={() => handleRejectButton(selectedBudget.id)}
          >
            Reject
          </Button>
          <Button
            color="yellow"
            onClick={() => handleModifyButton(selectedBudget.id)}
          >
            Modify
          </Button>
        </>
      );
    }
    if (selectedBudget.status === "DEAN" && userRole === "Dean_s") {
      return (
        <>
          <Button
            color="blue"
            onClick={() => handleDeanApproveButton(selectedBudget.id)}
          >
            Final Approve
          </Button>
          <Button
            color="red"
            onClick={() => handleRejectButton(selectedBudget.id)}
          >
            Reject
          </Button>
          <Button
            color="yellow"
            onClick={() => handleDeanReviewButton(selectedBudget.id)}
          >
            ReReview
          </Button>
        </>
      );
    }

    return null;
  }, [selectedBudget, userRole]);
  const table = useMantineReactTable({
    columns,
    data: filteredBudgets,
    enableEditing: true,
    getRowId: (row) => row.id,
    mantineToolbarAlertBannerProps: isLoadingBudgetsError
      ? {
          color: "red",
          children: "Error loading data",
        }
      : undefined,
    renderRowActions: ({ row }) => (
      <Flex gap="md">
        <Tooltip label="View">
          <ActionIcon onClick={() => openViewModal(row.original)}>
            <IconEye />
          </ActionIcon>
        </Tooltip>
        {row.original.status === "COORDINATOR" &&
          userRole === "co-ordinator" && (
            <Tooltip label="Edit">
              <ActionIcon
                color="blue"
                onClick={() => openEditModal(row.original)}
              >
                <IconEdit />
              </ActionIcon>
            </Tooltip>
          )}
        {row.original.status === "REREVIEW" && userRole === "Counsellor" && (
          <Tooltip label="Edit">
            <ActionIcon
              color="blue"
              onClick={() => openEditModal(row.original)}
            >
              <IconEdit />
            </ActionIcon>
          </Tooltip>
        )}
        <Pill
          bg={
            row.original.status === "ACCEPT"
              ? "#B9FBC0"
              : row.original.status === "REJECT"
                ? "#FFA8A5"
                : "#FFDB58"
          }
        >
          {row.original.status}
        </Pill>
      </Flex>
    ),
    state: {
      isLoading: isLoadingBudgets,
      showAlertBanner: isLoadingBudgetsError,
      showProgressBars: isFetchingBudgets,
    },
  });

  return (
    <>
      <MantineReactTable table={table} />
      {/* View Modal */}
      <Modal
        opened={!!selectedBudget && !isEditModalOpen}
        onClose={closeViewModal}
        w="40%"
      >
        {selectedBudget && (
          <Stack
            spacing="md"
            sx={{
              width: "40%",
              padding: "20px",
              border: "1px solid #dfe1e5",
              borderRadius: "8px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              backgroundColor: "white",
            }}
          >
            <Box>
              <Stack>
                <Text
                  size="25px"
                  style={{ fontWeight: 900 }}
                  align="center"
                  mb="10px"
                >
                  {selectedBudget.budget_for}
                </Text>
                <Text size="15px" weight={700}>
                  <b>Amount Requested: </b> {selectedBudget.budget_requested}
                </Text>
                <Text size="15px" weight={700}>
                  <b>Description: </b>
                  {selectedBudget.description}
                </Text>
              </Stack>

              <Divider my="sm" />

              <Box>
                <Stack>
                  <Text size="md" weight={500}>
                    Comments:
                  </Text>
                  <ScrollArea
                    h={300}
                    styles={{
                      viewport: {
                        paddingRight: "10px", // Add padding to avoid overlap
                      },
                      scrollbar: {
                        position: "absolute",
                        right: 0,
                        width: "8px",
                      },
                    }}
                  >
                    {commentsData?.map((comment) => (
                      <Box
                        key={comment.event_index}
                        my="sm"
                        style={{
                          border: " solid 1px lightgray",
                          borderRadius: "5px",
                        }}
                      >
                        <Pill weight={900} size="xs" c="blue" mb="5px">
                          {comment.commentator_designation}
                        </Pill>
                        <Text size="sm" p="10px" radius="lg">
                          {comment.comment}{" "}
                        </Text>
                        <Group justify="end">
                          <Pill size="xs" mr="2px" mb="1px">
                            {comment.comment_date}, {comment.comment_time}
                          </Pill>
                        </Group>
                      </Box>
                    ))}
                  </ScrollArea>

                  <Group position="apart" align="center">
                    <div
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Input
                        placeholder="Add a comment"
                        value={commentValue}
                        onChange={(budget) =>
                          setCommentValue(budget.currentTarget.value)
                        }
                        style={{ paddingRight: "30px", width: "290px" }} // Add padding to make space for the CloseButton
                      />
                      {commentValue && (
                        <CloseButton
                          aria-label="Clear input"
                          onClick={() => setCommentValue("")}
                          style={{
                            position: "absolute",
                            right: "5px",
                            cursor: "pointer",
                          }}
                        />
                      )}
                    </div>
                    <Button
                      onClick={() => {
                        const objectComment = {
                          userRole,
                          commentValue,
                          selectedBudget,
                        };
                        handleCommentSubmit(objectComment);
                      }}
                      color="blue"
                    >
                      <IconSend />
                    </Button>
                    {/* </Flex> */}
                    {renderRoleBasedActions}
                  </Group>
                </Stack>
              </Box>
            </Box>
          </Stack>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        opened={isEditModalOpen}
        onClose={closeEditModal}
        title="Edit Budget"
        size="lg"
      >
        {selectedBudget && selectedBudget.status !== "REREVIEW" && (
          <BudgetApprovalForm
            clubName={clubName}
            initialValues={{
              ...selectedBudget,
            }}
            onSubmit={(values) => {
              const formData = new FormData();

              // Add the text data (details)
              formData.append("budget_requested", values.budget_requested);

              // Add the ID of the event
              formData.append("id", selectedBudget.id);

              // Now, submit the formData to the backend using the mutation
              updateBudgetMutation.mutate(formData);
            }}
            editMode
            disabledFields={[
              "busget_allocated",
              "budget_comment",
              "budget_for",
              "budget_file",
              "description",
              "status",
              "remarks",
            ]}
          />
        )}
        {selectedBudget &&
          userRole === "Counsellor" &&
          selectedBudget?.status === "REREVIEW" && (
            <CounsellorReview
              clubName={clubName}
              initialValues={{
                ...selectedBudget,
              }}
              onSubmit={(values) => {
                const formData = new FormData();
                formData.append("budget_allocated", values.budget_allocated);
                formData.append("budget_comment", values.budget_comment);
                formData.append("id", selectedBudget.id);

                updateAllocatedBudgetMutation.mutate(formData);
              }}
              editMode
              disabledFields={[
                "budget_requested",
                "budget_for",
                "budget_file",
                "description",
                "status",
                "remarks",
              ]}
            />
          )}
      </Modal>
    </>
  );
}

BudgetApprovals.propTypes = {
  clubName: PropTypes.string,
};
function BudgetApprovalsWithProviders({ clubName }) {
  return <BudgetApprovals clubName={clubName} />;
}
BudgetApprovalsWithProviders.propTypes = {
  clubName: PropTypes.string,
};

export default BudgetApprovalsWithProviders;
