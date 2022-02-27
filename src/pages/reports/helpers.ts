import startOfWeek from "date-fns/startOfWeek";
import endOfWeek from "date-fns/endOfWeek";
import startOfDay from "date-fns/startOfDay";
import endOfDay from "date-fns/endOfDay";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import startOfYear from "date-fns/startOfYear";
import endOfYear from "date-fns/endOfYear";
import sub from "date-fns/sub";
import isSameDay from "date-fns/isSameDay";
import isSameWeek from "date-fns/isSameWeek";
import isMonday from "date-fns/isMonday";
import isSunday from "date-fns/isSunday";
import isSameMonth from "date-fns/isSameMonth";
import isFirstDayOfMonth from "date-fns/isFirstDayOfMonth";
import isLastDayOfMonth from "date-fns/isLastDayOfMonth";
import isSameYear from "date-fns/isSameYear";
import format from "date-fns/format";

import { State } from ".";
import { Range } from "./hooks";

export enum periods {
  DAY = "DAY",
  WEEK = "WEEK",
  MONTH = "MONTH",
  YEAR = "YEAR",
  CUSTOM = "CUSTOM",
}

export enum readable {
  TODAY = "Today",
  YESTERDAY = "Yesterday",
  THIS_WEEK = "This Week",
  LAST_WEEK = "Last Week",
  THIS_MONTH = "This Month",
  LAST_MONTH = "Last Month",
  THIS_YEAR = "This Year",
  LAST_YEAR = "Last Year",
  CUSTOM = "CUSTOM",
}

type checkFn = (paramObj: Range) => boolean;

export const getPeriodTime = (
  date = Date.now()
): Record<string, [Date, Date, periods, checkFn]> => ({
  [readable.TODAY]: [startOfDay(date), endOfDay(date), periods.DAY, isToday],
  [readable.YESTERDAY]: [
    startOfDay(sub(date, { days: 1 })),
    endOfDay(sub(date, { days: 1 })),
    periods.DAY,
    isYesterday,
  ],
  [readable.THIS_WEEK]: [
    startOfWeek(date, { weekStartsOn: 1 }),
    endOfWeek(date, { weekStartsOn: 1 }),
    periods.WEEK,
    isThisWeek,
  ],
  [readable.LAST_WEEK]: [
    startOfWeek(sub(date, { weeks: 1 }), {
      weekStartsOn: 1,
    }),
    endOfWeek(sub(date, { weeks: 1 }), { weekStartsOn: 1 }),
    periods.WEEK,
    isLastWeek,
  ],
  [readable.THIS_MONTH]: [
    startOfMonth(date),
    endOfMonth(date),
    periods.MONTH,
    isThisMonth,
  ],
  [readable.LAST_MONTH]: [
    startOfMonth(sub(date, { months: 1 })),
    endOfMonth(sub(date, { months: 1 })),
    periods.MONTH,
    isLastMonth,
  ],
  [readable.THIS_YEAR]: [
    startOfYear(date),
    endOfYear(date),
    periods.YEAR,
    isThisYear,
  ],
  [readable.LAST_YEAR]: [
    startOfYear(sub(date, { years: 1 })),
    endOfYear(sub(date, { years: 1 })),
    periods.YEAR,
    isLastYear,
  ],
});

export const isToday = ({ startDate, endDate }: Range) =>
  startDate.getTime() === getPeriodTime()[readable.TODAY][0].getTime() &&
  endDate.getTime() === getPeriodTime()[readable.TODAY][1].getTime();

export const isYesterday = ({ startDate, endDate }: Range) =>
  startDate.getTime() === getPeriodTime()[readable.YESTERDAY][0].getTime() &&
  endDate.getTime() === getPeriodTime()[readable.YESTERDAY][1].getTime();

export const isThisWeek = ({ startDate, endDate }: Range) =>
  startDate.getTime() === getPeriodTime()[readable.THIS_WEEK][0].getTime() &&
  endDate.getTime() === getPeriodTime()[readable.THIS_WEEK][1].getTime();

export const isLastWeek = ({ startDate, endDate }: Range) =>
  startDate.getTime() === getPeriodTime()[readable.LAST_WEEK][0].getTime() &&
  endDate.getTime() === getPeriodTime()[readable.LAST_WEEK][1].getTime();

export const isThisMonth = ({ startDate, endDate }: Range) =>
  startDate.getTime() === getPeriodTime()[readable.THIS_MONTH][0].getTime() &&
  endDate.getTime() === getPeriodTime()[readable.THIS_MONTH][1].getTime();

export const isLastMonth = ({ startDate, endDate }: Range) =>
  startDate.getTime() === getPeriodTime()[readable.LAST_MONTH][0].getTime() &&
  endDate.getTime() === getPeriodTime()[readable.LAST_MONTH][1].getTime();

export const isThisYear = ({ startDate, endDate }: Range) =>
  startDate.getTime() === getPeriodTime()[readable.THIS_YEAR][0].getTime() &&
  endDate.getTime() === getPeriodTime()[readable.THIS_YEAR][1].getTime();

export const isLastYear = ({ startDate, endDate }: Range) =>
  startDate.getTime() === getPeriodTime()[readable.LAST_YEAR][0].getTime() &&
  endDate.getTime() === getPeriodTime()[readable.LAST_YEAR][1].getTime();

export const getMatchingReadableType = ({ startDate, endDate }: Range) => {
  const match = Object.keys(readable)
    .filter((k) => k !== "CUSTOM")
    .find((key) => {
      const enumKey = key as keyof typeof readable;
      const checkFn = getPeriodTime()[readable[enumKey]][3];

      return checkFn({ startDate, endDate });
    }) as keyof typeof readable;

  return match ? readable[match] : readable.CUSTOM;
};

export const getMatchingPeriodType = ({ startDate, endDate }: Range) => {
  if (isSameDay(startDate, endDate)) return periods.DAY;
  if (
    isSameWeek(startDate, endDate, { weekStartsOn: 1 }) &&
    isMonday(startDate) &&
    isSunday(endDate)
  )
    return periods.WEEK;
  if (
    isSameMonth(startDate, endDate) &&
    isFirstDayOfMonth(startDate) &&
    isLastDayOfMonth(endDate)
  )
    return periods.MONTH;
  if (
    isSameYear(startDate, endDate) &&
    isSameDay(startOfYear(startDate), startDate) &&
    isSameDay(endOfYear(endDate), endDate)
  )
    return periods.YEAR;

  return periods.CUSTOM;
};

export const formatCustomReadable = (
  { startDate, endDate }: Range,
  printable: readable
) => {
  if (printable !== readable.CUSTOM) return printable;

  // same day case
  if (isSameDay(startDate, endDate)) return format(startDate, "dd LLL");

  // show full month
  if (
    isSameMonth(startDate, endDate) &&
    isFirstDayOfMonth(startDate) &&
    isLastDayOfMonth(endDate)
  ) {
    return format(startDate, "MMMM y");
  }

  // full year
  if (
    isSameYear(startDate, endDate) &&
    isSameDay(startOfYear(startDate), startDate) &&
    isSameDay(endOfYear(endDate), endDate)
  ) {
    return format(startDate, "y");
  }

  if (isSameYear(startDate, endDate)) {
    // same year, don't display it
    return format(startDate, "dd LLL").concat(" - ", format(endDate, "dd LLL"));
  }

  return format(startDate, "dd LLL y").concat(
    " - ",
    format(endDate, "dd LLL y")
  );
};
