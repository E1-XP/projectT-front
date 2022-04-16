import React, { useEffect, useState } from "react";

import { Project } from "../../../store/interfaces";
import { useStoreSelector } from "../../../hooks";

import { State } from "..";

import { PeriodProjectDurations } from "../../../helpers";
import { getProjectDuration, SortBy, sortFn, SortOrder } from "../helpers";

import { ComponentLoader } from "../../../components/loader";
import { Icon } from "../../../components/icon";
import { greyWhite } from "../../../styles/variables";
import {
  Icon_Link,
  Table_Section,
  Table,
  Table_Row_Header,
  TH,
  Table_Row,
  TD,
  Color_Indicator,
} from "./style";

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
    <Table_Section>
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
    </Table_Section>
  );
};

export default ProjectsTable;
