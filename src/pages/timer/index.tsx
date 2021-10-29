import React from "react";
import styled from "styled-components";

import { TaskController } from "./taskController";
import { Timeline } from "./timeline";

const Timer_wrapper = styled.main`
  width: 100%;
`;

export const Timer = () => (
  <Timer_wrapper>
    <TaskController />
    <Timeline />
  </Timer_wrapper>
);
