import React, { useState } from "react";
import {
  Container,
  Paper,
  Title,
  Text,
  List,
  Button,
  Group,
} from "@mantine/core";
import AwardRegistration from "./AwardRegistration";

function ConvocationMedal() {
  const [next, setnext] = useState(false);
  const setNextHandler = () => {
    setnext(true);
  };

  return (
    <>
      {!next && (
        <Container size="lg" my="xl">
          <Paper
            p="-15"
            radius="md"
            style={{ background: "none", marginTop: "-40px" }}
          >
            {/* Instructions Section */}
            <Title order={2} mb="md">
              Please read below instructions before applying for any of the
              Convocation Medals:
            </Title>
            <Text color="dark" mb="lg">
              <strong>Brief Description for Cultural:</strong>
              <br />
              This includes the following:
            </Text>

            <List withPadding size="sm" mb="xl">
              <List.Item>
                Write the level of participation in Cultural activities during
                your stay at IIITDMJ (Relevant documents are required to be
                uploaded).
              </List.Item>
              <List.Item>
                (a) Performance on the field – single, group (Main participant
                or side participant)
              </List.Item>
              <List.Item>
                (b) Did you win any prize/medal/award while performing above
                mentioned activity?
              </List.Item>
              <List.Item>(c) Managing cultural activity</List.Item>
              <List.Item>
                (d) Generating fund for the conduction of activity
              </List.Item>
              <List.Item>
                (e) Mention above points clearly whether the activity was
                performed inside IIITDMJ or outside IIITDMJ
              </List.Item>
            </List>

            <Text color="dark" mt="md">
              Please click on the PROCEED button below to fill the form.
            </Text>

            {/* Proceed Button */}
            <Group position="right" mt="lg">
              <Button
                onClick={setNextHandler}
                color="blue"
                radius="md"
                size="md"
              >
                Proceed
              </Button>
            </Group>
          </Paper>
        </Container>
      )}
      {next && <AwardRegistration />}
    </>
  );
}

export default ConvocationMedal;
