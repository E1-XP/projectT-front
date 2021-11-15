import {
  delay,
  put,
  select,
  SagaReturnType,
  call,
} from "@redux-saga/core/effects";
import { Action, PayloadAction } from "@reduxjs/toolkit";
import compose from "lodash/fp/compose";

import isSameDay from "date-fns/isSameDay";
import intervalToDuration from "date-fns/intervalToDuration";
import differenceInDays from "date-fns/differenceInDays";
import startOfDay from "date-fns/startOfDay";
import endOfDay from "date-fns/endOfDay";
import addDays from "date-fns/addDays";

import { formatDuration } from "./../helpers";

import { RootState } from "../store";
import {
  setBillable,
  setCurrentEntryId,
  setDescription,
  setIsTimerRunning,
  setProject,
  setTimer,
} from "./../actions/timer";
import { createEntry, updateEntry } from "../actions/entry";

type StoreSelector = SagaReturnType<() => RootState>;

const SECOND = 1000;

export function* startTimerInterval(action: Action, runningEntryMode = false) {
  try {
    const {
      isRunning,
      description,
      isBillable: billable,
      project,
      currentEntryId,
    }: StoreSelector["timer"] = yield select((state) => state.timer);

    const runningEntryMode = !!currentEntryId;
    let duration = 0;
    let currentRunningEntry;

    if (runningEntryMode) {
      const entries: StoreSelector["user"]["entries"] = yield select(
        (state) => state.user.entries
      );

      currentRunningEntry = entries.find(
        (entry) => entry._id === currentEntryId
      );
      if (currentRunningEntry)
        duration = Date.now() - currentRunningEntry.start;
    }

    let isYielding = true;

    if (isRunning) {
      const start = Date.now();

      if (!runningEntryMode)
        yield put(
          createEntry({
            start,
            description,
            billable,
            project,
          })
        );

      while (isYielding) {
        const displayValue = compose(
          formatDuration,
          intervalToDuration
        )({
          start: 0,
          end: duration,
        });

        yield put(setTimer(displayValue));
        yield delay(SECOND);
        duration += SECOND;

        isYielding = yield select((state) => state.timer.isRunning);
      }
    } else {
      const stop = Date.now();

      if (
        runningEntryMode &&
        currentRunningEntry &&
        !isSameDay(currentRunningEntry.start, stop)
      ) {
        const dayCount = differenceInDays(currentRunningEntry.start, stop);
        let currDay = currentRunningEntry.start;
        let i = dayCount;

        yield put(
          updateEntry({
            stop: endOfDay(currentRunningEntry.start).getMilliseconds(),
          })
        );
        i -= 1;
        currDay = addDays(currDay, 1).getMilliseconds();

        while (i) {
          yield put(
            createEntry({
              start: startOfDay(currDay).getMilliseconds(),
              stop: i === 1 ? stop : endOfDay(currDay).getMilliseconds(),
              description,
              billable,
              project,
            })
          );

          i -= 1;
          currDay = addDays(currDay, 1).getMilliseconds();
        }
      } else
        yield put(
          updateEntry({
            stop,
          })
        );

      yield put(setTimer(`0:00:00`));
      yield put(setCurrentEntryId(undefined));
    }
  } catch (e) {
    console.log(e);
  }
}

export function* handleRunningEntry(action: Action) {
  try {
    const entries: StoreSelector["user"]["entries"] = yield select(
      (state) => state.user.entries
    );

    const runningEntry = entries.find((entry) => !entry.stop);
    if (runningEntry) {
      const { description, project, billable, _id } = runningEntry;

      if (description) yield put(setDescription(description));
      if (project) yield put(setProject(project));
      if (billable) yield put(setBillable(billable));

      yield put(setCurrentEntryId(_id));
      yield put(setIsTimerRunning(true));
    }
  } catch (e) {
    console.log(e);
  }
}
