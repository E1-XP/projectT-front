import styled from "styled-components";

import {
  darkGrey,
  green,
  greyWhite,
  red,
  white,
} from "../../../styles/variables";

export const Task = styled.section`
  border: 1px solid ${greyWhite};
  border-width: 0 0 2px 0;
  display: flex;
  padding: 1rem;
  justify-content: space-between;
  align-items: center;
  top: 0;
  z-index: 50;
  background-color: ${white};
  height: 4.688rem;
  position: sticky;
`;

export const Task_Timing = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const Task_Timing_Inner = styled.div`
  display: flex;
  align-items: center;
  width: 11rem;
  margin-left: 2rem;
  margin-right: 0.5rem;
  justify-content: space-between;
`;

export const Task_Description = styled.input`
  flex: 1 1 25%;
  padding: 0.3rem;
  margin-right: 1rem;
  border: none;
  font-size: 1.125rem;
  height: 2rem;

  &:focus {
    outline-style: dashed;
    outline-color: lightgrey;
    border-radius: 5px;
    outline-width: 2px;
  }
`;

export const Task_Timer = styled.span`
  color: ${darkGrey};
  font-weight: 500;
  font-size: 1.125rem;
`;

export const Task_Options = styled.div`
  width: 1.125rem;
  margin-left: -0.5rem;
`;

interface TaskButtonProps {
  isRunning: boolean;
}

export const Task_Button = styled.a`
  cursor: pointer;
  color: ${white};
  background-color: ${(props: TaskButtonProps) =>
    props.isRunning ? red : green};
  border-radius: 50%;
  padding: 0.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Item_Link = styled.a`
  cursor: pointer;
  display: flex;
  align-items: center;
`;

export const wrapperStyle = { left: "-12.5rem", top: "1rem" };
