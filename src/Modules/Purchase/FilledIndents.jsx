// import { MantineProvider, Table, Button, Text, Box } from "@mantine/core";
// // import { MantineReactTable } from "mantine-react-table";
// import { useNavigate } from "react-router-dom";
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import {
//   deleteIndentRoute,
//   viewIndentByUsernameAndRoleRoute,
// } from "../../routes/purchaseRoutes";

// function FiledIndentsTable() {
//   const navigate = useNavigate();
//   const [fileIndent, setFileIndent] = useState([]); // State for indents data
//   const [loading, setLoading] = useState(true); // State for loading status
//   const [error, setError] = useState(null); // State for error handling
//   // const navigate = useNavigate();
//   const role = useSelector((state) => state.user.role);
//   // eslint-disable-next-line no-restricted-globals
//   console.log(role);
//   const username = useSelector((state) => state.user.roll_no);

//   const fetchIndents = async () => {
//     try {
//       const token = localStorage.getItem("authToken"); // Assuming token is stored in localStorage after login
//       // const holdsDesignationId = localStorage.getItem("holdsDesignationId"); // Get the HoldsDesignation ID

//       const response = await axios.get(
//         viewIndentByUsernameAndRoleRoute(username, role), // Use dynamic HoldsDesignation ID
//         {
//           headers: {
//             Authorization: `Token ${token}`, // Add the token in Authorization header
//           },
//         },
//       );
//       setFileIndent(response.data.Data); // Set the fetched data to indents state
//       console.log(fileIndent);
//       // setDepartment(response.data.department);
//       console.log(response.data);
//       setLoading(false); // Stop loading once data is fetched
//     } catch (err) {
//       setError("Failed to fetch indents."); // Handle errors
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchIndents();
//   }, []);
//   console.log(fileIndent);
//   const remove_indent = async (id) => {
//     try {
//       const token = localStorage.getItem("authToken");
//       await axios.post(
//         deleteIndentRoute,
//         {
//           file_id: id,
//         },
//         {
//           headers: {
//             Authorization: `Token ${token}`,
//           },
//         },
//       );
//       fetchIndents();
//     } catch (err) {
//       console.error(
//         "Error removing indent:",
//         err.response?.data || err.message,
//       );
//     }
//   };

//   console.log(fileIndent);
//   if (loading) {
//     return <Text>Loading...</Text>; // Display loading state
//   }

//   if (error) {
//     return <Text color="red">{error}</Text>; // Display error message
//   }
//   return (
//     <Box p="md" style={{ margin: 5 }}>
//       {" "}
//       {/* Removed margin-top completely */}
//       <Box
//         mb="md"
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <Text
//           size="26px"
//           style={{
//             fontWeight: "bold",
//             textAlign: "center",
//             color: "#1881d9",
//           }}
//         >
//           All Filed Indents
//         </Text>
//       </Box>
//       <Table
//         style={{
//           // backgroundColor: "#f3f9ff", // Changed background color
//           borderRadius: "8px", // Border radius for table
//           overflow: "hidden", // Overflow hidden to round table corners
//           border: "1px solid #E0E0E0", // Optional border for visibility
//         }}
//       >
//         <thead>
//           <tr>
//             {/* <th style={{ backgroundColor: "#D9EAF7", padding: "12px" }}>
//              */}
//             <th style={{ backgroundColor: "white", padding: "12px" }}>
//               Created By
//             </th>
//             <th style={{ backgroundColor: "white", padding: "12px" }}>
//               Fileid
//             </th>
//             <th style={{ backgroundColor: "white", padding: "12px" }}>
//               Subject
//             </th>
//             <th style={{ backgroundColor: "white", padding: "12px" }}>Date</th>
//             <th style={{ backgroundColor: "white", padding: "12px" }}>
//               Features
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {fileIndent.map((booking, index) =>
//             index % 2 === 0 ? (
//               <tr key={booking.id} style={{ backgroundColor: "#f8fafb" }}>
//                 <td
//                   style={{
//                     padding: "12px",
//                     borderBottom: "1px solid #E0E0E0",
//                     textAlign: "center",
//                   }}
//                 >
//                   <Text size="sm">{booking.draft_file.uploader}</Text>
//                 </td>
//                 <td
//                   style={{
//                     padding: "12px",
//                     borderBottom: "1px solid #E0E0E0",
//                     textAlign: "center",
//                   }}
//                 >
//                   {booking.draft_file.id}
//                 </td>
//                 <td
//                   style={{
//                     padding: "12px",
//                     borderBottom: "1px solid #E0E0E0",
//                     textAlign: "center",
//                   }}
//                 >
//                   {booking.indent.item_name ? booking.indent.item_name : "None"}
//                 </td>
//                 <td
//                   style={{
//                     padding: "12px",
//                     borderBottom: "1px solid #E0E0E0",
//                     textAlign: "center",
//                   }}
//                 >
//                   {booking.draft_file.upload_date}
//                 </td>
//                 <td
//                   style={{
//                     padding: "12px",
//                     borderBottom: "1px solid #E0E0E0",
//                     textAlign: "center",
//                   }}
//                 >
//                   <Button
//                     color="green"
//                     style={{ marginRight: "8px" }}
//                     onClick={() =>
//                       navigate(
//                         `/purchase/employeeviewfiledindent/${booking.indent.file_info}`,
//                       )
//                     }
//                   >
//                     View
//                   </Button>
//                   <Button
//                     variant="outline"
//                     color="red"
//                     onClick={() => {
//                       remove_indent(booking.indent.file_info);
//                     }}
//                   >
//                     Delete
//                   </Button>
//                 </td>
//               </tr>
//             ) : (
//               <tr key={booking.id} style={{ backgroundColor: "white" }}>
//                 <td
//                   style={{
//                     padding: "12px",
//                     borderBottom: "1px solid #E0E0E0",
//                     textAlign: "center",
//                   }}
//                 >
//                   <Text size="sm">{booking.draft_file.uploader}</Text>
//                 </td>
//                 <td
//                   style={{
//                     padding: "12px",
//                     borderBottom: "1px solid #E0E0E0",
//                     textAlign: "center",
//                   }}
//                 >
//                   {booking.draft_file.id}
//                 </td>
//                 <td
//                   style={{
//                     padding: "12px",
//                     borderBottom: "1px solid #E0E0E0",
//                     textAlign: "center",
//                   }}
//                 >
//                   {booking.indent.item_name ? booking.indent.item_name : "None"}
//                 </td>
//                 <td
//                   style={{
//                     padding: "12px",
//                     borderBottom: "1px solid #E0E0E0",
//                     textAlign: "center",
//                   }}
//                 >
//                   {booking.draft_file.upload_date}
//                 </td>
//                 <td
//                   style={{
//                     padding: "12px",
//                     borderBottom: "1px solid #E0E0E0",
//                     textAlign: "center",
//                   }}
//                 >
//                   <Button
//                     color="green"
//                     style={{ marginRight: "8px" }}
//                     onClick={() =>
//                       navigate(
//                         `/purchase/employeeviewfiledindent/${booking.indent.file_info}`,
//                       )
//                     }
//                   >
//                     View
//                   </Button>
//                   <Button
//                     variant="outline"
//                     color="red"
//                     onClick={() => {
//                       remove_indent(booking.indent.file_info);
//                     }}
//                   >
//                     Delete
//                   </Button>
//                 </td>
//               </tr>
//             ),
//           )}
//         </tbody>
//       </Table>
//     </Box>
//   );
// }

// function FiledIndents() {
//   return (
//     <MantineProvider withGlobalStyles withNormalizeCSS>
//       <Box
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "80vh", // Full viewport height
//           overflow: "auto", // Ensure scroll if content exceeds viewport
//         }}
//       >
//         <Box
//           style={{
//             maxWidth: "1440px", // Increased max width by 20%
//             width: "100%", // Make it responsive
//             backgroundColor: "white",
//             borderRadius: "12px", // Add border radius to outer Box
//             padding: "16px", // Optional padding
//             boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Optional shadow
//             overflowX: "auto", // Horizontal scroll bar
//             overflowY: "auto", // Vertical scroll bar
//             maxHeight: "80vh", // Limit height to 80% of the viewport
//           }}
//         >
//           <FiledIndentsTable />
//         </Box>
//       </Box>
//     </MantineProvider>
//   );
// }

// export default FiledIndents;

// import React, { useState, useEffect } from "react";
// import { MantineProvider, Table, Button, Text, Box, Flex } from "@mantine/core";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import { outboxViewRoute2 } from "../../routes/purchaseRoutes";

// function OutboxTable() {
//   const [outbox, setOutbox] = useState([]);
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const role = useSelector((state) => state.user.role);
//   const username = useSelector((state) => state.user.roll_no);
//   // const username = useSelector((state) => state.user.username);
//   console.log(role);
//   useEffect(() => {
//     const fetchIndents = async () => {
//       try {
//         const token = localStorage.getItem("authToken");
//         // const holdsDesignationId = localStorage.getItem("holdsDesignationId"); // Get the HoldsDesignation ID
//         const response = await axios.get(outboxViewRoute2(username, role), {
//           headers: {
//             Authorization: `Token ${token}`,
//           },
//         });
//         console.log(response.data.in_file);
//         setOutbox(response.data.in_file);
//         // setDepartment(response.data.department);
//         setLoading(false);
//       } catch (err) {
//         setError("Failed to fetch indents.");
//         setLoading(false);
//       }
//     };

//     fetchIndents();
//   }, []);
//   if (loading) {
//     return <Text>Loading...</Text>;
//   }

//   if (error) {
//     return <Text style={{ color: "red" }}>{error}</Text>; // Display error message
//   }
//   return (
//     <Box p="md" style={{ margin: 0 }}>
//       {" "}
//       {/* <Box
//         mb="md"
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <Text
//           size="xl"
//           style={{
//             paddingBottom: 15,
//             fontWeight: "bold",
//           }}
//         >
//           Outbox
//         </Text>
//       </Box> */}
//       <Box
//         mb="md"
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <Text
//           size="26px"
//           style={{
//             fontWeight: "bold",
//             textAlign: "center",
//             color: "#1881d9",
//           }}
//         >
//           All Filed Indents
//         </Text>
//       </Box>
//       <Table
//         style={{
//           backgroundColor: "#f3f9ff", // Changed background color
//           borderRadius: "8px", // Border radius for table
//           overflow: "hidden", // Overflow hidden to round table corners
//           border: "1px solid #E0E0E0", // Optional border for visibility
//         }}
//       >
//         <thead>
//           <tr>
//             <th style={{ backgroundColor: "white", padding: "12px" }}>
//               Send By
//             </th>
//             <th style={{ backgroundColor: "white", padding: "12px" }}>
//               Send to
//             </th>
//             <th style={{ backgroundColor: "white", padding: "12px" }}>
//               File Id
//             </th>
//             {/* <th style={{ backgroundColor: "#D9EAF7", padding: "12px" }}>
//               Subject
//             </th> */}
//             <th style={{ backgroundColor: "white", padding: "12px" }}>Date</th>
//             <th style={{ backgroundColor: "white", padding: "12px" }}>
//               Features
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {outbox.map((row, index) =>
//             index % 2 === 0 ? (
//               <tr key={row.id} style={{ backgroundColor: "#f8fafb" }}>
//                 <td
//                   style={{
//                     padding: "12px",
//                     borderBottom: "1px solid #E0E0E0",
//                     textAlign: "center",
//                   }}
//                 >
//                   <Text weight={500}>{row.uploader}</Text>
//                   {/* <Text syle={{ size: "sm", color: "dimmed" }}>
//                     {row.email}
//                   </Text> */}
//                 </td>
//                 <td
//                   style={{
//                     padding: "12px",
//                     borderBottom: "1px solid #E0E0E0",
//                     textAlign: "center",
//                   }}
//                 >
//                   <Text weight={500}>{row.receiver_username}</Text>
//                   {/* <Text style={{ size: "sm", color: "dimmed" }}> */}
//                   {/* {row.receiver_email} */}
//                   {/* </Text> */}
//                 </td>
//                 <td
//                   style={{
//                     padding: "12px",
//                     borderBottom: "1px solid #E0E0E0",
//                     textAlign: "center",
//                   }}
//                 >
//                   {row.id}
//                 </td>
//                 {/* <td
//               style={{
//                 padding: "12px",
//                 borderBottom: "1px solid #E0E0E0",
//                 textAlign: "center",
//               }}
//             >
//               {row.subject}
//             </td> */}
//                 <td
//                   style={{
//                     padding: "12px",
//                     borderBottom: "1px solid #E0E0E0",
//                     textAlign: "center",
//                   }}
//                 >
//                   {row.upload_date}
//                 </td>
//                 <td
//                   style={{
//                     padding: "12px",
//                     borderBottom: "1px solid #E0E0E0",
//                     textAlign: "center",
//                   }}
//                 >
//                   <Flex
//                     direction="row"
//                     gap="md"
//                     justify="center"
//                     align="center"
//                     style={{ marginTop: "10px", marginBottom: "10px" }}
//                   >
//                     <Button
//                       color="green"
//                       style={{ marginRight: "8px" }}
//                       onClick={() =>
//                         navigate(`/purchase/Employeeviewfiledindent/${row.id}`)
//                       }
//                     >
//                       View
//                     </Button>
//                     <Button variant="outline" color="red">
//                       Delete
//                     </Button>
//                   </Flex>
//                 </td>
//               </tr>
//             ) : (
//               <tr key={row.id} style={{ backgroundColor: "white" }}>
//                 <td
//                   style={{
//                     padding: "12px",
//                     borderBottom: "1px solid #E0E0E0",
//                     textAlign: "center",
//                   }}
//                 >
//                   <Text weight={500}>{row.uploader}</Text>
//                   <Text syle={{ size: "sm", color: "dimmed" }}>
//                     {row.email}
//                   </Text>
//                 </td>
//                 <td
//                   style={{
//                     padding: "12px",
//                     borderBottom: "1px solid #E0E0E0",
//                     textAlign: "center",
//                   }}
//                 >
//                   <Text weight={500}>{row.receiver_username}</Text>
//                   {/* <Text weight={500}>vkjain</Text> */}
//                   <Text style={{ size: "sm", color: "dimmed" }}>
//                     {row.receiver_email}
//                   </Text>
//                 </td>
//                 <td
//                   style={{
//                     padding: "12px",
//                     borderBottom: "1px solid #E0E0E0",
//                     textAlign: "center",
//                   }}
//                 >
//                   {row.id}
//                 </td>
//                 {/* <td
//             style={{
//               padding: "12px",
//               borderBottom: "1px solid #E0E0E0",
//               textAlign: "center",
//             }}
//           >
//             {row.subject}
//           </td> */}
//                 <td
//                   style={{
//                     padding: "12px",
//                     borderBottom: "1px solid #E0E0E0",
//                     textAlign: "center",
//                   }}
//                 >
//                   {row.upload_date}
//                 </td>
//                 <td
//                   style={{
//                     padding: "12px",
//                     borderBottom: "1px solid #E0E0E0",
//                     textAlign: "center",
//                   }}
//                 >
//                   <Flex
//                     direction="row"
//                     gap="md"
//                     justify="center"
//                     align="center"
//                     style={{ marginTop: "10px", marginBottom: "10px" }}
//                   >
//                     <Button
//                       color="green"
//                       style={{ marginRight: "8px" }}
//                       onClick={() =>
//                         navigate(`/purchase/Employeeviewfiledindent/${row.id}`)
//                       }
//                     >
//                       View
//                     </Button>
//                     <Button variant="outline" color="red">
//                       Delete
//                     </Button>
//                   </Flex>
//                 </td>
//               </tr>
//             ),
//           )}
//         </tbody>
//       </Table>
//     </Box>
//   );
// }
// function Outbox() {
//   return (
//     <MantineProvider withGlobalStyles withNormalizeCSS>
//       <Box
//         style={{
//           display: "flex",
//           justifyContent: "center", // Center horizontally
//           alignItems: "center", // Center vertically
//           height: "80vh", // Full viewport height
//           overflow: "auto", // Ensure scroll if content exceeds viewport
//         }}
//       >
//         <Box
//           style={{
//             maxWidth: "1440px", // Increased max width by 20%
//             width: "100%", // Make it responsive
//             backgroundColor: "white",
//             borderRadius: "12px", // Add border radius to outer Box
//             padding: "16px", // Optional padding
//             boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Optional shadow
//             overflowX: "auto", // Horizontal scroll bar
//             overflowY: "auto", // Vertical scroll bar
//             maxHeight: "80vh", // Limit height to 80% of the viewport
//           }}
//         >
//           <OutboxTable />
//         </Box>
//       </Box>
//     </MantineProvider>
//   );
// }

// export default Outbox;

import React, { useState, useEffect } from "react";
import { MantineProvider, Table, Button, Text, Box, Flex } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { outboxViewRoute2 } from "../../routes/purchaseRoutes";

function OutboxTable() {
  const [outbox, setOutbox] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const role = useSelector((state) => state.user.role);
  const username = useSelector((state) => state.user.roll_no);
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

  useEffect(() => {
    const fetchIndents = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(outboxViewRoute2(username, role), {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setOutbox(response.data.in_file);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch indents.");
        setLoading(false);
      }
    };

    fetchIndents();
  }, [username, role]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text style={{ color: "red" }}>{error}</Text>;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "In-Progress":
        return "orange";
      case "Completed":
        return "green";
      case "Approved":
        return "blue";
      default:
        return "gray";
    }
  };

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
          All Filed Indents
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
              File Id
            </th>
            <th style={{ backgroundColor: "white", padding: "12px" }}>
              Indent Name
            </th>
            <th style={{ backgroundColor: "white", padding: "12px" }}>Date</th>
            <th style={{ backgroundColor: "white", padding: "12px" }}>
              Status
            </th>
            <th style={{ backgroundColor: "white", padding: "12px" }}>
              Features
            </th>
          </tr>
        </thead>
        <tbody>
          {outbox.map((row, index) => {
            const status = ["In-Progress"][Math.floor(Math.random() * 1)];
            return (
              <tr
                key={row.id}
                style={{
                  backgroundColor: index % 2 === 0 ? "#f8fafb" : "white",
                }}
              >
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  {row.id}
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  Items
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  {formatDate(row.upload_date)}
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  <Text weight={500} color={getStatusColor(status)}>
                    {status}
                  </Text>
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
            );
          })}
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
