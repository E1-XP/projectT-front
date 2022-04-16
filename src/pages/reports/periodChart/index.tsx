import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  LabelList,
  Cell,
  Text,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import addDays from "date-fns/addDays";
import isSameDay from "date-fns/isSameDay";
import isSameMonth from "date-fns/isSameMonth";

import { periods } from "../helpers";

import { useStoreSelector } from "../../../hooks";
import { useWindowSize } from "../../../hooks/useWindowSize";

import {
  groupEntriesByDays,
  SingleDay,
} from "../../../selectors/groupEntriesByDays";

import { State } from "../index";
import { Range } from "../hooks";

import { getXAxisTick, getYAxisTick, getCustomLabel } from "../labelsAndTicks";
import { ComponentLoader } from "../../../components/loader";

import {
  blue,
  breakPoints,
  greyWhite,
  greyWhiteDarker,
} from "../../../styles/variables";
import { emToPx } from "../../../styles/helpers";
import { Wrapper } from "./style";

interface Props {
  periodState: State;
  range: Range;
}

export const PeriodChart = ({ periodState, range }: Props) => {
  const { type } = periodState;
  const { startDate, endDate } = range;

  const [hoveredBarStartDate, setHoveredBarStartDate] = useState(0);
  const [shouldAnimateBars, setShouldAnimateBars] = useState(true);
  const size = useWindowSize();

  useEffect(() => {
    shouldAnimateBars && setTimeout(() => setShouldAnimateBars(false), 600);
  }, [shouldAnimateBars]);

  useEffect(() => {
    const parent = document.querySelector(
      ".recharts-cartesian-grid-horizontal"
    ) as HTMLElement;

    if (parent?.children && parent?.children.length === 7) {
      const asArr = Array.from(parent.children) as HTMLHtmlElement[];
      // hide unnecessary line from the top of chart
      asArr[5].style.display = "none";
    }

    setShouldAnimateBars(true);
  }, [startDate, endDate]);

  const { isLoading, isFetching } = useStoreSelector((state) => state.global);
  const { duration: timerDuration } = useStoreSelector((state) => state.timer);

  const entriesByDays = useStoreSelector(groupEntriesByDays);

  const periodFilter = ({ start, stop }: SingleDay) =>
    start >= startDate.getTime() && stop <= endDate.getTime();
  const entriesByDaysArr = Object.values(entriesByDays).filter(periodFilter);

  const periodDayDiff = differenceInCalendarDays(endDate, startDate);

  const periodInDays = new Array(periodDayDiff + 1)
    .fill({})
    .map(() => ({
      totalDuration: 0,
    }))
    .map((item, i) => {
      const theoreticalDay = addDays(startDate, i);
      const foundItem = entriesByDaysArr.find((day) =>
        isSameDay(theoreticalDay, day.start)
      );

      const day = foundItem || { ...item, start: theoreticalDay.getTime() };
      return day;
    });

  const dataFromTodayIdx = periodInDays.findIndex((day) =>
    isSameDay(Date.now(), day.start)
  );

  if (timerDuration && dataFromTodayIdx >= 0) {
    const currData = periodInDays[dataFromTodayIdx];

    periodInDays[dataFromTodayIdx] = {
      ...currData,
      totalDuration: currData.totalDuration + timerDuration,
    };
  }

  const getPeriodInMonths = () =>
    periodInDays.reduce((acc, day) => {
      const existingMonthIdx = acc.findIndex((item) =>
        isSameMonth(day.start, item.start)
      );

      if (existingMonthIdx > -1) {
        const totalDuration = (acc[existingMonthIdx].totalDuration +=
          day.totalDuration);

        acc[existingMonthIdx] = { ...acc[existingMonthIdx], totalDuration };
      } else acc.push({ ...day });

      return acc;
    }, [] as typeof periodInDays);

  const dataSrc = type === periods.YEAR ? getPeriodInMonths() : periodInDays;

  const xAxisInterval = (numberOfDays: number) =>
    numberOfDays > 7
      ? type === periods.YEAR
        ? 1
        : numberOfDays > 14
        ? 4
        : (numberOfDays % 7) + 1
      : 0;

  const getYAxisTicks = () => {
    const SECOND = 1000;
    const MINUTE = SECOND * 60;
    const HOUR = MINUTE * 60;

    let multi = 1;

    const highestValue = dataSrc.reduce(
      (acc, { totalDuration }) => (acc < totalDuration ? totalDuration : acc),
      0
    );

    const period =
      [HOUR, MINUTE, SECOND].find((period) => period < highestValue) || SECOND;

    while (highestValue > period * multi * 5) {
      multi += 1;
    }

    return Array(5)
      .fill(null)
      .map((_, i) => period * multi * (i + 1));
  };

  const periodContainsData = !!periodInDays.length;

  const isMobile =
    (size.width || window.innerWidth) < emToPx(breakPoints.small);
  const isMonthLikeView = type === periods.MONTH || dataSrc.length > 15;

  return (
    <Wrapper>
      <ComponentLoader
        isVisible={isLoading || isFetching || !periodContainsData}
        shouldShowSpinner={isLoading || isFetching}
        shouldShowMessage={!isFetching && !periodContainsData}
        message="No data available for this period"
        fill={greyWhite}
      />
      <ResponsiveContainer>
        <BarChart
          data={dataSrc}
          barCategoryGap={5}
          margin={{
            top: 30,
            right: isMobile && isMonthLikeView ? 0 : 30,
            left: isMobile && isMonthLikeView ? 0 : 50,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            interval={xAxisInterval(dataSrc.length)}
            tickLine={false}
            dataKey="start"
            height={60}
            tick={getXAxisTick(type, size) as any}
          />
          <YAxis
            stroke={greyWhite}
            orientation="right"
            axisLine={false}
            mirror={false}
            tickLine={false}
            width={30}
            interval={0}
            ticks={getYAxisTicks()}
            tick={getYAxisTick}
          />
          <Bar
            dataKey="totalDuration"
            isAnimationActive={shouldAnimateBars}
            maxBarSize={100}
            minPointSize={4}
            onMouseEnter={(p: any) => setHoveredBarStartDate(p.start)}
            onMouseLeave={() => setHoveredBarStartDate(0)}
          >
            <LabelList
              dataKey="totalDuration"
              position="top"
              content={getCustomLabel(hoveredBarStartDate, type, dataSrc)}
            />
            {dataSrc.map((item, i) => (
              <Cell
                fill={item.totalDuration ? blue : greyWhiteDarker}
                key={`${i}-${item.totalDuration}`}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Wrapper>
  );
};

export default PeriodChart;
