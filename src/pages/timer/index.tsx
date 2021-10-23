import React from "react";
import styled from "styled-components";

import { TaskController } from "./taskController";

const Timer_wrapper = styled.section`
  width: 100%;
`;

export const Timer = () => (
  <Timer_wrapper>
    <TaskController />
    Timer
  </Timer_wrapper>
);
