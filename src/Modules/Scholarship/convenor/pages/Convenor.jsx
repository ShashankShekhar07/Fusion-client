import React, { useState } from "react";
import { CaretCircleLeft, CaretCircleRight } from "@phosphor-icons/react";
import { Tabs, Button, Flex, Text } from "@mantine/core";
import AwardsAndScholarshipCatalog from "../components/AwardsAndScholarshipCatalogC";
import SpacsMembers from "../components/spacsMembersC";
import PreviousWinners from "../components/previousWinnerC";
import styles from "./Convenor.module.css";

function ConvenorPage() {
  const [activeTab, setActiveTab] = useState(0);

  const tabItems = [
    {
      label: "Awards and Scholarship Catalogue",
      component: <AwardsAndScholarshipCatalog />,
    },
    { label: "SPACS Members and Details", component: <SpacsMembers /> },
    { label: "Previous Winners", component: <PreviousWinners /> },
  ];

  const handleTabChange = (direction) => {
    const newIndex =
      direction === "next"
        ? (activeTab + 1) % tabItems.length
        : (activeTab - 1 + tabItems.length) % tabItems.length;

    setActiveTab(newIndex);
  };

  return (
    <div className={styles.pageBackground}>
      <div className={styles.wrapper}>
        {/* Navigation Tabs */}
        <Flex
          justify="flex-start"
          align="center"
          gap={{ base: "0.75rem", md: "1.25rem" }}
          mt={{ base: "1.5rem", md: "2rem" }}
          ml={{ md: "lg" }}
          style={{ fontSize: "1.5rem" }}
        >
          {/* Left Caret */}
          <Button
            onClick={() => handleTabChange("prev")}
            variant="default"
            p={0}
            style={{ border: "none" }}
          >
            <CaretCircleLeft className={styles.caretIcon} weight="light" />
          </Button>

          {/* Tabs */}
          <div className={styles.tabsContainer}>
            <Tabs value={activeTab.toString()}>
              <Tabs.List style={{ display: "flex", flexWrap: "nowrap" }}>
                {tabItems.map((tab, index) => (
                  <Tabs.Tab
                    key={index}
                    value={index.toString()}
                    onClick={() => setActiveTab(index)}
                    className={
                      activeTab === index
                        ? styles.activeTab
                        : styles.inactiveTab
                    }
                  >
                    <Text size="lg" weight={500}>
                      {tab.label}
                    </Text>
                    {/* Underline Progress Bar */}
                    {activeTab === index && (
                      <div className={styles.underline} />
                    )}
                  </Tabs.Tab>
                ))}
              </Tabs.List>
            </Tabs>
          </div>

          {/* Right Caret */}
          <Button
            onClick={() => handleTabChange("next")}
            variant="default"
            p={0}
            style={{ border: "none" }}
          >
            <CaretCircleRight className={styles.caretIcon} weight="light" />
          </Button>
        </Flex>

        {/* Content */}
        <div>{tabItems[activeTab].component}</div>
      </div>
    </div>
  );
}

export default ConvenorPage;
