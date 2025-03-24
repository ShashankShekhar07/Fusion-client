import {
  Button,
  Card,
  Collapse,
  Text,
  Title,
  Grid,
  Group,
} from "@mantine/core"; // Use Mantine components
import { CaretDown, CaretUp } from "@phosphor-icons/react"; // Importing the new icons
import React, { useState, Suspense, lazy } from "react";
import studentData from "./Data/Data";

// Lazy load the SpecialTable component
const SpecialTable = lazy(() => import("./SpecialTable"));

const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "department", header: "Department" },
  { accessorKey: "year", header: "Year" },
];

function Alumnicat() {
  const [openCategory, setOpenCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const toggleCategory = (category) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  const renderStudentTable = (category) => {
    const data = studentData[category];
    return (
      <Suspense fallback={<Text>Loading table...</Text>}>
        <div
          style={{
            overflowX: "auto", // Enable horizontal scrolling
            width: "100%", // Ensure the container takes the full width
            marginTop: "10px", // Add some spacing
          }}
        >
          <SpecialTable
            title="Student"
            columns={columns}
            data={data}
            rowOptions={["3", "4", "6"]}
          />
        </div>
      </Suspense>
    );
  };

  return (
    <div style={{ margin: "20px" }}>
      <Title order={4} style={{ marginBottom: "20px" }}>
        Alumni Student Categories
      </Title>
      <Grid gutter="sm">
        {["phd", "mtech", "btech"].map((cat) => (
          <Grid.Col key={cat} span={4}>
            <Card
              onClick={() => toggleCategory(cat)}
              style={{ margin: "10px" }}
            >
              <Group position="apart" style={{ cursor: "pointer" }}>
                <Text weight={600}>{cat.toUpperCase()} Students</Text>
                {openCategory === cat ? (
                  <CaretUp size={18} />
                ) : (
                  <CaretDown size={18} />
                )}
              </Group>
              <Collapse in={openCategory === cat}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginTop: "10px",
                    padding: "0 16px",
                  }}
                >
                  <Button
                    variant="outline"
                    color="blue"
                    onClick={() => setSelectedCategory(cat)}
                    style={{ marginBottom: "5px" }}
                  >
                    {cat.toUpperCase()} Students
                  </Button>
                </div>
              </Collapse>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      <div style={{ marginTop: "20px" }}>
        {selectedCategory && renderStudentTable(selectedCategory)}
      </div>
    </div>
  );
}

export default Alumnicat;
