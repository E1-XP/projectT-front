import React from "react";
import { ContentType } from "recharts/types/component/Label";
import { ContentType as CType } from "recharts/types/component/DefaultLegendContent";
import intervalToDuration from "date-fns/intervalToDuration";
import format from "date-fns/format";
import pipe from "lodash/fp/pipe";

import { useWindowSize, State as WindowState } from "../../hooks/useWindowSize";
import { periods } from "./helpers";
import { formatDuration } from "./../../helpers";

import { emToPx } from "../../styles/helpers";
import { greyWhite, white, breakPoints, black } from "../../styles/variables";

const formatTotalDuration = (val: number) =>
  pipe(intervalToDuration, formatDuration)({ start: 0, end: val });

interface SingleDayExtract {
  start: number;
  totalDuration: number;
}

export const getXAxisTick =
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

export const getYAxisTick = (props: any) => {
  const { payload, x, y } = props;

  const formatYAxisTicks = (value: number) => {
    const { days, hours, minutes, seconds } = intervalToDuration({
      start: 0,
      end: payload.value,
    });

    if (days) return `${days * 24 + (hours || 0)} h`;
    if (hours) return `${hours} h`;
    if (minutes) return `${minutes} m`;
    return `${seconds} s`;
  };

  return (
    <text x={x} y={y}>
      {formatYAxisTicks(props.payload.value)}
    </text>
  );
};

export const getCustomLabel: (
  hoveredBarStartDate: number,
  dataSrc: SingleDayExtract[]
) => ContentType = (hoveredBarStartDate, dataSrc) => (props: any) => {
  const { value, x, y, width, height, index } = props;

  const rectWidth = width * 2;
  const idx = dataSrc.findIndex((data) => data.start === hoveredBarStartDate);
  const isHovered = idx === index;

  return isHovered ? (
    <>
      <rect
        x={x - width / 2}
        y={y - 70}
        width={rectWidth}
        height={60}
        rx="5px"
        ry="5px"
        strokeLinejoin="round"
        style={{ fill: white, stroke: greyWhite }}
      />
      <foreignObject x={x + width / 2} y={y - 11} width={10} height={10}>
        <div
          style={{
            width: 0,
            height: 0,
            borderStyle: "solid",
            borderWidth: "10px 5px 0 5px",
            borderColor: `${greyWhite} transparent transparent transparent`,
          }}
        />
      </foreignObject>
      <foreignObject x={x + width / 2} y={y - 13} width={10} height={10}>
        <div
          style={{
            width: 0,
            height: 0,
            borderStyle: "solid",
            borderWidth: "10px 5px 0 5px",
            borderColor: `${white} transparent transparent transparent`,
          }}
        />
      </foreignObject>
      <text
        x={x + width / 2}
        y={y - 48}
        textAnchor="middle"
        style={{ fontSize: "12px" }}
        fill={black}
      >
        {format(dataSrc[idx].start, "EEEE, LLLL do")}
      </text>
      <text
        x={x + width / 2}
        y={y - 25}
        textAnchor="middle"
        style={{ fontSize: "12px" }}
        fill={black}
      >
        {`Total: ${formatTotalDuration(value)}`}
      </text>
    </>
  ) : null;
};
