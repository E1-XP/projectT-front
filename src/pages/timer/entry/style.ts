import styled from "styled-components";

import { Icon } from "../../../components/icon";

import {
  darkGrey,
  green,
  greyWhite,
  greyWhiteDarker,
  whiteGrey,
} from "../../../styles/variables";

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  margin: auto 0;
  height: 4rem;
  align-items: center;
`;
interface IDescriptionSide {
  isHeader: boolean;
}

export const Description_Side = styled.section`
  margin-left: ${({ isHeader }: IDescriptionSide) =>
    isHeader ? "1.5rem" : "4rem"};
  white-space: nowrap;
  display: flex;
  align-items: center;
`;

export const Timing_Side = styled.section`
  display: flex;
  align-items: center;
`;

export const Entries_Count = styled.span`
  cursor: pointer;
  margin-right: 0.5rem;
  border: 1px solid ${whiteGrey};
  border-radius: 8px;
  padding: 0.3rem 0.6rem;
  background-color: ${({ isOpen }: { isOpen?: boolean }) =>
    isOpen ? greyWhite : "transparent"};
  color: ${({ color }) => color};
  min-width: 2.5 rem;
`;

export const Task_Input = styled.input`
  border: none;
  background-color: transparent;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  margin-right: 3px;
  height: 2rem;

  &:focus {
    outline-style: dashed;
    outline-color: lightgrey;
    border-radius: 5px;
    outline-width: 2px;
  }
`;

export const Item_Link = styled.a`
  color: ${greyWhite};
  cursor: pointer;
`;

export const Timing_Side_Inner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
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

export const Icon_Hover = styled(Icon)`
  &:hover {
    color: ${darkGrey};
  }
`;
