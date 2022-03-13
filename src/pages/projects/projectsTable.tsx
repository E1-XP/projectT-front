import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { Project } from "../../store/interfaces";
import { useStoreSelector } from "../../hooks";

import { State } from ".";

import { PeriodProjectDurations } from "../../helpers";
import { getProjectDuration, SortBy, sortFn, SortOrder } from "./helpers";

import { ComponentLoader } from "../../components/loader";
import { Icon } from "../../components/icon";

import {
  breakPoints,
  greyWhite,
  red,
  whiteGrey,
  white,
  greyWhiteDarker,
} from "../../styles/variables";
import { getBP } from "./../../styles/helpers";
import { Paragraph } from "../../styles/typography";

interface Props {
  projects: Project[];
  periodProjectDurations: PeriodProjectDurations;
  state: State;
  setState: any;
}

interface ICheckbox {
  name: string;
  state: State;
  handleFn: (e: any, name: string) => any;
}

const SmallMobileBP = "25em";

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

export const ProjectsTable = ({
  projects,
  periodProjectDurations,
  state,
  setState,
}: Props) => {
  const { isLoading, isFetching } = useStoreSelector((state) => state.global);

  const setSortState = (sortOrder: SortOrder, sortBy: SortBy) => {
    const newState = { ...state, sortOrder, sortBy };

    newState.sortedProjects = state.sortedProjects
      .slice()
      .sort(sortFn(sortBy, sortOrder, periodProjectDurations));

    setState(newState);
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

  const formatDuration = (readable: string) =>
    readable.startsWith("0") ? "(Not started)" : readable;

  return (
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
                name={MAIN_CHECKBOX}
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

          {state.sortedProjects.map((item, i) => (
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
              <TD>
                {formatDuration(
                  getProjectDuration(periodProjectDurations, item.name).readable
                )}
              </TD>
            </Table_Row>
          ))}
        </tbody>
      </Table>
    </Table_section>
  );
};

export default ProjectsTable;
