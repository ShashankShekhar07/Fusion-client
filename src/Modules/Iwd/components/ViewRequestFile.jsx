import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Card, Text, Group, Stack, Loader, Button } from "@mantine/core";
import { Paperclip } from "@phosphor-icons/react";
import { useForm } from "@mantine/form";
import { host } from "../../../routes/globalRoutes/index";
import { GetFileData } from "../handlers/handlers";
import DeanProcess from "./FileActions/DeanProcess";
import DirectorApproval from "./FileActions/DirectorApproval";
import EngineerProcess from "./FileActions/EngineerProcess";
import ProcessBill from "./FileActions/ProcessBill";

export default function ViewRequestFile({ request, handleBackToList }) {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState({});
  const [fileAction, setFileAction] = useState(0);
  const role = useSelector((state) => state.user.role);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      remarks: "",
      file: null,
      designation: null,
    },
    validate: {
      designation: (value) => (value ? null : "Field is required"),
    },
  });

  const fileActionsList = [
    <br />,
    <DeanProcess
      handleBackToList={handleBackToList}
      form={form}
      request={request}
    />,
    <EngineerProcess
      handleBackToList={handleBackToList}
      form={form}
      request={request}
    />,
    <DirectorApproval
      handleBackToList={handleBackToList}
      form={form}
      request={request}
    />,
    <ProcessBill
      handleBackToList={handleBackToList}
      form={form}
      request={request}
    />,
  ];
  useEffect(() => {
    GetFileData({ form, setLoading, request, setMessages });
    if (role === "Director" && request.directorApproval === 0) {
      setFileAction(3);
    } else if (role === "Dean (P&D)" && request.processed_by_dean === 0) {
      setFileAction(1);
    } else {
      setFileAction(2);
    }
  }, []);
  return (
    <div
      style={{
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "25px",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.15)",
        borderLeft: "10px solid #1e90ff",
        maxWidth: "800px",
        margin: "0 auto",
        marginTop: "20px",
      }}
    >
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        sx={{
          marginBottom: "20px",
          backgroundColor: "#f0f0f0",
        }}
      >
        {loading ? (
          <Loader size="lg" />
        ) : (
          <>
            <Text fw={700}>Created By: - {messages.file.uploader}</Text>
            <Stack spacing="md">
              {messages.tracks.map((message, index) => (
                <Card
                  key={index}
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  my="10px"
                  withBorder
                  sx={{
                    marginBottom: "15px",
                  }}
                >
                  <Group position="apart" mb="xs">
                    <Text fw={500}>Sent by: {message.current_id}</Text>
                    <Text size="sm" color="dimmed">
                      {message.forward_date}
                    </Text>
                  </Group>
                  <Text fw={500} mb="xs">
                    Received by: {message.receiver_id}
                  </Text>
                  <Text mb="xs">Remarks: {message.remarks}</Text>
                  {message.upload_file && (
                    <Group spacing="xs">
                      <Paperclip size="1rem" />
                      <Text size="sm">Attachment:</Text>
                      <Button
                        variant="light"
                        component="a"
                        href={`${host}/${message.upload_file}`}
                        target="_blank"
                        radius="md"
                        sx={{
                          textOverflow: "ellipsis",
                          maxWidth: "200px",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {message.upload_file.split("/")[2]}
                      </Button>
                    </Group>
                  )}
                </Card>
              ))}
            </Stack>
            {fileActionsList[fileAction]}
          </>
        )}
      </Card>
    </div>
  );
}

ViewRequestFile.propTypes = {
  request: PropTypes.shape({
    request_id: PropTypes.number.isRequired,
    name: PropTypes.string,
    area: PropTypes.string,
    description: PropTypes.string,
    requestCreatedBy: PropTypes.string,
    file_id: PropTypes.number.isRequired,
    directorApproval: PropTypes.number,
    processed_by_dean: PropTypes.number,
    issuedWorkOrder: PropTypes.number,
    workCompleted: PropTypes.number,
  }).isRequired,
  handleBackToList: PropTypes.func.isRequired,
};
