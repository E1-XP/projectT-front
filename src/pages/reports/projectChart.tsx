import React from "react";
import styled, { keyframes } from "styled-components";
import {
  PieChart,
  Pie,
  Label,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { useStoreSelector } from "../../hooks";
import {
  GroupedEntries,
  groupEntriesByDays,
  SingleDay,
} from "../../selectors/groupEntriesByDays";
import { State } from ".";

import { greyWhiteDarker } from "../../styles/variables";

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
  background-color: ${(props: any) =>
    props.value === props.state ? "#efeb97" : "#fff"};
`;

const Wrapper = styled.section`
  width: 100%;
  height: 300px;
  background-color: #fff;
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
  color: #bbb;
  font-size: 18px;
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
  border: 3px solid #ddd;
  border-right: 3px solid transparent;
  border-radius: 50%;
  transform: translateZ(0);
  animation: ${rotateAnim} 0.5s linear infinite;
`;

export const ProjectChart = ({ periodState }: Props) => {
  const { startDate, endDate } = periodState;

  const entriesByDays = useStoreSelector(groupEntriesByDays);
  const projects = useStoreSelector((store) => store.user.projects);

  const periodFilter = ({ start, stop }: SingleDay) =>
    start >= startDate.getTime() && stop <= endDate.getTime();
  const entriesByDaysArr = Object.values(entriesByDays).filter(periodFilter);

  const periodProjectDurations = entriesByDaysArr.reduce((acc, day) => {
    Object.entries(day.projects).map(([name, value]) => {
      const getFill = () =>
        projects.find((project) => project.name === name)?.color ||
        greyWhiteDarker;
      const foundProjectIdx = acc.findIndex((project) => project.name === name);

      if (foundProjectIdx !== -1) {
        acc[foundProjectIdx].totalDuration += value.totalDuration;
      } else {
        acc.push({ ...value, name, fill: getFill() });
      }
    });
    return acc;
  }, [] as (GroupedEntries & { name: string; fill: string })[]);

  return (
    <Wrapper>
      <Overlay isVisible={false}></Overlay>
      <ResponsiveContainer>
        <PieChart width={700} height={300}>
          <Pie
            isAnimationActive={false}
            data={periodProjectDurations}
            innerRadius={70}
            cx={"55%"}
            outerRadius={140}
            dataKey="totalDuration"
            // onMouseEnter={handleMouseEnter}
            // onMouseLeave={handleMouseLeave}
            // activeIndex={activeIdx}
          >
            {periodProjectDurations.map((project, i) => (
              <Cell
                key={project.name}
                // style={{ opacity: hoveredItem === itm.name ? ".7" : "1" }}
              />
            ))}
            <Label
              //   value={labelValue}
              position="center"
              style={{ fontSize: "26px" }}
            />
          </Pie>
          <Legend
            // content={}
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
