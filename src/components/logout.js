import axios from "axios";
import { useNavigate } from "react-router-dom";
import { logoutRoute } from "../routes/dashboardRoutes";

const HandleLogout = async () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  try {
    await axios.post(
      logoutRoute,
      {},
      {
        // 3 hours got wasted just because of an empty brackets :)
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    localStorage.removeItem("authToken");
    navigate("/accounts/login");
    console.log("User logged out successfully");
  } catch (err) {
    console.error("Logout error:", err);
  }
};

export default HandleLogout;
