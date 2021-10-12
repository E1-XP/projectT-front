import { put, call, SagaReturnType } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { push } from "connected-react-router";

import { config } from "./../config";
import { history } from "./../routes/history";
import { Fields } from "../pages/form";
import { setIsLoggedIn } from "./../actions/global";

const URL = `${config.API_URL}/auth${history.location.pathname.toLowerCase()}`;

interface AuthResponse {
  message: string;
  userId: string;
}

type APIResponse = SagaReturnType<() => Response>;
type Data = SagaReturnType<() => AuthResponse>;

const authRequest = async (fields: Fields) => {
  return await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fields),
  });
};

export function* initAuth(action: PayloadAction<Fields>) {
  try {
    console.log(action.payload);

    const response: APIResponse = yield call(authRequest, action.payload);

    if (response.status === 200) {
      yield put(setIsLoggedIn(true));
      yield put(push("/dashboard"));
    }

    const data: Data = yield response.json();
    console.log(data);
  } catch (e) {
    console.log("saga error", e);
  }
}
