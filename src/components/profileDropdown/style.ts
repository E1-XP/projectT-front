import styled from "styled-components";

import { getBP } from "../../styles/helpers";
import {
  black,
  breakPoints,
  greyWhite,
  greyWhiteDarker,
  red,
  white,
} from "../../styles/variables";

export const Profile_Link = styled.a`
  cursor: pointer;
  position: relative;
  color: ${greyWhiteDarker};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.3rem;
  border-radius: 50%;

  ${getBP(breakPoints.medium, "min")} {
    justify-content: initial;
  }
`;

interface IconProfileProps {
  url: string | null;
}

export const Icon_Profile = styled.span`
  display: flex;
  background-color: ${red};
  background-image: url(${(props: IconProfileProps) => props.url || "none"});
  background-size: cover;
  width: 1.7rem;
  height: 1.7rem;
  font-size: 0.875rem;
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  font-weight: 700;

  ${getBP(breakPoints.medium)} {
    width: 2.2rem;
    height: 2.2rem;
    font-size: 1.2rem;
  }
`;

export const Link_Label = styled.span`
  display: none;

  ${getBP(breakPoints.medium, "min")} {
    display: block;
    margin-right: 1rem;
  }
`;

export const Dropdown = styled.ul`
  position: absolute;
  border: 1px solid ${greyWhiteDarker};
  right: -3px;
  width: 18rem;
  background-color: ${white};
  z-index: 100;
  top: -5.938rem;
  right: -18.438rem;
  border-radius: 7px;

  ${getBP(breakPoints.verySmall)} {
    top: -7.938rem;
    right: 3rem;
    font-size: 1.2rem;
  }
`;

export const Dropdown_Item = styled.li`
  color: ${black};
  padding: 0.6rem;
  text-align: left;

  ${getBP(breakPoints.verySmall)} {
    padding: 0.8rem;
  }

  &:hover {
    background-color: ${greyWhite};
  }

  &:last-child {
    border-radius: 0px 0px 7px 7px;
  }
`;

export const Screen_Blocker = styled.div`
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  background-color: transparent;
  width: 100%;
  height: 100%;
`;

export const Dropdown_Item_Border = styled(Dropdown_Item)`
  border-top: 1px solid ${greyWhiteDarker};
`;

export const Dropdown_Item_Noclick = styled(Dropdown_Item)`
  cursor: default;

  &:hover {
    background-color: initial;
  }
`;
