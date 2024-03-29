import { createReducer } from "@reduxjs/toolkit";

import {
  setIsFetching,
  setIsLoading,
  setIsLoggedIn,
  setFormMessage,
  setErrorFlag,
} from "./../actions/global";

const initialState = {
  isUserLoggedIn: false,
  isLoading: true,
  isFetching: true,
  formMessage: ["", true] as [string, boolean],
  errorFlag: false,
};

export const globalReducer = createReducer(initialState, (builder) => {
  builder.addCase(setIsLoggedIn, (state, action) => {
    state.isUserLoggedIn = action.payload;
  });
  builder.addCase(setIsFetching, (state, action) => {
    state.isFetching = action.payload;
  });
  builder.addCase(setIsLoading, (state, action) => {
    state.isLoading = action.payload;
  });
  builder.addCase(setErrorFlag, (state, action) => {
    state.errorFlag = action.payload;
  });
  builder.addCase(setFormMessage, (state, action) => {
    state.formMessage = action.payload;
  });
});
