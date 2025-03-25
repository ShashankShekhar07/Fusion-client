import {
  Button,
  Container,
  Flex,
  Grid,
  Loader,
  Tabs,
  Text,
} from "@mantine/core";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { useRef, useState } from "react";
import classes from "../styles/messModule.module.css";

import ViewRegistrations from "./ViewRegistration.jsx";
import ManageMess from "./addorrem.jsx";

function MessActivities() {
  const [activeTab, setActiveTab] = useState("0");
  const tabsListRef = useRef(null);

  const tabItems = [
    { title: "View Registrations" },
    { title: "Add or Remove from mess" },
  ];

  const handleTabChange = (direction) => {
    const newIndex =
      direction === "next"
        ? Math.min(+activeTab + 1, tabItems.length - 1)
        : Math.max(+activeTab - 1, 0);
    setActiveTab(String(newIndex));
    tabsListRef.current.scrollBy({
      left: direction === "next" ? 50 : -50,
      behavior: "smooth",
    });
  };

  // Function to render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "0":
        return <ViewRegistrations />;
      case "1":
        return <ManageMess />;
      default:
        return <Loader />;
    }
  };

  return (
    <>
      {/* Tab navigation */}
      <Flex justify="center" align="center" mt="5">
        <Flex justify="space-between" align="center" gap="1rem" mt="1.5rem">
          <Button
            onClick={() => handleTabChange("prev")}
            variant="default"
            p={0}
            style={{ border: "none" }}
            disabled={activeTab === "0"} // Disable button if on the first tab
          >
            <CaretLeft
              className={classes.fusionCaretCircleIcon}
              weight="light"
            />
          </Button>

          <div className={classes.fusionTabsContainer} ref={tabsListRef}>
            <Tabs value={activeTab} onChange={setActiveTab}>
              <Tabs.List style={{ display: "flex", flexWrap: "nowrap" }}>
                {tabItems.map((item, index) => (
                  <Tabs.Tab
                    value={`${index}`}
                    key={index}
                    className={
                      activeTab === `${index}`
                        ? classes.fusionActiveRecentTab
                        : ""
                    }
                  >
                    <Flex gap="4px">
                      <Text>{item.title}</Text>
                    </Flex>
                  </Tabs.Tab>
                ))}
              </Tabs.List>
            </Tabs>
          </div>

          <Button
            onClick={() => handleTabChange("next")}
            variant="default"
            p={0}
            style={{ border: "none" }}
            disabled={activeTab === `${tabItems.length - 1}`} // Disable button if on the last tab
          >
            <CaretRight
              className={classes.fusionCaretCircleIcon}
              weight="light"
            />
          </Button>
        </Flex>
      </Flex>

      {/* Main content */}
      <Grid>
        <Container fluid style={{ maxWidth: "600px", margin: "0 auto" }}>
          {renderTabContent()}
        </Container>
      </Grid>
    </>
  );
}

export default MessActivities;
