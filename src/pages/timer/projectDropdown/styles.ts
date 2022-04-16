import styled from "styled-components";

import {
  breakPoints,
  greyWhite,
  greyWhiteDarker,
  white,
  whiteGrey,
  green,
  black,
} from "../../../styles/variables";
import { getBP } from "../../../styles/helpers";
import { Project } from "../../../store/interfaces";

export const Item_Link = styled.a`
  cursor: pointer;
`;

interface IItem_Link_Toggle {
  isActive: boolean;
}

export const Item_Link_Toggle = styled(Item_Link)<IItem_Link_Toggle>`
  opacity: ${(props) => (props.isActive ? "1" : "0")};
  pointer-events: ${(props) => (props.isActive ? "all" : "none")};
  color: ${(props) => (props.isActive ? greyWhiteDarker : whiteGrey)};
  background-color: ${(props) => (props.isActive ? whiteGrey : "transparent")};
  padding: 0.2rem 0.4rem;
  border-radius: 5px;

  &:hover {
    color: ${greyWhiteDarker};
  }
`;

interface IItem {
  project?: boolean;
}

export const Item = styled.li`
  padding: 0.5rem;
  width: 15rem;
  border-radius: 5px;
  background-color: ${(props: IItem) => (props.project ? whiteGrey : white)};
  color: ${(props: IItem) => (props.project ? green : black)};

  &:hover {
    background-color: ${whiteGrey};
  }
`;

export const List = styled.ul`
  max-height: 12rem;
  overflow-y: auto;
`;

export const Color_Indicator = styled.span`
  display: inline-block;
  width: 0.6rem;
  height: 0.6rem;
  background-color: ${(props) => props.color};
  border-radius: 50%;
  margin-right: 0.5rem;
`;

export const Item_Project = styled.span`
  color: ${({ color }) => color};

  ${getBP(breakPoints.small)} {
    display: none;
  }
`;

export const Input = styled.input`
  margin-left: 0.5rem;
  border: none;

  &:focus {
    outline-style: dashed;
    outline-color: lightgrey;
    border-radius: 5px;
    outline-width: 2px;
  }
`;

export const Search_Bar = styled.div`
  display: flex;
  justify-content: center;
  border-radius: 5px;
  border: 1px solid ${greyWhite};
  padding: 0.1rem;
  margin-bottom: 0.5rem;
`;

interface IWrapper {
  currentProject: Project | undefined;
}

export const Wrapper = styled.div`
  border-radius: 5px;
  position: absolute;
  z-index: 50;
  background-color: ${white};
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.2);
  padding: 0.7rem;
  max-height: 15rem;
  left: ${({ currentProject }: IWrapper) =>
    currentProject ? "-7rem" : "-2.5rem"};
  top: 2rem;
`;

export const Relative_Container = styled.div`
  position: relative;
`;
