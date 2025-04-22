import { lazy, Suspense, useRef, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Button, Flex, Loader, Tabs, Text } from "@mantine/core";
import { CaretCircleLeft, CaretCircleRight } from "@phosphor-icons/react";
import PropTypes from "prop-types";
import CustomBreadcrumbs from "../../components/Breadcrumbs";
import classes from "./ComplaintModule.module.css";

// Lazy load components
const Feedback = lazy(() => import("./components/Feedback"));
const FormPage = lazy(() => import("./components/FormPage"));
const ComplaintHistory = lazy(() => import("./components/ComplaintHistory"));
const GenerateReport = lazy(() => import("./components/Generate_Report"));
const ResolvedComplaints = lazy(
  () => import("./components/ResolvedComplaints"),
);
const UnresolvedComplaints = lazy(
  () => import("./components/UnresolvedComplaints"),
);
const RedirectedComplaints = lazy(
  () => import("./components/RedirectedComplaints"),
);

// Initialize font
(() => {
  const link = document.createElement("link");
  link.href =
    "https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap";
  link.rel = "stylesheet";
  document.head.appendChild(link);
})();

// Define role-based tab configurations
const TAB_CONFIGS = {
  report: [{ title: "Generate Report" }],
  staff: [
    // Updated order: Unresolved Complaints first, Resolved Complaints second
    { title: "Unresolved Complaints" },
    { title: "Resolved Complaints" },
    { title: "Generate Report" },
  ],
  sp: [{ title: "Redirected Complaints" }, { title: "Generate Report" }],
  complaint_admin: [{ title: "Generate Report" }],
  default: [
    { title: "Lodge a Complaint" },
    { title: "Complaint History" },
    { title: "Feedback" },
  ],
};
function NavigationButton({ direction, onClick }) {
  return (
    <Button
      onClick={onClick}
      variant="default"
      p={0}
      style={{ border: "none" }}
    >
      {direction === "prev" ? (
        <CaretCircleLeft
          className={classes.fusionCaretCircleIcon}
          weight="light"
          aria-label="Previous"
        />
      ) : (
        <CaretCircleRight
          className={classes.fusionCaretCircleIcon}
          weight="light"
          aria-label="Next"
        />
      )}
    </Button>
  );
}

NavigationButton.propTypes = {
  direction: PropTypes.oneOf(["prev", "next"]).isRequired,
  onClick: PropTypes.func.isRequired,
};

function ComplaintModuleLayout() {
  const [activeTab, setActiveTab] = useState("0");
  const tabsListRef = useRef(null);
  const role = useSelector((state) => state.user.role);

  // Choose the tab configuration based on user role.
  const tabItems = useMemo(() => {
    if (role.includes("complaint_admin")) return TAB_CONFIGS.complaint_admin;
    if (role.includes("warden") || role.includes("SA"))
      return TAB_CONFIGS.report;
    if (role.includes("SP")) return TAB_CONFIGS.sp;
    if (role.includes("caretaker")) return TAB_CONFIGS.staff;
    return TAB_CONFIGS.default;
  }, [role]);

  const handleTabChange = (direction) => {
    const newIndex =
      direction === "next"
        ? Math.min(Number(activeTab) + 1, tabItems.length - 1)
        : Math.max(Number(activeTab) - 1, 0);
    setActiveTab(String(newIndex));

    if (tabsListRef.current) {
      tabsListRef.current.scrollBy({
        left: direction === "next" ? 50 : -50,
        behavior: "smooth",
      });
    }
  };

  // Map tab content based on role
  const tabContentMap = useMemo(
    () => ({
      report: {
        0: <GenerateReport />,
      },
      staff: {
        // Updated order: Unresolved Complaints first, Resolved Complaints second
        0: <UnresolvedComplaints />,
        1: <ResolvedComplaints />,
        2: <GenerateReport />,
      },
      sp: {
        0: <RedirectedComplaints />,
        1: <GenerateReport />,
      },
      complaint_admin: {
        0: <GenerateReport />,
      },
      default: {
        0: <FormPage />,
        1: <ComplaintHistory />,
        2: <Feedback />,
      },
    }),
    [],
  );

  const getTabContent = () => {
    let content;
    if (role.includes("complaint_admin"))
      content = tabContentMap.complaint_admin[activeTab];
    else if (role.includes("warden") || role.includes("SA"))
      content = tabContentMap.report[activeTab];
    else if (role.includes("SP")) content = tabContentMap.sp[activeTab];
    else if (role.includes("caretaker"))
      content = tabContentMap.staff[activeTab];
    else content = tabContentMap.default[activeTab];

    return content || <Loader />;
  };

  return (
    <div style={{ fontFamily: "Manrope" }}>
      <CustomBreadcrumbs />
      <Flex justify="space-between" align="center" mt="lg">
        <Flex justify="flex-start" align="center" gap="1rem" mt="1.5rem">
          <NavigationButton
            direction="prev"
            onClick={() => handleTabChange("prev")}
          />

          <div className={classes.fusionTabsContainer} ref={tabsListRef}>
            <Tabs value={activeTab} onChange={setActiveTab}>
              <Tabs.List style={{ display: "flex", flexWrap: "nowrap" }}>
                {tabItems.map((item, index) => (
                  <Tabs.Tab
                    value={String(index)}
                    key={item.title}
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

          <NavigationButton
            direction="next"
            onClick={() => handleTabChange("next")}
          />
        </Flex>
      </Flex>

      <Flex direction="row" justify="start" align="start">
        <Suspense fallback={<Loader />}>{getTabContent()}</Suspense>
      </Flex>
    </div>
  );
}

export default ComplaintModuleLayout;
