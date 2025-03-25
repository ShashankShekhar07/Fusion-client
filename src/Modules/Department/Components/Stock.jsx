import React, { lazy } from "react";
import stockdata from "./Data/StockData";

const SpecialTable = lazy(() => import("./SpecialTable.jsx"));

const columns = [
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "lastUpdated",
    header: "Last Updated",
  },
];

function Stock() {
  return (
    <div
      style={{
        overflowX: "auto", // Enable horizontal scrolling
        width: "100%", // Ensure the container takes the full width
        marginTop: "10px", // Add some spacing
      }}
    >
      <SpecialTable
        title="Stock"
        columns={columns}
        data={stockdata}
        rowOptions={["3", "4", "6"]}
      />
    </div>
  );
}

export default Stock;
