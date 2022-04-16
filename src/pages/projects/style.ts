import styled from "styled-components";

import { breakPoints } from "../../styles/variables";
import { getBP } from "./../../styles/helpers";
import { Heading as HeadingCSS, Paragraph } from "../../styles/typography";

export const Wrapper = styled.main`
  width: 100%;
  max-width: ${breakPoints.large};
  margin: 1rem auto;
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  padding-top: 0;
  flex-direction: column;

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

export const Decoration_Image = styled.img`
  display: block;
  user-select: none;
  -webkit-user-drag: none;

  ${getBP(breakPoints.small)} {
    width: 80%;
  }
`;

export const Figure = styled.figure`
  width: 50%;
  margin: 4rem auto;

  & img {
    width: 100%;
  }

  & figcaption {
    margin-top: 0.5rem;
    text-align: center;
    font-size: 0.8rem;
  }
`;

export const No_Entries = styled.p`
  ${Paragraph}

  display: block;
  padding: 1rem;
  text-align: center;
`;

export const Footer = styled.section`
  display: flex;
`;
