import React, { useCallback, useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Label,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import intervalToDuration from "date-fns/intervalToDuration";

import { useStoreSelector } from "../../../hooks";
import { useWindowSize } from "../../../hooks/useWindowSize";

import {
  groupEntriesByDays,
  SingleDay,
} from "../../../selectors/groupEntriesByDays";

import { State } from "..";
import { Range } from "../hooks";

import { ComponentLoader } from "../../../components/loader";

import {
  formatDuration,
  getPeriodProjectDurations,
  getTotalPeriodDuration,
} from "../../../helpers";
import { formatDurationReadable } from "../../../helpers";

import { greyWhite, white, breakPoints } from "../../../styles/variables";
import { emToPx, getBP } from "../../../styles/helpers";
import { Wrapper } from "./style";
import { List_Item, Color_Indicator } from "./style";

interface Props {
  periodState: State;
  range: Range;
}

export const ProjectChart = ({ range }: Props) => {
  const { startDate, endDate } = range;

  const [activeIdx, setActiveIdx] = useState(-1);
  const [hoveredProject, setHoveredProject] = useState("");

  const size = useWindowSize();

  const onMouseEnter = useCallback((payload, idx) => {
    setHoveredProject(payload.name);
    setActiveIdx(idx);
  }, []);
  const onMouseLeave = useCallback(() => setHoveredProject(""), []);

  const { isLoading, isFetching } = useStoreSelector((state) => state.global);
  const { duration: timerDuration, project } = useStoreSelector(
    (store) => store.timer
  );
  const entriesByDays = useStoreSelector(groupEntriesByDays);
  const projects = useStoreSelector((store) => store.user.projects);

  const periodFilter = ({ start, stop }: SingleDay) =>
    start >= startDate.getTime() && stop <= endDate.getTime();
  const periodDaysArr = Object.values(entriesByDays).filter(periodFilter);

  const periodProjectDurations = getPeriodProjectDurations(
    periodDaysArr,
    projects,
    timerDuration,
    project
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
          <List_Item
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
          </List_Item>
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

export default ProjectChart;
