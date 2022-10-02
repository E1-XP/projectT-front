import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useStoreDispatch, useStoreSelector } from "../../hooks";
import { initAuth, setFormMessage, setIsFetching } from "../../actions/global";

import { NavBar } from "../../components/navbar";
import { Button_Action } from "../../components/buttons";
import { Input } from "../../components/inputs";

import {
  CONFIRMATION_MISSING,
  EMPTY_PASSWORD_FIELD,
  getSchema,
  validationTypes,
} from "./validation";

import {
  Main,
  Heading,
  FormContainer,
  HiddenLabel,
  ErrorParagraph,
  InfoParagraph,
} from "./style";

export interface Fields {
  email: string;
  username: string;
  password: string;
  passwordConfirm: string;
}

export const Form = () => {
  const dispatch = useStoreDispatch();
  const location = useLocation();

  const isOnSignUpPage = location.pathname.toLowerCase() === "/signup";

  const { isFetching, formMessage } = useStoreSelector((state) => state.global);
  const [wasOnSignUpPage, setState] = useState(isOnSignUpPage);

  const { SIGN_UP, LOGIN } = validationTypes;
  const schemaType = isOnSignUpPage ? SIGN_UP : LOGIN;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ resolver: yupResolver(getSchema(schemaType)!) });

  if (wasOnSignUpPage !== isOnSignUpPage) {
    reset();
    setState(isOnSignUpPage);
  }

  useEffect(() => {
    dispatch(setIsFetching(false));
  }, []);

  const clearFormMessage = () => dispatch(setFormMessage(["", true]));

  useEffect(() => {
    !isSubmitting && formMessage[0] && clearFormMessage();
  }, [isSubmitting]);

  const formatErrorMessage = () => {
    if (!formMessage[0] && !Object.values(errors).some((v) => !!v)) return "";

    return formMessage[0]
      ? [formMessage[0][0].toUpperCase() + formMessage[0].slice(1)]
      : Object.entries(errors)
          .map(([key, { message }], i, errorsArr) => {
            const m = message.toLowerCase();
            const keys = Object.keys(errors);

            const wrongPasswordSoDontShowPassConfirmMsg =
              (keys.includes("password") &&
                keys.includes("passwordConfirm") &&
                message === CONFIRMATION_MISSING) ||
              (errorsArr.find(
                ([k, e]: [string, { message: string }]) =>
                  e.message === EMPTY_PASSWORD_FIELD
              ) &&
                message === CONFIRMATION_MISSING);

            if (wrongPasswordSoDontShowPassConfirmMsg) return "";

            return i ? m : m[0].toUpperCase() + m.split("").slice(1).join("");
          })
          .filter(Boolean)
          .join(", ")
          .concat(".");
  };

  const onSubmit: SubmitHandler<Fields> = (fields) => {
    const trimmedFields = Object.entries(fields).reduce((acc, [key, val]) => {
      acc[key as keyof Fields] = val.trim();
      return acc;
    }, {} as Fields);

    clearFormMessage();
    dispatch(initAuth(trimmedFields));
  };

  const welcomeText = isOnSignUpPage
    ? `Sign Up to enter our App.`
    : `Log in to get access to your account.`;

  return (
    <>
      <NavBar />
      <Main>
        <Heading>{welcomeText}</Heading>
        <FormContainer onSubmit={handleSubmit(onSubmit)}>
          <Input
            type="text"
            id="email"
            placeholder="email"
            isValid={!errors.email?.message}
            defaultValue=""
            {...register("email", {
              onChange: clearFormMessage,
            })}
          />
          <HiddenLabel htmlFor="email">e-Mail</HiddenLabel>
          {isOnSignUpPage && (
            <>
              <Input
                type="text"
                id="username"
                placeholder="username"
                isValid={!errors.username?.message}
                defaultValue=""
                {...register("username", {
                  onChange: clearFormMessage,
                })}
              />
              <HiddenLabel htmlFor="username">Username</HiddenLabel>
            </>
          )}
          <Input
            type="password"
            id="password"
            placeholder="password"
            isValid={!errors.password?.message}
            defaultValue=""
            {...register("password", {
              onChange: clearFormMessage,
            })}
          />
          <HiddenLabel htmlFor="password">Password</HiddenLabel>
          {isOnSignUpPage && (
            <>
              <Input
                type="password"
                id="passwordConfirm"
                placeholder="confirm password"
                isValid={!errors.passwordConfirm?.message}
                defaultValue=""
                {...register("passwordConfirm", {
                  onChange: clearFormMessage,
                })}
              />
              <HiddenLabel htmlFor="passwordConfirm">
                Confirm password
              </HiddenLabel>
            </>
          )}
          <Button_Action style={{ marginTop: "2rem" }} isLoading={isFetching}>
            Send
          </Button_Action>
          <ErrorParagraph>{formatErrorMessage()}</ErrorParagraph>
          {!isOnSignUpPage && (
            <InfoParagraph>
              Test account credentials, login: admin@admin.com, password:
              Admin123
            </InfoParagraph>
          )}
        </FormContainer>
      </Main>
    </>
  );
};
