import React from "react";
import styled from "styled-components";
import format from "date-fns/format";
import intervalToDuration from "date-fns/intervalToDuration";

import { Entry as IEntry } from "../../store/interfaces";
import { GroupedEntries } from "../../selectors/groupEntriesByDays";

import {
  breakPoints,
  green,
  greyWhite,
  greyWhiteDarker,
  whiteGrey,
} from "../../styles/variables";
import { Icon } from "./../../components/icon";

import { formatDuration } from "./helpers";
import { useStoreSelector } from "./../../hooks";
import { getBP } from "../../styles/helpers";

interface StandardProps {
  data: IEntry;
}

interface HeaderTypeProps {
  size: number;
  asEntryHeader: boolean;
  data: GroupedEntries;
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  margin: auto 0;
  height: 4rem;
  align-items: center;

  &:hover {
    background-color: ${greyWhite};
  }
`;

const Description_side = styled.section`
  margin-left: 1.5rem;
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
  isOpen?: boolean;
}

const Item_link_toggle = styled(Item_link)`
  opacity: ${(props: IItem_link_toggle) => (props.isOpen ? "1" : "0")};
  pointer-events: none;
  color: ${(props: IItem_link_toggle) =>
    props.isOpen ? greyWhiteDarker : whiteGrey};
  background-color: ${(props: IItem_link_toggle) =>
    props.isOpen ? whiteGrey : "transparent"};
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

type Props = HeaderTypeProps | StandardProps;

function isEntryHeader(props: Props): props is HeaderTypeProps {
  return "asEntryHeader" in props && props.asEntryHeader;
}
export const Entry = (props: Props) => {
  const currentProject = useStoreSelector((store) =>
    store.user.projects.find(({ name }) =>
      isEntryHeader(props)
        ? name === props.data.entries[0].project
        : name === props.data.project
    )
  );

  return (
    <Wrapper>
      <Description_side>
        {isEntryHeader(props) && (
          <EntriesCount onClick={() => props.setIsOpen(!props.isOpen)}>
            {props.size}
          </EntriesCount>
        )}
        <Task_Input
          defaultValue={
            (!isEntryHeader(props) && props.data?.description) || ""
          }
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
        {!isEntryHeader(props) && !currentProject && (
          <Item_link_toggle isOpen={false}>
            <Icon name="folder" size="1.25rem" />
          </Item_link_toggle>
        )}
      </Description_side>
      <Timing_side>
        <Item_link_toggle>
          <Icon name="attach_money" size="1.25rem" fill={green} />
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
        <Item_link_toggle>
          <Icon name="play_arrow" size="2rem" />
        </Item_link_toggle>
      </Timing_side>
    </Wrapper>
  );
};
