import { takeEvery } from "redux-saga/effects";

import { types } from "../actions/types";
import { initAuth } from "./global";

export function* sagas() {
  yield takeEvery(types.GLOBAL_INIT_AUTH, initAuth);
}
