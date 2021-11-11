import React, { useState, useReducer } from "react";
import styled from "styled-components";
import format from "date-fns/format";
import intervalToDuration from "date-fns/intervalToDuration";

import {
  GroupedEntries,
  SingleDay,
} from "./../../selectors/groupEntriesByDays";

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

type ProjectState = Record<string, boolean>;

interface Action {
  type: string;
  payload: boolean;
}

const setProjectAction = (type: string, payload: boolean) => ({
  type,
  payload,
});

const projectReducer = (state: ProjectState, action: Action) => ({
  ...state,
  [action.type]: action.payload,
});

export const DayList = ({ data }: Props) => {
  const [isOpen_HeaderWithOutProject, setIsOpen_NoProject] = useState(false);

  const initialState = Object.entries(data.projects).reduce(
    (acc, [projectName]) => {
      acc[projectName] = false;
      return acc;
    },
    {} as ProjectState
  );
  const [projectState, dispatch] = useReducer(projectReducer, initialState);

  const entriesWithoutProject = data.entries.filter((entry) => !entry.project);

  const start = entriesWithoutProject.length
    ? entriesWithoutProject[0].start
    : 0;
  const stop = entriesWithoutProject.length ? entriesWithoutProject[0].stop : 0;

  const getStartAndStopDates = () =>
    entriesWithoutProject.reduce(
      (acc, entry) => {
        if (entry.start < acc.start) acc.start = entry.start;
        if (entry.stop > acc.stop) acc.stop = entry.stop;

        return acc;
      },
      { start, stop }
    );

  const entriesWithoutProjectHeaderData: GroupedEntries = {
    entries: entriesWithoutProject,
    totalDuration: entriesWithoutProject.reduce(
      (acc, entry) => acc + (entry.stop - entry.start),
      0
    ),
    ...getStartAndStopDates(),
  };

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
        {/*append entries without project */}
        {!!entriesWithoutProject.length && (
          <Project_item>
            <Entry_list>
              {entriesWithoutProject.length > 1 && (
                <Entry
                  asEntryHeader={true}
                  size={entriesWithoutProject.length}
                  data={entriesWithoutProjectHeaderData}
                  isOpen={isOpen_HeaderWithOutProject}
                  setIsOpen={setIsOpen_NoProject}
                />
              )}
              {(isOpen_HeaderWithOutProject ||
                entriesWithoutProject.length === 1) &&
                entriesWithoutProject.map((entry) => (
                  <Entry key={entry._id} data={entry} />
                ))}
            </Entry_list>
          </Project_item>
        )}
        {/*append project entries */}
        {Object.entries(data.projects).map(([key, value]) => (
          <Project_item key={value.start}>
            <Entry_list>
              {value.entries.length > 1 && (
                <Entry
                  asEntryHeader={true}
                  size={value.entries.length}
                  data={value}
                  isOpen={projectState[key]}
                  setIsOpen={(v) => dispatch(setProjectAction(key, v))}
                />
              )}
              {(projectState[key] || value.entries.length === 1) &&
                value.entries.map((entry) => (
                  <Entry key={entry._id} data={entry} />
                ))}
            </Entry_list>
          </Project_item>
        ))}
      </Project_list>
    </>
  );
};
