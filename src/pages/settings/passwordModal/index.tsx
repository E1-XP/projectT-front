import React, { useCallback, useEffect, useState } from "react";
import Modal from "react-modal";

import { useStoreDispatch, useStoreSelector } from "../../../hooks";

import {
  EMPTY_PASSWORD_FIELD,
  FORM_MESSAGE_ERROR,
  getSchema,
  PASSWORD_COMPARISION_FAILED,
  PASSWORD_NOT_CHANGED,
  PASSWORD_TOO_SHORT,
  validationTypes,
} from "../../forms/validation";

import { changePassword, setFormMessage } from "../../../actions/global";

import { ComponentLoader } from "../../../components/loader";
import {
  Button,
  Button_Danger,
  Button_Success,
} from "../../../components/buttons";
import { Input } from "../../../components/inputs";
import { Icon } from "../../../components/icon";

import {
  modalStyle,
  Modal_Header,
  Section_Heading,
  Icon_Link,
  Modal_Caption,
  Modal_Content,
  Button_Container,
} from "./style";

interface Props {
  isOpen: boolean;
  closeModal: any;
}

export enum CAPTION_STATES {
  ERROR = "ERROR",
  SUCCESS = "SUCCESS",
}
export interface IModalError {
  isVisible: boolean;
  type: CAPTION_STATES;
}

Modal.setAppElement("#app");

export const PasswordModal = ({ isOpen, closeModal }: Props) => {
  const dispatch = useStoreDispatch();
  const isFetching = useStoreSelector((state) => state.global.isFetching);
  const formMessage = useStoreSelector((state) => state.global.formMessage);

  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isFieldValid, setIsFieldValid] = useState([true, true, true]);

  const isTouched = (s: string) => !!s.length;
  const isEqual = (s1: string, s2: string) => s1 === s2;

  const cleanUpFields = () => {
    setCurrentPass("");
    setNewPass("");
    setConfirmNewPass("");
  };

  const cleanupValidationMessages = () => {
    setErrorMessage("");
    dispatch(setFormMessage(["", true]));
  };

  useEffect(() => {
    if (formMessage[0].length && formMessage[1]) {
      setTimeout(() => {
        closeModal();

        cleanupValidationMessages();
        cleanUpFields();
      }, 3000);
    } else if (formMessage[0] === FORM_MESSAGE_ERROR) {
      setIsFieldValid([false, true, true]);
    }
  }, [formMessage]);

  const submitPasswordUpdate = useCallback(() => {
    cleanupValidationMessages();
    setIsFieldValid([true, true, true]);

    if (isEqual(currentPass, newPass) && !formMessage[0].length) {
      setErrorMessage(PASSWORD_NOT_CHANGED);
      setIsFieldValid([true, false, false]);
      return;
    }

    try {
      getSchema(validationTypes.PASS_CHANGE)!.validateSync({
        password: newPass.trim(),
        passwordConfirm: confirmNewPass.trim(),
      });

      dispatch(
        changePassword({
          current: currentPass,
          newpass: newPass,
          newpass2: confirmNewPass,
        })
      );
    } catch (e: any) {
      if (!isTouched(newPass.trim())) {
        setErrorMessage(EMPTY_PASSWORD_FIELD);
      } else if (e.message) {
        setErrorMessage(e.message);

        switch (e.message) {
          case PASSWORD_COMPARISION_FAILED:
          case PASSWORD_TOO_SHORT: {
            return setIsFieldValid([true, false, false]);
          }
          case FORM_MESSAGE_ERROR: {
            return setIsFieldValid([false, true, true]);
          }
        }
      }
    }
  }, [
    currentPass,
    newPass,
    confirmNewPass,
    errorMessage,
    formMessage,
    isFieldValid,
  ]);

  const cancelPasswordUpdate = useCallback(() => {
    closeModal();
    cleanUpFields();

    cleanupValidationMessages();
    setIsFieldValid([true, true, true]);
  }, [
    currentPass,
    newPass,
    confirmNewPass,
    errorMessage,
    formMessage,
    isFieldValid,
  ]);

  const onInputChange = useCallback(
    (e: any) => {
      const n = Number(e.target.attributes.id.value);
      const fields = [...isFieldValid];
      fields[n] = true;

      setIsFieldValid(fields);

      switch (n) {
        case 0:
          return setCurrentPass(e.target.value);
        case 1:
          return setNewPass(e.target.value);
        case 2:
          return setConfirmNewPass(e.target.value);
      }
    },
    [isFieldValid]
  );

  return (
    <Modal
      isOpen={isOpen}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
      closeTimeoutMS={200}
      style={modalStyle}
    >
      <ComponentLoader
        isVisible={isFetching}
        shouldShowSpinner={isFetching}
        shouldShowMessage={false}
        message=""
      />
      <Modal_Header>
        <Section_Heading>Change Password</Section_Heading>
        <Icon_Link onClick={cancelPasswordUpdate}>
          <Icon name="close" />
        </Icon_Link>
      </Modal_Header>
      <Modal_Caption
        type={
          errorMessage.length || !formMessage[1]
            ? CAPTION_STATES.ERROR
            : CAPTION_STATES.SUCCESS
        }
        isVisible={[errorMessage, formMessage[0]].some((s) => s.length)}
      >
        {formMessage[0] || errorMessage}
      </Modal_Caption>
      <Modal_Content>
        <Input
          id="0"
          isValid={isFieldValid[0]}
          value={currentPass}
          placeholder="Current password"
          type="password"
          onChange={onInputChange}
        />
        <Input
          id="1"
          isValid={isFieldValid[1]}
          value={newPass}
          placeholder="New password"
          type="password"
          onChange={onInputChange}
        />
        <Input
          id="2"
          isValid={isFieldValid[2]}
          value={confirmNewPass}
          placeholder="New password again"
          type="password"
          onChange={onInputChange}
        />
        <Button_Container>
          <Button_Danger onClick={cancelPasswordUpdate}> Cancel </Button_Danger>
          <Button_Success
            disabled={[currentPass, newPass, confirmNewPass].some(
              (s) => !s.length
            )}
            onClick={submitPasswordUpdate}
          >
            Save
          </Button_Success>
        </Button_Container>
      </Modal_Content>
    </Modal>
  );
};
