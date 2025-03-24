import React, { useRef, useState, Suspense, lazy } from "react";
import {
  Button,
  Container,
  Flex,
  Grid,
  Tabs,
  Text,
  Title,
  Box,
} from "@mantine/core";
import { CaretLeft, CaretRight } from "@phosphor-icons/react"; // Import icons from @phosphor-icons/react
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

// Lazy load components
const AboutUs = lazy(() => import("./AboutUs"));
const Facilities = lazy(() => import("./Facilities"));
const Faculty = lazy(() => import("./Faculty"));
const Studentcat = lazy(() => import("./Studentcat"));
const Announcements = lazy(() => import("./Announcements"));
const Alumnicat = lazy(() => import("./Alumnicat"));
const ViewFeedback = lazy(() => import("./ViewFeedback"));

function DeptTabs({ branch }) {
  const [activeTab, setActiveTab] = useState("0");
  const tabsListRef = useRef(null);

  const role = useSelector((state) => state.user.role);

  const isFeedbackAvailable = [
    "HOD (CSE)",
    "deptadmin_cse",
    "HOD (SM)",
    "deptadmin_sm",
    "HOD (ECE)",
    "deptadmin_ece",
    "HOD (ME)",
    "deptadmin_me",
    "HOD (Design)",
    "deptadmin_design",
    "HOD (Liberal Arts)",
    "deptadmin_liberalarts",
    "HOD (NS)",
    "deptadmin_ns",
  ].includes(role);
  const tabItems = [
    { title: "About Us" },
    { title: "Faculties", id: "2" },
    { title: "Students", id: "3", department: branch },
    { title: "Announcements", id: "4", department: branch },
    { title: "Alumni" },
    { title: "Facilities" },
    // { title: "Stock" },
  ];

  if (isFeedbackAvailable) {
    tabItems.push({ title: "Feedback" });
  }

  const handleTabChange = (direction) => {
    const newIndex =
      direction === "next"
        ? Math.min(+activeTab + 1, tabItems.length - 1)
        : Math.max(+activeTab - 1, 0);
    setActiveTab(String(newIndex));
    tabsListRef.current?.scrollBy({
      left: direction === "next" ? 50 : -50,
      behavior: "smooth",
    });
  };

  const renderTabContent = () => {
    const components = {
      0: <AboutUs branch={branch} />,
      1: <Faculty branch={branch} />,
      2: <Studentcat branch={branch} />,
      3: <Announcements branch={branch} />,
      4: <Alumnicat />,
      5: <Facilities branch={branch} />,
      6: isFeedbackAvailable ? <ViewFeedback branch={branch} /> : null,
      // 7: <Stock />,
    };
    return components[activeTab] || null;
  };

  return (
    <Container size="xl">
      <Box mb="xl">
        <Title order={2} align="center">
          Welcome to {branch} Department
        </Title>
      </Box>

      <Flex justify="center" align="center" mb="xl">
        <Button
          onClick={() => handleTabChange("prev")}
          variant="subtle"
          p={0}
          mr="xs"
        >
          <CaretLeft size={24} />
        </Button>

        <Box style={{ maxWidth: "80%", overflowX: "auto" }} ref={tabsListRef}>
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List>
              {tabItems.map((item, index) => (
                <Tabs.Tab value={String(index)} key={index}>
                  <Text>{item.title}</Text>
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>
        </Box>

        <Button
          onClick={() => handleTabChange("next")}
          variant="subtle"
          p={0}
          ml="xs"
        >
          <CaretRight size={24} />
        </Button>
      </Flex>

      <Grid>
        <Grid.Col>
          <Suspense fallback={<Text>Loading...</Text>}>
            {renderTabContent()}
          </Suspense>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default DeptTabs;

DeptTabs.propTypes = {
  branch: PropTypes.string.isRequired,
};
