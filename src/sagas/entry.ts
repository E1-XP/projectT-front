import { PayloadAction } from "@reduxjs/toolkit";
import { select, call, put, take } from "redux-saga/effects";

import { insertEntry, deleteEntry, batchInsertEntry } from "../actions/entry";
import {
  setBillable,
  setCurrentEntryId,
  setDescription,
  setIsTimerRunning,
  setProject,
  setTimer,
} from "../actions/timer";

import { Entry } from "../store/interfaces";
import { RootState } from "./../store";
import { FetchResponse, StoreSelector, waitFor } from "./helpers";

import { config } from "./../config";

import { request } from "../helpers/request";
import { types } from "../actions/types";
import { requestError } from "../actions/global";

import { selectTimer, selectUserData } from "../selectors";

type NewEntryData = Pick<
  Entry,
  "description" | "billable" | "project" | "start"
> & { stop?: number; _id?: string };

type UpdatedEntryData = Pick<
  Entry,
  "description" | "billable" | "project" | "start" | "stop"
> & { _id: string };

type PartialEntryWithId = Partial<UpdatedEntryData> &
  Pick<UpdatedEntryData, "_id">;

const getQueryString = (
  dataObj: Record<string, any>,
  keysToOmit = [] as string[]
) => {
  return Object.entries(dataObj).reduce((acc, [key, value]) => {
    const should = !keysToOmit.includes(key);
    return should ? (acc += `${key}=${value}&`) : acc;
  }, "");
};

const postNewEntry = async (entryData: NewEntryData, userId: string) => {
  const queryString = getQueryString(entryData, ["_id"]);

  const URL = `${config.API_URL}/users/${userId}/entries?${queryString}`;

  return await request(URL, { method: "POST", credentials: "include" });
};

const postEntryUpdate = async (
  entryData: Partial<UpdatedEntryData>[],
  userId: string
) => {
  const URL = `${config.API_URL}/users/${userId}/entries/`;

  return await request(URL, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(entryData),
  });
};

const postEntryRemove = async (userId: string, entryId: string | string[]) => {
  const entriesId = Array.isArray(entryId) ? entryId : [entryId];

  const URL = `${config.API_URL}/users/${userId}/entries/`;

  return await request(URL, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(entriesId),
  });
};

export function* createEntry(action: PayloadAction<NewEntryData>) {
  try {
    const { _id: userId } = yield select(selectUserData);

    const response: FetchResponse = yield call(
      postNewEntry,
      action.payload,
      userId
    );

    if (response.status === 200) {
      const entryData: Entry = yield response.json();

      if (action.payload.stop === undefined) {
        yield put(setCurrentEntryId(entryData._id));
      }
      yield put(insertEntry(entryData));
    }
  } catch (e) {
    yield put(requestError(e));
  }
}

export function* updateEntry({
  payload,
}: PayloadAction<PartialEntryWithId | PartialEntryWithId[]>) {
  try {
    const { _id: userId } = yield select(selectUserData);

    const entryData = Array.isArray(payload) ? payload : [payload];

    const response: FetchResponse = yield call(
      postEntryUpdate,
      entryData,
      userId
    );

    if (response.status === 200) {
      const entryData: Entry | Entry[] = yield response.json();

      if (Array.isArray(entryData)) yield put(batchInsertEntry(entryData));
      else yield put(insertEntry(entryData));
    }
  } catch (e) {
    yield put(requestError(e));
  }
}

export function* removeEntry(action: PayloadAction<string | string[]>) {
  try {
    const entryId = action.payload;

    const { _id: userId } = yield select(selectUserData);

    const response: FetchResponse = yield call(
      postEntryRemove,
      userId,
      entryId
    );

    if (response.status === 200) {
      const forcedArray = Array.isArray(entryId) ? entryId : [entryId];

      for (const id of forcedArray) {
        yield put(deleteEntry(id));
      }
    }
  } catch (e) {
    yield put(requestError(e));
  }
}

export function* removeRunningEntry(action: PayloadAction<string | string[]>) {
  try {
    const { _id: userId } = yield select((state) => state.user.userData);

    const { currentEntryId } = yield select(selectTimer);

    if (!currentEntryId) return;

    const response: FetchResponse = yield call(
      postEntryRemove,
      userId,
      currentEntryId
    );

    if (response.status === 200) {
      yield put(deleteEntry(currentEntryId));
      yield put(setIsTimerRunning(false));
    }
  } catch (e) {
    yield put(requestError(e));
  }
}

export function* createEntryFromExisting(action: PayloadAction<Entry>) {
  try {
    const { description, billable, project } = action.payload;
    const { isRunning } = yield select(selectTimer);

    if (isRunning) {
      yield put(setIsTimerRunning(false));
      yield take(types.TIMER_SET_CURRENT_ENTRY_ID);
    }

    if (description) yield put(setDescription(description));
    if (billable) yield put(setBillable(billable));
    if (project) yield put(setProject(project));

    if (isRunning) {
      yield call(
        waitFor,
        (state: RootState) => state.timer.isRunning === false
      );
    }

    yield put(setIsTimerRunning(true));
  } catch (e) {
    yield put(requestError(e));
  }
}
