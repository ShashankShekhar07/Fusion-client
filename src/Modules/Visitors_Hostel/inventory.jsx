import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  MantineProvider,
  Tabs,
  Text,
  Button,
  Loader,
  Modal,
  TextInput,
  Select,
  Switch,
  Group,
} from "@mantine/core";
import {
  addItemsRoute,
  fetchInventorydataRoute,
} from "../../routes/visitorsHostelRoutes";

const TabsModules = [
  { label: "Consumable Inventory", id: "consumable-inventory" },
  { label: "Non-Consumable Inventory", id: "non-consumable-inventory" },
];

function InventoryManagement() {
  const [activeTab, setActiveTab] = useState("consumable-inventory");
  const [modalOpened, setModalOpened] = useState(false);
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [billId, setBillId] = useState("");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [cost, setCost] = useState("");
  const [consumable, setConsumable] = useState(false);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleAddItemsClick = () => {
    setModalOpened(true);
  };

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
      const response = await fetch(addItemsRoute, {
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
    } catch (err) {
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(fetchInventorydataRoute, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch inventory data");
        }

        const data = await response.json();
        setInventoryData(data);
        setLoading(false);
      } catch (errr) {
        setError(errr.message);
        setLoading(false);
      }
    };

    fetchInventoryData();
  }, []);

  const renderTable = (data) => {
    if (loading) {
      return <Loader style={{ marginTop: "20px" }} />;
    }

    if (error) {
      return (
        <Text color="red" style={{ marginTop: "20px" }}>
          {error}
        </Text>
      );
    }

    if (data.length === 0) {
      return <Text style={{ marginTop: "20px" }}>No items found.</Text>;
    }

    return (
      <Table
        style={{
          borderRadius: "8px",
          overflow: "hidden",
          border: "1px solid #E0E0E0",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr>
            <th style={{ backgroundColor: "#E6F3FF", padding: "12px" }}>
              Item
            </th>
            <th style={{ backgroundColor: "#E6F3FF", padding: "12px" }}>
              Available Quantity
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={item.id}
              style={{
                backgroundColor: index % 2 === 0 ? "#ffffff" : "#F5F7F8", // Alternating row colors
              }}
            >
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #E0E0E0",
                  textAlign: "center",
                }}
              >
                <Text weight={500}>{item.item_name}</Text>
              </td>
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #E0E0E0",
                  textAlign: "center",
                }}
              >
                {item.quantity}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  const consumableData = inventoryData.filter(
    (item) => item.consumable === true,
  );
  const nonConsumableData = inventoryData.filter(
    (item) => item.consumable === false,
  );

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Box
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "16px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Tabs value={activeTab}>
          <Tabs.List>
            {TabsModules.map((tab) => (
              <Tabs.Tab
                key={tab.id}
                value={tab.id}
                onClick={(e) => handleTabChange(e.target.value)}
              >
                {tab.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          <Tabs.Panel value="consumable-inventory">
            <Button
              variant="outline"
              style={{
                float: "right",
                marginTop: "15px",
                marginBottom: "15px",
              }}
              onClick={handleAddItemsClick}
            >
              Add Items
            </Button>
            {renderTable(consumableData)}
          </Tabs.Panel>

          <Tabs.Panel value="non-consumable-inventory">
            <Button
              variant="outline"
              style={{
                float: "right",
                marginTop: "15px",
                marginBottom: "15px",
              }}
              onClick={handleAddItemsClick}
            >
              Add Items
            </Button>
            {renderTable(nonConsumableData)}
          </Tabs.Panel>
        </Tabs>
        <Modal
          opened={modalOpened}
          onClose={() => setModalOpened(false)}
          title="Add Items"
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <TextInput
                id="itemName"
                label="Item Name*"
                placeholder="Enter item name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
              />
            </div>

            <div>
              <Select
                label="Bill Id*"
                id="billId"
                value={billId}
                onChange={setBillId}
                placeholder="Select Bill Id"
                data={[
                  { value: "1", label: "1" },
                  { value: "2", label: "2" },
                  { value: "3", label: "3" },
                ]}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <TextInput
                  id="quantity"
                  label="Quantity"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
              <div>
                <TextInput
                  id="cost"
                  label="Cost"
                  placeholder="Enter cost"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  required
                />
              </div>
            </div>

            <Group align="center" spacing="xs">
              <span>Consumable</span>
              <Switch
                id="consumable"
                checked={consumable}
                onChange={(e) => setConsumable(e.currentTarget.checked)}
              />
            </Group>

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Modal>
      </Box>
    </MantineProvider>
  );
}

export default InventoryManagement;
