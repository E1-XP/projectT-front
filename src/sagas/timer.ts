import {
  delay,
  put,
  select,
  SagaReturnType,
  call,
} from "@redux-saga/core/effects";
import { Action } from "@reduxjs/toolkit";
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
import {
  createEntry as createEntrySaga,
  updateEntry as updateEntrySaga,
} from "../sagas/entry";

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
        const dayCount = differenceInDays(stop, currentRunningEntry.start);
        let currentDay = currentRunningEntry.start;
        let i = dayCount;

        yield call(updateEntrySaga, {
          type: updateEntry.type,
          payload: {
            stop: endOfDay(currentRunningEntry.start).getTime(),
          },
        });

        currentDay = addDays(currentDay, 1).getTime();

        while (i > 0) {
          yield call(createEntrySaga, {
            type: createEntry.type,
            payload: {
              start: startOfDay(currentDay).getTime(),
              stop: i === 1 ? stop : endOfDay(currentDay).getTime(),
              description,
              billable,
              project,
            },
          });

          i -= 1;

          currentDay = addDays(currentDay, 1).getTime();
        }
      } else
        yield call(updateEntrySaga, {
          type: updateEntry.type,
          payload: {
            stop,
          },
        });

      yield put(setTimer(`0:00:00`));
      yield put(setCurrentEntryId(undefined));
      yield put(setDescription(``));
      yield put(setProject(``));
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
