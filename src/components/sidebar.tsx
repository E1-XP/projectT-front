import React from "react";
import { Link, NavLink } from "react-router-dom";
import styled from "styled-components";

import { ProfileDropdown } from "./profileDropdown";
import { Icon } from "./../components/icon";
import { getBP } from "../styles/helpers";
import { breakPoints, darkGrey, greyWhite, white } from "../styles/variables";

const Wrapper = styled.aside`
  color: ${white};
  background-color: ${darkGrey};
  box-shadow: 4px 0px 5px rgba(0, 0, 0, 0.2);
  max-width: 3.25rem;
  padding: 1rem;
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  position: fixed;
  z-index: 999;
  top: 0;

  ${getBP(breakPoints.medium, "min")} {
    max-width: 15.62rem;
  }

  ${getBP(breakPoints.verySmall)} {
    flex-direction: row;
    justify-content: space-evenly;
    max-width: initial;
    height: initial;
    width: 100%;
    bottom: 0;
    top: initial;
    padding-top: 1rem;
  }
`;

const Sidebar_profile = styled.section`
  ${getBP(breakPoints.verySmall, "min")} {
    margin-top: auto;
  }
`;

const Sidebar_header = styled.header`
  ${getBP(breakPoints.verySmall)} {
    font-size: 1.4rem;
  }
`;

const Sidebar_navigation = styled.nav`
  ${getBP(breakPoints.verySmall, "min")} {
    margin-top: 1rem;
  }
`;

const Navigation_link = styled(NavLink)`
  color: ${greyWhite};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.3rem;
  border-radius: 7px;
  position: relative;

  ${getBP(breakPoints.medium, "min")} {
    justify-content: initial;
  }

  &:hover {
    color: ${white};
  }

  &.active {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const Header = styled.h1`
  font-size: inherit;
  font-family: "Open Sans", sans-serif;
`;

const Header_link = styled(Link)`
  color: ${greyWhite};
  display: flex;
  align-items: center;

  &:hover {
    color: ${white};
  }
`;

const Link_label = styled.span`
  display: none;

  ${getBP(breakPoints.verySmall)} {
    display: block;
    margin-left: 1rem;

    &:first-of-type {
      margin: 0;
    }
  }

  ${getBP(breakPoints.medium, "min")} {
    display: block;
    margin-left: 1rem;

    &:first-of-type {
      margin: 0;
    }
  }
`;

const Navigation_list = styled.ul`
  ${getBP(breakPoints.verySmall)} {
    display: flex;
  }
`;

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
      <Header>
        <Header_link to="/timer">
          <Link_label>Project</Link_label>T
        </Header_link>
      </Header>
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
          <Navigation_link to="/reports" activeClassName="active">
            <Icon name="bar_chart" />
            <Link_label>Reports</Link_label>
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
