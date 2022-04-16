import styled from "styled-components";

import {
  darkGrey,
  green,
  greyWhite,
  greyWhiteDarker,
  red,
  white,
  whiteGrey,
} from "../../../styles/variables";

export const Relative_Container = styled.div`
  position: relative;
`;

export const Dropdown = styled.ul`
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

export const Dropdown_Item = styled.li`
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

export const Item_Link = styled.a`
  cursor: pointer;
  display: block;
  opacity: ${({ isActive }: IItemLink) =>
    isActive || isActive === undefined ? 1 : 0};
  color: ${(props: IItemLink) => props.fill || greyWhite};

  &:hover {
    color: ${(props: IItemLink) => props.fill || greyWhiteDarker};
  }
`;
