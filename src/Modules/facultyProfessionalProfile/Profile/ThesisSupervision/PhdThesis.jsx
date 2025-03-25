// import { useState, useEffect } from "react";
// // import { Save, Edit, Trash } from "lucide-react";
// import axios from "axios";

// import {
//   MantineProvider,
//   Container,
//   Title,
//   Paper,
//   Grid,
//   TextInput,
//   Select,
//   Button,
//   Table,
//   ActionIcon,
// } from "@mantine/core";
// // import { DatePickerInput } from "@mantine/dates";
// import { FloppyDisk, PencilSimple, Trash } from "@phosphor-icons/react";

// export default function PhdThesis() {
//   const [inputs, setInputs] = useState({
//     name: "",
//     rollNumber: "",
//     month: "",
//     year: "",
//     title: "",
//     supervisor: "",
//   });

//   const [isLoading, setIsLoading] = useState(false);
//   const [tableData, setTableData] = useState([]);
//   const [, setError] = useState(null); // For error handling
//   const [isEdit, setEdit] = useState(false);
//   const [Id, setId] = useState(0);

//   // Fetch projects from the backend
//   const fetchProjects = async () => {
//     try {
//       const response = await axios.get(
//         "http://127.0.0.1:8000/FPF/phd_thesis/pf_no/",
//       );
//       const projects = response.data;
//       // Sort projects by submission date in descending order
//       const sortedProjects = projects.sort(
//         (a, b) => new Date(b.submission_date) - new Date(a.submission_date),
//       );
//       setTableData(sortedProjects);
//     } catch (error) {
//       console.error("Error fetching projects:", error);
//       setError("Failed to fetch projects. Please try again later."); // Set error message
//     }
//   };

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setIsLoading(true);

//       const formData = new FormData();
//       formData.append("user_id", pfNo); // Adjust this as needed
//       formData.append("s_year", inputs.year);
//       formData.append("name", inputs.name);
//       formData.append("roll", inputs.rollNumber);
//       formData.append("supervisors", inputs.supervisor);
//       formData.append("month", inputs.month);
//       formData.append("title", inputs.title);

//       if (isEdit === false) {
//         const res = await axios.post(
//           "http://127.0.0.1:8000/FPF/phd/",
//           formData,
//         );
//         console.log(res.data);
//       } else {
//         formData.append("phd_id", Id);
//         const res = await axios.post(
//           "http://127.0.0.1:8000/FPF/phd/",
//           formData,
//         );
//         console.log(res.data);
//         setEdit(false);
//         setId(0);
//       }

//       // Fetch updated project list after submission
//       fetchProjects();

//       // Reset the input fields
//       setInputs({
//         name: "",
//         rollNumber: "",
//         month: "",
//         year: "",
//         title: "",
//         supervisor: "",
//       });
//     } catch (error) {
//       console.log(error);
//       setError("Failed to submit data. Please try again."); // Set error message
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleEdit = (project) => {
//     // Populate the inputs with the project data for editing
//     setInputs({
//       name: project.s_name,
//       rollNumber: project.rollno,
//       month: project.a_month,
//       year: project.s_year,
//       title: project.title,
//       supervisor: project.supervisors,
//     });

//     setId(project.id);
//     setEdit(true);
//   };

//   const handleDelete = async (projectId) => {
//     console.log(projectId);
//     if (window.confirm("Are you sure you want to delete this Thesis?")) {
//       try {
//         await axios.post(
//           `http://127.0.0.1:8000/FPF/emp_mtechphd_thesisDelete/`,
//           new URLSearchParams({ pk: projectId }),
//         ); // Adjust the delete URL as needed
//         fetchProjects(); // Refresh the project list after deletion
//       } catch (error) {
//         console.error("Error deleting project:", error);
//       }
//     }
//   };

//   // return (
//   //     <div className="bg-white p-6 rounded-lg shadow-inner w-full max-w-8xl border-l-8 border-customSaveButtonColor">
//   //         <h1 className="text-lg font-medium text-gray-800 mb-1">Add a Thesis</h1>
//   //         <hr />
//   //         {error && <p className="text-red-500">{error}</p>} {/* Error message display */}
//   //         <form className="space-y-6 my-5" onSubmit={handleSubmit}>
//   //             <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
//   //                 <div>
//   //                     <label
//   //                         htmlFor="name"
//   //                         className="block text-sm font-medium text-gray-700"
//   //                     >
//   //                         Name
//   //                     </label>
//   //                     <input
//   //                         type="text"
//   //                         required
//   //                         id="name"
//   //                         placeholder="Name"
//   //                         className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//   //                         value={inputs.name}
//   //                         onChange={(e) =>
//   //                             setInputs({ ...inputs, name: e.target.value })
//   //                         }
//   //                     />
//   //                 </div>
//   //             </div>

//   //             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//   //                 <div>
//   //                     <label
//   //                         htmlFor="rollNumber"
//   //                         className="block text-sm font-medium text-gray-700"
//   //                     >
//   //                         Roll Number
//   //                     </label>
//   //                     <input
//   //                         type="text"
//   //                         required
//   //                         id="rollNumber"
//   //                         placeholder="Roll Number"
//   //                         className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//   //                         value={inputs.rollNumber}
//   //                         onChange={(e) =>
//   //                             setInputs({ ...inputs, rollNumber: e.target.value })
//   //                         }
//   //                     />
//   //                 </div>
//   //                 <div>
//   //                     <label
//   //                         htmlFor="month"
//   //                         className="block text-sm font-medium text-gray-700"
//   //                     >
//   //                         Month
//   //                     </label>
//   //                     <select
//   //                         id="month"
//   //                         required
//   //                         value={inputs.month}
//   //                         onChange={(e) =>
//   //                             setInputs({ ...inputs, month: e.target.value })
//   //                         }
//   //                         className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//   //                     >
//   //                         <option value="">Select Month</option>
//   //                         {Array.from({ length: 12 }, (_, i) => (
//   //                             <option key={i + 1} value={i + 1}>
//   //                                 {new Date(0, i + 1).toLocaleString('default', { month: 'long' })}
//   //                             </option>
//   //                         ))}
//   //                     </select>
//   //                 </div>

//   //                 <div>
//   //                     <label
//   //                         htmlFor="year"
//   //                         className="block text-sm font-medium text-gray-700"
//   //                     >
//   //                         Year
//   //                     </label>
//   //                     <select
//   //                         id="year"
//   //                         required
//   //                         value={inputs.year}
//   //                         onChange={(e) =>
//   //                             setInputs({ ...inputs, year: e.target.value })
//   //                         }
//   //                         className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//   //                     >
//   //                         <option value="">Select Year</option>
//   //                         {Array.from({ length: 4 }, (_, i) => (
//   //                             <option key={2023 + i} value={2023 + i}>
//   //                                 {2023 + i}
//   //                             </option>
//   //                         ))}
//   //                     </select>
//   //                 </div>
//   //             </div>

//   //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//   //                 <div>
//   //                     <label
//   //                         htmlFor="title"
//   //                         className="block text-sm font-medium text-gray-700"
//   //                     >
//   //                         Title
//   //                     </label>
//   //                     <input
//   //                         type="text"
//   //                         required
//   //                         id="title"
//   //                         placeholder="Thesis Title"
//   //                         className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//   //                         value={inputs.title}
//   //                         onChange={(e) =>
//   //                             setInputs({ ...inputs, title: e.target.value })
//   //                         }
//   //                     />
//   //                 </div>
//   //                 <div>
//   //                     <label
//   //                         htmlFor="supervisor"
//   //                         className="block text-sm font-medium text-gray-700"
//   //                     >
//   //                         Supervisor
//   //                     </label>
//   //                     <input
//   //                         type="text"
//   //                         required
//   //                         id="supervisor"
//   //                         placeholder="Supervisor"
//   //                         className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//   //                         value={inputs.supervisor}
//   //                         onChange={(e) =>
//   //                             setInputs({ ...inputs, supervisor: e.target.value })
//   //                         }
//   //                     />
//   //                 </div>
//   //             </div>

//   //             <div className="flex justify-end">
//   //                 <button
//   //                     type="submit"
//   //                     className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-customSaveButtonColor hover:bg-customSaveButtonColor focus:outline-none focus:ring-2 focus:ring-offset-2 focus:bg-customSaveButtonColor"
//   //                     disabled={isLoading}
//   //                 >
//   //                     <Save className="w-5 h-5 mr-2" />
//   //                     {isLoading ? "Saving..." : "Save"}
//   //                 </button>
//   //             </div>
//   //         </form>

//   //         <div className="overflow-x-auto">
//   //             <table className="min-w-full border border-gray-300">
//   //             <thead>
//   //                 <tr>
//   //                 <th className="border border-gray-300 p-2">Title</th>
//   //                 <th className="border border-gray-300 p-2">Roll Number</th>
//   //                 <th className="border border-gray-300 p-2">Name</th>
//   //                 <th className="border border-gray-300 p-2">Year</th>
//   //                 <th className="border border-gray-300 p-2">Month</th>
//   //                 <th className="border border-gray-300 p-2">Actions</th>
//   //                 </tr>
//   //             </thead>
//   //             <tbody>
//   //                 {tableData.length > 0 ? (
//   //                 tableData.map((project) => (
//   //                     <tr key={project.id}>
//   //                     <td className="border border-gray-300 p-2">{project.title}</td>
//   //                     <td className="border border-gray-300 p-2">{project.rollno}</td>
//   //                     <td className="border border-gray-300 p-2">{project.s_name}</td>
//   //                     <td className="border border-gray-300 p-2">{project.s_year}</td>
//   //                     <td className="border border-gray-300 p-2">{project.a_month}</td>
//   //                     <td className="border border-gray-300 p-2">
//   //                         <button
//   //                         onClick={() => handleEdit(project)}
//   //                         className="text-blue-500 hover:text-blue-700 mr-2"
//   //                         >
//   //                         <Edit className="inline" /> Edit
//   //                         </button>
//   //                         <button
//   //                         onClick={() => handleDelete(project.id)} // Adjust this to match your project ID field
//   //                         className="text-red-500 hover:text-red-700"
//   //                         >
//   //                         <Trash className="inline" /> Delete
//   //                         </button>
//   //                     </td>
//   //                     </tr>
//   //                 ))
//   //                 ) : (
//   //                 <tr>
//   //                     <td colSpan="7" className="border border-gray-300 p-2 text-center">No projects found.</td>
//   //                 </tr>
//   //                 )}
//   //             </tbody>
//   //             </table>
//   //         </div>
//   //     </div>
//   // );

//   return (
//     <MantineProvider withGlobalStyles withNormalizeCSS>
//       <Container size="2xl" mt="xl">
//         <Paper
//           shadow="xs"
//           p="md"
//           withBorder
//           style={{ borderLeft: "8px solid #2185d0" }}
//         >
//           <Title order={2} mb="sm">
//             Add a PhD Thesis
//           </Title>
//           <form onSubmit={handleSubmit}>
//             <Grid gutter="md">
//               <Grid.Col span={12}>
//                 <TextInput
//                   required
//                   label="Name"
//                   placeholder="Name"
//                   value={inputs.pi}
//                   onChange={(e) => setInputs({ ...inputs, pi: e.target.value })}
//                 />
//               </Grid.Col>
//               <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
//                 <TextInput
//                   required
//                   label="Roll Number"
//                   placeholder="Roll Number"
//                   value={inputs.pi}
//                   onChange={(e) => setInputs({ ...inputs, pi: e.target.value })}
//                 />
//               </Grid.Col>
//               <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
//                 <Select
//                   label="Month"
//                   placeholder="Select Month"
//                   data={[
//                     { value: "January", label: "January" },
//                     { value: "February", label: "February" },
//                     { value: "March", label: "March" },
//                     { value: "April", label: "April" },
//                     { value: "May", label: "May" },
//                     { value: "June", label: "June" },
//                     { value: "July", label: "July" },
//                     { value: "August", label: "August" },
//                     { value: "September", label: "September" },
//                     { value: "October", label: "October" },
//                     { value: "November", label: "November" },
//                     { value: "December", label: "December" },
//                   ]}
//                   value={inputs.status}
//                   onChange={(value) =>
//                     setInputs({ ...inputs, status: value || "" })
//                   }
//                 />
//               </Grid.Col>
//               <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
//                 <Select
//                   label="Year"
//                   placeholder="Select Year"
//                   data={[
//                     { value: "2018", label: "2018" },
//                     { value: "2019", label: "2019" },
//                     { value: "2020", label: "2020" },
//                     { value: "2021", label: "2021" },
//                     { value: "2022", label: "2022" },
//                     { value: "2023", label: "2023" },
//                     { value: "2024", label: "2024" },
//                     { value: "2025", label: "2025" },
//                     { value: "2026", label: "2026" },
//                     { value: "2027", label: "2027" },
//                     { value: "2028", label: "2028" },
//                     { value: "2029", label: "2029" },
//                   ]}
//                   value={inputs.status}
//                   onChange={(value) =>
//                     setInputs({ ...inputs, status: value || "" })
//                   }
//                 />
//               </Grid.Col>
//               <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
//                 <TextInput
//                   required
//                   label="Title"
//                   placeholder="Title"
//                   value={inputs.pi}
//                   onChange={(e) => setInputs({ ...inputs, pi: e.target.value })}
//                 />
//               </Grid.Col>
//               <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
//                 <TextInput
//                   required
//                   label="Supervisor"
//                   placeholder="Supervisor"
//                   value={inputs.pi}
//                   onChange={(e) => setInputs({ ...inputs, pi: e.target.value })}
//                 />
//               </Grid.Col>
//             </Grid>
//             <Button
//               type="submit"
//               mt="md"
//               loading={isLoading}
//               leftIcon={<FloppyDisk size={16} />}
//             >
//               Save
//             </Button>
//           </form>
//         </Paper>

//         <Paper mt="xl" p="md" withBorder>
//           <Table>
//             <thead>
//               <tr>
//                 <th>Title</th>
//                 <th>Roll Number</th>
//                 <th>Name</th>
//                 <th>Supervisor</th>
//                 <th>Month</th>
//                 <th>Year</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {tableData.map((project) => (
//                 <tr key={project.id}>
//                   <td>{project.title}</td>
//                   <td>{project.pi}</td>
//                   <td>{project.co_pi}</td>
//                   <td>{project.funding_agency}</td>
//                   <td>{project.status}</td>
//                   <td>{project.date_submission?.toLocaleDateString()}</td>
//                   <td>{project.start_date?.toLocaleDateString()}</td>
//                   <td>{project.finish_date?.toLocaleDateString()}</td>
//                   <td>{project.financial_outlay}</td>
//                   <td>
//                     <ActionIcon
//                       color="blue"
//                       onClick={() => handleEdit(project)}
//                     >
//                       <PencilSimple size={16} />
//                     </ActionIcon>
//                     <ActionIcon
//                       color="red"
//                       onClick={() => handleDelete(project.id)}
//                     >
//                       <Trash size={16} />
//                     </ActionIcon>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </Paper>
//       </Container>
//     </MantineProvider>
//   );
// }

import { useState, useEffect } from "react";
// import { Save, Edit, Trash } from "lucide-react";
import axios from "axios";

import {
  MantineProvider,
  Container,
  Title,
  Paper,
  Grid,
  TextInput,
  Select,
  Button,
  Table,
  ActionIcon,
  Pagination,
} from "@mantine/core";
// import { DatePickerInput } from "@mantine/dates";
import { FloppyDisk, PencilSimple, Trash } from "@phosphor-icons/react";
import { useSelector } from "react-redux";
import {
  getPhDThesisRoute,
  insertPhDThesisRoute,
  deletePGThesisRoute,
} from "../../../../routes/facultyProfessionalProfileRoutes";
// import { useSelector } from "react-redux";

export default function PhdThesis() {
  const [inputs, setInputs] = useState({
    name: "",
    rollNumber: "",
    month: "",
    year: "",
    title: "",
    supervisor: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [, setError] = useState(null); // For error handling
  const [isEdit, setEdit] = useState(false);
  const [Id, setId] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const rowsPerPage = 10; // Number of rows per page

  const pfNo = useSelector((state) => state.pfNo.value);

  // Fetch projects from the backend
  const fetchProjects = async () => {
    try {
      const response = await axios.get(getPhDThesisRoute, {
        params: { pfNo },
      });
      const projects = response.data;
      // Sort projects by submission date in descending order
      const sortedProjects = projects.sort(
        (a, b) => new Date(b.submission_date) - new Date(a.submission_date),
      );
      setTableData(sortedProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to fetch projects. Please try again later."); // Set error message
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("user_id", pfNo); // Adjust this as needed
      formData.append("s_year", inputs.year);
      formData.append("name", inputs.name);
      formData.append("roll", inputs.rollNumber);
      formData.append("supervisors", inputs.supervisor);
      formData.append("month", inputs.month);
      formData.append("title", inputs.title);

      if (isEdit === false) {
        const res = await axios.post(insertPhDThesisRoute, formData);
        console.log(res.data);
      } else {
        formData.append("phd_id", Id);
        const res = await axios.post(insertPhDThesisRoute, formData);
        console.log(res.data);
        setEdit(false);
        setId(0);
      }

      // Fetch updated project list after submission
      fetchProjects();

      // Reset the input fields
      setInputs({
        name: "",
        rollNumber: "",
        month: "",
        year: "",
        title: "",
        supervisor: "",
      });
    } catch (error) {
      console.log(error);
      setError("Failed to submit data. Please try again."); // Set error message
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (project) => {
    // Populate the inputs with the project data for editing
    setInputs({
      name: project.s_name,
      rollNumber: project.rollno,
      month: project.a_month,
      year: project.s_year,
      title: project.title,
      supervisor: project.supervisors,
    });

    setId(project.id);
    setEdit(true);
  };

  const handleDelete = async (projectId) => {
    console.log(projectId);
    if (window.confirm("Are you sure you want to delete this Thesis?")) {
      try {
        await axios.post(
          deletePGThesisRoute,
          new URLSearchParams({ pk: projectId }),
        ); // Adjust the delete URL as needed
        fetchProjects(); // Refresh the project list after deletion
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  // Calculate the current rows to display based on pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Container size="2xl" mt="xl">
        <Paper
          shadow="xs"
          p="md"
          withBorder
          style={{
            borderLeft: "8px solid #2185d0",
            backgroundColor: "#f9fafb",
          }} // Light background for contrast
        >
          <Title order={2} mb="sm" style={{ color: "#2185d0" }}>
            Add a PhD Thesis
          </Title>
          <form onSubmit={handleSubmit}>
            <Grid
              type="container"
              breakpoints={{
                xs: "100px",
                sm: "200px",
                md: "700px",
                lg: "900px",
                xl: "1000px",
              }}
            >
              <Grid.Col span={12}>
                <TextInput
                  required
                  label="Name"
                  placeholder="Name"
                  value={inputs.name}
                  onChange={(e) =>
                    setInputs({ ...inputs, name: e.target.value })
                  }
                  style={{ padding: "10px" }} // Consistent padding
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <TextInput
                  required
                  label="Roll Number"
                  placeholder="Roll Number"
                  value={inputs.rollNumber}
                  onChange={(e) =>
                    setInputs({ ...inputs, rollNumber: e.target.value })
                  }
                  style={{ padding: "10px" }} // Consistent padding
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <Select
                  label="Month"
                  placeholder="Select Month"
                  data={[
                    { value: "1", label: "1" },
                    { value: "2", label: "2" },
                    { value: "3", label: "3" },
                    { value: "4", label: "4" },
                    { value: "5", label: "5" },
                    { value: "6", label: "6" },
                    { value: "7", label: "7" },
                    { value: "8", label: "8" },
                    { value: "9", label: "9" },
                    { value: "10", label: "10" },
                    { value: "11", label: "11" },
                    { value: "12", label: "12" },
                  ]}
                  value={inputs.month}
                  onChange={(value) =>
                    setInputs({ ...inputs, month: value || "" })
                  }
                  required
                  style={{ padding: "10px" }} // Consistent padding
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <Select
                  label="Year"
                  placeholder="Select Year"
                  data={[
                    { value: "2018", label: "2018" },
                    { value: "2019", label: "2019" },
                    { value: "2020", label: "2020" },
                    { value: "2021", label: "2021" },
                    { value: "2022", label: "2022" },
                    { value: "2023", label: "2023" },
                    { value: "2024", label: "2024" },
                    { value: "2025", label: "2025" },
                    { value: "2026", label: "2026" },
                    { value: "2027", label: "2027" },
                    { value: "2028", label: "2028" },
                    { value: "2029", label: "2029" },
                  ]}
                  value={inputs.year}
                  onChange={(value) =>
                    setInputs({ ...inputs, year: value || "" })
                  }
                  required
                  style={{ padding: "10px" }} // Consistent padding
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <TextInput
                  required
                  label="Title"
                  placeholder="Title"
                  value={inputs.title}
                  onChange={(e) =>
                    setInputs({ ...inputs, title: e.target.value })
                  }
                  style={{ padding: "10px" }} // Consistent padding
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <TextInput
                  required
                  label="Supervisor"
                  placeholder="Supervisor"
                  value={inputs.supervisor}
                  onChange={(e) =>
                    setInputs({ ...inputs, supervisor: e.target.value })
                  }
                  style={{ padding: "10px" }} // Consistent padding
                />
              </Grid.Col>
              <Grid.Col
                span={12}
                p="md"
                style={{ display: "flex", justifyContent: "flex-start" }}
              >
                <Button
                  type="submit"
                  mt="md"
                  loading={isLoading}
                  leftIcon={<FloppyDisk size={16} />}
                  style={{ backgroundColor: "#2185d0", color: "#fff" }} // Custom button styling
                >
                  Save
                </Button>
              </Grid.Col>
            </Grid>
          </form>
        </Paper>

        <Paper
          mt="xl"
          p="lg"
          withBorder
          shadow="sm"
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Title order={3} mb="lg" style={{ color: "#2185d0" }}>
            Report:
          </Title>
          <Table
            striped
            highlightOnHover
            withBorder
            style={{ minWidth: "100%", borderCollapse: "collapse" }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                {[
                  "Title",
                  "Roll Number",
                  "Name",
                  "Year",
                  "Month",
                  "Actions",
                ].map((header, index) => (
                  <th
                    key={index}
                    style={{
                      textAlign: "center",
                      padding: "12px",
                      color: "#495057",
                      fontWeight: "600",
                      border: "1px solid #dee2e6",
                      backgroundColor: "#f1f3f5",
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentRows.length > 0 ? (
                currentRows.map((project) => (
                  <tr key={project.id} style={{ backgroundColor: "#fff" }}>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      {project.title}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      {project.rollno}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      {project.s_name}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      {project.s_year}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      {project.a_month}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        border: "1px solid #dee2e6",
                        whiteSpace: "nowrap", // Prevent text wrapping
                        width: "100px", // Ensure sufficient space for icons
                      }}
                    >
                      <ActionIcon
                        color="blue"
                        onClick={() => handleEdit(project)}
                        variant="light"
                        style={{ marginRight: "8px" }}
                      >
                        <PencilSimple size={16} />
                      </ActionIcon>
                      <ActionIcon
                        color="red"
                        onClick={() => handleDelete(project.id)}
                        variant="light"
                      >
                        <Trash size={16} />
                      </ActionIcon>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      textAlign: "center",
                      padding: "12px",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    No theses found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Pagination Component */}
          <Pagination
            total={Math.ceil(tableData.length / rowsPerPage)} // Total pages
            page={currentPage} // Current page
            onChange={setCurrentPage} // Handle page change
            mt="lg" // Add margin-top
            position="center" // Center the pagination
          />
        </Paper>
      </Container>
    </MantineProvider>
  );
}
