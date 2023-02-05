import React from "react";
import format from "date-fns/format";
import isToday from "date-fns/isToday";
import isYesterday from "date-fns/isYesterday";

import intervalToDuration from "date-fns/intervalToDuration";

import {
  GroupedEntries,
  SingleDay,
} from "../../../selectors/groupEntriesByDays";
import { Entry as IEntry } from "../../../store/interfaces";

import { formatDuration } from "../../../helpers";
import { EntryGroup } from "../entryGroup/entryGroup";

import { Header, Header_Date, Header_DayCount, Project_List } from "./style";

interface Props {
  data: SingleDay;
}

type GroupedEntriesSorted = GroupedEntries & {
  entriesByDescription: IEntry[][];
};

const getEntriesSortedByDescription = (entries: IEntry[]) =>
  entries.reduce((acc, entry) => {
    const arrIdxCandidate = acc.findIndex(
      (innerArr) => innerArr[0].description === entry.description
    );
    if (arrIdxCandidate === -1) acc.push([]);
    const arrIdx = arrIdxCandidate >= 0 ? arrIdxCandidate : acc.length - 1;

    acc[arrIdx].push(entry);

    return acc;
  }, [] as IEntry[][]);

const getStartAndStopDates = (entries: IEntry[]) =>
  entries.reduce(
    (acc, entry) => {
      if (entry.start < acc.start) acc.start = entry.start;
      if (entry.stop > acc.stop) acc.stop = entry.stop;

      return acc;
    },
    {
      start: entries.length ? entries[0].start : 0,
      stop: entries.length ? entries[0].stop : 0,
    }
  );

const getHeaderData = (entriesArr: IEntry[][]) =>
  entriesArr.reduce((acc, entries) => {
    acc.push({
      entries,
      totalDuration: entries.reduce(
        (acc, entry) => acc + (entry.stop - entry.start),
        0
      ),
      ...getStartAndStopDates(entries),
    });
    return acc;
  }, [] as GroupedEntries[]);

const getReadableDate = (date: number) => {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";

  return format(date, "eee, d MMM");
};

export const DayList = ({ data }: Props) => {
  const entriesWithoutProject = getEntriesSortedByDescription(
    data.entries.filter((entry) => !entry.project)
  );

  const projectEntries = Object.entries(data.projects).reduce(
    (acc, [key, value]) => {
      acc[key] = {
        ...value,
        entriesByDescription: getEntriesSortedByDescription(value.entries),
      };
      return acc;
    },
    {} as Record<string, GroupedEntriesSorted>
  );

  const entriesWithoutProjectHeaderData = getHeaderData(entriesWithoutProject);
  const projectEntriesHeaderData = Object.entries(projectEntries).reduce(
    (acc, [key, value]) => {
      acc[key] = getHeaderData(value.entriesByDescription);
      return acc;
    },
    {} as Record<string, GroupedEntries[]>
  );

  return (
    <>
      <Header>
        <Header_Date>{getReadableDate(data.start)}</Header_Date>
        <Header_DayCount>
          {formatDuration(
            intervalToDuration({ start: 0, end: data.totalDuration })
          )}
        </Header_DayCount>
      </Header>
      <Project_List>
        {Object.values(projectEntriesHeaderData).map((groupedArr) =>
          groupedArr.map((data) => <EntryGroup key={data.start} data={data} />)
        )}
        {Object.values(entriesWithoutProjectHeaderData).map((data) => (
          <EntryGroup key={data.start} data={data} />
        ))}
      </Project_List>
    </>
  );
};
