import axios from "axios";
import { IWD_ROUTES } from "../routes/iwdRoutes";

const GetRequestsOrBills = async ({ setLoading, setList, role, URL }) => {
  /* 
    This function is for fetching requests
    Used in 
    - ApproveRejectRequest
    - CreatedRequests
    - IssueWorkOrder 
    - RejectedRequests
    - RequestsInProgress
    - RequestsStatus
    - AuditDocuments
  */
  setLoading(true);
  const token = localStorage.getItem("authToken");
  try {
    const response = await axios.get(URL, {
      headers: {
        Authorization: `Token ${token}`,
      },
      params: {
        role,
      },
    });
    setList(response.data);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

const GetFileData = async ({ setLoading, request, setMessages }) => {
  /*
    This function GETs entire tracking history of a file
    Used in :
    - ViewRequestFile
  */
  setLoading(true);
  const params = { file_id: request.file_id };
  console.log("params", params);
  const token = localStorage.getItem("authToken");
  try {
    const response = await axios.get(IWD_ROUTES.VIEW_FILE, {
      headers: {
        Authorization: `Token ${token}`,
      },
      params,
    });
    setMessages(response.data);
    setLoading(false);
  } catch (error) {
    console.error(error);
    setLoading(false);
  }
};

const HandleRequest = async ({
  setIsLoading,
  setIsSuccess,
  setActiveTab,
  role,
  form,
}) => {
  /* 
    This function is for creating new requests
    Used in 
    - CreateRequestForm
  */
  setIsLoading(true);
  setIsSuccess(false);
  const token = localStorage.getItem("authToken");
  const data = form.getValues();
  data.role = role;
  console.log(data);
  try {
    const response = await axios.post(IWD_ROUTES.CREATE_REQUESTS, data, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    console.log(response);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        setActiveTab("0");
      }, 500);
    }, 1000);
  } catch (error) {
    console.log(error);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }
};
const HandleUpdateRequest = async ({
  setIsLoading,
  setIsSuccess,
  onBack,
  role,
  formValues,
}) => {
  /* 
    This function is for updating existing requests
    Used in :
    - UpdateRequestForm
  */
  setIsLoading(true);
  setIsSuccess(false);
  const token = localStorage.getItem("authToken");
  formValues.role = role;
  console.log(formValues);
  try {
    const response = await axios.post(IWD_ROUTES.UPDATE_REQUESTS, formValues, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    console.log(response);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        onBack();
      }, 1000);
    }, 1000);
  } catch (error) {
    console.log(error);
    setTimeout(() => {
      setIsLoading(false);
      onBack();
    }, 1000);
  }
};

const HandleIssueWorkOrder = async ({
  data,
  setIsLoading,
  setIsSuccess,
  onBack,
}) => {
  /* 
    This function is for issuing work order for requests approved by director
    Used in :
    - IssueWorkOrderForm
  */
  setIsLoading(true);
  setIsSuccess(false);
  const token = localStorage.getItem("authToken");
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  if (data.date) {
    data.date = formatDate(data.date);
  }
  data.start_date = formatDate(data.start_date);
  data.completion_date = formatDate(data.completion_date);

  console.log(data);
  try {
    const response = await axios.post(IWD_ROUTES.ISSUE_WORK_ORDER, data, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    console.log(response);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        onBack();
      }, 1000);
    }, 1000);
  } catch (error) {
    console.error(error);
    setIsLoading(false);
  }
};

const GetBudgets = async ({ setLoading, setBudgetList }) => {
  /* 
    This function if for fetching list of all Budgets
    Used in :
    - ViewBudget
    - ManageBudget
  */
  setLoading(true);
  const token = localStorage.getItem("authToken");
  try {
    const response = await axios.get(IWD_ROUTES.VIEW_BUDGET, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    setBudgetList(response.data.obj);
    setLoading(false);
  } catch (error) {
    console.error(error);
  }
};

const HandleEditBudget = async ({
  formValues,
  setIsLoading,
  setIsSuccess,
  onBack,
}) => {
  /* 
    This function if for editing an existing budget
    Used in :
    - EditBudget (if operation === edit)
  */
  setIsLoading(true);
  setIsSuccess(false);
  const token = localStorage.getItem("authToken");

  try {
    const response = await axios.post(
      IWD_ROUTES.EDIT_BUDGET,
      {
        id: formValues.id,
        name: formValues.name,
        budget: formValues["budget-issued"],
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      },
    );
    console.log(response);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);

      setTimeout(() => {
        onBack();
      }, 1000);
    }, 1000);
  } catch (error) {
    console.error("Error editing budget:", error);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }
};
const HandleAddBudget = async ({
  formValues,
  setIsLoading,
  setIsSuccess,
  onBack,
}) => {
  /* 
    This function if for adding a new budget
    Used in :
    - EditBudget (if operation === add)
  */
  setIsLoading(true);
  setIsSuccess(false);
  const token = localStorage.getItem("authToken");

  try {
    const response = await axios.post(
      IWD_ROUTES.ADD_BUDGET,
      {
        name: formValues.name,
        budget: formValues["budget-issued"],
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      },
    );
    console.log(response);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        onBack();
      }, 1000);
    }, 1000);
  } catch (error) {
    console.error("Error adding/editing budget:", error);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }
};

const HandleMarkAsCompleted = async ({
  setIsLoading,
  setIsSuccess,
  setRefresh,
  request,
}) => {
  /* 
    This function is for setting the workCompleted flag as 1 (i.e., work issued was completed)
    Used in :
    - UpdateRequestForm
  */
  setIsLoading(true);
  const token = localStorage.getItem("authToken");
  try {
    const response = await axios.patch(
      IWD_ROUTES.MARK_COMPLETED,
      {
        id: request.id,
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      },
    );
    console.log(response);
    console.log("asfasf");
  } catch (error) {
    console.log(error);
  } finally {
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setRefresh((prev) => !prev);
      }, 1000);
    }, 1000);
  }
};

const HandleEngineerProcess = async ({
  form,
  request,
  setIsLoading,
  setIsSuccess,
  handleBackToList,
  role,
}) => {
  /* 
    This function is for forwarding request
    Used in :
    - ViewRequestFile
  */
  setIsLoading(true);
  setIsSuccess(false);
  const token = localStorage.getItem("authToken");
  const formData = form.getValues();
  formData.fileid = request.file_id;
  formData.role = role;
  try {
    const response = await axios.post(
      IWD_ROUTES.HANDLE_ENGINEER_PROCESS,
      formData,
      {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );
    console.log(response);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        handleBackToList();
      }, 1000);
    }, 1000);
  } catch (error) {
    console.log(error);
    setIsLoading(false);
  }
};

const HandleDirectorApproval = async ({
  form,
  request,
  setIsLoading,
  setIsSuccess,
  handleBackToList,
  role,
  action,
}) => {
  /* 
    This function is for approving/rejecting requests for director
    Used in :
    - ViewRequestFile
  */
  setIsLoading(true);
  setIsSuccess(false);
  const token = localStorage.getItem("authToken");
  const formData = form.getValues();
  formData.fileid = request.file_id;
  formData.role = role;
  formData.action = action;
  try {
    const response = await axios.post(
      IWD_ROUTES.HANDLE_DIRECTOR_APPROVAL,
      formData,
      {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );
    console.log(response);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        handleBackToList();
      }, 1000);
    }, 1000);
  } catch (error) {
    console.log(error);
    setIsLoading(false);
  }
};

const HandleDeanProcessRequest = async ({
  form,
  request,
  setIsLoading,
  setIsSuccess,
  handleBackToList,
  role,
}) => {
  /* 
    This function is for approving/rejecting requests for director
    Used in :
    - ViewRequestFile
  */
  setIsLoading(true);
  setIsSuccess(false);
  const token = localStorage.getItem("authToken");
  const formData = form.getValues();
  formData.fileid = request.file_id;
  formData.role = role;
  try {
    const response = await axios.post(
      IWD_ROUTES.HANDLE_DEAN_PROCESS_REQUEST,
      formData,
      {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );
    console.log(response);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        handleBackToList();
      }, 1000);
    }, 1000);
  } catch (error) {
    console.log(error);
    setIsLoading(false);
  }
};

export {
  GetRequestsOrBills,
  GetBudgets,
  GetFileData,
  HandleRequest,
  HandleAddBudget,
  HandleIssueWorkOrder,
  HandleUpdateRequest,
  HandleDirectorApproval,
  HandleMarkAsCompleted,
  HandleEditBudget,
  HandleDeanProcessRequest,
  HandleEngineerProcess,
};
