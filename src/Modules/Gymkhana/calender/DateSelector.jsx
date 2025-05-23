import { DatePicker } from "@mantine/dates";
import { Box } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import PropTypes from "prop-types";

function DateSelector({ selectedDate, setSelectedDate }) {
  const isMobile = useMediaQuery(`(max-width: 750px)`);
  return (
    <Box
      style={{
        width: "400px",
        height: "400px",
        paddingRight: isMobile ? "2px" : "200px",
        marginLeft: isMobile ? "10px" : "1px",
      }}
    >
      <DatePicker
        placeholder="Pick a date"
        value={selectedDate}
        onChange={setSelectedDate}
        style={{
          width: "250px",
        }}
      />
    </Box>
  );
}

DateSelector.propTypes = {
  selectedDate: PropTypes.string,
  setSelectedDate: PropTypes.string,
};

export default DateSelector;
