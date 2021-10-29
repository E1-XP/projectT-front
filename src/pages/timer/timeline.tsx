import React from "react";
import styled from "styled-components";
import {
  darkGrey,
  greyWhite,
  greyWhiteDarker,
  white,
} from "../../styles/variables";

import { useStoreSelector } from "./../../hooks";
import { groupEntriesByDays } from "./../../selectors/groupEntriesByDays";

import { DayList } from "./dayList";

const Timeline_wrapper = styled.section``;

const Timeline_list = styled.ul``;

const Timeline_item = styled.li`
  background-color: ${white};
  border-bottom: 1px solid ${greyWhiteDarker};
  border-top: 1px solid ${greyWhite};
  margin-bottom: 2rem;
  color: ${darkGrey};
`;

export const Timeline = () => {
  const entriesByDays = useStoreSelector(groupEntriesByDays);
  console.log(entriesByDays);

  return (
    <Timeline_wrapper>
      <Timeline_list>
        {Object.values(entriesByDays).map((day) => (
          <Timeline_item key={day.start}>
            <DayList data={day} />
          </Timeline_item>
        ))}
      </Timeline_list>
    </Timeline_wrapper>
  );
};
