import { takeLatest } from "redux-saga/effects";

import { types } from "../actions/types";
import {
  initAuth,
  initLogOut,
  initReAuth,
  requestError,
  requestUserData,
} from "./global";

import { startTimerInterval } from "./timer";

export function* rootSaga() {
  yield takeLatest(types.GLOBAL_INIT_AUTH, initAuth);
  yield takeLatest(types.GLOBAL_INIT_RE_AUTH, initReAuth);
  yield takeLatest(types.USER_GET_USER_DATA, requestUserData);
  yield takeLatest(types.GLOBAL_INIT_LOGOUT, initLogOut);
  yield takeLatest(types.GLOBAL_FETCH_ERROR, requestError);
  yield takeLatest(types.TIMER_SET_IS_RUNNING, startTimerInterval);
}
