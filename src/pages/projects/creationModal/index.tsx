import React, { useState, useCallback } from "react";
import Modal from "react-modal";

import { Icon } from "../../../components/icon";
import { Button_Success } from "../../../components/buttons";
import { ColorPickerDropdown } from "../colorPickerDropdown";

import { useStoreDispatch } from "../../../hooks";

import { createProject } from "../../../actions/user";

import {
  modalStyle,
  Modal_Header,
  Section_Heading,
  Icon_Link,
  Modal_Section,
  Relative_Container,
  Icon_Link_Modal,
  Color_Indicator,
  colors,
  Input,
  Modal_Footer,
} from "./style";

interface Props {
  isOpen: boolean;
  closeModal: () => any;
}

Modal.setAppElement("#app");

export const CreationModal = ({ isOpen, closeModal }: Props) => {
  const dispatch = useStoreDispatch();

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const [name, setName] = useState("");
  const [client, setClient] = useState("");

  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined
  );

  const openColorPicker = useCallback(() => setIsColorPickerOpen(true), []);
  const closeColorPicker = useCallback(() => setIsColorPickerOpen(false), []);

  const cleanUpState = useCallback(() => {
    setName("");
    setClient("");
    setSelectedColor(undefined);
  }, []);

  const onButtonCreateClick = () => {
    if (!selectedColor) return;

    dispatch(createProject({ name, client, color: selectedColor }));
    closeModal();
  };

  return (
    <Modal
      id="creationModal"
      isOpen={isOpen}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
      closeTimeoutMS={200}
      style={modalStyle}
      onAfterClose={cleanUpState}
    >
      <Modal_Header>
        <Section_Heading>Create Project</Section_Heading>
        <Icon_Link onClick={closeModal}>
          <Icon name="close" />
        </Icon_Link>
      </Modal_Header>
      <Modal_Section>
        <Relative_Container>
          <Icon_Link_Modal onClick={openColorPicker}>
            <Color_Indicator color={selectedColor} />
            <Icon name="arrow_drop_down" />
          </Icon_Link_Modal>
          <ColorPickerDropdown
            isOpen={isColorPickerOpen}
            closeDropdown={closeColorPicker}
            colors={colors}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
          />
        </Relative_Container>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project name..."
        />
        <Input
          value={client}
          onChange={(e) => setClient(e.target.value)}
          placeholder="Client..."
        />
      </Modal_Section>
      <Modal_Footer>
        <Button_Success
          disabled={!name.trim().length || !selectedColor}
          onClick={onButtonCreateClick}
        >
          Create Project
        </Button_Success>
      </Modal_Footer>
    </Modal>
  );
};
