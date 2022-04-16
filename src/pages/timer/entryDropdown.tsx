import { push } from "connected-react-router";
import React, { useCallback, useState } from "react";
import styled from "styled-components";

import { useStoreDispatch } from "../../hooks";

import {
  darkGrey,
  green,
  greyWhite,
  greyWhiteDarker,
  red,
  white,
  whiteGrey,
} from "../../styles/variables";

import { Icon } from "./../../components/icon";
import { Screen_Blocker } from "./styles";

interface Props {
  isHovered: boolean;
  onDelete: () => any;
}

const Relative_Container = styled.div`
  position: relative;
`;

const Dropdown = styled.ul`
  position: absolute;
  border: 1px solid ${whiteGrey};
  top: 2rem;
  right: 0.6rem;
  width: 8.5rem;
  background-color: ${white};
  z-index: 10;
  border-radius: 4px;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
`;

const Dropdown_Item = styled.li`
  padding: 0.7rem;
  color: ${darkGrey};
  line-height: 170%;
  text-align: left;

  &:hover {
    background-color: ${whiteGrey};
  }
`;

interface IItemLink {
  fill?: string;
  isActive?: boolean;
}

const Item_Link = styled.a`
  cursor: pointer;
  display: block;
  opacity: ${({ isActive }: IItemLink) =>
    isActive || isActive === undefined ? 1 : 0};
  color: ${(props: IItemLink) => props.fill || greyWhite};

  &:hover {
    color: ${(props: IItemLink) => props.fill || greyWhiteDarker};
  }
`;

export const EntryDropdown = ({ isHovered, onDelete }: Props) => {
  const dispatch = useStoreDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const openMenu = useCallback(() => setIsOpen(true), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  const pushToProjects = useCallback(() => dispatch(push("/projects")), []);

  return (
    <>
      <Relative_Container>
        <Item_Link isActive={isHovered} onClick={openMenu}>
          <Icon name="more_vert" fill={isOpen ? green : undefined} />
        </Item_Link>
        {isOpen && (
          <Dropdown>
            <Dropdown_Item>
              <Item_Link fill={darkGrey} onClick={pushToProjects}>
                Go to Projects
              </Item_Link>
            </Dropdown_Item>
            <Dropdown_Item onClick={onDelete}>
              <Item_Link fill={red}>Delete</Item_Link>
            </Dropdown_Item>
          </Dropdown>
        )}
      </Relative_Container>
      {isOpen && <Screen_Blocker onClick={closeMenu} />}
    </>
  );
};
