import React, { useCallback } from "react";
import Modal from "react-modal";

import { Icon } from "../../../components/icon";
import { Button_Success, Button_Danger } from "../../../components/buttons";
import {
  styles,
  Modal_Header,
  Section_Heading,
  Icon_Link,
  Modal_Section,
} from "./style";

interface Props {
  isOpen: boolean;
  setIsOpen: any;
  handleRemove: any;
}

Modal.setAppElement("#app");

export const ConfirmationModal = ({
  isOpen,
  setIsOpen,
  handleRemove,
}: Props) => {
  const closeModal = useCallback(() => setIsOpen(false), []);

  return (
    <Modal
      isOpen={isOpen}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
      closeTimeoutMS={200}
      style={styles}
    >
      <Modal_Header>
        <Section_Heading>Are your sure?</Section_Heading>
        <Icon_Link onClick={closeModal}>
          <Icon name="close" />
        </Icon_Link>
      </Modal_Header>
      <Modal_Section>
        <Button_Success onClick={handleRemove}>Yes</Button_Success>
        <Button_Danger onClick={closeModal}>No</Button_Danger>
      </Modal_Section>
    </Modal>
  );
};
