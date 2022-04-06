import { put, call, SagaReturnType, select } from "redux-saga/effects";
import { PayloadAction, Action } from "@reduxjs/toolkit";
import {
  push,
  LOCATION_CHANGE,
  LocationChangeAction,
} from "connected-react-router";
import pickBy from "lodash/fp/pickBy";
import mapValues from "lodash/fp/mapValues";

import { config } from "./../config";
import { history } from "./../routes/history";
import { Fields } from "../pages/forms";

import {
  setIsLoggedIn,
  setIsLoading,
  requestError as networkError,
  PasswordData,
  setFormMessage,
  setHasErrored,
} from "./../actions/global";
import {
  getUserData,
  setEntries,
  setProjects,
  setUserData,
} from "./../actions/user";
import { handleRunningEntry } from "../actions/timer";

import { UserData, Entry, Project } from "./../store/interfaces";
import { FetchResponse, StoreSelector } from "./helpers";
import { request } from "../helpers/request";
import { groupEntriesByDays, SingleDay } from "../selectors/groupEntriesByDays";
import { selectUserData } from "../selectors";

import {
  FORM_MESSAGE_ERROR,
  FORM_MESSAGE_SUCCESS,
} from "../pages/forms/validation";

interface AuthData {
  message: string;
  userId: string;
}

interface UserDataResponse extends UserData {
  entries: Entry[];
  projects: Project[];
}

const authRequest = async (fields: Fields) => {
  const URL = `${
    config.API_URL
  }/auth${history.location.pathname.toLowerCase()}`;

  return await request(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(fields),
  });
};

const reAuthRequest = async () => {
  const URL = `${config.API_URL}/auth/refresh`;

  return await request(URL, {
    method: "POST",
    credentials: "include",
  });
};

const logOutRequest = async () => {
  const URL = `${config.API_URL}/auth/logout`;

  return await request(URL, { method: "POST", credentials: "include" });
};

const userDataRequest = async (userId: AuthData["userId"]) => {
  const URL = `${config.API_URL}/users/${userId}`;

  return await request(URL, { credentials: "include" });
};

const passwordChangeRequest = async (
  userId: AuthData["userId"],
  passwordData: PasswordData
) => {
  const URL = `${config.API_URL}/users/${userId}/password`;

  return await request(URL, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(passwordData),
  });
};

export function* initAuth(action: PayloadAction<Fields>) {
  try {
    console.log(action.payload);

    const response: FetchResponse = yield call(authRequest, action.payload);

    const data: AuthData = yield response.json();
    console.log(data);

    if (response.status === 200) {
      yield put(setIsLoading(true));
      yield put(setIsLoggedIn(true));
      yield put(getUserData(data.userId));
    } else {
      yield put(setFormMessage([data.message.concat("."), false]));
    }
  } catch (e) {
    yield put(networkError(e));
  }
}

export function* requestUserData(action: PayloadAction<string>) {
  try {
    const userReqResponse: FetchResponse = yield call(
      userDataRequest,
      action.payload
    );

    const userData: UserDataResponse = yield userReqResponse.json();
    console.log(userData);

    if (userReqResponse.status === 200) {
      localStorage.setItem("isAuth", "true");

      const keys = ["entries", "projects"];
      const userDataFiltered = pickBy((_, key) => !keys.includes(key))(
        userData
      ) as UserData;

      yield put(setUserData(userDataFiltered));
      yield put(setEntries(userData.entries));
      yield put(handleRunningEntry());
      yield put(setProjects(userData.projects));

      yield put(push("/timer"));
      yield put(setIsLoading(false));
    }
  } catch (e) {
    yield put(networkError(e));
  }
}

export function* initReAuth(action: Action) {
  try {
    const isAuth = localStorage.getItem("isAuth");
    if (!isAuth) {
      yield put(setIsLoading(false));
      return;
    }

    const response: FetchResponse = yield call(reAuthRequest);

    if (response.status === 200) {
      const userData: UserDataResponse = yield response.json();

      const keys = ["entries", "projects"];
      const userDataFiltered = pickBy((_, key) => !keys.includes(key))(
        userData
      ) as UserData;

      yield put(setUserData(userDataFiltered));
      yield put(setEntries(userData.entries));
      yield put(handleRunningEntry());
      yield put(setProjects(userData.projects));

      yield put(setIsLoggedIn(true));
      yield put(setIsLoading(false));
    } else yield put(setIsLoading(false));
  } catch (e) {
    yield put(networkError(e));
  }
}

export function* changePassword({ payload }: PayloadAction<PasswordData>) {
  try {
    const { _id: userId } = yield select(selectUserData);

    const response: FetchResponse = yield call(
      passwordChangeRequest,
      userId,
      payload
    );

    if (response.status === 200) {
      const data: { result: boolean } = yield response.json();

      if (!data.result) yield put(setFormMessage([FORM_MESSAGE_ERROR, false]));
      else yield put(setFormMessage([FORM_MESSAGE_SUCCESS, true]));
    } else if (response.status.toString().startsWith("4")) {
      yield put(setFormMessage([FORM_MESSAGE_ERROR, false]));
    }
  } catch (e) {
    yield put(networkError(e));
  }
}

export function* initLogOut(action: Action) {
  try {
    yield put(setIsLoading(true));

    const response: FetchResponse = yield call(logOutRequest);

    localStorage.removeItem("isAuth");

    yield put(setIsLoggedIn(false));
    yield put(setIsLoading(false));

    const userData: StoreSelector["user"]["userData"] = yield select(
      selectUserData
    );

    const cleanedUserData: any = mapValues(() => "")(userData);

    yield put(setUserData(cleanedUserData));
    yield put(setEntries([]));
    yield put(setProjects([]));
  } catch (e) {
    yield put(networkError(e));
  }
}

export function* trimEntriesOnTimerRoute(action: LocationChangeAction) {
  try {
    if (action.payload.location.pathname !== "/timer") return;

    const DAYS_TO_SHOW = 10;

    const entriesByDays: Record<string, SingleDay> = yield select(
      groupEntriesByDays
    );
    const entriesByDaysArr = Object.values(entriesByDays);

    if (entriesByDaysArr.length <= DAYS_TO_SHOW) return;

    const tenDaysOfEntriesAsArr = entriesByDaysArr
      .slice(0, DAYS_TO_SHOW)
      .reduce((acc, day) => acc.concat(day.entries), [] as Entry[]);

    yield put(setEntries(tenDaysOfEntriesAsArr));
  } catch (e) {
    yield put(networkError(e));
  }
}

export function* requestError(action: PayloadAction<any>) {
  console.log("request error", action.payload);

  yield put(setHasErrored(true));
  yield put(push("/500"));
}
