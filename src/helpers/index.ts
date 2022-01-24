import { GroupedEntries, SingleDay } from "../selectors/groupEntriesByDays";
import { Project } from "../store/interfaces";
import { greyWhiteDarker } from "../styles/variables";

export const normalize = (str: number | undefined) =>
  `${str}`.length > 1 ? str : `0${str}`;

export const formatDuration = ({ days, hours, minutes, seconds }: Duration) =>
  `${(days || 0) * 24 + (hours || 0)}:${normalize(minutes)}:${normalize(
    seconds
  )}`;

const getNoProjectDuration = (daysArr: SingleDay[]) =>
  daysArr.reduce((acc, day) => {
    return (acc += day.entries
      .filter((entry) => !entry.project)
      .reduce((acc, { start, stop }) => (acc += stop - start), 0));
  }, 0);

export type PeriodProjectDurations = (GroupedEntries & {
  name: string;
  fill: string;
})[];

export const getPeriodProjectDurations = (
  daysArr: SingleDay[],
  projects: Project[]
) => {
  const noProjectDuration = {
    name: "no project",
    fill: greyWhiteDarker,
    totalDuration: getNoProjectDuration(daysArr),
  };

  return daysArr.reduce(
    (acc, day) => {
      Object.entries(day.projects).map(([name, value]) => {
        const getFill = () =>
          projects.find((project) => project.name === name)?.color ||
          greyWhiteDarker;
        const foundProjectIdx = acc.findIndex(
          (project) => project.name === name
        );

        if (foundProjectIdx !== -1) {
          acc[foundProjectIdx].totalDuration += value.totalDuration;
        } else {
          acc.push({ ...value, name, fill: getFill() });
        }
      });
      return acc;
    },
    [noProjectDuration] as PeriodProjectDurations
  );
};

export const getTotalPeriodDuration = (
  projectDurations: PeriodProjectDurations
) =>
  projectDurations.reduce((acc, project) => (acc += project.totalDuration), 0);
