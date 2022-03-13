import React, { useCallback, useEffect, useState, Suspense, lazy } from "react";
import styled from "styled-components";
import startOfWeek from "date-fns/startOfWeek";
import endOfWeek from "date-fns/endOfWeek";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import add from "date-fns/add";
import sub from "date-fns/sub";

import { Calendar } from "./calendar";
const PeriodChart = lazy(() => import("./periodChart"));
const ProjectChart = lazy(() => import("./projectChart"));
import { Icon } from "../../components/icon";
import { ComponentLoader } from "../../components/loader";

import {
  formatCustomReadable,
  getMatchingPeriodType,
  getMatchingReadableType,
  getPeriodTime,
  periods,
  readable,
} from "./helpers";

import { useQuerySync } from "./hooks";

import { useStoreDispatch } from "../../hooks";
import { fetchEntries } from "../../actions/user";

import {
  breakPoints,
  darkGrey,
  greyWhite,
  whiteGrey,
} from "../../styles/variables";
import { getBP } from "./../../styles/helpers";
import { Heading as HeadingCSS } from "../../styles/typography";

export interface State {
  readable: readable | string;
  type: periods;
}

const Wrapper = styled.main`
  width: 100%;
  max-width: ${breakPoints.large};
  margin: 1rem auto;
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  padding-top: 0;

  ${getBP(breakPoints.verySmall)} {
    display: block;
    width: 100%;
    height: 100vh;
    overflow-y: scroll;
    margin: initial;
    padding-top: 1rem;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
`;

const Heading = styled.h2`
  ${HeadingCSS}
`;

const Heading_section = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  position: relative;
`;

const Chart_section = styled.section`
  flex-basis: 72%;
  min-width: 36.875rem;
  margin-right: 1rem;

  ${getBP("56.25rem")} {
    flex-basis: 100%;
  }

  ${getBP(breakPoints.small)} {
    margin-right: initial;
  }

  ${getBP(breakPoints.verySmall)} {
    min-width: initial;
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

  const { range, syncRange } = useQuerySync();

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const getState = () => {
    const readableVal = getMatchingReadableType(range);

    const type =
      readableVal === readable.CUSTOM
        ? getMatchingPeriodType(range)
        : getPeriodTime()[readableVal][2];

    return { readable: formatCustomReadable(range, readableVal), type };
  };

  const [state, setState] = useState<State>(getState());

  useEffect(() => {
    setState(getState());
    dispatch(fetchEntries(range.startDate.getTime()));
  }, [range]);

  const toggleCalendar = useCallback(
    () => setIsCalendarOpen(!isCalendarOpen),
    [isCalendarOpen]
  );
  const closeCalendar = useCallback(() => setIsCalendarOpen(false), []);

  const goToNextPeriod = useCallback(() => {
    const isCustom = state.type === periods.CUSTOM;

    const getDiff = () =>
      differenceInCalendarDays(range.endDate, range.startDate) + 1;

    const periodKey = isCustom ? "days" : `${state.type.toLowerCase()}s`;
    const diff = isCustom ? getDiff() : 1;

    const startDate =
      state.type === periods.MONTH
        ? startOfMonth(add(range.endDate, { days: 1 }))
        : add(range.startDate, { [periodKey]: diff });
    const endDate =
      state.type === periods.MONTH
        ? endOfMonth(add(range.endDate, { days: 1 }))
        : add(range.endDate, { [periodKey]: diff });

    syncRange({ startDate, endDate });
  }, [state, range]);

  const goToPreviousPeriod = useCallback(() => {
    const isCustom = state.type === periods.CUSTOM;

    const getDiff = () =>
      differenceInCalendarDays(range.endDate, range.startDate) + 1;

    const periodKey = isCustom ? "days" : `${state.type.toLowerCase()}s`;
    const diff = isCustom ? getDiff() : 1;

    const startDate =
      state.type === periods.MONTH
        ? startOfMonth(sub(range.startDate, { days: 1 }))
        : sub(range.startDate, { [periodKey]: diff });
    const endDate =
      state.type === periods.MONTH
        ? endOfMonth(sub(range.startDate, { days: 1 }))
        : sub(range.endDate, { [periodKey]: diff });

    syncRange({ startDate, endDate });
  }, [state, range]);

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
              <Suspense fallback={<ComponentLoader isVisible={true} />}>
                <Calendar
                  range={range}
                  syncRange={syncRange}
                  closeCalendar={closeCalendar}
                />
              </Suspense>
            )}
          </Heading_section>
        </Header>
        <Suspense fallback={<ComponentLoader isVisible={true} />}>
          <PeriodChart periodState={state} range={range} />
        </Suspense>
        <Suspense fallback={<ComponentLoader isVisible={true} />}>
          <ProjectChart periodState={state} range={range} />
        </Suspense>
      </Chart_section>
    </Wrapper>
  );
};

export default Reports;
