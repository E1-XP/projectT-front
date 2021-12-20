import { SagaReturnType } from "redux-saga/effects";
import { RootState } from "../store";

export type StoreSelector = SagaReturnType<() => RootState>;
export type FetchResponse = SagaReturnType<() => Response>;
