import React, { useCallback, useState } from "react";
import styled from "styled-components";
import startOfWeek from "date-fns/startOfWeek";
import endOfWeek from "date-fns/endOfWeek";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import add from "date-fns/add";
import sub from "date-fns/sub";

import { Calendar } from "./calendar";
import { PeriodChart } from "./periodChart";
import { ProjectChart } from "./projectChart";
import { Icon } from "../../components/icon";

import {
  formatCustomReadable,
  getMatchingPeriod,
  periods,
  readable,
} from "./helpers";

import { useStoreDispatch } from "../../hooks";
import { fetchEntries } from "../../actions/user";

import {
  breakPoints,
  darkGrey,
  greyWhite,
  whiteGrey,
} from "../../styles/variables";

import { getBP } from "./../../styles/helpers";

export interface State {
  startDate: Date;
  endDate: Date;
  readable: readable | string;
  type: periods;
}

const Wrapper = styled.div`
  width: 100%;
  max-width: ${breakPoints.large};
  margin: 1rem auto;
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  padding-top: 0;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
`;

const Heading = styled.h2`
  font-size: 2.125rem;
  font-weight: 500;
`;

const Heading_section = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  position: relative;
`;

const Chart_section = styled.section`
  flex-basis: 72%;
  width: 0;
  min-width: 36.875rem;
  margin-right: 1rem;

  ${getBP("56.25rem")} {
    flex-basis: 100%;
  }
`;

const Item_link = styled.a`
  color: ${darkGrey};
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const Item_link_border = styled(Item_link)`
  border-right: 1px solid ${whiteGrey};

  & span {
    width: 1.5rem;
    color: ${greyWhite};
    margin-left: 0.3rem;
  }

  &:hover span {
    color: ${darkGrey} !important;
  }
`;

const Item_link_hover = styled(Item_link)`
  color: ${greyWhite};

  &:hover {
    color: ${darkGrey};
  }
`;

const Period_selection = styled.div`
  display: flex;
`;

const Screen_blocker = styled.div`
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  background-color: transparent;
  width: 100%;
  height: 100%;
  z-index: 50;
`;

export type PeriodTimes = Record<string, Date[]>;

export const Reports = () => {
  const dispatch = useStoreDispatch();

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [state, setState] = useState<State>({
    startDate: startOfWeek(Date.now(), { weekStartsOn: 1 }),
    endDate: endOfWeek(Date.now(), { weekStartsOn: 1 }),
    readable: readable.THIS_WEEK,
    type: periods.WEEK,
  });

  const toggleCalendar = useCallback(
    () => setIsCalendarOpen(!isCalendarOpen),
    [isCalendarOpen]
  );
  const closeCalendar = useCallback(() => setIsCalendarOpen(false), []);

  const goToNextPeriod = useCallback(() => {
    const isCustom = state.type === periods.CUSTOM;

    const getDiff = () =>
      differenceInCalendarDays(state.endDate, state.startDate) + 1;

    const periodKey = isCustom ? "days" : `${state.type.toLowerCase()}s`;
    const diff = isCustom ? getDiff() : 1;

    const startDate = add(state.startDate, { [periodKey]: diff });
    const endDate = add(state.endDate, { [periodKey]: diff });
    const readable = formatCustomReadable(
      { startDate, endDate },
      getMatchingPeriod({ startDate, endDate })
    );
    const type = state.type;

    setState({
      startDate,
      endDate,
      readable,
      type,
    });

    dispatch(fetchEntries(startDate.getTime()));
  }, [state]);

  const goToPreviousPeriod = useCallback(() => {
    const isCustom = state.type === periods.CUSTOM;

    const getDiff = () =>
      differenceInCalendarDays(state.endDate, state.startDate) + 1;

    const periodKey = isCustom ? "days" : `${state.type.toLowerCase()}s`;
    const diff = isCustom ? getDiff() : 1;

    const startDate = sub(state.startDate, { [periodKey]: diff });
    const endDate = sub(state.endDate, { [periodKey]: diff });
    const readable = formatCustomReadable(
      { startDate, endDate },
      getMatchingPeriod({ startDate, endDate })
    );
    const type = state.type;

    setState({
      startDate,
      endDate,
      readable,
      type,
    });

    dispatch(fetchEntries(startDate.getTime()));
  }, [state]);

  return (
    <Wrapper>
      <Chart_section>
        <Header>
          <Heading>Reports</Heading>
          <Heading_section>
            <Item_link_border onClick={toggleCalendar}>
              {state.readable}
              <Icon
                name={isCalendarOpen ? "close" : "arrow_drop_down"}
                fill={isCalendarOpen ? darkGrey : greyWhite}
                size={isCalendarOpen ? "18px" : "24px"}
              />
            </Item_link_border>
            <Period_selection>
              <Item_link_hover onClick={goToPreviousPeriod}>
                <Icon name="keyboard_arrow_left" />
              </Item_link_hover>
              <Item_link_hover onClick={goToNextPeriod}>
                <Icon name="keyboard_arrow_right" />
              </Item_link_hover>
            </Period_selection>
            {isCalendarOpen && <Screen_blocker onClick={closeCalendar} />}
            {isCalendarOpen && (
              <Calendar
                state={state}
                setState={setState}
                closeCalendar={closeCalendar}
              />
            )}
          </Heading_section>
        </Header>
        <PeriodChart periodState={state} />
        <ProjectChart periodState={state} />
      </Chart_section>
    </Wrapper>
  );
};
