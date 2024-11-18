import {
  TextInput,
  Select,
  Button,
  FileInput,
  Textarea,
  Center,
  Paper,
  Box,
  Text,
  Grid,
  Flex,
} from "@mantine/core";
import "@mantine/dates/styles.css";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  // createDraftRoute,
  createProposalRoute,
  getDesignationsRoute,
} from "../../routes/purchaseRoutes";

function IndentForm() {
  // const [file, setFile] = useState(null);
  // const [receiverName, setReceiverName] = useState("");
  const [designations, setDesignations] = useState([]);
  const navigate = useNavigate();
  const uploader_username = useSelector((state) => state.user);
  // const username = useSelector((state) => state.user.roll_no);
  const role = useSelector((state) => state.user.role);
  // console.log(uploader_username);
  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      itemName: "",
      quantity: 0,
      cost: 0,
      itemType: "",
      presentStock: 0,
      purpose: "",
      specification: "",
      itemSubtype: "",
      budgetaryHead: "",
      expectedDelivery: null,
      sourceOfSupply: "",
      remark: "",
      forwardTo: "",
      receiverDesignation: "",
      receiverName: "",
      file: null,
    },
  });

  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Fetch designations based on the entered receiver name
  // eslint-disable-next-line no-shadow
  const fetchDesignations = async (receiverName) => {
    try {
      const response = await axios.get(getDesignationsRoute(receiverName));
      console.log("Fetched designations:", response.data);
      setDesignations(response.data); // Set the fetched designations in state
    } catch (error) {
      console.error("Error fetching designations:", error);
      // setErrorMessage(
      //   error.response
      //     ? error.response.data
      //     : "An error occurred while fetching designations",
      // );
    }
  };

  const handleReceiverChange = (value) => {
    form.setFieldValue("receiverName", value);
    // setReceiverName(value);
    fetchDesignations(value);
  };

  const handleSubmit = async (values) => {
    const data = new FormData();
    data.append("title", values.title);
    data.append("description", values.description);
    data.append("item_name", values.itemName);
    data.append("quantity", values.quantity);
    data.append("estimated_cost", values.cost);
    data.append("item_type", values.itemType);
    data.append("present_stock", values.presentStock);
    data.append("purpose", values.purpose);
    data.append("specification", values.specification);
    data.append("itemSubtype", values.itemSubtype);
    data.append("budgetary_head", values.budgetaryHead);
    data.append("expected_delivery", formatDate(values.expectedDelivery));
    data.append("sources_of_supply", values.sourceOfSupply);
    data.append("file", values.file);
    data.append("remark", values.remark);
    data.append("forwardTo", values.forwardTo);
    data.append("receiverDesignation", values.receiverDesignation);
    data.append("receiverName", values.receiverName);
    data.append("uploaderUsername", uploader_username);
    // console.log("Form data:", data.get("receiverDesignation"));

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(createProposalRoute(role), data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        },
      });

      console.log("Success:", response.data);
      navigate("/purchase/all_filed_indents");
    } catch (error) {
      console.error("Error submitting form:", error);
      // setErrorMessage(
      //   error.response
      //     ? error.response.data
      //     : "An error occurred during submission",
      // );
    }
  };
  const handleDraft = async (values) => {
    const data = new FormData();
    data.append("title", values.title);
    data.append("description", values.description);
    data.append("item_name", values.itemName);
    data.append("quantity", values.quantity);
    data.append("estimated_cost", values.cost);
    data.append("item_type", values.itemType);
    data.append("present_stock", values.presentStock);
    data.append("purpose", values.purpose);
    data.append("specification", values.specification);
    data.append("itemSubtype", values.itemSubtype);
    data.append("budgetary_head", values.budgetaryHead);
    data.append("expected_delivery", formatDate(values.expectedDelivery));
    data.append("sources_of_supply", values.sourceOfSupply);
    data.append("file", values.file);
    data.append("remark", values.remark);
    data.append("forwardTo", values.forwardTo);
    data.append("receiverDesignation", values.receiverDesignation);
    data.append("receiverName", values.receiverName);
    // console.log("Form data:", data.get("receiverDesignation"));

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `http://127.0.0.1:8000/purchase-and-store/api/create_draft/`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${token}`,
          },
        },
      );

      console.log("Success:", response.data);
      navigate("/purchase/saved_indents");
      // navigate("/purchase/saved_indents");
    } catch (error) {
      console.error("Error submitting form:", error);
      // setErrorMessage(
      //   error.response
      //     ? error.response.data
      //     : "An error occurred during submission",
      // );
    }
  };

  return (
    <Center style={{ minHeight: "100vh" }}>
      <Paper
        shadow="md"
        radius="md"
        p="lg"
        withBorder
        style={{
          maxWidth: "1000px",
          width: "100%",
        }}
      >
        <Box
          mb="md"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
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
            Indent Form
          </Text>
        </Box>
        {/* {errorMessage && (
          <div
            style={{ color: "red", textAlign: "center", marginBottom: "20px" }}
          >
            {errorMessage}
          </div>
        )} */}

        <form
          onSubmit={form.onSubmit(handleSubmit)}
          style={{ marginRight: "50px", marginLeft: "100px" }}
        >
          <Grid>
            <Grid.Col span={{ base: 16, md: 6, lg: 5 }}>
              <Flex gap="80px">
                <Grid.Col sm={6} xs={12}>
                  <TextInput
                    label="Title of Indent File"
                    placeholder="Enter title"
                    value={form.values.title}
                    onChange={(event) =>
                      form.setFieldValue("title", event.currentTarget.value)
                    }
                  />
                </Grid.Col>

                <Grid.Col xs={12} sm={6}>
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
                  />
                </Grid.Col>
              </Flex>
              <Flex gap="80px">
                <Grid.Col xs={12} sm={6}>
                  <TextInput
                    label="Item Name"
                    placeholder="Enter item name"
                    value={form.values.itemName}
                    onChange={(event) =>
                      form.setFieldValue("itemName", event.currentTarget.value)
                    }
                  />
                </Grid.Col>

                <Grid.Col xs={12} sm={6}>
                  <TextInput
                    type="number"
                    label="Quantity"
                    placeholder="Enter quantity"
                    value={form.values.quantity}
                    onChange={(event) =>
                      form.setFieldValue("quantity", event.currentTarget.value)
                    }
                  />
                </Grid.Col>
              </Flex>
              <Flex gap="80px">
                <Grid.Col xs={12} sm={6}>
                  <TextInput
                    type="number"
                    label="Estimated Cost Per Price"
                    placeholder="Enter estimated cost"
                    value={form.values.cost}
                    onChange={(event) =>
                      form.setFieldValue("cost", event.currentTarget.value)
                    }
                  />
                </Grid.Col>

                <Grid.Col xs={12} sm={6}>
                  <Select
                    label="Item Type"
                    placeholder="Select item type"
                    data={[
                      { value: "Equipment", label: "Equipment" },
                      { value: "Consumable", label: "Consumable" },
                    ]}
                    value={form.values.itemType}
                    onChange={(value) => form.setFieldValue("itemType", value)}
                  />
                </Grid.Col>
              </Flex>
              <Flex gap="80px">
                <Grid.Col xs={12} sm={6}>
                  <TextInput
                    type="number"
                    label="Present Stock"
                    placeholder="Enter present stock"
                    value={form.values.presentStock}
                    onChange={(event) =>
                      form.setFieldValue(
                        "presentStock",
                        event.currentTarget.value,
                      )
                    }
                  />
                </Grid.Col>

                <Grid.Col xs={12} sm={6}>
                  <TextInput
                    label="Purpose"
                    placeholder="Enter purpose"
                    value={form.values.purpose}
                    onChange={(event) =>
                      form.setFieldValue("purpose", event.currentTarget.value)
                    }
                  />
                </Grid.Col>
              </Flex>
              <Flex gap="80px">
                <Grid.Col xs={12} sm={6}>
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
                  />
                </Grid.Col>

                <Grid.Col xs={12} sm={6}>
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
                  />
                </Grid.Col>
              </Flex>
              <Flex gap="80px">
                <Grid.Col xs={12} sm={6}>
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
                  />
                </Grid.Col>

                <Grid.Col xs={12} sm={6}>
                  <DateInput
                    label="Expected Delivery"
                    placeholder="Pick a date"
                    value={form.values.expectedDelivery}
                    onChange={(date) =>
                      form.setFieldValue("expectedDelivery", date)
                    }
                  />
                </Grid.Col>
              </Flex>
              <Flex gap="80px">
                <Grid.Col xs={12} sm={6}>
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
                  />
                </Grid.Col>

                <Grid.Col xs={12} sm={6}>
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
            <Grid.Col xs={12}>
              {/* <Grid.Col sm={6}> */}
              <FileInput
                label="File Upload"
                placeholder="Upload file"
                value={form.values.file}
                onChange={(file) => form.setFieldValue("file", file)}
                accept="application/pdf,image/jpeg,image/png"
              />
            </Grid.Col>

            <Grid.Col xs={12} sm={6}>
              <Button
                type="button"
                color="green"
                onClick={form.onSubmit(handleDraft)}
                style={{ float: "right" }}
              >
                Save Draft
              </Button>
            </Grid.Col>

            <Grid.Col xs={12} sm={6}>
              <TextInput
                label="Forward To"
                placeholder="Enter forward to"
                value={form.values.forwardTo}
                onChange={(event) =>
                  form.setFieldValue("forwardTo", event.currentTarget.value)
                }
              />
            </Grid.Col>

            <Grid.Col xs={12} sm={6}>
              <TextInput
                label="Receiver Name"
                placeholder="Enter receiver name"
                value={form.values.receiverName}
                onChange={(event) =>
                  handleReceiverChange(event.currentTarget.value)
                }
              />
            </Grid.Col>

            <Grid.Col xs={12} sm={6}>
              <Select
                label="Receiver Designation"
                placeholder="Select designation"
                data={designations.map((designation) => ({
                  value: designation,
                  label: designation,
                }))}
                value={form.values.receiverDesignation}
                onChange={(value) =>
                  form.setFieldValue("receiverDesignation", value)
                }
                searchable
                clearable
              />
            </Grid.Col>

            <Grid.Col xs={12} sm={6}>
              <Button type="submit" color="green" style={{ float: "right" }}>
                Submit Indent
              </Button>
            </Grid.Col>
          </Grid>
        </form>
      </Paper>
    </Center>
  );
}

export default IndentForm;
