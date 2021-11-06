import React, { useCallback, useState } from "react";
import styled from "styled-components";
import format from "date-fns/format";
import intervalToDuration from "date-fns/intervalToDuration";

import { Entry as IEntry } from "../../store/interfaces";
import { GroupedEntries } from "../../selectors/groupEntriesByDays";

import {
  black,
  breakPoints,
  darkGrey,
  green,
  greyWhite,
  greyWhiteDarker,
  whiteGrey,
} from "../../styles/variables";

import { formatDuration } from "./helpers";
import { useStoreSelector } from "./../../hooks";
import { getBP } from "../../styles/helpers";

import { Icon } from "./../../components/icon";
import { EntryDropdown } from "./entryDropdown";

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

const Description_side = styled.section`
  margin-left: ${({ isHeader }: IDescriptionSide) =>
    isHeader ? "1.5rem" : "4rem"};
  white-space: nowrap;
`;

const Timing_side = styled.section`
  display: flex;
  align-items: center;
`;

const EntriesCount = styled.span`
  cursor: pointer;
  margin-right: 0.5rem;
  border: 1px solid ${whiteGrey};
  border-radius: 8px;
  padding: 0.3rem 0.6rem;
  background-color: ${({ isOpen }: { isOpen?: boolean }) =>
    isOpen ? greyWhite : "transparent"};
  color: ${({ color }) => color};
`;

const Task_Input = styled.input`
  border: none;
  outline-color: transparent;
  background-color: transparent;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  margin-right: 3px;
`;

const Item_link = styled.a`
  color: ${greyWhite};
  cursor: pointer;
`;

const Timing_side_inner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
`;

interface IItem_link_toggle {
  isActive: boolean;
}

const Item_link_toggle = styled(Item_link)`
  opacity: ${(props: IItem_link_toggle) => (props.isActive ? "1" : "0")};
  pointer-events: ${(props: IItem_link_toggle) =>
    props.isActive ? "all" : "none"};
  color: ${(props: IItem_link_toggle) =>
    props.isActive ? greyWhiteDarker : whiteGrey};
  background-color: ${(props: IItem_link_toggle) =>
    props.isActive ? whiteGrey : "transparent"};
  padding: 0.2rem 0.4rem;
  border-radius: 5px;

  &:hover {
    color: ${greyWhiteDarker};
  }
`;

const Color_indicator = styled.span`
  display: inline-block;
  width: 0.6rem;
  height: 0.6rem;
  background-color: ${(props) => props.color};
  border-radius: 50%;
  margin-right: 0.5rem;
`;

const Item_project = styled.span`
  color: ${({ color }) => color};

  ${getBP(breakPoints.small)} {
    display: none;
  }
`;

const Icon_hover = styled(Icon)`
  &:hover {
    color: ${darkGrey};
  }
`;

type Props = HeaderTypeProps | StandardProps;

export const Entry = (props: Props) => {
  const isEntryHeader = (props: Props): props is HeaderTypeProps => {
    return "asEntryHeader" in props && props.asEntryHeader;
  };

  const isRegularEntry = !isEntryHeader(props);

  const [isMouseOver, setIsMouseOver] = useState(false);

  const onMouseOver = useCallback(() => setIsMouseOver(true), []);
  const onMouseLeave = useCallback(() => setIsMouseOver(false), []);

  const currentProject = useStoreSelector((store) =>
    store.user.projects.find(({ name }) =>
      isEntryHeader(props)
        ? name === props.data.entries[0].project
        : name === props.data.project
    )
  );

  const isBillable = isEntryHeader(props)
    ? props.data.entries.every(({ billable }) => billable)
    : props.data.billable;

  return (
    <Wrapper onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
      <Description_side isHeader={isEntryHeader(props)}>
        {isEntryHeader(props) && (
          <EntriesCount onClick={() => props.setIsOpen(!props.isOpen)}>
            {props.size}
          </EntriesCount>
        )}
        <Task_Input
          defaultValue={(isRegularEntry && props.data?.description) || ""}
          placeholder="Add description"
        />
        {currentProject && (
          <Item_link>
            <Color_indicator color={`#${currentProject?.color}`} />
            <Item_project color={`#${currentProject?.color}`}>
              {currentProject.name}
            </Item_project>
          </Item_link>
        )}
        {!currentProject && (
          <Item_link_toggle isActive={isMouseOver}>
            <Icon name="folder" size="1.25rem" />
          </Item_link_toggle>
        )}
      </Description_side>
      <Timing_side>
        <Item_link_toggle isActive={isMouseOver}>
          <Icon
            name="attach_money"
            size="1.25rem"
            fill={isBillable ? green : greyWhiteDarker}
          />
        </Item_link_toggle>
        <Timing_side_inner>
          <span>
            {`${format(props.data?.start, "H:mm aa")} - ${format(
              props.data?.stop,
              "H:mm aa"
            )}`}
          </span>
          <span>
            {formatDuration(
              intervalToDuration({
                start: props.data.start,
                end: props.data.stop,
              })
            )}
          </span>
        </Timing_side_inner>
        <Item_link_toggle isActive={isMouseOver}>
          <Icon_hover name="play_arrow" size="2rem" />
        </Item_link_toggle>
        <EntryDropdown isHovered={isMouseOver}></EntryDropdown>
      </Timing_side>
    </Wrapper>
  );
};
