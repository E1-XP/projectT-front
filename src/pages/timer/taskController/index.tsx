import React, { ChangeEvent, useCallback, useState } from "react";
import debounce from "lodash/fp/debounce";

import { green, greyWhiteDarker } from "../../../styles/variables";
import { useStoreDispatch, useStoreSelector } from "../../../hooks";

import { Icon } from "../../../components/icon";
import { ProjectDropdown } from "../projectDropdown";

import {
  setIsTimerRunning,
  setDescription,
  setBillable,
  setProject,
} from "../../../actions/timer";

import { deleteRunningEntry, updateEntry } from "../../../actions/entry";
import {
  Task,
  Task_Description,
  Task_Timing,
  wrapperStyle,
  Task_Timing_Inner,
  Item_Link,
  Task_Timer,
  Task_Button,
  Task_Options,
} from "./style";

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
    debounce(50)(() => dispatch(setIsTimerRunning(!isRunning))),
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
      <Task_Description
        placeholder="What are you working on?"
        value={description}
        onChange={setEntryDescription}
      />
      <Task_Timing>
        <ProjectDropdown
          projects={projects}
          currentProject={currentProjectMatch}
          onProjectSelect={setCurrentProject}
          isHovered={true}
          wrapperStyle={wrapperStyle}
        />

        <Task_Timing_Inner>
          <Item_Link onClick={setIsBillable}>
            <Icon
              name="attach_money"
              size="1.25rem"
              fill={isBillable ? green : greyWhiteDarker}
            />
          </Item_Link>
          <Task_Timer>{timer}</Task_Timer>
          <Task_Button isRunning={isRunning} onClick={handleStartStopBtn}>
            <Icon name={isRunning ? "stop" : "play_arrow"} />
          </Task_Button>
          <Task_Options>
            {isRunning && (
              <Item_Link onClick={deleteEntry}>
                <Icon name="delete" fill={greyWhiteDarker} size="1rem" />
              </Item_Link>
            )}
          </Task_Options>
        </Task_Timing_Inner>
      </Task_Timing>
    </Task>
  );
};
