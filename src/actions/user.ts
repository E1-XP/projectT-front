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

export const createProject = createAction<Omit<Project, "_id">>(
  types.USER_CREATE_PROJECT
);

export const removeProject = createAction<string>(types.USER_REMOVE_PROJECT);

export const uploadAvatar = createAction<any>(types.USER_UPLOAD_AVATAR);

export const removeAvatar = createAction(types.USER_REMOVE_AVATAR);
