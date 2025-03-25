import { useEffect, useRef, useState } from "react";
import { Button, Flex, Tabs, Text } from "@mantine/core";
import { CaretCircleLeft, CaretCircleRight } from "@phosphor-icons/react";
// import CustomBreadcrumbs from "../../../../components/Breadcrumbs";
// import { useSelector } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import classes from "../../../Dashboard/Dashboard.module.css"; // Ensure the CSS module is properly set
import Conference from "./Conference";
import Books from "./Books";
import Journal from "./Journal";
import { setPfNo } from "../../../../redux/pfNoSlice";
import { getPFRoute } from "../../../../routes/facultyProfessionalProfileRoutes";

// eslint-disable-next-line react/prop-types
function PublicationMaster({ setBreadCrumbItems }) {
  const [activeTab, setActiveTab] = useState("0");
  const tabsListRef = useRef(null);
  const dispatch = useDispatch();

  // const pfNo = useSelector((state) => state.pfNo.value);

  // console.log("publications", pfNo);

  // Tab items data
  const tabItems = [
    { title: "Journal", component: <Journal /> },
    { title: "Books", component: <Books /> },
    { title: "Conference", component: <Conference /> },
    // { title: "Thesis Supervision", component: <ThesisSupervisionMaster /> },
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

  const username = useSelector((state) => state.user.roll_no);
  console.log(username);

  const fetchPfNo = async () => {
    const formData = new FormData();
    formData.append("username", username);
    const res = await axios.post(getPFRoute, formData);
    console.log("res", res.data.pf);
    dispatch(setPfNo(res.data.pf));
  };

  useEffect(() => {
    fetchPfNo();
  }, []);

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

export default PublicationMaster;
