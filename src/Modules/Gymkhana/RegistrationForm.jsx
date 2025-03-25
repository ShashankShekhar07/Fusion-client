import React from "react";
import { useForm } from "@mantine/form";
import { TextInput, Textarea, Button, Group, Container } from "@mantine/core";

import "./GymkhanaForms.css";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { host } from "../../routes/globalRoutes/index.jsx";

function ClubRegistrationForm({ clubName }) {
  const token = localStorage.getItem("authToken");
  // Set up the form with initial values and validation
  const user = useSelector((state) => state.user);
  const form = useForm({
    initialValues: {
      name: user.username,
      rollNumber: user.roll_no,
      achievements: "",
      experience: "",
      club: clubName,
    },

    validate: {
      name: (value) =>
        value.length < 2 ? "First name must have at least 2 letters" : null,
      rollNumber: (value) =>
        value.length < 6 ? "Roll no must have at least 8 letters" : null,
    },
  });
  // TODO need to add logic for addition to DB
  const mutation = useMutation({
    mutationFn: (newMemberData) => {
      return axios.post(
        `${host}/gymkhana/api/club_membership/`,
        {
          member: newMemberData.rollNumber,
          club: newMemberData.club,
          description:
            `Experience: ${newMemberData.experience}` +
            `\n` +
            `Acheivement: ${newMemberData.achievements}`,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }, // Replace with your actual API endpoint
      );
    },
  });
  // Submit handler
  const handleSubmit = (values) => {
    mutation.mutate(values, {
      onSuccess: (response) => {
        // Handle success (you can redirect or show a success message)
        console.log("Successfully registered:", response.data);
        alert("Registration successful!");
      },
      onError: (error) => {
        // Handle error (you can show an error message)
        console.error("Error during registration:", error);
        alert("Registration failed. Please try again.");
      },
    });
  };

  return (
    <Container>
      <form onSubmit={form.onSubmit(handleSubmit)} className="club-form">
        <h2 className="club-header">
          Hello from {clubName} - Enter your details for Registering !!!
        </h2>
        {/* Name */}
        <TextInput
          label="Name"
          placeholder="Enter your name"
          value={form.values.name}
          onChange={(event) =>
            form.setFieldValue("name", event.currentTarget.value)
          }
          error={form.errors.name}
          disabled
        />

        {/* Roll Number */}
        <TextInput
          label="Roll Number"
          placeholder="Enter your roll number"
          value={form.values.rollNumber}
          onChange={(event) =>
            form.setFieldValue("rollNumber", event.currentTarget.value)
          }
          error={form.errors.rollNumber}
          disabled
        />

        {/* Achievements */}
        <Textarea
          label="Achievements"
          placeholder="Describe your achievements"
          value={form.values.achievements}
          onChange={(event) =>
            form.setFieldValue("achievements", event.currentTarget.value)
          }
        />

        {/* Experience */}
        <Textarea
          label="Experience"
          placeholder="Describe your experience"
          value={form.values.experience}
          onChange={(event) =>
            form.setFieldValue("experience", event.currentTarget.value)
          }
        />

        {/* Submit Button */}
        <Group position="center" mt="md" className="submit-container">
          {token && (
            <Button type="submit" className="submit-btn">
              Submit
            </Button>
          )}
        </Group>
      </form>
    </Container>
  );
}

export { ClubRegistrationForm };

function RegistrationForm({ clubName }) {
  return (
    <Container>
      <ClubRegistrationForm clubName={clubName} />
    </Container>
  );
}
RegistrationForm.propTypes = {
  clubName: PropTypes.string.isRequired,
};
ClubRegistrationForm.propTypes = {
  clubName: PropTypes.string.isRequired,
};

export default RegistrationForm;
