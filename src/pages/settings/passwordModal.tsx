import React, { useCallback, useState } from "react";
import styled from "styled-components";
import Modal from "react-modal";

import { getSchema, validationTypes } from "./../forms/validation";

import {
  Button,
  Button_danger,
  Button_success,
} from "../../components/buttons";
import { Input } from "../../components/inputs";
import { Icon } from "../../components/icon";

import { red, white, whiteGrey } from "../../styles/variables";

interface Props {
  isOpen: boolean;
  closeModal: any;
}

const Section_Heading = styled.h3`
  font-weight: 500;
  display: flex;
  align-items: center;
`;

const Icon_Link = styled.a`
  cursor: pointer;
  display: flex;
  padding: 0.3rem;
`;

const Modal_header = styled.header`
  padding: 1.5rem;
  padding-left: 2rem;
  display: flex;
  justify-content: space-between;
  font-weight: 500;
  border-bottom: 1px solid ${whiteGrey};
`;

const Modal_content = styled.section`
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;

interface IModalError {
  isVisible: boolean;
}

const Modal_error = styled.div`
  padding: 1rem;
  background-color: ${({ isVisible }: IModalError) =>
    isVisible ? red : white};
  color: ${white};
  font-weight: 700;
  text-align: center;
`;

const Button_container = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 0rem;
`;

const modalStyle = {
  overlay: {},
  content: {
    width: "34.375rem",
    margin: "0 auto",
    padding: "0",
    boxShadow: `0 5px 15px rgba(128,128,128,0.5)`,
    overflow: "hidden",
    left: "50%",
    right: "50%",
    top: "initial",
    bottom: "initial",
    transform: "translate(-50%, 30%)",
  },
};

Modal.setAppElement("#app");

export const PasswordModal = ({ isOpen, closeModal }: Props) => {
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const isTouched = (s: string) => !!s.length;

  const isNewPasswordConfirmed = () => {
    const newPassword = newPass.trim();
    const confirmNewPassword = confirmNewPass.trim();

    const isSame = newPassword === confirmNewPassword;

    return isTouched(newPassword) && isTouched(confirmNewPassword) && isSame;
  };

  return (
    <Modal
      isOpen={isOpen}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
      closeTimeoutMS={200}
      style={modalStyle}
    >
      <Modal_header>
        <Section_Heading>Change Password</Section_Heading>
        <Icon_Link onClick={closeModal}>
          <Icon name="close" />
        </Icon_Link>
      </Modal_header>
      <Modal_error isVisible={!!errorMessage.length}>
        {errorMessage}
      </Modal_error>
      <Modal_content>
        <Input
          isValid={true}
          value={currentPass}
          placeholder="Current password"
          type="password"
          onChange={(e: any) => setCurrentPass(e.target.value)}
        />
        <Input
          isValid={!isTouched(newPass) || isNewPasswordConfirmed()}
          value={newPass}
          placeholder="New password"
          type="password"
          onChange={(e: any) => setNewPass(e.target.value)}
        />
        <Input
          isValid={!isTouched(confirmNewPass) || isNewPasswordConfirmed()}
          value={confirmNewPass}
          placeholder="New password again"
          type="password"
          onChange={(e: any) => setConfirmNewPass(e.target.value)}
        />

        <Button_container>
          <Button_danger> Cancel </Button_danger>
          <Button_success> Save </Button_success>
        </Button_container>
      </Modal_content>
    </Modal>
  );
};
