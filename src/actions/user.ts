import { createAction } from "@reduxjs/toolkit";

import { types } from "./types";
import { UserData, Entry, Project } from "./../store/interfaces";

export const getUserData = createAction<string>(types.USER_GET_USER_DATA);

export const setUserData = createAction<UserData>(types.USER_SET_USER_DATA);

export const setEntries = createAction<Entry[]>(types.USER_SET_ENTRIES);

export const fetchEntries = createAction<number | undefined>(
  types.USER_FETCH_ENTRIES
);

export const setProjects = createAction<Project[]>(types.USER_SET_PROJECTS);
