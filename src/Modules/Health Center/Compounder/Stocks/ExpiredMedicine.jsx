/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Pagination, Paper, Table, Title } from "@mantine/core";
import axios from "axios";
import NavCom from "../NavCom";
import ManageStock from "./ManageStocksNav";
import CustomBreadcrumbs from "../../../../components/Breadcrumbs";
import { compounderRoute } from "../../../../routes/health_center";

function ExpiredMedicine() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [activePage, setPage] = useState(1);
  const [expiredMed, setExpired] = useState([]);

  const fetchMedicine = async (pagenumber) => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        compounderRoute,
        {
          page_stock_expired: pagenumber,
          search_view_expired: search,
          datatype: "manage_stock_expired",
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      console.log(response);
      setExpired(response.data.report_stock_expired);
      setTotalPages(response.data.total_pages_stock_view);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const setCurrentPage = async (e) => {
    setPage(e);
    fetchMedicine(e);
  };

  useEffect(() => {
    fetchMedicine(1);
  }, []);

  const rows = expiredMed.map((item, index) => (
    <tr key={index}>
      <td style={{ textAlign: "center" }}>{item.medicine_id}</td>
      <td style={{ textAlign: "center" }}>{item.supplier}</td>
      <td style={{ textAlign: "center" }}>{item.Expiry_date}</td>
      <td style={{ textAlign: "center" }}>{item.quantity}</td>
    </tr>
  ));

  return (
    <>
      <CustomBreadcrumbs />
      <NavCom />
      <ManageStock />
      <br />
      <Paper shadow="xl" p="xl" withBorder>
        <Title order={3} style={{ textAlign: "center", color: "#15abff" }}>
          Expired Medicines
        </Title>
        <br />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchMedicine(1);
            }}
          >
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              style={{
                width: "130%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                fontSize: "16px",
              }}
            />
          </form>
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "#15ABFF",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Download
          </button>
        </div>

        <Paper shadow="xl" p="xl" withBorder>
          <Title
            order={5}
            style={{
              textAlign: "center",
              margin: "0 auto",
              color: "#15abff",
            }}
          >
            Medicines Lists
          </Title>
          <Table
            withTableBorder
            withColumnBorders
            highlightOnHover
            striped
            horizontalSpacing="lg"
            verticalSpacing="sm"
            style={{ overflowX: "auto" }}
          >
            <thead>
              <tr style={{ backgroundColor: "#E0F2FE", textAlign: "center" }}>
                <th>Medicine</th>
                <th>Supplier</th>
                <th>Expiry Date</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </Paper>
        <Pagination
          value={activePage}
          onChange={setCurrentPage}
          total={totalPages}
          style={{ marginTop: "20px", margin: "auto", width: "fit-content" }}
        />
      </Paper>
    </>
  );
}

export default ExpiredMedicine;
