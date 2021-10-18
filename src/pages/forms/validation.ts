import * as yup from "yup";

export const getSchema = (onSignUpPage: boolean) => {
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

  const passwordconfirm = yup
    .string()
    .required("please confirm your pasword")
    .test("password-comparison", "passwords are different", function (value) {
      return value === this.parent.password;
    });

  const schemaObject = onSignUpPage
    ? { email, username, password, passwordconfirm }
    : { email, password };

  return yup.object<any>(schemaObject);
};
