import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Flex, Tabs, Text } from "@mantine/core";
import { CaretCircleLeft, CaretCircleRight } from "@phosphor-icons/react";
// import axios from "axios";
import ProjectsMaster from "../Profile/Projects/ProjectMaster";
import ThesisSupervisionMaster from "../Profile/ThesisSupervision/ThesisSupervisionMaster";
import EventMaster from "../Profile/EventsOrganised/EventMaster";
import VisitsMaster from "../Profile/Visits/VisitsMaster";
import ConferenceMaster from "../Profile/Conference/ConferenceMaster";
import PublicationMaster from "../Profile/Publications/PublicationsMaster";
import OtherMaster from "../Profile/Others/OtherMaster";
import MyProfileMaster from "../Profile/MyProfile/MyProfileMaster";
import classes from "../../Dashboard/Dashboard.module.css";
// import AboutMePage from "../Profile/AboutMe/AboutMe";
import CustomBreadcrumbs from "../../../components/Breadcrumbs";
// import AdministrativePosition from "../Profile/AdministrativePosition/AdministrativePosition";
// import Qualifications from "../Profile/Qualifications/Qualifications";
// import Honors from "../Profile/Honors/Honors";
// import ProfessionalExperience from "../Profile/ProfessionalExperience/ProfessionalExperience";
import ExpertLecturesForm from "../Profile/Others/ExpertLectures";

function ProfileButtons() {
  const [activeTab, setActiveTab] = useState("0");
  const tabsListRef = useRef(null);
  const [breadCrumbItems, setBreadCrumbItems] = useState([]);
  const userRole = useSelector((state) => state.user.role);

  // Define tab items based on user role
  const getTabItems = () => {
    // if (userRole === "rspc_admin") {
    //   return [
    //     {
    //       title: "My Profile",
    //       component: (
    //         <MyProfileMaster
    //           breadCrumbItems={breadCrumbItems}
    //           setBreadCrumbItems={setBreadCrumbItems}
    //         />
    //       ),
    //     },
    //   ];
    // }

    return [
      {
        title: "Publications",
        component: (
          <PublicationMaster
            breadCrumbItems={breadCrumbItems}
            setBreadCrumbItems={setBreadCrumbItems}
          />
        ),
      },
      {
        title: "Projects",
        component: (
          <ProjectsMaster
            breadCrumbItems={breadCrumbItems}
            setBreadCrumbItems={setBreadCrumbItems}
          />
        ),
      },
      {
        title: "Thesis Supervision",
        component: (
          <ThesisSupervisionMaster
            breadCrumbItems={breadCrumbItems}
            setBreadCrumbItems={setBreadCrumbItems}
          />
        ),
      },
      {
        title: "Events Organised",
        component: (
          <EventMaster
            breadCrumbItems={breadCrumbItems}
            setBreadCrumbItems={setBreadCrumbItems}
          />
        ),
      },
      {
        title: "Visits",
        component: (
          <VisitsMaster
            breadCrumbItems={breadCrumbItems}
            setBreadCrumbItems={setBreadCrumbItems}
          />
        ),
      },
      {
        title: "Events Attended",
        component: (
          <ConferenceMaster
            breadCrumbItems={breadCrumbItems}
            setBreadCrumbItems={setBreadCrumbItems}
          />
        ),
      },
      {
        title: "Others",
        component: (
          <OtherMaster
            breadCrumbItems={breadCrumbItems}
            setBreadCrumbItems={setBreadCrumbItems}
          />
        ),
      },
      // {
      //   title: "Honors",
      //   component: (
      //     <Honors
      //       breadCrumbItems={breadCrumbItems}
      //       setBreadCrumbItems={setBreadCrumbItems}
      //     />
      //   ),
      // },
      {
        title: "Expert Lectures",
        component: (
          <ExpertLecturesForm
            breadCrumbItems={breadCrumbItems}
            setBreadCrumbItems={setBreadCrumbItems}
          />
        ),
      },
      {
        title: "My Profile",
        component: (
          <MyProfileMaster
            breadCrumbItems={breadCrumbItems}
            setBreadCrumbItems={setBreadCrumbItems}
          />
        ),
      },

      // {
      //   title: "Administrative Position",
      //   component: (
      //     <AdministrativePosition
      //       breadCrumbItems={breadCrumbItems}
      //       setBreadCrumbItems={setBreadCrumbItems}
      //     />
      //   ),
      // },
      // {
      //   title: "Qualifications",
      //   component: (
      //     <Qualifications
      //       breadCrumbItems={breadCrumbItems}
      //       setBreadCrumbItems={setBreadCrumbItems}
      //     />
      //   ),
      // },
      // {
      //   title: "Honors",
      //   component: (
      //     <Honors
      //       breadCrumbItems={breadCrumbItems}
      //       setBreadCrumbItems={setBreadCrumbItems}
      //     />
      //   ),
      // },
      // {
      //   title: "Professional Experience",
      //   component: (
      //     <ProfessionalExperience
      //       breadCrumbItems={breadCrumbItems}
      //       setBreadCrumbItems={setBreadCrumbItems}
      //     />
      //   ),
      // },
    ];
  };

  const tabItems = getTabItems();

  // Handle tab change (previous/next)
  const handleTabChange = (direction) => {
    const newIndex =
      direction === "next"
        ? Math.min(parseInt(activeTab, 10) + 1, tabItems.length - 1)
        : Math.max(parseInt(activeTab, 10) - 1, 0);
    setActiveTab(String(newIndex));
    tabsListRef.current.scrollBy({
      left: direction === "next" ? 50 : -50,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const currentTab = tabItems[parseInt(activeTab, 10)];
    const breadcrumbs = [
      { title: "Home", href: "/dashboard" },
      { title: "FPS", href: "/facultyprofessionalprofile" },
      { title: currentTab.title, href: "#" },
    ].map((item, index) => (
      <Text key={index} component="a" href={item.href} size="16px" fw={600}>
        {item.title}
      </Text>
    ));

    setBreadCrumbItems(breadcrumbs);
  }, [activeTab]);

  // Function to handle report generation and file download
  // const handleGenerateReport = async () => {
  //   try {
  //     const formData = new FormData();
  //     formData.append("username", "atul");
  //     const response = await axios.post(
  //       "http://127.0.0.1:8000/eis/api/report/",
  //       formData,
  //       {
  //         responseType: "blob",
  //       },
  //     );
  //     const blob = new Blob([response.data], { type: "application/pdf" });
  //     const link = document.createElement("a");
  //     link.href = URL.createObjectURL(blob);
  //     link.download = "report.pdf";
  //     link.click();
  //   } catch (error) {
  //     console.error(
  //       "Error downloading CV:",
  //       error.response ? error.response.data : error.message,
  //     );
  //   }
  // };

  return userRole === "Professor" || userRole === "Assistant Professor" ? (
    <>
      <CustomBreadcrumbs breadCrumbs={breadCrumbItems} />
      <Flex
        justify="flex-start"
        align="center"
        gap={{ base: "0.5rem", md: "1rem" }}
        mt={{ base: "1rem", md: "1.5rem" }}
        ml={{ md: "lg" }}
      >
        {/* Only show navigation buttons if there's more than one tab */}
        {tabItems.length > 1 && (
          <Button
            onClick={() => handleTabChange("prev")}
            variant="default"
            p={0}
            style={{ border: "none" }}
          >
            <CaretCircleLeft
              className={classes.fusionCaretCircleIcon}
              weight="light"
            />
          </Button>
        )}

        {/* Tabs Section */}
        <div className={classes.fusionTabsContainer} ref={tabsListRef}>
          <Tabs value={activeTab} onTabChange={setActiveTab}>
            <Tabs.List style={{ display: "flex", flexWrap: "nowrap" }}>
              {tabItems.map((item, index) => (
                <Tabs.Tab
                  value={String(index)}
                  key={index}
                  onClick={() => setActiveTab(String(index))}
                  className={
                    activeTab === String(index)
                      ? classes.fusionActiveRecentTab
                      : ""
                  }
                >
                  <Text>{item.title}</Text>
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>
        </div>

        {/* Only show navigation buttons if there's more than one tab */}
        {tabItems.length > 1 && (
          <Button
            onClick={() => handleTabChange("next")}
            variant="default"
            p={0}
            style={{ border: "none" }}
          >
            <CaretCircleRight
              className={classes.fusionCaretCircleIcon}
              weight="light"
            />
          </Button>
        )}

        {/* Only show Generate Report button for Professor and Assistant Professor */}
        {/* {(userRole === "Professor" || userRole === "Assistant Professor") && (
          <Button
            onClick={handleGenerateReport}
            variant="filled"
            color="blue"
            style={{ marginLeft: "auto", marginRight: "auto" }}
          >
            Generate Report
          </Button>
        )} */}
      </Flex>

      {/* Display the active tab content */}
      {tabItems[parseInt(activeTab, 10)]?.component}
    </>
  ) : null;
}

export default ProfileButtons;
