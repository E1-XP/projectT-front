import { GroupedEntries, SingleDay } from "../selectors/groupEntriesByDays";
import { Project } from "../store/interfaces";
import { greyWhiteDarker } from "../styles/variables";

export const normalize = (str: number | undefined) =>
  `${str}`.length > 1 ? str : `0${str}`;

export const formatDuration = ({ days, hours, minutes, seconds }: Duration) =>
  `${(days || 0) * 24 + (hours || 0)}:${normalize(minutes)}:${normalize(
    seconds
  )}`;

const getNoProjectDuration = (
  daysArr: SingleDay[],
  timerDuration: number,
  currentProject: string
) =>
  daysArr.reduce((acc, day) => {
    return (acc += day.entries
      .filter((entry) => !entry.project)
      .reduce((acc, { start, stop }) => (acc += stop - start), 0));
  }, 0) + (!currentProject ? timerDuration : 0);

export type PeriodProjectDurations = (GroupedEntries & {
  name: string;
  fill: string;
})[];

export const NO_PROJECT_PLACEHOLDER = "no project";

export const getPeriodProjectDurations = (
  daysArr: SingleDay[],
  projects: Project[],
  timerDuration: number,
  currentProject: string
) => {
  const noProjectDuration = {
    name: NO_PROJECT_PLACEHOLDER,
    fill: greyWhiteDarker,
    totalDuration: getNoProjectDuration(daysArr, timerDuration, currentProject),
  };

  const getFill = (name: string) =>
    projects.find((project) => project.name === name)?.color || greyWhiteDarker;

  const producedData = daysArr
    .reduce(
      (acc, day) => {
        Object.entries(day.projects).map(([name, value]) => {
          const foundProjectIdx = acc.findIndex(
            (project) => project.name === name
          );

          if (foundProjectIdx !== -1) {
            acc[foundProjectIdx].totalDuration += value.totalDuration;
          } else {
            acc.push({
              ...value,
              name,
              fill: getFill(name),
              totalDuration: value.totalDuration,
            });
          }
        });
        return acc;
      },
      [noProjectDuration] as PeriodProjectDurations
    )
    .map((project) => {
      if (project.name === currentProject)
        project.totalDuration += timerDuration;

      return project;
    });

  if (
    currentProject &&
    timerDuration &&
    !producedData.find((project) => project.name === currentProject)
  ) {
    producedData.push({
      name: currentProject,
      fill: getFill(currentProject),
      totalDuration: timerDuration,
      entries: [],
      start: 0,
      stop: 0,
    });
  }

  return producedData;
};

export const getTotalPeriodDuration = (
  projectDurations: PeriodProjectDurations
) =>
  projectDurations.reduce((acc, project) => (acc += project.totalDuration), 0);

export const formatDurationReadable = (
  { days, hours, minutes, seconds }: Duration,
  shortForm = false
) => {
  if (hours || days) {
    const total = (days || 0) * 24 + (hours || 0);
    return `${total}${(shortForm && ":" + normalize(minutes)) || ""} hour${
      total > 1 ? "s" : ""
    }`;
  }

  if (minutes)
    return `${shortForm ? normalize(minutes) : minutes}${
      (shortForm && ":" + normalize(seconds)) || ""
    } ${"minute".slice(0, shortForm ? 3 : undefined)}${
      !shortForm && minutes > 1 ? "s" : ""
    }`;

  return `${seconds || 0} ${"second".slice(0, shortForm ? 3 : undefined)}${
    (!shortForm && (seconds || 0)) > 1 ? "s" : ""
  }`;
};
