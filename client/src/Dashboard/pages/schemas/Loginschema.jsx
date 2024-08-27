import * as Yup from "yup";
export const loginschema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9]+[a-zA-Z0-9._-]*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?=[^.]*\.[a-zA-Z]{2,})*$/,
      "Invalid email format"
    ),
  password: Yup.string()
    .matches(/^[^\s]+$/, "Password should not have spaces")
    .required("Password is required"),
});
