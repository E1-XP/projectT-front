import React, { useState, useCallback } from "react";
import { push } from "connected-react-router";
import styled from "styled-components";

import { getBP } from "../styles/helpers";
import {
  black,
  breakPoints,
  greyWhite,
  greyWhiteDarker,
  red,
  white,
} from "../styles/variables";
import { useStoreDispatch, useStoreSelector } from "./../hooks";
import { initLogOut } from "../actions/global";

const Profile_Link = styled.a`
  cursor: pointer;
  position: relative;
  color: ${greyWhiteDarker};
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

const Icon_Profile = styled.span`
  display: flex;
  background-color: ${red};
  background-image: url(${(props: IconProfileProps) => props.url || "none"});
  background-size: cover;
  width: 1.7rem;
  height: 1.7rem;
  font-size: 0.875rem;
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  font-weight: 700;

  ${getBP(breakPoints.medium)} {
    width: 2.2rem;
    height: 2.2rem;
    font-size: 1.2rem;
  }
`;

const Link_Label = styled.span`
  display: none;

  ${getBP(breakPoints.medium, "min")} {
    display: block;
    margin-right: 1rem;
  }
`;

const Dropdown = styled.ul`
  position: absolute;
  border: 1px solid ${greyWhiteDarker};
  right: -3px;
  width: 18rem;
  background-color: ${white};
  z-index: 100;
  top: -5.938rem;
  right: -18.438rem;
  border-radius: 7px;

  ${getBP(breakPoints.verySmall)} {
    top: -7.938rem;
    right: 3rem;
    font-size: 1.2rem;
  }
`;

const Dropdown_Item = styled.li`
  color: ${black};
  padding: 0.6rem;
  text-align: left;

  ${getBP(breakPoints.verySmall)} {
    padding: 0.8rem;
  }

  &:hover {
    background-color: ${greyWhite};
  }

  &:last-child {
    border-radius: 0px 0px 7px 7px;
  }
`;

const Screen_Blocker = styled.div`
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  background-color: transparent;
  width: 100%;
  height: 100%;
`;

const Dropdown_Item_Border = styled(Dropdown_Item)`
  border-top: 1px solid ${greyWhiteDarker};
`;

const Dropdown_Item_Noclick = styled(Dropdown_Item)`
  cursor: default;

  &:hover {
    background-color: initial;
  }
`;

export const ProfileDropdown = () => {
  const dispatch = useStoreDispatch();
  const logOut = useCallback(() => dispatch(initLogOut()), []);

  const [isOpen, setIsOpen] = useState(false);
  const setIsClosed = useCallback(() => setIsOpen(false), []);
  const setIsOpened = useCallback(() => setIsOpen(true), []);
  const stopEvtPropagation = (e: any) => e.stopPropagation();

  const pushToSettings = (e: any) => {
    stopEvtPropagation(e);

    setIsClosed();
    dispatch(push("/settings"));
  };

  const { username, avatar } = useStoreSelector((state) => state.user.userData);

  const getShortUserName = useCallback(
    (userName: string) =>
      userName.split(" ").length >= 2
        ? userName.split(" ")[0].charAt(0).toUpperCase() +
          userName.split(" ")[1].charAt(0).toUpperCase()
        : userName.toUpperCase().slice(0, 2),
    [username]
  );

  return (
    <>
      <Profile_Link onClick={setIsOpened}>
        <Link_Label>
          {username.length > 12 ? username.substring(0, 10) + "..." : username}
        </Link_Label>
        <Icon_Profile url={avatar || null}>
          {!avatar && getShortUserName(username)}
        </Icon_Profile>
        {isOpen && (
          <Dropdown>
            <Dropdown_Item_Noclick>
              {`${username}'s workspace`}
            </Dropdown_Item_Noclick>
            <Dropdown_Item onClick={pushToSettings}>
              Profile settings
            </Dropdown_Item>
            <Dropdown_Item_Border onClick={logOut}>
              Log out
            </Dropdown_Item_Border>
          </Dropdown>
        )}
      </Profile_Link>
      {isOpen && <Screen_Blocker onClick={setIsClosed} />}
    </>
  );
};
