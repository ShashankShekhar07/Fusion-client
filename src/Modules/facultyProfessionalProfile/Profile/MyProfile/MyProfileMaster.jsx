import { useEffect, useRef, useState } from "react";
import { Button, Flex, Tabs, Text } from "@mantine/core";
import { CaretCircleLeft, CaretCircleRight } from "@phosphor-icons/react";
// import CustomBreadcrumbs from "../../../../components/Breadcrumbs";
import ViewResearchProject from "./ViewResearchProject";
import ViewConsultancyProject from "./ViewConsultancyProject";
import ViewPatent from "./ViewPatent";
import ViewPGThesis from "./ViewPGThesis";
import ViewPhDThesis from "./ViewPhDThesis";
// import ViewEvent from "./ViewEvents";
import ViewForeignVisits from "./ViewForeignVisits";
import ViewIndianVisits from "./ViewIndianVisits";
import ViewConSym from "./ViewConSym";
import ViewEvents from "./ViewEvents";
import classes from "../../../Dashboard/Dashboard.module.css";
// import Books from "../Publications/Books";
// import Journal from "../Publications/Journal";
// import ViewJournal from "./ViewJournal";
import ViewBooks from "./ViewBooks";
import ViewJournal from "./ViewJournal";

// eslint-disable-next-line react/prop-types
function VisitsMaster({ setBreadCrumbItems }) {
  const [activeTab, setActiveTab] = useState("0");
  const tabsListRef = useRef(null);

  // Tab items data
  const tabItems = [
    { title: "Research Project", component: <ViewResearchProject /> },
    { title: "Consultancy Project", component: <ViewConsultancyProject /> },
    { title: "Patent", component: <ViewPatent /> },
    { title: "PG Thesis", component: <ViewPGThesis /> },
    { title: "PhD Thesis", component: <ViewPhDThesis /> },
    { title: "Events Organised", component: <ViewEvents /> },
    { title: "Foreign Visits", component: <ViewForeignVisits /> },
    { title: "Indian Visits", component: <ViewIndianVisits /> },
    { title: "Events Attended", component: <ViewConSym /> },
    { title: "Journal", component: <ViewJournal /> },
    { title: "Books", component: <ViewBooks /> },
  ];

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
    // console.log(currentTab);

    const breadcrumbs = [{ title: currentTab.title, href: "#" }].map(
      (item, index) => (
        <Text key={index} component="a" href={item.href} size="16px" fw={600}>
          {item.title}
        </Text>
      ),
    );

    setBreadCrumbItems((prevBreadCrumbs) => {
      const firstThreeEntries = prevBreadCrumbs.slice(0, 3);
      return [...firstThreeEntries, breadcrumbs];
    });
  }, [activeTab]);

  return (
    <>
      {/* <CustomBreadcrumbs /> */}

      <Flex
        justify="flex-start"
        align="center"
        gap={{ base: "0.5rem", md: "1rem" }}
        mt={{ base: "1rem", md: "1.5rem" }}
        ml={{ md: "lg" }}
      >
        {/* Previous Button */}
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

        {/* Next Button */}
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
      </Flex>

      {/* Display the active tab content */}
      {tabItems[parseInt(activeTab, 10)]?.component}
    </>
  );
}

export default VisitsMaster;
