import React, { useEffect, useState } from "react";
import { Grid, Container, Loader, Flex, Select } from "@mantine/core";
import { useDispatch } from "react-redux";
import { SortAscending } from "@phosphor-icons/react";
import CustomBreadcrumbs from "../../../../components/Breadcrumbs.jsx";
import ModuleTabs from "../../../../components/moduleTabs.jsx";
import PCCAdminDashboard from "./Dashboard/PCCAdminDashboard.jsx";
import OngoingApplication from "./OngoingApplication/OngoingApplication.jsx";
import PastApplications from "./PastApplication/PastApplications.jsx";
import NewApplication from "./NewApplication/NewApplicaion.jsx"; // Fixed typo in import name
import PCCAdminNotifications from "./Notifications/PCCAdminNotification.jsx";
import ManageAttorneys from "./ManageAttorney/ManageAttorneys.jsx";

// Move constants outside of component
const SORT_CATEGORIES = ["Most Recent", "Tags", "Title"];
const TAB_ITEMS = [
  { title: "Dashboard", id: "0" },
  { title: "New Applications", id: "1" },
  { title: "Ongoing Applications", id: "2" },
  { title: "Past Applications", id: "3" },
  { title: "Manage Attorney", id: "4" },
  { title: "Notifications", id: "5" },
];

function ApplicantMainDashboard() {
  const [activeTab, setActiveTab] = useState("0");
  const [sortedBy, setSortedBy] = useState("Most Recent");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No authentication token found!");
        return;
      }

      try {
        setLoading(true);
        // Fetch data logic here if needed
        // Consider using dispatch to update Redux state
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  // Render the appropriate component based on active tab
  const renderTabContent = () => {
    if (loading) {
      return (
        <Container py="xl">
          <Loader size="lg" />
        </Container>
      );
    }

    switch (activeTab) {
      case "0":
        return <PCCAdminDashboard setActiveTab={setActiveTab} />;
      case "1":
        return <NewApplication />;
      case "2":
        return <OngoingApplication setActiveTab={setActiveTab} />;
      case "3":
        return <PastApplications setActiveTab={setActiveTab} />;
      case "4":
        return <ManageAttorneys setActiveTab={setActiveTab} />;
      case "5":
        return <PCCAdminNotifications setActiveTab={setActiveTab} />;
      default:
        return <PCCAdminDashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <>
      <CustomBreadcrumbs />

      <Flex justify="space-between" align="center" mt="lg">
        <ModuleTabs
          tabs={TAB_ITEMS}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          badges={[]}
        />

        <Flex align="center" mt="md" rowGap="1rem" columnGap="4rem" wrap="wrap">
          <Select
            classNames={{
              option: "select-options",
              input: "select-inputs",
            }}
            variant="outline"
            leftSection={<SortAscending />}
            data={SORT_CATEGORIES}
            value={sortedBy}
            onChange={setSortedBy}
            placeholder="Sort By"
          />
        </Flex>
      </Flex>

      <Grid mt="xl">{renderTabContent()}</Grid>
    </>
  );
}

export default ApplicantMainDashboard;
