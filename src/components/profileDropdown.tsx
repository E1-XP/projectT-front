import React, { useState } from "react";
import { push } from "connected-react-router";

import styled from "styled-components";
import { getBP } from "../styles/helpers";
import { breakPoints, red } from "../styles/variables";
import { useStoreSelector } from "./../hooks";

const Profile_link = styled.a`
  cursor: pointer;
  position: relative;
  color: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.3rem;
  border-radius: 50%;

  ${getBP(breakPoints.medium, "min")} {
    justify-content: initial;
  }
`;

interface IconProfileProps {
  url: string | null;
}

const Icon_profile = styled.span`
  display: flex;
  background-color: ${red};
  background-image: url(${(props: IconProfileProps) => props.url || "none"});
  background-size: cover;
  width: 1.7rem;
  height: 1.7rem;
  font-size: 14px;
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  font-weight: 700;
`;

const Link_label = styled.span`
  display: none;

  ${getBP(breakPoints.medium, "min")} {
    display: block;
    margin-right: 1rem;
  }
`;

const Dropdown = styled.ul`
  position: absolute;
  border: 1px solid #ccc;
  right: -3px;
  width: 18rem;
  background-color: white;
  z-index: 100;
  top: -95px;
  right: -295px;
  border-radius: 7px;
`;

const Dropdown_item = styled.li`
  color: black;
  padding: 0.6rem;
  text-align: left;

  &:hover {
    background-color: #ddd;
  }

  &:last-child {
    border-radius: 0px 0px 7px 7px;
  }
`;

const Screen_blocker = styled.div`
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  background-color: transparent;
  width: 100%;
  height: 100%;
`;

const Dropdown_item_border = styled(Dropdown_item)`
  border-top: 1px solid #ddd;
`;

const Dropdown_item_noclick = styled(Dropdown_item)`
  cursor: default;

  &:hover {
    background-color: initial;
  }
`;

const getShortUserName = (userName: string) =>
  userName.split(" ").length >= 2
    ? userName.split(" ")[0].charAt(0).toUpperCase() +
      userName.split(" ")[1].charAt(0).toUpperCase()
    : userName.toUpperCase().slice(0, 2);

export const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const username = useStoreSelector((state) => state.user.userData.username);

  return (
    <>
      <Profile_link onClick={() => setIsOpen(true)}>
        <Link_label>
          {username.length > 12 ? username.substring(0, 10) + "..." : username}
        </Link_label>
        <Icon_profile url={null}>{getShortUserName(username)}</Icon_profile>
        {isOpen && (
          <Dropdown>
            <Dropdown_item_noclick className="js-noclick">
              {`${username}'s workspace`}
            </Dropdown_item_noclick>
            <Dropdown_item onClick={() => push("/settings")}>
              Profile settings
            </Dropdown_item>
            <Dropdown_item_border>Log out</Dropdown_item_border>
          </Dropdown>
        )}
      </Profile_link>
      {isOpen && <Screen_blocker onClick={() => setIsOpen(false)} />}
    </>
  );
};
