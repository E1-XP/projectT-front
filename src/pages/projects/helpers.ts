import intervalToDuration from "date-fns/intervalToDuration";
import { PeriodProjectDurations, formatDurationReadable } from "../../helpers";

import { GroupedEntries } from "../../selectors/groupEntriesByDays";

export type ProjectDurations = (GroupedEntries & {
  name: string;
  fill: string;
})[];
export type SortBy = "name" | "client" | "status";
export type SortOrder = "asc" | "desc";

export const sortFn =
  (sortBy: SortBy, sortOrder: SortOrder, projectData?: ProjectDurations) =>
  (a: any, b: any) => {
    if (sortBy === "name") {
      a = a.name.toLowerCase();
      b = b.name.toLowerCase();
    } else if (sortBy === "client") {
      a = a.client.toLowerCase();
      b = b.client.toLowerCase();
    } else if (sortBy === "status" && projectData) {
      a = projectData.find((p) => p.name === a.name)?.totalDuration || 0;
      b = projectData.find((p) => p.name === b.name)?.totalDuration || 0;
    }

    let boolArg;
    switch (sortOrder) {
      case "desc":
        boolArg = a > b;
        break;
      case "asc":
        boolArg = b > a;
        break;
    }

    return boolArg ? -1 : !boolArg ? 1 : 0;
  };

export const getProjectDuration = (
  projectDurations: PeriodProjectDurations,
  name: string
) => {
  const duration =
    projectDurations.find((project) => project.name === name)?.totalDuration ||
    0;

  const readable = formatDurationReadable(
    intervalToDuration({ start: 0, end: duration })
  );

  return readable === "0 seconds"
    ? { duration, readable: "(Not Started)" }
    : { duration, readable };
};
