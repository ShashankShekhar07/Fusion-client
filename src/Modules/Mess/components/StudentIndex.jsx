import { Button, Container, Flex, Loader, Tabs, Text } from "@mantine/core";
import { CaretCircleLeft, CaretCircleRight } from "@phosphor-icons/react";
import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import CustomBreadcrumbs from "../../../components/Breadcrumbs.jsx";
import classes from "../styles/messModule.module.css";
import UpdatePayments from "./UpdatePayments.jsx";
import Registration from "./Registration.jsx";
import Deregistration from "./Deregistration.jsx";
import ViewMenu from "./ViewMenu.jsx";
import MessFeedback from "./StudentFeedback.jsx";
import Applications from "./Applications.jsx";
import ViewBillandPayments from "./ViewBillAndPayments.jsx";
import { viewRegistrationDataRoute } from "../routes";

function Student() {
  const student_id = useSelector((state) => state.user.roll_no);
  const [activeTab, setActiveTab] = useState(null);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const tabsListRef = useRef(null);

  const tabItems = [
    { key: "viewMenu", title: "View Menu", component: <ViewMenu /> },
    {
      key: "viewBillPayments",
      title: "View Bill and Payments",
      component: <ViewBillandPayments />,
    },
    { key: "registration", title: "Registration", component: <Registration /> },
    { key: "feedback", title: "Feedback", component: <MessFeedback /> },
    { key: "applications", title: "Applications", component: <Applications /> },
    {
      key: "updatePayment",
      title: "Update Payment",
      component: <UpdatePayments />,
    },
    {
      key: "deregistration",
      title: "Deregistration",
      component: <Deregistration />,
    },
  ];

  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.post(
          viewRegistrationDataRoute,
          {
            type: "search",
            student_id: student_id.toUpperCase(),
          },
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          },
        );
        setRegistrationStatus(response.data.payload.current_mess_status);
      } catch (error) {
        console.error("Error fetching registration status:", error);
      }
    };

    if (student_id) {
      fetchRegistrationStatus();
    }
  }, [student_id]);

  const filteredTabItems = tabItems.filter((item) => {
    if (registrationStatus === "Registered") {
      return item.key !== "registration";
    }
    if (registrationStatus === "Deregistered") {
      return ![
        "deregistration",
        "updatePayment",
        "feedback",
        "applications",
      ].includes(item.key);
    }
    return true;
  });

  useEffect(() => {
    if (filteredTabItems.length > 0 && !activeTab) {
      setActiveTab(filteredTabItems[0].key);
    }
  }, [filteredTabItems]);

  const handleTabChange = (direction) => {
    const currentIndex = filteredTabItems.findIndex(
      (item) => item.key === activeTab,
    );
    const newIndex =
      direction === "next"
        ? Math.min(currentIndex + 1, filteredTabItems.length - 1)
        : Math.max(currentIndex - 1, 0);

    setActiveTab(filteredTabItems[newIndex].key);

    tabsListRef.current.scrollBy({
      left: direction === "next" ? 50 : -50,
      behavior: "smooth",
    });
  };

  const renderTabContent = () => {
    const activeTabItem = filteredTabItems.find(
      (item) => item.key === activeTab,
    );
    return activeTabItem ? activeTabItem.component : <Loader />;
  };

  return (
    <>
      <CustomBreadcrumbs />
      <Flex justify="space-between" align="center" mt="lg">
        <Flex justify="flex-start" align="center" gap="1rem" mt="1.5rem">
          <Button
            onClick={() => handleTabChange("prev")}
            variant="default"
            p={0}
            bd={0}
            bg="transparent"
          >
            <CaretCircleLeft
              className={classes.fusionCaretCircleIcon}
              weight="light"
            />
          </Button>

          <div className={classes.fusionTabsContainer} ref={tabsListRef}>
            <Tabs value={activeTab} onChange={setActiveTab}>
              <Tabs.List style={{ display: "flex", flexWrap: "nowrap" }}>
                {filteredTabItems.map((item) => (
                  <Tabs.Tab
                    value={item.key}
                    key={item.key}
                    className={
                      activeTab === item.key
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
            bd={0}
            bg="transparent"
          >
            <CaretCircleRight
              className={classes.fusionCaretCircleIcon}
              weight="light"
            />
          </Button>
        </Flex>
      </Flex>

      <Container fluid>{renderTabContent()}</Container>
    </>
  );
}

export default Student;
