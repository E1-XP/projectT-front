import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import { useStoreDispatch, useStoreSelector } from "../../hooks";
import { groupEntriesByDays } from "../../selectors/groupEntriesByDays";

import { Project } from "../../store/interfaces";

import { fetchEntries, removeProject } from "../../actions/user";

import { ProjectsTable } from "./projectsTable";
import { CreationModal } from "./creationModal";
import { ConfirmationModal } from "./confirmationModal";
import { Button_success, Button_danger } from "../../components/buttons";

import { getPeriodProjectDurations } from "../../helpers";
import { SortBy, sortFn, SortOrder } from "./helpers";

import { breakPoints } from "../../styles/variables";
import { getBP } from "./../../styles/helpers";
import { Heading as HeadingCSS, Paragraph } from "../../styles/typography";

export interface State {
  sortedProjects: (Project & { isChecked: boolean })[];
  isMainCheckBoxChecked: boolean;
  sortOrder: SortOrder;
  sortBy: SortBy;
}

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
  ${HeadingCSS}
`;

const No_Projects_image = styled.img`
  width: 50%;
  margin: 4rem auto;
  display: block;
  user-select: none;
  -webkit-user-drag: none;

  ${getBP(breakPoints.small)} {
    width: 80%;
  }
`;

const No_Entries = styled.p`
  ${Paragraph}

  display: block;
  padding: 1rem;
  text-align: center;
`;

const Footer = styled.section`
  display: flex;
`;

export const Projects = () => {
  const dispatch = useStoreDispatch();

  const projects = useStoreSelector((state) => state.user.projects);
  const { duration: timerDuration, project } = useStoreSelector(
    (store) => store.timer
  );

  const entriesByDays = useStoreSelector(groupEntriesByDays);

  const [state, setState] = useState<State>({
    sortedProjects: projects.map((p) => ({ ...p, isChecked: false })),
    isMainCheckBoxChecked: false,
    sortOrder: "asc",
    sortBy: "name",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchEntries(0));
  }, []);

  useEffect(() => {
    const { sortBy, sortOrder } = state;

    setState({
      ...state,
      sortedProjects: projects
        .map((p) => ({ ...p, isChecked: false }))
        .sort(sortFn(sortBy, sortOrder)),
    });

    if (isConfirmationModalOpen) setIsConfirmationModalOpen(false);
  }, [projects]);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const openConfirmationModal = useCallback(
    () => setIsConfirmationModalOpen(true),
    []
  );

  const onButtonRemove = useCallback(() => {
    state.sortedProjects
      .filter(({ isChecked }) => isChecked)
      .forEach(({ name }) => dispatch(removeProject(name)));
  }, [state.sortedProjects]);

  const periodDaysArr = Object.values(entriesByDays);

  const periodProjectDurations = getPeriodProjectDurations(
    periodDaysArr,
    projects,
    timerDuration,
    project
  );

  return (
    <Wrapper>
      <Header>
        <Heading>Projects</Heading>
        <Button_success onClick={openModal}>Create Project</Button_success>
      </Header>
      {projects.length ? (
        <ProjectsTable
          projects={projects}
          periodProjectDurations={periodProjectDurations}
          state={state}
          setState={setState}
        />
      ) : (
        <>
          <No_Projects_image
            src={require("./../../../public/assets/projects-page.svg").default}
          />
          <No_Entries>
            No projects found. Press the 'Create Project' button to get started.
          </No_Entries>
        </>
      )}
      <Footer>
        {!!projects.length && (
          <Button_danger
            onClick={openConfirmationModal}
            disabled={!state.sortedProjects.some(({ isChecked }) => isChecked)}
          >
            Remove Selected
          </Button_danger>
        )}
      </Footer>
      <CreationModal isOpen={isModalOpen} closeModal={closeModal} />
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        setIsOpen={setIsConfirmationModalOpen}
        handleRemove={onButtonRemove}
      />
    </Wrapper>
  );
};

export default Projects;
