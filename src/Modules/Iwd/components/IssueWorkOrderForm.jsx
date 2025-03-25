import React, { useState } from "react";
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
  NumberInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import PropTypes from "prop-types";
import { DateInput } from "@mantine/dates";
import classes from "./EngineerIssueWorkOrder.module.css";
import { HandleIssueWorkOrder } from "../handlers/handlers";

function IssueWorkOrderForm({ workOrder, onBack }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      request_id: workOrder.id,
      name: workOrder.name,
      amount: null,
      deposit: null,
      start_date: null,
      completion_date: null,
      alloted_time: null,
    },
    validate: {
      amount: (value) => (value ? null : "Field is required"),
      start_date: (value) => (value ? null : "Field is required"),
      completion_date: (value) => (value ? null : "Field is required"),
      alloted_time: (value) => (value ? null : "Field is required"),
    },
  });

  return (
    /* eslint-disable react/jsx-props-no-spreading */
    <Grid mt="s">
      <div className="contain">
        <form
          onSubmit={form.onSubmit((data) => {
            HandleIssueWorkOrder({
              data,
              setIsLoading,
              setIsSuccess,
              onBack,
            });
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
              marginBottom: "10px",
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
                <Title size="26px">Issue Work Order</Title>
              </Flex>

              <Grid columns="2" style={{ width: "100%" }}>
                <Grid.Col span={1}>
                  <Flex direction="column" gap="xs">
                    <TextInput
                      label="Request ID"
                      disabled
                      classNames={classes}
                      key={form.key("request_id")}
                      {...form.getInputProps("request_id")}
                    />
                  </Flex>
                </Grid.Col>
                <Grid.Col span={1}>
                  <Flex direction="column" gap="xs">
                    <TextInput
                      label="Request Name"
                      disabled
                      classNames={classes}
                      key={form.key("name")}
                      {...form.getInputProps("name")}
                    />
                  </Flex>
                </Grid.Col>
              </Grid>

              <Grid columns="2" style={{ width: "100%" }}>
                <Grid.Col span={1}>
                  <Flex direction="column" gap="xs">
                    <DateInput
                      label="Date"
                      placeholder="yyyy/mm/dd"
                      classNames={classes}
                      key={form.key("date")}
                      {...form.getInputProps("date")}
                      valueFormat="YYYY-MM-DD"
                      size="xs"
                      styles={{
                        calendarHeader: {
                          // backgroundColor: "#e0f7fa",
                          color: "#1E90FF",
                          fontSize: "16px",
                          width: "300px",
                          display: "flex",
                          height: "",
                          fontWeight: "bold",
                        },
                        calendarHeaderIcon: {
                          color: "#00796b",
                          fontSize: "20px",
                          fontWeight: "bold",
                        },
                        dropdown: {
                          width: "300px",
                          maxHeight: "350px",
                          overflow: "auto",
                        },
                        calendar: {
                          fontSize: "14px",
                        },
                      }}
                    />
                  </Flex>
                </Grid.Col>
                <Grid.Col span={1}>
                  <Flex direction="column" gap="xs">
                    <TextInput
                      label="Agency"
                      placeholder="Agency Name"
                      classNames={classes}
                      key={form.key("agency")}
                      {...form.getInputProps("agency")}
                      required
                    />
                  </Flex>
                </Grid.Col>
              </Grid>

              <Grid columns="2" style={{ width: "100%" }}>
                <Grid.Col span={1}>
                  <Flex direction="column" gap="xs">
                    <NumberInput
                      label="Amount"
                      description=""
                      placeholder="Enter amount"
                      classNames={classes}
                      key={form.key("amount")}
                      {...form.getInputProps("amount")}
                      required
                    />
                  </Flex>
                </Grid.Col>
                <Grid.Col span={1}>
                  <Flex direction="column" gap="xs">
                    <NumberInput
                      label="Deposit"
                      placeholder="Enter deposit"
                      classNames={classes}
                      key={form.key("deposit")}
                      {...form.getInputProps("deposit")}
                    />
                  </Flex>
                </Grid.Col>
              </Grid>

              <Flex direction="column" gap="xs" justify="flex-start">
                <TextInput
                  label="Alloted Time"
                  placeholder="Enter allotted time"
                  classNames={classes}
                  key={form.key("alloted_time")}
                  {...form.getInputProps("alloted_time")}
                  style={{ width: "100%" }}
                />
              </Flex>

              <Grid columns="1" style={{ width: "100%" }}>
                <Grid.Col span={1}>
                  <Flex direction="column" gap="xs">
                    {/* <DateInput
                      label="Start Date"
                      placeholder="yyyy/mm/dd"
                      classNames={classes}
                      key={form.key("start_date")}
                      {...form.getInputProps("start_date")}
                      valueFormat="YYYY-MM-DD"
                      styles={{
                        dropdown: {
                          width: "100px",
                          maxHeight: "150px",
                          overflow: "auto",
                        },
                        calendar: {
                          fontSize: "14px",
                          width: "100px",
                        },
                      }}
                      required
                    /> */}
                    <DateInput
                      label="Start Date"
                      placeholder="yyyy/mm/dd"
                      classNames={classes}
                      key={form.key("start_date")}
                      {...form.getInputProps("start_date")}
                      valueFormat="YYYY-MM-DD"
                      styles={{
                        calendarHeader: {
                          // backgroundColor: "#e0f7fa",
                          color: "#1E90FF",
                          fontSize: "16px",
                          width: "300px",
                          display: "flex",
                          height: "",
                          fontWeight: "bold",
                        },
                        calendarHeaderIcon: {
                          color: "#1E90FF",
                          fontSize: "20px",
                          fontWeight: "bold",
                        },
                        dropdown: {
                          width: "300px",
                          maxHeight: "350px",
                          overflow: "auto",
                        },
                        calendar: {
                          fontSize: "14px",
                        },
                      }}
                      required
                    />
                  </Flex>
                </Grid.Col>
                <Grid.Col span={1}>
                  <Flex direction="column" gap="xs">
                    <DateInput
                      label="Completion Date"
                      placeholder="yyyy/mm/dd"
                      classNames={classes}
                      key={form.key("completion_date")}
                      {...form.getInputProps("completion_date")}
                      valueFormat="YYYY-MM-DD"
                      styles={{
                        calendarHeader: {
                          // backgroundColor: "#e0f7fa",
                          color: "#1E90FF",
                          fontSize: "16px",
                          width: "300px",
                          display: "flex",
                          height: "",
                          fontWeight: "bold",
                        },
                        calendarHeaderIcon: {
                          color: "#00796b",
                          fontSize: "20px",
                          fontWeight: "bold",
                        },
                        dropdown: {
                          width: "300px",
                          maxHeight: "350px",
                          overflow: "auto",
                        },
                        calendar: {
                          fontSize: "14px",
                        },
                      }}
                      required
                    />
                  </Flex>
                </Grid.Col>
              </Grid>

              <Flex direction="row" gap="xs">
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

IssueWorkOrderForm.propTypes = {
  workOrder: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    area: PropTypes.string,
    "created-by": PropTypes.string,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
};

export default IssueWorkOrderForm;
