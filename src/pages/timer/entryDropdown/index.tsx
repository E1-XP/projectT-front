import { push } from "connected-react-router";
import React, { useCallback, useState } from "react";

import { useStoreDispatch } from "../../../hooks";

import { Icon } from "../../../components/icon";

import { Screen_Blocker } from "../styles";
import {
  Relative_Container,
  Item_Link,
  Dropdown,
  Dropdown_Item,
} from "./style";
import { darkGrey, green, red } from "../../../styles/variables";

interface Props {
  isHovered: boolean;
  onDelete: () => any;
}

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
