import { createAction } from "@reduxjs/toolkit";

import { types } from "./types";

export const setIsTimerRunning = createAction<boolean>(
  types.TIMER_SET_IS_RUNNING
);

export const setTimer = createAction<string>(types.TIMER_SET_TIMER);

export const setDuration = createAction<number>(types.TIMER_SET_DURATION);

export const setDescription = createAction<string>(types.TIMER_SET_DESCRIPTION);

export const setBillable = createAction<boolean>(types.TIMER_SET_BILLABLE);

export const setProject = createAction<string>(types.TIMER_SET_PROJECT);

export const setCurrentEntryId = createAction<string | undefined>(
  types.TIMER_SET_CURRENT_ENTRY_ID
);

export const handleRunningEntry = createAction(
  types.TIMER_HANDLE_RUNNING_ENTRY
);
