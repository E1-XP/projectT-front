import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { useStoreDispatch, useStoreSelector } from "../../hooks";
import {
  GroupedEntries,
  groupEntriesByDays,
  SingleDay,
} from "../../selectors/groupEntriesByDays";

import { fetchEntries } from "../../actions/user";

import { ProjectsTable } from "./projectsTable";

import {
  breakPoints,
  green,
  red,
  white,
  greyWhiteDarker,
} from "../../styles/variables";
import { getBP } from "./../../styles/helpers";
import { getPeriodProjectDurations } from "../../helpers";

const Wrapper = styled.main`
  width: 100%;
  max-width: ${breakPoints.large};
  margin: 1rem auto;
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  padding-top: 0;
  flex-direction: column;

  ${getBP(breakPoints.verySmall)} {
    display: block;
    width: 100%;
    height: 100vh;
    overflow-y: scroll;
    margin: initial;
    padding-top: 1rem;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
`;

const Heading = styled.h2`
  font-size: 2.125rem;
  font-weight: 500;
`;

const Button = styled.button`
  cursor: pointer;
  border: none;
  padding: 0.8rem;
  font-weight: 700;
  font-size: 0.875rem;
  transition: all 0.2s ease-in;
  color: ${white};
  min-width: 8rem;
`;

const Button_Create = styled(Button)`
  background-color: ${green};

  &:hover {
    background-color: #3fa900;
  }
`;

const Button_Remove = styled(Button)`
  background-color: ${red};

  &:hover {
    background-color: #c20000;
  }
`;

const Footer = styled.section`
  display: flex;
`;

export const Projects = () => {
  const dispatch = useStoreDispatch();

  useEffect(() => {
    dispatch(fetchEntries(0));
  }, []);

  const projects = useStoreSelector((state) => state.user.projects);
  const entriesByDays = useStoreSelector(groupEntriesByDays);
  const periodDaysArr = Object.values(entriesByDays);

  const periodProjectDurations = getPeriodProjectDurations(
    periodDaysArr,
    projects
  );

  return (
    <Wrapper>
      <Header>
        <Heading>Projects</Heading>
        <Button_Create>Create Project</Button_Create>
      </Header>
      <ProjectsTable
        projects={projects}
        periodProjectDurations={periodProjectDurations}
      />
      <Footer>
        {!!projects.length && (
          <Button_Remove disabled={false ? false : true}>
            Remove Selected
          </Button_Remove>
        )}
      </Footer>
    </Wrapper>
  );
};
