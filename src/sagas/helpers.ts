import { SagaReturnType, select, take, put } from "redux-saga/effects";
import { requestError } from "../actions/global";
import { RootState } from "../store";

export type StoreSelector = SagaReturnType<() => RootState>;
export type FetchResponse = SagaReturnType<() => Response>;

export function* waitFor(selector: any) {
  try {
    const selectValue: StoreSelector = yield select(selector);
    if (selectValue) return;

    while (true) {
      yield take("*");

      const selectValue: StoreSelector = yield select(selector);
      if (selectValue) return;
    }
  } catch (e) {
    yield put(requestError(e));
  }
}
