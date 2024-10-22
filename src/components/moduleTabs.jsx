import PropTypes from "prop-types";
import { CaretCircleLeft, CaretCircleRight } from "@phosphor-icons/react";
import { Tabs, Button, Flex, Badge, Text } from "@mantine/core";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { setActiveTab_ } from "../redux/moduleslice";
import classes from "../Modules/Dashboard/Dashboard.module.css";

function ModuleTabs({ tabs, activeTab, setActiveTab, badges = [] }) {
  const tabsListRef = useRef(null);
  const dispatch = useDispatch();

  const handleTabChange = (direction) => {
    const currentIndex = parseInt(activeTab, 10);
    const newIndex =
      direction === "next"
        ? Math.min(currentIndex + 1, tabs.length - 1)
        : Math.max(currentIndex - 1, 0);
    setActiveTab(String(newIndex));
    dispatch(setActiveTab_(tabs[newIndex].title));
    tabsListRef.current.scrollBy({
      left: direction === "next" ? 50 : -50,
      behavior: "smooth",
    });
  };

  const handleTabClick = (index) => {
    setActiveTab(String(index));
    dispatch(setActiveTab_(tabs[index].title));
  };

  return (
    <Flex justify="space-between" align="center">
      <Flex align="center" gap="1rem">
        <Button
          onClick={() => handleTabChange("prev")}
          variant="default"
          p={0}
          style={{ border: "none" }}
        >
          <CaretCircleLeft
            weight="light"
            className={classes.fusionCaretCircleIcon}
          />
        </Button>
        <div className={classes.tabsContainer} ref={tabsListRef}>
          <Tabs value={activeTab} onChange={(value) => handleTabClick(value)}>
            <Tabs.List style={{ display: "flex", flexWrap: "nowrap" }}>
              {tabs.map((tab, index) => (
                <Tabs.Tab
                  value={`${index}`}
                  key={index}
                  className={activeTab === `${index}` ? classes.activeTab : ""}
                >
                  <Flex gap="4px">
                    <Text>{tab.title}</Text>
                    {badges[index] > 0 && (
                      <Badge
                        color={badges[index] > 0 ? "blue" : "grey"}
                        size="sm"
                        p={6}
                      >
                        {badges[index]}
                      </Badge>
                    )}
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
            weight="light"
            className={classes.fusionCaretCircleIcon}
          />
        </Button>
      </Flex>
    </Flex>
  );
}

ModuleTabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
    }),
  ).isRequired,
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  badges: PropTypes.arrayOf(PropTypes.number),
};

export default ModuleTabs;
