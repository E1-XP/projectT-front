import React, { useCallback, useState } from "react";
import styled, { keyframes } from "styled-components";
import {
  PieChart,
  Pie,
  Label,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import intervalToDuration from "date-fns/intervalToDuration";

import { useStoreSelector } from "../../hooks";
import { useWindowSize } from "../../hooks/useWindowSize";

import {
  GroupedEntries,
  groupEntriesByDays,
  SingleDay,
} from "../../selectors/groupEntriesByDays";
import { State } from ".";
import { formatDuration } from "./../../helpers";

import {
  darkGrey,
  greyWhite,
  greyWhiteDarker,
  white,
  whiteGrey,
  breakPoints,
} from "../../styles/variables";
import { emToPx, getBP } from "../../styles/helpers";

import { formatDurationReadable } from "./helpers";

interface Props {
  periodState: State;
}

const Color_Indicator = styled.span`
  display: inline-block;
  width: 0.6rem;
  height: 0.6rem;
  background-color: ${(props) => props.color};
  border-radius: 50%;
  margin-right: 0.5rem;
`;

const List_item = styled.li`
  width: 15rem;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background-color: ${(props: { isCurrentItem: boolean }) =>
    props.isCurrentItem ? "#efeb97" : white};

  ${getBP(breakPoints.small)} {
    width: 13rem;
  }
`;

const Wrapper = styled.section`
  width: 100%;
  height: 300px;
  background-color: ${white};
  margin-top: 2rem;
  margin-bottom: 4rem;
  box-shadow: 0 1px 3px rgba(128, 128, 128, 0.2);
  position: relative;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.6);
  transition: all 0.4s linear;
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
    from {
        transform:rotate(0deg);
    }

    to {
        transform:rotate(360deg);
    }
`;

const Spinner = styled.span`
  width: 3.125rem;
  height: 3.125rem;
  border: 3px solid ${greyWhite};
  border-right: 3px solid transparent;
  border-radius: 50%;
  transform: translateZ(0);
  animation: ${rotateAnim} 0.5s linear infinite;
`;

export const ProjectChart = ({ periodState }: Props) => {
  const { startDate, endDate } = periodState;

  const [activeIdx, setActiveIdx] = useState(-1);
  const [hoveredProject, setHoveredProject] = useState("");

  const size = useWindowSize();

  const onMouseEnter = useCallback((payload, idx) => {
    setHoveredProject(payload.name);
    setActiveIdx(idx);
  }, []);
  const onMouseLeave = useCallback(() => setHoveredProject(""), []);

  const { isLoading, isFetching } = useStoreSelector((state) => state.global);
  const entriesByDays = useStoreSelector(groupEntriesByDays);
  const projects = useStoreSelector((store) => store.user.projects);

  const periodFilter = ({ start, stop }: SingleDay) =>
    start >= startDate.getTime() && stop <= endDate.getTime();
  const periodDaysArr = Object.values(entriesByDays).filter(periodFilter);

  const getNoProjectDuration = () =>
    periodDaysArr.reduce((acc, day) => {
      return (acc += day.entries
        .filter((entry) => !entry.project)
        .reduce((acc, { start, stop }) => (acc += stop - start), 0));
    }, 0);

  const noProjectDuration = {
    name: "no project",
    fill: greyWhiteDarker,
    totalDuration: getNoProjectDuration(),
  };

  const periodProjectDurations = periodDaysArr.reduce(
    (acc, day) => {
      Object.entries(day.projects).map(([name, value]) => {
        const getFill = () =>
          projects.find((project) => project.name === name)?.color ||
          greyWhiteDarker;
        const foundProjectIdx = acc.findIndex(
          (project) => project.name === name
        );

        if (foundProjectIdx !== -1) {
          acc[foundProjectIdx].totalDuration += value.totalDuration;
        } else {
          acc.push({ ...value, name, fill: getFill() });
        }
      });
      return acc;
    },
    [noProjectDuration] as (GroupedEntries & { name: string; fill: string })[]
  );

  const totalPeriodDuration = periodProjectDurations.reduce(
    (acc, project) => (acc += project.totalDuration),
    0
  );

  const periodContainsData = !!totalPeriodDuration;

  const getSelectedDuration = () => {
    const projectSelected = periodProjectDurations.find(
      (project) => project.name === hoveredProject
    );

    return projectSelected
      ? projectSelected.totalDuration
      : totalPeriodDuration;
  };

  const isMobile = size.width && size.width < emToPx(breakPoints.small);

  const customLegend = ({ payload }: any) => (
    <ul>
      {payload
        .filter((item: any) => item.payload.totalDuration)
        .map((item: any, i: number) => (
          <List_item
            isCurrentItem={hoveredProject === item.value}
            value={item.value}
            key={`${i}-${item.value}`}
          >
            <span>
              <Color_Indicator color={item.color} />
              {item.value}
            </span>
            <span>
              {formatDuration(
                intervalToDuration({
                  start: 0,
                  end: item.payload.totalDuration,
                })
              )}
            </span>
          </List_item>
        ))}
    </ul>
  );

  return (
    <Wrapper>
      <Overlay isVisible={isLoading || isFetching || !periodContainsData}>
        {isLoading ? (
          <Spinner />
        ) : periodContainsData ? (
          ""
        ) : (
          "No data available for this period"
        )}
      </Overlay>
      <ResponsiveContainer>
        <PieChart width={700} height={300}>
          <Pie
            isAnimationActive={false}
            data={periodProjectDurations}
            innerRadius={isMobile ? 50 : 70}
            cx={"55%"}
            outerRadius={isMobile ? 100 : 140}
            dataKey="totalDuration"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            activeIndex={activeIdx}
          >
            {periodProjectDurations.map((project) => (
              <Cell
                key={project.name}
                style={{
                  opacity: hoveredProject === project.name ? ".7" : "1",
                }}
              />
            ))}
            <Label
              value={formatDurationReadable(
                intervalToDuration({ start: 0, end: getSelectedDuration() })
              )}
              position="center"
              style={{ fontSize: "1.5rem" }}
            />
          </Pie>
          <Legend
            content={customLegend}
            layout="vertical"
            align="left"
            verticalAlign="middle"
            iconSize={8}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </Wrapper>
  );
};
