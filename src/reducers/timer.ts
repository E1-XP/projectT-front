import { createReducer } from "@reduxjs/toolkit";

import { setTimer, setIsTimerRunning } from "./../actions/timer";

const initialState = {
  isRunning: false,
  timer: "0:00:00",
};

export const timerReducer = createReducer(initialState, (builder) => {
  builder.addCase(setIsTimerRunning, (state, action) => {
    state.isRunning = action.payload;
  });
  builder.addCase(setTimer, (state, action) => {
    state.timer = action.payload;
  });
});
