import intervalToDuration from "date-fns/intervalToDuration";
import { PeriodProjectDurations, formatDurationReadable } from "../../helpers";

import { GroupedEntries } from "../../selectors/groupEntriesByDays";
import { Project } from "../../store/interfaces";

export type ProjectDurations = (GroupedEntries & {
  name: string;
  fill: string;
})[];
export type SortBy = "name" | "client" | "status";
export type SortOrder = "asc" | "desc";

export const sortFn =
  (sortBy: SortBy, sortOrder: SortOrder, projectData?: ProjectDurations) =>
  (first: Project, second: Project) => {
    const getValue = (v: Project, sortBy: "name" | "client") =>
      v[sortBy].toLowerCase();

    type Value = string | number;
    let a: Value, b: Value;

    if (sortBy !== "status") {
      a = getValue(first, sortBy);
      b = getValue(second, sortBy);
    } else if (sortBy === "status" && projectData) {
      a = projectData.find((p) => p.name === first.name)?.totalDuration || 0;
      b = projectData.find((p) => p.name === second.name)?.totalDuration || 0;
    } else return 0;

    switch (sortOrder) {
      case "desc":
        return a > b ? -1 : 1;

      case "asc":
        return b > a ? -1 : 1;
    }
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
