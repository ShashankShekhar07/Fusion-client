import { useEffect, useState } from "react";
import { Tooltip } from "@mantine/core";
import dayjs from "dayjs";
import { useMediaQuery } from "@mantine/hooks";
import PropTypes from "prop-types";

function EventCalendar({ selectedDate, selectedClub, events }) {
  const [daysInMonth, setDaysInMonth] = useState([]);

  // Darker dummy events for demonstration with club tags and assigned colors

  useEffect(() => {
    // Calculate the correct number of days in the selected month
    const daysArray = [];
    const date = dayjs(selectedDate);
    const daysInSelectedMonth = date.daysInMonth();
    const startOfMonth = date.startOf("month").day();

    // Add padding days for the start of the month
    for (let i = 0; i < startOfMonth; i += 1) {
      daysArray.push({ date: null });
    }

    for (let i = 1; i <= daysInSelectedMonth; i += 1) {
      daysArray.push({ date: date.date(i) });
    }

    setDaysInMonth(daysArray);
  }, [selectedDate]);
  const isMobile = useMediaQuery(`(max-width: 750px)`);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: "5px",
      }}
    >
      {daysInMonth.map((day, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ddd",
            padding: isMobile ? "2px" : "10px",
            minHeight: isMobile ? "25px" : "110px", // Increase height
            minWidth: isMobile ? "25px" : "110px", // Increase width
            backgroundColor: "white", // Set background color to white
            borderRadius: "5px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)", // Optional: add shadow for better visibility
          }}
        >
          {day.date && (
            <div style={{ fontWeight: "bold", fontSize: "16px" }}>
              {day.date.date()}
            </div>
          )}
          {day.date &&
            events
              .filter(
                (event) =>
                  day.date.isSame(event.start_date, "day") &&
                  (selectedClub === "All Clubs" || event.club === selectedClub),
              )
              .map((event, idx) => (
                <Tooltip
                  key={idx}
                  label={`${event.event_name}: ${event.details}`}
                  withArrow
                  transition="pop"
                  transitionDuration={200}
                >
                  <div
                    style={{
                      backgroundColor: "#808080FF",
                      padding: "5px 10px",
                      margin: "5px 0",
                      color: "#fff",
                      borderRadius: "3px",
                      fontSize: isMobile ? "1px" : "14px", // Font size for event card
                    }}
                  >
                    {event.start_time} {event.event_name}
                  </div>
                </Tooltip>
              ))}
        </div>
      ))}
    </div>
  );
}
EventCalendar.propTypes = {
  selectedClub: PropTypes.string,
  selectedDate: PropTypes.string,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      start_time: PropTypes.string,
      end_time: PropTypes.string,
      start_date: PropTypes.string,
      end_date: PropTypes.string,
    }),
  ),
};
export default EventCalendar;
