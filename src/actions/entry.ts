import { createAction } from "@reduxjs/toolkit";

import { types } from "./types";

import { Entry } from "./../store/interfaces";

export const createEntry = createAction<Partial<Entry>>(types.ENTRY_CREATE);

export const createEntryFromExisting = createAction<Entry>(
  types.ENTRY_CREATE_FROM_EXISTING
);

export const updateEntry = createAction<Partial<Entry> | Partial<Entry>[]>(
  types.ENTRY_UPDATE
);

export const insertEntry = createAction<Entry>(types.ENTRY_INSERT);

export const batchInsertEntry = createAction<Entry[]>(types.ENTRY_INSERT_BATCH);

export const initDeleteEntry = createAction<string | string[]>(
  types.ENTRY_INIT_DELETE
);

export const deleteEntry = createAction<string>(types.ENTRY_DELETE);

export const deleteRunningEntry = createAction(types.ENTRY_DELETE_CURRENT);
