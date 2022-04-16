import styled from "styled-components";

import { black, greyWhiteDarker } from "../../../styles/variables";

export const Week_Counter = styled.div`
  text-transform: uppercase;
  font-size: 0.813rem;
  padding: 1.8rem;
  color: ${greyWhiteDarker};
  font-weight: 500;
`;

export const Week_Bar = styled.div`
  background-color: ${greyWhiteDarker};
  width: 100%;
  height: 3px;
  border-radius: 1.5px;
  margin-top: 3rem;
`;

interface IWeekBarPart {
  color: string;
  width: number;
}

export const Week_Bar_Part = styled.div`
  background-color: ${(props: IWeekBarPart) => props.color};
  width: ${(props: IWeekBarPart) => props.width + "%"};
  height: 100%;
  float: left;

  > span {
    color: ${(props: IWeekBarPart) => props.color};
    position: relative;
    display: inline-block;
    bottom: 1.2rem;
    width: 100%;
  }
`;

export const Bar_Text = styled.span`
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Timer = styled.span`
  color: ${black};
`;

export const Tooltip_Container = styled.div`
  > span:not(:last-of-type) {
    margin-right: 0.5rem;
  }
`;

export const overlayStyle = { fontSize: "0.875rem", padding: "0.5rem" };
