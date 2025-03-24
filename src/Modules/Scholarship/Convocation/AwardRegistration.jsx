import React, { useState } from "react";
import { Container, Select, Title } from "@mantine/core";
import DirectorSilverForm from "./DirectorSilverForm";
import DirectorGoldForm from "./DirectorGoldForm";
import DMProficiencyForm from "./DMProficiencyForm";

export default function AwardRegistration() {
  const [selectedAward, setSelectedAward] = useState("Director's Silver Medal");

  return (
    <Container size="lg">
      <Title order={2} mb="md">
        Award Registration Form
      </Title>

      {/* Dropdown for Award Selection */}
      <Select
        label="Select Award"
        value={selectedAward}
        onChange={(value) => setSelectedAward(value)}
        data={[
          {
            value: "Director's Silver Medal",
            label: "Director's Silver Medal",
          },
          { value: "Director's Gold Medal", label: "Director's Gold Medal" },
          {
            value: "D&M Proficiency Gold Medal",
            label: "D&M Proficiency Gold Medal",
          },
        ]}
      />

      {/* Conditional Rendering of Forms Based on Selected Award */}
      {selectedAward === "Director's Silver Medal" && <DirectorSilverForm />}
      {selectedAward === "Director's Gold Medal" && <DirectorGoldForm />}
      {selectedAward === "D&M Proficiency Gold Medal" && <DMProficiencyForm />}
    </Container>
  );
}
