import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import { useStoreDispatch, useStoreSelector } from "../../hooks";
import { groupEntriesByDays } from "../../selectors/groupEntriesByDays";

import { Project } from "../../store/interfaces";

import { fetchEntries, removeProject } from "../../actions/user";

import { ProjectsTable } from "./projectsTable";
import { CreationModal } from "./creationModal";
import { ConfirmationModal } from "./confirmationModal";
import { Button_create, Button_remove } from "../../components/buttons";

import { getPeriodProjectDurations } from "../../helpers";
import { SortBy, sortFn, SortOrder } from "./helpers";

import { breakPoints } from "../../styles/variables";
import { getBP } from "./../../styles/helpers";

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
  font-size: 2.125rem;
  font-weight: 500;
`;

const Footer = styled.section`
  display: flex;
`;

export const Projects = () => {
  const dispatch = useStoreDispatch();

  const projects = useStoreSelector((state) => state.user.projects);
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
  }, [projects]);

  const onButtonRemove = useCallback(() => {
    state.sortedProjects
      .filter(({ isChecked }) => isChecked)
      .forEach(({ name }) => dispatch(removeProject(name)));
  }, [state.sortedProjects]);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const openConfirmationModal = useCallback(
    () => setIsConfirmationModalOpen(true),
    []
  );

  const periodDaysArr = Object.values(entriesByDays);

  const periodProjectDurations = getPeriodProjectDurations(
    periodDaysArr,
    projects
  );

  return (
    <Wrapper>
      <Header>
        <Heading>Projects</Heading>
        <Button_create onClick={openModal}>Create Project</Button_create>
      </Header>
      <ProjectsTable
        projects={projects}
        periodProjectDurations={periodProjectDurations}
        state={state}
        setState={setState}
      />
      <Footer>
        {!!projects.length && (
          <Button_remove
            onClick={openConfirmationModal}
            disabled={!state.sortedProjects.some(({ isChecked }) => isChecked)}
          >
            Remove Selected
          </Button_remove>
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
