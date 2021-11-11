import { createAction } from "@reduxjs/toolkit";

import { types } from "./types";

export const setIsTimerRunning = createAction<boolean>(
  types.TIMER_SET_IS_RUNNING
);

export const setTimer = createAction<string>(types.TIMER_SET_TIMER);

export const setDescription = createAction<string>(types.TIMER_SET_DESCRIPTION);

export const setBillable = createAction<boolean>(types.TIMER_SET_BILLABLE);

export const setProject = createAction<string>(types.TIMER_SET_PROJECT);
