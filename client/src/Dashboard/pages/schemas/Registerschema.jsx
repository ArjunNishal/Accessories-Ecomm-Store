import * as Yup from "yup";
export const registerschema = Yup.object({
  name: Yup.string()
    .min(2)
    .max(25)
    .required("Please enter Username")
    .matches(
      /^[a-zA-Z0-9._]+$/,
      "Username should only contain letters, numbers, dots, and hyphens."
    ),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9]+[a-zA-Z0-9._-]*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?=[^.]*\.[a-zA-Z]{2,})*$/,
      "Invalid email format"
    ),
  mobileno: Yup.string()
    .matches(/^\d{10}$/, "Mobile number should be a 10 digit number.")
    .required("Mobile number is required."),
  password: Yup.string()
    .matches(/^[^\s]+$/, "Password should not have spaces")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
      "Password must contain at least 6 characters, one letter and one number"
    )
    .required("Password is required"),
  role: Yup.string().required("Please select a role"),
});
