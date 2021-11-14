import { createAction } from "@reduxjs/toolkit";

import { types } from "./types";

import { Entry } from "./../store/interfaces";

export const createEntry = createAction<Partial<Entry>>(types.ENTRY_CREATE);

export const updateEntry = createAction<Partial<Entry>>(types.ENTRY_UPDATE);

export const insertEntry = createAction<Entry>(types.ENTRY_INSERT);

export const initDeleteEntry = createAction<string | string[]>(
  types.ENTRY_INIT_DELETE
);

export const deleteEntry = createAction<string>(types.ENTRY_DELETE);
