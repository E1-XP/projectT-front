import {
  delay,
  put,
  select,
  SagaReturnType,
  call,
} from "@redux-saga/core/effects";
import { Action } from "@reduxjs/toolkit";
import compose from "lodash/fp/compose";

import intervalToDuration from "date-fns/intervalToDuration";
import { formatDuration } from "./../helpers";

import { RootState } from "../store";
import { setTimer } from "./../actions/timer";

type StoreSelector = SagaReturnType<() => RootState>;

export function* startTimerInterval(action: Action) {
  try {
    const isRunning: StoreSelector["timer"]["isRunning"] = yield select(
      (state) => state.timer.isRunning
    );

    let duration = 0;
    let isYielding = true;

    if (isRunning) {
      const tStamp = Date.now();

      while (isYielding) {
        const displayValue = compose(
          formatDuration,
          intervalToDuration
        )({
          start: 0,
          end: duration,
        });

        yield put(setTimer(displayValue));
        yield delay(1000);
        duration += 1000;

        isYielding = yield select((state) => state.timer.isRunning);
      }
    } else {
      const tStamp = Date.now();
      yield put(setTimer(`0:00:00`));
    }
  } catch (e) {
    console.log(e);
  }
}
