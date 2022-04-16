import React, { useCallback, useEffect, useState, lazy, Suspense } from "react";

import { useStoreDispatch, useStoreSelector } from "../../hooks";
import { groupEntriesByDays } from "../../selectors/groupEntriesByDays";

import { Project } from "../../store/interfaces";

import { fetchEntries, removeProject } from "../../actions/user";

const ProjectsTable = lazy(() => import("./projectsTable"));
import { CreationModal } from "./creationModal";
import { ConfirmationModal } from "./confirmationModal";
import { Button_Success, Button_Danger } from "../../components/buttons";
import { ComponentLoader } from "../../components/loader";

import { getPeriodProjectDurations } from "../../helpers";
import { SortBy, sortFn, SortOrder } from "./helpers";

import {
  Wrapper,
  Header,
  Heading,
  Figure,
  Decoration_Image,
  No_Entries,
  Footer,
} from "./style";

export interface State {
  sortedProjects: (Project & { isChecked: boolean })[];
  isMainCheckBoxChecked: boolean;
  sortOrder: SortOrder;
  sortBy: SortBy;
}

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
    projects.length && dispatch(fetchEntries(0));
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
        <Button_Success onClick={openModal}>Create Project</Button_Success>
      </Header>
      {projects.length ? (
        <Suspense fallback={<ComponentLoader isVisible={true} />}>
          <ProjectsTable
            projects={projects}
            periodProjectDurations={periodProjectDurations}
            state={state}
            setState={setState}
          />
        </Suspense>
      ) : (
        <>
          <Figure>
            <Decoration_Image
              src={
                require("./../../../public/assets/projects-page.svg").default
              }
            />
            <figcaption>
              <a href="https://www.freepik.com/vectors/business">
                Business vector created by pikisuperstar - www.freepik.com
              </a>
            </figcaption>
          </Figure>
          <No_Entries>
            No projects found. Press the 'Create Project' button to get started.
          </No_Entries>
        </>
      )}
      <Footer>
        {!!projects.length && (
          <Button_Danger
            onClick={openConfirmationModal}
            disabled={!state.sortedProjects.some(({ isChecked }) => isChecked)}
          >
            Remove Selected
          </Button_Danger>
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
