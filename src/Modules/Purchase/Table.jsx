import React from "react";
import { Table, Grid } from "@mantine/core";
import PropTypes from "prop-types";

function DataTable({ indent }) {
  console.log("here", indent);
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

// import React from "react";
// import PropTypes from "prop-types";
// import {
//   Accordion,
//   Badge,
//   Group,
//   Paper,
//   Text,
//   Grid,
//   Stack,
// } from "@mantine/core";

// function DetailRow({ label, value }) {
//   return (
//     <Group position="apart" spacing="xs">
//       <Text size="sm" weight={500} color="gray.7">
//         {label}:
//       </Text>
//       <Text size="sm">
//         {typeof value === "boolean" ? (value ? "Yes" : "No") : value.toString()}
//       </Text>
//     </Group>
//   );
// }

// DetailRow.propTypes = {
//   label: PropTypes.string.isRequired,
//   value: PropTypes.oneOfType([
//     PropTypes.string,
//     PropTypes.number,
//     PropTypes.bool,
//   ]).isRequired,
// };

// function ItemDetailsGrid({ item }) {
//   return (
//     <Grid grow gutter="md">
//       <Grid.Col span={6}>
//         <Stack spacing="xs">
//           <DetailRow label="Item Name" value={item.item_name} />
//           <DetailRow label="Quantity" value={item.quantity} />
//           <DetailRow label="Estimated Cost" value={item.estimated_cost} />
//           <DetailRow label="Purpose" value={item.purpose} />
//           <DetailRow label="Item Type" value={item.item_type} />
//           <DetailRow label="Expected Delivery" value={item.expected_delivery} />
//         </Stack>
//       </Grid.Col>

//       <Grid.Col span={6}>
//         <Stack spacing="xs">
//           <DetailRow label="Specification" value={item.specification} />
//           <DetailRow label="Budgetary Head" value={item.budgetary_head} />
//           <DetailRow label="Sources of Supply" value={item.sources_of_supply} />
//           <DetailRow label="Indigenous" value={item.indigenous} />
//           <DetailRow label="Nature" value={item.nature} />
//           <DetailRow label="Replaced" value={item.replaced} />
//         </Stack>
//       </Grid.Col>
//     </Grid>
//   );
// }

// ItemDetailsGrid.propTypes = {
//   item: PropTypes.shape({
//     item_name: PropTypes.string,
//     quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//     estimated_cost: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//     purpose: PropTypes.string,
//     item_type: PropTypes.string,
//     expected_delivery: PropTypes.string,
//     specification: PropTypes.string,
//     budgetary_head: PropTypes.string,
//     sources_of_supply: PropTypes.string,
//     indigenous: PropTypes.bool,
//     nature: PropTypes.bool,
//     replaced: PropTypes.bool,
//   }).isRequired,
// };

// function ApprovalStatus({ item }) {
//   return (
//     <Group position="center" spacing="md" mt="md">
//       <Badge
//         color={item.financial_approval ? "green" : "red"}
//         variant="filled"
//         size="lg"
//       >
//         Financial: {item.financial_approval ? "Approved" : "Pending"}
//       </Badge>
//       <Badge
//         color={item.head_approval ? "green" : "red"}
//         variant="filled"
//         size="lg"
//       >
//         Head: {item.head_approval ? "Approved" : "Pending"}
//       </Badge>
//       <Badge
//         color={item.director_approval ? "green" : "red"}
//         variant="filled"
//         size="lg"
//       >
//         Director: {item.director_approval ? "Approved" : "Pending"}
//       </Badge>
//     </Group>
//   );
// }

// ApprovalStatus.propTypes = {
//   item: PropTypes.shape({
//     financial_approval: PropTypes.bool,
//     head_approval: PropTypes.bool,
//     director_approval: PropTypes.bool,
//   }).isRequired,
// };

// function DataTable({ indent }) {
//   if (!indent) return null;
//   console.log(indent);
//   const items = Array.isArray(indent) ? indent : [indent];

//   return (
//     <Accordion variant="contained">
//       {items.map((item, index) => (
//         <Accordion.Item key={index} value={`item-${index}`}>
//           <Accordion.Control>
//             <Group position="apart">
//               <Group>
//                 <Text weight={500}>Item {index + 1}:</Text>
//                 <Text>{item.item_name}</Text>
//               </Group>
//               <Group spacing="xs">
//                 <Badge color="blue">₹{item.estimated_cost}</Badge>
//                 <Badge color="teal">Qty: {item.quantity}</Badge>
//               </Group>
//             </Group>
//           </Accordion.Control>

//           <Accordion.Panel>
//             <Paper p="md" radius="sm">
//               <ItemDetailsGrid item={item} />
//               <ApprovalStatus item={item} />
//             </Paper>
//           </Accordion.Panel>
//         </Accordion.Item>
//       ))}
//     </Accordion>
//   );
// }

// DataTable.propTypes = {
//   indent: PropTypes.oneOfType([
//     PropTypes.shape({
//       item_name: PropTypes.string,
//       quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//       estimated_cost: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//       specification: PropTypes.string,
//       purpose: PropTypes.string,
//       item_type: PropTypes.string,
//       nature: PropTypes.bool,
//       replaced: PropTypes.bool,
//       indigenous: PropTypes.bool,
//       expected_delivery: PropTypes.string,
//       budgetary_head: PropTypes.string,
//       sources_of_supply: PropTypes.string,
//       financial_approval: PropTypes.bool,
//       head_approval: PropTypes.bool,
//       director_approval: PropTypes.bool,
//     }),
//     PropTypes.arrayOf(
//       PropTypes.shape({
//         item_name: PropTypes.string,
//         quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//         estimated_cost: PropTypes.oneOfType([
//           PropTypes.string,
//           PropTypes.number,
//         ]),
//         specification: PropTypes.string,
//         purpose: PropTypes.string,
//         item_type: PropTypes.string,
//         nature: PropTypes.bool,
//         replaced: PropTypes.bool,
//         indigenous: PropTypes.bool,
//         expected_delivery: PropTypes.string,
//         budgetary_head: PropTypes.string,
//         sources_of_supply: PropTypes.string,
//         financial_approval: PropTypes.bool,
//         head_approval: PropTypes.bool,
//         director_approval: PropTypes.bool,
//       }),
//     ),
//   ]),
// };

// export default DataTable;
