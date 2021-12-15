import { PayloadAction } from "@reduxjs/toolkit";
import { select, SagaReturnType, call, put } from "redux-saga/effects";

import { insertEntry, deleteEntry } from "../actions/entry";
import {
  setBillable,
  setCurrentEntryId,
  setDescription,
  setIsTimerRunning,
  setProject,
  setTimer,
} from "../actions/timer";

import { RootState } from "../store";
import { Entry } from "../store/interfaces";

import { config } from "./../config";

type StoreSelector = SagaReturnType<() => RootState>;
type FetchResponse = SagaReturnType<() => Response>;

type NewEntryData = Pick<
  Entry,
  "description" | "billable" | "project" | "start"
> & { stop?: number; _id?: string };

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

  return await fetch(URL, { method: "POST", credentials: "include" });
};

const postEntryUpdate = async (
  entryData: Partial<NewEntryData>,
  userId: string,
  currentEntryId: string
) => {
  const queryString = getQueryString(entryData);

  const URL = `${config.API_URL}/users/${userId}/entries/${currentEntryId}?${queryString}`;

  return await fetch(URL, { method: "PUT", credentials: "include" });
};

const postEntryRemove = async (userId: string, entryId: string | string[]) => {
  const entriesId = Array.isArray(entryId) ? JSON.stringify(entryId) : entryId;

  const URL = `${config.API_URL}/users/${userId}/entries/${entriesId}/`;

  return await fetch(URL, { method: "DELETE", credentials: "include" });
};

export function* createEntry(action: PayloadAction<NewEntryData>) {
  try {
    const { _id: userId }: StoreSelector["user"]["userData"] = yield select(
      (state) => state.user.userData
    );

    const response: FetchResponse = yield call(
      postNewEntry,
      action.payload,
      userId
    );

    if (response.status === 200) {
      const entryData: Entry = yield response.json();

      yield put(setCurrentEntryId(entryData._id));
      console.log(entryData);
      yield put(insertEntry(entryData));
    }
  } catch (e) {
    console.log(e);
  }
}

export function* updateEntry(action: PayloadAction<Partial<NewEntryData>>) {
  try {
    const { _id: userId }: StoreSelector["user"]["userData"] = yield select(
      (state) => state.user.userData
    );
    const currentEntryId: StoreSelector["timer"]["currentEntryId"] =
      yield select((state) => state.timer.currentEntryId);

    const entryId = [currentEntryId, action.payload._id].find(Boolean);

    if (!entryId) {
      console.log("check this");
      return;
    }

    const response: FetchResponse = yield call(
      postEntryUpdate,
      action.payload,
      userId,
      entryId
    );

    if (response.status === 200) {
      const entryData: Entry = yield response.json();
      yield put(insertEntry(entryData));
    }
  } catch (e) {
    console.log(e);
  }
}

export function* removeEntry(action: PayloadAction<string | string[]>) {
  try {
    const entryId = action.payload;

    const { _id: userId }: StoreSelector["user"]["userData"] = yield select(
      (state) => state.user.userData
    );

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
    console.log(e);
  }
}

export function* removeRunningEntry(action: PayloadAction<string | string[]>) {
  try {
    const { _id: userId }: StoreSelector["user"]["userData"] = yield select(
      (state) => state.user.userData
    );

    const { currentEntryId }: StoreSelector["timer"] = yield select(
      (state) => state.timer
    );

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
    console.log(e);
  }
}

export function* createEntryFromExisting(action: PayloadAction<Entry>) {
  try {
    const { description, billable, project } = action.payload;

    if (description) yield put(setDescription(description));
    if (billable) yield put(setBillable(billable));
    if (project) yield put(setProject(project));

    yield put(setIsTimerRunning(true));
  } catch (e) {
    console.log(e);
  }
}