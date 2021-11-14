import startOfDay from "date-fns/startOfDay";
import isSameDay from "date-fns/isSameDay";
import lightFormat from "date-fns/lightFormat";

import { Entry } from "../store/interfaces";
import { RootState } from "../store";

export interface SingleDay extends GroupedEntries {
  projects: Record<string, GroupedEntries>;
}

export interface GroupedEntries {
  entries: Entry[];
  totalDuration: number;
  start: number;
  stop: number;
}

export const groupEntriesByDays = (state: RootState) =>
  state.user.entries.reduce(groupbyDays, {});

const appendEntryToProject = (
  entry: Entry,
  dayKey: string,
  acc: Record<string, SingleDay>
) => {
  const destinationObj = acc[dayKey].projects[entry.project];
  if (!destinationObj) {
    acc[dayKey].projects[entry.project] = {
      entries: [],
      totalDuration: 0,
      start: entry.start,
      stop: entry.stop,
    };
  }

  acc[dayKey].projects[entry.project].entries.push(entry);

  const entryDuration = entry.stop - entry.start;
  acc[dayKey].projects[entry.project].totalDuration += entryDuration;

  if (entry.start < acc[dayKey].projects[entry.project].start) {
    acc[dayKey].start = entry.start;
  }
  if (entry.stop > acc[dayKey].projects[entry.project].stop) {
    acc[dayKey].stop = entry.stop;
  }

  return acc;
};

const groupbyDays = (acc: Record<string, SingleDay>, entry: Entry) => {
  const dayStart = startOfDay(entry.start);
  const dayKey = lightFormat(dayStart, "yyyy-MM-dd");

  const endsOnSameDay = isSameDay(entry.start, entry.stop);
  if (!endsOnSameDay) console.log("handle this asap");
  if (!entry.stop) return acc;

  if (!acc[dayKey]) {
    acc[dayKey] = {
      entries: [],
      projects: {},
      totalDuration: 0,
      start: entry.start,
      stop: entry.stop,
    };
  }

  acc[dayKey].entries.push(entry);

  const entryDuration = entry.stop - entry.start;
  acc[dayKey].totalDuration += entryDuration;

  if (entry.start < acc[dayKey].start) acc[dayKey].start = entry.start;
  if (entry.stop > acc[dayKey].stop) acc[dayKey].stop = entry.stop;

  if (entry.project) appendEntryToProject(entry, dayKey, acc);

  return acc;
};
