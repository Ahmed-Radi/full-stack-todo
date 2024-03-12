import * as yup from "yup"

export const registerSchema = yup
  .object({
    username: yup.string().required("Username is required").min(5, "Username should be at lest 5 character"),
    email: yup.string().required("Email is required").matches(/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,"Not valid email"),
    password: yup.string().required().min(6, "Password should be at lest 6 character"),
  })
  .required()

export const loginSchema = yup
  .object({
    identifier: yup.string().required("Email is required").matches(/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,"Not valid email"),
    password: yup.string().required("Password is required")
  })
  .required()