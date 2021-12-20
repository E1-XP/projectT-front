import { createReducer } from "@reduxjs/toolkit";

import {
  setIsFetching,
  setIsLoading,
  setIsLoggedIn,
} from "./../actions/global";

const initialState = {
  isUserLoggedIn: false,
  isLoading: true,
  isFetching: true,
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
});
