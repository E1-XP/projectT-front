import { Channel } from "redux-saga";
import { call, take, actionChannel } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";

import { types } from "../actions/types";
import { startTimerInterval } from "./timer";

export function* watchTimerInterval() {
  const channel: Channel<PayloadAction<boolean>> = yield actionChannel(
    types.TIMER_SET_IS_RUNNING
  );

  while (true) {
    const action: PayloadAction<boolean> = yield take(channel);
    yield call(startTimerInterval, action);
  }
}
