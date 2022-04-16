import styled from "styled-components";

import {
  breakPoints,
  greyWhite,
  red,
  whiteGrey,
  white,
  greyWhiteDarker,
} from "../../../styles/variables";
import { getBP } from "../../../styles/helpers";
import { Paragraph } from "../../../styles/typography";

export const SmallMobileBP = "25em";

export const Table_Section = styled.section`
  position: relative;
`;

export const Table = styled.table`
  border-collapse: collapse;
  table-layout: fixed;
  width: 95%;
  margin: 3rem auto;
`;

export const Table_Row = styled.tr`
  border-bottom: 2px solid ${whiteGrey};
  display: flex;
  justify-content: space-between;

  &:hover {
    background-color: #${whiteGrey};
  }
`;

export const Table_Row_Header = styled.tr`
  border-bottom: 2px solid ${greyWhite};
  display: flex;
  background-color: ${white};
`;

export const TH = styled.th`
  padding: 1rem;
  height: 4.2rem;
  align-items: center;
  justify-content: flex-start;
  display: flex;
  width: 100%;
  color: ${greyWhiteDarker};

  &:first-of-type {
    width: 4rem;
  }

  ${getBP(SmallMobileBP)} {
    padding: 0.7rem;
  }
`;

export const TD = styled.td`
  padding: 1rem;
  width: 100%;
  height: 4.2rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  &:first-of-type {
    width: 4rem;
  }

  ${getBP(SmallMobileBP)} {
    padding: 0.7rem;
  }
`;

export const Icon_Link = styled.a`
  cursor: pointer;
`;

export const Color_Indicator = styled.span`
  display: inline-block;
  width: 0.6rem;
  height: 0.6rem;
  background-color: ${(props) => props.color};
  border-radius: 50%;
  margin-right: 0.5rem;
`;
