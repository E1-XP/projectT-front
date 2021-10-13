import { put, call, SagaReturnType } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { push } from "connected-react-router";

import { config } from "./../config";
import { history } from "./../routes/history";
import { Fields } from "../pages/form";
import { setIsLoggedIn } from "./../actions/global";

interface AuthResponse {
  message: string;
  userId: string;
}

type FetchResponse = SagaReturnType<() => Response>;
type AuthData = SagaReturnType<() => AuthResponse>;
type UserData = SagaReturnType<() => AuthResponse>;

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

const userDataRequest = async (userId: AuthResponse["userId"]) => {
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
      yield put(setIsLoggedIn(true));

      yield put(push("/dashboard"));

      const userReqResponse: FetchResponse = yield call(
        userDataRequest,
        data.userId
      );

      const userData: AuthData = yield userReqResponse.json();
      console.log(userData);

      if (userReqResponse.status === 200) {
        localStorage.setItem("isAuth", "true");
      }
    }
  } catch (e) {
    console.log("saga error", e);
  }
}
