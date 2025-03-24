import {
  Flex,
  Stack,
  Button,
  ScrollArea,
  Divider,
  Tooltip,
} from "@mantine/core";
import {
  House as HomeIcon,
  Books as AcademicsIcon,
  CalendarBlank as CurriculumIcon,
  ForkKnife as MessIcon,
  Bed as GuestIcon,
  Hospital as HealthIcon,
  FileText as FileTrackingIcon,
  GraduationCap as ScholarshipIcon,
  Mailbox as ComplaintIcon,
  LetterCircleP as PlacementIcon,
  SquaresFour as DepartmentIcon,
  Flask as ResearchIcon,
  Storefront as StoreIcon,
  UsersThree as HumanResourceIcon,
  Exam as ExamIcon,
  Barbell as GymkhanaIcon,
  Wrench as IWDIcon,
  City as HostelIcon,
  Certificate as OtherAcademicIcon,
  Question as HelpIcon,
  User as ProfileIcon,
  Gear as SettingsIcon,
  CaretRight,
  CaretLeft,
} from "@phosphor-icons/react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import IIITLOGO from "../assets/IIITJ_logo.webp";
import { setCurrentModule } from "../redux/moduleslice";

function SidebarContent({ isCollapsed, toggleSidebar }) {
  const role = useSelector((state) => state.user.role);

  const deployedModules = [
    "home",
    "fts",
    "complaint_management",
    "mess_management",
    "visitor_hostel",
    "department",
    "gymkhana",
    "iwd",
    "phc",
    "spacs",
    "purchase_and_store",
  ];

  const Modules = [
    {
      label: "Home",
      id: "home",
      icon: <HomeIcon size={18} />,
      url: "/dashboard",
    },
    // { label: "Course Management", id:"course_management", icon: <OtherIcon size={18} />, url: "/" },
    {
      label: "Academics",
      id: "course_registration",
      icon: <AcademicsIcon size={18} />,
      url: "/academics",
    },
    {
      label: "Program & Curriculum",
      id: "program_and_curriculum",
      icon: <CurriculumIcon size={18} />,
      url: "/",
    },
    {
      label: "Mess Management",
      id: "mess_management",
      icon: <MessIcon size={18} />,
      url: "/mess",
    },
    {
      label: "Visitor's Hostel",
      id: "visitor_hostel",
      icon: <GuestIcon size={18} />,
      url: "/visitors_hostel",
    },
    {
      label: "HealthCare Center",
      id: "phc",
      icon: <HealthIcon size={18} />,
      url: "/healthcenter",
    },
    {
      label: "File Tracking",
      id: "fts",
      icon: <FileTrackingIcon size={18} />,
      url: "/filetracking",
    },
    {
      label: "Scholarship Portal",
      id: "spacs",
      icon: <ScholarshipIcon size={18} />,
      url: "/scholarship",
    },
    {
      label: "Complaint System",
      id: "complaint_management",
      icon: <ComplaintIcon size={18} />,
      url: "/complaints",
    },
    {
      label: "Placement Cell",
      id: "placement_cell",
      icon: <PlacementIcon size={18} />,
      url: "/",
    },
    {
      label: "Department Portal",
      id: "department",
      icon: <DepartmentIcon size={18} />,
      url: "/department",
    },
    {
      label: "Research",
      id: "rspc",
      icon: <ResearchIcon size={18} />,
      url: "/",
    },
    {
      label: "Purchase and Store",
      id: "purchase_and_store",
      icon: <StoreIcon size={18} />,
      url: "/purchase",
    },
    {
      label: "Human Resource",
      id: "hr",
      icon: <HumanResourceIcon size={18} />,
      url: "/",
    },
    {
      label: "Examination",
      id: "examinations",
      icon: <ExamIcon size={18} />,
      url: "/",
    },
    {
      label: "Gymkhana",
      id: "gymkhana",
      icon: <GymkhanaIcon size={18} />,
      url: "/GymKhana",
    },
    {
      label: "Institute Work Departments",
      id: "iwd",
      icon: <IWDIcon size={18} />,
      url: "/iwd",
    },
    {
      label: "Hostel Management",
      id: "hostel_management",
      icon: <HostelIcon size={18} />,
      url: "/",
    },
    {
      label: "Other Academic Procedure",
      id: "other_academics",
      icon: <OtherAcademicIcon size={18} />,
      url: "/",
    },
  ];

  const otherItems = [
    {
      label: "Profile",
      id: "profile",
      icon: <ProfileIcon size={18} />,
      url: role === "student" ? "/profile" : "/facultyprofessionalprofile",
    },
    { label: "Settings", icon: <SettingsIcon size={18} /> },
    { label: "Help", icon: <HelpIcon size={18} /> },
  ];

  const dispatch = useDispatch();
  const [hover, setHover] = useState(null);
  const [selected, setSelected] = useState(null);
  const [filteredModules, setFilteredModules] = useState([]);
  const accessibleModules = useSelector(
    (state) => state.user.currentAccessibleModules,
  );
  const navigate = useNavigate();

  useEffect(() => {
    const filterModules = Modules.filter(
      (module) => accessibleModules[module.id] || module.id === "home",
    );

    setFilteredModules(filterModules);
  }, [accessibleModules]);

  const handleModuleClick = (item) => {
    let path = item.url;

    // HealthCare Center icon clicked navigation
    if (item.id === "phc") {
      if (role === "Compounder") {
        path = "/healthcenter/compounder/patient-log";
      } else if (role === "student" || role === "Professor") {
        path = "/healthcenter/student/history";
      }
    }

    setSelected(item.label);
    toggleSidebar();
    dispatch(setCurrentModule(item.label));
    navigate(path);
  };

  return (
    <>
      <Flex
        gap={32}
        align="center"
        h={64}
        justify="center"
        w={{ xxs: "300px" }}
      >
        {!isCollapsed && (
          <img src={IIITLOGO} alt="IIIT Logo" style={{ maxWidth: "150px" }} />
        )}

        <Flex
          onClick={toggleSidebar}
          onMouseEnter={() => setHover("toggle")}
          onMouseLeave={() => setHover(null)}
          bg={hover === "toggle" ? "#e9ecef" : ""}
          style={{ borderRadius: "6px" }}
          justify="center"
          p="4px"
        >
          {isCollapsed ? <CaretRight size={24} /> : <CaretLeft size={24} />}
        </Flex>
      </Flex>

      <Stack
        h="90%"
        justify="space-around"
        onMouseEnter={() => toggleSidebar()}
        onMouseLeave={() => !isCollapsed && toggleSidebar()}
      >
        <ScrollArea mah={600} type={!isCollapsed && "always"} scrollbars="y">
          <Stack spacing="xs" mt="16px" align="flex-start" gap="4px">
            {filteredModules.map((item) => (
              <Tooltip
                key={item.label}
                label={isCollapsed && item.label}
                position="right"
                offset={-16}
                withArrow={isCollapsed && true}
                p={!isCollapsed && 0}
              >
                <Button
                  key={item.label}
                  disabled={!deployedModules.includes(item.id)}
                  variant={
                    hover === item.label
                      ? "subtle"
                      : selected === item.label
                        ? "outline"
                        : "transparent"
                  }
                  leftSection={item.icon}
                  style={{ display: "flex", justifyContent: "flex-start" }}
                  w="90%"
                  color={
                    hover === item.label || selected === item.label
                      ? "blue"
                      : "#535455"
                  }
                  onMouseEnter={() => setHover(item.label)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => handleModuleClick(item)}
                >
                  {!isCollapsed && item.label}
                </Button>
              </Tooltip>
            ))}
          </Stack>
        </ScrollArea>
        <Divider
          my="sm"
          label={!isCollapsed && "Miscellaneous"}
          labelPosition="center"
        />
        <Stack spacing="xs" mt="2px" align="flex-start" gap={4}>
          {otherItems.map((item) => (
            <Button
              key={item.label}
              variant="transparent"
              leftSection={item.icon}
              style={{ justifyContent: "flex-start" }}
              color={
                hover === item.label || selected === item.label
                  ? "blue"
                  : "#535455"
              }
              onMouseEnter={() => setHover(item.label)}
              onMouseLeave={() => setHover(null)}
              onClick={() => handleModuleClick(item)}
            >
              {!isCollapsed && item.label}
            </Button>
          ))}
        </Stack>
      </Stack>
    </>
  );
}

SidebarContent.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default SidebarContent;
