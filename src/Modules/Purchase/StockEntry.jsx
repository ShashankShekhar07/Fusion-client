import { useState } from "react";
// import { PiPrinter } from "react-icons/pi";
import {
  Button,
  TextInput,
  Select,
  Textarea,
  FileInput,
  Group,
  Title,
  Paper,
  Container,
  Grid,
  Center,
} from "@mantine/core";

function StockEntry() {
  const [pname, setPname] = useState("");
  const [pprice, setPprice] = useState("");
  const [pquantity, setPquantity] = useState("");
  const [cat, setCat] = useState("");
  const [dept, setDept] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    alert("submitted");
    alert(pname);
    alert(pprice);
    alert(pquantity);
    alert(cat);
    alert(dept);
    alert(desc);
    alert(file);
  }

  return (
    <Container size="lg">
      <Paper
        withBorder
        shadow="sm"
        p="xl"
        mt="xl"
        style={{
          backgroundColor: "#EAEAEAFF",
          marginLeft: "170px",
          marginRight: "170px",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid gutter="md">
            <Grid.Col span={10}>
              <Title order={3} align="center" mb="xl">
                ADD NEW PRODUCT
              </Title>
            </Grid.Col>
            <Grid.Col span={2}>
              <Center>{/* <PiPrinter size={28} /> */}</Center>
            </Grid.Col>
          </Grid>

          <Grid gutter="md">
            {/* Product Name */}
            <Grid.Col span={12}>
              <Group align="flex-start" position="apart" grow>
                <TextInput
                  label="Product Name"
                  value={pname}
                  onChange={(e) => setPname(e.target.value)}
                  placeholder="Enter Product Name"
                  required
                  style={{ flexGrow: 1 }}
                />
              </Group>
            </Grid.Col>

            {/* Price */}
            <Grid.Col span={12}>
              <Group align="flex-start" position="apart" grow>
                <TextInput
                  label="Price"
                  value={pprice}
                  onChange={(e) => setPprice(e.target.value)}
                  placeholder="Enter Price"
                  type="number"
                  required
                  style={{ flexGrow: 1 }}
                />
              </Group>
            </Grid.Col>

            {/* Quantity */}
            <Grid.Col span={12}>
              <Group align="flex-start" position="apart" grow>
                <TextInput
                  label="Quantity"
                  value={pquantity}
                  onChange={(e) => setPquantity(e.target.value)}
                  placeholder="Enter Quantity"
                  type="number"
                  required
                  style={{ flexGrow: 1 }}
                />
              </Group>
            </Grid.Col>

            {/* Category */}
            <Grid.Col span={12}>
              <Group align="flex-start" position="apart" grow>
                <TextInput
                  label="Category"
                  value={cat}
                  onChange={(e) => setCat(e.target.value)}
                  placeholder="Enter Category"
                  required
                  style={{ flexGrow: 1 }}
                />
              </Group>
            </Grid.Col>

            {/* Department */}
            <Grid.Col span={12}>
              <Group align="flex-start" position="apart" grow>
                <Select
                  label="Department"
                  value={dept}
                  onChange={setDept}
                  data={[
                    { value: "cs", label: "CSE" },
                    { value: "ec", label: "ECE" },
                    { value: "me", label: "ME" },
                    { value: "sm", label: "SM" },
                    { value: "bdes", label: "BDES" },
                  ]}
                  placeholder="Select Department"
                  required
                  style={{ flexGrow: 1 }}
                />
              </Group>
            </Grid.Col>

            {/* Description */}
            <Grid.Col span={12}>
              <Group align="flex-start" position="apart" grow>
                <Textarea
                  label="Description"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Enter Description of Product"
                  required
                  style={{ flexGrow: 1 }}
                />
              </Group>
            </Grid.Col>

            {/* Attach Files */}
            <Grid.Col span={12}>
              <Group align="flex-start" position="apart" grow>
                <FileInput
                  label="Attach Files"
                  value={file}
                  color="gray"
                  onChange={setFile}
                  placeholder="Choose File"
                  required
                  style={{ flexGrow: 1 }}
                />
              </Group>
            </Grid.Col>
          </Grid>

          <Center mt="lg">
            <Button type="submit" radius="md" color="gray">
              Add Product
            </Button>
          </Center>
        </form>
      </Paper>
    </Container>
  );
}

export default StockEntry;
