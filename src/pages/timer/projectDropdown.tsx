import React, { useCallback, useState, ChangeEvent } from "react";
import styled from "styled-components";

import { Icon } from "../../components/icon";
import { Screen_Blocker } from "./styles";

import { Project } from "../../store/interfaces";

import {
  breakPoints,
  greyWhite,
  greyWhiteDarker,
  white,
  whiteGrey,
  green,
  black,
} from "../../styles/variables";
import { getBP } from "../../styles/helpers";

interface Props {
  isHovered: boolean;
  projects: Project[];
  currentProject?: Project;
  wrapperStyle?: Record<string, string>;
  onProjectSelect: (project: string) => any;
}

const Item_Link = styled.a`
  cursor: pointer;
`;

interface IItem_Link_Toggle {
  isActive: boolean;
}

const Item_Link_Toggle = styled(Item_Link)<IItem_Link_Toggle>`
  opacity: ${(props) => (props.isActive ? "1" : "0")};
  pointer-events: ${(props) => (props.isActive ? "all" : "none")};
  color: ${(props) => (props.isActive ? greyWhiteDarker : whiteGrey)};
  background-color: ${(props) => (props.isActive ? whiteGrey : "transparent")};
  padding: 0.2rem 0.4rem;
  border-radius: 5px;

  &:hover {
    color: ${greyWhiteDarker};
  }
`;

interface IItem {
  project?: boolean;
}

const Item = styled.li`
  padding: 0.5rem;
  width: 15rem;
  border-radius: 5px;
  background-color: ${(props: IItem) => (props.project ? whiteGrey : white)};
  color: ${(props: IItem) => (props.project ? green : black)};

  &:hover {
    background-color: ${whiteGrey};
  }
`;

const List = styled.ul`
  max-height: 12rem;
  overflow-y: auto;
`;

const Color_Indicator = styled.span`
  display: inline-block;
  width: 0.6rem;
  height: 0.6rem;
  background-color: ${(props) => props.color};
  border-radius: 50%;
  margin-right: 0.5rem;
`;

const Item_Project = styled.span`
  color: ${({ color }) => color};

  ${getBP(breakPoints.small)} {
    display: none;
  }
`;

const Input = styled.input`
  margin-left: 0.5rem;
  border: none;

  &:focus {
    outline-style: dashed;
    outline-color: lightgrey;
    border-radius: 5px;
    outline-width: 2px;
  }
`;

const Search_Bar = styled.div`
  display: flex;
  justify-content: center;
  border-radius: 5px;
  border: 1px solid ${greyWhite};
  padding: 0.1rem;
  margin-bottom: 0.5rem;
`;

interface IWrapper {
  currentProject: Props["currentProject"];
}

const Wrapper = styled.div`
  border-radius: 5px;
  position: absolute;
  z-index: 50;
  background-color: ${white};
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.2);
  padding: 0.7rem;
  max-height: 15rem;
  left: ${({ currentProject }: IWrapper) =>
    currentProject ? "-7rem" : "-2.5rem"};
  top: 2rem;
`;

const Relative_Container = styled.div`
  position: relative;
`;

export const ProjectDropdown = ({
  currentProject,
  projects,
  isHovered,
  wrapperStyle,
  onProjectSelect,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const onInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setInputValue(e.currentTarget.value),
    []
  );
  const openMenu = useCallback(() => setIsOpen(true), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  return (
    <>
      {currentProject && (
        <Item_Link onClick={openMenu}>
          <Color_Indicator color={currentProject?.color} />
          <Item_Project color={currentProject?.color}>
            {currentProject.name}
          </Item_Project>
        </Item_Link>
      )}
      {!currentProject && (
        <Item_Link_Toggle onClick={openMenu} isActive={isHovered}>
          <Icon name="folder" size="1.25rem" />
        </Item_Link_Toggle>
      )}
      {isOpen && (
        <Relative_Container>
          <Wrapper style={wrapperStyle} currentProject={currentProject}>
            <Search_Bar>
              <Icon name="search" fill={greyWhite} size="1.25rem" />
              <Input
                placeholder="Find project..."
                value={inputValue}
                onChange={onInputChange}
              />
            </Search_Bar>

            <List>
              {projects
                .filter(({ name }) => name.includes(inputValue))
                .map((project) => (
                  <Item
                    key={project.name}
                    project={currentProject?.name === project.name}
                    onClick={() => {
                      onProjectSelect(project.name);
                      closeMenu();
                    }}
                  >
                    <Item_Link>
                      <Color_Indicator color={project?.color} />
                      {project.name}
                    </Item_Link>
                  </Item>
                ))}
              {
                <Item
                  key={"no project"}
                  project={!currentProject}
                  onClick={() => {
                    onProjectSelect("");
                    closeMenu();
                  }}
                >
                  <Item_Link>
                    <Color_Indicator color={greyWhite} />
                    {"no project"}
                  </Item_Link>
                </Item>
              }
              {!projects.filter(({ name }) => name.includes(inputValue))
                .length && (
                <Item key="nothing to show">
                  <Item_Link>No projects found</Item_Link>
                </Item>
              )}
            </List>
          </Wrapper>
        </Relative_Container>
      )}
      {isOpen && <Screen_Blocker onClick={closeMenu} />}
    </>
  );
};
