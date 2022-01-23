import React, { useEffect, useState } from "react";
import styled from "styled-components";
import intervalToDuration from "date-fns/intervalToDuration";

import { useStoreDispatch, useStoreSelector } from "../../hooks";
import {
  GroupedEntries,
  groupEntriesByDays,
} from "../../selectors/groupEntriesByDays";
import { formatDurationReadable } from "../reports/helpers";

import { Project } from "../../store/interfaces";

import { fetchEntries } from "../../actions/user";

import { Icon } from "../../components/icon";

import {
  breakPoints,
  darkGrey,
  green,
  greyWhite,
  red,
  whiteGrey,
  white,
  greyWhiteDarker,
} from "../../styles/variables";
import { getBP } from "./../../styles/helpers";
import { ComponentLoader } from "../../components/loader";

const SmallMobileBP = "25em";

const Wrapper = styled.main`
  width: 100%;
  max-width: ${breakPoints.large};
  margin: 1rem auto;
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  padding-top: 0;
  flex-direction: column;

  ${getBP(breakPoints.verySmall)} {
    display: block;
    width: 100%;
    height: 100vh;
    overflow-y: scroll;
    margin: initial;
    padding-top: 1rem;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
`;

const Heading = styled.h2`
  font-size: 2.125rem;
  font-weight: 500;
`;

const Button = styled.button`
  cursor: pointer;
  border: none;
  padding: 0.8rem;
  font-weight: 700;
  font-size: 0.875rem;
  transition: all 0.2s ease-in;
  color: ${white};
  min-width: 8rem;
`;

const Button_Create = styled(Button)`
  background-color: ${green};

  &:hover {
    background-color: #3fa900;
  }
`;

const Button_Remove = styled(Button)`
  background-color: ${red};

  &:hover {
    background-color: #c20000;
  }
`;

const Table_section = styled.section`
  position: relative;
`;

const Table = styled.table`
  border-collapse: collapse;
  table-layout: fixed;
  width: 95%;
  margin: 3rem auto;
`;

const Table_Row = styled.tr`
  border-bottom: 2px solid ${whiteGrey};
  display: flex;
  justify-content: space-between;

  &:hover {
    background-color: #${whiteGrey};
  }
`;

const Table_Row_Header = styled.tr`
  border-bottom: 2px solid ${greyWhite};
  display: flex;
  background-color: ${white};
`;

const TH = styled.th`
  padding: 1rem;
  height: 4.2rem;
  align-items: center;
  justify-content: flex-start;
  display: flex;
  width: 100%;
  color: ${greyWhiteDarker};

  &:first-of-type {
    width: 4rem;
  }

  ${getBP(SmallMobileBP)} {
    padding: 0.7rem;
  }
`;

const TD = styled.td`
  padding: 1rem;
  width: 100%;
  height: 4.2rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  &:first-of-type {
    width: 4rem;
  }

  ${getBP(SmallMobileBP)} {
    padding: 0.7rem;
  }
`;

const No_Entries = styled.td`
  display: block;
  width: 301%;
  text-align: center;
  padding: 1rem;
`;

const Icon_Link = styled.a`
  cursor: pointer;
`;

const Color_Indicator = styled.span`
  display: inline-block;
  width: 0.6rem;
  height: 0.6rem;
  background-color: ${(props) => props.color};
  border-radius: 50%;
  margin-right: 0.5rem;
`;

const Footer = styled.section`
  display: flex;
`;

interface ICheckbox {
  name: string;
  state: State;
  handleFn: (e: any, name: string) => any;
}

const MAIN_CHECKBOX = "mainCheckbox";
const isMainCheckbox = (name: string) => name === MAIN_CHECKBOX;

const CheckBox = ({ name, state, handleFn }: ICheckbox) => {
  const isMainCheckbox = name === MAIN_CHECKBOX;
  const isChecked = isMainCheckbox
    ? state.isMainCheckBoxChecked
    : state.sortedProjects.find((p) => p.name === name)?.isChecked;

  return (
    <>
      <input
        type="checkbox"
        checked={isChecked}
        name={name}
        onChange={(e) => handleFn(e, name)}
      />
      <label htmlFor={name}>
        <span></span>
      </label>
    </>
  );
};

interface ISortable {
  stateFn: any;
  sortBy: string;
}

const Sortable_Panel = ({ stateFn, sortBy }: ISortable) => (
  <div>
    <Icon_Link onClick={() => stateFn("asc", sortBy)}>
      <Icon name="keyboard_arrow_up" />
    </Icon_Link>
    <Icon_Link onClick={() => stateFn("desc", sortBy)}>
      <Icon name="keyboard_arrow_down" />
    </Icon_Link>
  </div>
);

type ProjectDurations = (GroupedEntries & { name: string; fill: string })[];
type SortBy = "name" | "client" | "status";
type SortOrder = "asc" | "desc";

const sortFn =
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

interface State {
  sortedProjects: (Project & { isChecked: boolean })[];
  isMainCheckBoxChecked: boolean;
  sortOrder: SortOrder;
  sortBy: SortBy;
}

export const Projects = () => {
  const dispatch = useStoreDispatch();
  const { isLoading, isFetching } = useStoreSelector((state) => state.global);

  useEffect(() => {
    dispatch(fetchEntries(0));
  }, []);

  const projects = useStoreSelector((state) => state.user.projects);
  const entriesByDays = useStoreSelector(groupEntriesByDays);
  const periodDaysArr = Object.values(entriesByDays);

  const [state, setState] = useState<State>({
    sortedProjects: projects
      .map((p) => ({ ...p, isChecked: false }))
      .sort(sortFn("name", "desc")),
    isMainCheckBoxChecked: false,
    sortOrder: "desc",
    sortBy: "name",
  });

  const getNoProjectDuration = () =>
    periodDaysArr.reduce((acc, day) => {
      return (acc += day.entries
        .filter((entry) => !entry.project)
        .reduce((acc, { start, stop }) => (acc += stop - start), 0));
    }, 0);

  const noProjectDuration = {
    name: "no project",
    fill: greyWhiteDarker,
    totalDuration: getNoProjectDuration(),
  };

  const periodProjectDurations = periodDaysArr.reduce(
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
    [noProjectDuration] as (GroupedEntries & { name: string; fill: string })[]
  );

  const getProjectDuration = (name: string) => {
    const duration =
      periodProjectDurations.find((project) => project.name === name)
        ?.totalDuration || 0;

    const readable = formatDurationReadable(
      intervalToDuration({ start: 0, end: duration })
    );

    return readable === "0 seconds"
      ? { duration, readable: "(Not Started)" }
      : { duration, readable };
  };

  const checkBoxesHandler = (e: any, name: string) => {
    const { checked } = e.target;

    const checkboxProjectIdx = state.sortedProjects.findIndex(
      (project) => project.name === name
    );

    const newState = { ...state };

    if (isMainCheckbox(name)) {
      newState.isMainCheckBoxChecked = checked;
      newState.sortedProjects = newState.sortedProjects.map((project, i) => ({
        ...project,
        isChecked: checked,
      }));
    } else {
      newState.sortedProjects = newState.sortedProjects.map((project, i) => ({
        ...project,
        isChecked: i === checkboxProjectIdx ? checked : project.isChecked,
      }));
    }

    setState(newState);
  };

  const setSortState = (sortOrder: SortOrder, sortBy: SortBy) => {
    const newState = { ...state, sortOrder, sortBy };

    newState.sortedProjects = state.sortedProjects
      .slice()
      .sort(sortFn(sortBy, sortOrder, periodProjectDurations));

    setState(newState);
  };

  return (
    <Wrapper>
      <Header>
        <Heading>Projects</Heading>
        <Button_Create>Create Project</Button_Create>
      </Header>
      <Table_section>
        <ComponentLoader
          isVisible={isLoading || isFetching}
          shouldShowSpinner={isLoading || isFetching}
          shouldShowMessage={false}
          message=""
          fill={greyWhite}
        />
        <Table>
          <tbody>
            <Table_Row_Header>
              <TH>
                <CheckBox
                  state={state}
                  handleFn={checkBoxesHandler}
                  name="mainCheckbox"
                />
              </TH>
              <TH>
                Project
                <Sortable_Panel sortBy={"name"} stateFn={setSortState} />
              </TH>
              <TH>
                Client
                <Sortable_Panel sortBy={"client"} stateFn={setSortState} />
              </TH>
              <TH>
                Status
                <Sortable_Panel sortBy={"status"} stateFn={setSortState} />
              </TH>
            </Table_Row_Header>
            {projects.length ? (
              state.sortedProjects.map((item, i) => (
                <Table_Row key={item.name}>
                  <TD>
                    <CheckBox
                      name={item.name}
                      state={state}
                      handleFn={checkBoxesHandler}
                    />
                  </TD>
                  <TD>
                    <Color_Indicator color={item.color} />
                    {item.name}
                  </TD>
                  <TD>{item.client ? item.client : "(No Client)"}</TD>
                  <TD>{getProjectDuration(item.name).readable}</TD>
                </Table_Row>
              ))
            ) : (
              <tr>
                <No_Entries>
                  Press the 'Create Project' button to get started.
                </No_Entries>
              </tr>
            )}
          </tbody>
        </Table>
      </Table_section>
      <Footer>
        {!!projects.length && (
          <Button_Remove disabled={false ? false : true}>
            Remove Selected
          </Button_Remove>
        )}
      </Footer>
    </Wrapper>
  );
};
