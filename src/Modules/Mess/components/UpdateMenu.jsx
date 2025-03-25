import React, { useState } from "react";
import { Divider, TextInput, Table, Title } from "@mantine/core";
import classes from "../styles/messModule.module.css";

function UpdateMenu() {
  const initialMenu = {
    Monday: {
      breakfast: "Sprouts, Idli Sambhar, Nariyal Chutney",
      lunch: "Sprouts, Idli Sambhar, Nariyal Chutney",
      dinner: "Sprouts, Idli Sambhar, Nariyal Chutney",
    },
    Tuesday: {
      breakfast: "Idli Sambhar, Nariyal Chutney",
      lunch: "Idli Sambhar, Nariyal Chutney",
      dinner: "Idli Sambhar, Nariyal Chutney",
    },
    Wednesday: {
      breakfast: "Idli Sambhar, Nariyal Chutney",
      lunch: "Idli Sambhar, Nariyal Chutney",
      dinner: "Idli Sambhar, Nariyal Chutney",
    },
    Thursday: {
      breakfast: "Idli Sambhar, Nariyal Chutney",
      lunch: "Idli Sambhar, Nariyal Chutney",
      dinner: "Idli Sambhar, Nariyal Chutney",
    },
    Friday: {
      breakfast: "Idli Sambhar, Nariyal Chutney",
      lunch: "Idli Sambhar, Nariyal Chutney",
      dinner: "Idli Sambhar, Nariyal Chutney",
    },
    Saturday: {
      breakfast: "Idli Sambhar, Nariyal Chutney",
      lunch: "Idli Sambhar, Nariyal Chutney",
      dinner: "Idli Sambhar, Nariyal Chutney",
    },
    Sunday: {
      breakfast: "Idli Sambhar, Nariyal Chutney",
      lunch: "Idli Sambhar, Nariyal Chutney",
      dinner: "Idli Sambhar, Nariyal Chutney",
    },
  };

  const [menu1, setMenu1] = useState(initialMenu);
  const [menu2, setMenu2] = useState(initialMenu);
  const [activeMess, setActiveMess] = useState("Mess 1");

  const handleChange = (day, mealType, value) => {
    if (activeMess === "Mess 1") {
      setMenu1((prevMenu) => ({
        ...prevMenu,
        [day]: { ...prevMenu[day], [mealType]: value },
      }));
    } else {
      setMenu2((prevMenu) => ({
        ...prevMenu,
        [day]: { ...prevMenu[day], [mealType]: value },
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Menu:", activeMess === "Mess 1" ? menu1 : menu2);
  };

  const buttonStyle = (isActive) => ({
    backgroundColor: isActive ? "#6c757d" : "#007bff", // Gray if active, blue otherwise
    color: "#fff",
    padding: "10px 20px",
    fontSize: "1rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    margin: "10px",
  });

  return (
    <div
      className={classes.fusionText}
      style={{ padding: "40px 20px", textAlign: "center" }}
    >
      {/* Title */}
      <Title order={2} align="center" mb="lg" style={{ color: "#1c7ed6" }}>
        Update Mess Menu
      </Title>

      {/* Mess Selection */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => setActiveMess("Mess 1")}
          style={buttonStyle(activeMess === "Mess 1")}
        >
          Mess-1
        </button>
        <button
          onClick={() => setActiveMess("Mess 2")}
          style={buttonStyle(activeMess === "Mess 2")}
        >
          Mess-2
        </button>
      </div>

      <Divider my="sm" />

      <form onSubmit={handleSubmit}>
        <Table
          striped
          highlightOnHover
          style={{ width: "80%", margin: "20px auto" }}
        >
          <thead>
            <tr>
              <th>Day</th>
              <th>Breakfast</th>
              <th>Lunch</th>
              <th>Dinner</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(activeMess === "Mess 1" ? menu1 : menu2).map((day) => (
              <tr key={day}>
                <td>{day}</td>
                <td>
                  <TextInput
                    value={
                      activeMess === "Mess 1"
                        ? menu1[day].breakfast
                        : menu2[day].breakfast
                    }
                    onChange={(e) =>
                      handleChange(day, "breakfast", e.target.value)
                    }
                  />
                </td>
                <td>
                  <TextInput
                    value={
                      activeMess === "Mess 1"
                        ? menu1[day].lunch
                        : menu2[day].lunch
                    }
                    onChange={(e) => handleChange(day, "lunch", e.target.value)}
                  />
                </td>
                <td>
                  <TextInput
                    value={
                      activeMess === "Mess 1"
                        ? menu1[day].dinner
                        : menu2[day].dinner
                    }
                    onChange={(e) =>
                      handleChange(day, "dinner", e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Submit Button */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button type="submit" style={buttonStyle(false)}>
            Save Menu
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateMenu;
