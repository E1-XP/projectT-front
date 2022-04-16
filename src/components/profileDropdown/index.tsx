import React, { useState, useCallback } from "react";
import { push } from "connected-react-router";

import { useStoreDispatch, useStoreSelector } from "../../hooks";
import { initLogOut } from "../../actions/global";
import {
  Dropdown,
  Dropdown_Item,
  Dropdown_Item_Border,
  Dropdown_Item_Noclick,
  Icon_Profile,
  Link_Label,
  Profile_Link,
  Screen_Blocker,
} from "./style";

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
