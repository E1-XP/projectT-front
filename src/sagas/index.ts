import { takeEvery, takeLatest } from "redux-saga/effects";
import { LOCATION_CHANGE } from "connected-react-router";

import { types } from "../actions/types";
import {
  initAuth,
  initLogOut,
  initReAuth,
  changePassword,
  requestError,
  requestUserData,
  trimEntriesOnTimerRoute,
} from "./global";
import {
  handleRunningEntry,
  startTimerInterval,
  updateTitleBar,
} from "./timer";
import {
  createEntry,
  createEntryFromExisting,
  updateEntry,
  removeEntry,
  removeRunningEntry,
} from "./entry";
import {
  createProject,
  deleteAvatar,
  fetchEntries,
  removeProject,
  sendAvatar,
  sendUserData,
} from "./user";

export function* rootSaga() {
  yield takeLatest(types.GLOBAL_INIT_AUTH, initAuth);
  yield takeLatest(types.GLOBAL_INIT_RE_AUTH, initReAuth);
  yield takeLatest(types.USER_GET_USER_DATA, requestUserData);
  yield takeLatest(types.USER_SEND_USER_DATA, sendUserData);
  yield takeLatest(types.GLOBAL_INIT_LOGOUT, initLogOut);
  yield takeLatest(types.GLOBAL_CHANGE_PASSWORD, changePassword);
  yield takeLatest(types.GLOBAL_FETCH_ERROR, requestError);
  yield takeLatest(types.USER_FETCH_ENTRIES, fetchEntries);
  yield takeLatest(types.USER_CREATE_PROJECT, createProject);
  yield takeLatest(types.USER_REMOVE_PROJECT, removeProject);
  yield takeLatest(types.USER_UPLOAD_AVATAR, sendAvatar);
  yield takeLatest(types.USER_REMOVE_AVATAR, deleteAvatar);
  yield takeEvery(types.ENTRY_CREATE_FROM_EXISTING, createEntryFromExisting);
  yield takeEvery(types.ENTRY_CREATE, createEntry);
  yield takeEvery(types.ENTRY_UPDATE, updateEntry);
  yield takeEvery(types.ENTRY_INIT_DELETE, removeEntry);
  yield takeEvery(types.ENTRY_DELETE_CURRENT, removeRunningEntry);
  yield takeLatest(types.TIMER_SET_IS_RUNNING, startTimerInterval);
  yield takeLatest(types.TIMER_SET_TIMER, updateTitleBar);
  yield takeLatest(types.TIMER_HANDLE_RUNNING_ENTRY, handleRunningEntry);
  yield takeLatest(LOCATION_CHANGE, trimEntriesOnTimerRoute);
}
