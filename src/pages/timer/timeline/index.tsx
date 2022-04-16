import React, { useCallback, useEffect, useState } from "react";

import { fetchEntries } from "../../../actions/user";

import { useStoreDispatch, useStoreSelector } from "../../../hooks";
import { groupEntriesByDays } from "../../../selectors/groupEntriesByDays";

import { DayList } from "../dayList";
import { Spinner } from "../../../components/loader";

import { red } from "../../../styles/variables";
import {
  Timeline_Wrapper,
  Timeline_List,
  Timeline_Item,
  Figure,
  Decoration_Image,
  Loader_Container,
  Button_Load,
  Info_Paragraph,
} from "./style";

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
            src={require("./../../../../public/assets/timer-page.svg").default}
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
