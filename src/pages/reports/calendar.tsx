import React, { useCallback } from "react";
import styled from "styled-components";
import { DateRange, RangeKeyDict } from "react-date-range";
import endOfDay from "date-fns/endOfDay";

import { useWindowSize } from "../../hooks/useWindowSize";

import { State } from "./";
import { Range } from "./hooks";

import { readable, getPeriodTime } from "./helpers";

import {
  black,
  green,
  greyWhiteDarker,
  whiteGrey,
  breakPoints,
} from "../../styles/variables";
import { getBP, emToPx } from "./../../styles/helpers";
interface Props {
  range: Range;
  syncRange: (args: Range) => any;
  closeCalendar: () => any;
}

const Wrapper = styled.div`
  position: absolute;
  z-index: 1000;
  width: 664px;
  right: 48px;
  top: 35px;
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.25);
  background-color: rgb(239, 242, 247);
  overflow: hidden;

  ${getBP(breakPoints.medium)} {
    width: 332px;
  }

  ${getBP("25em")} {
    right: 0;
  }
`;

const Period_Selector = styled.nav`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  color: ${greyWhiteDarker};
  padding: 0.8rem;
  font-size: 16px;

  ${getBP(breakPoints.medium)} {
    font-size: 12px;
  }
`;

const Period_Item = styled.a`
  flex: 1 1 25%;
  cursor: pointer;
  text-align: center;
  padding: 0.5rem;

  &:hover {
    color: ${black};
  }
`;

export const Calendar = ({ range, syncRange, closeCalendar }: Props) => {
  const { startDate, endDate } = range;

  const size = useWindowSize();

  const onChange = useCallback((ranges: RangeKeyDict) => {
    const {
      range1: { startDate, endDate },
    } = ranges;

    if (startDate && endDate) {
      const isSameDate = startDate === endDate;

      syncRange({
        startDate,
        endDate: isSameDate ? endOfDay(endDate) : endDate,
      });
    }
  }, []);

  const setPeriod = (period: readable) => {
    const [startDate, endDate, type] = getPeriodTime()[period];

    syncRange({ startDate, endDate });

    closeCalendar();
  };

  const setToday = useCallback(() => setPeriod(readable.TODAY), []);
  const setThisWeek = useCallback(() => setPeriod(readable.THIS_WEEK), []);
  const setThisMonth = useCallback(() => setPeriod(readable.THIS_MONTH), []);
  const setThisYear = useCallback(() => setPeriod(readable.THIS_YEAR), []);
  const setYesterday = useCallback(() => setPeriod(readable.YESTERDAY), []);
  const setLastWeek = useCallback(() => setPeriod(readable.LAST_WEEK), []);
  const setLastMonth = useCallback(() => setPeriod(readable.LAST_MONTH), []);
  const setLastYear = useCallback(() => setPeriod(readable.LAST_YEAR), []);

  const isMobile = size.width && size.width < emToPx(breakPoints.medium);

  return (
    <Wrapper>
      <DateRange
        ranges={[{ startDate, endDate }]}
        weekStartsOn={1}
        months={isMobile ? 1 : 2}
        direction="horizontal"
        showPreview={false}
        rangeColors={[green]}
        onChange={onChange}
      />
      <Period_Selector>
        <Period_Item onClick={setToday}>Today</Period_Item>
        <Period_Item onClick={setThisWeek}>This Week</Period_Item>
        <Period_Item onClick={setThisMonth}>This Month</Period_Item>
        <Period_Item onClick={setThisYear}>This Year</Period_Item>
        <Period_Item onClick={setYesterday}>Yesterday</Period_Item>
        <Period_Item onClick={setLastWeek}>Last Week</Period_Item>
        <Period_Item onClick={setLastMonth}>Last Month</Period_Item>
        <Period_Item onClick={setLastYear}>Last Year</Period_Item>
      </Period_Selector>
    </Wrapper>
  );
};
