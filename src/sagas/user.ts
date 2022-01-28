import { call, put, select } from "redux-saga/effects";
import { PayloadAction, Action } from "@reduxjs/toolkit";
import startOfDay from "date-fns/startOfDay";
import subDays from "date-fns/subDays";

import { FetchResponse, StoreSelector } from "./helpers";
import { request } from "../helpers/request";

import { config } from "../config";

import { Entry, Project, UserData } from "../store/interfaces";

import { batchInsertEntry } from "../actions/entry";
import { setProjects } from "../actions/user";

import { groupEntriesByDays, SingleDay } from "../selectors/groupEntriesByDays";

interface UserDataResponse extends UserData {
  projects: Project[];
}

const entriesRequest = async (
  userId: string,
  beginAt: number,
  endAt?: number
) => {
  const queryStr = `?begin=${beginAt}`.concat(
    endAt !== undefined ? `&end=${endAt}` : ``
  );
  const URL = `${config.API_URL}/users/${userId}/entries${queryStr}`;

  return await request(URL, {
    credentials: "include",
  });
};

const projectCreationRequest = async (
  userId: string,
  { name, client, color }: Omit<Project, "_id">
) => {
  const encodedHash = encodeURIComponent(color);
  const queryString = `?name=${name}&color=${encodedHash}&client=${client}`;
  const URL = `${config.API_URL}/users/${userId}/projects/${queryString}`;

  return await request(URL, { method: "POST", credentials: "include" });
};

const projectRemovalRequest = async (userId: string, name: string) => {
  const sName = JSON.stringify(name);
  const URL = `${config.API_URL}/users/${userId}/projects/?name=${sName}`;

  return await request(URL, { method: "DELETE", credentials: "include" });
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

export function* createProject(action: PayloadAction<Omit<Project, "_id">>) {
  try {
    const { _id: userId }: StoreSelector["user"]["userData"] = yield select(
      (state) => state.user.userData
    );

    const response: FetchResponse = yield call(
      projectCreationRequest,
      userId,
      action.payload
    );

    if (response.status === 200) {
      const userData: UserDataResponse = yield response.json();

      yield put(setProjects(userData.projects));
    }
  } catch (e) {
    console.log(e);
  }
}

export function* removeProject(action: PayloadAction<string>) {
  try {
    const { _id: userId }: StoreSelector["user"]["userData"] = yield select(
      (state) => state.user.userData
    );

    const response: FetchResponse = yield call(
      projectRemovalRequest,
      userId,
      action.payload
    );

    if (response.status === 200) {
      const userData: UserDataResponse = yield response.json();

      yield put(setProjects(userData.projects));
    }
  } catch (e) {
    console.log(e);
  }
}
