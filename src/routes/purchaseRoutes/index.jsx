import { host } from "../globalRoutes";

// export const logoutRoute = `${host}/api/auth/logout/`;
// export const updateRoleRoute = `${host}/api/update-role/`;
// export const getNotificationsRoute = `${host}/api/notification/`;
// export const notificationReadRoute = `${host}/api/notificationread`;
// export const notificationDeleteRoute = `${host}/api/notificationdelete`;
// export const notificationUnreadRoute = `${host}/api/notificationunread`;

export const viewIndentRoute = `${host}/purchase-and-store/api/view_indent/`;
export const deleteIndentRoute = `${host}/purchase-and-store/api/delete_indent/`;
export const viewIndentByUsernameAndRoleRoute = (username, role) =>
  `${host}/purchase-and-store/api/indentview/${username}?role=${role}`;
export const viewIndentByUsernameAndRoleRoute2 = (username, role) =>
  `${host}/purchase-and-store/api/indentview2/${username}?role=${role}`;
export const archiveViewRoute = (role) =>
  `${host}//purchase-and-store/api/archieveview/4322?role=${role}`;
export const forwardIndentRoute = (indentID) =>
  `${host}/purchase-and-store/api/forward_indent/${indentID}/`;
export const getDesignationsRoute = (receiverName) =>
  `http://127.0.0.1:8000/filetracking/getdesignations/${receiverName}`;
export const createProposalRoute = (role) =>
  `http://127.0.0.1:8000/purchase-and-store/api/create_proposal/?role=${role}`;
export const createDraftRoute = () =>
  `http://127.0.0.1:8000/purchase-and-store/api/create_draft/`;
export const outboxViewRoute2 = (role) =>
  `http://127.0.0.1:8000/purchase-and-store/api/outboxview2/4322?role=${role}`;
export const draftViewRoute = (username) =>
  `http://127.0.0.1:8000/purchase-and-store/api/draftview/${username}`;
export const forwardIndentFileRoute = (indentID) =>
  `http://127.0.0.1:8000/purchase-and-store/api/indentFile/forward/${indentID}`;
