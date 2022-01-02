import React from "react";
import styled from "styled-components";
import { DateRange } from "react-date-range";

import {
  black,
  green,
  greyWhiteDarker,
  whiteGrey,
} from "../../styles/variables";

import { State } from ".";

interface Props {
  state: State;
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

export const Calendar = ({ state }: Props) => {
  const { startDate, endDate } = state;
  const setToday = () => 0;
  const setThisWeek = () => 0;
  const setThisMonth = () => 0;
  const setThisYear = () => 0;
  const setYesterday = () => 0;
  const setLastWeek = () => 0;
  const setLastMonth = () => 0;
  const setLastYear = () => 0;

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
