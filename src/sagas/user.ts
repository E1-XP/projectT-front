import { call, put, select } from "redux-saga/effects";
import { PayloadAction, Action } from "@reduxjs/toolkit";
import startOfDay from "date-fns/startOfDay";
import subDays from "date-fns/subDays";

import { FetchResponse, StoreSelector } from "./helpers";

import { config } from "../config";
import { Entry } from "../store/interfaces";
import { batchInsertEntry } from "../actions/entry";
import { groupEntriesByDays, SingleDay } from "../selectors/groupEntriesByDays";

import { request } from "../helpers/request";

const entriesRequest = async (
  userId: string,
  beginAt: number,
  endAt?: number
) => {
  const queryStr = `?begin=${beginAt}`.concat(endAt ? `&end=${endAt}` : ``);
  const URL = `${config.API_URL}/users/${userId}/entries${queryStr}`;

  return await request(URL, {
    credentials: "include",
  });
};

export function* fetchEntries(action: PayloadAction<number | undefined>) {
  try {
    const { _id: userId }: StoreSelector["user"]["userData"] = yield select(
      (state) => state.user.userData
    );
    const entriesByDays: Record<string, SingleDay> = yield select(
      groupEntriesByDays
    );

    const firstDayEndTime = Object.values(entriesByDays)
      .map((day) => day.stop)
      .sort((a: number, b: number) => a - b)[0];

    const startOfPreviousDay = subDays(
      startOfDay(firstDayEndTime),
      1
    ).getTime();

    const response: FetchResponse = yield call(
      entriesRequest,
      userId,
      startOfPreviousDay,
      action.payload
    );
    if (response.status === 200) {
      const data: Entry[] = yield response.json();

      yield put(batchInsertEntry(data));
    }
  } catch (e) {
    console.log(e);
  }
}
