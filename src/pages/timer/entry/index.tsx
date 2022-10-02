import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import format from "date-fns/format";
import intervalToDuration from "date-fns/intervalToDuration";
import debounce from "lodash/fp/debounce";

import { Entry as IEntry } from "../../../store/interfaces";
import { GroupedEntries } from "../../../selectors/groupEntriesByDays";

import { green, greyWhiteDarker } from "../../../styles/variables";

import { formatDuration } from "../../../helpers";
import { useStoreDispatch, useStoreSelector } from "../../../hooks";

import { Icon } from "../../../components/icon";
import { EntryDropdown } from "../entryDropdown";
import { ProjectDropdown } from "../projectDropdown";

import {
  createEntryFromExisting,
  initDeleteEntry,
  updateEntry,
} from "../../../actions/entry";
import {
  Wrapper,
  Description_Side,
  Entries_Count,
  Task_Input,
  Timing_Side,
  Item_Link_Toggle,
  Timing_Side_Inner,
  Icon_Hover,
} from "./style";

interface StandardProps {
  data: IEntry;
}

interface HeaderTypeProps {
  size: number;
  asEntryHeader: boolean;
  data: GroupedEntries;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

type Props = HeaderTypeProps | StandardProps;

export const Entry = (props: Props) => {
  const isEntryHeader = ((props: Props): props is HeaderTypeProps =>
    "asEntryHeader" in props && props.asEntryHeader)(props);
  const isRegularEntry = !isEntryHeader;

  const dispatch = useStoreDispatch();

  const [description, setDescription] = useState(
    isRegularEntry
      ? props.data?.description
      : new Set(props.data.entries.map((entry) => entry.description)).size === 1
      ? props.data.entries[0].description
      : ""
  );

  useEffect(
    () => {
      if (isRegularEntry) {
        setDescription(props.data.description);
      }
    },
    isRegularEntry ? [props.data.description] : []
  );

  const postEntry = useCallback(
    debounce(1000)((description) => {
      isRegularEntry
        ? dispatch(updateEntry({ description, _id: props.data._id }))
        : dispatch(
            updateEntry(
              props.data.entries.map(({ _id }) => ({ _id, description }))
            )
          );
    }),
    [description, props.data]
  );

  const setEntryDescription = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const description = e.target.value;
      setDescription(description);

      postEntry(description);
    },
    []
  );

  const startNewEntryFromExisting = useCallback(
    debounce(50)(() => {
      const entryData = isRegularEntry ? props.data : props.data.entries[0];
      dispatch(createEntryFromExisting(entryData));
    }),
    [isRegularEntry ? props.data : props.data.entries[0]]
  );

  const [isMouseOver, setIsMouseOver] = useState(false);

  const onMouseOver = useCallback(() => setIsMouseOver(true), []);
  const onMouseLeave = useCallback(() => setIsMouseOver(false), []);

  const projects = useStoreSelector((store) => store.user.projects);
  const currentProject = projects.find(({ name }) =>
    isEntryHeader
      ? name === props.data.entries[0].project
      : name === props.data.project
  );

  const isBillable = isEntryHeader
    ? props.data.entries.every(({ billable }) => billable)
    : props.data.billable;

  return (
    <Wrapper onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
      <Description_Side isHeader={isEntryHeader}>
        {isEntryHeader && (
          <Entries_Count
            color={props.isOpen ? green : undefined}
            onClick={() => props.setIsOpen(!props.isOpen)}
          >
            {props.size}
          </Entries_Count>
        )}
        <Task_Input
          value={description}
          title={description}
          onChange={setEntryDescription}
          placeholder="Add description"
        />
        <ProjectDropdown
          projects={projects}
          currentProject={currentProject}
          isHovered={isMouseOver}
          onProjectSelect={(project: string) =>
            isRegularEntry
              ? dispatch(updateEntry({ project, _id: props.data._id }))
              : props.data.entries.forEach((entry) =>
                  dispatch(updateEntry({ project, _id: entry._id }))
                )
          }
        />
      </Description_Side>
      <Timing_Side>
        <Item_Link_Toggle
          isActive={isMouseOver}
          onClick={() =>
            isRegularEntry
              ? dispatch(
                  updateEntry({
                    billable: !props.data.billable,
                    _id: props.data._id,
                  })
                )
              : props.data.entries.forEach((entry) =>
                  dispatch(
                    updateEntry({
                      billable: !entry.billable,
                      _id: entry._id,
                    })
                  )
                )
          }
        >
          <Icon
            name="attach_money"
            size="1.25rem"
            fill={isBillable ? green : greyWhiteDarker}
          />
        </Item_Link_Toggle>
        <Timing_Side_Inner>
          <span>
            {`${format(props.data?.start, "H:mm aa")} - ${format(
              props.data?.stop,
              "H:mm aa"
            )}`}
          </span>
          <span>
            {formatDuration(
              intervalToDuration(
                isEntryHeader
                  ? { start: 0, end: props.data.totalDuration }
                  : {
                      start: props.data.start,
                      end: props.data.stop,
                    }
              )
            )}
          </span>
        </Timing_Side_Inner>
        <Item_Link_Toggle
          isActive={isMouseOver}
          onClick={startNewEntryFromExisting}
        >
          <Icon_Hover name="play_arrow" size="2rem" />
        </Item_Link_Toggle>
        <EntryDropdown
          onDelete={() =>
            dispatch(
              initDeleteEntry(
                isEntryHeader
                  ? props.data.entries.map(({ _id }) => _id)
                  : props.data._id
              )
            )
          }
          isHovered={isMouseOver}
        ></EntryDropdown>
      </Timing_Side>
    </Wrapper>
  );
};
