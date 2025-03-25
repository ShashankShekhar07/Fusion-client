import { useState } from "react";
import PropTypes from "prop-types";
import {
  Flex,
  Input,
  Tabs,
  Text,
  Button,
  Select,
  Table,
  Textarea,
  Divider,
} from "@mantine/core";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import { updateProfileDataRoute } from "../../../routes/dashboardRoutes";

function InternshipsTab({ internshipsData }) {
  const [formData, setFormData] = useState({
    organization: "",
    location: "",
    job_title: "",
    status: "ONGOING",
    start_date: "",
    end_date: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.put(
        updateProfileDataRoute,
        { experiencesubmit: formData },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        },
      );
      notifications.show({
        message: "Internship Added Successfully!",
        color: "green",
      });
      setFormData({
        organization: "",
        location: "",
        job_title: "",
        status: "ONGOING",
        start_date: "",
        end_date: "",
        description: "",
      });
    } catch (error) {
      notifications.show({
        message: "Failed! Please try later.",
        color: "red",
      });
      console.error("Error updating internships:", error);
    }
  };

  return (
    <Flex
      w="100%"
      p="md"
      direction="column"
      style={{ border: "1px solid lightgray", borderRadius: "5px" }}
    >
      <Text fw={500} mb="md">
        Add a New Internship
      </Text>
      <Flex align="center" justify="space-between" mb="md">
        <Input.Wrapper label="Organization Name" w="65%">
          <Input
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            size="md"
            mt="xs"
          />
        </Input.Wrapper>
        <Input.Wrapper label="Location" w="30%">
          <Input
            name="location"
            value={formData.location}
            onChange={handleChange}
            size="md"
            mt="xs"
          />
        </Input.Wrapper>
      </Flex>
      <Flex align="center" justify="space-between" mb="md">
        <Input.Wrapper label="Job Profile Title" w="65%">
          <Input
            name="job_title"
            value={formData.job_title}
            onChange={handleChange}
            size="md"
            mt="xs"
          />
        </Input.Wrapper>
        <Input.Wrapper label="Status" w="30%">
          <Select
            name="status"
            data={["ONGOING", "COMPLETED"]}
            value={formData.status}
            onChange={(value) => setFormData({ ...formData, status: value })}
            size="md"
            mt="xs"
          />
        </Input.Wrapper>
      </Flex>
      <Flex align="center" justify="space-between" mb="md">
        <Input.Wrapper label="Start Date" w="48%">
          <Input
            name="start_date"
            type="date"
            value={formData.start_date}
            onChange={handleChange}
            size="md"
            mt="xs"
          />
        </Input.Wrapper>
        <Input.Wrapper label="End Date" w="48%">
          <Input
            name="end_date"
            type="date"
            value={formData.end_date}
            onChange={handleChange}
            size="md"
            mt="xs"
          />
        </Input.Wrapper>
      </Flex>
      <Input.Wrapper label="Description" w="100%">
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          autosize
          minRows={5}
          resize="vertical"
          mt="xs"
        />
      </Input.Wrapper>
      <Button onClick={handleSubmit} size="md" mt="lg">
        Submit
      </Button>
      <Divider my="md" />
      <Text fw={500} mb="md">
        Your Experience
      </Text>

      {internshipsData.length > 0 ? (
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Organization</Table.Th>
              <Table.Th>Location</Table.Th>
              <Table.Th>Job Title</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Start Date</Table.Th>
              <Table.Th>End Date</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {internshipsData.map((internship, index) => (
              <Table.Tr key={index}>
                <Table.Td style={{ textAlign: "center" }}>
                  {internship.organization}
                </Table.Td>
                <Table.Td style={{ textAlign: "center" }}>
                  {internship.location}
                </Table.Td>
                <Table.Td style={{ textAlign: "center" }}>
                  {internship.job_title}
                </Table.Td>
                <Table.Td style={{ textAlign: "center" }}>
                  {internship.status}
                </Table.Td>
                <Table.Td style={{ textAlign: "center" }}>
                  {internship.sdate}
                </Table.Td>
                <Table.Td style={{ textAlign: "center" }}>
                  {internship.edate}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      ) : (
        <Text mt="lg" style={{ textAlign: "center" }}>
          No data found!
        </Text>
      )}
    </Flex>
  );
}

function ProjectsTab({ projectsData }) {
  const [formData, setFormData] = useState({
    project_name: "",
    status: "ONGOING",
    project_link: "",
    start_date: "",
    end_date: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.put(
        updateProfileDataRoute,
        { projectsubmit: formData },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        },
      );
      notifications.show({
        message: "Project Added Successfully!",
        color: "green",
      });
      setFormData({
        project_name: "",
        status: "ONGOING",
        project_link: "",
        start_date: "",
        end_date: "",
        description: "",
      });
    } catch (error) {
      notifications.show({
        message: "Failed! Please try later.",
        color: "red",
      });
      console.error("Error updating projects:", error);
    }
  };

  return (
    <Flex
      w="100%"
      p="md"
      direction="column"
      style={{ border: "1px solid lightgray", borderRadius: "5px" }}
    >
      <Text fw={500} mb="md">
        Add a New Project
      </Text>
      <Flex align="center" justify="space-between" mb="md">
        <Input.Wrapper label="Project Name" w="65%">
          <Input
            name="project_name"
            value={formData.project_name}
            onChange={handleChange}
            size="md"
            mt="xs"
          />
        </Input.Wrapper>
        <Input.Wrapper label="Status" w="30%">
          <Select
            name="status"
            data={["ONGOING", "COMPLETED"]}
            value={formData.status}
            onChange={(value) => setFormData({ ...formData, status: value })}
            size="md"
            mt="xs"
          />
        </Input.Wrapper>
      </Flex>
      <Input.Wrapper label="Project Link" w="100%" mb="md">
        <Input
          name="project_link"
          value={formData.project_link}
          onChange={handleChange}
          size="md"
          mt="xs"
        />
      </Input.Wrapper>
      <Flex align="center" justify="space-between" mb="md">
        <Input.Wrapper label="Start Date" w="48%">
          <Input
            name="start_date"
            type="date"
            value={formData.start_date}
            onChange={handleChange}
            size="md"
            mt="xs"
          />
        </Input.Wrapper>
        <Input.Wrapper label="End Date" w="48%">
          <Input
            name="end_date"
            type="date"
            value={formData.end_date}
            onChange={handleChange}
            size="md"
            mt="xs"
          />
        </Input.Wrapper>
      </Flex>
      <Input.Wrapper label="Description" w="100%" mb="md">
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          autosize
          minRows={5}
          resize="vertical"
          mt="xs"
        />
      </Input.Wrapper>
      <Button onClick={handleSubmit} size="md" mt="lg">
        Submit
      </Button>
      <Divider my="md" />
      <Text fw={500} mb="md">
        Your Projects
      </Text>
      {projectsData.length > 0 ? (
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Project Name</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Project Link</Table.Th>
              <Table.Th>Start Date</Table.Th>
              <Table.Th>End Date</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {projectsData.map((project, index) => (
              <Table.Tr key={index}>
                <Table.Td style={{ textAlign: "center" }}>
                  {project.project_name}
                </Table.Td>
                <Table.Td style={{ textAlign: "center" }}>
                  {project.status}
                </Table.Td>
                <Table.Td style={{ textAlign: "center" }}>
                  <a
                    href={project.project_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {project.project_link}
                  </a>
                </Table.Td>
                <Table.Td style={{ textAlign: "center" }}>
                  {project.start_date}
                </Table.Td>
                <Table.Td style={{ textAlign: "center" }}>
                  {project.end_date}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      ) : (
        <Text mt="lg" style={{ textAlign: "center" }}>
          No data found!
        </Text>
      )}
    </Flex>
  );
}

export default function WorkExperienceComponent({ experience, project }) {
  return (
    <Flex
      w={{ base: "100%", sm: "60%" }}
      p="md"
      h="auto"
      style={{ border: "1px solid lightgray", borderRadius: "5px" }}
      direction="column"
      justify="space-evenly"
    >
      <Tabs defaultValue="internships">
        <Tabs.List mb="sm">
          <Tabs.Tab value="internships">
            <Text fw={500} size="1.2rem">
              Internships
            </Text>
          </Tabs.Tab>
          <Tabs.Tab value="projects">
            <Text fw={500} size="1.2rem">
              Projects
            </Text>
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="internships">
          <InternshipsTab internshipsData={experience} />
        </Tabs.Panel>
        <Tabs.Panel value="projects">
          <ProjectsTab projectsData={project} />
        </Tabs.Panel>
      </Tabs>
    </Flex>
  );
}

WorkExperienceComponent.propTypes = {
  experience: PropTypes.arrayOf(
    PropTypes.shape({
      organization: PropTypes.string,
      location: PropTypes.string,
      job_title: PropTypes.string,
      status: PropTypes.string,
      start_date: PropTypes.string,
      end_date: PropTypes.string,
      description: PropTypes.string,
    }),
  ).isRequired,
  project: PropTypes.arrayOf(
    PropTypes.shape({
      project_name: PropTypes.string,
      status: PropTypes.string,
      project_link: PropTypes.string,
      start_date: PropTypes.string,
      end_date: PropTypes.string,
      description: PropTypes.string,
    }),
  ).isRequired,
};

InternshipsTab.propTypes = {
  internshipsData: PropTypes.arrayOf(
    PropTypes.shape({
      organization: PropTypes.string,
      location: PropTypes.string,
      job_title: PropTypes.string,
      status: PropTypes.string,
      start_date: PropTypes.string,
      end_date: PropTypes.string,
      description: PropTypes.string,
    }),
  ).isRequired,
};

ProjectsTab.propTypes = {
  projectsData: PropTypes.arrayOf(
    PropTypes.shape({
      project_name: PropTypes.string,
      status: PropTypes.string,
      project_link: PropTypes.string,
      start_date: PropTypes.string,
      end_date: PropTypes.string,
      description: PropTypes.string,
    }),
  ).isRequired,
};
