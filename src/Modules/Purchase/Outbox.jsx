import React, { useEffect } from "react";
import { MantineProvider, Table, Button, Text, Box, Flex } from "@mantine/core";
import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
// import { outboxViewRoute2 } from "../../routes/purchaseRoutes";
import { fetchIndentsOutbox } from "../../redux/purchase/outboxSlice";

function OutboxTable() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const role = useSelector((state) => state.user.role);
  const username = useSelector((state) => state.user.roll_no);
  const { outbox, error, loading, fetched } = useSelector(
    (state) => state.outbox,
  );

  console.log(role);
  useEffect(() => {
    if (!fetched) {
      dispatch(fetchIndentsOutbox({ username, role }));
    }
  }, [dispatch, username, role, fetched]);
  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text style={{ color: "red" }}>{error}</Text>;
  }
  return (
    <Box p="md" style={{ margin: 0 }}>
      {" "}
      {/* <Box
        mb="md"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          size="xl"
          style={{
            paddingBottom: 15,
            fontWeight: "bold",
          }}
        >
          Outbox
        </Text>
      </Box> */}
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
          Outbox
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
              Send By
            </th>
            <th style={{ backgroundColor: "white", padding: "12px" }}>
              Send to
            </th>
            <th style={{ backgroundColor: "white", padding: "12px" }}>
              File Id
            </th>
            {/* <th style={{ backgroundColor: "#D9EAF7", padding: "12px" }}>
              Subject
            </th> */}
            <th style={{ backgroundColor: "white", padding: "12px" }}>Date</th>
            <th style={{ backgroundColor: "white", padding: "12px" }}>
              Features
            </th>
          </tr>
        </thead>
        <tbody>
          {outbox.map((row, index) =>
            index % 2 === 0 ? (
              <tr key={row.id} style={{ backgroundColor: "#f8fafb" }}>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  <Text weight={500}>{row.uploader}</Text>
                  {/* <Text syle={{ size: "sm", color: "dimmed" }}>
                    {row.email}
                  </Text> */}
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  <Text weight={500}>{row.receiver_username}</Text>
                  {/* <Text style={{ size: "sm", color: "dimmed" }}> */}
                  {/* {row.receiver_email} */}
                  {/* </Text> */}
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  {row.id}
                </td>
                {/* <td
              style={{
                padding: "12px",
                borderBottom: "1px solid #E0E0E0",
                textAlign: "center",
              }}
            >
              {row.subject}
            </td> */}
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  {row.upload_date}
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  <Flex
                    direction="row"
                    gap="md"
                    justify="center"
                    align="center"
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                  >
                    <Button
                      color="green"
                      style={{ marginRight: "8px" }}
                      onClick={() =>
                        navigate(`/purchase/Employeeviewfiledindent/${row.id}`)
                      }
                    >
                      View
                    </Button>
                    <Button variant="outline" color="red">
                      Delete
                    </Button>
                  </Flex>
                </td>
              </tr>
            ) : (
              <tr key={row.id} style={{ backgroundColor: "white" }}>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  <Text weight={500}>{row.uploader}</Text>
                  <Text syle={{ size: "sm", color: "dimmed" }}>
                    {row.email}
                  </Text>
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  <Text weight={500}>{row.receiver_username}</Text>
                  {/* <Text weight={500}>vkjain</Text> */}
                  <Text style={{ size: "sm", color: "dimmed" }}>
                    {row.receiver_email}
                  </Text>
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  {row.id}
                </td>
                {/* <td
            style={{
              padding: "12px",
              borderBottom: "1px solid #E0E0E0",
              textAlign: "center",
            }}
          >
            {row.subject}
          </td> */}
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  {row.upload_date}
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  <Flex
                    direction="row"
                    gap="md"
                    justify="center"
                    align="center"
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                  >
                    <Button
                      color="green"
                      style={{ marginRight: "8px" }}
                      onClick={() =>
                        navigate(`/purchase/Employeeviewfiledindent/${row.id}`)
                      }
                    >
                      View
                    </Button>
                    <Button variant="outline" color="red">
                      Delete
                    </Button>
                  </Flex>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </Table>
    </Box>
  );
}
function Outbox() {
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
          <OutboxTable />
        </Box>
      </Box>
    </MantineProvider>
  );
}

export default Outbox;
