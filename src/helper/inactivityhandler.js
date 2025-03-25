import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { logoutRoute } from "../routes/dashboardRoutes";

function InactivityHandler() {
  const timerRef = useRef(null);
  const [hasLoggedOut, setHasLoggedOut] = useState(false);
  const navigate = useNavigate();
  const INACTIVITY_TIME = 15 * 60 * 1000; // 15 minutes

  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");

    try {
      await axios.post(
        logoutRoute,
        {},
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      localStorage.removeItem("authToken");

      // Show notification only once
      if (!hasLoggedOut) {
        setHasLoggedOut(true);
        notifications.show({
          title: "User logged out",
          message:
            "You have been logged out due to inactivity. Please login again.",
          color: "red",
        });
      }

      navigate("/accounts/login");
      console.log("User logged out successfully");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      handleLogout();
    }, INACTIVITY_TIME);
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((event) => document.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      events.forEach((event) =>
        document.removeEventListener(event, resetTimer),
      );
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []); // Dependency array stays empty

  return null;
}

export default InactivityHandler;
