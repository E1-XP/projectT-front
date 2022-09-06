import styled from "styled-components";
import { getBP } from "../../../styles/helpers";
import { white, breakPoints } from "../../../styles/variables";

export const Color_Indicator = styled.span`
  display: inline-block;
  width: 0.6rem;
  height: 0.6rem;
  background-color: ${(props) => props.color};
  border-radius: 50%;
  margin-right: 0.5rem;
`;

export const List_Item = styled.li`
  width: 15rem;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background-color: ${(props: { isCurrentItem: boolean }) =>
    props.isCurrentItem ? "#efeb97" : white};

  ${getBP(breakPoints.small)} {
    width: 13rem;
    font-size: 0.95rem;
  }
`;

export const Wrapper = styled.section`
  width: 100%;
  height: 300px;
  background-color: ${white};
  margin-top: 2rem;
  margin-bottom: 4rem;
  box-shadow: 0 1px 3px rgba(128, 128, 128, 0.2);
  position: relative;

  & > .recharts-legend-wrapper {
    top: 0;
    left: 2rem !important;
    bottom: initial !important;

    ${getBP("25em")} {
      left: 0 !important;
    }
  }
`;
