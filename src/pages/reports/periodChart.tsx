import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
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

import { periods } from "./helpers";

import { useStoreSelector } from "../../hooks";
import { useWindowSize } from "../../hooks/useWindowSize";

import {
  groupEntriesByDays,
  SingleDay,
} from "../../selectors/groupEntriesByDays";
import { State } from "./index";

import { getXAxisTick, getYAxisTick, getCustomLabel } from "./labelsAndTicks";

import {
  blue,
  greyWhite,
  greyWhiteDarker,
  white,
  whiteGrey,
} from "../../styles/variables";

interface Props {
  periodState: State;
}

const Wrapper = styled.section`
  margin-top: 1rem;
  width: 100%;
  height: 350px;
  position: relative;

  > div > div {
    box-shadow: 0 1px 3px rgba(128, 128, 128, 0.2);
    height: 281px !important;
    border-bottom: 2px solid ${greyWhiteDarker};
    background-color: ${white};
  }

  .recharts-surface {
    overflow: visible;
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.6);
  transition: all 0.2s linear;
  z-index: 50;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  color: ${greyWhiteDarker};
  font-size: 1.125rem;
  opacity: ${(props: { isVisible: boolean }) => (props.isVisible ? 1 : 0)};
  pointer-events: none;
`;

const rotateAnim = keyframes`
    from{
        transform:rotate(0deg);
    }
    to{
        transform:rotate(360deg);
    }
`;

const Spinner = styled.span`
  width: 50px;
  height: 50px;
  border: 3px solid ${whiteGrey};
  border-right: 3px solid transparent;
  border-radius: 50%;
  transform: translateZ(0);
  animation: ${rotateAnim} 0.5s linear infinite;
`;

export const PeriodChart = ({ periodState }: Props) => {
  const { startDate, endDate, type } = periodState;

  const [hoveredBarStartDate, setHoveredBarStartDate] = useState(0);
  const size = useWindowSize();

  useEffect(() => {
    const parent = document.querySelector(
      ".recharts-cartesian-grid-horizontal"
    ) as HTMLElement;
    if (parent?.children && parent?.children.length === 7) {
      const asArr = Array.from(parent.children) as HTMLHtmlElement[];
      // hide unnecessary line from the top of chart
      asArr[5].style.display = "none";
    }
  }, [startDate, endDate]);

  const { isLoading, isFetching } = useStoreSelector((state) => state.global);
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

      return foundItem || { ...item, start: theoreticalDay.getTime() };
    });

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

  return (
    <Wrapper>
      <Overlay isVisible={isLoading || isFetching || !periodContainsData}>
        {isLoading ? (
          <Spinner />
        ) : periodContainsData ? (
          ""
        ) : (
          "No data available"
        )}
      </Overlay>
      <ResponsiveContainer>
        <BarChart
          data={dataSrc}
          barCategoryGap={5}
          margin={{ top: 30, right: 30, left: 50, bottom: 10 }}
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
            isAnimationActive={true}
            maxBarSize={100}
            minPointSize={4}
            onMouseEnter={(p: any) => setHoveredBarStartDate(p.start)}
            onMouseLeave={() => setHoveredBarStartDate(0)}
          >
            {
              <LabelList
                dataKey="totalDuration"
                position="top"
                content={getCustomLabel(hoveredBarStartDate, dataSrc)}
              />
            }
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
