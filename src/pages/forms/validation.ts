import * as yup from "yup";

export enum validationTypes {
  SIGN_UP = "SIGN_UP",
  LOGIN = "LOGIN",
  PASS_CHANGE = "PASS_CHANGE",
}

export interface SignUpFields {
  email: string;
  username: string;
  password: string;
  passwordConfirm: string;
}

export type Loginfields = Pick<SignUpFields, "email" | "password">;
export type PassChangeFields = Pick<
  SignUpFields,
  "password" | "passwordConfirm"
>;

export const getSchema = (actionType: validationTypes) => {
  const email = yup.string().required().email();
  const username = yup
    .string()
    .min(2, "username must have at least 2 characters");

  const passwordHint =
    "password must have one number, one capitalized and lower case letter";

  const password = yup
    .string()
    .required()
    .min(8, "password must have at least 8 characters")
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, passwordHint);

  const passwordConfirm = yup
    .string()
    .required("please confirm your password")
    .test("password-comparison", "passwords are different", function (value) {
      return value === this.parent.password;
    });

  const { SIGN_UP, LOGIN, PASS_CHANGE } = validationTypes;

  switch (actionType) {
    case SIGN_UP:
      return yup.object({
        email,
        username,
        password,
        passwordConfirm,
      });
    case LOGIN:
      return yup.object({ email, password });
    case PASS_CHANGE:
      return yup.object({ password, passwordConfirm });
  }
};
