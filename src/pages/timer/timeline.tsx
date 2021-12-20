import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { fetchEntries } from "../../actions/user";
import {
  darkGrey,
  greyWhite,
  greyWhiteDarker,
  red,
  white,
} from "../../styles/variables";

import { useStoreDispatch, useStoreSelector } from "./../../hooks";
import { groupEntriesByDays } from "./../../selectors/groupEntriesByDays";

import { DayList } from "./dayList";
import { Spinner } from "./../../components/loader";

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

export const Timeline = () => {
  const dispatch = useStoreDispatch();
  const isFetching = useStoreSelector((state) => state.global.isFetching);
  const entriesByDays = useStoreSelector(groupEntriesByDays);
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
      <Timeline_list>
        {Object.values(entriesByDays).map((day) => (
          <Timeline_item key={day.start}>
            <DayList data={day} />
          </Timeline_item>
        ))}
      </Timeline_list>
      <Loader_container>
        <Button_load onClick={loadMoreData}>
          {isLoading ? <Spinner /> : "Load more"}
        </Button_load>
      </Loader_container>
    </Timeline_wrapper>
  );
};
