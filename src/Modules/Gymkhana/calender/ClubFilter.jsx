import { Select } from "@mantine/core";
import PropTypes from "prop-types";

function ClubFilter({ selectedClub, setSelectedClub }) {
  return (
    <Select
      value={selectedClub}
      onChange={setSelectedClub}
      data={[
        { value: "All Clubs", label: "All Clubs" },
        { value: "BitByte", label: "TPC" },
        { value: "AFC", label: "AFC" },
        { value: "BMC", label: "BMC" },
        { value: "E-Cell", label: "E-Cell" },
      ]}
      placeholder="Filter by Club"
      style={{
        marginBottom: "20px",
        paddingLeft: "50px",
        paddingBottom: "-30px",
      }}
    />
  );
}
ClubFilter.propTypes = {
  selectedClub: PropTypes.string,
  setSelectedClub: PropTypes.string,
};

export default ClubFilter;
