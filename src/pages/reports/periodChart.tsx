import React from "react";
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
import { ContentType } from "recharts/types/component/Label";
import { ContentType as CType } from "recharts/types/component/DefaultLegendContent";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import intervalToDuration from "date-fns/intervalToDuration";
import addDays from "date-fns/addDays";
import isSameDay from "date-fns/isSameDay";
import isSameMonth from "date-fns/isSameMonth";
import format from "date-fns/format";
import pipe from "lodash/fp/pipe";

import { formatDuration } from "./../../helpers";
import { periods } from "./helpers";

import { useStoreSelector } from "../../hooks";
import { useWindowSize, State as WindowState } from "../../hooks/useWindowSize";

import {
  groupEntriesByDays,
  SingleDay,
} from "../../selectors/groupEntriesByDays";
import { State } from "./index";

import {
  blue,
  darkGrey,
  greyWhite,
  greyWhiteDarker,
  white,
  whiteGrey,
  breakPoints,
} from "../../styles/variables";
import { emToPx } from "../../styles/helpers";

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

const Ttip = styled.div`
  background-color: ${white};
  border: 1px solid ${whiteGrey};
  padding: 0.3rem 0.6rem;
  color: ${(props: { hasValue: boolean }) =>
    props.hasValue ? blue : darkGrey};
`;

interface ICustomTooltip {
  isActive: boolean;
  totalDuration: number;
}

const formatTotalDuration = (val: number) =>
  pipe(intervalToDuration, formatDuration)({ start: 0, end: val });

const getCustomTick =
  (type: periods, size: WindowState) =>
  (args: any): CType => {
    const { x, y, width, height, stroke, payload } = args;
    const isDisplayingYear = type === periods.YEAR;

    const isMobile =
      (size.width || window.innerWidth) < emToPx(breakPoints.small);

    return (
      <g>
        <text
          x={x}
          y={(y as number) + 15}
          textAnchor="middle"
          style={{
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          {format(
            payload.value,
            isDisplayingYear ? (isMobile ? "MMM" : "MMMM") : "E"
          )}
        </text>
        <text
          style={{
            fontSize: "13px",
            fontWeight: 400,
          }}
          x={x}
          y={(y as number) + 35}
          textAnchor="middle"
        >
          {format(payload.value, isDisplayingYear ? "Y" : "M/d")}
        </text>
      </g>
    );
  };

const getCustomLabel: ContentType = ({ value, x, y, width, height }) =>
  value !== 0 && (
    <>
      <rect
        x={x}
        y={(y as number) - 40}
        width={width}
        height={25}
        style={{ fill: white, stroke: greyWhite }}
      />
      <text
        x={(x as number) + (width as number) / 2}
        y={(y as number) - 22.5}
        textAnchor="middle"
        style={{ fontSize: "13px" }}
        fill={blue}
      >
        {formatTotalDuration(value as number)}
      </text>
    </>
  );

const CustomTooltip = ({ isActive, totalDuration }: ICustomTooltip) =>
  isActive ? <Ttip hasValue={!!totalDuration}>{totalDuration}</Ttip> : null;

export const PeriodChart = ({ periodState }: Props) => {
  const { startDate, endDate, type } = periodState;

  const size = useWindowSize();

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
      } else acc.push(day);

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
            tick={getCustomTick(type, size) as any}
          />
          {!false && (
            <Tooltip
              cursor={false}
              isAnimationActive={false}
              content={<CustomTooltip isActive={true} totalDuration={0} />}
            />
          )}
          <Bar
            dataKey="totalDuration"
            // data={dataSrc}
            isAnimationActive={false}
            maxBarSize={100}
            minPointSize={4}
          >
            {true && (
              <LabelList
                dataKey="totalDuration"
                position="top"
                content={getCustomLabel}
              />
            )}
            {dataSrc.map((item, i) => (
              <Cell
                fill={item.totalDuration ? blue : greyWhiteDarker}
                key={`${i}-${item.totalDuration}`}
              />
            ))}
          </Bar>
          <YAxis
            stroke={greyWhite}
            orientation="right"
            axisLine={false}
            mirror={false}
            tickLine={false}
            width={30}
            interval={0}
            ticks={undefined}
            tickFormatter={formatTotalDuration}
          />
        </BarChart>
      </ResponsiveContainer>
    </Wrapper>
  );
};
