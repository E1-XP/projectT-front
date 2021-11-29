import React, { useState, useReducer, Dispatch } from "react";
import styled from "styled-components";
import format from "date-fns/format";
import intervalToDuration from "date-fns/intervalToDuration";
import cloneDeep from "lodash/fp/cloneDeep";

import {
  GroupedEntries,
  SingleDay,
} from "./../../selectors/groupEntriesByDays";
import { Entry as IEntry } from "./../../store/interfaces";

import { Entry } from "./entry";
import { formatDuration } from "./../../helpers";
import { whiteGrey } from "../../styles/variables";

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

const Project_item = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  margin: auto 0;
  align-items: center;

  &:hover {
    background-color: ${whiteGrey};
  }
`;

const Entry_list = styled.ul`
  width: 100%;
`;

type EntryListDisplayState = Record<string, boolean>;
type GroupedEntriesSorted = GroupedEntries & {
  entriesByDescription: IEntry[][];
};

interface Action {
  type: string;
  payload: boolean;
}

const setDisplayListAction = (type: string, payload: boolean) => ({
  type,
  payload,
});

const displayStateReducer = (state: EntryListDisplayState, action: Action) => ({
  ...state,
  [action.type]: action.payload,
});

const projectStateReducer = (
  state: Record<string, EntryListDisplayState>,
  action: Action
) => {
  const [project, description] = action.type.split("@@");

  const updatedState = cloneDeep(state);
  updatedState[project][description] = action.payload;

  return updatedState;
};

export const DayList = ({ data }: Props) => {
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

  const entriesWithoutProjectHeaderData = getHeaderData(entriesWithoutProject);
  const projectEntriesHeaderData = Object.entries(projectEntries).reduce(
    (acc, [key, value]) => {
      acc[key] = getHeaderData(value.entriesByDescription);
      return acc;
    },
    {} as Record<string, GroupedEntries[]>
  );

  const initNoProjectState = Object.values(
    entriesWithoutProjectHeaderData
  ).reduce((acc, data) => {
    acc[data.entries[0].description] = false;
    return acc;
  }, {} as EntryListDisplayState);

  const [noProjectState, dispatch] = useReducer(
    displayStateReducer,
    initNoProjectState
  );

  const initialProjectState = Object.entries(projectEntriesHeaderData).reduce(
    (acc, [key, groupedArr]) => {
      acc[key] = groupedArr.reduce((acc, grouped) => {
        acc[grouped.entries[0].description] = false;
        return acc;
      }, {} as EntryListDisplayState);

      return acc;
    },
    {} as Record<string, EntryListDisplayState>
  );

  const [projectDisplayState, projectDisplayDispatch] = useReducer(
    projectStateReducer,
    initialProjectState
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
        {/*append project entries */}
        {Object.entries(projectEntriesHeaderData).map(
          ([projectKey, groupedArr]) =>
            groupedArr.map((grouped) => (
              <Project_item key={grouped.start}>
                <Entry_list>
                  {grouped.entries.length > 1 && (
                    <Entry
                      asEntryHeader={true}
                      size={grouped.entries.length}
                      data={grouped}
                      isOpen={
                        projectDisplayState[projectKey][
                          grouped.entries[0].description
                        ]
                      }
                      setIsOpen={(v) =>
                        projectDisplayDispatch(
                          setDisplayListAction(
                            `${projectKey}@@${grouped.entries[0].description}`,
                            v
                          )
                        )
                      }
                    />
                  )}
                  {(projectDisplayState[projectKey][
                    grouped.entries[0].description
                  ] ||
                    grouped.entries.length === 1) &&
                    grouped.entries.map((entry) => (
                      <Entry key={entry._id} data={entry} />
                    ))}
                </Entry_list>
              </Project_item>
            ))
        )}
        {/*append entries without project */}
        {!!entriesWithoutProject.length &&
          entriesWithoutProjectHeaderData.map((data) => (
            <Project_item key={data.entries[0].start}>
              <Entry_list>
                {data.entries.length > 1 && (
                  <Entry
                    asEntryHeader={true}
                    size={data.entries.length}
                    data={data}
                    isOpen={noProjectState[data.entries[0].description]}
                    setIsOpen={(v) =>
                      dispatch(
                        setDisplayListAction(data.entries[0].description, v)
                      )
                    }
                  />
                )}
                {(noProjectState[data.entries[0].description] ||
                  data.entries.length === 1) &&
                  data.entries.map((entry) => (
                    <Entry key={entry._id} data={entry} />
                  ))}
              </Entry_list>
            </Project_item>
          ))}
      </Project_list>
    </>
  );
};
