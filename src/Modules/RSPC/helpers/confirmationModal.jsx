import PropTypes from "prop-types";
import { Modal, Button, Text, Title } from "@mantine/core";
import { ThumbsDown, ThumbsUp } from "@phosphor-icons/react";

function ConfirmationModal({ opened, onClose, onConfirm }) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      withCloseButton={false}
      size="sm"
      styles={{
        header: { justifyContent: "center" },
      }}
      title={
        <Title order={4} style={{ color: "#15ABFF" }}>
          Confirm Form Submission ?
        </Title>
      }
    >
      <Text style={{ textAlign: "center" }}>
        Are you sure you want to submit the form? Please verify the details
        before confirming.
      </Text>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "1.5rem",
        }}
      >
        <Button
          color="#85B5D9"
          style={{ borderRadius: "8px", marginRight: "1rem" }}
          onClick={onClose}
          size="xs"
          variant="outline"
        >
          <ThumbsDown size={26} style={{ marginRight: "3px" }} />
          No
        </Button>
        <Button
          color="cyan"
          style={{ borderRadius: "8px" }}
          size="xs"
          onClick={onConfirm}
        >
          <ThumbsUp size={26} style={{ marginRight: "3px" }} />
          Yes
        </Button>
      </div>
    </Modal>
  );
}

ConfirmationModal.propTypes = {
  opened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default ConfirmationModal;
