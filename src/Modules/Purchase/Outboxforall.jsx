import { useSelector } from "react-redux"; // Make sure to import useSelector to access the Redux state
import Outbox from "./Outbox/Outbox";
import PSAdminOutbox from "./Outbox/PSAdminOutbox";
import HODOutbox from "./Outbox/HODOutbox";
import DirectorOutbox from "./Outbox/DirectorOutbox";

function OutboxForAll() {
  // Access the role from the Redux store
  const role = useSelector((state) => state.user.role);

  return (
    <div>
      {role === "Professor" ? (
        <Outbox />
      ) : role === "Director" ? (
        <DirectorOutbox />
      ) : role === "ps_admin" ? (
        <PSAdminOutbox />
      ) : role === "HOD (CSE)" ? (
        <HODOutbox />
      ) : (
        <div>Role not recognized</div>
      )}
    </div>
  );
}

export default OutboxForAll;
