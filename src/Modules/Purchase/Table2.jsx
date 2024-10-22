import { Table, Grid } from "@mantine/core";

function DataTable2() {
  const leftData = [
    { label: "Atul-Professor:", value: "Sept 10,2024,8:19 p.m" },
    // { label: 'File with id#619 created by Atul and Sent to vkjain',value:' ' },
    { label: "VKJain-HOD(CSE):", value: "nice" },
    { label: "bhartenduks-Director:", value: "good" },
  ];

  const rightData = [
    { label: "Recieved By:", value: "vkjain-HOD(CSE)" },

    { label: "Recieved By:", value: "bhartenduks-Director" },
    { label: "Recieved By:", value: "psadmin" },
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

export default DataTable2;
