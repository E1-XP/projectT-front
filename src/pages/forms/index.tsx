import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import styled from "styled-components";

import { useStoreDispatch } from "../../hooks";
import { initAuth } from "../../actions/global";

import { NavBar } from "../../components/navbar";
import { Button_action } from "../../components/buttons";
import { visuallyHidden } from "../../styles/helpers";

import { getSchema } from "./validation";
import { greyWhiteDarker, red } from "../../styles/variables";

export interface Fields {
  email: string;
  username: string;
  password: string;
  passwordconfirm: string;
}

type LoginFields = Pick<Fields, "email" | "password">;

interface InputProps {
  valid: boolean;
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

const Input = styled.input`
  padding: 0.8rem;
  margin: 0.5rem 0;
  border: 1.5px solid
    ${(props: InputProps) => (props.valid ? greyWhiteDarker : red)};
  border-radius: 0.3rem;
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

  const [wasOnSignUpPage, setState] = useState(onSignUpPage);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(getSchema(onSignUpPage)) });

  if (wasOnSignUpPage !== onSignUpPage) {
    reset();
    setState(onSignUpPage);
  }

  const errorMessage = Object.values(errors)
    .map(({ message }, i) =>
      i
        ? message
        : message[0].toUpperCase() + message.split("").slice(1).join("")
    )
    .join(", ");

  const onSubmit: SubmitHandler<Fields> = (fields) =>
    dispatch(initAuth(fields));

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
            valid={!errors.email?.message}
            {...register("email")}
          />
          <HiddenLabel htmlFor="email">e-Mail</HiddenLabel>
          {onSignUpPage && (
            <>
              <Input
                type="text"
                id="username"
                placeholder="username"
                valid={!errors.username?.message}
                {...register("username")}
              />
              <HiddenLabel htmlFor="username">Username</HiddenLabel>
            </>
          )}
          <Input
            type="password"
            id="password"
            placeholder="password"
            valid={!errors.password?.message}
            {...register("password")}
          />
          <HiddenLabel htmlFor="password">Password</HiddenLabel>
          {onSignUpPage && (
            <>
              <Input
                type="password"
                id="passwordconfirm"
                placeholder="confirm password"
                valid={!errors.passwordconfirm?.message}
                {...register("passwordconfirm")}
              />
              <HiddenLabel htmlFor="passwordconfirm">
                Confirm password
              </HiddenLabel>
            </>
          )}
          <Button_action style={{ marginTop: "2rem" }}>Send</Button_action>
          <ErrorParagraph>{errorMessage}</ErrorParagraph>
        </FormContainer>
      </Main>
    </>
  );
};
