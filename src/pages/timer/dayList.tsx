Header_dateimport React from "react";
import styled from "styled-components";
import format from "date-fns/format";
import intervalToDuration from "date-fns/intervalToDuration";

import { SingleDay } from "./../../selectors/groupEntriesByDays";

interface Props {
  data: SingleDay;
}

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin: auto 0.3rem;
  margin-right: 3.3rem;
`;

const Header_date = styled.span`
  font-weight: 700;
`;

const Header_dayCount = styled.span`
  font-weight: 700;
`;

const normalize = (str: number | undefined) =>
  `${str}`.length > 1 ? str : `0${str}`;

const formatDuration = ({ hours, minutes, seconds }: Duration) =>
  `${hours}:${normalize(minutes)}:${normalize(seconds)}`;

export const DayList = ({ data }: Props) => (
  <Header>
    <Header_date>{format(data.start, "eee, d MMM")}</Header_date>
    <Header_dayCount>
      {formatDuration(
        intervalToDuration({ start: 0, end: data.totalDuration })
      )}
    </Header_dayCount>
  </Header>
);
