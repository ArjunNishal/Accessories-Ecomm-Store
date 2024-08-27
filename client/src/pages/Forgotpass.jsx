import React, { useState } from "react";
import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { axiosInstance, renderUrl } from "../config";


// import { Link, useNavigate } from "react-router-dom";

const forgotschema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9]+[a-zA-Z0-9._-]*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?=[^.]*\.[a-zA-Z]{2,})*$/,
      "Invalid email format"
    ),
});

const initialValues = {
  email: "",
};

const Forgotpass = () => {
  const [emailsent, setEmailsent] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(null);
  // const navigate = useNavigate();

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: initialValues,
      validationSchema: forgotschema,
      onSubmit: async (values) => {
        console.log("values", values);
        setLoading(true);
        try {
          const res = await axiosInstance.post(
            "user/resetpassword",
            values
          );
          console.log(res, "res");
          if (res.status === 200) {
            setMessage(
              `Reset your password using the link shared on your mail i.e., ${values.email}`
            );
            setEmailsent(true);
          }
        } catch (error) {
          console.log(error);
          if (error.response && error.response.status === 404) {
            setMessage(error.response.data.message);
          } else {
            setMessage(error.response.data.message);
          }
        }
        setLoading(false);
      },
    });
  console.log(errors, "error");

  return (
    <>
      <Header />
      <div className="forgot-pass d-flex justify-content-center align-items-center  container-fluid">
        <div className="loginmain2 m-5 rounded bg-white">
          <div className="loginrow p-5">
            <form
              className="loginform d-flex flex-column align-items-center"
              onSubmit={handleSubmit}
            >
              <div>
                <i class="exclamation fa-sharp fa-solid fa-circle-exclamation"></i>
              </div>
              <h3>Forgot password</h3>
              {loading ? (
                <div>
                  <div className="d-flex justify-content-center">
                    <div className="spinner-border text-success" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                  <div>
                    <p>Sending Reset Link</p>
                  </div>
                </div>
              ) : (
                <div>
                  <p>
                    Enter your email and we"ll send you a link to reset your
                    password.
                  </p>
                  <div className="username mb-3 col-12">
                    <label htmlFor="exampleInputEmail1" className="form-label">
                      Email address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="exampleInputEmail1"
                      aria-describedby="emailHelp"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                    />
                    {errors.email && touched.email ? (
                      <p className="form-error">{errors.email}</p>
                    ) : null}
                  </div>

                  {message && <div className="text-center">{message}</div>}
                  {emailsent ? (
                    <div className=" d-flex flex-column align-items-center mt-3">
                      <p>If you did'nt get an Email, resend Link </p>
                      <button className="btn btn-danger" type="submit">
                        Resend
                      </button>
                    </div>
                  ) : (
                    <div className=" text-center">
                      <button className="btn btn-danger" type="submit">
                        Send Email
                      </button>
                    </div>
                  )}
                  <div className="text-center mt-2">
                    <Link to="/login-register">login</Link>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Forgotpass;

