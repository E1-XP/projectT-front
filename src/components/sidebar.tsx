import React from "react";
import { Link, NavLink } from "react-router-dom";
import styled from "styled-components";

import { ProfileDropdown } from "./profileDropdown";
import { Icon } from "./../components/icon";
import { getBP } from "../styles/helpers";
import { breakPoints, darkGrey } from "../styles/variables";

const Wrapper = styled.section`
  color: white;
  background-color: rgb(50, 50, 50);
  box-shadow: 4px 0px 5px rgba(0, 0, 0, 0.2);
  max-width: 52px;
  padding: 1rem;
  order: -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  height: 100%;

  ${getBP(breakPoints.medium, "min")} {
    max-width: 15.62rem;
  }
`;

const Sidebar_profile = styled.section`
  margin-top: auto;
`;

const Sidebar_header = styled.header``;

const Sidebar_navigation = styled.nav`
  margin-top: 1rem;
`;

const Navigation_link = styled(NavLink)`
  color: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.3rem;
  border-radius: 7px;
  position: relative;

  @media only screen and (min-width: 1024px) {
    justify-content: initial;
  }
  &:hover {
    color: white;
  }

  &.active {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const Header_link = styled(Link)`
  color: #ddd;
  display: flex;
  align-items: center;

  &:hover {
    color: white;
  }
`;

const Link_label = styled.span`
  display: none;

  ${getBP(breakPoints.medium, "min")} {
    display: block;
    margin-left: 1rem;

    &:first-of-type {
      margin: 0;
    }
  }
`;

const Navigation_list = styled.ul``;

const Navigation_item = styled.li`
  margin: 0.1rem;

  &:first-of-type ${Navigation_link} {
    border-style: solid;
    border-width: 1px;
    border-color: ${darkGrey};
  }
`;

export const Sidebar = () => (
  <Wrapper>
    <Sidebar_header>
      <Header_link to="/timer">
        <Link_label>Project</Link_label>T
      </Header_link>
    </Sidebar_header>
    <Sidebar_navigation>
      <Navigation_list>
        <Navigation_item>
          <Navigation_link to="/timer">
            <Icon name="access_time" />
            <Link_label>Timer</Link_label>
          </Navigation_link>
        </Navigation_item>
        <Navigation_item>
          <Navigation_link to="/dashboard" activeClassName="active">
            <Icon name="bar_chart" />
            <Link_label>Dashboard</Link_label>
          </Navigation_link>
        </Navigation_item>
        <Navigation_item>
          <Navigation_link to="/projects" activeClassName="active">
            <Icon name="folder" />
            <Link_label>Projects</Link_label>
          </Navigation_link>
        </Navigation_item>
      </Navigation_list>
    </Sidebar_navigation>
    <Sidebar_profile>
      <ProfileDropdown />
    </Sidebar_profile>
  </Wrapper>
);
