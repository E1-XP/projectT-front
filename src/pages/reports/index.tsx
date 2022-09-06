import React, { useCallback, useEffect, useState, Suspense, lazy } from "react";
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

import { darkGrey, greyWhite } from "../../styles/variables";
import {
  Wrapper,
  Chart_Section,
  Header,
  Heading,
  Heading_Section,
  Item_Link_Border,
  Period_Selection,
  Item_Link_Hover,
  Screen_Blocker,
} from "./style";

export interface State {
  readable: readable | string;
  type: periods;
}

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
    dispatch(fetchEntries({ end: range.startDate.getTime() }));
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
      <Chart_Section>
        <Header>
          <Heading>Reports</Heading>
          <Heading_Section>
            <Item_Link_Border onClick={toggleCalendar}>
              {state.readable}
              <Icon
                name={isCalendarOpen ? "close" : "arrow_drop_down"}
                fill={isCalendarOpen ? darkGrey : greyWhite}
                size={isCalendarOpen ? "18px" : "24px"}
              />
            </Item_Link_Border>
            <Period_Selection>
              <Item_Link_Hover onClick={goToPreviousPeriod}>
                <Icon name="keyboard_arrow_left" />
              </Item_Link_Hover>
              <Item_Link_Hover onClick={goToNextPeriod}>
                <Icon name="keyboard_arrow_right" />
              </Item_Link_Hover>
            </Period_Selection>
            {isCalendarOpen && <Screen_Blocker onClick={closeCalendar} />}
            {isCalendarOpen && (
              <Suspense fallback={<ComponentLoader isVisible={true} />}>
                <Calendar
                  range={range}
                  syncRange={syncRange}
                  closeCalendar={closeCalendar}
                />
              </Suspense>
            )}
          </Heading_Section>
        </Header>
        <Suspense fallback={<ComponentLoader isVisible={true} />}>
          <PeriodChart periodState={state} range={range} />
        </Suspense>
        <Suspense fallback={<ComponentLoader isVisible={true} />}>
          <ProjectChart periodState={state} range={range} />
        </Suspense>
      </Chart_Section>
    </Wrapper>
  );
};

export default Reports;
