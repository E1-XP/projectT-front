import React, { useCallback, useState } from "react";
import styled, { keyframes } from "styled-components";

import { useStoreSelector } from "../../hooks";

import { Icon } from "../../components/icon";
import { Button, Button_success } from "../../components/buttons";
import { Input } from "../../components/inputs";
import placeholderAvatar from "./../../../public/assets/avatar-placeholder.gif";

import {
  breakPoints,
  darkGrey,
  green,
  greyWhite,
  red,
  white,
  whiteGrey,
} from "../../styles/variables";
import { getBP } from "../../styles/helpers";
import { PasswordModal } from "./passwordModal";

const Wrapper = styled.main`
  width: 100%;
  max-width: ${breakPoints.large};
  margin: 1rem auto;
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  padding-top: 0;
  flex-direction: column;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
`;

const Heading = styled.h2`
  font-size: 2.125rem;
  font-weight: 500;
`;

const Main_content = styled.section`
  display: flex;
  margin-top: 4rem;

  ${getBP(breakPoints.medium)} {
    flex-direction: column;
  }
`;

const Button_bar = styled.div`
  display: flex;
`;

const Button_password = styled(Button)`
  background-color: ${darkGrey};
  margin-right: 0.7rem;

  &:hover {
    background-color: #2a2a2a;
  }
`;

const Side = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Settings_section = styled.section`
  flex: 1 1 50%;
`;

const Avatar_settings = styled.label`
  cursor: pointer;
  background-color: ${whiteGrey};
  width: 3.438rem;
  display: flex;
  justify-content: center;
  color: ${darkGrey};
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.7rem;
  box-shadow: -1px 1px 12px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: ${whiteGrey};
  }
`;

const Avatar_section = styled.figure`
  position: relative;
`;

const Avatar_img = styled.img`
  max-width: 11.25rem;
  padding: 0px;
  border: 1px solid ${whiteGrey};
  position: relative;
`;

const rotateAnim = keyframes`
    from{
        transform:rotate(0deg);
    }

    to{
        transform:rotate(360deg);
    }
`;

const Avatar_inProgress = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(150, 150, 150, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;

  > span {
    width: 60px;
    height: 60px;
    border: 2px solid transparent;
    border-top: 2px solid ${white};
    border-bottom: 2px solid ${white};
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    animation: ${rotateAnim} 0.7s linear infinite;

    &:after {
      content: "";
      display: block;
      width: 45px;
      height: 45px;
      border: 2px solid transparent;
      border-left: 2px solid ${white};
      border-right: 2px solid ${white};
      border-radius: 50%;
      animation: ${rotateAnim} 0.9s linear infinite;
    }
  }
`;

const Avatar_remove = styled.a`
  cursor: pointer;
  transition: all 0.2s ease-in;

  &:hover {
    color: ${red};
  }
`;

const Form_wrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 35rem;
  margin: 0 auto;

  ${getBP(breakPoints.medium)} {
    margin-top: 4rem;
  }
`;

const Label = styled.label`
  font-weight: 500;
`;

const Input_label = styled(Input)`
  margin-bottom: 1rem;
`;

const Input_group = styled.div`
  display: flex;
  padding: 0.3rem;
  padding-top: 6rem;
`;

const Label_check = styled.label`
  float: left;
  margin-left: 1rem;
`;

const Icon_button = (props: { name: string }) => (
  <Icon fill={whiteGrey} size="1rem" {...props} />
);

export const Settings = () => {
  const { userData } = useStoreSelector((state) => state.user);

  const [isUploading, setIsUploading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = useCallback(() => setIsModalOpen(false), []);
  const openModal = useCallback(() => setIsModalOpen(true), []);

  const [showOnTitleBar, setShowOnTitleBar] = useState(false);
  const [email, setEmail] = useState(userData.email);
  const [name, setName] = useState(userData.username);

  return (
    <Wrapper>
      <Header>
        <Heading>My Profile</Heading>
        <Button_bar>
          <Button_password onClick={openModal}>
            <Icon_button name="settings" /> Change password
          </Button_password>
          <Button_success
            disabled={
              name.trim() === userData.username &&
              email.trim() === userData.email
            }
          >
            <Icon_button name="done" /> Save
          </Button_success>
        </Button_bar>
      </Header>
      <Main_content>
        <Side>
          <Avatar_section>
            <Avatar_img src={userData.avatar || placeholderAvatar} />
            {isUploading && (
              <Avatar_inProgress>
                <span></span>
              </Avatar_inProgress>
            )}
            <Avatar_settings>
              <Icon name="settings" />
              <form encType="multipart/form-data" name="formAv" id="formAvatar">
                <input
                  className="inputfile-hidden"
                  type="file"
                  name="avatar"
                  onChange={undefined}
                  id="avInput"
                />
              </form>
            </Avatar_settings>
          </Avatar_section>
          {userData.avatar && (
            <Avatar_remove onClick={undefined}>
              <Icon name="close" />
            </Avatar_remove>
          )}
        </Side>
        <Settings_section>
          <Form_wrapper>
            <Label htmlFor="username">Your name</Label>
            <Input_label
              isValid={true}
              name="username"
              value={name}
              onChange={(e: any) => setName(e.target.value)}
            />
            <Label htmlFor="email">Email</Label>
            <Input_label
              isValid={true}
              name="email"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
            />
            <Input_group>
              <Input
                isValid={true}
                type="checkbox"
                name="showtitletimer"
                checked={showOnTitleBar}
                onChange={() => setShowOnTitleBar(!showOnTitleBar)}
              />
              <Label_check htmlFor="showtitletimer">
                <span></span>Show running time on the title bar
              </Label_check>
            </Input_group>
          </Form_wrapper>
        </Settings_section>
      </Main_content>
      <PasswordModal isOpen={isModalOpen} closeModal={closeModal} />
    </Wrapper>
  );
};
