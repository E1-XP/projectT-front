import React, { useCallback, useState } from "react";
import styled from "styled-components";

import { Icon } from "../../components/icon";

import {
  darkGrey,
  green,
  greyWhite,
  greyWhiteDarker,
  red,
  white,
} from "../../styles/variables";

const Task = styled.section`
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

const Task_timing = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const Task_timing_inner = styled.div`
  display: flex;
  align-items: center;
  width: 11rem;
  margin-left: 2rem;
  margin-right: 0.5rem;
  justify-content: space-between;
`;

const Task_description = styled.input`
  outline-color: transparent;
  flex: 1 1 25%;
  padding: 0.3rem;
  border: none;
  font-size: 1.125rem;
`;

const Task_timer = styled.span`
  color: ${darkGrey};
  font-weight: 500;
  font-size: 1.125rem;
`;

const Task_options = styled.div`
  width: 1.125rem;
  margin-left: -0.5rem;
`;

interface TaskButtonProps {
  isRunning: boolean;
}

const Task_button = styled.a`
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

const Color_indicator = styled.span`
  display: inline-block;
  width: 0.6rem;
  height: 0.6rem;
  background-color: ${(props) => "#" + props.color};
  border-radius: 50%;
  margin-right: 0.5rem;
`;

const Item_link = styled.a`
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const Span_relative = styled.span`
  position: relative;
`;

export const TaskController = () => {
  const [isBillable, setIsBillable] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const handleStartStopBtn = useCallback(
    () => setIsRunning(!isRunning),
    [isRunning]
  );

  const handleIsBillable = useCallback(
    () => setIsBillable(!isBillable),
    [isBillable]
  );

  return (
    <Task>
      <Task_description placeholder="What are you working on?"></Task_description>
      <Task_timing>
        <Span_relative>
          {false && (
            <Item_link>
              <Color_indicator color={red} />
              <span>{"no project"}</span>
            </Item_link>
          )}
          {!false && (
            <Item_link>
              <Icon name="folder" fill={greyWhiteDarker} size="1.25rem" />
            </Item_link>
          )}
        </Span_relative>
        <Task_timing_inner>
          <Item_link onClick={handleIsBillable}>
            <Icon
              name="attach_money"
              size="1.25rem"
              fill={isBillable ? green : greyWhiteDarker}
            />
          </Item_link>
          <Task_timer>{"test"}</Task_timer>
          <Task_button isRunning={isRunning} onClick={handleStartStopBtn}>
            <Icon name={isRunning ? "stop" : "play_arrow"} />
          </Task_button>
          <Task_options>
            {isRunning && (
              <Item_link>
                <Icon name="delete" fill={greyWhiteDarker} size="1rem" />
              </Item_link>
            )}
          </Task_options>
        </Task_timing_inner>
      </Task_timing>
    </Task>
  );
};
