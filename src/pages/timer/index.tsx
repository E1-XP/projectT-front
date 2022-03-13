import React, { lazy, Suspense } from "react";
import styled from "styled-components";

import { TaskController } from "./taskController";
import { WeekCounter } from "./weekCounter";
const Timeline = lazy(() => import("./timeline"));

import { ComponentLoader } from "../../components/loader";

const Timer_wrapper = styled.main`
  width: 100%;
  height: 100vh;
  overflow-y: scroll;
`;

export const Timer = () => (
  <Timer_wrapper>
    <TaskController />
    <WeekCounter />
    <Suspense fallback={<ComponentLoader isVisible={true} />}>
      <Timeline />
    </Suspense>
  </Timer_wrapper>
);

export default Timer;
