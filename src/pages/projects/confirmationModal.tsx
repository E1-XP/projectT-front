import React, { useCallback } from "react";
import styled from "styled-components";
import Modal from "react-modal";

import { Icon } from "../../components/icon";
import { Button_success, Button_danger } from "../../components/buttons";

import { whiteGrey } from "../../styles/variables";

const Section_heading = styled.h3`
  display: flex;
  align-items: center;
`;

const Modal_Header = styled.header`
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid ${whiteGrey};
  padding: 1.5rem;
`;

const Modal_Section = styled.section`
  display: flex;
  justify-content: space-evenly;
  padding: 1.5rem;
`;

const Icon_Link = styled.a`
  cursor: pointer;
  display: flex;
  padding: 0.3rem;
`;

interface Props {
  isOpen: boolean;
  setIsOpen: any;
  handleRemove: any;
}

const styles = {
  content: {
    top: "30%",
    left: "50%",
    right: "initial",
    bottom: "initial",
    transform: "translate(-50%, -50%)",
    width: "35rem",
    overflow: "hidden",
  },
};

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
        <Section_heading>Are your sure?</Section_heading>
        <Icon_Link onClick={closeModal}>
          <Icon name="close" />
        </Icon_Link>
      </Modal_Header>
      <Modal_Section>
        <Button_success onClick={handleRemove}>Yes</Button_success>
        <Button_danger onClick={closeModal}>No</Button_danger>
      </Modal_Section>
    </Modal>
  );
};
