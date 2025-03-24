import { Table, Paper, Stack, Divider, Title, Flex } from "@mantine/core";
import PropTypes from "prop-types";
import { useState } from "react";

function CustomTable({ data, columns, TableName }) {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const paginatedData = data.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize,
  );
  const totalPages = Math.ceil(data.length / pageSize);

  return (
    <Paper withBorder shadow="sm" p="md" style={{ backgroundColor: "white" }}>
      <Stack style={{ width: "100%" }}>
        <Divider />
        <Title order={2} align="center" c="blue">
          {TableName} Table
        </Title>
        <Flex justify="space-between" align="center">
          <span>
            Page {pageIndex + 1} of {totalPages}
          </span>
          <div>
            <button
              disabled={pageIndex === 0}
              onClick={() => setPageIndex(pageIndex - 1)}
            >
              Previous
            </button>
            <button
              disabled={pageIndex === totalPages - 1}
              onClick={() => setPageIndex(pageIndex + 1)}
            >
              Next
            </button>
          </div>
        </Flex>

        <div style={{ width: "100%", overflowX: "auto" }}>
          <Table captionSide="top" striped withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                {columns.map((col) => (
                  <Table.Th key={col.accessorKey}>{col.header}</Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginatedData.map((row, rowIndex) => (
                <Table.Tr key={rowIndex}>
                  {columns.map((col) => (
                    <Table.Td key={col.accessorKey}>
                      {row[col.accessorKey]}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      </Stack>
    </Paper>
  );
}

CustomTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      accessorKey: PropTypes.string.isRequired,
      header: PropTypes.string.isRequired,
    }),
  ).isRequired,
  TableName: PropTypes.string,
};

export default CustomTable;
