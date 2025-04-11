import { useState, useEffect } from "react";
// import { PiPrinter } from "react-icons/pi";
import axios from "axios";
// import { useSelector } from "react-redux";
import {
  TextInput,
  Select,
  Button,
  FileInput,
  Textarea,
  Center,
  Paper,
  // Box,
  // Title,
  Grid,
  Flex,
  Text,
  Group,
} from "@mantine/core";
import { useLocation } from "react-router-dom";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import { useSelector } from "react-redux";
import { host } from "../../routes/globalRoutes";

function StockEntry() {
  const username = useSelector((state) => state.user.roll_no);
  const role = useSelector((state) => state.user.role);
  const [loading, setLoading] = useState(false); // State for loading status
  const [err, setErr] = useState(null);
  // console.log(uploader_username);
  const location = useLocation();
  const indentData = location.state || {};
  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      itemName: indentData.item_name || "",
      quantity: indentData.quantity || "",
      cost: indentData.estimated_cost || "",
      itemType: indentData.item_type || "",
      presentStock: indentData.present_stock || "",
      purpose: indentData.purpose || "",
      specification: indentData.specification || "",
      itemSubtype: indentData.item_subtype || "",
      budgetaryHead: indentData.budgetary_head || "",
      expectedDelivery: "",
      sourceOfSupply: indentData.sources_of_supply || "",
      remark: "",
      forwardTo: "",
      receiverDesignation: "",
      receiverName: "",
      file: null,
      item_id: "",
      vendor: "",
      recieved_date: "",
      bill: "",
      dealing_assistant_id: "",
      location: "",
    },
  });
  const [pid, setPid] = useState("");
  const [vendor, setVendor] = useState("");
  const [pquantity, setPquantity] = useState(0);
  const [cat, setCat] = useState("");
  const [receivedDate, setReceivedDate] = useState("");
  const [files, setFiles] = useState("");

  useEffect(() => {
    console.log(indentData);
  }, []);

  useEffect(() => {
    if (location.state) {
      console.log("Received Item:", location.state.item); // Debugging
      form.setValues({
        title: "",
        description: "",
        itemName: location.state.item.item_name || "",
        quantity: location.state.item.quantity || "",
        cost: location.state.item.estimated_cost || "",
        itemType: location.state.item.item_type || "",
        presentStock: location.state.item.present_stock || "",
        purpose: location.state.item.purpose || "",
        specification: location.state.item.specification || "",
        itemSubtype: location.state.item.item_subtype || "",
        budgetaryHead: location.state.item.budgetary_head || "",
        expectedDelivery: "",
        sourceOfSupply: location.state.item.sources_of_supply || "",
        remark: "",
        forwardTo: "",
        receiverDesignation: "",
        receiverName: "",
        file: null,
        item_id: location.state.item.id || "",
        vendor: "",
        recieved_date: "",
        bill: "",
        dealing_assistant_id: "",
        location: "",
      });
    }
  }, [location.state]); // ✅ Runs when location.state changes

  useEffect(() => {
    // if (formData) {
    form.setValues({
      title: "",
      description: "",
      itemName: indentData.item.item_name || "",
      quantity: indentData.item.quantity || "",
      cost: indentData.item.estimated_cost || "",
      itemType: indentData.item.item_type || "",
      presentStock: indentData.item.presentStock || "",
      purpose: indentData.item.purpose || "",
      specification: indentData.item.specification || "",
      itemSubtype: indentData.item.item_subtype || "",
      budgetaryHead: indentData.item.budgetary_head || "",
      expectedDelivery: "",
      sourceOfSupply: indentData.item.sources_of_supply || "",
      remark: "",
      forwardTo: "",
      receiverDesignation: "",
      receiverName: "",
      file: null,
      item_id: indentData.item.item_id || "",
      vendor: "",
      recieved_date: "",
      bill: "",
      dealing_assistant_id: "",
      location: "",
    });
    // }
  }, [indentData]);
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const formattedToday = `${yyyy}-${mm}-${dd}`;
  const handleme = async () => {
    // event.preventDefault();
    const formData = new FormData();

    formData.append("id", pid); // Assuming pname represents id
    formData.append("vendor", vendor); // Replace with actual vendor input
    formData.append("current_stock", pquantity);
    formData.append("bill", files); // Ensure file is a File object
    formData.append("location", cat); // Assuming category is location
    formData.append("received_date", receivedDate);
    formData.append("role", role);
    setLoading(true);
    console.log(formData);
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${host}/purchase-and-store/api/stockEntry/${username}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${token}`, // Add token for authentication
          },
        },
      );
      // navigate("/purchase/");
      alert("Stock Entry added successfully");
      console.log("Success:", response.data);
      setLoading(false);
    } catch (error) {
      setErr(error);
      console.error(
        "Error:",
        error.response ? error.response.data : error.message,
      );
      setLoading(false);
    }
  };
  if (loading) {
    return <Text>Loading...</Text>; // Display loading state
  }

  if (err) {
    return <Text style={{ color: "red" }}>{err.message}</Text>; // Display error message
  }
  return (
    <Center style={{ minHeight: "100vh" }}>
      {/* <Paper
        shadow="md"
        radius="md"
        p="lg"
        withBorder
        style={{
          maxWidth: "1000px",
          width: "100%",
        }}
      > */}
      <Paper
        shadow="md"
        radius="md"
        p="lg"
        withBorder
        style={{
          maxWidth: "calc(100% - 64px)", // Ensure the paper takes full width minus the margin (32px on each side)
          margin: "32px auto", // Add 32px margin on the left and right, and center it
          width: "100%",
        }}
      >
        <Text
          size="26px"
          style={{
            fontWeight: "bold",
            textAlign: "center",
            color: "#1881d9",
          }}
        >
          Stock Entry
        </Text>

        {/* {errorMessage && (
          <div
            style={{ color: "red", textAlign: "center", marginBottom: "20px" }}
          >
            {errorMessage}
          </div>
        )} */}

        <form style={{ marginRight: "50px", marginLeft: "100px" }}>
          <Grid>
            <Grid.Col span={{ base: 16, md: 6, lg: 5 }}>
              <Flex gap="80px">
                <Grid.Col sm={6}>
                  <TextInput
                    label="Title of Indent File"
                    placeholder="Enter title"
                    value={form.values.title}
                    onChange={(event) =>
                      form.setFieldValue("title", event.currentTarget.value)
                    }
                    required
                  />
                </Grid.Col>

                <Grid.Col sm={6}>
                  <TextInput
                    label="Description"
                    placeholder="Enter description"
                    value={form.values.description}
                    onChange={(event) =>
                      form.setFieldValue(
                        "description",
                        event.currentTarget.value,
                      )
                    }
                    required
                  />
                </Grid.Col>
              </Flex>
              <Flex gap="80px">
                <Grid.Col sm={6}>
                  <TextInput
                    label="Item Name"
                    placeholder="Enter item name"
                    value={form.values.itemName}
                    onChange={(event) =>
                      form.setFieldValue("itemName", event.currentTarget.value)
                    }
                    required
                  />
                </Grid.Col>

                <Grid.Col sm={6}>
                  <TextInput
                    type="number"
                    label="Quantity"
                    placeholder="Enter quantity"
                    value={form.values.quantity}
                    onChange={(event) => {
                      form.setFieldValue("quantity", event.target.value);
                    }}
                    required
                  />
                </Grid.Col>
              </Flex>
              <Flex gap="80px">
                <Grid.Col sm={6}>
                  <TextInput
                    type="number"
                    label="Estimated Cost Per Price"
                    placeholder="Enter estimated cost"
                    value={form.values.cost}
                    onChange={(event) =>
                      form.setFieldValue("cost", event.currentTarget.value)
                    }
                    required
                  />
                </Grid.Col>

                <Grid.Col sm={6}>
                  <Select
                    label="Item Type"
                    placeholder="Select item type"
                    data={[
                      { value: "Equipment", label: "Equipment" },
                      { value: "Consumable", label: "Consumable" },
                    ]}
                    value={form.values.itemType}
                    onChange={(value) => form.setFieldValue("itemType", value)}
                    required
                  />
                </Grid.Col>
              </Flex>
              <Flex gap="80px">
                <Grid.Col sm={6}>
                  <TextInput
                    type="number"
                    label="Present Stock"
                    placeholder="Enter present stock"
                    value={form.values.presentStock}
                    onChange={(event) => {
                      setPquantity(event.target.value);
                      form.setFieldValue("presentStock", event.target.value);
                    }}
                    required
                  />
                </Grid.Col>

                <Grid.Col sm={6}>
                  <TextInput
                    label="Purpose"
                    placeholder="Enter purpose"
                    value={form.values.purpose}
                    onChange={(event) =>
                      form.setFieldValue("purpose", event.currentTarget.value)
                    }
                    required
                  />
                </Grid.Col>
              </Flex>
              <Flex gap="80px">
                <Grid.Col sm={6}>
                  <TextInput
                    label="Specification"
                    placeholder="Enter specification"
                    value={form.values.specification}
                    onChange={(event) =>
                      form.setFieldValue(
                        "specification",
                        event.currentTarget.value,
                      )
                    }
                    required
                  />
                </Grid.Col>

                <Grid.Col sm={6}>
                  <TextInput
                    label="Item Subtype"
                    placeholder="Enter item subtype"
                    value={form.values.itemSubtype}
                    onChange={(event) =>
                      form.setFieldValue(
                        "itemSubtype",
                        event.currentTarget.value,
                      )
                    }
                    required
                  />
                </Grid.Col>
              </Flex>
              <Flex gap="80px">
                <Grid.Col sm={6}>
                  <TextInput
                    label="Budgetary Head"
                    placeholder="Enter budgetary head"
                    value={form.values.budgetaryHead}
                    onChange={(event) =>
                      form.setFieldValue(
                        "budgetaryHead",
                        event.currentTarget.value,
                      )
                    }
                    required
                  />
                </Grid.Col>

                <Grid.Col sm={6}>
                  <DateInput
                    label="Expected Delivery Date"
                    placeholder="Pick a date"
                    value={form.values.expectedDelivery}
                    onChange={(date) =>
                      form.setFieldValue("expectedDelivery", date)
                    }
                    required
                    maxDate={new Date()}
                  />
                </Grid.Col>
              </Flex>

              <Flex gap="80px">
                <Grid.Col sm={6}>
                  <TextInput
                    label="Product_id"
                    placeholder="Enter product_id"
                    value={pid}
                    onChange={(e) => setPid(e.target.value)}
                    type="number"
                    required
                  />
                </Grid.Col>

                <Grid.Col sm={6}>
                  <TextInput
                    label="Vendor name"
                    placeholder="Enter vendor name"
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    required
                  />
                </Grid.Col>
              </Flex>

              <Flex gap="80px">
                <Grid.Col sm={6}>
                  <TextInput
                    label="Location"
                    placeholder="Enter location"
                    value={cat}
                    onChange={(e) => setCat(e.target.value)}
                    required
                  />
                </Grid.Col>

                <Grid.Col sm={6}>
                  <Group align="flex-start" position="apart" grow>
                    <TextInput
                      label="Received Date"
                      value={receivedDate}
                      onChange={(e) => setReceivedDate(e.target.value)}
                      type="date"
                      required
                      style={{ flexGrow: 1 }}
                      max={formattedToday}
                    />
                  </Group>

                  {/* <DateInput
                    label="Received Date"
                    placeholder="Enter recieved Date"
                    value={receivedDate}
                    onChange={(e) => setReceivedDate(e.target.value)}
                  /> */}
                </Grid.Col>
              </Flex>

              <Flex gap="80px">
                <Grid.Col sm={6}>
                  <TextInput
                    label="Source of Supply"
                    placeholder="Enter source of supply"
                    value={form.values.sourceOfSupply}
                    onChange={(event) =>
                      form.setFieldValue(
                        "sourceOfSupply",
                        event.currentTarget.value,
                      )
                    }
                    required
                  />
                </Grid.Col>

                <Grid.Col sm={6}>
                  <Textarea
                    label="Remark"
                    placeholder="Enter remark"
                    value={form.values.remark}
                    onChange={(event) =>
                      form.setFieldValue("remark", event.currentTarget.value)
                    }
                  />
                </Grid.Col>
              </Flex>
            </Grid.Col>
            <Grid.Col sm={6}>
              <FileInput
                label="Bill Upload"
                placeholder="Upload file"
                value={form.values.file}
                onChange={(file) => {
                  setFiles(file);
                  form.setFieldValue("file", file);
                }}
                accept="application/pdf,image/jpeg,image/png"
              />
            </Grid.Col>

            <Grid.Col sm={6}>
              <Button
                type="button"
                color="green"
                onClick={form.onSubmit(handleme)}
                style={{ float: "right" }}
              >
                Stock Entry
              </Button>
            </Grid.Col>
          </Grid>
        </form>
      </Paper>
    </Center>
  );
}

export default StockEntry;
