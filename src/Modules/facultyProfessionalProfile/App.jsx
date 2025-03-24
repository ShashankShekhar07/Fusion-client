// import { useState } from "react";
import { useLocation } from "react-router-dom";
// import AdministrativeProfileButtons from "./components/AdministrativeProfileButtons";
// import ProfileButtons from "./components/ProfileButtons";
import AboutMePage from "./Profile/AboutMe/AboutMe";

export default function App() {
  // const [currentModule, setCurrentModule] = useState("Professional Profile");
  // const [currentSubSection, setCurrentSubSection] = useState("Projects");
  // const [categories, setCategories] = useState([
  //   "Research Projects",
  //   "Consultancy Projects",
  //   "Patents",
  //   "Technology Transfer",
  // ]);

  const location = useLocation();

  // Hide AboutMePage when on /facultyprofessionalprofile/personal-profile
  const shouldShowAboutMe =
    location.pathname !== "/facultyprofessionalprofile/personal-profile" &&
    location.pathname !== "/facultyprofessionalprofile/administrative-profile";

  return (
    <div className="flex h-screen overflow-hidden">
      {/* <Sidebar /> */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <Navbar module={currentModule} subSection={currentSubSection} />
        <BreadCrumbs categories={categories} /> */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          {/* <ProfileButtons /> */}
          {shouldShowAboutMe && <AboutMePage />}
          {/* <AdministrativeProfileButtons /> */}
        </main>
      </div>
    </div>
  );
}

// import React, { useState } from 'react';
// import Sidebar from './components/Sidebar';
// import Navbar from './components/Navbar';
// import ConsultancyProjects from './Profile/Projects/ConsultancyProjects';
// import Patents from './Profile/Projects/Patents';

// const AppLayout = () => {

//   return (
//     <div className="">
//         <ConsultancyProjects /> <br />
//         <Patents />
//     </div>
//   );
// };

// export default AppLayout;
