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

// Lazy load the Announcements component
const Announcements = lazy(() => import("./Announcements"));

function BrowseAnnouncements() {
  const [activeTab, setActiveTab] = useState("0");
  const tabsListRef = useRef(null);

  const tabItems = [
    { title: "ALL" },
    { title: "CSE" },
    { title: "ECE" },
    { title: "ME" },
    { title: "SM" },
  ];

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

  // Render content based on active tab with lazy-loaded Announcements
  const renderTabContent = () => {
    switch (activeTab) {
      case "0":
        return <Announcements branch="ALL" />;
      case "1":
        return <Announcements branch="CSE" />;
      case "2":
        return <Announcements branch="ECE" />;
      case "3":
        return <Announcements branch="ME" />;
      case "4":
        return <Announcements branch="SM" />;
      default:
        return null;
    }
  };

  return (
    <Container size="xl">
      <Box mb="xl">
        <Title order={2} align="center">
          View Department-wise Announcements
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
            {renderTabContent() || (
              <Text align="center" color="gray">
                No Announcements Available
              </Text>
            )}
          </Suspense>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default BrowseAnnouncements;
