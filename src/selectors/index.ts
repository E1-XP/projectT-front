import { RootState } from "../store";

export const selectUserData = (state: RootState) => state.user.userData;

export const selectEntries = (state: RootState) => state.user.entries;

export const selectTimer = (state: RootState) => state.timer;

export const selectGlobal = (state: RootState) => state.global;
