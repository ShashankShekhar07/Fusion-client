// import React, { useState, useEffect } from "react";
// import {
//   MantineProvider,
//   Container,
//   Paper,
//   Title,
//   Button,
//   TextInput,
//   Textarea,
//   Grid,
//   Loader,
// } from "@mantine/core";
// import {
//   FloppyDisk,
//   PencilSimple,
//   Phone,
//   EnvelopeSimple,
//   LinkedinLogo,
//   GithubLogo,
// } from "@phosphor-icons/react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import {
//   getPersonalInfoRoute,
//   updatePersonalInfoRoute,
// } from "../../../../routes/facultyProfessionalProfileRoutes";
// import { Navigate, useNavigate } from "react-router-dom";
// // import { useSelector } from "react-redux";
// // import { useSelector } from "react-redux";

// export default function AboutMePage() {
//   // const username = useSelector((state) => state.user.roll_no);

//   // const [PF, setPF] = useState(0);

//   // const fetchPF = async () => {
//   //   try {
//   //     const formData = new FormData();
//   //     formData.append("username", username);

//   //     const response = await axios.post(
//   //       getPFRoute,
//   //       formData
//   //     );

//   //     setPF(response.data.pf)

//   //   } catch (error) {
//   //     console.error("Error fetching data:", error);
//   //   }
//   // };

//   // useEffect(() => {
//   //   fetchPF();
//   // }, []);

//   const [inputs, setInputs] = useState({
//     aboutMe: "CSE Prof.",
//     dateOfJoining: "2012-12-12",
//     pensionFund: "#PF",
//     education: "PhD",
//     interestAreas: "Teaching",
//     contact: "+919876543210",
//     email: "atul@iiitdmj.ac.in",
//     linkedIn: "linkedin",
//     github: "github",
//   });

//   const [isLoading, setIsLoading] = useState(false);
//   const [isEdit, setIsEdit] = useState(false);
//   const pfNo = useSelector((state) => state.pfNo.value);

//   const navigate = useNavigate();

//   // Fetch user data from the backend
//   const fetchUserData = async () => {
//     try {
//       const response = await axios.get(getPersonalInfoRoute, {
//         params: { pfNo },
//       });
//       // console.log(response);
//       if (response.data) {
//         setInputs({
//           aboutMe: response.data[0].about || "",
//           dateOfJoining: response.data[0].doj || "",
//           pensionFund: "#PF", // Default value as this field isn't from the backend
//           education: response.data[0].education || "",
//           interestAreas: response.data[0].interest || "",
//           contact: response.data[0].contact || "",
//           email: "atul@iiitdmj.ac.in", // Static as no backend support for this
//           linkedIn: response.data[0].linkedin || "",
//           github: response.data[0].github || "",
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setIsLoading(true);

//       // Prepare the data to send
//       const data = {
//         user_id: 5318, // Static or fetched from context
//         aboutMe: inputs.aboutMe,
//         dateOfJoining: inputs.dateOfJoining,
//         education: inputs.education,
//         interestAreas: inputs.interestAreas,
//         contact: inputs.contact,
//         github: inputs.github,
//         linkedIn: inputs.linkedIn,
//       };

//       const response = await axios.post(updatePersonalInfoRoute, data);

//       if (response.status === 200) {
//         console.log("Details updated successfully.");
//         fetchUserData(); // Fetch updated data
//       }
//     } catch (error) {
//       console.error("Error updating data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle editing an existing entry
//   // const handleEdit = (data) => {
//   //   setInputs({
//   //     aboutMe: data.aboutMe,
//   //     dateOfJoining: data.dateOfJoining,
//   //     pensionFund: data.pensionFund,
//   //     education: data.education,
//   //     interestAreas: data.interestAreas,
//   //     contact: data.contact,
//   //     email: data.email,
//   //     linkedIn: data.linkedIn,
//   //     github: data.github,
//   //   });

//   //   setId(data.id);
//   //   setIsEdit(true);
//   // };

//   // Handle input change
//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     setInputs((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   return (
//     <MantineProvider withGlobalStyles withNormalizeCSS>
//       <Container size="md" mt="xl">
//         <Paper
//           shadow="xs"
//           p="md"
//           withBorder
//           style={{ borderLeft: "8px solid #2185d0", marginBottom: "1rem" }}
//         >
//           <Grid align="center">
//             <Grid.Col span={10}>
//               <Title order={2}>Profile</Title>
//             </Grid.Col>
//             <Grid.Col span={1}>
//               <Button
//                 variant="filled"
//                 color={isEdit ? "green" : "blue"}
//                 compact
//                 onClick={() => setIsEdit(!isEdit)}
//               >
//                 {isEdit ? (
//                   <FloppyDisk size={16} style={{ marginRight: "10px" }} />
//                 ) : (
//                   <PencilSimple size={16} style={{ marginRight: "10px" }} />
//                 )}
//                 {isEdit ? "Disable Edit" : "Enable Edit"}
//               </Button>
//               <Button
//                 variant="filled"
//                 color={isEdit ? "green" : "blue"}
//                 compact
//                 onClick={() => navigate("personal-profile")}
//               >
//                 Personal Profile
//               </Button>
//               <Button
//                 variant="filled"
//                 color={isEdit ? "green" : "blue"}
//                 compact
//                 onClick={() => navigate("administrative-profile")}
//               >
//                 Administrative Profile
//               </Button>
//             </Grid.Col>
//           </Grid>

//           {/* About Me Section */}
//           <Textarea
//             label="About Me"
//             name="aboutMe"
//             value={inputs.aboutMe}
//             onChange={handleInputChange}
//             placeholder="Enter your 'About Me' content here"
//             minRows={4}
//             mt="md"
//             disabled={!isEdit}
//           />

//           {/* Details Section */}
//           <Grid mt="md" gutter="md">
//             <Grid.Col span={6}>
//               <TextInput
//                 label="Date Of Joining"
//                 name="dateOfJoining"
//                 value={inputs.dateOfJoining}
//                 onChange={handleInputChange}
//                 placeholder="Select Date"
//                 type="date"
//                 disabled={!isEdit}
//               />
//             </Grid.Col>
//             <Grid.Col span={6}>
//               <TextInput
//                 label="Pension Fund #"
//                 name="pensionFund"
//                 value={inputs.pensionFund}
//                 onChange={handleInputChange}
//                 placeholder="Enter Pension Fund #"
//                 disabled={!isEdit}
//               />
//             </Grid.Col>
//             <Grid.Col span={6}>
//               <TextInput
//                 label="Education"
//                 name="education"
//                 value={inputs.education}
//                 onChange={handleInputChange}
//                 placeholder="Enter Education details"
//                 disabled={!isEdit}
//               />
//             </Grid.Col>
//             <Grid.Col span={6}>
//               <TextInput
//                 label="Interest Areas"
//                 name="interestAreas"
//                 value={inputs.interestAreas}
//                 onChange={handleInputChange}
//                 placeholder="Enter your interest areas"
//                 disabled={!isEdit}
//               />
//             </Grid.Col>
//           </Grid>

//           {/* Contact Details Section */}
//           <Grid mt="md" gutter="md">
//             <Grid.Col span={6}>
//               <TextInput
//                 label="Contact"
//                 name="contact"
//                 value={inputs.contact}
//                 onChange={handleInputChange}
//                 placeholder="Enter your contact number"
//                 disabled={!isEdit}
//                 icon={<Phone size={16} />}
//               />
//             </Grid.Col>
//             <Grid.Col span={6}>
//               <TextInput
//                 label="Email"
//                 name="email"
//                 value={inputs.email}
//                 onChange={handleInputChange}
//                 placeholder="Enter your email"
//                 disabled={!isEdit}
//                 icon={<EnvelopeSimple size={16} />}
//               />
//             </Grid.Col>
//             <Grid.Col span={6}>
//               <TextInput
//                 label="LinkedIn"
//                 name="linkedIn"
//                 value={inputs.linkedIn}
//                 onChange={handleInputChange}
//                 placeholder="Enter your LinkedIn profile"
//                 disabled={!isEdit}
//                 icon={<LinkedinLogo size={16} />}
//               />
//             </Grid.Col>
//             <Grid.Col span={6}>
//               <TextInput
//                 label="Github"
//                 name="github"
//                 value={inputs.github}
//                 onChange={handleInputChange}
//                 placeholder="Enter your GitHub profile"
//                 disabled={!isEdit}
//                 icon={<GithubLogo size={16} />}
//               />
//             </Grid.Col>
//           </Grid>

//           {/* Submit Button */}
//           <Button
//             variant="filled"
//             color="blue"
//             onClick={handleSubmit}
//             disabled={isLoading}
//             mt="md"
//           >
//             {isLoading ? <Loader size="sm" /> : "Save Changes"}
//           </Button>
//         </Paper>
//       </Container>
//     </MantineProvider>
//   );
// }

import React, { useState, useEffect } from "react";
import {
  MantineProvider,
  Container,
  Paper,
  Title,
  Button,
  TextInput,
  Textarea,
  Grid,
  Loader,
} from "@mantine/core";
import {
  FloppyDisk,
  PencilSimple,
  Phone,
  EnvelopeSimple,
  LinkedinLogo,
  GithubLogo,
} from "@phosphor-icons/react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getPersonalInfoRoute,
  updatePersonalInfoRoute,
} from "../../../../routes/facultyProfessionalProfileRoutes";

export default function AboutMePage() {
  const [inputs, setInputs] = useState({
    aboutMe: "CSE Prof.",
    dateOfJoining: "2012-12-12",
    pensionFund: "#PF",
    education: "PhD",
    interestAreas: "Teaching",
    contact: "+919876543210",
    email: "atul@iiitdmj.ac.in",
    linkedIn: "linkedin",
    github: "github",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const pfNo = useSelector((state) => state.pfNo.value);
  const navigate = useNavigate();

  // Fetch user data from the backend
  const fetchUserData = async () => {
    try {
      const response = await axios.get(getPersonalInfoRoute, {
        params: { pfNo },
      });

      if (response.data) {
        setInputs({
          aboutMe: response.data[0].about || "",
          dateOfJoining: response.data[0].doj || "",
          pensionFund: "#PF",
          education: response.data[0].education || "",
          interestAreas: response.data[0].interest || "",
          contact: response.data[0].contact || "",
          email: "atul@iiitdmj.ac.in",
          linkedIn: response.data[0].linkedin || "",
          github: response.data[0].github || "",
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const data = {
        user_id: pfNo, // Static or fetched from context
        aboutMe: inputs.aboutMe,
        dateOfJoining: inputs.dateOfJoining,
        education: inputs.education,
        interestAreas: inputs.interestAreas,
        contact: inputs.contact,
        github: inputs.github,
        linkedIn: inputs.linkedIn,
      };

      const response = await axios.post(updatePersonalInfoRoute, data);

      if (response.status === 200) {
        console.log("Details updated successfully.");
        fetchUserData();
      }
    } catch (error) {
      console.error("Error updating data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputs((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Container size="md" mt="xl">
        <Paper
          shadow="xs"
          p="md"
          withBorder
          style={{ borderLeft: "8px solid #2185d0", marginBottom: "1rem" }}
        >
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
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <Title order={2}>Profile</Title>
            </Grid.Col>
            <Grid.Col
              span={{ base: 6, md: 12, lg: 12 }}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
              }}
            >
              <Button
                variant="outline"
                color={isEdit ? "green" : "blue"}
                leftIcon={
                  isEdit ? <FloppyDisk size={16} /> : <PencilSimple size={16} />
                }
                onClick={() => setIsEdit(!isEdit)}
              >
                {isEdit ? "Save & Disable Edit" : "Enable Edit"}
              </Button>
            </Grid.Col>
          </Grid>

          {/* Navigation Buttons */}
          <Grid mt="md" gutter="md" justify="center">
            <Grid.Col span="auto">
              <Button
                fullWidth
                variant="filled"
                color="blue"
                onClick={() => navigate("personal-profile")}
              >
                Professional Achievements
              </Button>
            </Grid.Col>
            <Grid.Col span="auto">
              <Button
                fullWidth
                variant="filled"
                color="gray"
                onClick={() => navigate("administrative-profile")}
              >
                Professional Experience
              </Button>
            </Grid.Col>
          </Grid>

          {/* About Me Section */}
          <Textarea
            label="About Me"
            name="aboutMe"
            value={inputs.aboutMe}
            onChange={handleInputChange}
            placeholder="Enter your 'About Me' content here"
            minRows={4}
            mt="md"
            disabled={!isEdit}
          />

          {/* Details Section */}
          <Grid mt="md" gutter="md">
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <TextInput
                label="Date Of Joining"
                name="dateOfJoining"
                value={inputs.dateOfJoining}
                onChange={handleInputChange}
                type="date"
                disabled={!isEdit}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <TextInput
                label="Pension Fund #"
                name="pensionFund"
                value={inputs.pensionFund}
                onChange={handleInputChange}
                disabled={!isEdit}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <TextInput
                label="Education"
                name="education"
                value={inputs.education}
                onChange={handleInputChange}
                disabled={!isEdit}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <TextInput
                label="Interest Areas"
                name="interestAreas"
                value={inputs.interestAreas}
                onChange={handleInputChange}
                disabled={!isEdit}
              />
            </Grid.Col>
          </Grid>

          {/* Contact Details Section */}
          <Grid mt="md" gutter="md">
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <TextInput
                label="Contact"
                name="contact"
                value={inputs.contact}
                onChange={handleInputChange}
                disabled={!isEdit}
                icon={<Phone size={16} />}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <TextInput
                label="Email"
                name="email"
                value={inputs.email}
                onChange={handleInputChange}
                disabled={!isEdit}
                icon={<EnvelopeSimple size={16} />}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <TextInput
                label="LinkedIn"
                name="linkedIn"
                value={inputs.linkedIn}
                onChange={handleInputChange}
                disabled={!isEdit}
                icon={<LinkedinLogo size={16} />}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <TextInput
                label="Github"
                name="github"
                value={inputs.github}
                onChange={handleInputChange}
                disabled={!isEdit}
                icon={<GithubLogo size={16} />}
              />
            </Grid.Col>
          </Grid>

          {/* Save Changes Button */}
          <Button
            fullWidth
            mt="md"
            variant="filled"
            color="blue"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? <Loader size="sm" /> : "Save Changes"}
          </Button>
        </Paper>
      </Container>
    </MantineProvider>
  );
}
