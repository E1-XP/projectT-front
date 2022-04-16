import styled from "styled-components";

import {
  black,
  green,
  greyWhiteDarker,
  whiteGrey,
  breakPoints,
} from "../../../styles/variables";
import { getBP } from "../../../styles/helpers";

export const Wrapper = styled.div`
  position: absolute;
  z-index: 1000;
  width: 664px;
  right: 48px;
  top: 35px;
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.25);
  background-color: rgb(239, 242, 247);
  overflow: hidden;

  ${getBP(breakPoints.medium)} {
    width: 332px;
  }

  ${getBP("25em")} {
    right: 0;
  }
`;

export const Period_Selector = styled.nav`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  color: ${greyWhiteDarker};
  padding: 0.8rem;
  font-size: 16px;

  ${getBP(breakPoints.medium)} {
    font-size: 12px;
  }
`;

export const Period_Item = styled.a`
  flex: 1 1 25%;
  cursor: pointer;
  text-align: center;
  padding: 0.5rem;

  &:hover {
    color: ${black};
  }
`;
