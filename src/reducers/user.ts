import { createReducer } from "@reduxjs/toolkit";
import { Entry, Project } from "../store/interfaces";

import { setUserData, setEntries, setProjects } from "./../actions/user";

const initialState = {
  userData: {},
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
  builder.addCase(setProjects, (state, action) => {
    state.projects = action.payload;
  });
});
