import { createAction } from "@reduxjs/toolkit";

import { types } from "./types";
import { Fields } from "./../pages/forms";

export const initAuth = createAction<Fields>(types.GLOBAL_INIT_AUTH);

export const initReAuth = createAction(types.GLOBAL_INIT_RE_AUTH);

export const initLogOut = createAction(types.GLOBAL_INIT_LOGOUT);

export const setIsLoggedIn = createAction<boolean>(
  types.GLOBAL_SET_IS_LOGGED_IN
);

export const setIsLoading = createAction<boolean>(types.GLOBAL_SET_IS_LOADING);

export const fetchError = createAction<any>(types.GLOBAL_FETCH_ERROR);
