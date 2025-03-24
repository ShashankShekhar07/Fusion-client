import React, { useRef, useState, useEffect } from "react";
import { Flex, Button, Tabs, Text } from "@mantine/core";
import { CaretCircleLeft, CaretCircleRight } from "@phosphor-icons/react";
import { useNavigate, useLocation } from "react-router-dom";
import classes from "../../../Dashboard/Dashboard.module.css";

function HistoryNavBar() {
  const [activeTab, setActiveTab] = useState(0);
  const tabsListRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const tabItems = [
    { title: "Patient Log", path: "/healthcenter/compounder/patient-log" },
    { title: "History", path: "/healthcenter/compounder/patient-log/history" },
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    const activeIndex = tabItems.findIndex((item) => item.path === currentPath);
    if (activeIndex !== -1) {
      setActiveTab(activeIndex);
    }
  }, [location.pathname]);

  const handleNavigation = (index) => {
    const path = tabItems[index]?.path;
    if (path && window.location.pathname !== path) {
      navigate(path);
    }
  };

  const handleTabChange = (direction) => {
    const newIndex =
      direction === "next"
        ? Math.min(activeTab + 1, tabItems.length - 1)
        : Math.max(activeTab - 1, 0);

    if (newIndex !== activeTab) {
      setActiveTab(newIndex);
      handleNavigation(newIndex);

      if (tabsListRef.current) {
        tabsListRef.current.scrollBy({
          left: direction === "next" ? 50 : -50,
          behavior: "smooth",
        });
      }
    }
  };

  const navbarStyle = {
    tabsContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "16px",
      flexWrap: "wrap",
    },
    button: {
      padding: 0,
      border: "none",
    },
    tabsWrapper: {
      flexGrow: 1,
      overflowX: "auto",
    },
    tabsList: {
      display: "flex",
      flexWrap: "nowrap",
      overflowX: "auto",
    },
    tab: {
      flexShrink: 0,
    },
  };

  return (
    <Flex style={navbarStyle.tabsContainer}>
      <Flex justify="flex-start" align="center" gap="1rem" mt="1.5rem" ml="lg">
        <Button
          onClick={() => handleTabChange("prev")}
          variant="default"
          style={navbarStyle.button}
        >
          <CaretCircleLeft weight="light" size={32} />
        </Button>

        <div
          className={classes.fusionTabsContainer}
          ref={tabsListRef}
          style={navbarStyle.tabsWrapper}
        >
          <Tabs
            value={`${activeTab}`}
            onChange={(value) => {
              const newIndex = parseInt(value, 10);
              setActiveTab(newIndex);
              handleNavigation(newIndex);
            }}
          >
            <Tabs.List style={navbarStyle.tabsList}>
              {tabItems.map((item, index) => (
                <Tabs.Tab
                  value={`${index}`}
                  key={index}
                  style={navbarStyle.tab}
                  className={
                    activeTab === index ? classes.fusionActiveRecentTab : ""
                  }
                >
                  <Flex gap="4px">
                    <Text>{item.title || "Untitled"}</Text>
                  </Flex>
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>
        </div>

        <Button
          onClick={() => handleTabChange("next")}
          variant="default"
          style={navbarStyle.button}
        >
          <CaretCircleRight weight="light" size={32} />
        </Button>
      </Flex>
    </Flex>
  );
}

export default HistoryNavBar;
