import React, { useState, useEffect } from "react";
import { MantineProvider, Table, Button, Text, Box } from "@mantine/core";
import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
// import { deleteIndentRoute } from "../../routes/purchaseRoutes";
import { fetchIndents } from "../../redux/purchase/savedIndentsSlice";
import { remove_indent } from "../../redux/purchase/purchaseSlice";

function SavedIndentsTable() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const role = useSelector((state) => state.user.role);
  const username = useSelector((state) => state.user.roll_no);
  const { indents, error, loading, fetched } = useSelector(
    (state) => state.savedIndent,
  );
  const [department] = useState("");
  console.log(useSelector((state) => state.user));

  useEffect(() => {
    if (!fetched) {
      dispatch(fetchIndents({ username }));
    }
  }, [dispatch, username, role, fetched]);

  console.log(indents);

  // const remove_indent = async (id) => {
  //   try {
  //     const token = localStorage.getItem("authToken");
  //     await axios.post(
  //       deleteIndentRoute,
  //       {
  //         file_id: id,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Token ${token}`,
  //         },
  //       },
  //     );
  //     fetchIndents();
  //   } catch (err) {
  //     console.error(
  //       "Error removing indent:",
  //       err.response?.data || err.message,
  //     );
  //   }
  // };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text color="red">{error}</Text>;
  }

  return (
    <Box p="md" style={{ margin: 0 }}>
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
          All Saved Indents
        </Text>
      </Box>
      <Table
        style={{
          backgroundColor: "#f3f9ff",
          borderRadius: "8px",
          overflow: "hidden",
          border: "1px solid #E0E0E0",
        }}
      >
        <thead>
          <tr>
            <th style={{ backgroundColor: "white", padding: "12px" }}>
              Created By
            </th>
            <th style={{ backgroundColor: "white", padding: "12px" }}>
              File ID
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
          {indents.map((booking, index) =>
            index % 2 === 0 ? (
              <tr key={booking.id} style={{ backgroundColor: "#f8fafb" }}>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  <Text weight={500}>{booking.name}</Text>
                  <Text size="sm">
                    {booking.uploader} - {role}
                  </Text>
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  {department}&nbsp;#{booking.id}
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  {booking.subject ? booking.subject : "None"}
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  {booking.upload_date}
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
                      navigate(`/purchase/viewsavedindent/${booking.id}`)
                    }
                  >
                    View
                  </Button>
                  <Button
                    variant="outline"
                    color="red"
                    onClick={() => remove_indent(booking.id)}
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
                  <Text weight={500}>{booking.name}</Text>
                  <Text size="sm">
                    {booking.uploader} - {role}
                  </Text>
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  {department}&nbsp;#{booking.id}
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  {booking.subject ? booking.subject : "None"}
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  {booking.upload_date}
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
                      navigate(`/purchase/viewsavedindent/${booking.id}`)
                    }
                  >
                    View
                  </Button>
                  <Button
                    variant="outline"
                    color="red"
                    onClick={() => remove_indent(booking.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </Table>
    </Box>
  );
}

function SavedIndents() {
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
          <SavedIndentsTable />
        </Box>
      </Box>
    </MantineProvider>
  );
}

export default SavedIndents;
