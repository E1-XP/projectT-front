import { delay, put, select, call } from "@redux-saga/core/effects";
import { Action, PayloadAction } from "@reduxjs/toolkit";
import compose from "lodash/fp/compose";

import isSameDay from "date-fns/isSameDay";
import intervalToDuration from "date-fns/intervalToDuration";
import differenceInDays from "date-fns/differenceInDays";
import startOfDay from "date-fns/startOfDay";
import endOfDay from "date-fns/endOfDay";
import addDays from "date-fns/addDays";

import { formatDuration, formatDurationReadable } from "./../helpers";

import {
  setBillable,
  setCurrentEntryId,
  setDescription,
  setDuration,
  setIsTimerRunning,
  setProject,
  setTimer,
} from "./../actions/timer";
import { createEntry, updateEntry } from "../actions/entry";
import {
  createEntry as createEntrySaga,
  updateEntry as updateEntrySaga,
} from "../sagas/entry";

import { StoreSelector } from "./helpers";

const SECOND = 1000;

export function* startTimerInterval(action: PayloadAction<boolean>) {
  try {
    const {
      duration,
      isRunning,
      description,
      isBillable: billable,
      project,
      currentEntryId,
    }: StoreSelector["timer"] = yield select((state) => state.timer);

    const runningEntryMode = !!currentEntryId;

    let currentRunningEntry;

    if (runningEntryMode) {
      const entries: StoreSelector["user"]["entries"] = yield select(
        (state) => state.user.entries
      );

      currentRunningEntry = entries.find(
        (entry) => entry._id === currentEntryId
      );
      if (currentRunningEntry)
        yield put(setDuration(Date.now() - currentRunningEntry.start));
    }

    let isYielding = isRunning;

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
        const duration: StoreSelector["timer"]["duration"] = yield select(
          (state) => state.timer.duration
        );

        const displayValue = compose(
          formatDuration,
          intervalToDuration
        )({
          start: 0,
          end: duration,
        });

        yield put(setTimer(displayValue));
        yield delay(SECOND);
        yield put(setDuration(duration + SECOND));

        isYielding = yield select((state) => state.timer.isRunning);
      }
    } else {
      const stop = Date.now();

      // should handle multiple days between start/stop
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
      }

      if (currentRunningEntry)
        yield call(updateEntrySaga, {
          type: updateEntry.type,
          payload: {
            stop,
          },
        });

      yield put(setTimer(`0:00:00`));
      yield put(setDuration(0));
      yield put(setDescription(``));
      yield put(setProject(``));
      yield put(setBillable(false));
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

export function* updateTitleBar(action: Action) {
  const STANDARD_TITLE = "Project-T";

  try {
    const settings: StoreSelector["user"]["userData"]["settings"] =
      yield select((state) => state.user.userData.settings);
    const { timer, duration, isRunning, project }: StoreSelector["timer"] =
      yield select((state) => state.timer);

    if (settings.shouldShowTimerOnTitle && isRunning) {
      const readable = formatDurationReadable(
        intervalToDuration({
          start: 0,
          end: duration,
        }),
        true
      );

      document.title = `${readable} ${
        project ? "- " + project : ""
      } | ${STANDARD_TITLE}`;
    } else if (document.title !== STANDARD_TITLE || !isRunning) {
      document.title = STANDARD_TITLE;
    }
  } catch (e) {
    console.log(e);
  }
}
