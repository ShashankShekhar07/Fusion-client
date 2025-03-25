import React, { useState, useEffect } from "react";
import {
  List,
  Title,
  Divider,
  Container,
  Loader,
  Textarea,
  Button,
} from "@mantine/core";
import axios from "axios";
import { Pencil } from "@phosphor-icons/react";
import styles from "./CatalogC.module.css";
import {
  showAwardRoute,
  updateCatalogRoute,
} from "../../../../routes/SPACSRoutes";

function AwardsAndScholarshipCatalog() {
  const [selectedAward, setSelectedAward] = useState(null);
  const [awards, setAwards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [updatedText, setUpdatedText] = useState("");

  const handleAwardSelect = (award) => {
    setSelectedAward(award);
    setEditMode(false);
    setUpdatedText(award.catalog); // Load the current text into the textarea
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleTextChange = (event) => {
    setUpdatedText(event.target.value);
  };

  const saveChanges = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      await axios.post(
        updateCatalogRoute,
        { id: selectedAward.id, catalog: updatedText },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      setAwards((prevAwards) =>
        prevAwards.map((award) =>
          award.id === selectedAward.id
            ? { ...award, catalog: updatedText }
            : award,
        ),
      );
      setSelectedAward((prev) => ({ ...prev, catalog: updatedText }));
      setEditMode(false);
    } catch (error) {
      console.error(
        "Error saving changes:",
        error.response ? error.response.data : error.message,
      );
    }
  };

  useEffect(() => {
    const fetchAwardsData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await axios.get(showAwardRoute, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        setAwards(response.data);
        setSelectedAward(response.data[0]);
        setUpdatedText(response.data[0]?.catalog || "");
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
    <Container className={styles.wrapper}>
      {isLoading ? (
        <Loader size="lg" />
      ) : (
        <>
          <div className={styles.listContainer}>
            <List spacing="sm" size="lg">
              {awards.map((award) => (
                <List.Item
                  key={award.id}
                  onClick={() => handleAwardSelect(award)}
                  className={`${styles.listItem} ${
                    selectedAward?.id === award.id ? styles.activeItem : ""
                  }`}
                >
                  {award.award_name}
                </List.Item>
              ))}
            </List>
          </div>

          <div className={styles.contentContainer}>
            {selectedAward && (
              <>
                <div className={styles.header}>
                  <Title order={2} size="26px">
                    {selectedAward.award_name}
                  </Title>
                  <Button
                    className={styles.editButton}
                    onClick={editMode ? saveChanges : toggleEditMode}
                  >
                    {editMode ? "Save" : "Edit"}
                    <Pencil className={styles.pencilIcon} />
                  </Button>
                </div>
                <Divider my="sm" />
                {editMode ? (
                  <Textarea
                    size="14px"
                    value={updatedText}
                    onChange={handleTextChange}
                    className={styles.editTextarea}
                  />
                ) : (
                  <List className={styles.catalogList}>
                    {selectedAward.catalog.split("\n").map((point, index) => (
                      <List.Item key={index}>{point}</List.Item>
                    ))}
                  </List>
                )}
              </>
            )}
          </div>
        </>
      )}
    </Container>
  );
}

export default AwardsAndScholarshipCatalog;
