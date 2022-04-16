import styled from "styled-components";

import { getBP } from "../../../styles/helpers";
import {
  breakPoints,
  darkGrey,
  greyWhite,
  greyWhiteDarker,
  red,
  white,
} from "../../../styles/variables";
import { Paragraph } from "../../../styles/typography";

export const Timeline_Wrapper = styled.section``;

export const Timeline_List = styled.ul``;

export const Timeline_Item = styled.li`
  background-color: ${white};
  border-bottom: 1px solid ${greyWhiteDarker};
  border-top: 1px solid ${greyWhite};
  margin-bottom: 2rem;
  color: ${darkGrey};
`;

export const Loader_Container = styled.div`
  margin: 1rem auto;
  display: flex;
  justify-content: center;
`;

export const Button_Load = styled.button`
  background-color: ${white};
  font-weight: 500;
  border: none;
  padding: 1.1rem;
  cursor: pointer;
  border: 1px solid ${red};
  border-radius: 7px;
  min-width: 8rem;
  min-height: 4.1rem;
  display: flex;
  justify-content: center;
  align-items: center;
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

export const Info_Paragraph = styled.p`
  ${Paragraph}

  text-align: center;
`;
