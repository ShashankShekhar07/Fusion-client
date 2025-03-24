// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import {
//   Container,
//   Grid,
//   Paper,
//   Text,
//   Group,
//   Button,
//   Title,
// } from "@mantine/core";
// import axios from "axios";
// import DataTable from "./Table";
// import {
//   archiveIndentRoute,
//   viewIndentRoute,
// } from "../../routes/purchaseRoutes";

// function EmployeeViewFileIndent() {
//   const navigate = useNavigate();
//   const { indentID } = useParams();
//   const handleSubmit = () => {
//     alert("Submitted");
//   };
//   const role = useSelector((state) => state.user.role);
//   // const username = useSelector((state) => state.user.roll_no);
//   const [err, setErr] = useState("");
//   const archieveIndent = async (indent_id) => {
//     // Send POST request to archive the file
//     const id = indent_id;
//     try {
//       // setLoading(true);
//       const token = localStorage.getItem("authToken");
//       const response = await axios.get(archiveIndentRoute(role, id), {
//         headers: {
//           Authorization: `Token ${token}`, // Correct placement of headers
//         },
//       });

//       console.log(response);
//       navigate("/purchase/archieved_indents");
//       // setLoading(false);
//     } catch (error) {
//       setErr("Failed to archieve indent."); // Handle errors
//       console.log(err);
//       // setLoading(false);
//     }
//   };
//   const [indent, setIndent] = useState(null);

//   const fetchIndentDetails = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.post(
//         viewIndentRoute,
//         { file_id: indentID },
//         {
//           headers: {
//             Authorization: `Token ${token}`,
//             "Content-Type": "application/json",
//           },
//         },
//       );
//       setIndent(response.data.indent);
//     } catch (error) {
//       console.error("Error fetching indents:", error);
//     }
//   };

//   useEffect(() => {
//     if (indentID) {
//       fetchIndentDetails(indentID);
//     }
//   }, [indentID]);

//   return (
//     <div>
//       <Container
//         size="lg"
//         px="md"
//         backgroundColor="white"
//         style={{
//           backgroundColor: "white",
//           shadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
//           padding: "20px",
//         }}
//       >
//         <Paper
//           shadow="sm"
//           padding="lg"
//           radius="md"
//           style={{
//             // backgroundColor: "#f3f9ff",
//             backgroundColor: "#D9EAF7",
//             marginRight: "170px",
//             marginLeft: "170px",
//             marginTop: "2px",
//             padding: "5px",
//           }}
//         >
//           {/* Header Section */}
//           <Group position="apart" mb="lg" justify="space-evenly">
//             <Title order={3}>Note Sheets</Title>
//             {/* <PiPrinter size={28} /> */}
//             <Title order={3}>Attachments</Title>
//           </Group>

//           {/* Created By and File ID Section */}
//           <Grid columns={2} gutter="lg" style={{ marginLeft: "24px" }}>
//             <Grid.Col span={1}>
//               <Group>
//                 <Text weight={600}>
//                   <strong>Created by:</strong>
//                 </Text>
//                 <Text>atul-professor</Text>
//               </Group>
//             </Grid.Col>
//             <Grid.Col span={1}>
//               <Group>
//                 <Text weight={600}>
//                   <strong>File ID:</strong>
//                 </Text>
//                 <Text>CSE-2027-9-#{indentID}</Text>
//               </Group>
//             </Grid.Col>
//             <Grid.Col span={2}>
//               <Text>
//                 <DataTable indent={indent} />
//               </Text>
//             </Grid.Col>
//             {/* <Grid.Col span={2}>
//               <Text>
//                 <DataTable2 />
//               </Text>
//             </Grid.Col> */}
//           </Grid>
//           <form onSubmit={handleSubmit} style={{ marginLeft: "24px" }}>
//             <Group position="right" mt="lg" style={{ justifyContent: "end" }}>
//               <Button
//                 type="submit"
//                 variant="fill"
//                 color="blue"
//                 onClick={() => {
//                   archieveIndent(indentID);
//                 }}
//               >
//                 Archieve
//               </Button>
//             </Group>
//           </form>
//         </Paper>
//       </Container>
//     </div>
//   );
// }

// export default EmployeeViewFileIndent;

// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import {
//   Container,
//   Paper,
//   Text,
//   Group,
//   Button,
//   Title,
//   Timeline,
//   Badge,
//   Card,
//   Grid,
//   Accordion,
//   Tabs,
//   ActionIcon,
//   Tooltip,
// } from "@mantine/core";
// import {
//   IconFileDescription,
//   IconArchive,
//   IconCheck,
//   IconClock,
//   IconNotes,
//   IconPaperclip,
//   IconPrinter,
// } from "@tabler/icons-react";
// import axios from "axios";
// import dayjs from "dayjs";
// import DataTable from "./Table";
// import {
//   archiveIndentRoute,
//   viewIndentRoute,
// } from "../../routes/purchaseRoutes";

// function EmployeeViewFileIndent() {
//   const navigate = useNavigate();
//   const { indentID } = useParams();
//   const role = useSelector((state) => state.user.role);
//   const [error, setError] = useState("");
//   const [indent, setIndent] = useState(null);
//   const [activeTab, setActiveTab] = useState("notesheets");
//   const [loading, setLoading] = useState(false);

//   const archiveIndent = async (indentId) => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("authToken");
//       await axios.get(archiveIndentRoute(role, indentId), {
//         headers: {
//           Authorization: `Token ${token}`,
//         },
//       });
//       navigate("/purchase/archieved_indents");
//     } catch (error) {
//       setError("Failed to archive indent.");
//       console.error("Archive error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchIndentDetails = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("authToken");
//       const response = await axios.post(
//         viewIndentRoute,
//         { file_id: indentID },
//         {
//           headers: {
//             Authorization: `Token ${token}`,
//             "Content-Type": "application/json",
//           },
//         },
//       );
//       setIndent(response.data.indent);
//     } catch (error) {
//       console.error("Error fetching indents:", error);
//       setError("Failed to fetch indent details.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (indentID) {
//       fetchIndentDetails();
//     }
//   }, [indentID]);

//   if (!indent) {
//     return (
//       <Container size="xl" py="xl">
//         <Text>Loading indent details...</Text>
//       </Container>
//     );
//   }

//   return (
//     <Container size="xl" py="xl">
//       {/* Header Section */}
//       <Paper shadow="sm" p="md" mb="xl" radius="md">
//         <Group position="apart" mb="md">
//           <Group>
//             <IconFileDescription size={32} />
//             <div>
//               <Title order={2}>Indent #{indentID}</Title>
//               <Text color="dimmed">
//                 Filed on {dayjs(indent.created_at).format("MMMM D, YYYY")}
//               </Text>
//             </div>
//           </Group>
//           <Group>
//             <Badge size="lg" color={indent.purchased ? "green" : "blue"}>
//               {indent.purchased ? "Purchased" : "In Progress"}
//             </Badge>
//             {indent.revised && (
//               <Badge size="lg" color="yellow">
//                 Revised
//               </Badge>
//             )}
//             <Tooltip label="Print Indent">
//               <ActionIcon variant="light" size="lg">
//                 <IconPrinter size={20} />
//               </ActionIcon>
//             </Tooltip>
//           </Group>
//         </Group>

//         {/* Approval Timeline */}
//         <Timeline active={1} bulletSize={24} lineWidth={2}>
//           <Timeline.Item
//             bullet={
//               indent.head_approval ? (
//                 <IconCheck size={12} />
//               ) : (
//                 <IconClock size={12} />
//               )
//             }
//             title="Head Approval"
//           >
//             <Text color="dimmed" size="sm">
//               Department head approval status
//             </Text>
//           </Timeline.Item>
//           <Timeline.Item
//             bullet={
//               indent.director_approval ? (
//                 <IconCheck size={12} />
//               ) : (
//                 <IconClock size={12} />
//               )
//             }
//             title="Director Approval"
//           >
//             <Text color="dimmed" size="sm">
//               Director approval status
//             </Text>
//           </Timeline.Item>
//           <Timeline.Item
//             bullet={
//               indent.financial_approval ? (
//                 <IconCheck size={12} />
//               ) : (
//                 <IconClock size={12} />
//               )
//             }
//             title="Financial Approval"
//           >
//             <Text color="dimmed" size="sm">
//               Financial clearance status
//             </Text>
//           </Timeline.Item>
//         </Timeline>
//       </Paper>

//       {/* Content Tabs */}
//       <Tabs value={activeTab} onChange={setActiveTab} mb="xl">
//         <Tabs.List>
//           <Tabs.Tab value="notesheets" leftSection={<IconNotes size={16} />}>
//             Note Sheets
//           </Tabs.Tab>
//           <Tabs.Tab
//             value="attachments"
//             leftSection={<IconPaperclip size={16} />}
//           >
//             Attachments
//           </Tabs.Tab>
//         </Tabs.List>

//         <Tabs.Panel value="notesheets" pt="md">
//           <Card shadow="sm" radius="md" p="md">
//             <Grid>
//               <Grid.Col span={6}>
//                 <Group>
//                   <Text weight={600}>Created by:</Text>
//                   <Text>{indent.created_by || "atul-professor"}</Text>
//                 </Group>
//               </Grid.Col>
//               <Grid.Col span={6}>
//                 <Group>
//                   <Text weight={600}>File ID:</Text>
//                   <Text>CSE-2024-02-#{indentID}</Text>
//                 </Group>
//               </Grid.Col>
//             </Grid>
//           </Card>

//           {/* Indent Details */}
//           <Accordion variant="contained" radius="md" mt="md">
//             <Accordion.Item value="details">
//               <Accordion.Control>
//                 <Group position="apart">
//                   <Text weight={500}>Indent Details</Text>
//                   <Badge>Status: Active</Badge>
//                 </Group>
//               </Accordion.Control>
//               <Accordion.Panel>
//                 <DataTable indent={indent} />
//               </Accordion.Panel>
//             </Accordion.Item>
//           </Accordion>
//         </Tabs.Panel>

//         <Tabs.Panel value="attachments" pt="md">
//           <Card shadow="sm" radius="md" p="md">
//             <Text>No attachments available</Text>
//           </Card>
//         </Tabs.Panel>
//       </Tabs>

//       {/* Action Buttons */}
//       <Group position="right">
//         <Button
//           variant="light"
//           color="blue"
//           leftIcon={<IconArchive size={20} />}
//           onClick={() => archiveIndent(indentID)}
//           loading={loading}
//         >
//           Archive Indent
//         </Button>
//       </Group>

//       {/* Error Message */}
//       {error && (
//         <Text color="red" mt="md">
//           {error}
//         </Text>
//       )}
//     </Container>
//   );
// }

// export default EmployeeViewFileIndent;

import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { usePDF } from "react-to-pdf";
import {
  Container,
  Paper,
  Text,
  Group,
  Button,
  Title,
  Timeline,
  Badge,
  Card,
  Grid,
  Accordion,
  Tabs,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import {
  IconFileDescription,
  IconArchive,
  IconCheck,
  IconClock,
  IconNotes,
  IconPaperclip,
  IconPrinter,
} from "@tabler/icons-react";
import axios from "axios";
import dayjs from "dayjs";
import DataTable from "./Table";
import {
  archiveIndentRoute,
  viewIndentRoute,
} from "../../routes/purchaseRoutes";

function EmployeeViewFileIndent() {
  const navigate = useNavigate();
  const { indentID } = useParams();
  const role = useSelector((state) => state.user.role);
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(null);
  const [activeTab, setActiveTab] = useState("notesheets");
  const [loading, setLoading] = useState(false);
  // const contentRef = useRef(null);

  const showStockEntryButton = () => {
    return (
      indent?.head_approval &&
      indent?.director_approval &&
      !indent?.financial_approval
    );
  };

  // const handlePrint = async () => {
  //   try {
  //     const options = {
  //       filename: `indent_${indentID}.pdf`,
  //       page: {
  //         margin: 20,
  //         format: "a4",
  //       },
  //     };
  //     await toPDF(contentRef, options);
  //   } catch (error) {
  //     console.error("Error generating PDF:", error);
  //     setError("Failed to generate PDF");
  //   }
  // };

  const { toPDF, targetRef } = usePDF({ filename: `indent_${indentID}.pdf` });

  const archiveIndent = async (indentId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      await axios.get(archiveIndentRoute(role, indentId), {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      navigate("/purchase/archieved_indents");
    } catch (error) {
      setError("Failed to archive indent.");
      console.error("Archive error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchIndentDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        viewIndentRoute,
        { file_id: indentID },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      setIndent(response.data.indent);
    } catch (error) {
      console.error("Error fetching indents:", error);
      setError("Failed to fetch indent details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (indentID) {
      fetchIndentDetails();
    }
  }, [indentID]);

  if (!indent) {
    return (
      <Container size="xl" py="xl">
        <Text>Loading indent details...</Text>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <div ref={targetRef}>
        {/* Header Section */}
        <Paper shadow="sm" p="md" mb="xl" radius="md">
          <Group position="apart" mb="md">
            <Group>
              <IconFileDescription size={32} />
              <div>
                <Title order={2}>Indent #{indentID}</Title>
                <Text color="dimmed">
                  Filed on {dayjs(indent.created_at).format("MMMM D, YYYY")}
                </Text>
              </div>
            </Group>
            <Group>
              <Badge size="lg" color={indent.purchased ? "green" : "blue"}>
                {indent.purchased ? "Purchased" : "In Progress"}
              </Badge>
              {indent.revised && (
                <Badge size="lg" color="yellow">
                  Revised
                </Badge>
              )}
              <Tooltip label="Print Indent">
                <ActionIcon variant="light" size="lg" onClick={() => toPDF()}>
                  <IconPrinter size={20} />
                </ActionIcon>
              </Tooltip>
              {showStockEntryButton() && (
                <Button
                  color="green"
                  onClick={() =>
                    navigate(`/purchase/stock_entry/`, { state: indent })
                  }
                >
                  Stock Entry
                </Button>
              )}
            </Group>
          </Group>

          {/* Approval Timeline */}
          <Timeline active={1} bulletSize={24} lineWidth={2}>
            <Timeline.Item
              bullet={
                indent.head_approval ? (
                  <IconCheck size={12} />
                ) : (
                  <IconClock size={12} />
                )
              }
              title="Head Approval"
            >
              <Text color="dimmed" size="sm">
                Department head approval status
              </Text>
            </Timeline.Item>
            <Timeline.Item
              bullet={
                indent.director_approval ? (
                  <IconCheck size={12} />
                ) : (
                  <IconClock size={12} />
                )
              }
              title="Director Approval"
            >
              <Text color="dimmed" size="sm">
                Director approval status
              </Text>
            </Timeline.Item>
            <Timeline.Item
              bullet={
                indent.financial_approval ? (
                  <IconCheck size={12} />
                ) : (
                  <IconClock size={12} />
                )
              }
              title="Financial Approval"
            >
              <Text color="dimmed" size="sm">
                Financial clearance status
              </Text>
            </Timeline.Item>
          </Timeline>
        </Paper>

        {/* Content Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab} mb="xl">
          <Tabs.List>
            <Tabs.Tab value="notesheets" leftSection={<IconNotes size={16} />}>
              Note Sheets
            </Tabs.Tab>
            <Tabs.Tab
              value="attachments"
              leftSection={<IconPaperclip size={16} />}
            >
              Attachments
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="notesheets" pt="md">
            <Card shadow="sm" radius="md" p="md">
              <Grid>
                <Grid.Col span={6}>
                  <Group>
                    <Text weight={600}>Created by:</Text>
                    <Text>{indent.created_by || "atul-professor"}</Text>
                  </Group>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Group>
                    <Text weight={600}>File ID:</Text>
                    <Text>CSE-2024-02-#{indentID}</Text>
                  </Group>
                </Grid.Col>
              </Grid>
            </Card>

            {/* Indent Details */}
            <Accordion variant="contained" radius="md" mt="md">
              <Accordion.Item value="details">
                <Accordion.Control>
                  <Group position="apart">
                    <Text weight={500}>Indent Details</Text>
                    <Badge>Status: Active</Badge>
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <DataTable indent={indent} />
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Tabs.Panel>

          <Tabs.Panel value="attachments" pt="md">
            <Card shadow="sm" radius="md" p="md">
              <Text>No attachments available</Text>
            </Card>
          </Tabs.Panel>
        </Tabs>
      </div>

      {/* Action Buttons */}
      <Group position="right">
        <Button
          variant="light"
          color="blue"
          leftIcon={<IconArchive size={20} />}
          onClick={() => archiveIndent(indentID)}
          loading={loading}
        >
          Archive Indent
        </Button>
      </Group>

      {/* Error Message */}
      {error && (
        <Text color="red" mt="md">
          {error}
        </Text>
      )}
    </Container>
  );
}

export default EmployeeViewFileIndent;
