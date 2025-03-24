import React, { useState, useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  Flex,
  Grid,
  Loader,
  Paper,
  Title,
  Textarea,
  Select,
  Center,
  CheckIcon,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import PropTypes from "prop-types";
import classes from "../iwd.module.css";
import { DesignationsContext } from "../helper/designationContext";
import { HandleRequest } from "../handlers/handlers";

function CreateRequest({ setActiveTab }) {
  const role = useSelector((state) => state.user.role);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const designations = useContext(DesignationsContext);
  const designationsList = useMemo(
    () =>
      designations.map(
        (designation) =>
          `${designation.designation.name}|${designation.username}`,
      ),
    [designations],
  );

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: null,
      description: null,
      area: null,
      designation: null,
    },
    validate: {
      name: (value) => (value ? null : "Field is required"),
      description: (value) => (value ? null : "Field is required"),
      area: (value) => (value ? null : "Field is required"),
      designation: (value) => (value ? null : "Field is required"),
    },
  });

  return (
    /* eslint-disable react/jsx-props-no-spreading */

    <Grid mt="md">
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          left: "25%",
        }}
      >
        <form
          onSubmit={form.onSubmit((values) => {
            if (form.validate(values))
              HandleRequest({
                setIsLoading,
                setIsSuccess,
                setActiveTab,
                role,
                form,
              });
          })}
        >
          <Paper
            radius="md"
            px="lg"
            // pt="sm"
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
                <Title
                  size="26px"
                  weight={700}
                  pt="sm"
                  // style={{ textAlign: "center" }}
                >
                  New Request
                </Title>
              </Flex>

              <Flex direction="column" gap="xs" justify="flex-start">
                <TextInput
                  label="Name"
                  required
                  placeholder=""
                  key={form.key("name")}
                  {...form.getInputProps("name")}
                  classNames={classes}
                />
              </Flex>

              <Flex direction="column" gap="xs">
                <Textarea
                  placeholder="Description"
                  required
                  variant="filled"
                  style={{ width: "100%" }}
                  key={form.key("description")}
                  {...form.getInputProps("description")}
                  backgroundColor="#efefef"
                  cols={50}
                  rows={3}
                />
              </Flex>

              <Flex direction="column" gap="xs" justify="flex-start">
                <TextInput
                  label="Area"
                  required
                  placeholder=""
                  key={form.key("area")}
                  {...form.getInputProps("area")}
                  classNames={classes}
                />
              </Flex>

              <Flex direction="column" gap="xs" justify="flex-start">
                <Select
                  mt="md"
                  comboboxProps={{ withinPortal: true }}
                  data={designationsList}
                  placeholder="Director(Dir)"
                  label="Designation"
                  classNames={classes}
                  key={form.key("designation")}
                  {...form.getInputProps("designation")}
                  required
                />
              </Flex>

              <Flex gap="xs">
                <Button
                  size="sm"
                  variant="filled"
                  color="black"
                  type="submit"
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
              </Flex>
            </Flex>
          </Paper>
        </form>
      </div>
    </Grid>
    /* eslint-enable react/jsx-props-no-spreading */
  );
}
CreateRequest.propTypes = {
  setActiveTab: PropTypes.func.isRequired,
};
export default CreateRequest;
