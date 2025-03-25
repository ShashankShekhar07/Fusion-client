import { useState } from "react";
import PropTypes from "prop-types";
import { Table, Text, Button, Flex, Divider, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { updateProfileDataRoute } from "../../../routes/dashboardRoutes";

function ProfileComponent({ data }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    about: data.profile?.about_me || "N/A",
    dob: data.profile?.date_of_birth || "Jan 01, 2004",
    address: data.profile?.address || "XYZ",
    contactNumber: data.profile?.phone_no || "+91 99999 99999",
    mailId: data.current[0]?.user.email || "abc@gmail.com",
  });

  const handleEditClick = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return console.error("No authentication token found!");
    if (isEditing) {
      try {
        const payload = {
          profilesubmit: {
            about_me: profileData.about,
            date_of_birth: profileData.dob,
            address: profileData.address,
            phone_no: profileData.contactNumber,
          },
        };

        const response = await axios.put(updateProfileDataRoute, payload, {
          headers: { Authorization: `Token ${token}` },
        });

        if (response.status === 200) {
          notifications.show({
            message: "Profile updated successfully!",
            type: "success",
          });
        } else {
          notifications.show({
            message: "Failed to update profile",
            type: "error",
          });
        }
      } catch (error) {
        notifications.show({
          message: "Error updating profile",
          type: "error",
        });
      }
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Flex
      w={{ base: "100%", sm: "60%" }}
      p="md"
      gap="md"
      style={{ border: "1px solid lightgray", borderRadius: "5px" }}
      direction="column"
      justify="space-evenly"
    >
      {/* About Me Section */}
      <Flex
        w="100%"
        p="md"
        direction="column"
        style={{ border: "1px solid lightgray", borderRadius: "5px" }}
      >
        <Text fw={500} size="1.2rem">
          About Me
        </Text>
        <Divider my="sm" />
        <Flex w="100%" justify="space-between" align="center">
          {isEditing ? (
            <TextInput
              value={profileData.about}
              onChange={(e) => handleChange("about", e.target.value)}
              w="80%"
            />
          ) : (
            <Text>{profileData.about}</Text>
          )}
          <Button onClick={handleEditClick} color={isEditing ? "green" : "red"}>
            {isEditing ? "Save" : "Edit"}
          </Button>
        </Flex>
      </Flex>

      {/* Details Section */}
      <Flex
        w="100%"
        p="md"
        direction="column"
        style={{ border: "1px solid lightgray", borderRadius: "5px" }}
      >
        <Text fw={500} size="1.2rem">
          Details
        </Text>
        <Divider my="sm" />
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td fw={500}>Date of Birth</Table.Td>
              <Table.Td>
                {isEditing ? (
                  <TextInput
                    value={profileData.dob}
                    onChange={(e) => handleChange("dob", e.target.value)}
                  />
                ) : (
                  profileData.dob
                )}
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td fw={500}>Address</Table.Td>
              <Table.Td>
                {isEditing ? (
                  <TextInput
                    value={profileData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                ) : (
                  profileData.address
                )}
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Flex>

      {/* Contact Details Section */}
      <Flex
        w="100%"
        p="md"
        direction="column"
        style={{ border: "1px solid lightgray", borderRadius: "5px" }}
      >
        <Text fw={500} size="1.2rem">
          Contact Details
        </Text>
        <Divider my="sm" />
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td fw={500}>Contact Number</Table.Td>
              <Table.Td>
                {isEditing ? (
                  <TextInput
                    value={profileData.contactNumber}
                    onChange={(e) =>
                      handleChange("contactNumber", e.target.value)
                    }
                  />
                ) : (
                  profileData.contactNumber
                )}
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td fw={500}>Mail ID</Table.Td>
              <Table.Td>{profileData.mailId}</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Flex>
    </Flex>
  );
}

ProfileComponent.propTypes = {
  data: PropTypes.shape({
    profile: PropTypes.shape({
      about_me: PropTypes.string,
      date_of_birth: PropTypes.string,
      address: PropTypes.string,
      phone_no: PropTypes.number,
    }),
    current: PropTypes.arrayOf(
      PropTypes.shape({
        user: PropTypes.shape({
          email: PropTypes.string,
        }),
      }),
    ),
  }),
};

export default ProfileComponent;
