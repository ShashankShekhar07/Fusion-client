import { useSelector } from "react-redux"; // Make sure to import useSelector to access the Redux state
import DirectorInbox from "./Inbox/DirectorInbox";
import Inbox from "./Inbox/Inbox";
import PSAdminInbox from "./Inbox/PSAdminInbox";
import HODInbox from "./Inbox/HODInbox";

function InboxForAll() {
  // Access the role from the Redux store
  const role = useSelector((state) => state.user.role);

  return (
    <div>
      {role === "Professor" ? (
        <Inbox />
      ) : role === "Director" ? (
        <DirectorInbox />
      ) : role === "ps_admin" ? (
        <PSAdminInbox />
      ) : role === "HOD (CSE)" ? (
        <HODInbox />
      ) : (
        <div>Role not recognized</div>
      )}
    </div>
  );
}

export default InboxForAll;
