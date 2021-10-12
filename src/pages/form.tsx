import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";

import { useAppDispatch } from "./../hooks";
import { initAuth } from "./../actions/global";

export interface Fields {
  [key: string]: string;
}

export const Form = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const onSignUpPage = location.pathname.toLowerCase() === "/signup";

  const { register, handleSubmit } = useForm();

  const onSubmit: SubmitHandler<Fields> = (fields) => {
    dispatch(initAuth(fields));
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            type="text"
            id="email"
            placeholder="email"
            {...register("email")}
          />
          <label htmlFor="email">E-mail</label>
        </div>
        {onSignUpPage && (
          <div>
            <input
              type="text"
              id="username"
              placeholder="username"
              {...register("username")}
            />
            <label htmlFor="username">Username</label>
          </div>
        )}
        <div>
          <input
            type="password"
            id="password"
            placeholder="password"
            {...register("password")}
          />
          <label htmlFor="password">Password</label>
        </div>

        {onSignUpPage && (
          <div>
            <input
              type="password"
              id="passwordconfirm"
              placeholder="confirm password"
              {...register("passwordconfirm")}
            />
            <label htmlFor="passwordconfirm">Confirm password</label>
          </div>
        )}
        <input type="submit" value="Send" />
      </form>
    </div>
  );
};
