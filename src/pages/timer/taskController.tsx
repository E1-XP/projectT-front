import React, { ChangeEvent, useCallback, useState } from "react";
import styled from "styled-components";
import debounce from "lodash/fp/debounce";

import {
  darkGrey,
  green,
  greyWhite,
  greyWhiteDarker,
  red,
  white,
} from "../../styles/variables";
import { useStoreDispatch, useStoreSelector } from "../../hooks";

import { Icon } from "../../components/icon";
import { ProjectDropdown } from "./projectDropdown";

import {
  setIsTimerRunning,
  setDescription,
  setBillable,
  setProject,
} from "../../actions/timer";

import { deleteRunningEntry, updateEntry } from "./../../actions/entry";

const Task = styled.section`
  border: 1px solid ${greyWhite};
  border-width: 0 0 2px 0;
  display: flex;
  padding: 1rem;
  justify-content: space-between;
  align-items: center;
  top: 0;
  z-index: 50;
  background-color: ${white};
  height: 4.688rem;
  position: sticky;
`;

const Task_timing = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const Task_timing_inner = styled.div`
  display: flex;
  align-items: center;
  width: 11rem;
  margin-left: 2rem;
  margin-right: 0.5rem;
  justify-content: space-between;
`;

const Task_description = styled.input`
  flex: 1 1 25%;
  padding: 0.3rem;
  border: none;
  font-size: 1.125rem;
`;

const Task_timer = styled.span`
  color: ${darkGrey};
  font-weight: 500;
  font-size: 1.125rem;
`;

const Task_options = styled.div`
  width: 1.125rem;
  margin-left: -0.5rem;
`;

interface TaskButtonProps {
  isRunning: boolean;
}

const Task_button = styled.a`
  cursor: pointer;
  color: ${white};
  background-color: ${(props: TaskButtonProps) =>
    props.isRunning ? red : green};
  border-radius: 50%;
  padding: 0.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Item_link = styled.a`
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const wrapperStyle = { left: "-12.5rem", top: "1rem" };

export const TaskController = () => {
  const dispatch = useStoreDispatch();

  const {
    isRunning,
    timer,
    description,
    isBillable,
    currentEntryId,
    project: currentProject,
  } = useStoreSelector((store) => store.timer);

  const projects = useStoreSelector((store) => store.user.projects);

  const handleStartStopBtn = useCallback(
    () => dispatch(setIsTimerRunning(!isRunning)),
    [isRunning]
  );

  const postEntryDescription = useCallback(
    debounce(300)((description: string, entryId) => {
      currentEntryId && dispatch(updateEntry({ description, _id: entryId }));
    }),
    [currentEntryId]
  );

  const setEntryDescription = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      dispatch(setDescription(e.currentTarget.value));
      postEntryDescription(e.currentTarget.value, currentEntryId);
    },
    [currentEntryId]
  );

  const setIsBillable = useCallback(() => {
    dispatch(setBillable(!isBillable));
    currentEntryId &&
      dispatch(updateEntry({ billable: !isBillable, _id: currentEntryId }));
  }, [isBillable, currentEntryId]);

  const currentProjectMatch = projects.find(
    (project) => project.name === currentProject
  );

  const setCurrentProject = useCallback(
    (project: string) => {
      dispatch(setProject(project));
      currentEntryId && dispatch(updateEntry({ project, _id: currentEntryId }));
    },
    [currentEntryId]
  );

  const deleteEntry = useCallback(() => dispatch(deleteRunningEntry()), []);

  return (
    <Task>
      <Task_description
        placeholder="What are you working on?"
        value={description}
        onChange={setEntryDescription}
      />
      <Task_timing>
        <ProjectDropdown
          projects={projects}
          currentProject={currentProjectMatch}
          onProjectSelect={setCurrentProject}
          isHovered={true}
          wrapperStyle={wrapperStyle}
        />

        <Task_timing_inner>
          <Item_link onClick={setIsBillable}>
            <Icon
              name="attach_money"
              size="1.25rem"
              fill={isBillable ? green : greyWhiteDarker}
            />
          </Item_link>
          <Task_timer>{timer}</Task_timer>
          <Task_button isRunning={isRunning} onClick={handleStartStopBtn}>
            <Icon name={isRunning ? "stop" : "play_arrow"} />
          </Task_button>
          <Task_options>
            {isRunning && (
              <Item_link onClick={deleteEntry}>
                <Icon name="delete" fill={greyWhiteDarker} size="1rem" />
              </Item_link>
            )}
          </Task_options>
        </Task_timing_inner>
      </Task_timing>
    </Task>
  );
};
