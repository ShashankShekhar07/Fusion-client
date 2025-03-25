// import { Text } from "@mantine/core";
// import ProfileButtons from "./components/ProfileButtons";
import { Route, Routes } from "react-router-dom";
import App from "./App";
import ProfileButtons from "./components/ProfileButtons";
import AdministrativeProfileButtons from "./components/AdministrativeProfileButtons";

function FacultyProfessionalProfile() {
  return (
    <>
      {/* <CustomBreadcrumbs /> */}
      {/* <Text>facultyProfessionalProfile Page</Text> */}
      <Routes>
        <Route path="personal-profile" element={<ProfileButtons />} />
        <Route
          path="administrative-profile"
          element={<AdministrativeProfileButtons />}
        />
      </Routes>
      <App />
    </>
  );
}

export default FacultyProfessionalProfile;
