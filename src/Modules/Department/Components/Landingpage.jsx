import React, { lazy, Suspense, useState, useEffect } from "react";
import {
  Container,
  Grid,
  Menu,
  Button,
  Group,
  Title,
  Loader,
  Text,
} from "@mantine/core";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import axios from "axios";
import { host } from "../../../routes/globalRoutes";

// Lazy load components
const MakeAnnouncement = lazy(() => import("./MakeAnnouncement"));
const BrowseAnnouncements = lazy(() => import("./BrowseAnnouncements"));
const FeedbackForm = lazy(() => import("./FeedbackForm"));
const DeptTabs = lazy(() => import("./DeptTabs"));

const departments = [
  { title: "CSE Department", id: "3", code: "CSE" },
  { title: "ECE Department", id: "4", code: "ECE" },
  { title: "ME Department", id: "5", code: "ME" },
  { title: "SM Department", id: "6", code: "SM" },
  { title: "Design Department", id: "7", code: "DS" },
  { title: "Liberal Arts Department", id: "8", code: "LA" },
  { title: "NaturalScience", id: "9", code: "NS" },
];

export default function LandingPage() {
  const [role, setRole] = useState(null);
  const [branch, setBranch] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDepartment = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await axios.get(`${host}/dep/api/dep-main/`, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });
        const { user_designation, department } = response.data;
        setLoading(false);
        setRole(user_designation);
        setBranch(department);
        const deptTab = departments.find((d) => d.code === department)?.id;
        setActiveTab(deptTab || "3");
      } catch (err) {
        console.error("Error fetching user department:", err);
        setLoading(false);
        setError("Failed to fetch department data");
      }
    };
    fetchUserDepartment();
  }, []);

  const renderTabContent = () => (
    <Suspense fallback={<Loader />}>
      {activeTab === "0" && <MakeAnnouncement />}
      {activeTab === "1" && <BrowseAnnouncements />}
      {activeTab === "2" && <FeedbackForm branch={branch} />}
      {departments.map((dept) =>
        activeTab === dept.id ? (
          <DeptTabs key={dept.id} branch={dept.code} initialTab="about" />
        ) : null,
      )}
    </Suspense>
  );

  if (loading) return <Loader />;
  if (error) return <Text color="red">{error}</Text>;

  const currentDept = departments.find((d) => d.code === branch);

  return (
    <Container fluid>
      <Grid>
        <Grid.Col span={12}>
          <Group
            position="apart"
            align="center"
            mb="lg"
            style={{ flexWrap: "nowrap" }}
          >
            <Title order={2}>Department Portal</Title>
            <Group spacing="sm" style={{ marginLeft: "auto" }}>
              {role !== "student" && (
                <>
                  <Button
                    variant={activeTab === "0" ? "filled" : "light"}
                    onClick={() => setActiveTab("0")}
                  >
                    Make Announcement
                  </Button>
                  <Button
                    variant={activeTab === "1" ? "filled" : "light"}
                    onClick={() => setActiveTab("1")}
                  >
                    Browse Announcements
                  </Button>
                </>
              )}
              <Button
                variant={activeTab === "2" ? "filled" : "light"}
                onClick={() => setActiveTab("2")}
              >
                Provide Feedback
              </Button>
              <Menu position="bottom-end" withinPortal>
                <Menu.Target>
                  <Button
                    variant="subtle"
                    style={{ marginRight: "50px", fontSize: "16px" }}
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                  >
                    {currentDept?.title || "Select Department"}
                    {isDropdownOpen ? (
                      <CaretUp size={20} style={{ marginLeft: "10px" }} />
                    ) : (
                      <CaretDown size={20} style={{ marginLeft: "10px" }} />
                    )}
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  {departments.map((dept) => (
                    <Menu.Item
                      key={dept.id}
                      onClick={() => {
                        setActiveTab(dept.id);
                        setIsDropdownOpen(false);
                      }}
                      fw={activeTab === dept.id ? 700 : 400}
                    >
                      {dept.title}
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>
        </Grid.Col>
        <Grid.Col span={12}>
          {activeTab !== null ? (
            renderTabContent()
          ) : (
            <Text>Select a department or action to view content</Text>
          )}
        </Grid.Col>
      </Grid>
    </Container>
  );
}
