import React, { useEffect } from "react";
import { MantineProvider, Table, Button, Text, Box } from "@mantine/core";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { viewIndentByUsernameAndRoleRoute2 } from "../../routes/purchaseRoutes";
import { fetchIndentsInbox } from "../../redux/purchase/inboxSlice";

function InboxTable() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const role = useSelector((state) => state.user.role);
  const username = useSelector((state) => state.user.roll_no);
  console.log(useSelector((state) => state.user));
  const { inbox, error, loading, fetched } = useSelector(
    (state) => state.inbox,
  );
  useEffect(() => {

    if (!fetched) {
      dispatch(fetchIndentsInbox({ username, role }));
    }
  }, [dispatch, username, role]);

    // Fetch indents from the server using HoldsDesignation ID from local storage
    const fetchIndents = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Assuming token is stored in localStorage after login
        // const holdsDesignationId = localStorage.getItem("holdsDesignationId"); // Get the HoldsDesignation ID
        // console.log("me");
        console.log(username);
        console.log(role);
        const response = await axios.get(
          viewIndentByUsernameAndRoleRoute2(username, role),
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          },
        );
        // const filteredData = response.data.in_file.filter(
        //   (item) => item.receiver_designation_name === role,
        // );
        setInbox(response.data.in_file); // Set the fetched data to indents state
        // setDepartment(response.data.department);
        setLoading(false); // Stop loading once data is fetched
      } catch (err) {
        setError("Failed to fetch indents."); // Handle errors
        setLoading(false);
      }
    };

    fetchIndents(); // Call the function to fetch indents
  }, [role]); // Empty dependency array to run effect on mount

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text color="red">{error}</Text>;
  }

  console.log(inbox);
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // Optional: Change to 24-hour format if needed
    });
  };
  return (
    <Box p="md">
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
          Inbox
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
              Received as
            </th>
            <th style={{ backgroundColor: "white", padding: "12px" }}>
              Send by
            </th>
            <th style={{ backgroundColor: "white", padding: "12px" }}>
              File Id
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
          {inbox.map((booking, index) =>
            index % 2 === 0 ? (
              <tr key={booking.id} style={{ backgroundColor: "#f8fafb" }}>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  <Text weight={500}>{username}</Text>
                  <Text size="sm" color="dimmed">
                    {booking.email}-{role}
                  </Text>
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  {booking.uploader}
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  {booking.id}
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
                  {/* {booking.upload_date} */}
                  {formatDate(booking.upload_date)}
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
                      navigate(`/purchase/forward_indent/${booking.id}`)
                    }
                  >
                    View
                  </Button>
                  <Button variant="outline" color="red">
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
                  <Text weight={500}>{username}</Text>
                  <Text size="sm" color="dimmed">
                    {booking.email}-{role}
                  </Text>
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  {booking.uploader}
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  {booking.id}
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
                  {formatDate(booking.upload_date)}
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
                      navigate(`/purchase/forward_indent/${booking.id}`)
                    }
                  >
                    View
                  </Button>
                  <Button variant="outline" color="red">
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

function Inbox() {
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
          <InboxTable />
        </Box>
      </Box>
    </MantineProvider>
  );
}

export default Inbox;
