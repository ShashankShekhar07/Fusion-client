import { useState } from "react";
import PropTypes from "prop-types";
import {
  Flex,
  Input,
  Tabs,
  Text,
  Button,
  Textarea,
  Table,
  Divider,
} from "@mantine/core";
import { notifications, Notifications } from "@mantine/notifications";
import axios from "axios";
import { updateProfileDataRoute } from "../../../routes/dashboardRoutes";

function EducationTab({ educationData }) {
  const [formData, setFormData] = useState({
    degree: "",
    stream: "",
    institute: "",
    grade: "",
    start_date: "",
    end_date: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.put(
        updateProfileDataRoute,
        { education: formData },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        },
      );
      notifications.show({
        message: "Education Added Successfully!",
        color: "green",
      });
      setFormData({
        degree: "",
        stream: "",
        institute: "",
        grade: "",
        start_date: "",
        end_date: "",
      });
    } catch (error) {
      notifications.show({
        message: "Failed! Please try later.",
        color: "red",
      });
      console.error("Error updating education:", error);
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
        Add a New Educational Qualification
      </Text>
      <Flex align="center" justify="space-between" mb="md">
        <Input.Wrapper label="Degree" w="48%">
          <Input
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            size="md"
            mt="xs"
          />
        </Input.Wrapper>
        <Input.Wrapper label="Stream" w="48%">
          <Input
            name="stream"
            value={formData.stream}
            onChange={handleChange}
            size="md"
            mt="xs"
          />
        </Input.Wrapper>
      </Flex>
      <Flex align="center" justify="space-between" mb="md">
        <Input.Wrapper label="Institute Name" w="65%">
          <Input
            name="institute"
            value={formData.institute}
            onChange={handleChange}
            size="md"
            mt="xs"
          />
        </Input.Wrapper>
        <Input.Wrapper label="Grade" w="30%">
          <Input
            name="grade"
            value={formData.grade}
            onChange={handleChange}
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
      <Button onClick={handleSubmit} size="md" w="fit-content" mt="lg">
        Submit
      </Button>
      <Divider my="md" />
      <Text fw={500} mb="md">
        Your Educations
      </Text>
      {educationData.length > 0 ? (
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Degree</Table.Th>
              <Table.Th>Stream</Table.Th>
              <Table.Th>Institute</Table.Th>
              <Table.Th>Grade</Table.Th>
              <Table.Th visibleFrom="sm">Start Date</Table.Th>
              <Table.Th visibleFrom="sm">End Date</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {educationData.map((edu, index) => (
              <Table.Tr key={index}>
                <Table.Td style={{ textAlign: "center" }}>
                  {edu.degree}
                </Table.Td>
                <Table.Td style={{ textAlign: "center" }}>
                  {edu.stream}
                </Table.Td>
                <Table.Td style={{ textAlign: "center" }}>
                  {edu.institute}
                </Table.Td>
                <Table.Td style={{ textAlign: "center" }}>{edu.grade}</Table.Td>
                <Table.Td style={{ textAlign: "center" }} visibleFrom="sm">
                  {edu.sdate}
                </Table.Td>
                <Table.Td style={{ textAlign: "center" }} visibleFrom="sm">
                  {edu.edate}
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

function CoursesTab({ coursesData }) {
  const [formData, setFormData] = useState({
    course_name: "",
    license: "",
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
        { coursesubmit: formData },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        },
      );
      Notifications.show({
        message: "Certificates added Successfully!",
        color: "green",
      });
      setFormData({
        course_name: "",
        license: "",
        start_date: "",
        end_date: "",
        description: "",
      });
    } catch (error) {
      Notifications.show({
        message: "Failed! Please try later.",
        color: "red",
      });
      console.error("Error updating courses:", error);
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
        Add a New Certification Course
      </Text>
      <Flex align="center" justify="space-between" mb="md">
        <Input.Wrapper label="Course Name" w="65%">
          <Input
            name="course_name"
            value={formData.course_name}
            onChange={handleChange}
            size="md"
            mt="xs"
          />
        </Input.Wrapper>
        <Input.Wrapper label="License No." w="30%">
          <Input
            name="license"
            value={formData.license}
            onChange={handleChange}
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
      <Input.Wrapper label="Description" w={{ base: "100%", sm: "80%" }}>
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
        Your Certificates
      </Text>
      {coursesData.length > 0 ? (
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Td>Course Name</Table.Td>
              <Table.Td>License No.</Table.Td>
              <Table.Td>Start Date</Table.Td>
              <Table.Td>Completion Date</Table.Td>
            </Table.Tr>
          </Table.Thead>
          <tbody>
            {coursesData.map((course, index) => (
              <tr key={index}>
                <td style={{ textAlign: "center" }}>{course.course_name}</td>
                <td style={{ textAlign: "center" }}>{course.license_no}</td>
                <td style={{ textAlign: "center" }}>{course.sdate}</td>
                <td style={{ textAlign: "center" }}>{course.edate}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Text mt="lg" style={{ textAlign: "center" }}>
          No data found!
        </Text>
      )}
    </Flex>
  );
}

export default function EducationCoursesComponent({ education, courses }) {
  return (
    <Flex
      w={{ base: "100%", sm: "60%" }}
      p="md"
      h="auto"
      style={{ border: "1px solid lightgray", borderRadius: "5px" }}
      direction="column"
      justify="space-evenly"
    >
      <Tabs defaultValue="education">
        <Tabs.List mb="sm">
          <Tabs.Tab value="education">
            <Text fw={500} size="1.2rem">
              Education
            </Text>
          </Tabs.Tab>
          <Tabs.Tab value="courses">
            <Text fw={500} size="1.2rem">
              Certificate Courses
            </Text>
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="education">
          <EducationTab educationData={education} />
        </Tabs.Panel>
        <Tabs.Panel value="courses">
          <CoursesTab coursesData={courses} />
        </Tabs.Panel>
      </Tabs>
    </Flex>
  );
}

EducationCoursesComponent.propTypes = {
  education: PropTypes.arrayOf(
    PropTypes.shape({
      degree: PropTypes.string,
      stream: PropTypes.string,
      institute: PropTypes.string,
      grade: PropTypes.string,
      start_date: PropTypes.string,
      end_date: PropTypes.string,
    }),
  ),
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      course_name: PropTypes.string,
      license: PropTypes.string,
      start_date: PropTypes.string,
      end_date: PropTypes.string,
      description: PropTypes.string,
    }),
  ),
};

EducationTab.propTypes = {
  educationData: PropTypes.arrayOf(
    PropTypes.shape({
      degree: PropTypes.string,
      stream: PropTypes.string,
      institute: PropTypes.string,
      grade: PropTypes.string,
      start_date: PropTypes.string,
      end_date: PropTypes.string,
    }),
  ),
};

CoursesTab.propTypes = {
  coursesData: PropTypes.arrayOf(
    PropTypes.shape({
      course_name: PropTypes.string,
      license: PropTypes.string,
      start_date: PropTypes.string,
      end_date: PropTypes.string,
      description: PropTypes.string,
    }),
  ),
};
