import React, { useCallback } from "react";
import { DateRange, RangeKeyDict } from "react-date-range";
import endOfDay from "date-fns/endOfDay";

import { useWindowSize } from "../../../hooks/useWindowSize";
import { Range } from "../hooks";

import { readable, getPeriodTime } from "../helpers";

import { emToPx } from "../../../styles/helpers";
import { breakPoints, green } from "../../../styles/variables";
import { Wrapper, Period_Selector, Period_Item } from "./style";

interface Props {
  range: Range;
  syncRange: (args: Range) => any;
  closeCalendar: () => any;
}

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
