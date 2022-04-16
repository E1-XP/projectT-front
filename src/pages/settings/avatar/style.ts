import styled, { keyframes } from "styled-components";

import {
  breakPoints,
  darkGrey,
  red,
  white,
  whiteGrey,
} from "../../../styles/variables";

export const Avatar_Settings = styled.label`
  cursor: pointer;
  background-color: ${whiteGrey};
  width: 3.438rem;
  display: flex;
  justify-content: center;
  color: ${darkGrey};
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.7rem;
  box-shadow: -1px 1px 12px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: ${whiteGrey};
  }
`;

export const rotateAnim = keyframes`
    from{
        transform:rotate(0deg);
    }

    to{
        transform:rotate(360deg);
    }
`;

export const Avatar_Section = styled.figure`
  position: relative;
`;

export const Avatar_Img = styled.img`
  max-width: 11.25rem;
  padding: 0px;
  border: 1px solid ${whiteGrey};
  position: relative;
`;

export const Avatar_InProgress = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(150, 150, 150, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;

  > span {
    width: 60px;
    height: 60px;
    border: 2px solid transparent;
    border-top: 2px solid ${white};
    border-bottom: 2px solid ${white};
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    animation: ${rotateAnim} 0.7s linear infinite;

    &:after {
      content: "";
      display: block;
      width: 45px;
      height: 45px;
      border: 2px solid transparent;
      border-left: 2px solid ${white};
      border-right: 2px solid ${white};
      border-radius: 50%;
      animation: ${rotateAnim} 0.9s linear infinite;
    }
  }
`;

export const Avatar_Remove = styled.a`
  cursor: pointer;
  transition: all 0.2s ease-in;

  &:hover {
    color: ${red};
  }
`;
