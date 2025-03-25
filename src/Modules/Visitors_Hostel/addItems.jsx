import React, { useState } from "react";
import {
  Select,
  TextInput,
  Button,
  Switch,
  Group,
  Modal,
  MantineProvider,
} from "@mantine/core";
import { addInventoryRoute } from "../../routes/visitorsHostelRoutes";

function AddItems() {
  const [billId, setBillId] = useState("");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [cost, setCost] = useState("");
  const [consumable, setConsumable] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");

    const data = {
      item_name: itemName,
      bill_number: billId,
      quantity: parseInt(quantity, 10),
      cost: parseInt(cost, 10),
      consumable,
    };

    try {
      const response = await fetch(addInventoryRoute, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Item added successfully:", responseData);
        setModalOpened(false);
      } else {
        const errorData = await response.json();
        console.error("Failed to add item:", errorData);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <Button
          onClick={() => setModalOpened(true)}
          size="md"
          variant="gradient"
          gradient={{ from: "indigo", to: "cyan" }}
        >
          Add Item
        </Button>
      </div>
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Add Item"
        size="lg"
        centered
        overlayOpacity={0.5}
        overlayBlur={2}
        styles={{
          header: { fontSize: "20px", fontWeight: 600 },
          body: { padding: "20px" },
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            gap: "20px",
            display: "flex",
            flexDirection: "column",
            padding: "20px", // Added padding here
          }}
        >
          <TextInput
            id="itemName"
            label="Item Name*"
            placeholder="Enter item name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
          />
          <Select
            label="Bill ID*"
            id="billId"
            value={billId}
            onChange={setBillId}
            placeholder="Select Bill ID"
            data={[
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
            ]}
            required
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <TextInput
              id="quantity"
              label="Quantity*"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
            <TextInput
              id="cost"
              label="Cost*"
              placeholder="Enter cost"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              required
            />
          </div>
          <Group
            position="apart"
            mt="md"
            align="center"
            style={{
              marginTop: "20px",
              padding: "10px 0",
              borderTop: "1px solid #e9ecef",
            }}
          >
            <span style={{ fontSize: "16px", fontWeight: "500" }}>
              Consumable
            </span>
            <Switch
              id="consumable"
              checked={consumable}
              onChange={(e) => setConsumable(e.currentTarget.checked)}
              color="teal"
            />
          </Group>
          <Button
            type="submit"
            size="md"
            fullWidth
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan" }}
            style={{
              marginTop: "20px",
              padding: "12px 0",
            }}
          >
            Submit
          </Button>
        </form>
      </Modal>
    </MantineProvider>
  );
}

export default AddItems;
