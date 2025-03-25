import { MantineProvider, Table, Button, Text, Box } from "@mantine/core";

import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import {
  fetchIndentByUserRole,
  remove_indent,
} from "../../redux/purchase/purchaseSlice";

function FiledIndentsTable() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const role = useSelector((state) => state.user.role);
  console.log(role);
  const username = useSelector((state) => state.user.roll_no);
  const {
    indents,
    loading,
    error = null,
  } = useSelector((state) => state.indent || {});
  useEffect(() => {
    dispatch(fetchIndentByUserRole({ username, role }));
  }, [dispatch, username, role]);
  console.log("Indents after fetch:", indents);
  console.log(indents);
  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text color="red">{error}</Text>;
  }
  return (
    <Box p="md" style={{ margin: 5 }}>
      {" "}
      {/* Removed margin-top completely */}
      <Box
        mb="md"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          size="26px"
          style={{
            fontWeight: "bold",
            textAlign: "center",
            color: "#1881d9",
          }}
        >
          All Filed Indents
        </Text>
      </Box>
      <Table
        style={{
          borderRadius: "8px",
          overflow: "hidden",
          border: "1px solid #E0E0E0",
        }}
      >
        <thead>
          <tr>
            {/* <th style={{ backgroundColor: "#D9EAF7", padding: "12px" }}>
             */}
            <th style={{ backgroundColor: "white", padding: "12px" }}>
              Created By
            </th>
            <th style={{ backgroundColor: "white", padding: "12px" }}>
              Fileid
            </th>
            <th style={{ backgroundColor: "white", padding: "12px" }}>
              Subject
            </th>
            <th style={{ backgroundColor: "white", padding: "12px" }}>Date</th>
            <th style={{ backgroundColor: "white", padding: "12px" }}>
              Features
            </th>
          </tr>
        </thead>
        <tbody>
          {indents.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No data available
              </td>
            </tr>
          ) : (
            indents.map((booking, index) =>
              index % 2 === 0 ? (
                <tr key={booking.id} style={{ backgroundColor: "#f8fafb" }}>
                  <td
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #E0E0E0",
                      textAlign: "center",
                    }}
                  >
                    <Text size="sm">{booking.draft_file.uploader}</Text>
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #E0E0E0",
                      textAlign: "center",
                    }}
                  >
                    {booking.draft_file.id}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #E0E0E0",
                      textAlign: "center",
                    }}
                  >
                    {booking.indent.item_name
                      ? booking.indent.item_name
                      : "None"}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #E0E0E0",
                      textAlign: "center",
                    }}
                  >
                    {booking.draft_file.upload_date}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #E0E0E0",
                      textAlign: "center",
                    }}
                  >
                    <Button
                      color="green"
                      style={{ marginRight: "8px" }}
                      onClick={() =>
                        navigate(
                          `/purchase/employeeviewfiledindent/${booking.indent.file_info}`,
                        )
                      }
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      color="red"
                      onClick={() => {
                        dispatch(remove_indent(booking.indent.file_info));
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ) : (
                <tr key={booking.id} style={{ backgroundColor: "white" }}>
                  <td
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #E0E0E0",
                      textAlign: "center",
                    }}
                  >
                    <Text size="sm">{booking.draft_file.uploader}</Text>
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #E0E0E0",
                      textAlign: "center",
                    }}
                  >
                    {booking.draft_file.id}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #E0E0E0",
                      textAlign: "center",
                    }}
                  >
                    {booking.indent.item_name
                      ? booking.indent.item_name
                      : "None"}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #E0E0E0",
                      textAlign: "center",
                    }}
                  >
                    {booking.draft_file.upload_date}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #E0E0E0",
                      textAlign: "center",
                    }}
                  >
                    <Button
                      color="green"
                      style={{ marginRight: "8px" }}
                      onClick={() =>
                        navigate(
                          `/purchase/employeeviewfiledindent/${booking.indent.file_info}`,
                        )
                      }
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      color="red"
                      onClick={() => {
                        dispatch(remove_indent(booking.indent.file_info));
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ),
            )
          )}
        </tbody>
      </Table>
    </Box>
  );
}

function FiledIndents() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          overflow: "auto",
        }}
      >
        <Box
          style={{
            maxWidth: "1440px",
            width: "100%",
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "16px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            overflowX: "auto",
            overflowY: "auto",
            maxHeight: "80vh",
          }}
        >
          <FiledIndentsTable />
        </Box>
      </Box>
    </MantineProvider>
  );
}

export default FiledIndents;
