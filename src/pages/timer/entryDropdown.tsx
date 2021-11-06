import React, { useCallback, useState } from "react";
import styled from "styled-components";

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

interface Props {
  isHovered: boolean;
}

const Relative_container = styled.div`
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

const Dropdown_item = styled.li`
  padding: 0.7rem;
  color: ${darkGrey};
  line-height: 170%;
  text-align: left;

  &:hover {
    background-color: ${whiteGrey};
  }
`;

interface IItemLinkRelative {
  fill?: string;
  isActive?: boolean;
}

const Item_link_danger = styled.a`
  cursor: pointer;
  color: ${red};
  display: block;
`;

const Item_link = styled.a`
  cursor: pointer;
  display: block;
  opacity: ${({ isActive }: IItemLinkRelative) =>
    isActive || isActive === undefined ? 1 : 0};

  color: ${(props: IItemLinkRelative) => props.fill || greyWhite};

  &:hover {
    color: ${(props: IItemLinkRelative) => props.fill || greyWhiteDarker};
  }
`;

const Screen_blocker = styled.div`
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  background-color: transparent;
  width: 100%;
  height: 100%;
`;

export const EntryDropdown = ({ isHovered }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const openMenu = useCallback(() => setIsOpen(true), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <Relative_container>
        <Item_link isActive={isHovered} onClick={openMenu}>
          <Icon name="more_vert" fill={isOpen ? green : undefined} />
        </Item_link>
        {isOpen && (
          <Dropdown>
            <Dropdown_item>
              <Item_link fill={darkGrey}>Go to Projects</Item_link>
            </Dropdown_item>
            <Dropdown_item>
              <Item_link_danger>Delete</Item_link_danger>
            </Dropdown_item>
          </Dropdown>
        )}
      </Relative_container>
      {isOpen && <Screen_blocker onClick={closeMenu} />}
    </>
  );
};
