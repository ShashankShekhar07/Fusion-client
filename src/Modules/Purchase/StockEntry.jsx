import { useState } from "react";
// import { PiPrinter } from "react-icons/pi";
import axios from "axios";
import { useSelector } from "react-redux";
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
  // formData.append("id", pid); // Assuming pname represents id
  // formData.append("vendor", "SomeVendor"); // Replace with actual vendor input
  // formData.append("current_stock", pquantity);
  // formData.append("bill", file); // Ensure `file` is a File object
  // formData.append("location", cat);
  const [pid, setPid] = useState("");
  const [vendor, setVendor] = useState("");
  const [pquantity, setPquantity] = useState("");
  const [cat, setCat] = useState("");
  const [receivedDate, setReceivedDate] = useState("");
  const [file, setFile] = useState("");
  const token = localStorage.getItem("authToken");
  const handleSubmit = async () => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("id", pid); // Assuming pname represents id
    formData.append("vendor", vendor); // Replace with actual vendor input
    formData.append("current_stock", pquantity);
    formData.append("bill", file); // Ensure `file` is a File object
    formData.append("location", cat); // Assuming category is location
    formData.append("recieved_date", receivedDate);

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/purchase-and-store/api/stockEntry/4322`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${token}`, // Add token for authentication
          },
        },
      );
      navigate("/purchase/");
      console.log("Success:", response.data);
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message,
      );
    }
  };

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
                  label="Product Id"
                  value={pid}
                  onChange={(e) => setPid(e.target.value)}
                  placeholder="Enter Product id"
                  type="number"
                  required
                  style={{ flexGrow: 1 }}
                />
              </Group>
            </Grid.Col>

            {/* vendor */}
            <Grid.Col span={12}>
              <Group align="flex-start" position="apart" grow>
                <TextInput
                  label="Vendor"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  placeholder="Enter vendor"
                  required
                  style={{ flexGrow: 1 }}
                />
              </Group>
            </Grid.Col>

            {/* Quantity */}
            <Grid.Col span={12}>
              <Group align="flex-start" position="apart" grow>
                <TextInput
                  label="Current Quantity"
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
                  label="location"
                  value={cat}
                  onChange={(e) => setCat(e.target.value)}
                  placeholder="Enter Category"
                  required
                  style={{ flexGrow: 1 }}
                />
              </Group>
            </Grid.Col>

            {/* Received Date */}
            <Grid.Col span={12}>
              <Group align="flex-start" position="apart" grow>
                <TextInput
                  label="Received Date"
                  value={receivedDate}
                  onChange={(e) => setReceivedDate(e.target.value)}
                  type="date" // Use date input
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
            <Button
              type="submit"
              radius="md"
              color="green"
              style={{ marginRight: "8px" }}
            >
              Add Product
            </Button>
          </Center>
        </form>
      </Paper>
    </Container>
  );
}

export default StockEntry;
