import React, { lazy, Suspense } from "react";
import styled from "styled-components";

import { TaskController } from "./taskController";
import { WeekCounter } from "./weekCounter";
const Timeline = lazy(() => import("./timeline"));

import { ComponentLoader } from "../../components/loader";

const Timer_Wrapper = styled.main`
  width: 100%;
  height: 100vh;
  overflow-y: scroll;
`;

export const Timer = () => (
  <Timer_Wrapper>
    <TaskController />
    <WeekCounter />
    <Suspense fallback={<ComponentLoader isVisible={true} />}>
      <Timeline />
    </Suspense>
  </Timer_Wrapper>
);

export default Timer;
