/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Loader, Paper, Title } from "@mantine/core";
import axios from "axios";
import NavCom from "../NavCom";
import ScheduleNavBar from "./schedulePath";
import { compounderRoute } from "../../../../routes/health_center";
import CustomBreadcrumbs from "../../../../components/Breadcrumbs";

function Dropdown({ doctorName, selectedDay, onDayChange }) {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  return (
    <select
      value={selectedDay}
      onChange={(e) => onDayChange(doctorName, e.target.value)}
    >
      <option value="">Select Day</option>
      {days.map((day) => (
        <option key={day} value={day}>
          {day}
        </option>
      ))}
    </select>
  );
}

function Time({ selectedDay, schedule }) {
  const availableTime =
    schedule.find((slot) => slot.day === selectedDay)?.time || "Not Available";
  return <div>{availableTime}</div>;
}

function Viewpath() {
  const [selectedDays, setSelectedDays] = useState({});
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const handleDayChange = (doctorName, day) => {
    setSelectedDays((prevSelectedDays) => ({
      ...prevSelectedDays,
      [doctorName]: day,
    }));
  };

  const fetchPathalogistSchedule = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        compounderRoute,
        { get_pathologist_schedule: 1 },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      console.log(response);
      setSchedule(response.data.schedule);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPathalogistSchedule();
  }, []);

  return (
    <>
      <CustomBreadcrumbs />
      <NavCom />
      <ScheduleNavBar />
      <br />
      <Paper shadow="xl" p="sm" withBorder>
        <Title
          order={3}
          style={{
            textAlign: "center",
            margin: "0 auto",
            color: "#15abff",
          }}
        >
          View Pathologist Schedule
        </Title>
        <br />
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Loader size={50} color="#15abff" />
          </div>
        ) : (
          <table
            style={{
              width: "80%",
              borderCollapse: "collapse",
              border: "1px solid #ccc",
              textAlign: "center",
            }}
          >
            <thead>
              <tr>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                  Doctor Name
                </th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                  Specialization
                </th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                  Day
                </th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((item, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#fff" : "#FAFAFA",
                    minHeight: "60px",
                  }}
                >
                  <td style={{ padding: "15px", border: "1px solid #ccc" }}>
                    {item.name}
                  </td>
                  <td style={{ padding: "15px", border: "1px solid #ccc" }}>
                    {item.specialization}
                  </td>
                  <td style={{ padding: "15px", border: "1px solid #ccc" }}>
                    <Dropdown
                      doctorName={item.name}
                      selectedDay={selectedDays[item.name] || ""}
                      onDayChange={handleDayChange}
                    />
                  </td>
                  <td style={{ padding: "15px", border: "1px solid #ccc" }}>
                    <Time
                      doctorName={item.name}
                      selectedDay={selectedDays[item.name] || ""}
                      schedule={item.availability}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Paper>
    </>
  );
}

export default Viewpath;
