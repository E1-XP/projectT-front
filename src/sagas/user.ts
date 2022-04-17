import { call, put, select } from "redux-saga/effects";
import { PayloadAction, Action } from "@reduxjs/toolkit";
import startOfDay from "date-fns/startOfDay";
import subDays from "date-fns/subDays";
import pickBy from "lodash/fp/pickBy";

import { FetchResponse, StoreSelector } from "./helpers";
import { request } from "../helpers/request";

import { config } from "../config";

import { Entry, Project, UserData } from "../store/interfaces";

import { requestError } from "../actions/global";
import { batchInsertEntry } from "../actions/entry";
import { setProjects, setUserData } from "../actions/user";

import { groupEntriesByDays, SingleDay } from "../selectors/groupEntriesByDays";
import { selectUserData } from "../selectors";

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

const sendAvatarRequest = async (userId: string, data: any) => {
  const URL = `${config.API_URL}/users/${userId}/avatar`;

  return await request(URL, {
    method: "PUT",
    credentials: "include",
    body: data,
  });
};

const avatarRemovalRequest = async (userId: string, avatarURL: string) => {
  const URL = `${config.API_URL}/users/${userId}/avatar`;

  return await request(URL, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ avatarURL }),
  });
};

const requestSendUserData = async (data: Partial<UserData>, userId: string) => {
  const URL = `${config.API_URL}/users/${userId}/`;

  return await request(URL, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export function* fetchEntries(action: PayloadAction<number | undefined>) {
  try {
    const { _id: userId } = yield select(selectUserData);
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
    yield put(requestError(e));
  }
}

export function* createProject(action: PayloadAction<Omit<Project, "_id">>) {
  try {
    const { _id: userId } = yield select(selectUserData);

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
    yield put(requestError(e));
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
    yield put(requestError(e));
  }
}

export function* sendAvatar({ payload }: PayloadAction<any>) {
  try {
    const { _id: userId } = yield select(selectUserData);

    const response: FetchResponse = yield call(
      sendAvatarRequest,
      userId,
      payload
    );

    if (response.status === 200) {
      const data: UserDataResponse = yield response.json();

      const keys = ["entries", "projects"];
      const userDataFiltered = pickBy((_, key) => !keys.includes(key))(
        data
      ) as UserData;

      yield put(setUserData(userDataFiltered));
    }
  } catch (e) {
    yield put(requestError(e));
  }
}

export function* deleteAvatar(action: Action) {
  try {
    const { _id: userId, avatar: avatarURL } = yield select(selectUserData);

    const avatarFileURL = avatarURL.split(config.API_URL_ORIGIN)[1];

    if (!avatarURL || !avatarFileURL) return;

    const response: FetchResponse = yield call(
      avatarRemovalRequest,
      userId,
      avatarFileURL
    );

    if (response.status === 200) {
      const data: UserDataResponse = yield response.json();

      const keys = ["entries", "projects"];
      const userDataFiltered = pickBy((_, key) => !keys.includes(key))(
        data
      ) as UserData;

      yield put(setUserData(userDataFiltered));
    }
  } catch (e) {
    yield put(requestError(e));
  }
}

export function* sendUserData(action: PayloadAction<Partial<UserData>>) {
  try {
    const { _id: userId } = yield select(selectUserData);

    const response: FetchResponse = yield call(
      requestSendUserData,
      action.payload,
      userId
    );

    if (response.status === 200) {
      const data: UserDataResponse = yield response.json();

      yield put(setUserData(data));
    }
  } catch (e) {
    yield put(requestError(e));
  }
}
