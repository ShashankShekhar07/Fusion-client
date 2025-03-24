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
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  createProposalRoute,
  // createProposalRoute,
  getDesignationsRoute,
} from "../../routes/purchaseRoutes";
import { host } from "../../routes/globalRoutes";

function MultiItemIndentForm() {
  const [step, setStep] = useState(1); // Tracks current step
  const [itemCount, setItemCount] = useState(1); // Tracks the number of items
  const uploader_username = useSelector((state) => state.user);
  const role = useSelector((state) => state.user.role);
  const [designations, setDesignations] = useState([]);
  const navigate = useNavigate();
  /* eslint-disable no-unused-vars */
  const [forward, setforward] = useState();
  const [receiverdesig, setreceiverdesig] = useState();
  const [receivername, setreceivername] = useState();
  /* eslint-enable no-unused-vars */

  // Main form for indent details
  const indentForm = useForm({
    initialValues: {
      title: "",
      description: "",
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
  // Form for multiple items
  const [users, setUsers] = useState([]); // Store all users data here
  const [filteredUsers, setFilteredUsers] = useState([]); // Store filtered users
  const [selectedUser, setSelectedUser] = useState(""); // Selected user from dropdown

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(
        `${host}/purchase-and-store/api/user-suggestions`,
      );
      setUsers(response.data.users); // Save all users data to state
      setFilteredUsers(response.data.users); // Initially, show all users
    } catch (error) {
      console.error("Error fetching all users", error);
    }
  };

  useEffect(() => {
    fetchAllUsers(); // Fetch all users on mount
  }, []);
  // console.log("Users:", users);
  // Handle search input change

  // Filter users based on the query
  const filterUsers = (searchQuery) => {
    if (searchQuery === "") {
      setFilteredUsers(users); // If query is empty, show all users
    } else {
      const filtered = users.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredUsers(filtered); // Set the filtered users
    }
  };

  const form = useForm({
    initialValues: {
      items: Array.from({ length: itemCount }, () => ({
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
        file: null,
        forwardTo: "",
        receiverDesignation: "",
        receiverName: "",
      })),
    },
  });

  useEffect(() => {
    form.setFieldValue(
      "items",
      Array.from({ length: itemCount }, () => ({
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
        file: null,
        forwardTo: "",
        receiverDesignation: "",
        receiverName: "",
      })),
    );
  }, [itemCount]);
  console.log("formdetails", form);
  const handleSubmit = async () => {
    console.log(forward);
    console.log(receiverdesig);
    console.log(receivername);
    const updatedItems = form.values.items.map((item, index) => {
      console.log(`Item ${index + 1} before update:`, item); // Log item before update
      const updatedItem = {
        ...item,
        forwardTo: forward,
        receiverDesignation: receiverdesig,
        receiverName: receivername,
      };
      console.log(`Item ${index + 1} after update:`, updatedItem); // Log item after update
      return updatedItem;
    });
    console.log("updatedItems1", updatedItems);
    form.setFieldValue("items", updatedItems);
    const indentData = {
      title: indentForm.values.title,
      description: indentForm.values.description,
      items: updatedItems,
      uploaderUsername: uploader_username,
      role,
    };
    try {
      const token = localStorage.getItem("authToken");
      // Prepare an array of promises for all API calls
      console.log("updatedItems2", updatedItems);
      const requests = updatedItems.map((item) => {
        // console.log(item);
        // console.log(item.budgetaryHead);
        // console.log(item.quantity);
        // console.log(item.cost);
        // console.log(item.presentStock);
        // console.log(item.specification);
        // console.log(item.purpose);
        const data = new FormData();
        data.append("title", indentForm.values.title);
        data.append("description", indentForm.values.description);
        data.append("item_name", item.itemName);
        data.append("quantity", item.quantity);
        data.append("estimated_cost", item.cost);
        data.append("item_type", item.itemType);
        data.append("present_stock", item.presentStock);
        data.append("purpose", item.purpose);
        data.append("specification", item.specification);
        data.append("itemSubtype", item.itemSubtype);
        data.append("budgetary_head", item.budgetaryHead);
        data.append("expected_delivery", formatDate(item.expectedDelivery));
        data.append("sources_of_supply", item.sourceOfSupply);
        data.append("file", item.file);
        data.append("remark", item.remark);
        data.append("forwardTo", selectedUser);
        data.append("receiverDesignation", item.receiverDesignation);
        // data.append("receiverName", item.receiverName);
        data.append("uploaderUsername", uploader_username);
        // data.append("role", role);
        // Return the axios POST request promise
        // console.log("data",data);
        console.log(createProposalRoute(role));
        return axios.post(createProposalRoute(role), data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${token}`,
          },
        });
      });
      // Execute all requests in parallel
      const responses = await Promise.all(requests);
      // Log success for all requests
      responses.forEach((response, index) => {
        console.log(`Item ${index + 1} submitted successfully:`, response.data);
      });
      // Navigate to the next page after successful submission
      navigate("/purchase/all_filed_indents");
    } catch (error) {
      // Catch errors from any of the API calls
      console.error("Error submitting one or more items:", error);
    }
    console.log(indentData);
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

  const handleSearchChange = (value) => {
    filterUsers(value);
    fetchDesignations(value);
  };
  // const handleReceiverChange = (value) => {
  //   form.setFieldValue("receiverName", value);
  //   // setReceiverName(value);
  //   fetchDesignations(value);
  // };

  const handleDraft = async () => {
    console.log("Form values:", form.values.items);

    const updatedItems = form.values.items.map((item, index) => {
      console.log(`Item ${index + 1} before update:`, item); // Log item before update
      const updatedItem = {
        ...item,
        forwardTo: forward,
        receiverDesignation: receiverdesig,
        receiverName: receivername,
      };
      console.log(`Item ${index + 1} after update:`, updatedItem); // Log item after update
      return updatedItem;
    });
    console.log(updatedItems);
    form.setFieldValue("items", updatedItems);
    // const indentData = {
    //   title: indentForm.values.title,
    //   description: indentForm.values.description,
    //   items: updatedItems,
    //   uploaderUsername: uploader_username,
    //   role,
    // };
    try {
      const token = localStorage.getItem("authToken");
      // Prepare an array of promises for all API calls
      console.log(updatedItems);
      const requests = updatedItems.map((item) => {
        // console.log(item);
        // console.log(item.budgetaryHead);
        // console.log(item.quantity);
        // console.log(item.cost);
        // console.log(item.presentStock);
        // console.log(item.specification);
        // console.log(item.purpose);
        const data = new FormData();
        data.append("title", indentForm.values.title);
        data.append("description", indentForm.values.description);
        data.append("item_name", item.itemName);
        data.append("quantity", item.quantity);
        data.append("estimated_cost", item.cost);
        data.append("item_type", item.itemType);
        data.append("present_stock", item.presentStock);
        data.append("purpose", item.purpose);
        data.append("specification", item.specification);
        data.append("itemSubtype", item.itemSubtype);
        data.append("budgetary_head", item.budgetaryHead);
        data.append("expected_delivery", formatDate(item.expectedDelivery));
        data.append("sources_of_supply", item.sourceOfSupply);
        data.append("file", item.file);
        data.append("remark", item.remark);
        data.append("forwardTo", item.forwardTo);
        data.append("receiverDesignation", item.receiverDesignation);
        data.append("receiverName", item.receiverName);
        data.append("uploaderUsername", uploader_username);
        // data.append("role", role);
        // Return the axios POST request promise
        console.log(data);
        return axios.post(
          `${host}/purchase-and-store/api/create_draft/`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Token ${token}`,
            },
          },
        );
      });
      // Execute all requests in parallel
      const responses = await Promise.all(requests);
      // Log success for all requests
      responses.forEach((response, index) => {
        console.log(`Item ${index + 1} submitted successfully:`, response.data);
      });
      // Navigate to the next page after successful submission
      navigate("/purchase/saved_indents");
    } catch (error) {
      // Catch errors from any of the API calls
      console.error("Error submitting one or more items:", error);
    }
    // console.log("Form data:", data.get("receiverDesignation"));

    // try {
    //   const token = localStorage.getItem("authToken");
    //   const response = await axios.post(
    //     `http://127.0.0.1:8000/purchase-and-store/api/create_draft/`,
    //     data,
    //     {
    //       headers: {
    //         "Content-Type": "multipart/form-data",
    //         Authorization: `Token ${token}`,
    //       },
    //     },
    //   );

    // console.log("Success:", response.data);
    // navigate("/purchase/saved_indents");
    // navigate("/purchase/saved_indents");
  };
  //  catch (error) {
  //   console.error("Error submitting form:", error);
  //   // setErrorMessage(
  //   //   error.response
  //   //     ? error.response.data
  //   //     : "An error occurred during submission",
  //   // );
  // }

  return (
    <Center style={{ minHeight: "100vh" }}>
      <Paper
        shadow="md"
        radius="md"
        p="lg"
        withBorder
        style={{
          maxWidth: "90%", // Reduce the width restriction
          marginLeft: "auto",
          marginRight: "auto",
          // width: "90%", // Span full width
          minHeight: "50vh", // Ensure full height
          marginBottom: "1000px",
          // maxWidth: "calc(100% - 64px)",
          // marginLeft: "auto",
          // marginRight: "auto",
          // width: "100%", // Make it span the full width
          // minHeight: "100vh", // Ensure it covers the full height of the viewport
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
        {step === 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep(2);
            }}
            // style={{ marginRight: "50px", marginLeft: "100px" }}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100px",
              marginLeft: "200px",
              marginTop: "50px",
              flexDirection: "column",
            }}
          >
            <Grid>
              <Flex direction="row" style={{ width: "25vw" }}>
                <Grid.Col xs={12} sm={6}>
                  <TextInput
                    label="Enter Number of Items"
                    type="number"
                    placeholder="Enter the number of items"
                    value={itemCount}
                    onChange={(event) =>
                      setItemCount(Number(event.currentTarget.value))
                    }
                  />
                </Grid.Col>
              </Flex>
              {/* <Flex gap="80px"> */}
              <Grid.Col>
                <Button
                  color="green"
                  type="submit"
                  style={{ marginTop: "20px" }}
                >
                  Proceed to Item Details
                </Button>
              </Grid.Col>
              {/* </Flex> */}
            </Grid>
          </form>
        )}

        {step === 2 && (
          <div>
            <Grid>
              <Grid.Col sm={6} xs={12}>
                <TextInput
                  label="Indent Title"
                  placeholder="Enter the indent title"
                  value={indentForm.values.title}
                  onChange={(event) =>
                    indentForm.setFieldValue("title", event.currentTarget.value)
                  }
                />
              </Grid.Col>

              <Grid.Col xs={12} sm={6}>
                <TextInput
                  label="Indent Description"
                  placeholder="Enter a description"
                  value={indentForm.values.description}
                  onChange={(event) =>
                    indentForm.setFieldValue(
                      "description",
                      event.currentTarget.value,
                    )
                  }
                />
              </Grid.Col>
            </Grid>
            {form.values.items.map((item, index) => (
              <Box
                mb="md"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "1000px",
                  marginLeft: "100px",
                  marginRight: "50px",
                }}
                key={index}
                mt="xl"
              >
                <Grid style={{ width: "1500px" }}>
                  <Grid.Col span={{ base: 16, md: 6, lg: 5 }}>
                    <Text weight="bold">Item {index + 1}</Text>

                    <Flex gap="80px">
                      <Grid.Col xs={12} sm={6}>
                        <TextInput
                          label="Item Name"
                          placeholder="Enter item name"
                          value={item.itemName}
                          onChange={(event) =>
                            form.setFieldValue(
                              `items.${index}.itemName`,
                              event.currentTarget.value,
                            )
                          }
                          style={{ width: "100%" }}
                        />
                      </Grid.Col>

                      <Grid.Col xs={12} sm={6}>
                        <TextInput
                          type="number"
                          label="Quantity"
                          placeholder="Enter quantity"
                          value={item.quantity}
                          onChange={(event) =>
                            form.setFieldValue(
                              `items.${index}.quantity`,
                              Number(event.currentTarget.value),
                            )
                          }
                        />
                      </Grid.Col>
                    </Flex>

                    <Flex gap="80px">
                      <Grid.Col xs={12} sm={6}>
                        <TextInput
                          type="number"
                          label="Cost"
                          placeholder="Enter cost"
                          value={item.cost}
                          onChange={(event) =>
                            form.setFieldValue(
                              `items.${index}.cost`,
                              Number(event.currentTarget.value),
                            )
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
                          value={item.itemType}
                          onChange={(value) =>
                            form.setFieldValue(`items.${index}.itemType`, value)
                          }
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
                              `items.${index}.presentStock`,
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
                            form.setFieldValue(
                              `items.${index}.purpose`,
                              event.currentTarget.value,
                            )
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
                              `items.${index}.specification`,
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
                              `items.${index}.itemSubtype`,
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
                              `items.${index}.budgetaryHead`,
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
                            form.setFieldValue(
                              `items.${index}.expectedDelivery`,
                              date,
                            )
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
                              `items.${index}.sourceOfSupply`,
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
                            form.setFieldValue(
                              `items.${index}.remark`,
                              event.currentTarget.value,
                            )
                          }
                        />
                      </Grid.Col>
                    </Flex>
                  </Grid.Col>

                  <Grid.Col xs={12}>
                    {/* <Grid.Col sm={6}>  */}
                    <FileInput
                      label="File Upload"
                      placeholder="Upload file"
                      value={form.values.file}
                      onChange={(file) =>
                        form.setFieldValue(`items.${index}.file`, file)
                      }
                      accept="application/pdf,image/jpeg,image/png"
                    />
                  </Grid.Col>

                  {/* <Grid.Col xs={12} sm={6}>
                    <Button
                      type="button"
                      color="green"
                      onClick={form.onSubmit(handleDraft)}
                      style={{ float: "right" }}
                    >
                      Save Draft
                    </Button>
                  </Grid.Col> */}
                </Grid>
              </Box>
            ))}
            <Grid>
              <Grid.Col xs={12} sm={6}>
                <Button
                  type="submit"
                  color="green"
                  style={{ float: "right" }}
                  onClick={handleDraft}
                >
                  Save Draft
                </Button>
              </Grid.Col>
              <Grid.Col xs={12} sm={6}>
                <Select
                  label="Forward To"
                  placeholder="Select receiver"
                  value={selectedUser}
                  onChange={setSelectedUser}
                  data={filteredUsers.map((user) => ({
                    value: user.username,
                    label: user.username,
                  }))}
                  onSearchChange={handleSearchChange} // Trigger when user types
                  searchable
                  clearable
                />
              </Grid.Col>

              {/* <Grid.Col xs={12} sm={6}>
                <TextInput
                  label="Receiver Name"
                  placeholder="Enter receiver name"
                  value={form.values.receiverName}
                  onChange={(event) => {
                    handleReceiverChange(event.currentTarget.value);
                    setreceivername(event.currentTarget.value);
                  }}
                />
              </Grid.Col> */}

              <Grid.Col xs={12} sm={6}>
                <Select
                  label="Receiver Designation"
                  placeholder="Select designation"
                  data={designations.map((designation) => ({
                    value: designation,
                    label: designation,
                  }))}
                  value={form.values.receiverDesignation}
                  onChange={(value) => {
                    form.setFieldValue("receiverDesignation", value);
                    setreceiverdesig(value);
                  }}
                  searchable
                  clearable
                />
              </Grid.Col>
            </Grid>
            <Button
              mt="xl"
              onClick={handleSubmit}
              style={{ display: "block", margin: "0 auto" }}
              color="green"
            >
              Submit Indent
            </Button>
          </div>
        )}
      </Paper>
    </Center>
  );
}

export default MultiItemIndentForm;
