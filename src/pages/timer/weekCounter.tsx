import React from "react";
import styled from "styled-components";
import startOfWeek from "date-fns/startOfWeek";
import intervalToDuration from "date-fns/intervalToDuration";
import pickBy from "lodash/fp/pickBy";

import { black, greyWhiteDarker } from "../../styles/variables";

import { useStoreSelector } from "./../../hooks";
import {
  groupEntriesByDays,
  SingleDay,
} from "./../../selectors/groupEntriesByDays";

import { formatDuration, NO_PROJECT_PLACEHOLDER } from "./../../helpers";

import Tooltip from "rc-tooltip";

interface Props {}

const Week_Counter = styled.div`
  text-transform: uppercase;
  font-size: 0.813rem;
  padding: 1.8rem;
  color: ${greyWhiteDarker};
  font-weight: 500;
`;

const Week_Bar = styled.div`
  background-color: ${greyWhiteDarker};
  width: 100%;
  height: 3px;
  border-radius: 1.5px;
  margin-top: 3rem;
`;

interface IWeekBarPart {
  color: string;
  width: number;
}

const Week_Bar_Part = styled.div`
  background-color: ${(props: IWeekBarPart) => props.color};
  width: ${(props: IWeekBarPart) => props.width + "%"};
  height: 100%;
  float: left;

  > span {
    color: ${(props: IWeekBarPart) => props.color};
    position: relative;
    display: inline-block;
    bottom: 1.2rem;
    width: 100%;
  }
`;

const Bar_Text = styled.span`
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Timer = styled.span`
  color: ${black};
`;

const Tooltip_Container = styled.div`
  > span:not(:last-of-type) {
    margin-right: 0.5rem;
  }
`;

const overlayStyle = { fontSize: "0.875rem", padding: "0.5rem" };

const showInfoOnHover = (
  projectName: string,
  duration: number,
  weekTotal: number,
  color: string
) => {
  const readable = formatDuration(
    intervalToDuration({ start: 0, end: duration })
  );
  const percent = `${~~((duration / weekTotal) * 100)}%`;

  return (
    <Tooltip_Container>
      <span style={{ color }}>
        {projectName === "no project" ? "(No Project)" : projectName}
      </span>
      <span>{readable}</span>
      <span>{percent}</span>
    </Tooltip_Container>
  );
};

const weekStart = startOfWeek(Date.now(), { weekStartsOn: 1 }).getTime();

export const getThisWeekEntries = pickBy<SingleDay>(
  (val, key) => val.start >= weekStart
);

export const calcTotalDuration = (
  weekEntriesByDays: Record<string, SingleDay>,
  timerDuration: number
) =>
  Object.values(weekEntriesByDays).reduce(
    (acc, { totalDuration }) => acc + totalDuration,
    0
  ) + timerDuration;

export const WeekCounter = ({}: Props) => {
  const { duration: timerDuration, project } = useStoreSelector(
    (store) => store.timer
  );
  const projects = useStoreSelector((store) => store.user.projects);
  const getProjectColor = (name: string) => {
    const color = projects.find((project) => project.name === name)?.color;
    return color || greyWhiteDarker;
  };

  const entriesByDays = useStoreSelector(groupEntriesByDays);
  const weekEntriesByDays = getThisWeekEntries(entriesByDays);

  const weekProjectCount = Object.values(weekEntriesByDays).reduce(
    (acc, data) => {
      Object.entries(data.projects).forEach(([projectKey, data]) => {
        if (acc[projectKey] === undefined) acc[projectKey] = 0;
        acc[projectKey] += data.totalDuration;
      });

      acc[NO_PROJECT_PLACEHOLDER] += data.entries.reduce(
        (acc, data) => (acc += !data.project ? data.stop - data.start : 0),
        0
      );

      return acc;
    },
    {
      [NO_PROJECT_PLACEHOLDER]: !project ? timerDuration : 0,
      [project]: project ? timerDuration : 0,
    } as Record<string, number>
  );

  const totalDuration = calcTotalDuration(weekEntriesByDays, timerDuration);

  const getWidth = (projectSum: number) =>
    totalDuration ? (projectSum / totalDuration) * 100 : 100;

  return (
    <Week_Counter>
      This week:
      <Timer>
        {formatDuration(intervalToDuration({ start: 0, end: totalDuration }))}
      </Timer>
      <Week_Bar>
        {Object.entries(weekProjectCount)
          .filter(([_, sum]) => sum !== 0)
          .map(([key, sum]) => (
            <Tooltip
              key={key}
              overlay={showInfoOnHover(
                key,
                sum,
                totalDuration,
                getProjectColor(key)
              )}
              placement="top"
              overlayStyle={overlayStyle}
              mouseLeaveDelay={0.2}
            >
              <Week_Bar_Part
                key={key}
                width={getWidth(sum)}
                color={getProjectColor(key)}
              >
                {getWidth(sum) > 3 && (
                  <Bar_Text>
                    {key === "no project" ? "(NO PROJECT)" : key.toUpperCase()}
                  </Bar_Text>
                )}
              </Week_Bar_Part>
            </Tooltip>
          ))}
      </Week_Bar>
    </Week_Counter>
  );
};
