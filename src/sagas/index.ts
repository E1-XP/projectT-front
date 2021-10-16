import { takeLatest } from "redux-saga/effects";

import { types } from "../actions/types";
import { initAuth, requestUserData } from "./global";

export function* rootSaga() {
  yield takeLatest(types.GLOBAL_INIT_AUTH, initAuth);
  yield takeLatest(types.USER_GET_USER_DATA, requestUserData);
}
