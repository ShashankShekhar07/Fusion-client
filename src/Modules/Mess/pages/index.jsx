import { useSelector } from "react-redux";
import { Loader } from "@mantine/core";
import Caretaker from "../components/CaretakerIndex";
import Warden from "../components/WardenIndex";
import Student from "../components/StudentIndex";

function MessPage() {
  const role = useSelector((state) => state.user.role);
  console.log(role);
  switch (role) {
    case "mess_manager":
      return <Caretaker />;
    case "student":
      return <Student />;
    case "mess_warden":
      return <Warden />;
    default:
      return <Loader />;
  }
}

export default MessPage;
