import { createReducer } from "@reduxjs/toolkit";

import { Entry, Project, UserData } from "../store/interfaces";

import { setUserData, setEntries, setProjects } from "./../actions/user";
import { insertEntry } from "../actions/entry";

const initialState = {
  userData: {
    avatar: "",
    email: "",
    username: "",
    _id: "",
  },
  entries: [] as Entry[],
  projects: [] as Project[],
};

export const userReducer = createReducer(initialState, (builder) => {
  builder.addCase(setUserData, (state, action) => {
    state.userData = action.payload;
  });
  builder.addCase(setEntries, (state, action) => {
    state.entries = action.payload;
  });
  builder.addCase(insertEntry, (state, action) => {
    const foundIdx = state.entries.findIndex(
      (entry) => entry._id === action.payload._id
    );

    if (foundIdx > -1) state.entries[foundIdx] = action.payload;
    else state.entries.unshift(action.payload);
  });
  builder.addCase(setProjects, (state, action) => {
    state.projects = action.payload;
  });
});
