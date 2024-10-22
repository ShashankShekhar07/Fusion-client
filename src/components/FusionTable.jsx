import { Box, ScrollArea, Table } from "@mantine/core";
import PropTypes from "prop-types";
import classes from "../App.module.css";

function FusionTable({
  caption = "",
  columnNames,
  elements,
  headerBgColor = "#be4bdb26",
  scrollableX = false,
  width = "100%",
}) {
  const rows = elements.map((element, index) => (
    <Table.Tr key={index}>
      {columnNames.map((columnName, colIndex) => (
        <Table.Td key={colIndex}>{element[columnName]}</Table.Td>
      ))}
    </Table.Tr>
  ));

  return (
    <ScrollArea w={width}>
      <Box w={scrollableX ? "100vw" : "100%"}>
        <Table highlightOnHover striped>
          <Table.Thead
            className={classes.fusionTableHeader}
            style={{ backgroundColor: headerBgColor }}
          >
            <Table.Tr>
              {columnNames.map((columnName, index) => (
                <Table.Th key={index}>{columnName}</Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
          <Table.Caption>{caption}</Table.Caption>
        </Table>
      </Box>
    </ScrollArea>
  );
}

export default FusionTable;

FusionTable.propTypes = {
  caption: PropTypes.string,
  columnNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  elements: PropTypes.arrayOf(
    PropTypes.objectOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ),
  ).isRequired,
  headerBgColor: PropTypes.string, // Background color of the table header in hex format
  scrollableX: PropTypes.bool,
  // Enable this to make the table horizontally scrollable if there are many columns and it appears too cluttered
  width: PropTypes.string, // Width of the table
};
