import React from "react";
import {
  TextInput,
  NumberInput,
  Select,
  Button,
  Container,
  Title,
  Paper,
  Space,
  Grid, // Importing Grid component
} from "@mantine/core"; // Import Mantine components
import { User, Calendar } from "@phosphor-icons/react"; // Import Phosphor Icons

function UpdateBill() {
  return (
    <Container
      size="lg"
      style={{
        display: "flex",
        justifyContent: "center", // Centers the form horizontally
        marginTop: "25px",
      }}
    >
      <Paper
        shadow="md"
        radius="md"
        p="xl"
        withBorder
        style={{
          width: "100%",
          maxWidth: "800px", // Optional: Max width for the form
          minWidth: "75rem", // Setting minWidth to 75rem
          padding: "30px",
        }}
      >
        <Title order={2} align="center" mb="lg" style={{ color: "#1c7ed6" }}>
          Update Bill
        </Title>

        <form method="post" action="/mess/updateBill">
          {/* Roll Number input */}
          <TextInput
            label="Roll No."
            placeholder="Roll No of Student"
            id="rollNo"
            required
            radius="md"
            size="md"
            icon={<User size={20} />}
            mb="lg"
          />

          <Grid grow>
            {/* New Amount input (left side of the grid) */}
            <Grid.Col span={6}>
              <NumberInput
                label="New Amount"
                placeholder="New amount for this month's bill"
                id="new_amount"
                required
                radius="md"
                size="md"
                min={0}
                step={100}
                mb="lg"
              />
            </Grid.Col>

            {/* Month select input (right side of the grid) */}
            <Grid.Col span={6}>
              <Select
                label="Month"
                id="Month"
                placeholder="Select month"
                required
                radius="md"
                size="md"
                icon={<Calendar size={20} />}
                data={[
                  { value: "january", label: "January" },
                  { value: "february", label: "February" },
                  { value: "march", label: "March" },
                  { value: "april", label: "April" },
                  { value: "may", label: "May" },
                  { value: "june", label: "June" },
                  { value: "july", label: "July" },
                  { value: "august", label: "August" },
                  { value: "september", label: "September" },
                  { value: "october", label: "October" },
                  { value: "november", label: "November" },
                  { value: "december", label: "December" },
                ]}
                mb="lg"
              />
            </Grid.Col>
          </Grid>

          {/* Year select input */}
          <Select
            label="Year"
            id="Year"
            placeholder="Select year"
            required
            radius="md"
            size="md"
            data={[
              { value: "2023", label: "2023" },
              { value: "2024", label: "2024" },
            ]}
            mb="lg"
          />

          <Space h="xl" />

          {/* Submit button */}
          <Button fullWidth size="lg" radius="md" color="blue">
            Update Bill
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default UpdateBill;
