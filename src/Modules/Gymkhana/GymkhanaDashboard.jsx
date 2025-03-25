import { useState, Suspense, lazy, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Box, Paper, Select, Group, Text } from "@mantine/core";
import dayjs from "dayjs";
import { useMediaQuery } from "@mantine/hooks";
import ModuleTabs from "../../components/moduleTabs";
import { setActiveTab_ } from "../../redux/moduleslice";

import ClubFilter from "./calender/ClubFilter";
import DateSelector from "./calender/DateSelector";
import EventCalendar from "./calender/EventCalender";
import EventCard from "./calender/EventCard";

import {
  useGetClubMembers,
  useGetData,
  useGetPastEvents,
  useGetUpcomingEvents,
  useGetClubAcheivement,
  useGetFests,
} from "./BackendLogic/ApiRoutes";

const CustomTable = lazy(() => import("./CustomTable"));
const ClubViewComponent = lazy(() => import("./ClubViewComponent"));

function GymkhanaDashboard() {
  const isMobile = useMediaQuery(`(max-width: 750px)`);
  const token = localStorage.getItem("authToken");
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("0");
  const [value, setValue] = useState("Select a Club");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedClub, setSelectedClub] = useState("All Clubs");
  const tabs = [
    { title: "Clubs" },
    { title: "Calendar" },
    { title: "Fests" },
    { title: "Events" },
  ];
  const badges = []; // Add badge data if needed

  const { data: upcomingEvents } = useGetUpcomingEvents(token);
  const { data: pastEvents } = useGetPastEvents(token);
  const { data: fests } = useGetFests(token);
  const { data: clubMembers, refetch: refetchClubMembers } = useGetClubMembers(
    value,
    token,
  );
  // eslint-disable-next-line no-unused-vars
  const { data: clubDetails, refetch: refetchClubDetail } = useGetData(
    value,
    token,
  );
  const { data: Acheivements, refetch: refetchAcheivements } =
    useGetClubAcheivement(value, token);
  // Use useEffect to refetch data when `value` (selected club) changes
  useEffect(() => {
    if (value && value !== "Select a Club") {
      refetchClubMembers(); // Trigger refetch of club members
      refetchClubDetail();
      refetchAcheivements(); // Trigger refetch of club details
    }
  }, [value, refetchClubMembers, refetchClubDetail]);

  return (
    <>
      <ModuleTabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(String(tab));
          dispatch(setActiveTab_(tabs[tab].title)); // Dispatch the Redux action if necessary
        }}
        badges={badges}
      />
      {activeTab === "0" && (
        <Box
          mt={{ base: "5px", sm: "30px" }}
          mx={{ base: "5px", sm: "30px" }}
          px={{ base: "5px", sm: "30px" }}
          mb={{ base: "xs", sm: "30px" }}
          w="90vw"
        >
          <Group justify="end" mb="5px" mr="110px">
            <Select
              data={["BitByte", "AFC"]}
              value={value}
              placeholder="Select a Club"
              onChange={setValue}
              w="220px"
            />
          </Group>
          {value === "Select a Club" ? (
            <Paper
              shadow="md"
              p="xl"
              h="80vh"
              w="80vw"
              ml="20px"
              style={{ overflow: "scroll" }}
            >
              {/* Club Information Content */}
              <Box w="70vw">
                <h4>Brief Information regarding Clubs...</h4>
                <Text mt="5px" size={isMobile ? "sm" : "md"}>
                  <span style={{ fontWeight: 900 }}>Clubs Cultural Club:</span>
                  The Institute has vibrant Cultural Clubs that provide a
                  platform for students to showcase their creativity and talent.
                  talent. There are six clubs associated with our cultural
                  fraternity, namely: (i) Saaz (Music Club), (ii) Jazbaat
                  (Dramatics Society Club), (iii) Aavartan (Dance Club), (iv)
                  Abhivayakti (Arts & Craft Club), (v) Aakrti (The Film Making &
                  Photography Club), and (vi) Samvaad (Literature & Quizzing
                  Society Club). The activities of the cultural committee are
                  largely student-driven with proper guidance from faculty
                  members. These clubs are active throughout the year. Besides
                  helping students in honing their talent and skills, they
                  organize their respective annual festivals.
                </Text>
                <Text mt="5px" size={isMobile ? "sm" : "md"}>
                  <span style={{ fontWeight: 900 }}>
                    Science & Technology Club
                  </span>
                  :There are in all 7 different Science and Technology Clubs
                  which are mentored separately by Faculty Members. Since the
                  inception of the Institute, the technical fest “Abhikalpan”
                  held annually is a popular event among different colleges of
                  Jabalpur and the surrounding regions. Apart from that,
                  Hackathon, Racing, Programming, Electronics, 3D priniting,
                  Business and Management, Fabrication and Astronomy related
                  events are organized throughout the year.
                </Text>
                <Text mt="5px" size={isMobile ? "sm" : "md"}>
                  <span style={{ fontWeight: 900 }}>Sports Club:</span>Sports
                  and games play a major role in keeping a person fit and fine.
                  Sports in general inculcates, team work, mental strength and
                  physical fitness along with ethics, respect to the opponent,
                  fair play in real life aspects as well. Truly said! At IIITDM
                  Jabalpur, we provide facilities for students to experience
                  “above and beyond” academic experience, to maintain their
                  physical fitness and to excel as a bright student. IIITDM
                  Jabalpur has excellent infrastructure facilities for both
                  outdoor and indoor games and sports. The outdoor games include
                  Volley Ball, Foot Ball, and Cricket, Lawn Tennis, Basket Ball
                  and Athletic ground. A Flood light facility is provided for
                  outdoor games like volleyball, lawn tennis, basketball and
                  Football. The Indoor-Students Activity Center (SAC) provides
                  the following facilities: Shuttle Badminton, Chess, Caroms and
                  Table Tennis with wooden flooring, and other multi-Gyms
                  activities. We are preparing students by organizing intramural
                  and extramural competitions. We encourage student
                  participation in inter-collegiate, inter-IIIT and other open
                  tournaments across the country.
                </Text>
              </Box>
            </Paper>
          ) : (
            <Suspense fallback={<div>Loading .......</div>}>
              {upcomingEvents && Acheivements && clubMembers && (
                <ClubViewComponent
                  // AboutClub={clubDetail.details}
                  clubName={value}
                  membersData={clubMembers}
                  achievementsData={Acheivements}
                  eventsData={[...upcomingEvents, ...pastEvents]
                    .filter((item) => {
                      if (item.club === value && item.status === "ACCEPT")
                        return true;
                      return false;
                    })
                    .sort((a, b) => a.end_date < b.end_date)}
                  membersColumns={[
                    {
                      accessorKey: "club", // Key in your data object
                      header: "Club", // Column header name
                    },
                    { accessorKey: "description", header: "Description" },

                    { accessorKey: "member", header: "Member" },
                    { accessorKey: "remarks", header: "Remarks" },
                    { accessorKey: "status", header: "Status" },
                  ]}
                  achievementsColumns={[
                    { accessorKey: "title", header: "Title" },
                    { accessorKey: "achievement", header: "Acheivement" },
                  ]}
                  eventsColumns={[
                    { accessorKey: "club", header: "Club" },
                    { accessorKey: "event_name", header: "Event Name" },
                    { accessorKey: "incharge", header: "Incharge" },
                    { accessorKey: "venue", header: "Venue" },
                    {
                      accessorKey: "start_date",
                      header: "Start Date",
                      render: (data) =>
                        new Date(data.start_date).toLocaleDateString(), // optional formatting
                    },
                    {
                      accessorKey: "end_date",
                      header: "End Date",
                      render: (data) =>
                        new Date(data.end_date).toLocaleDateString(), // optional formatting
                    },
                    {
                      accessorKey: "start_time",
                      header: "Start Time",
                      render: (data) => data.start_time.substring(0, 5), // optional formatting (HH:MM)
                    },

                    { accessorKey: "details", header: "Details" },
                  ]}
                />
              )}
            </Suspense>
          )}
        </Box>
      )}
      {activeTab === "1" && (
        <Box>
          {pastEvents && upcomingEvents && (
            <Box
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                height: "100%",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              {/* Left Section */}
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "50px",
                  paddingTop: "35px",
                  boxSizing: "border-box",
                }}
              >
                <DateSelector
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                />
                <EventCard
                  events={[...pastEvents, ...upcomingEvents]
                    .filter((event) =>
                      dayjs(event.start_date).isSame(selectedDate, "day"),
                    )
                    .filter((event) => {
                      if (event.status === "ACCEPT") return true;
                      return false;
                    })}
                />
              </Box>

              {/* Right Section */}
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "center",
                    overflow: "auto",
                  }}
                >
                  <h2>{dayjs(selectedDate).format("MMMM YYYY")}</h2>
                  <ClubFilter
                    selectedClub={selectedClub}
                    setSelectedClub={setSelectedClub}
                  />
                </div>
                <EventCalendar
                  selectedDate={selectedDate}
                  selectedClub={selectedClub}
                  events={[...pastEvents, ...upcomingEvents].filter((event) => {
                    if (event.status === "ACCEPT") return true;
                    return false;
                  })}
                />
              </Box>
            </Box>
          )}
        </Box>
      )}
      {activeTab === "2" && (
        <Box mt="10px" mx="0" my="xs">
          <Suspense fallback={<div>Loading Fests Table...</div>}>
            <CustomTable
              data={fests}
              columns={[
                { accessorKey: "id", header: "ID" },
                { accessorKey: "name", header: "Name" },
                { accessorKey: "category", header: "Category" },
                { accessorKey: "description", header: "Description" },
                { accessorKey: "date", header: "Date" },
                { accessorKey: "link", header: "Link" },
              ]}
              TableName="Fests"
            />
          </Suspense>
          {/* Need to make a page where we have previous Fests listed in a Table */}
        </Box>
      )}
      {activeTab === "3" && (
        <Box mt="10px">
          <Box>
            <Suspense fallback={<div>Loading Events Table for you ...</div>}>
              {upcomingEvents && (
                <CustomTable
                  data={upcomingEvents}
                  columns={[
                    { accessorKey: "club", header: "Club" },
                    { accessorKey: "event_name", header: "Event Name" },
                    { accessorKey: "incharge", header: "Incharge" },
                    { accessorKey: "venue", header: "Venue" },
                    {
                      accessorKey: "start_date",
                      header: "Start Date",
                      render: (data) =>
                        new Date(data.start_date).toLocaleDateString(),
                    },
                    {
                      accessorKey: "end_date",
                      header: "End Date",
                      render: (data) =>
                        new Date(data.end_date).toLocaleDateString(),
                    },
                    {
                      accessorKey: "start_time",
                      header: "Start Time",
                      render: (data) => data.start_time.substring(0, 5),
                    },
                    { accessorKey: "details", header: "Details" },
                  ]}
                  TableName="Upcoming Events"
                />
              )}
            </Suspense>
          </Box>
          <Box>
            <Suspense fallback={<div>Loading Events Table for you ...</div>}>
              {pastEvents && (
                <CustomTable
                  data={pastEvents}
                  columns={[
                    { accessorKey: "club", header: "Club" },
                    { accessorKey: "event_name", header: "Event Name" },
                    { accessorKey: "incharge", header: "Incharge" },
                    { accessorKey: "venue", header: "Venue" },
                    {
                      accessorKey: "start_date",
                      header: "Start Date",
                      render: (data) =>
                        new Date(data.start_date).toLocaleDateString(),
                    },
                    {
                      accessorKey: "end_date",
                      header: "End Date",
                      render: (data) =>
                        new Date(data.end_date).toLocaleDateString(),
                    },
                    {
                      accessorKey: "start_time",
                      header: "Start Time",
                      render: (data) => data.start_time.substring(0, 5),
                    },
                    { accessorKey: "details", header: "Details" },
                  ]}
                  TableName="Past Events"
                />
              )}
            </Suspense>
          </Box>
        </Box>
      )}
    </>
  );
}

export default GymkhanaDashboard;
