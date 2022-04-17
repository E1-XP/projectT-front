import React from "react";

import { ProfileDropdown } from "../profileDropdown";
import { Icon } from "../icon";

import { useStoreSelector } from "../../hooks";
import { selectGlobal, selectTimer, selectUserData } from "../../selectors";

import {
  Header,
  Header_Link,
  Link_Label,
  Navigation_Item,
  Navigation_Link,
  Navigation_List,
  Sidebar_Header,
  Sidebar_Navigation,
  Sidebar_Profile,
  Wrapper,
} from "./style";

export const Sidebar = () => {
  const { isFetching } = useStoreSelector(selectGlobal);
  const { isRunning, timer } = useStoreSelector(selectTimer);
  const {
    settings: { shouldShowTimerOnTitle },
  } = useStoreSelector(selectUserData);

  return (
    <Wrapper>
      <Sidebar_Header>
        <Header>
          <Header_Link to="/timer">
            <Link_Label>Project</Link_Label>T
          </Header_Link>
        </Header>
      </Sidebar_Header>
      <Sidebar_Navigation>
        <Navigation_List>
          <Navigation_Item>
            <Navigation_Link
              to="/timer"
              $isFetching={isFetching}
              activeClassName="active"
            >
              <Icon name="access_time" />
              <Link_Label>
                {isRunning && shouldShowTimerOnTitle ? timer : "Timer"}
              </Link_Label>
            </Navigation_Link>
          </Navigation_Item>
          <Navigation_Item>
            <Navigation_Link
              to="/reports"
              $isFetching={isFetching}
              activeClassName="active"
            >
              <Icon name="bar_chart" />
              <Link_Label>Reports</Link_Label>
            </Navigation_Link>
          </Navigation_Item>
          <Navigation_Item>
            <Navigation_Link
              to="/projects"
              $isFetching={isFetching}
              activeClassName="active"
            >
              <Icon name="folder" />
              <Link_Label>Projects</Link_Label>
            </Navigation_Link>
          </Navigation_Item>
        </Navigation_List>
      </Sidebar_Navigation>
      <Sidebar_Profile>
        <ProfileDropdown />
      </Sidebar_Profile>
    </Wrapper>
  );
};
