import startOfWeek from "date-fns/startOfWeek";
import endOfWeek from "date-fns/endOfWeek";
import startOfDay from "date-fns/startOfDay";
import endOfDay from "date-fns/endOfDay";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import startOfYear from "date-fns/startOfYear";
import endOfYear from "date-fns/endOfYear";
import sub from "date-fns/sub";
import isThisYearDFns from "date-fns/isThisYear";
import isSameDay from "date-fns/isSameDay";
import format from "date-fns/format";

import { State } from ".";

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

type stateDates = Pick<State, "startDate" | "endDate">;
type checkFn = (paramObj: stateDates) => boolean;

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

export const isToday = ({ startDate, endDate }: stateDates) =>
  startDate.getTime() === getPeriodTime()[readable.TODAY][0].getTime() &&
  endDate.getTime() === getPeriodTime()[readable.TODAY][1].getTime();

export const isYesterday = ({ startDate, endDate }: stateDates) =>
  startDate.getTime() === getPeriodTime()[readable.YESTERDAY][0].getTime() &&
  endDate.getTime() === getPeriodTime()[readable.YESTERDAY][1].getTime();

export const isThisWeek = ({ startDate, endDate }: stateDates) =>
  startDate.getTime() === getPeriodTime()[readable.THIS_WEEK][0].getTime() &&
  endDate.getTime() === getPeriodTime()[readable.THIS_WEEK][1].getTime();

export const isLastWeek = ({ startDate, endDate }: stateDates) =>
  startDate.getTime() === getPeriodTime()[readable.LAST_WEEK][0].getTime() &&
  endDate.getTime() === getPeriodTime()[readable.LAST_WEEK][1].getTime();

export const isThisMonth = ({ startDate, endDate }: stateDates) =>
  startDate.getTime() === getPeriodTime()[readable.THIS_MONTH][0].getTime() &&
  endDate.getTime() === getPeriodTime()[readable.THIS_MONTH][1].getTime();

export const isLastMonth = ({ startDate, endDate }: stateDates) =>
  startDate.getTime() === getPeriodTime()[readable.LAST_MONTH][0].getTime() &&
  endDate.getTime() === getPeriodTime()[readable.LAST_MONTH][1].getTime();

export const isThisYear = ({ startDate, endDate }: stateDates) =>
  startDate.getTime() === getPeriodTime()[readable.THIS_YEAR][0].getTime() &&
  endDate.getTime() === getPeriodTime()[readable.LAST_YEAR][1].getTime();

export const isLastYear = ({ startDate, endDate }: stateDates) =>
  startDate.getTime() === getPeriodTime()[readable.LAST_YEAR][0].getTime() &&
  endDate.getTime() === getPeriodTime()[readable.LAST_YEAR][1].getTime();

export const getMatchingPeriod = ({ startDate, endDate }: stateDates) => {
  const match = Object.keys(readable)
    .filter((k) => k !== "CUSTOM")
    .find((key) => {
      const enumKey = key as keyof typeof readable;
      const checkFn = getPeriodTime()[readable[enumKey]][3];

      return checkFn({ startDate, endDate });
    }) as keyof typeof readable;

  return match ? readable[match] : readable.CUSTOM;
};

export const formatCustomReadable = (
  { startDate, endDate }: stateDates,
  printable: readable
) => {
  if (printable !== readable.CUSTOM) return printable;

  // same day case
  if (isSameDay(startDate, endDate)) return format(startDate, "dd LLL");

  // same year, don't display it
  if (isThisYearDFns(startDate)) {
    return format(startDate, "dd LLL").concat(" - ", format(endDate, "dd LLL"));
  }

  return format(startDate, "dd LLL y").concat(
    " - ",
    format(endDate, "dd LLL y")
  );
};

export const formatDurationReadable = ({
  days,
  hours,
  minutes,
  seconds,
}: Duration) => {
  if (hours || days) {
    const total = (days || 0) * 24 + (hours || 0);
    return `${total} hour${total > 1 ? "s" : ""}`;
  }

  if (minutes) return `${minutes} minute${minutes > 1 ? "s" : ""}`;

  return `${seconds || 0} second${(seconds || 0) > 1 ? "s" : ""}`;
};
