import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import format from "date-fns/format";
import intervalToDuration from "date-fns/intervalToDuration";
import debounce from "lodash/fp/debounce";

import { Entry as IEntry } from "../../store/interfaces";
import { GroupedEntries } from "../../selectors/groupEntriesByDays";

import {
  darkGrey,
  green,
  greyWhite,
  greyWhiteDarker,
  whiteGrey,
} from "../../styles/variables";

import { formatDuration } from "./../../helpers";
import { useStoreDispatch, useStoreSelector } from "./../../hooks";

import { Icon } from "./../../components/icon";
import { EntryDropdown } from "./entryDropdown";
import { ProjectDropdown } from "./projectDropdown";

import {
  createEntryFromExisting,
  initDeleteEntry,
  updateEntry,
} from "../../actions/entry";

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

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  margin: auto 0;
  height: 4rem;
  align-items: center;
`;
interface IDescriptionSide {
  isHeader: boolean;
}

const Description_Side = styled.section`
  margin-left: ${({ isHeader }: IDescriptionSide) =>
    isHeader ? "1.5rem" : "4rem"};
  white-space: nowrap;
  display: flex;
  align-items: center;
`;

const Timing_Side = styled.section`
  display: flex;
  align-items: center;
`;

const Entries_Count = styled.span`
  cursor: pointer;
  margin-right: 0.5rem;
  border: 1px solid ${whiteGrey};
  border-radius: 8px;
  padding: 0.3rem 0.6rem;
  background-color: ${({ isOpen }: { isOpen?: boolean }) =>
    isOpen ? greyWhite : "transparent"};
  color: ${({ color }) => color};
  min-width: 2.5 rem;
`;

const Task_Input = styled.input`
  border: none;
  background-color: transparent;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  margin-right: 3px;
  height: 2rem;

  &:focus {
    outline-style: dashed;
    outline-color: lightgrey;
    border-radius: 5px;
    outline-width: 2px;
  }
`;

const Item_Link = styled.a`
  color: ${greyWhite};
  cursor: pointer;
`;

const Timing_Side_Inner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
`;

interface IItem_Link_Toggle {
  isActive: boolean;
}

const Item_Link_Toggle = styled(Item_Link)<IItem_Link_Toggle>`
  opacity: ${(props) => (props.isActive ? "1" : "0")};
  pointer-events: ${(props) => (props.isActive ? "all" : "none")};
  color: ${(props) => (props.isActive ? greyWhiteDarker : whiteGrey)};
  background-color: ${(props) => (props.isActive ? whiteGrey : "transparent")};
  padding: 0.2rem 0.4rem;
  border-radius: 5px;

  &:hover {
    color: ${greyWhiteDarker};
  }
`;

const Icon_Hover = styled(Icon)`
  &:hover {
    color: ${darkGrey};
  }
`;

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
    debounce(500)((description) => {
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
