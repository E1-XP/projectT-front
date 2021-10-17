import { createAction } from "@reduxjs/toolkit";

import { types } from "./types";
import { Fields } from "./../pages/form";

export const initAuth = createAction<Fields>(types.GLOBAL_INIT_AUTH);

export const setIsLoggedIn = createAction<boolean>(
  types.GLOBAL_SET_IS_LOGGED_IN
);
