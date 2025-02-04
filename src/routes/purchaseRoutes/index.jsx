import { host } from "../globalRoutes";

export const viewIndentRoute = `${host}/purchase-and-store/api/view_indent/`;
export const deleteIndentRoute = `${host}/purchase-and-store/api/delete_indent/`;
export const viewIndentByUsernameAndRoleRoute = (username, role) =>
  `${host}/purchase-and-store/api/indentview/${username}?role=${role}`;
export const viewIndentByUsernameAndRoleRoute2 = (username, role) =>
  `${host}/purchase-and-store/api/indentview2/${username}?role=${role}`;
export const archiveViewRoute = (username, role) =>
  `${host}/purchase-and-store/api/archieveview/${username}?role=${role}`;
export const forwardIndentRoute = (indentID) =>
  `${host}/purchase-and-store/api/forward_indent/${indentID}/`;
export const getDesignationsRoute = (receiverName) =>
  `${host}/filetracking/getdesignations/${receiverName}`;
export const createProposalRoute = (role) =>
  `${host}/purchase-and-store/api/create_proposal/?role=${role}`;
export const createDraftRoute = () =>
  `${host}/purchase-and-store/api/create_draft/`;
export const outboxViewRoute2 = (username, role) =>
  `${host}/purchase-and-store/api/outboxview2/${username}?role=${role}`;
export const draftViewRoute = (username) =>
  `${host}/purchase-and-store/api/draftview/${username}`;
export const forwardIndentFileRoute = (indentID) =>
  `${host}/purchase-and-store/api/indentFile/forward/${indentID}`;
export const archiveIndentRoute = (role, id) =>
  `${host}/purchase-and-store/api/archieve_indent/4322/?role=${role}&file_id=${id}`;
