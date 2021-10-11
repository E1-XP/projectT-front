import { createReducer } from "@reduxjs/toolkit";

import { setIsLoggedIn } from "./../actions/global";

const initialState = {
  isUserLoggedIn: false,
};

export const globalReducer = createReducer(initialState, (builder) => {
  builder.addCase(setIsLoggedIn, (state, action) => {
    console.log("reducer runs", action.payload);

    state.isUserLoggedIn = action.payload;
  });
});
