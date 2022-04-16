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

const Timeline_Wrapper = styled.section``;

const Timeline_List = styled.ul``;

const Timeline_Item = styled.li`
  background-color: ${white};
  border-bottom: 1px solid ${greyWhiteDarker};
  border-top: 1px solid ${greyWhite};
  margin-bottom: 2rem;
  color: ${darkGrey};
`;

const Loader_Container = styled.div`
  margin: 1rem auto;
  display: flex;
  justify-content: center;
`;

const Button_Load = styled.button`
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

const Decoration_Image = styled.img`
  display: block;
  user-select: none;
  -webkit-user-drag: none;

  ${getBP(breakPoints.small)} {
    width: 80%;
  }
`;

const Figure = styled.figure`
  width: 50%;
  margin: 4rem auto;

  & img {
    width: 100%;
  }

  & figcaption {
    margin-top: 0.5rem;
    text-align: center;
    font-size: 0.8rem;
  }
`;

const Info_Paragraph = styled.p`
  ${Paragraph}

  text-align: center;
`;

export const Timeline = () => {
  const dispatch = useStoreDispatch();
  const isFetching = useStoreSelector((state) => state.global.isFetching);
  const entriesByDays = useStoreSelector(groupEntriesByDays);
  const entriesByDaysAsArr = Object.values(entriesByDays);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoading || !isFetching) setTimeout(() => setIsLoading(false), 300);
  }, [entriesByDays, isFetching]);

  const loadMoreData = useCallback(() => {
    setIsLoading(true);
    dispatch(fetchEntries());
  }, []);

  return (
    <Timeline_Wrapper>
      {entriesByDaysAsArr.length ? (
        <Timeline_List>
          {entriesByDaysAsArr.map((day) => (
            <Timeline_Item key={day.start}>
              <DayList data={day} />
            </Timeline_Item>
          ))}
        </Timeline_List>
      ) : (
        <Figure>
          <Decoration_Image
            src={require("./../../../public/assets/timer-page.svg").default}
          />
          <figcaption>
            <a href="https://www.freepik.com/vectors/illustration">
              Illustration vector created by pikisuperstar - www.freepik.com
            </a>
          </figcaption>
        </Figure>
      )}
      <Loader_Container>
        {entriesByDaysAsArr.length ? (
          <Button_Load onClick={loadMoreData}>
            {isLoading ? <Spinner fill={red} /> : "Load more"}
          </Button_Load>
        ) : (
          <Info_Paragraph>
            No entries found. Press timer button to begin time tracking.
          </Info_Paragraph>
        )}
      </Loader_Container>
    </Timeline_Wrapper>
  );
};

export default Timeline;
