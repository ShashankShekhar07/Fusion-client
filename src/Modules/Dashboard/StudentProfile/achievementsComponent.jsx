import { useState } from "react";
import PropTypes from "prop-types";
import {
  Flex,
  Input,
  Divider,
  Text,
  Button,
  Select,
  Textarea,
  Table,
} from "@mantine/core";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import { updateProfileDataRoute } from "../../../routes/dashboardRoutes";

function AchievementsComponent({ achievements }) {
  const [achievement, setAchievement] = useState({
    skill: "",
    type: "Educational",
    date: "",
    issuer: "",
    description: "",
  });

  const handleChange = (field, value) => {
    setAchievement((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(
        updateProfileDataRoute,
        {
          achievementsubmit: {
            skill: achievement.skill,
            type: achievement.type,
            date: achievement.date,
            issuer: achievement.issuer,
            description: achievement.description,
          },
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        },
      );
      console.log(response);

      notifications.show({
        message: "Achievement added successfully!",
        color: "green",
      });
    } catch (error) {
      alert("Error adding achievement");
    }
  };

  console.log(achievements);

  return (
    <Flex
      w={{ base: "100%", sm: "60%" }}
      p="md"
      h="auto"
      style={{ border: "1px solid lightgray", borderRadius: "5px" }}
      direction="column"
      justify="space-evenly"
    >
      <Flex
        w="100%"
        p="md"
        direction="column"
        style={{ border: "1px solid lightgray", borderRadius: "5px" }}
      >
        <Text fw={500} size="1.2rem">
          Achievements
        </Text>
        <Divider my="md" />
        <Flex w="100%" direction="column">
          <Text fw={500} mb="md">
            Add a new achievement
          </Text>
          <Flex align="center" justify="space-between" mb="md">
            <Input.Wrapper label="Achievement name" w="65%">
              <Input
                size="md"
                mt="xs"
                value={achievement.skill}
                onChange={(e) => handleChange("skill", e.target.value)}
              />
            </Input.Wrapper>
            <Input.Wrapper label="Type" w="30%">
              <Select
                size="md"
                mt="xs"
                data={["Educational", "Other"]}
                value={achievement.type}
                onChange={(value) => handleChange("type", value)}
              />
            </Input.Wrapper>
          </Flex>
          <Flex align="center" justify="space-between" mb="md">
            <Input.Wrapper label="Date" w={{ base: "45%", sm: "30%" }}>
              <Input
                type="date"
                size="md"
                mt="xs"
                value={achievement.date}
                onChange={(e) => handleChange("date", e.target.value)}
              />
            </Input.Wrapper>
            <Input.Wrapper label="Issuer" w={{ base: "50%", sm: "65%" }}>
              <Input
                size="md"
                mt="xs"
                value={achievement.issuer}
                onChange={(e) => handleChange("issuer", e.target.value)}
              />
            </Input.Wrapper>
          </Flex>
          <Flex
            align="center"
            gap={{ base: "md", sm: "lg" }}
            justify="space-between"
            direction={{ base: "column" }}
          >
            <Input.Wrapper label="Description" w={{ base: "100%" }}>
              <Textarea
                autosize
                minRows={5}
                resize="vertical"
                mt="xs"
                value={achievement.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </Input.Wrapper>
            <Button
              size="md"
              style={{
                base: { alignSelf: "flex-center" },
                sm: { alignSelf: "flex-end" },
              }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Flex>
        </Flex>
        <Divider my="md" />
        <Text fw={500} mb="md">
          Your Achievements
        </Text>
        <Divider my="md" />
        {achievements.length > 0 ? (
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ textAlign: "center" }}>Type</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>Date</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>Issuer</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>Description</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {achievements.map((ach, index) => (
                <Table.Tr key={index}>
                  <Table.Td style={{ textAlign: "center" }}>
                    {ach.achievement_type}
                  </Table.Td>
                  <Table.Td style={{ textAlign: "center" }}>
                    {ach.date_earned}
                  </Table.Td>
                  <Table.Td style={{ textAlign: "center" }}>
                    {ach.issuer}
                  </Table.Td>
                  <Table.Td style={{ textAlign: "center" }}>
                    {ach.description}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        ) : (
          <Text>No achievements added yet.</Text>
        )}
      </Flex>
    </Flex>
  );
}

AchievementsComponent.propTypes = {
  achievements: PropTypes.arrayOf(
    PropTypes.shape({
      skill: PropTypes.string,
      type: PropTypes.string,
      date: PropTypes.string,
      issuer: PropTypes.string,
      description: PropTypes.string,
    }),
  ),
};

export default AchievementsComponent;
