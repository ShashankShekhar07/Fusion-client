import React, { useState } from "react";
import { useForm } from "@mantine/form";
import {
  Button,
  Flex,
  Grid,
  Loader,
  Paper,
  Title,
  Center,
  CheckIcon,
  TextInput,
} from "@mantine/core";
import PropTypes from "prop-types";
import classes from "../iwd.module.css";
import { HandleAddBudget, HandleEditBudget } from "../handlers/handlers";

function EditBudget({ selectedBudget, onBack, checkOperation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const form = useForm({
    mode: "uncontrolled",
    initialValues:
      checkOperation === "edit"
        ? {
            id: selectedBudget.id,
            name: selectedBudget.name,
            "budget-issued": selectedBudget.budgetIssued,
          }
        : {
            name: "",
            "budget-issued": null,
          },
  });
  console.log(form.getInputProps("description"));

  return (
    /* eslint-disable react/jsx-props-no-spreading */
    <Grid mt="xs">
      <div className="container" style={{ padding: "5px" }}>
        <form
          onSubmit={form.onSubmit((values) => {
            if (checkOperation === "edit") {
              HandleEditBudget({
                formValues: values,
                setIsLoading,
                setIsSuccess,
                onBack,
              });
            } else {
              HandleAddBudget({
                formValues: values,
                setIsLoading,
                setIsSuccess,
                onBack,
              });
            }
            console.log(values);
          })}
        >
          <Paper
            radius="md"
            px="lg"
            pt="sm"
            pb="xl"
            style={{
              borderLeft: "0.6rem solid #15ABFF",
              width: "60vw",
              minHeight: "45vh",
              maxHeight: "70vh",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.15)",
            }}
            withBorder
            maw="1240px"
            backgroundColor="white"
          >
            <Flex
              direction="column"
              gap="lg"
              style={{ textAlign: "left", width: "100%", fontFamily: "Arial" }}
            >
              <Flex direction="column">
                <Title size="26px" weight={700} pt="sm">
                  {checkOperation === "edit" ? "Edit Budget" : "Add Budget"}
                </Title>
              </Flex>
              {checkOperation === "edit" && (
                <Flex direction="column" gap="xs" justify="flex-start">
                  <TextInput
                    label="id"
                    placeholder=""
                    classNames={classes}
                    key={form.key("id")}
                    {...form.getInputProps("id")}
                    disabled
                  />
                </Flex>
              )}
              <Flex direction="column" gap="xs" justify="flex-start">
                <TextInput
                  label="Name"
                  placeholder=""
                  classNames={classes}
                  required
                  key={form.key("name")}
                  {...form.getInputProps("name")}
                />
              </Flex>

              <Flex direction="column" gap="xs" justify="flex-start">
                <TextInput
                  label="budget-issued"
                  placeholder="budget issued"
                  classNames={classes}
                  required
                  key={form.key("budget-issued")}
                  {...form.getInputProps("budget-issued")}
                />
              </Flex>

              <Flex gap="xs">
                <Button
                  size="sm"
                  type="submit"
                  variant="filled"
                  color="black"
                  style={{
                    width: "100px",
                    backgroundColor: "#1E90FF",
                    color: isSuccess ? "black" : "white",
                    border: "none",
                    borderRadius: "20px",
                  }}
                  disabled={isLoading || isSuccess}
                >
                  {isLoading ? (
                    <Center>
                      <Loader color="black" size="xs" />
                    </Center>
                  ) : isSuccess ? (
                    <Center>
                      <CheckIcon size="16px" color="black" />
                    </Center>
                  ) : (
                    "Submit"
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="filled"
                  color="#1E90FF"
                  onClick={onBack}
                  disabled={isLoading || isSuccess}
                  style={{
                    border: "none",
                    borderRadius: "20px",
                  }}
                >
                  Back
                </Button>
              </Flex>
            </Flex>
          </Paper>
        </form>
      </div>
    </Grid>
    /* eslint-enable react/jsx-props-no-spreading */
  );
}

EditBudget.propTypes = {
  selectedBudget: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    budgetIssued: PropTypes.isRequired,
  }),
  onBack: PropTypes.func.isRequired,
  checkOperation: PropTypes.oneOf(["add", "edit"]),
};

export default EditBudget;
