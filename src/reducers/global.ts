import { createReducer } from "@reduxjs/toolkit";

import { setIsLoading, setIsLoggedIn } from "./../actions/global";

const initialState = {
  isUserLoggedIn: false,
  isLoading: true,
};

export const globalReducer = createReducer(initialState, (builder) => {
  builder.addCase(setIsLoggedIn, (state, action) => {
    state.isUserLoggedIn = action.payload;
  });
  builder.addCase(setIsLoading, (state, action) => {
    state.isLoading = action.payload;
  });
});
