import { PayloadAction } from "@reduxjs/toolkit";
import { select, SagaReturnType, call, put } from "redux-saga/effects";
import { insertEntry } from "../actions/entry";
import { setCurrentEntryId } from "../actions/timer";
import { RootState } from "../store";
import { Entry } from "../store/interfaces";

import { config } from "./../config";

type StoreSelector = SagaReturnType<() => RootState>;
type FetchResponse = SagaReturnType<() => Response>;

type NewEntryData = Pick<
  Entry,
  "description" | "billable" | "project" | "start"
>;

const getQueryString = (
  dataObj: Record<string, any>,
  keysToOmit = [] as string[]
) => {
  return Object.entries(dataObj).reduce((acc, [key, value]) => {
    const should =
      !keysToOmit.includes(key) && ![undefined, ""].some((v) => v === value);
    return should ? (acc += `${key}=${value}&`) : acc;
  }, "");
};

const postNewEntry = async (entryData: NewEntryData, userId: string) => {
  const queryString = getQueryString(entryData, ["_id"]);

  const URL = `${config.API_URL}/users/${userId}/entries?${queryString}`;
  console.log(URL);

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
    console.log(action);

    const { _id: userId }: StoreSelector["user"]["userData"] = yield select(
      (state) => state.user.userData
    );
    const currentEntryId: StoreSelector["timer"]["currentEntryId"] =
      yield select((state) => state.timer.currentEntryId);

    if (!currentEntryId) {
      console.log("check this");
      return;
    }

    const response: FetchResponse = yield call(
      postEntryUpdate,
      action.payload,
      userId,
      currentEntryId
    );

    if (response.status === 200) {
      const entryData: Entry = yield response.json();
      yield put(insertEntry(entryData));
    }
  } catch (e) {
    console.log(e);
  }
}
