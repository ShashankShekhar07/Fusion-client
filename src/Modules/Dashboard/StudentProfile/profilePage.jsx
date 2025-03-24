import { Stack, Text, Card, Image, Flex, Box } from "@mantine/core";
import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import CustomBreadcrumbs from "../../../components/Breadcrumbs";
import ModuleTabs from "../../../components/moduleTabs";
import avatarImage from "../../../assets/avatar.png";
import ProfileComponent from "./profileComponent";
import SkillsTechComponent from "./skillsComponent";
import AchievementsComponent from "./achievementsComponent";
import WorkExperienceComponent from "./workExperienceComponent";
import EducationCoursesComponent from "./educationCoursesComponent";
import { getProfileDataRoute } from "../../../routes/dashboardRoutes";

function InfoCard({ data }) {
  return (
    <Card withBorder shadow="sm" radius="md" w={300}>
      <Card.Section>
        <Image src={avatarImage} h={300} />
      </Card.Section>

      <Card.Section pl="md" mt="sm">
        <Text fw={500} size="md">
          {data.current[0].user.first_name}
        </Text>
        <Text fw={500} size="md" c="dimmed">
          {data.current[0].user.username}
        </Text>
      </Card.Section>
      <Card.Section pl="md" mt="sm">
        <Text fw={500} size="md">
          {data.profile.department.name} - 20
          {data.current[0].user.username.slice(0, 2)}
        </Text>
        <Text fw={500} size="md">
          Sem - {data.semester_no}
        </Text>
      </Card.Section>
      <Text mt="xs" c="dimmed" size="sm">
        Student
      </Text>
    </Card>
  );
}

function Profile() {
  const [activeTab, setActiveTab] = useState("0");
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem("authToken");
      if (!token) return console.error("No authentication token found!");
      try {
        const response = await axios.get(getProfileDataRoute, {
          headers: { Authorization: `Token ${token}` },
        });
        setProfileData(response.data);
      } catch (err) {
        setError("Error fetching profile data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  console.log(profileData);

  const tabItems = [
    { title: "Profile" },
    { title: "Skills & Technologies" },
    { title: "Education & Courses" },
    { title: "Work Experience" },
    { title: "Achievements" },
  ];
  const tabToDisplay = [
    <ProfileComponent data={profileData} />,
    <SkillsTechComponent data={profileData?.skills} />,
    <EducationCoursesComponent
      education={profileData?.education}
      courses={profileData?.course}
    />,
    <WorkExperienceComponent
      experience={profileData?.experience}
      project={profileData?.project}
    />,
    <AchievementsComponent achievements={profileData?.achievement} />,
  ];

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Stack>
      <CustomBreadcrumbs />
      <ModuleTabs
        tabs={tabItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        badges={[]}
      />
      <Flex
        align="flex-start"
        justify="space-evenly"
        pr={{ base: "0rem", sm: "2rem" }}
        mt="1rem"
      >
        {tabToDisplay[activeTab]}
        <Box visibleFrom="sm">
          <InfoCard data={profileData} />
        </Box>
      </Flex>
    </Stack>
  );
}

InfoCard.propTypes = {
  data: PropTypes.shape({
    semester_no: PropTypes.number,
    current: PropTypes.arrayOf(
      PropTypes.shape({
        user: PropTypes.shape({
          first_name: PropTypes.string,
          username: PropTypes.string,
        }),
      }),
    ),
    profile: PropTypes.shape({
      department: PropTypes.shape({
        name: PropTypes.string,
      }),
    }),
  }).isRequired,
};

export default Profile;
