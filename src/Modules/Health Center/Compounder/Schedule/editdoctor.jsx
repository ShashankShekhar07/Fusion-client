/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Alert, Button, Paper, Text, Title } from "@mantine/core";
import { Check, X } from "@phosphor-icons/react";
import NavCom from "../NavCom";
import ScheduleNavBar from "./schedulePath";
import { compounderRoute } from "../../../../routes/health_center";
import CustomBreadcrumbs from "../../../../components/Breadcrumbs";

function Editdoctor() {
  const [doctorName, setDoctorName] = useState("");
  const [timeIn, setTimeIn] = useState("");
  const [timeOut, setTimeOut] = useState("");
  const [dayToAdd, setDayToAdd] = useState("");
  const [doctorToRemove, setDoctorToRemove] = useState("");
  const [dayToRemove, setDayToRemove] = useState("");
  const [roomToAdd, setRoom] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submit, setSubmit] = useState(false);

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "20px",
    backgroundColor: "#f0f0f0",
    gap: "20px",
  };

  const boxStyle = {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    minWidth: "300px",
  };

  const titleStyle = {
    fontSize: "15px",
    marginBottom: "10px",
    color: "#333",
  };

  const formGroupStyle = {
    marginBottom: "10px",
    display: "flex",
    gap: "20px",
  };

  const buttonStyle = {
    padding: "5px 10px",
    backgroundColor: "#15abff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  const selectStyle = {
    padding: "10px",
    width: "30%",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  };

  const responsiveContainerStyle = {
    ...containerStyle,
    "@media (min-width: 768px)": {
      flexDirection: "row",
    },
  };

  const fetchDoctors = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        compounderRoute,
        { get_doctors: 1 },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      console.log(response);
      setDoctors(response.data.doctors);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const editSchedule = async () => {
    if (timeIn > timeOut) {
      setNotification({
        type: "error",
        message: "Enter Valid Time",
      });
      return false;
    }
    if (roomToAdd === "") {
      setNotification({
        type: "error",
        message: "Enter Room Number",
      });
      return false;
    }
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        compounderRoute,
        {
          doctor: doctorName,
          day: dayToAdd,
          room: roomToAdd,
          time_in: timeIn,
          time_out: timeOut,
          edit_1: 1,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      console.log(response);
      setNotification({
        type: "success",
        message: "Schedule Added Successfully",
      });
    } catch (err) {
      console.log(err);
      setNotification({
        type: "error",
        message: err.message,
      });
    } finally {
      setSubmit(true);
    }
    setTimeout(() => {
      setNotification(null);
      setSubmit(false);
    }, 5000);
  };

  const removeSchedule = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        compounderRoute,
        {
          doctor: doctorToRemove,
          day: dayToRemove,
          rmv: 1,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      console.log(response);
      setNotification({
        type: "success",
        message: "Schedule Removed Successfully",
      });
    } catch (err) {
      console.log(err);
      setNotification({
        type: "error",
        message: err.message,
      });
    } finally {
      setSubmit(true);
    }
    setTimeout(() => {
      setNotification(null);
      setSubmit(false);
    }, 5000);
  };

  return (
    <>
      <CustomBreadcrumbs />
      <NavCom />
      <ScheduleNavBar />
      <br />
      <Paper shadow="xl" p="xl" withBorder>
        <Title
          order={3}
          style={{
            color: "#15ABFF",
            textAlign: "center",
            marginBottom: "15px",
          }}
        >
          Edit Doctor Schedule
        </Title>
        <div style={responsiveContainerStyle}>
          <div style={boxStyle}>
            <h3 style={titleStyle}>Add Doctor Schedule</h3>
            <div style={formGroupStyle}>
              <select
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                style={selectStyle}
              >
                <option value="" disabled>
                  Select Doctor
                </option>

                {loading ? (
                  <option style={{ color: "#15ABFF" }}>Loading...</option>
                ) : (
                  doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.doctor_name}
                    </option>
                  ))
                )}
              </select>
              <select
                value={dayToAdd}
                onChange={(e) => setDayToAdd(e.target.value)}
                style={selectStyle}
              >
                <option value="" disabled>
                  Select Day
                </option>
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div style={formGroupStyle}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  {" "}
                  <input
                    type="time"
                    value={timeIn}
                    onChange={(e) => setTimeIn(e.target.value)}
                    placeholder="Time In"
                    style={{ marginRight: "10px", marginBottom: "10px" }}
                  />
                  <input
                    type="time"
                    value={timeOut}
                    onChange={(e) => setTimeOut(e.target.value)}
                    placeholder="Time Out"
                    style={{ marginRight: "10px", marginBottom: "10px" }}
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Room No"
                    style={{ marginRight: "10px", marginBottom: "10px" }}
                    value={roomToAdd}
                    onChange={(e) => setRoom(e.target.value)}
                  />
                  <Button style={buttonStyle} onClick={editSchedule}>
                    {submit ? "Adding..." : "Add Schedule"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div style={boxStyle}>
            <h3 style={titleStyle}>Remove Doctor Schedule</h3>
            <div style={formGroupStyle}>
              <select
                value={doctorToRemove}
                onChange={(e) => setDoctorToRemove(e.target.value)}
                style={selectStyle}
              >
                <option value="" disabled>
                  Select Doctor
                </option>
                {loading ? (
                  <option style={{ color: "#15ABFF" }}>Loading...</option>
                ) : (
                  doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.doctor_name}
                    </option>
                  ))
                )}
              </select>
              <select
                value={dayToRemove}
                onChange={(e) => setDayToRemove(e.target.value)}
                style={selectStyle}
              >
                <option value="" disabled>
                  Select Day
                </option>
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
              <Button style={buttonStyle} onClick={removeSchedule}>
                {submit ? "Removing..." : "Remove Schedule"}
              </Button>
            </div>
          </div>
        </div>
      </Paper>
      {notification && (
        <Alert
          icon={
            notification.type === "success" ? (
              <Check size={16} />
            ) : (
              <X size={16} />
            )
          }
          title={notification.type === "success" ? "Success" : "Error"}
          color={notification.type === "success" ? "green" : "red"}
          withCloseButton
          onClose={() => setNotification(null)}
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            width: "auto",
          }}
        >
          <Text>{notification.message}</Text>
        </Alert>
      )}
    </>
  );
}

export default Editdoctor;
