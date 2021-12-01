import { takeEvery, takeLatest } from "redux-saga/effects";

import { types } from "../actions/types";
import {
  initAuth,
  initLogOut,
  initReAuth,
  requestError,
  requestUserData,
} from "./global";

import { handleRunningEntry, startTimerInterval } from "./timer";
import {
  createEntry,
  updateEntry,
  removeEntry,
  removeRunningEntry,
} from "./entry";

export function* rootSaga() {
  yield takeLatest(types.GLOBAL_INIT_AUTH, initAuth);
  yield takeLatest(types.GLOBAL_INIT_RE_AUTH, initReAuth);
  yield takeLatest(types.USER_GET_USER_DATA, requestUserData);
  yield takeLatest(types.GLOBAL_INIT_LOGOUT, initLogOut);
  yield takeLatest(types.GLOBAL_FETCH_ERROR, requestError);
  yield takeLatest(types.TIMER_SET_IS_RUNNING, startTimerInterval);
  yield takeEvery(types.ENTRY_CREATE, createEntry);
  yield takeEvery(types.ENTRY_UPDATE, updateEntry);
  yield takeEvery(types.ENTRY_INIT_DELETE, removeEntry);
  yield takeEvery(types.ENTRY_DELETE_CURRENT, removeRunningEntry);
  yield takeLatest(types.TIMER_HANDLE_RUNNING_ENTRY, handleRunningEntry);
}
