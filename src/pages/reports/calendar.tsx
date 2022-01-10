import React, { useCallback } from "react";
import styled from "styled-components";
import { DateRange } from "react-date-range";

import { fetchEntries } from "../../actions/user";

import {
  black,
  green,
  greyWhiteDarker,
  whiteGrey,
} from "../../styles/variables";

import { State } from "./";
import { readable, getPeriodTime } from "./helpers";

import { useStoreDispatch } from "../../hooks";

interface Props {
  state: State;
  setState: (args: State) => void;
  closeCalendar: () => any;
}

const Wrapper = styled.div`
  position: absolute;
  z-index: 100;
  width: 35rem;
  right: 48px;
  top: 35px;
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.25);
`;

const Period_selector = styled.nav`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  background-color: ${whiteGrey};
  color: ${greyWhiteDarker};
  padding: 0.8rem;
  font-size: 16px;
`;

const Period_item = styled.a`
  flex: 1 1 25%;
  cursor: pointer;
  text-align: center;
  padding: 0.5rem;

  &:hover {
    color: ${black};
  }
`;

const dateRangeTheme = {
  Calendar: {
    background: "transparent",
    color: "#95a5a6",
  },
  MonthAndYear: {
    background: "#ddd",
  },
  MonthButton: {
    background: "transparent",
  },
  MonthArrowPrev: {
    color: "#333",
    fontSize: "26px",
    cursor: "pointer",
  },
  MonthArrowNext: {
    color: "#333",
    fontSize: "26px",
    cursor: "pointer",
  },
  Weekday: {
    backgroundColor: "#ddd",
  },
  DaySelected: {
    background: "green",
  },
  DayActive: {
    background: "#4bc800",
    boxShadow: "none",
  },
  DayInRange: {
    background: "#4bc800",
    color: "#fff",
  },
  DayHover: {
    background: "#ddd",
    color: "#7f8c8d",
  },
};

export const Calendar = ({ state, setState, closeCalendar }: Props) => {
  const dispatch = useStoreDispatch();

  const { startDate, endDate } = state;

  const setPeriod = useCallback(
    (period: readable) => {
      const [startDate, endDate, type] = getPeriodTime()[period];

      setState({
        startDate,
        endDate,
        readable: period,
        type,
      });

      dispatch(fetchEntries(startDate.getTime()));
      closeCalendar();
    },
    [state]
  );

  const setToday = useCallback(() => setPeriod(readable.TODAY), []);
  const setThisWeek = useCallback(() => setPeriod(readable.THIS_WEEK), []);
  const setThisMonth = useCallback(() => setPeriod(readable.THIS_MONTH), []);
  const setThisYear = useCallback(() => setPeriod(readable.THIS_YEAR), []);
  const setYesterday = useCallback(() => setPeriod(readable.YESTERDAY), []);
  const setLastWeek = useCallback(() => setPeriod(readable.LAST_WEEK), []);
  const setLastMonth = useCallback(() => setPeriod(readable.LAST_MONTH), []);
  const setLastYear = useCallback(() => setPeriod(readable.LAST_YEAR), []);

  return (
    <Wrapper>
      <DateRange
        ranges={[{ startDate, endDate }]}
        weekStartsOn={1}
        color={green}
      />
      <Period_selector>
        <Period_item onClick={setToday}>Today</Period_item>
        <Period_item onClick={setThisWeek}>This Week</Period_item>
        <Period_item onClick={setThisMonth}>This Month</Period_item>
        <Period_item onClick={setThisYear}>This Year</Period_item>
        <Period_item onClick={setYesterday}>Yesterday</Period_item>
        <Period_item onClick={setLastWeek}>Last Week</Period_item>
        <Period_item onClick={setLastMonth}>Last Month</Period_item>
        <Period_item onClick={setLastYear}>Last Year</Period_item>
      </Period_selector>
    </Wrapper>
  );
};
