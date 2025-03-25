import CreateRequest from "../components/CreateRequestForm";
import IssueWorkOrder from "../components/IssueWorkOrder";
import RejectedRequests from "../components/RejectedRequest";
import RequestsInProgress from "../components/RequestsInProgress";
import FinalBillRequest from "../components/FinalBillRequest";
import ManageBudget from "../components/ManageBudget";
import CreatedRequests from "../components/CreatedRequests";
import ViewBudget from "../components/ViewBudget";
import ProcessBills from "../components/ProcessBills";
import RequestsStatus from "../components/RequestsStatus";
import ApproveRejectRequest from "../components/ApproveRejectRequest";
import AuditDocument from "../components/AuditDocument";

const RoleBasedFilter = ({ setActiveTab }) => {
  const tabItems = [
    {
      title: "Create Request",
      component: <CreateRequest setActiveTab={setActiveTab} />,
    },
    { title: "Requests in Progress", component: <RequestsInProgress /> },
    {
      title: "Issue Work Order",
      component: <IssueWorkOrder />,
    },
    { title: "Generate Final Bill", component: <FinalBillRequest /> },
    {
      title: "Rejected Requests",
      component: <RejectedRequests />,
    },
    { title: "Manage Budget", component: <ManageBudget /> },
    {
      title: "Created Requests",
      component: <CreatedRequests />,
    },
    { title: "View Budget", component: <ViewBudget /> },
    { title: "Process Bills", component: <ProcessBills /> },
    {
      title: "Approve/Reject Requests",
      component: <ApproveRejectRequest />,
    },
    { title: "Audit Document", component: <AuditDocument /> },
    { title: "Requests Status", component: <RequestsStatus /> },
  ];
  const roleBasedTabs = {
    Director: tabItems.filter((tab) =>
      [
        "Create Request",
        "Created Requests",
        "Approve/Reject Requests",
        "View Budget",
        "Requests Status",
        "Rejected Requests",
      ].includes(tab.title),
    ),
    "Dean (P&D)": tabItems.filter((tab) =>
      [
        "Create Request",
        "Created Requests",
        "Requests Status",
        "Rejected Requests",
      ].includes(tab.title),
    ),
    Auditor: tabItems.filter((tab) =>
      [
        "View Budget",
        "Created Requests",
        "Audit Document",
        "Requests Status",
        "Rejected Requests",
      ].includes(tab.title),
    ),
    SectionHead_IWD: tabItems.filter((tab) =>
      [
        "Create Request",
        "Created Requests",
        "Requests in Progress",
        "Issue Work Order",
        "Manage Budget",
        "View Budget",
        "Requests Status",
        "Rejected Requests",
        "Process Bills",
      ].includes(tab.title),
    ),
    Professor: tabItems.filter((tab) =>
      [
        "Create Request",
        "Requests in Progress",
        "Created Requests",
        "Requests Status",
        "Rejected Requests",
        "Process Bills",
      ].includes(tab.title),
    ),
    EE: tabItems.filter((tab) =>
      [
        "Create Request",
        "Created Requests",
        "Requests in Progress",
        "Issue Work Order",
        "Manage Budget",
        "View Budget",
        "Requests Status",
        "Rejected Requests",
        "Process Bills",
      ].includes(tab.title),
    ),
    "Executive Engineer (Civil)": tabItems.filter((tab) =>
      [
        "Create Request",
        "Created Requests",
        "Requests in Progress",
        "Issue Work Order",
        "Manage Budget",
        "View Budget",
        "Requests Status",
        "Rejected Requests",
        "Process Bills",
      ].includes(tab.title),
    ),
    Civil_AE: tabItems.filter((tab) =>
      [
        "Create Request",
        "Created Requests",
        "Requests in Progress",
        "Issue Work Order",
        "Manage Budget",
        "View Budget",
        "Requests Status",
        "Rejected Requests",
        "Process Bills",
      ].includes(tab.title),
    ),
    Civil_JE: tabItems.filter((tab) =>
      [
        "Create Request",
        "Created Requests",
        "Requests in Progress",
        "Issue Work Order",
        "Manage Budget",
        "View Budget",
        "Requests Status",
        "Rejected Requests",
        "Process Bills",
      ].includes(tab.title),
    ),
    Electrical_JE: tabItems.filter((tab) =>
      [
        "Create Request",
        "Created Requests",
        "Requests in Progress",
        "Issue Work Order",
        "Manage Budget",
        "View Budget",
        "Requests Status",
        "Rejected Requests",
        "Process Bills",
      ].includes(tab.title),
    ),
    Electrical_AE: tabItems.filter((tab) =>
      [
        "Create Request",
        "Created Requests",
        "Requests in Progress",
        "Issue Work Order",
        "Manage Budget",
        "View Budget",
        "Requests Status",
        "Rejected Requests",
        "Process Bills",
      ].includes(tab.title),
    ),
    "Junior Engineer": tabItems.filter((tab) =>
      [
        "Create Request",
        "Created Requests",
        "Requests in Progress",
        "Issue Work Order",
        "Manage Budget",
        "View Budget",
        "Requests Status",
        "Rejected Requests",
        "Process Bills",
      ].includes(tab.title),
    ),
    "Admin IWD": tabItems.filter((tab) =>
      [
        "Create Request",
        "Created Requests",
        "Requests in Progress",
        "Manage Budget",
        "Requests Status",
        "Rejected Requests",
      ].includes(tab.title),
    ),
    "Accounts Admin": tabItems.filter((tab) =>
      [
        "Create Request",
        "Processed Bills",
        "Manage Budget",
        "View Budget",
        "Requests Status",
        "Rejected Requests",
      ].includes(tab.title),
    ),
  };
  return { roleBasedTabs, tabItems };
};

export default RoleBasedFilter;
