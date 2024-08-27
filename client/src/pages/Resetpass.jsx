import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { axiosInstance, renderUrl } from "../config";


const resetschema = Yup.object().shape({
  password: Yup.string()
    .matches(/^[^\s]+$/, "Password should not have spaces")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
      "Password must contain at least 6 characters, one letter and one number"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password"), null], "Password must match"),
});

const initialValues = {
  password: "",
  confirmPassword: "",
};

const ResetPass = () => {
  const [email, setEmail] = useState("");
  const { id, token } = useParams();

  const [error, setError] = useState("");

  useEffect(() => {
    const decodedToken = jwt_decode(token);
    setEmail(decodedToken.email);
  }, [token]);

  console.log(id, token);
  const navigate = useNavigate();

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: initialValues,
      validationSchema: resetschema,
      onSubmit: async (values) => {
        console.log("values", values);
        try {
          const res = await axiosInstance.put(
            `user/resetpassword/${id}/${token}`,
            values
          );
          Swal.fire({
            icon: "success",
            title: "Password reset successfully.",
          }).then(() => {
            navigate("/"); // Redirect to home page
          });
        } catch (error) {
          console.log(error, "error");
          setError(error.res.data.message);
        }
      },
    });
  console.log(errors, "error");

  

  return (
    <div>
      <Header />
      <div className="forgot-pass d-flex justify-content-center align-items-center  container-fluid">
        <div className="loginmain rounded m-2">
          <form className="loginform p-4" onSubmit={handleSubmit}>
            <h3 className="text-center">Reset Password</h3>
            <hr />
            <p>Enter a new password for - </p>
            <p>{email}</p>
            <div className="username mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                New Password
              </label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                minLength={6}
                maxLength={16}
                required
                placeholder="Enter 6-16 characters"
              />
              {errors.password && touched.password ? (
                <p className="form-error">{errors.password}</p>
              ) : null}
            </div>
            <div className="username mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Confirm new Password
              </label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword12"
                name="confirmPassword"
                minLength={6}
                maxLength={16}
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                placeholder="Confirm Password"
              />
              {errors.confirmPassword && touched.confirmPassword ? (
                <p className="form-error">{errors.confirmPassword}</p>
              ) : null}
            </div>
            {error && <p>{error}</p>}
            <button className="btn btn-danger col-12" type="submit">
              Reset Password
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPass;
