import { useState, useRef, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { CaretCircleLeft, CaretCircleRight } from "@phosphor-icons/react";
import { Tabs, Button, Flex, Text } from "@mantine/core";
import RoleBasedFilter from "./helper/roleBasedFilter";
import classes from "../Dashboard/Dashboard.module.css";
import CustomBread from "./components/BreadCrumbs";

function IwdPage() {
  const role = useSelector((state) => state.user.role);
  const [activeTab, setActiveTab] = useState("0");
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);
  const tabsListRef = useRef(null);
  const { roleBasedTabs, tabItems } = RoleBasedFilter({ setActiveTab });

  const filteredTabs = useMemo(() => {
    return roleBasedTabs[role] || tabItems;
  }, [role]);
  // console.log(filteredTabs);

  const handleTabChange = (direction) => {
    const newIndex =
      direction === "next"
        ? Math.min(+activeTab + 1, filteredTabs.length - 1)
        : Math.max(+activeTab - 1, 0);
    setActiveTab(String(newIndex));
    tabsListRef.current.scrollBy({
      left: direction === "next" ? 50 : -50,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const currentTab = filteredTabs[parseInt(activeTab, 10)];
    // console.log(currentTab);

    const breadcrumbs = [
      { title: "Home", href: "/dashboard" },
      { title: "IWD", href: "/iwd" },
      { title: currentTab.title, href: "#" },
    ].map((item, index) => (
      <Text key={index} component="a" href={item.href} size="16px" fw={600}>
        {item.title}
      </Text>
    ));
    // console.log("bread" ,breadcrumbs);

    setBreadcrumbItems(breadcrumbs);
    // console.log(breadcrumbItems);
    // console.log(activeTab);
  }, [activeTab, filteredTabs]);

  return (
    <>
      {/* <Breadcrumbs>{breadcrumbItems}</Breadcrumbs> */}
      <CustomBread breadCrumbs={breadcrumbItems} />
      <Flex
        justify="flex-start"
        align="center"
        gap={{ base: "0.5rem", md: "1rem" }}
        mt={{ base: "1rem", md: "1.5rem" }}
        ml={{ md: "lg" }}
      >
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

        <div className={classes.fusionTabsContainer} ref={tabsListRef}>
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List style={{ display: "flex", flexWrap: "nowrap" }}>
              {filteredTabs.map((item, index) => (
                <Tabs.Tab
                  value={`${index}`}
                  key={index}
                  onClick={() => setActiveTab(String(index))}
                  className={
                    activeTab === `${index}`
                      ? // activeTab === String(index)
                        classes.fusionActiveRecentTab
                      : ""
                  }
                >
                  <Text>{item.title}</Text>
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
      {filteredTabs[parseInt(activeTab, 10)].component}
    </>
  );
}

export default IwdPage;
