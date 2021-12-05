import React from "react";
import styled from "styled-components";
import format from "date-fns/format";
import intervalToDuration from "date-fns/intervalToDuration";

import {
  GroupedEntries,
  SingleDay,
} from "./../../selectors/groupEntriesByDays";
import { Entry as IEntry } from "./../../store/interfaces";

import { formatDuration } from "./../../helpers";
import { EntryGroup } from "./entryGroup";

interface Props {
  data: SingleDay;
}

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin: auto 0.3rem;
  margin-right: 3.3rem;
`;

const Header_date = styled.span`
  font-weight: 700;
`;

const Header_dayCount = styled.span`
  font-weight: 700;
`;

const Project_list = styled.ul``;

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
        <Header_date>{format(data.start, "eee, d MMM")}</Header_date>
        <Header_dayCount>
          {formatDuration(
            intervalToDuration({ start: 0, end: data.totalDuration })
          )}
        </Header_dayCount>
      </Header>
      <Project_list>
        {Object.values(projectEntriesHeaderData).map((groupedArr) =>
          groupedArr.map((data) => <EntryGroup key={data.start} data={data} />)
        )}
        {Object.values(entriesWithoutProjectHeaderData).map((data) => (
          <EntryGroup key={data.start} data={data} />
        ))}
      </Project_list>
    </>
  );
};
