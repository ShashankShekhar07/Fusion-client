import axios from "axios";
import PropTypes from "prop-types";
import { SortAscending } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import {
  Container,
  Loader,
  Badge,
  Button,
  Divider,
  Flex,
  Grid,
  Paper,
  Select,
  Text,
  CloseButton,
} from "@mantine/core";
import { useDispatch } from "react-redux";
import { setTotalNotifications } from "../../redux/userslice.jsx";
import classes from "./Dashboard.module.css";
import { Empty } from "../../components/empty";
import CustomBreadcrumbs from "../../components/Breadcrumbs.jsx";
import {
  notificationReadRoute,
  notificationDeleteRoute,
  notificationUnreadRoute,
  getNotificationsRoute,
} from "../../routes/dashboardRoutes";
import ModuleTabs from "../../components/moduleTabs.jsx";

const categories = ["Most Recent", "Tags", "Title"];

function NotificationItem({
  notification,
  markAsRead,
  deleteNotification,
  markAsUnread,
  loading,
}) {
  const { module } = notification.data;

  return (
    <Grid.Col span={{ base: 12, md: 6 }} key={notification.id}>
      <Paper
        radius="md"
        px="lg"
        pt="sm"
        pb="xl"
        style={{ borderLeft: "0.6rem solid #15ABFF" }}
        withBorder
        maw="1240px"
      >
        <Flex justify="space-between">
          <Flex direction="column">
            <Flex gap="md">
              <Text fw={600} size="1.2rem" mb="0.4rem">
                {notification.verb}
              </Text>
              <Badge color="#15ABFF">{module || "N/A"}</Badge>
            </Flex>
            <Text c="#6B6B6B" size="0.7rem">
              {new Date(notification.timestamp).toLocaleDateString()}
            </Text>
            <Divider my="sm" w="10rem" />
          </Flex>
          <CloseButton
            variant="transparent"
            style={{ cursor: "pointer" }}
            onClick={() => deleteNotification(notification.id)}
          />
        </Flex>
        <Flex justify="space-between">
          <Text>{notification.description || "No description available."}</Text>
          <Button
            variant="filled"
            color={notification.unread ? "blue" : "gray"}
            onClick={() =>
              notification.unread
                ? markAsRead(notification.id)
                : markAsUnread(notification.id)
            }
            loaderProps={{ type: "dots" }}
            loading={loading === notification.id}
            style={{ cursor: "pointer" }}
            ml="sm"
            miw="120px"
          >
            {notification.unread ? "Mark as read" : "Unread"}
          </Button>
        </Flex>
      </Paper>
    </Grid.Col>
  );
}

function Dashboard() {
  const [notificationsList, setNotificationsList] = useState([]);
  const [announcementsList, setAnnouncementsList] = useState([]);
  const [activeTab, setActiveTab] = useState("0");
  const [sortedBy, setSortedBy] = useState("Most Recent");
  const [loading, setLoading] = useState(false);
  const [read_Loading, setRead_Loading] = useState(-1);
  const dispatch = useDispatch();
  // const tabsListRef = useRef(null);
  const tabItems = [{ title: "Notifications" }, { title: "Announcements" }];

  const notificationBadgeCount = notificationsList.filter(
    (n) => !n.deleted && n.unread,
  ).length;
  const announcementBadgeCount = announcementsList.filter(
    (n) => !n.deleted && n.unread,
  ).length;
  const badges = [notificationBadgeCount, announcementBadgeCount];
  dispatch(
    setTotalNotifications(notificationBadgeCount + announcementBadgeCount),
  );

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return console.error("No authentication token found!");

      try {
        setLoading(true);
        const { data } = await axios.get(getNotificationsRoute, {
          headers: { Authorization: `Token ${token}` },
        });
        const { notifications } = data;
        const notificationsData = notifications.map((item) => ({
          ...item,
          data: JSON.parse(item.data.replace(/'/g, '"')),
        }));

        setNotificationsList(
          notificationsData.filter(
            (item) => item.data?.flag !== "announcement",
          ),
        );
        setAnnouncementsList(
          notificationsData.filter(
            (item) => item.data?.flag === "announcement",
          ),
        );
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [dispatch]);

  // const handleTabChange = (direction) => {
  //   const newIndex =
  //     direction === "next"
  //       ? Math.min(+activeTab + 1, tabItems.length - 1)
  //       : Math.max(+activeTab - 1, 0);
  //   setActiveTab(String(newIndex));
  //   tabsListRef.current.scrollBy({
  //     left: direction === "next" ? 50 : -50,
  //     behavior: "smooth",
  //   });
  // };

  const notificationsToDisplay =
    activeTab === "1" ? announcementsList : notificationsList;

  // const notification_for_badge_count =
  //   activeTab === "0" ? announcementsList : notificationsList;

  // const notification_count = notification_for_badge_count.filter(
  //   (n) => !n.deleted && n.unread,
  // ).length;

  // sortMap is an object that maps sorting categories to sorting functions.
  const sortedNotifications = useMemo(() => {
    const sortMap = {
      "Most Recent": (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
      Tags: (a, b) => a.data.module.localeCompare(b.data.module),
      Title: (a, b) => a.verb.localeCompare(b.verb),
    };
    return [...notificationsToDisplay].sort(sortMap[sortedBy]);
  }, [sortedBy, notificationsToDisplay]);

  const markAsRead = async (notifId) => {
    const token = localStorage.getItem("authToken");
    try {
      setRead_Loading(notifId);
      const response = await axios.post(
        notificationReadRoute,
        { id: notifId },
        { headers: { Authorization: `Token ${token}` } },
      );
      if (response.status === 200) {
        setNotificationsList((prev) =>
          prev.map((notif) =>
            notif.id === notifId ? { ...notif, unread: false } : notif,
          ),
        );
        setAnnouncementsList((prev) =>
          prev.map((notif) =>
            notif.id === notifId ? { ...notif, unread: false } : notif,
          ),
        );
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    } finally {
      setRead_Loading(-1);
    }
  };

  const markAsUnread = async (notifId) => {
    const token = localStorage.getItem("authToken");
    try {
      setRead_Loading(notifId);
      const response = await axios.post(
        notificationUnreadRoute,
        { id: notifId },
        { headers: { Authorization: `Token ${token}` } },
      );
      if (response.status === 200) {
        setNotificationsList((prev) =>
          prev.map((notif) =>
            notif.id === notifId ? { ...notif, unread: true } : notif,
          ),
        );
        setAnnouncementsList((prev) =>
          prev.map((notif) =>
            notif.id === notifId ? { ...notif, unread: true } : notif,
          ),
        );
      }
    } catch (err) {
      console.error("Error marking notification as unread:", err);
    } finally {
      setRead_Loading(-1);
    }
  };

  const deleteNotification = async (notifId) => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.post(
        notificationDeleteRoute,
        { id: notifId },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );

      if (response.status === 200) {
        setNotificationsList((prev) =>
          prev.filter((notif) => notif.id !== notifId),
        );
        setAnnouncementsList((prev) =>
          prev.filter((notif) => notif.id !== notifId),
        );

        console.log("Notification deleted successfully");
      }
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  return (
    <>
      <CustomBreadcrumbs />
      <Flex
        justify="space-between"
        align={{ base: "start", sm: "center" }}
        mt="lg"
        direction={{ base: "column", sm: "row" }}
      >
        {/* <Flex
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
                {tabItems.map((item, index) => (
                  <Tabs.Tab
                    value={`${index}`}
                    key={index}
                    className={
                      activeTab === `${index}`
                        ? classes.fusionActiveRecentTab
                        : ""
                    }
                  >
                    <Flex gap="4px">
                      <Text>{item.title}</Text>
                      {activeTab !== index.toString() && (
                        <Badge
                          color={notification_count === 0 ? "grey" : "blue"}
                          size="sm"
                          p={6}
                        >
                          {notification_count}
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
              className={classes.fusionCaretCircleIcon}
              weight="light"
            />
          </Button>
        </Flex> */}

        <ModuleTabs
          tabs={tabItems}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          badges={badges}
        />

        <Flex
          w={{ base: "40%", sm: "auto" }}
          align="center"
          mt="md"
          rowGap="1rem"
          columnGap="4rem"
          wrap="wrap"
        >
          <Select
            classNames={{
              option: classes.selectoptions,
              input: classes.selectinputs,
            }}
            variant="filled"
            leftSection={<SortAscending />}
            data={categories}
            value={sortedBy}
            onChange={setSortedBy}
            placeholder="Sort By"
          />
        </Flex>
      </Flex>
      <Grid mt="xl">
        {loading ? (
          <Container py="xl">
            <Loader size="lg" />
          </Container>
        ) : sortedNotifications.filter((notification) => !notification.deleted)
            .length === 0 ? (
          <Empty />
        ) : (
          sortedNotifications
            .filter((notification) => !notification.deleted)
            .map((notification) => (
              <NotificationItem
                notification={notification}
                key={notification.id}
                markAsRead={markAsRead}
                markAsUnread={markAsUnread}
                deleteNotification={deleteNotification}
                loading={read_Loading}
              />
            ))
        )}
      </Grid>
    </>
  );
}

export default Dashboard;

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.number.isRequired,
    verb: PropTypes.string.isRequired,
    description: PropTypes.string,
    timestamp: PropTypes.string.isRequired,
    data: PropTypes.shape({
      module: PropTypes.string,
      flag: PropTypes.string,
    }),
    unread: PropTypes.bool.isRequired,
  }).isRequired,
  markAsRead: PropTypes.func.isRequired,
  markAsUnread: PropTypes.func.isRequired,
  deleteNotification: PropTypes.func.isRequired,
  loading: PropTypes.number.isRequired,
};
