import React, { useCallback, useState, ChangeEvent } from "react";

import { Icon } from "../../../components/icon";

import { Screen_Blocker } from "../styles";
import {
  Item_Link,
  Color_Indicator,
  Item_Project,
  Item_Link_Toggle,
  Relative_Container,
  Wrapper,
  Search_Bar,
  Input,
  List,
  Item,
} from "./styles";
import { greyWhite } from "../../../styles/variables";

import { Project } from "../../../store/interfaces";

interface Props {
  isHovered: boolean;
  projects: Project[];
  currentProject?: Project;
  wrapperStyle?: Record<string, string>;
  onProjectSelect: (project: string) => any;
}

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
