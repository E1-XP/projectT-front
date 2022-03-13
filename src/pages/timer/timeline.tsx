import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import { fetchEntries } from "../../actions/user";

import { useStoreDispatch, useStoreSelector } from "./../../hooks";
import { groupEntriesByDays } from "./../../selectors/groupEntriesByDays";

import { DayList } from "./dayList";
import { Spinner } from "./../../components/loader";

import { getBP } from "../../styles/helpers";
import {
  breakPoints,
  darkGrey,
  greyWhite,
  greyWhiteDarker,
  red,
  white,
} from "../../styles/variables";
import { Paragraph } from "../../styles/typography";

const Timeline_wrapper = styled.section``;

const Timeline_list = styled.ul``;

const Timeline_item = styled.li`
  background-color: ${white};
  border-bottom: 1px solid ${greyWhiteDarker};
  border-top: 1px solid ${greyWhite};
  margin-bottom: 2rem;
  color: ${darkGrey};
`;

const Loader_container = styled.div`
  margin: 1rem auto;
  display: flex;
  justify-content: center;
`;

const Button_load = styled.button`
  background-color: ${white};
  font-weight: 500;
  border: none;
  padding: 1.1rem;
  cursor: pointer;
  border: 1px solid ${red};
  border-radius: 7px;
  min-width: 8rem;
  min-height: 4.1rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const No_Entries_image = styled.img`
  width: 50%;
  margin: 4rem auto;
  display: block;
  user-select: none;
  -webkit-user-drag: none;

  ${getBP(breakPoints.small)} {
    width: 80%;
  }
`;

const Info_paragraph = styled.p`
  ${Paragraph}

  text-align: center;
`;

export const Timeline = () => {
  const dispatch = useStoreDispatch();
  const isFetching = useStoreSelector((state) => state.global.isFetching);
  const entriesByDays = useStoreSelector(groupEntriesByDays);
  const entriesByDaysAsArr = Object.values(entriesByDays);
  console.log(entriesByDays);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoading || !isFetching) setTimeout(() => setIsLoading(false), 300);
  }, [entriesByDays, isFetching]);

  const loadMoreData = useCallback(() => {
    setIsLoading(true);
    dispatch(fetchEntries());
  }, []);

  return (
    <Timeline_wrapper>
      {entriesByDaysAsArr.length ? (
        <Timeline_list>
          {entriesByDaysAsArr.map((day) => (
            <Timeline_item key={day.start}>
              <DayList data={day} />
            </Timeline_item>
          ))}
        </Timeline_list>
      ) : (
        <No_Entries_image
          src={require("./../../../public/assets/timer-page.svg").default}
        />
      )}
      <Loader_container>
        {entriesByDaysAsArr.length ? (
          <Button_load onClick={loadMoreData}>
            {isLoading ? <Spinner fill={red} /> : "Load more"}
          </Button_load>
        ) : (
          <Info_paragraph>
            No entries found. Press timer button to begin time tracking.
          </Info_paragraph>
        )}
      </Loader_container>
    </Timeline_wrapper>
  );
};
