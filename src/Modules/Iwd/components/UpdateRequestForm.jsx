import React, { useState, useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { useForm } from "@mantine/form";
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
import PropTypes from "prop-types";
import { DesignationsContext } from "../helper/designationContext";
import classes from "../iwd.module.css";
import { HandleUpdateRequest } from "../handlers/handlers";

function UpdateRequestForm({ selectedRequest, onBack }) {
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
      id: selectedRequest.id,
      name: selectedRequest.name,
      description: selectedRequest.description,
      area: selectedRequest.area,
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
    <Grid mt="xs">
      <div className="container" style={{ padding: "5px" }}>
        <form
          onSubmit={form.onSubmit((formValues) => {
            if (form.validate(formValues))
              HandleUpdateRequest({
                setIsLoading,
                setIsSuccess,
                onBack,
                role,
                formValues,
              });
          })}
        >
          <Paper
            radius="md"
            px="lg"
            pt="sm"
            pb="md"
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
                <Title size="26px" style={{ fontWeight: "bold" }}>
                  Update Request
                </Title>
              </Flex>

              <Flex direction="column" gap="xs" justify="flex-start">
                <TextInput
                  label="ID"
                  placeholder=""
                  classNames={classes}
                  key={form.key("id")}
                  {...form.getInputProps("id")}
                  disabled
                />
              </Flex>

              <Flex direction="column" gap="xs" justify="flex-start">
                <TextInput
                  label="Name"
                  placeholder=""
                  classNames={classes}
                  key={form.key("name")}
                  {...form.getInputProps("name")}
                  required
                />
              </Flex>

              <Flex direction="column" gap="xs">
                <Textarea
                  placeholder="Description"
                  variant="filled"
                  key={form.key("description")}
                  {...form.getInputProps("description")}
                  style={{ width: "100%" }}
                  required
                  backgroundColor="#efefef"
                  cols={50}
                  rows={3}
                />
              </Flex>

              <Flex direction="column" gap="xs" justify="flex-start">
                <TextInput
                  label="Area"
                  placeholder="Area"
                  classNames={classes}
                  key={form.key("area")}
                  {...form.getInputProps("area")}
                  required
                />
              </Flex>

              <Flex direction="column" gap="xs" justify="flex-start">
                <Select
                  mt="md"
                  comboboxProps={{ withinPortal: true }}
                  data={designationsList}
                  placeholder="Select designation"
                  label="Send To"
                  classNames={classes}
                  // purane me key: form.key("sendto")
                  key={form.key("designation")}
                  // purane me {...form.getInputProps("sendto")}
                  {...form.getInputProps("designation")}
                  required
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

UpdateRequestForm.propTypes = {
  selectedRequest: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    area: PropTypes.string,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
};

export default UpdateRequestForm;
