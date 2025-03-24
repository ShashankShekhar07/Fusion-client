import React, { useState, useEffect } from "react";
import { List, Title, Divider, Container, Loader, Grid } from "@mantine/core";
import axios from "axios";
import { showAwardRoute } from "../../../../routes/SPACSRoutes";

function AwardsAndScholarshipCatalog() {
  const [selectedAward, setSelectedAward] = useState(null);
  const [awards, setAwards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleAwardSelect = (award) => {
    setSelectedAward(award);
  };

  useEffect(() => {
    const fetchAwardsData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(showAwardRoute, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });
        setAwards(response.data);
        setSelectedAward(response.data[0]);
        setIsLoading(false);
      } catch (error) {
        console.error(
          "Error fetching awards data:",
          error.response ? error.response.data : error.message,
        );
        setIsLoading(false);
      }
    };

    fetchAwardsData();
  }, []);

  return (
    <Container
      size="lg"
      px={{ base: "xs", sm: "md", md: "lg" }}
      py={{ base: "sm", sm: "md", md: "xl" }}
    >
      {isLoading ? (
        <Loader size="lg" />
      ) : (
        <Grid gap={{ base: "sm", md: "lg" }}>
          {/* List of Awards */}
          <Grid.Col
            span={{ sm: 12, md: 4 }}
            bg={{ base: "gray.0", md: "gray.1" }}
            p={{ base: "xs", md: "sm" }}
            style={{ borderRadius: "8px" }}
          >
            <List spacing="sm" size="lg">
              {awards.map((award) => (
                <List.Item
                  key={award.id}
                  onClick={() => handleAwardSelect(award)}
                  style={{
                    cursor: "pointer",
                    fontWeight:
                      selectedAward?.id === award.id ? "bold" : "normal",
                  }}
                >
                  {award.award_name}
                </List.Item>
              ))}
            </List>
          </Grid.Col>

          {/* Award Details */}
          <Grid.Col
            span={{ sm: 12, md: 8 }}
            bg="gray.0"
            p={{ base: "xs", md: "sm" }}
            style={{ borderRadius: "8px" }}
          >
            {selectedAward && (
              <>
                <Title
                  order={2}
                  size={{ base: "16px", sm: "20px", md: "26px" }}
                >
                  {selectedAward.award_name}
                </Title>
                <Divider my="sm" />

                {/* Display catalog as bullet points */}
                <List size="md" spacing="sm">
                  {selectedAward.catalog.split("\n").map((point, index) => (
                    <List.Item key={index}>{point}</List.Item>
                  ))}
                </List>
              </>
            )}
          </Grid.Col>
        </Grid>
      )}
    </Container>
  );
}

export default AwardsAndScholarshipCatalog;
