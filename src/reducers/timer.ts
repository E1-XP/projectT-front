import { createReducer } from "@reduxjs/toolkit";
import { Entry } from "../store/interfaces";

import {
  setTimer,
  setDuration,
  setIsTimerRunning,
  setBillable,
  setProject,
  setDescription,
  setCurrentEntryId,
} from "./../actions/timer";

const initialState = {
  isRunning: false,
  timer: "0:00:00",
  duration: 0,
  description: "",
  isBillable: false,
  project: "",
  currentEntryId: undefined as undefined | string,
};

export const timerReducer = createReducer(initialState, (builder) => {
  builder.addCase(setIsTimerRunning, (state, action) => {
    state.isRunning = action.payload;
  });
  builder.addCase(setTimer, (state, action) => {
    state.timer = action.payload;
  });
  builder.addCase(setDuration, (state, action) => {
    state.duration = action.payload;
  });
  builder.addCase(setDescription, (state, action) => {
    state.description = action.payload;
  });
  builder.addCase(setBillable, (state, action) => {
    state.isBillable = action.payload;
  });
  builder.addCase(setProject, (state, action) => {
    state.project = action.payload;
  });
  builder.addCase(setCurrentEntryId, (state, action) => {
    state.currentEntryId = action.payload;
  });
});
