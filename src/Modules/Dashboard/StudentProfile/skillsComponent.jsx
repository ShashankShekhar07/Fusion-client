import { useState } from "react";
import PropTypes from "prop-types";
import {
  Text,
  Button,
  Input,
  Flex,
  Divider,
  NumberInput,
  Table,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { updateProfileDataRoute } from "../../../routes/dashboardRoutes";

function SkillsTechComponent({ data }) {
  const [skills, setSkills] = useState(data || []);
  const [newSkill, setNewSkill] = useState("");
  const [rating, setRating] = useState(0);

  const updateSkills = async () => {
    if (!newSkill.trim()) {
      notifications.show({
        title: "Error",
        message: "Skill name cannot be empty!",
        color: "red",
      });
      return;
    }

    if (rating < 0 || rating > 5) {
      notifications.show({
        title: "Error",
        message: "Rating must be between 0 and 5",
        color: "red",
      });
      return;
    }

    const newSkillEntry = {
      skillsubmit: {
        skill_id: {
          skill_name: newSkill,
        },
        skill_rating: rating,
      },
    };

    try {
      await axios.put(updateProfileDataRoute, newSkillEntry, {
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
      });

      setSkills([...skills, { skill_name: newSkill, skill_rating: rating }]);
      setNewSkill("");
      setRating(0);
      notifications.show({
        title: "Success",
        message: "Skill added successfully!",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to update skills. Please try again.",
        color: "red",
      });
    }
  };

  console.log(skills);

  return (
    <Flex
      w={{ base: "100%", sm: "60%" }}
      p="md"
      h="auto"
      style={{ border: "1px solid lightgray", borderRadius: "5px" }}
      direction="column"
      justify="space-evenly"
    >
      {/* Add Skill Section */}
      <Flex
        w="100%"
        p="md"
        direction="column"
        style={{ border: "1px solid lightgray", borderRadius: "5px" }}
      >
        <Text fw={500} size="1.2rem">
          Skills & Technologies
        </Text>
        <Divider my="md" />
        <Flex w="100%" direction="column">
          <Text fw={500} mb="lg">
            Add New Skill/Technology
          </Text>
          <Flex
            align="center"
            justify="space-between"
            direction={{ base: "column", sm: "row" }}
          >
            <Input.Wrapper
              label="Skill/Technology"
              w={{ base: "100%", sm: "50%" }}
            >
              <Input
                size="md"
                mt="xs"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
              />
            </Input.Wrapper>
            <Input.Wrapper label="Rating" w={{ base: "100%", sm: "30%" }}>
              <NumberInput
                mt="xs"
                min={0}
                max={5}
                clampBehavior="strict"
                value={rating}
                onChange={setRating}
              />
            </Input.Wrapper>
            <Button mt="xl" onClick={updateSkills}>
              Add
            </Button>
          </Flex>
        </Flex>
      </Flex>

      {/* Display Skills Section */}
      <Flex
        w="100%"
        p="md"
        direction="column"
        style={{ border: "1px solid lightgray", borderRadius: "5px" }}
      >
        <Text fw={500} size="1.2rem">
          Your Skills
        </Text>
        <Divider my="md" />
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Skill</Table.Th>
              <Table.Th>Rating</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {skills.length > 0 ? (
              skills.map((skill, index) => (
                <Table.Tr key={index}>
                  <Table.Td>{skill.skill_name}</Table.Td>
                  <Table.Td>{skill.skill_rating}</Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={2} align="center">
                  No skills added yet
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Flex>
    </Flex>
  );
}

SkillsTechComponent.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      skill_name: PropTypes.string.isRequired,
      skill_rating: PropTypes.number.isRequired,
    }),
  ),
};

export default SkillsTechComponent;
