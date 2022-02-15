import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
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
  groupEntriesByDays,
  SingleDay,
} from "../../selectors/groupEntriesByDays";
import { State } from ".";
import {
  formatDuration,
  getPeriodProjectDurations,
  getTotalPeriodDuration,
} from "./../../helpers";

import { greyWhite, white, breakPoints } from "../../styles/variables";
import { emToPx, getBP } from "../../styles/helpers";

import { formatDurationReadable } from "./../../helpers";
import { ComponentLoader } from "../../components/loader";

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

  & > .recharts-legend-wrapper {
    top: 0;
    left: 2rem !important;
    bottom: initial !important;

    ${getBP("25em")} {
      left: 0 !important;
    }
  }
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

  const periodProjectDurations = getPeriodProjectDurations(
    periodDaysArr,
    projects
  );

  const totalPeriodDuration = getTotalPeriodDuration(periodProjectDurations);

  const periodContainsData = !!totalPeriodDuration;

  const getSelectedDuration = () => {
    const projectSelected = periodProjectDurations.find(
      (project) => project.name === hoveredProject
    );

    return projectSelected
      ? projectSelected.totalDuration
      : totalPeriodDuration;
  };

  useEffect(() => {
    const legend = document.querySelector(
      ".recharts-legend-wrapper"
    ) as HTMLElement;

    if (legend) {
      const { height } = legend.getBoundingClientRect();
      legend.style.top = `calc(50% - ${height / 2}px)`;
    }
  }, [periodProjectDurations.length]);

  const isLargeSize = size.width && size.width >= emToPx(breakPoints.large);
  const isSmallPhone = size.width && size.width < emToPx(breakPoints.verySmall);

  const legendStyle = { top: 0, transform: "translateY(100%)" };

  const customLegend = () => (
    <ul>
      {periodProjectDurations
        .filter((item) => item.totalDuration)
        .map((item, i) => (
          <List_item
            isCurrentItem={hoveredProject === item.name}
            value={item.name}
            key={`${i}-${item.name}`}
          >
            <span>
              <Color_Indicator color={item.fill} />
              {item.name}
            </span>
            <span>
              {formatDuration(
                intervalToDuration({
                  start: 0,
                  end: item.totalDuration,
                })
              )}
            </span>
          </List_item>
        ))}
    </ul>
  );

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
        <PieChart>
          <Pie
            animationDuration={300}
            data={periodProjectDurations}
            dataKey="totalDuration"
            innerRadius={isLargeSize ? "40%" : isSmallPhone ? "30%" : "35%"}
            outerRadius={isLargeSize ? "80%" : isSmallPhone ? "63%" : "75%"}
            cx={isSmallPhone ? "72%" : "70%"}
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
              style={{ fontSize: isLargeSize ? "1.2rem" : "1.5rem" }}
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <Legend
        style={legendStyle}
        content={customLegend}
        layout="vertical"
        align="left"
        iconSize={8}
        iconType="circle"
      />
    </Wrapper>
  );
};
