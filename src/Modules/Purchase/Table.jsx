import { Table, Grid } from "@mantine/core";

function DataTable() {
  const leftData = [
    { label: "Description:", value: "" },
    { label: "Quantity:", value: "40" },
    { label: "Estimated Cost:", value: "2" },
    { label: "Specification:", value: "nknsadf" },
    { label: "Item Nature:", value: "Consumable" },
    { label: "Replaced:", value: "Yes" },
    { label: "Expected Delivery:", value: "Oct 1, 2024" },
    { label: "Financial Approval:", value: "No" },
    { label: "Head Approval:", value: "Yes" },
  ];

  const rightData = [
    { label: "Name:", value: "2" },
    { label: "SubType:", value: "Subtype" },
    { label: "Purpose:", value: "New" },
    { label: "Type:", value: "Equipment" },
    { label: "Indigenous:", value: "Yes" },
    { label: "Budgetary Head:", value: "sdsf" },
    { label: "Sources of Supply:", value: "sfnsdfin" },
    { label: "Purchased:", value: "No" },
    { label: "Director Approval:", value: "Yes" },
  ];

  const renderTable = (data) => (
    <Table>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <strong>
              <td>{row.label}</td>
            </strong>

            <td>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  return (
    <Grid>
      <Grid.Col span={6}>{renderTable(leftData)}</Grid.Col>
      <Grid.Col span={6}>{renderTable(rightData)}</Grid.Col>
    </Grid>
  );
}

export default DataTable;
