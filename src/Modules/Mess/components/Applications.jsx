import {
  Button,
  Container,
  Flex,
  Grid,
  Loader,
  Tabs,
  Text,
} from "@mantine/core";
import { CaretCircleLeft, CaretCircleRight } from "@phosphor-icons/react";
import { useRef, useState } from "react";
import classes from "../styles/messModule.module.css";
import SpecialFoodRequests from "./SpecialFoodRequests.jsx";
import RebateRequests from "./StudentRebatePage.jsx";

function MyComponent() {
  const [activeTab, setActiveTab] = useState("0");
  const tabsListRef = useRef(null);

  const tabItems = [
    { title: "Rebate Requests" },
    { title: "Special Food Requests" },
  ];

  const handleTabChange = (direction) => {
    const newIndex =
      direction === "next"
        ? Math.min(+activeTab + 1, tabItems.length - 1)
        : Math.max(+activeTab - 1, 0);
    setActiveTab(String(newIndex));
    tabsListRef.current.scrollBy({
      left: direction === "next" ? 100 : -100,
      behavior: "smooth",
    });
  };

  // Function to render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "0":
        return <RebateRequests />;
      case "1":
        return <SpecialFoodRequests />;
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
          >
            <CaretCircleLeft
              className={classes.fusionCaretCircleIcon}
              weight="light"
            />
          </Button>

          {/* Tabs container with scrolling */}
          <div
            style={{
              display: "flex",
              overflowX: "auto",
              whiteSpace: "nowrap",
              maxWidth: "1000px",
            }}
            ref={tabsListRef}
          >
            <Tabs value={activeTab} onChange={setActiveTab}>
              <Tabs.List>
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
          >
            <CaretCircleRight
              className={classes.fusionCaretCircleIcon}
              weight="light"
            />
          </Button>
        </Flex>
      </Flex>

      {/* Main content */}
      <Grid>
        <Container fluid style={{ maxWidth: "1000px", margin: "0 auto" }}>
          {renderTabContent()}
        </Container>
      </Grid>
    </>
  );
}

export default MyComponent;
