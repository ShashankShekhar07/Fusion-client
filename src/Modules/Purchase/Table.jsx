// // import { Table, Grid } from "@mantine/core";

// // function DataTable() {
// //   const leftData = [
// //     { label: "Description:", value: "" },
// //     { label: "Quantity:", value: "40" },
// //     { label: "Estimated Cost:", value: "2" },
// //     { label: "Specification:", value: "nknsadf" },
// //     { label: "Item Nature:", value: "Consumable" },
// //     { label: "Replaced:", value: "Yes" },
// //     { label: "Expected Delivery:", value: "Oct 1, 2024" },
// //     { label: "Financial Approval:", value: "No" },
// //     { label: "Head Approval:", value: "Yes" },
// //   ];

// //   const rightData = [
// //     { label: "Name:", value: "2" },
// //     { label: "SubType:", value: "Subtype" },
// //     { label: "Purpose:", value: "New" },
// //     { label: "Type:", value: "Equipment" },
// //     { label: "Indigenous:", value: "Yes" },
// //     { label: "Budgetary Head:", value: "sdsf" },
// //     { label: "Sources of Supply:", value: "sfnsdfin" },
// //     { label: "Purchased:", value: "No" },
// //     { label: "Director Approval:", value: "Yes" },
// //   ];

// //   const renderTable = (data) => (
// //     <Table>
// //       <tbody>
// //         {data.map((row, index) => (
// //           <tr key={index}>
// //             <strong>
// //               <td>{row.label}</td>
// //             </strong>

// //             <td>{row.value}</td>
// //           </tr>
// //         ))}
// //       </tbody>
// //     </Table>
// //   );

// //   return (
// //     <Grid>
// //       <Grid.Col span={6}>{renderTable(leftData)}</Grid.Col>
// //       <Grid.Col span={6}>{renderTable(rightData)}</Grid.Col>
// //     </Grid>
// //   );
// // }

// // export default DataTable;
// import { Table, Grid } from "@mantine/core";
// // import { IconBrandDeviantart } from "@tabler/icons-react";

// function DataTable({ indent }) {
//   console.log(indent);
//   const leftData = [
//     { label: "Description:", value: indent?.item_subtype || " " },
//     { label: "Quantity:", value: indent?.quantity || "Zero" },
//     { label: "Estimated Cost:", value: indent?.estimated_cost || "Zero" },
//     { label: "Specification:", value: indent?.specification || "" },
//     { label: "Item Nature:", value: indent?.nature ? "Yes" : "No" },
//     { label: "Replaced:", value: indent?.replaced ? "Yes" : "No" },
//     { label: "Expected Delivery:", value: indent?.expected_delivery || "" },
//     {
//       label: "Financial Approval:",
//       value: indent?.financial_approval ? "Yes" : "No",
//     },
//     { label: "Head Approval:", value: indent?.head_approval ? "Yes" : "No" },
//   ];

//   const rightData = [
//     { label: "Name:", value: indent?.item_name || "" },
//     { label: "SubType:", value: indent?.item_subtype || "" },
//     { label: "Purpose:", value: indent?.purpose || "" },
//     { label: "Type:", value: indent?.item_type || "" },
//     { label: "Indigenous:", value: indent?.indigenous ? "Yes" : "No" },
//     { label: "Budgetary Head:", value: indent?.budgetary_head || "" },
//     { label: "Sources of Supply:", value: indent?.sources_of_supply || "" },
//     { label: "Purchased:", value: indent?.purchased ? "Yes" : "No" },
//     {
//       label: "Director Approval:",
//       value: indent?.director_approval ? "Yes" : "No",
//     },
//   ];

//   const renderTable = (data) => (
//     <Table>
//       <tbody>
//         {data.map((row, index) => (
//           <tr key={index}>
//             <strong>
//               <td>{row.label}</td>
//             </strong>

//             <td>{row.value}</td>
//           </tr>
//         ))}
//       </tbody>
//     </Table>
//   );

//   return (
//     <Grid>
//       <Grid.Col span={6}>{renderTable(leftData)}</Grid.Col>
//       <Grid.Col span={6}>{renderTable(rightData)}</Grid.Col>
//     </Grid>
//   );
// }

// export default DataTable;

import React from "react";
import { Table, Grid } from "@mantine/core";
import PropTypes from "prop-types";

function DataTable({ indent }) {
  const leftData = [
    { label: "Description:", value: indent?.item_subtype || " " },
    { label: "Quantity:", value: indent?.quantity || "Zero" },
    { label: "Estimated Cost:", value: indent?.estimated_cost || "Zero" },
    { label: "Specification:", value: indent?.specification || "" },
    { label: "Item Nature:", value: indent?.nature ? "Yes" : "No" },
    { label: "Replaced:", value: indent?.replaced ? "Yes" : "No" },
    { label: "Expected Delivery:", value: indent?.expected_delivery || "" },
    {
      label: "Financial Approval:",
      value: indent?.financial_approval ? "Yes" : "No",
    },
    { label: "Head Approval:", value: indent?.head_approval ? "Yes" : "No" },
  ];

  const rightData = [
    { label: "Name:", value: indent?.item_name || "" },
    { label: "SubType:", value: indent?.item_subtype || "" },
    { label: "Purpose:", value: indent?.purpose || "" },
    { label: "Type:", value: indent?.item_type || "" },
    { label: "Indigenous:", value: indent?.indigenous ? "Yes" : "No" },
    { label: "Budgetary Head:", value: indent?.budgetary_head || "" },
    { label: "Sources of Supply:", value: indent?.sources_of_supply || "" },
    { label: "Purchased:", value: indent?.purchased ? "Yes" : "No" },
    {
      label: "Director Approval:",
      value: indent?.director_approval ? "Yes" : "No",
    },
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

DataTable.propTypes = {
  indent: PropTypes.shape({
    item_subtype: PropTypes.string,
    quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    estimated_cost: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    specification: PropTypes.string,
    nature: PropTypes.bool,
    replaced: PropTypes.bool,
    expected_delivery: PropTypes.string,
    financial_approval: PropTypes.bool,
    head_approval: PropTypes.bool,
    item_name: PropTypes.string,
    purpose: PropTypes.string,
    item_type: PropTypes.string,
    indigenous: PropTypes.bool,
    budgetary_head: PropTypes.string,
    sources_of_supply: PropTypes.string,
    purchased: PropTypes.bool,
    director_approval: PropTypes.bool,
  }),
};

export default DataTable;
