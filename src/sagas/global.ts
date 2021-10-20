import { put, call, SagaReturnType } from "redux-saga/effects";
import { PayloadAction, Action } from "@reduxjs/toolkit";
import { push } from "connected-react-router";
import pickBy from "lodash/fp/pickBy";

import { config } from "./../config";
import { history } from "./../routes/history";
import { Fields } from "../pages/forms";
import { setIsLoggedIn, setIsLoading } from "./../actions/global";
import {
  getUserData,
  setEntries,
  setProjects,
  setUserData,
} from "./../actions/user";

import { UserData, Entry, Project } from "./../store/interfaces";

interface AuthData {
  message: string;
  userId: string;
}

interface UserDataResponse {
  avatar: string;
  email: string;
  entries: Entry[];
  projects: Project[];
}

type FetchResponse = SagaReturnType<() => Response>;

const authRequest = async (fields: Fields) => {
  const URL = `${
    config.API_URL
  }/auth${history.location.pathname.toLowerCase()}`;

  return await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(fields),
  });
};

const userDataRequest = async (userId: AuthData["userId"]) => {
  const URL = `${config.API_URL}/users/${userId}`;

  return await fetch(URL, { credentials: "include" });
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
    }
  } catch (e) {
    yield put(push("/500"));
    console.log("saga error", e);
  }
}

export function* requestUserData(action: PayloadAction<string>) {
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
    yield put(setProjects(userData.projects));

    yield put(push("/dashboard"));
    yield put(setIsLoading(false));
  }
}
