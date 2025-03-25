import { useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { notifications } from "@mantine/notifications";
import {
  setUserName,
  setRollNo,
  setRoles,
  setRole,
  setAccessibleModules,
  setCurrentAccessibleModules,
  clearUserName,
  clearRoles,
} from "../redux/userslice";
import { authRoute } from "../routes/globalRoutes";

function ValidateAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateUser = useCallback(async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("No authentication token found!");
      localStorage.removeItem("authToken");
      notifications.show({
        title: "Authentication Error",
        message: "Token Invalid/Expired! Redirecting to login page.",
        color: "red",
      });
      return navigate("/accounts/login");
    }

    try {
      const { data } = await axios.get(authRoute, {
        headers: { Authorization: `Token ${token}` },
      });

      const {
        name,
        designation_info = [],
        accessible_modules = [],
        last_selected_role,
        roll_no,
      } = data;

      console.log("User Data:", data);

      dispatch(setUserName(name));
      dispatch(setRollNo(roll_no));
      dispatch(setRoles(designation_info));

      const selectedRole = last_selected_role || designation_info[0] || null;
      if (selectedRole) dispatch(setRole(selectedRole));

      dispatch(setAccessibleModules(accessible_modules));
      dispatch(setCurrentAccessibleModules());
    } catch (error) {
      console.error("User validation failed:", error);
      notifications.show({
        title: "Session Expired",
        message: "Your session has expired. Please log in again.",
        color: "red",
      });
      localStorage.removeItem("authToken");
      dispatch(clearUserName());
      dispatch(clearRoles());
      navigate("/accounts/login");
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    validateUser();
  }, [validateUser]);

  return null;
}

export default ValidateAuth;
