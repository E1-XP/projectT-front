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

export const USERNAME_TOO_SHORT = "Username must have at least 2 characters";
export const PASSWORD_TOO_SHORT = "Password must have at least 8 characters";
export const PASSWORD_HINT =
  "Password must have one number, one capitalized and lower case letter";
export const CONFIRMATION_MISSING = "Please confirm your password";
export const PASSWORD_NOT_CHANGED = "Please provide different password";
export const PASSWORD_COMPARISION_FAILED = "Passwords are different";
export const EMPTY_PASSWORD_FIELD = "Please fill password fields";

export const FORM_MESSAGE_ERROR = "Wrong password provided";
export const FORM_MESSAGE_SUCCESS = "Password succesfully changed";

export type Loginfields = Pick<SignUpFields, "email" | "password">;
export type PassChangeFields = Pick<
  SignUpFields,
  "password" | "passwordConfirm"
>;

export const getSchema = (actionType: validationTypes) => {
  const email = yup.string().required().email();
  const username = yup.string().min(2, USERNAME_TOO_SHORT);

  const password = yup
    .string()
    .required(EMPTY_PASSWORD_FIELD)
    .min(8, PASSWORD_TOO_SHORT)
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, PASSWORD_HINT);

  const passwordConfirm = yup
    .string()
    .required(CONFIRMATION_MISSING)
    .test("password-comparison", PASSWORD_COMPARISION_FAILED, function (value) {
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
