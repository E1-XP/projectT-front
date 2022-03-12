import { createReducer } from "@reduxjs/toolkit";

import { Entry, Project, UserData } from "../store/interfaces";

import {
  setUserData,
  setEntries,
  setProjects,
  setShouldShowTimerOnTitle,
} from "./../actions/user";
import { insertEntry, deleteEntry, batchInsertEntry } from "../actions/entry";

const initialState = {
  userData: {
    avatar: "",
    email: "",
    username: "",
    _id: "",
    settings: {
      shouldShowTimerOnTitle: false,
    },
  },
  entries: [] as Entry[],
  projects: [] as Project[],
};

export const userReducer = createReducer(initialState, (builder) => {
  builder.addCase(setUserData, (state, action) => {
    state.userData = { ...state.userData, ...action.payload };
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
  builder.addCase(batchInsertEntry, (state, action) => {
    action.payload.forEach((entry) => {
      const foundIdx = state.entries.findIndex(
        (item) => entry._id === item._id
      );

      if (foundIdx === -1) state.entries.push(entry);
      else if (foundIdx > -1) state.entries[foundIdx] = entry;
    });

    state.entries = [...state.entries];
  });
  builder.addCase(deleteEntry, (state, action) => {
    state.entries = state.entries.filter(({ _id }) => _id !== action.payload);
  });
  builder.addCase(setProjects, (state, action) => {
    state.projects = action.payload;
  });
  builder.addCase(setShouldShowTimerOnTitle, (state, action) => {
    state.userData.settings.shouldShowTimerOnTitle = action.payload;
  });
});
