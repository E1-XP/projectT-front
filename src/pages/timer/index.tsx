import React, { lazy, Suspense } from "react";

import { TaskController } from "./taskController";
import { WeekCounter } from "./weekCounter";
const Timeline = lazy(() => import("./timeline"));

import { ComponentLoader } from "../../components/loader";
import { Timer_Wrapper } from "./styles";

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
