import { createAction } from "@reduxjs/toolkit";

import { types } from "./types";
import { Fields } from "./../pages/forms";

export const initAuth = createAction<Fields>(types.GLOBAL_INIT_AUTH);

export const initReAuth = createAction(types.GLOBAL_INIT_RE_AUTH);

export const initLogOut = createAction(types.GLOBAL_INIT_LOGOUT);

export const setIsLoggedIn = createAction<boolean>(
  types.GLOBAL_SET_IS_LOGGED_IN
);

export interface PasswordData {
  current: string;
  newpass: string;
  newpass2: string;
}

export const changePassword = createAction<PasswordData>(
  types.GLOBAL_CHANGE_PASSWORD
);

export const setFormMessage = createAction<[string, boolean]>(
  types.GLOBAL_SET_FORM_MESSAGE
);

export const setIsLoading = createAction<boolean>(types.GLOBAL_SET_IS_LOADING);

export const setIsFetching = createAction<boolean>(
  types.GLOBAL_SET_IS_FETCHING
);

export const setErrorFlag = createAction<boolean>(types.GLOBAL_SET_ERROR_FLAG);

export const requestError = createAction<any>(types.GLOBAL_REQUEST_ERROR);
