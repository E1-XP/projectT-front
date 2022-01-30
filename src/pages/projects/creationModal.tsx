import React, { useState, useCallback } from "react";
import styled from "styled-components";
import Modal from "react-modal";

import { Icon } from "../../components/icon";
import { Button_create } from "./../../components/buttons";
import { ColorPickerDropdown } from "./colorPickerDropdown";

import { whiteGrey } from "../../styles/variables";
import { useStoreDispatch } from "../../hooks";

import { createProject } from "../../actions/user";

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
  justify-content: center;
  padding: 1.5rem;
`;

const Modal_Footer = styled.footer`
  display: flex;
  padding: 1.5rem;
  justify-content: flex-end;
`;

const Relative_container = styled.div`
  position: relative;
`;

const Icon_Link = styled.a`
  cursor: pointer;
  display: flex;
  padding: 0.3rem;
`;

const Icon_Link_Modal = styled(Icon_Link)`
  border: 1px solid #ccc;
  position: relative;
  padding: 0.5rem;
`;

const Input = styled.input`
  border: 1px solid #bbb;
  padding: 0.5rem;
`;

const Color_Indicator = styled.div`
  padding: 0.5rem;
  width: 1.5rem;
  background-color: ${(props) => props.color};
`;

Modal.setAppElement("#app");

const colors = [
  `#1abc9c`,
  `#3498db`,
  "#34495e",
  `#e74c3c`,
  `#d35400`,
  `#f1c40f`,
  `#95a5a6`,
  `#8e44ad`,
];

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

interface Props {
  isOpen: boolean;
  closeModal: () => any;
}

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
        <Section_heading>Create Project</Section_heading>
        <Icon_Link onClick={closeModal}>
          <Icon name="close" />
        </Icon_Link>
      </Modal_Header>
      <Modal_Section>
        <Relative_container>
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
        </Relative_container>
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
        <Button_create
          disabled={!name.trim().length || !selectedColor}
          onClick={onButtonCreateClick}
        >
          Create Project
        </Button_create>
      </Modal_Footer>
    </Modal>
  );
};
