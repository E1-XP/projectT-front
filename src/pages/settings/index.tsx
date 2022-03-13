import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import uniq from "lodash/fp/uniq";

import { useStoreDispatch, useStoreSelector } from "../../hooks";

import { Avatar } from "./avatar";
import { PasswordModal } from "./passwordModal";
import { Icon } from "../../components/icon";
import { Button, Button_success } from "../../components/buttons";
import { Input } from "../../components/inputs";
import { ComponentLoader } from "../../components/loader";

import { uploadAvatar, removeAvatar, sendUserData } from "../../actions/user";
import { getSchema, validationTypes } from "../forms/validation";

import {
  breakPoints,
  darkGrey,
  red,
  white,
  whiteGrey,
} from "../../styles/variables";
import { getBP } from "../../styles/helpers";
import { Heading as HeadingCSS } from "./../../styles/typography";

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
  ${HeadingCSS}
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

const Form_message = styled.p`
  color: ${red};
  text-align: center;
`;

const Icon_button = (props: { name: string }) => (
  <Icon fill={whiteGrey} size="1rem" {...props} />
);

export const Settings = () => {
  const dispatch = useStoreDispatch();
  const { userData } = useStoreSelector((state) => state.user);
  const isFetching = useStoreSelector((state) => state.global.isFetching);

  const [isUploading, setIsUploading] = useState(false);
  const uploadCompleted = useCallback(() => setIsUploading(false), []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = useCallback(() => setIsModalOpen(false), []);
  const openModal = useCallback(() => setIsModalOpen(true), []);

  const [shouldShowTimerOnTitle, setShouldShowTimerOnTitle] = useState(
    userData.settings.shouldShowTimerOnTitle
  );
  const [email, setEmail] = useState(userData.email);
  const [username, setUsername] = useState(userData.username);

  const [formMessage, setFormMessage] = useState("");
  const [isFieldValid, setIsFieldValid] = useState([true, true]);

  useEffect(() => {
    if (!isFetching && isUploading) {
      const avatarInput = document.getElementById("avInput") as any;
      const avatarImg = document.getElementById("avatar") as any;

      if (avatarInput) avatarInput.value = null;
      if (avatarImg && avatarImg.complete) uploadCompleted();
    }
  }, [isFetching, isUploading]);

  const uploadImage = useCallback(() => {
    const form = document.querySelector("#formAvatar") as HTMLFormElement;
    if (!form) return;

    const data = new FormData(form);

    setIsUploading(true);

    dispatch(uploadAvatar(data));
  }, []);

  const onAvatarRemove = useCallback(() => {
    dispatch(removeAvatar());
  }, []);

  const saveUserData = useCallback(() => {
    const messages: string[] = [];
    const fields = isFieldValid.map(() => true);
    const getMessage = () => uniq(messages).join(", ");

    setIsFieldValid([true, true]);

    try {
      getSchema(validationTypes.USER_NAME)!.validateSync({
        username,
      });

      setFormMessage("");
    } catch (e: any) {
      if (e.message) {
        messages.push(e.message);
        setFormMessage(getMessage());

        fields[0] = false;
        setIsFieldValid(fields);
      }
    }

    try {
      getSchema(validationTypes.EMAIL)!.validateSync({
        email,
      });

      setFormMessage("");
    } catch (e: any) {
      if (e.message) {
        messages.push(e.message);
        setFormMessage(getMessage());

        fields[1] = false;
        setIsFieldValid(fields);
      }
    }

    if (!messages.length && fields.every((f) => !!f)) {
      dispatch(
        sendUserData({
          email,
          username,
          settings: {
            shouldShowTimerOnTitle,
          },
        })
      );
    }
  }, [email, username, formMessage, isFieldValid, shouldShowTimerOnTitle]);

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
              username.trim() === userData.username &&
              email.trim() === userData.email &&
              shouldShowTimerOnTitle ===
                userData.settings.shouldShowTimerOnTitle
            }
            onClick={saveUserData}
          >
            <Icon_button name="done" /> Save
          </Button_success>
        </Button_bar>
      </Header>
      <Main_content>
        <Side>
          <Avatar
            userData={userData}
            isUploading={isUploading}
            uploadImage={uploadImage}
            uploadCompleted={uploadCompleted}
            onAvatarRemove={onAvatarRemove}
          />
        </Side>
        <Settings_section>
          <ComponentLoader
            isVisible={isFetching}
            shouldShowSpinner={isFetching}
          />
          <Form_wrapper>
            <Label htmlFor="username">Your name</Label>
            <Input_label
              isValid={isFieldValid[0]}
              name="username"
              value={username}
              onChange={(e: any) => setUsername(e.target.value)}
            />
            <Label htmlFor="email">Email</Label>
            <Input_label
              isValid={isFieldValid[1]}
              name="email"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
            />
            <Form_message>{formMessage}</Form_message>
            <Input_group>
              <Input
                isValid={true}
                type="checkbox"
                name="showtitletimer"
                checked={shouldShowTimerOnTitle}
                onChange={() =>
                  setShouldShowTimerOnTitle(!shouldShowTimerOnTitle)
                }
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

export default Settings;
