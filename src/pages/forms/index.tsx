import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import styled from "styled-components";

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

import { greyWhiteDarker, red } from "../../styles/variables";
import { visuallyHidden } from "../../styles/helpers";

export interface Fields {
  email: string;
  username: string;
  password: string;
  passwordConfirm: string;
}

const Heading = styled.h2`
  padding: 2rem 0.2rem;
  text-align: center;
  font-size: 1.7rem;
  font-weight: 500; ;
`;

const HiddenLabel = styled.label`
  ${visuallyHidden}
`;

const Main = styled.main`
  width: 31rem;
  margin: 0 auto;
  margin-top: 6rem;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;

  & > input {
    width: 100%;
  }
`;

const ErrorParagraph = styled.p`
  color: ${red};
  padding: 2rem;
  text-align: center;
`;

export const Form = () => {
  const dispatch = useStoreDispatch();
  const location = useLocation();

  const onSignUpPage = location.pathname.toLowerCase() === "/signup";

  const { isFetching, formMessage } = useStoreSelector((state) => state.global);
  const [wasOnSignUpPage, setState] = useState(onSignUpPage);

  const { SIGN_UP, LOGIN } = validationTypes;
  const schemaType = onSignUpPage ? SIGN_UP : LOGIN;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ resolver: yupResolver(getSchema(schemaType)!) });

  if (wasOnSignUpPage !== onSignUpPage) {
    reset();
    setState(onSignUpPage);
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
    clearFormMessage();
    dispatch(initAuth(fields));
  };

  const welcomeText = onSignUpPage
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
          {onSignUpPage && (
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
          {onSignUpPage && (
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
        </FormContainer>
      </Main>
    </>
  );
};
