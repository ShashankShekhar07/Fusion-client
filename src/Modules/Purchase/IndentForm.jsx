import {
  TextInput,
  NumberInput,
  Select,
  Button,
  FileInput,
  Textarea,
  Flex,
  Center,
  Paper,
  Title,
  Grid,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function IndentForm() {
  const [file, setFile] = useState(null);
  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      itemName: "",
      quantity: "",
      cost: "",
      itemType: "",
      presentStock: "",
      purpose: "",
      specification: "",
      itemSubtype: "",
      budgetaryHead: "",
      expectedDelivery: null,
      sourceOfSupply: "",
      natureOfItem: "Consumable",
      indigenous: "Yes",
      replaced: "No",
      remark: "",
      forwardTo: "",
      receiverDesignation: "",
    },
  });
  const navigate = useNavigate();

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
        <Title order={2} align="center" mb="md">
          Indent Form
        </Title>

        <form onSubmit={form.onSubmit((values) => console.log(values))}>
          <Grid>
            <Grid.Col sm={12}>
              <TextInput
                label="Title of Indent File"
                placeholder="Enter title"
                value={form.values.title}
                onChange={(event) =>
                  form.setFieldValue("title", event.currentTarget.value)
                }
              />
            </Grid.Col>

            <Grid.Col sm={12}>
              <TextInput
                label="Description"
                placeholder="Enter description"
                value={form.values.description}
                onChange={(event) =>
                  form.setFieldValue("description", event.currentTarget.value)
                }
              />
            </Grid.Col>

            <Grid.Col sm={12}>
              <TextInput
                label="Item Name"
                placeholder="Enter item name"
                value={form.values.itemName}
                onChange={(event) =>
                  form.setFieldValue("itemName", event.currentTarget.value)
                }
              />
            </Grid.Col>

            <Grid.Col sm={6}>
              <NumberInput
                label="Quantity"
                placeholder="Enter quantity"
                value={form.values.quantity}
                onChange={(value) => form.setFieldValue("quantity", value)}
              />
            </Grid.Col>

            <Grid.Col sm={6}>
              <TextInput
                label="Estimate Cost Per Price"
                placeholder="Enter estimated cost"
                value={form.values.cost}
                onChange={(event) =>
                  form.setFieldValue("cost", event.currentTarget.value)
                }
              />
            </Grid.Col>

            <Grid.Col sm={12}>
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

            <Grid.Col sm={12}>
              <TextInput
                label="Present Stock"
                placeholder="Enter present stock"
                value={form.values.presentStock}
                onChange={(event) =>
                  form.setFieldValue("presentStock", event.currentTarget.value)
                }
              />
            </Grid.Col>

            <Grid.Col sm={12}>
              <TextInput
                label="Purpose"
                placeholder="Enter purpose"
                value={form.values.purpose}
                onChange={(event) =>
                  form.setFieldValue("purpose", event.currentTarget.value)
                }
              />
            </Grid.Col>

            <Grid.Col sm={12}>
              <TextInput
                label="Specification"
                placeholder="Enter specification"
                value={form.values.specification}
                onChange={(event) =>
                  form.setFieldValue("specification", event.currentTarget.value)
                }
              />
            </Grid.Col>

            <Grid.Col sm={12}>
              <TextInput
                label="Item Subtype"
                placeholder="Enter item subtype"
                value={form.values.itemSubtype}
                onChange={(event) =>
                  form.setFieldValue("itemSubtype", event.currentTarget.value)
                }
              />
            </Grid.Col>

            <Grid.Col sm={12}>
              <TextInput
                label="Budgetary Head"
                placeholder="Enter budgetary head"
                value={form.values.budgetaryHead}
                onChange={(event) =>
                  form.setFieldValue("budgetaryHead", event.currentTarget.value)
                }
              />
            </Grid.Col>

            {/* Use Mantine's DateInput for expected delivery */}
            <Grid.Col sm={12}>
              <DateInput
                label="Expected Delivery"
                placeholder="Pick a date"
                value={form.values.expectedDelivery}
                onChange={(value) =>
                  form.setFieldValue("expectedDelivery", value)
                }
              />
            </Grid.Col>

            <Grid.Col sm={12}>
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

            <Grid.Col sm={12}>
              <FileInput
                label="Attach Files (PDF, JPEG, PNG, JPG)"
                placeholder="No file chosen"
                accept="application/pdf,image/jpeg,image/png"
                value={file}
                onChange={setFile}
              />
            </Grid.Col>

            <Grid.Col sm={12}>
              <Flex justify="flex-end" p="md">
                <Button
                  type="submit"
                  onClick={() => navigate("/purchase/saved_indents")}
                >
                  Save Draft
                </Button>
              </Flex>
            </Grid.Col>

            <Grid.Col sm={12}>
              <Textarea
                label="Remark"
                placeholder="Enter remark"
                value={form.values.remark}
                onChange={(event) =>
                  form.setFieldValue("remark", event.currentTarget.value)
                }
              />
            </Grid.Col>

            <Grid.Col sm={12}>
              <TextInput
                label="Forward To"
                placeholder="Enter person to forward to"
                value={form.values.forwardTo}
                onChange={(event) =>
                  form.setFieldValue("forwardTo", event.currentTarget.value)
                }
              />
            </Grid.Col>

            <Grid.Col sm={12}>
              <TextInput
                label="Receiver Designation"
                placeholder="Enter receiver designation"
                value={form.values.receiverDesignation}
                onChange={(event) =>
                  form.setFieldValue(
                    "receiverDesignation",
                    event.currentTarget.value,
                  )
                }
              />
            </Grid.Col>

            <Grid.Col sm={12}>
              <Flex justify="flex-end" p="md">
                <Button
                  type="submit"
                  onClick={() => navigate("/purchase/all_filed_indents")}
                >
                  Send
                </Button>
              </Flex>
            </Grid.Col>
          </Grid>
        </form>
      </Paper>
    </Center>
  );
}

export default IndentForm;
