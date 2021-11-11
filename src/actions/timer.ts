import { createAction } from "@reduxjs/toolkit";

import { types } from "./types";

export const setIsTimerRunning = createAction<boolean>(
  types.TIMER_SET_IS_RUNNING
);

export const setTimer = createAction<string>(types.TIMER_SET_TIMER);
