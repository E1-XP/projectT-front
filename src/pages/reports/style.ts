import styled from "styled-components";

import {
  breakPoints,
  darkGrey,
  greyWhite,
  whiteGrey,
} from "../../styles/variables";
import { getBP } from "./../../styles/helpers";
import { Heading as HeadingCSS } from "../../styles/typography";

export const Wrapper = styled.main`
  width: 100%;
  max-width: ${breakPoints.large};
  margin: 1rem auto;
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  padding-top: 0;

  ${getBP(breakPoints.verySmall)} {
    display: block;
    width: 100%;
    height: 100vh;
    overflow-y: scroll;
    margin: initial;
    padding-top: 1rem;
  }
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
`;

export const Heading = styled.h2`
  ${HeadingCSS}
`;

export const Heading_Section = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  position: relative;
`;

export const Chart_Section = styled.section`
  flex-basis: 72%;
  min-width: 36.875rem;
  margin-right: 1rem;

  ${getBP("56.25rem")} {
    flex-basis: 100%;
  }

  ${getBP(breakPoints.small)} {
    margin-right: initial;
  }

  ${getBP(breakPoints.verySmall)} {
    min-width: initial;
  }
`;

export const Item_Link = styled.a`
  color: ${darkGrey};
  cursor: pointer;
  display: flex;
  align-items: center;
`;

export const Item_Link_Border = styled(Item_Link)`
  border-right: 1px solid ${whiteGrey};

  & span {
    width: 1.5rem;
    color: ${greyWhite};
    margin-left: 0.3rem;
  }

  &:hover span {
    color: ${darkGrey} !important;
  }
`;

export const Item_Link_Hover = styled(Item_Link)`
  color: ${greyWhite};

  &:hover {
    color: ${darkGrey};
  }
`;

export const Period_Selection = styled.div`
  display: flex;
`;

export const Screen_Blocker = styled.div`
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  background-color: transparent;
  width: 100%;
  height: 100%;
  z-index: 50;
`;
