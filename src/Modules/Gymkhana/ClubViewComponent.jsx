import { Box, Group, Stack, Text } from "@mantine/core";
import { useState, lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import ModuleTabs from "../../components/moduleTabs"; // Assuming this is the correct path
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "mantine-react-table/styles.css";
import EventApprovalsWithProviders from "./ApprovalsTable";
import CoordinatorMembersWithProviders from "./CoordinatorMembersTable";
import BudgetApprovalsWithProviders from "./BudgetApprovalTable";
import FestForm from "./FestForm";
import { useGetCurrentLoginnedRoleRelatedClub } from "./BackendLogic/ApiRoutes";
import CustomTable from "./CustomTable";
import DownloadNewsletter from "./DownloadNewsletter";
import ReportForm from "./EventReportForm";
import EventReportTable from "./EventReportTable";

const RegistrationForm = lazy(() => import("./RegistrationForm"));
const EventForm = lazy(() => import("./EventForm"));
const BudgetForm = lazy(() => import("./BudgetForm"));
const NewsLetterForm = lazy(() => import("./NewsLetterForm"));

function ClubViewComponent({
  AboutClub,
  clubName,
  membersData,
  achievementsData,
  eventsData,
  membersColumns,
  achievementsColumns,
  eventsColumns,
}) {
  const user = useSelector((state) => state.user);
  const token = localStorage.getItem("authToken");
  const userRole = user.role;
  const [activeclubfeature, setactiveclubfeature] = useState("0"); // Default index as string for ModuleTabs
  const { data: CurrentLogginedRelatedClub = [] } =
    useGetCurrentLoginnedRoleRelatedClub(user.username, token);

  // Create a tabs array dynamically based on user role and conditions
  const tabs = [{ title: "About" }];

  if (
    user.role === "co-ordinator" &&
    CurrentLogginedRelatedClub.length > 0 &&
    CurrentLogginedRelatedClub[0].club === clubName
  ) {
    tabs.push({ title: `${clubName} Members` });
  } else {
    tabs.push({ title: "Members" });
  }

  tabs.push({ title: "Achievements" });

  if (user.role === "co-ordinator") {
    tabs.push({ title: `${clubName} Events` });
  } else {
    tabs.push({ title: "Events" });
  }

  if (user.role === "student") {
    tabs.push({ title: "Register" });
  }

  if (userRole === "Dean_s") {
    tabs.push({ title: "Events Approval" }, { title: "Budget Approval" });
  }

  if (
    ["FIC", "Counsellor", "Professor"].includes(userRole) &&
    CurrentLogginedRelatedClub.length > 0 &&
    CurrentLogginedRelatedClub[0].club === clubName
  ) {
    tabs.push({ title: "Events Approval" }, { title: "Budget Approval" });
  }

  if (
    user.role === "co-ordinator" &&
    CurrentLogginedRelatedClub.length > 0 &&
    CurrentLogginedRelatedClub[0].club === clubName
  ) {
    tabs.push(
      { title: "Events Approval" },
      { title: "Budget Approval" },
      { title: "Events Approval Form" },
      { title: "Budget Approval Form" },
      { title: "Fest Form" },
      { title: "Upload for Newsletter" },
      { title: "Event Report Form" },
    );
  }

  tabs.push({ title: "Download Newsletter" });

  if (user.role === "Counsellor") {
    tabs.push({ title: "Event Reports" });
  }

  const renderActiveContent = () => {
    switch (tabs[parseInt(activeclubfeature, 10)]?.title) {
      case "About":
        return (
          <Text>
            {" "}
            Welcome to {clubName} {AboutClub}{" "}
          </Text>
        );
      case "Members":
        return (
          <CustomTable
            data={membersData}
            columns={membersColumns}
            TableName="Members"
          />
        );
      case "Achievements":
        return (
          <CustomTable
            columns={achievementsColumns}
            data={achievementsData}
            TableName="Acheievements"
          />
        );
      case "Events":
        return (
          <CustomTable
            columns={eventsColumns}
            data={eventsData}
            TableName="Events2"
          />
        );
      case "Events Approval":
        return (
          <Suspense fallback={<div>Loading Table component</div>}>
            <EventApprovalsWithProviders clubName={clubName} />
          </Suspense>
        );
      case "Budget Approval":
        return (
          <Suspense fallback={<div>Loading Table component</div>}>
            <BudgetApprovalsWithProviders clubName={clubName} />
          </Suspense>
        );
      case "Fest Form":
        return (
          <Suspense fallback={<div>Loading Table component</div>}>
            <FestForm clubName={clubName} />
          </Suspense>
        );
      case `${clubName} Members`:
        return (
          <Suspense fallback={<div>Loading Members Table</div>}>
            <CoordinatorMembersWithProviders clubName={clubName} />
          </Suspense>
        );
      case `${clubName} Events`:
        return (
          <Suspense fallback={<div>Loading Table component</div>}>
            <CustomTable data={eventsData} columns={eventsColumns} />
          </Suspense>
        );
      case "Events Approval Form":
        return (
          <Suspense fallback={<div>Loading Events Approval Form...</div>}>
            <EventForm clubName={clubName} />
          </Suspense>
        );
      case "Budget Approval Form":
        return (
          <Suspense fallback={<div>Loading Budget Approval Form...</div>}>
            <BudgetForm clubName={clubName} />
          </Suspense>
        );
      case "Upload for Newsletter":
        return (
          <Suspense fallback={<div>Loading Newsletter Form...</div>}>
            <NewsLetterForm clubName={clubName} />
          </Suspense>
        );
      case "Download Newsletter":
        return (
          <Suspense fallback={<div>Loading options</div>}>
            <DownloadNewsletter clubName={clubName} />
          </Suspense>
        );
      case "Event Report Form":
        return (
          <Suspense fallback={<div>Loading Event Report Form</div>}>
            <ReportForm clubName={clubName} />
          </Suspense>
        );
      case "Event Reports":
        return (
          <Suspense fallback={<div>Loading Event Reports</div>}>
            <EventReportTable clubName={clubName} />
          </Suspense>
        );
      default:
        return (
          <Stack align="center">
            <Suspense fallback={<div>Loading Registration Form...</div>}>
              <RegistrationForm clubName={clubName} />
            </Suspense>
          </Stack>
        );
    }
  };

  return (
    <Box style={{ height: "100vh" }}>
      <Group justify="space-between">
        <Text align="content-start" fw={800} size="40px">
          {clubName}
        </Text>
        <ModuleTabs
          tabs={tabs}
          activeTab={activeclubfeature}
          setActiveTab={setactiveclubfeature}
        />
      </Group>
      <Box mt="20px">{renderActiveContent()}</Box>
    </Box>
  );
}

ClubViewComponent.propTypes = {
  clubName: PropTypes.string.isRequired,
  AboutClub: PropTypes.string.isRequired,
  membersData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      roleNo: PropTypes.string.isRequired,
    }),
  ).isRequired,
  achievementsData: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      year: PropTypes.string.isRequired, // Assuming year is a string, e.g., "2022"
    }),
  ).isRequired,
  eventsData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired, // Assuming date is a string in "YYYY-MM-DD" format
    }),
  ).isRequired,
  membersColumns: PropTypes.arrayOf(
    PropTypes.shape({
      accessorKey: PropTypes.string.isRequired,
      header: PropTypes.string.isRequired,
    }),
  ).isRequired,
  achievementsColumns: PropTypes.arrayOf(
    PropTypes.shape({
      accessorKey: PropTypes.string.isRequired,
      header: PropTypes.string.isRequired,
    }),
  ).isRequired,
  eventsColumns: PropTypes.arrayOf(
    PropTypes.shape({
      accessorKey: PropTypes.string.isRequired,
      header: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default ClubViewComponent;
